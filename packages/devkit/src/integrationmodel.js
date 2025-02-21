// eslint-disable-next-line no-unused-vars, import/named
import Core from "./core.src";
import Image from "./image";
import Listeners from "./listeners";
import Util from "./util";
import Configuration from "./configuration";
import ServiceProvider from "./serviceprovider";
import Telemeter from "./telemeter";
import warnIcon from "../styles/icons/general/warn_icon.svg"; //eslint-disable-line

/**
 * @typedef {Object} IntegrationModelProperties
 * @property {string} configurationService - Configuration service path.
 * This parameter is needed to determine all services paths.
 * @property {HTMLElement} integrationModelProperties.target - HTML target.
 * @property {string} integrationModelProperties.scriptName - Integration script name.
 * Usually the name of the integration script.
 * @property {Object} integrationModelProperties.environment - integration environment properties.
 * @property {Object} [integrationModelProperties.callbackMethodArguments] - object containing
 * callback method arguments.
 * @property {string} [integrationModelProperties.version] - integration version number.
 * @property {Object} [integrationModelProperties.editorObject] - object containing
 * the integration editor instance.
 * @property {boolean} [integrationModelProperties.rtl] - true if the editor is in RTL mode.
 * false otherwise.
 * @property {ServiceProviderProperties} [integrationModelProperties.serviceProviderProperties]
 * - The service parameters.
 * @property {Object} [integrationModelProperties.integrationParameters]
 * - Overwritten integration parameters.
 */

export default class IntegrationModel {
  /**
   * @classdesc
   * This class represents an integration model, allowing the integration script to
   * communicate with Core class. Each integration must extend this class.
   * @constructs
   * @param {IntegrationModelProperties} integrationModelProperties
   */
  constructor(integrationModelProperties) {
    /**
     * Language. Needed for accessibility and locales. English by default.
     */
    this.language = "en";

    /**
     * Service parameters
     * @type {ServiceProviderProperties}
     */
    this.serviceProviderProperties = integrationModelProperties.serviceProviderProperties ?? {};

    /**
     * Configuration service path. The integration service is needed by Core class to
     * load all the backend configuration into the frontend and also to create the paths
     * of all services (all services lives in the same route). Mandatory property.
     */
    this.configurationService = "";
    if ("configurationService" in integrationModelProperties) {
      this.serviceProviderProperties.URI = integrationModelProperties.configurationService;
      console.warn("Deprecated property configurationService. Use serviceParameters on instead.", [
        integrationModelProperties.configurationService,
      ]);
    }

    /**
     * Plugin version. Needed to stats and caching.
     * @type {string}
     */
    this.version = "version" in integrationModelProperties ? integrationModelProperties.version : "";

    /**
     * DOM target in which the plugin works. Needed to associate events, insert formulas, etc.
     * Mandatory property.
     */
    this.target = null;
    if ("target" in integrationModelProperties) {
      this.target = integrationModelProperties.target;
    } else {
      throw new Error("IntegrationModel constructor error: target property missed.");
    }

    /**
     * Integration script name. Needed to know the plugin path.
     */
    if ("scriptName" in integrationModelProperties) {
      this.scriptName = integrationModelProperties.scriptName;
    }

    /**
     * Object containing the arguments needed by the callback function.
     */
    this.callbackMethodArguments = integrationModelProperties.callbackMethodArguments ?? {};

    /**
     * Contains information about the integration environment:
     * like the name of the editor, the version, etc.
     */
    this.environment = integrationModelProperties.environment ?? {};

    /**
     * Indicates if the DOM target is - or not - and iframe.
     */
    this.isIframe = false;
    if (this.target != null) {
      this.isIframe = this.target.tagName.toUpperCase() === "IFRAME";
    }

    /**
     * Instance of the integration editor object. Usually the entry point to access the API
     * of a HTML editor.
     */
    this.editorObject = integrationModelProperties.editorObject ?? null;

    /**
     * Specifies if the direction of the text is RTL. false by default.
     */
    this.rtl = integrationModelProperties.rtl ?? false;

    /**
     * Specifies if the integration model exposes the locale strings. false by default.
     */
    this.managesLanguage = integrationModelProperties.managesLanguage ?? false;

    /**
     * Specify if editor will open in hand mode only
     */
    this.forcedHandMode = integrationModelProperties?.integrationParameters?.forcedHandMode ?? false;

    /**
     * Indicates if an image is selected. Needed to resize the image to the original size in case
     * the image is resized.
     * @type {boolean}
     */
    this.temporalImageResizing = false;

    /**
     * The Core class instance associated to the integration model.
     * @type {Core}
     */
    this.core = null;

    /**
     * Integration model listeners.
     * @type {Listeners}
     */
    this.listeners = new Listeners();

    // Parameters overwrite.
    if ("integrationParameters" in integrationModelProperties) {
      IntegrationModel.integrationParameters.forEach((parameter) => {
        if (parameter in integrationModelProperties.integrationParameters) {
          // Don't add empty parameters.
          const value = integrationModelProperties.integrationParameters[parameter];
          if (Object.keys(value).length !== 0) {
            this[parameter] = value;
          }
        }
      });
    }
  }

  /**
   * Init function. Usually called from the integration side once the core.js file is loaded.
   */
  init() {
    // Check if language is an object and select the property necessary
    this.language = this.getLanguage();

    // We need to wait until Core class is loaded ('onLoad' event) before
    // call the callback method.
    const listener = Listeners.newListener("onLoad", () => {
      this.callbackFunction(this.callbackMethodArguments);
    });

    // Backwards compatibility.
    if (this.serviceProviderProperties.URI.indexOf("configuration") !== -1) {
      const uri = this.serviceProviderProperties.URI;
      const server = ServiceProvider.getServerLanguageFromService(uri);
      this.serviceProviderProperties.server = server;
      const configurationIndex = this.serviceProviderProperties.URI.indexOf("configuration");
      const subsTring = this.serviceProviderProperties.URI.substring(0, configurationIndex);
      this.serviceProviderProperties.URI = subsTring;
    }

    let serviceParametersURI = this.serviceProviderProperties.URI;
    serviceParametersURI =
      serviceParametersURI.indexOf("/") === 0 || serviceParametersURI.indexOf("http") === 0
        ? serviceParametersURI
        : Util.concatenateUrl(this.getPath(), serviceParametersURI);

    this.serviceProviderProperties.URI = serviceParametersURI;

    const coreProperties = {};
    coreProperties.serviceProviderProperties = this.serviceProviderProperties;

    this.setCore(new Core(coreProperties));
    this.core.addListener(listener);
    this.core.language = this.language;

    // Initializing Core class.
    this.core.init();
    // TODO: Move to Core constructor.
    this.core.setEnvironment(this.environment);

    // No internet connection modal.
    let attributes = {};
    attributes.class = attributes.id = "wrs_modal_offline";
    this.offlineModal = Util.createElement("div", attributes);

    attributes = {};
    attributes.class = "wrs_modal_content_offline";
    this.offlineModalContent = Util.createElement("div", attributes);

    attributes = {};
    attributes.class = "wrs_modal_offline_close";
    this.offlineModalClose = Util.createElement("span", attributes);
    this.offlineModalClose.innerHTML = "&times;";

    attributes = {};
    attributes.class = "wrs_modal_offline_warn";
    this.offlineModalWarn = Util.createElement("span", attributes);
    const generalStyle = `background-image: url(data:image/svg+xml;base64,${window.btoa(warnIcon)})`;
    this.offlineModalWarn.setAttribute("style", generalStyle);

    attributes = {};
    attributes.class = "wrs_modal_offline_text_container";
    this.offlineModalMessage = Util.createElement("div", attributes);

    attributes = {};
    attributes.class = "wrs_modal_offline_text_warn";
    this.offlineModalMessage1 = Util.createElement("p", attributes);
    this.offlineModalMessage1.innerHTML = "You are not online!";

    attributes = {};
    attributes.class = "wrs_modal_offline_text";
    this.offlineModalMessage2 = Util.createElement("p", attributes);
    this.offlineModalMessage2.innerHTML = `Thank you for using MathType. We have detected you are disconnected from the network. We remind you that you'll need to be connected to use MathType. <br /><br />Please refresh the page if this message continues appearing.`;

    // Append offline modal elements
    this.offlineModalContent.appendChild(this.offlineModalClose);
    this.offlineModalMessage.appendChild(this.offlineModalMessage1);
    this.offlineModalMessage.appendChild(this.offlineModalMessage2);
    this.offlineModalContent.appendChild(this.offlineModalMessage);
    this.offlineModalContent.appendChild(this.offlineModalWarn);
    this.offlineModal.appendChild(this.offlineModalContent);
    document.body.appendChild(this.offlineModal);

    const modal = document.getElementById("wrs_modal_offline");
    this.offlineModalClose.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Store editor name for telemetry purposes.
    let editorName = this.environment.editor;
    editorName = editorName.slice(0, -1); // Remove version number from editors
    if (editorName.includes("TinyMCE")) editorName = "TinyMCE"; // Remove version from Tinymce editor.
    if (editorName.includes("Generic")) editorName = "Generic"; // Remove version from Generic editor.
    let solutionTelemeter = editorName;

    // If moodle, add information to hosts and solution.
    const isMoodle = !!(typeof M === "object" && M !== null);
    let lms;

    if (isMoodle) {
      solutionTelemeter = "Moodle";
      lms = {
        nam: "moodle",
        fam: "lms",
        ver: this.environment.moodleVersion,
        category: this.environment.moodleCourseCategory,
        course: this.environment.moodleCourseName,
      };
      if (!editorName.includes("TinyMCE")) {
        editorName = "Atto";
      }
    }

    // Get the OS and its version.
    const OSData = this.getOS();

    // Get the broswer and its version.
    const broswerData = this.getBrowser();

    // Create list of hosts to send to telemetry.
    let hosts = [
      {
        nam: broswerData.detectedBrowser,
        fam: "browser",
        ver: broswerData.versionBrowser,
      },
      {
        nam: editorName.toLowerCase(),
        fam: "html-editor",
        ver: this.environment.editorVersion,
      },
      {
        nam: OSData.detectedOS,
        fam: "os",
        ver: OSData.versionOS,
      },
      {
        nam: window.location.hostname,
        fam: "domain",
      },
      lms,
    ];

    // Filter hosts to remove empty objects and empty keys.
    hosts = hosts.filter((element) => {
      if (element) Object.keys(element).forEach((key) => (element[key] === "unknown" ? delete element[key] : {}));
      return element !== undefined;
    });

    // Initialize telemeter
    Telemeter.init({
      solution: {
        name: `MathType for ${solutionTelemeter}`,
        version: this.version,
      },
      hosts,
      config: {
        test: false, // True to use the staging Telemetry endpoint instead of the production one.
        debug: false, // True to show more information about Telemeter's execution and use dev-tools.
        dry_run: false, // True to skip sending data to the Telemetry endpoint (for example for unit tests).
        api_key: "eda2ce9b-0e8a-46f2-acdd-c228a615314e", // to auth against Telemetry. Data team is the responsible of providing it.
      },
      url: undefined,
    });
  }

  /**
   * Returns the Browser name and its version.
   * @return {array} - detectedBrowser = Operating System name.
   *                   versionBrowser = Operating System version.
   */
  getBrowser() {
    // default value for OS just in case nothing is detected
    let detectedBrowser = "unknown";
    let versionBrowser = "unknown";

    const userAgent = window.navigator.userAgent;

    if (/Brave/.test(userAgent)) {
      detectedBrowser = "brave";
      if (userAgent.indexOf("Brave/")) {
        const start = userAgent.indexOf("Brave") + 6;
        let end = userAgent.substring(start).indexOf(" ");
        end = end === -1 ? userAgent.lastIndexOf("") : end;
        versionBrowser = userAgent
          .substring(start, end + start)
          .replace("_", ".")
          .replace(/[^\d.-]/g, "");
      }
    } else if (userAgent.indexOf("Edg/") !== -1) {
      detectedBrowser = "edge_chromium";
      const start = userAgent.indexOf("Edg/") + 4;
      versionBrowser = userAgent
        .substring(start)
        .replace("_", ".")
        .replace(/[^\d.-]/g, "");
    } else if (/Edg/.test(userAgent)) {
      detectedBrowser = "edge";
      let start = userAgent.indexOf("Edg") + 3;
      start += userAgent.substring(start).indexOf("/");
      let end = userAgent.substring(start).indexOf(" ");
      end = end === -1 ? userAgent.lastIndexOf("") : end;
      versionBrowser = userAgent
        .substring(start, end + start)
        .replace("_", ".")
        .replace(/[^\d.-]/g, "");
    } else if (/Firefox/.test(userAgent) || /FxiOS/.test(userAgent)) {
      detectedBrowser = "firefox";
      let start = userAgent.indexOf("Firefox");
      start = start === -1 ? userAgent.indexOf("FxiOS") : start;
      start = start + userAgent.substring(start).indexOf("/") + 1;
      let end = userAgent.substring(start).indexOf(" ");
      end = end === -1 ? userAgent.lastIndexOf("") : end;
      versionBrowser = userAgent.substring(start, end + start).replace("_", ".");
    } else if (/OPR/.test(userAgent)) {
      detectedBrowser = "opera";
      const start = userAgent.indexOf("OPR/") + 4;
      let end = userAgent.substring(start).indexOf(" ");
      end = end === -1 ? userAgent.lastIndexOf("") : end;
      versionBrowser = userAgent
        .substring(start, end + start)
        .replace("_", ".")
        .replace(/[^\d.-]/g, "");
    } else if (/Chrome/.test(userAgent) || /CriOS/.test(userAgent)) {
      detectedBrowser = "chrome";
      let start = userAgent.indexOf("Chrome");
      start = start === -1 ? userAgent.indexOf("CriOS") : start;
      start = start + userAgent.substring(start).indexOf("/") + 1;
      let end = userAgent.substring(start).indexOf(" ");
      end = end === -1 ? userAgent.lastIndexOf("") : end;
      versionBrowser = userAgent.substring(start, end + start).replace("_", ".");
    } else if (/Safari/.test(userAgent)) {
      detectedBrowser = "safari";
      let start = userAgent.indexOf("Version/");
      start = start + userAgent.substring(start).indexOf("/") + 1;
      let end = userAgent.substring(start).indexOf(" ");
      end = end === -1 ? userAgent.lastIndexOf("") : end;
      versionBrowser = userAgent.substring(start, end + start).replace("_", ".");
    }

    return { detectedBrowser, versionBrowser };
  }

  /**
   * Returns the operating system and its version.
   * @return {array} - detectedOS = Operating System name.
   *                   versionOS = Operating System version.
   */
  getOS() {
    // default value for OS just in case nothing is detected
    let detectedOS = "unknown";
    let versionOS = "unknown";

    // Retrieve properties to easily detect the OS
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
    const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
    const iosPlatforms = ["iPhone", "iPad", "iPod"];

    // Find OS and their respective versions
    if (macosPlatforms.indexOf(platform) !== -1) {
      detectedOS = "macos";
      if (userAgent.indexOf("OS X") !== -1) {
        const start = userAgent.indexOf("OS X") + 5;
        const end = userAgent.substring(start).indexOf(" ");
        versionOS = userAgent
          .substring(start, end + start)
          .replace("_", ".")
          .replace(/[^\d.-]/g, "");
      }
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      detectedOS = "ios";
      if (userAgent.indexOf("OS ") !== -1) {
        const start = userAgent.indexOf("OS ") + 3;
        const end = userAgent.substring(start).indexOf(")");
        versionOS = userAgent
          .substring(start, end + start)
          .replace("_", ".")
          .replace(/[^\d.-]/g, "");
      }
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      detectedOS = "windows";
      const start = userAgent.indexOf("Windows");
      let end = userAgent.substring(start).indexOf(";");
      if (end === -1) {
        end = userAgent.substring(start).indexOf(")");
      }
      versionOS = userAgent
        .substring(start, end + start)
        .replace("_", ".")
        .replace(/[^\d.-]/g, "");
    } else if (/Android/.test(userAgent)) {
      detectedOS = "android";
      const start = userAgent.indexOf("Android");
      let end = userAgent.substring(start).indexOf(";");
      if (end === -1) {
        end = userAgent.substring(start).indexOf(")");
      }
      versionOS = userAgent
        .substring(start, end + start)
        .replace("_", ".")
        .replace(/[^\d.-]/g, "");
    } else if (/CrOS/.test(userAgent)) {
      detectedOS = "chromeos";
      let start = userAgent.indexOf("CrOS ") + 5;
      start += userAgent.substring(start).indexOf(" ");
      const end = userAgent.substring(start).indexOf(")");
      versionOS = userAgent
        .substring(start, end + start)
        .replace("_", ".")
        .replace(/[^\d.-]/g, "");
    } else if (detectedOS === "unknown" && /Linux/.test(platform)) {
      detectedOS = "linux";
    }

    return { detectedOS, versionOS };
  }

  /**
   * Returns the absolute path of the integration script.
   * @return {string} - Absolute path for the integration script.
   */
  getPath() {
    if (typeof this.scriptName === "undefined") {
      throw new Error("scriptName property needed for getPath.");
    }
    const col = document.getElementsByTagName("script");
    let path = "";
    for (let i = 0; i < col.length; i += 1) {
      const j = col[i].src.lastIndexOf(this.scriptName);
      if (j >= 0) {
        path = col[i].src.substr(0, j - 1);
      }
    }
    return path;
  }

  /**
   * Returns integration model plugin version
   * @param {string} - Plugin version
   */
  getVersion() {
    return this.version;
  }

  /**
   * Sets the language property.
   * @param {string} language - language code.
   */
  setLanguage(language) {
    this.language = language;
  }

  /**
   * Sets a Core instance.
   * @param {Core} core - instance of Core class.
   */
  setCore(core) {
    this.core = core;
    core.setIntegrationModel(this);
  }

  /**
   * Returns the Core instance.
   * @returns {Core} instance of Core class.
   */
  getCore() {
    return this.core;
  }

  /**
   * Sets the object target and updates the iframe property.
   * @param {HTMLElement} target - target object.
   */
  setTarget(target) {
    this.target = target;
    this.isIframe = this.target.tagName.toUpperCase() === "IFRAME";
  }

  /**
   * Sets the editor object.
   * @param {Object} editorObject - The editor object.
   */
  setEditorObject(editorObject) {
    this.editorObject = editorObject;
  }

  /**
   * Opens formula editor to editing a new formula. Can be overwritten in order to make some
   * actions from integration part before the formula is edited.
   */
  openNewFormulaEditor() {
    if (window.navigator.onLine) {
      this.core.editionProperties.dbclick = false;
      this.core.editionProperties.isNewElement = true;
      this.core.openModalDialog(this.target, this.isIframe);
    } else {
      const modal = document.getElementById("wrs_modal_offline");
      modal.style.display = "block";
    }
  }

  /**
   * Opens formula editor to editing an existing formula. Can be overwritten in order to make some
   * actions from integration part before the formula is edited.
   */
  openExistingFormulaEditor() {
    if (window.navigator.onLine) {
      this.core.editionProperties.isNewElement = false;
      this.core.openModalDialog(this.target, this.isIframe);
    } else {
      const modal = document.getElementById("wrs_modal_offline");
      modal.style.display = "block";
    }
  }

  /**
   * Wrapper to Core.updateFormula method.
   * Transform a MathML into a image formula.
   * Then the image formula is inserted in the specified target, creating a new image (new formula)
   * or updating an existing one.
   * @param {string} mathml - MathML to generate the formula.
   * @param {string} editMode - Edit Mode (LaTeX or images).
   */
  updateFormula(mathml) {
    if (this.editorParameters) {
      mathml = com.wiris.editor.util.EditorUtils.addAnnotation(
        mathml,
        "application/vnd.wiris.mtweb-params+json",
        JSON.stringify(this.editorParameters),
      );
    }
    let focusElement;
    let windowTarget;
    const wirisProperties = null;

    if (this.isIframe) {
      focusElement = this.target.contentWindow;
      windowTarget = this.target.contentWindow;
    } else {
      focusElement = this.target;
      windowTarget = window;
    }

    let obj = this.core.beforeUpdateFormula(mathml, wirisProperties);

    if (!obj) {
      return "";
    }

    obj = this.insertFormula(focusElement, windowTarget, obj.mathml, obj.wirisProperties);

    if (!obj) {
      return "";
    }

    return this.core.afterUpdateFormula(obj.focusElement, obj.windowTarget, obj.node, obj.latex);
  }

  /**
   * Wrapper to Core.insertFormula method.
   * Inserts the formula in the specified target, creating
   * a new image (new formula) or updating an existing one.
   * @param {string} mathml - MathML to generate the formula.
   * @param {string} editMode - Edit Mode (LaTeX or images).
   * @returns {ReturnObject} - Object with the information of the node or latex to insert.
   */
  insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
    const obj = this.core.insertFormula(focusElement, windowTarget, mathml, wirisProperties);

    // Delete temporal image when inserted
    this.core.editionProperties.temporalImage = null;

    return obj;
  }

  /**
   * Returns the target selection.
   * @returns {Selection} target selection.
   */
  getSelection() {
    if (this.isIframe) {
      this.target.contentWindow.focus();
      return this.target.contentWindow.getSelection();
    }
    this.target.focus();
    return window.getSelection();
  }

  /**
   * Add events to formulas in the DOM target. The events added are the following:
   * - doubleClickHandler: handles Double-click event on formulas by opening an editor
   * to edit them.
   * - mouseDownHandler: handles mouse down event on formulas by saving the size of the formula
   * in case the the formula is resized.
   * - mouseUpHandler: handles mouse up event on formulas by restoring the saved formula size
   * in case the formula is resized.
   */
  addEvents() {
    const eventTarget = this.isIframe ? this.target.contentWindow.document : this.target;
    Util.addElementEvents(
      eventTarget,
      (element, event) => {
        this.doubleClickHandler(element, event);
        // Avoid creating the double click listener more than once for each element.
        event.stopImmediatePropagation();
      },
      (element, event) => {
        this.mousedownHandler(element, event);
      },
      (element, event) => {
        this.mouseupHandler(element, event);
      },
    );
  }

  /**
   * Remove events to formulas in the DOM target.
   */
  removeEvents() {
    const eventTarget =
      this.isIframe && this.target.contentWindow?.document ? this.target.contentWindow.document : this.target;

    if (!eventTarget) {
      return;
    }

    Util.removeElementEvents(eventTarget);
  }

  /**
   * Remove events, modals and set this.editorObject to null in order to prevent memory leaks.
   */
  destroy() {
    this.removeEvents();
    // Destroy modal dialog if exists.
    if (this.core.modalDialog) {
      this.core.modalDialog.destroy();
    }

    // Remove offline modal dialog if exists.
    if (this.offlineModal) {
      this.offlineModal.remove();
    }

    this.editorObject = null;
  }

  /**
   * Handles a Double-click on the target element. Opens an editor
   * to re-edit the double-clicked formula.
   * @param {HTMLElement} element - DOM object target.
   */
  doubleClickHandler(element) {
    this.core.editionProperties.dbclick = true;
    if (element.nodeName.toLowerCase() === "img") {
      this.core.getCustomEditors().disable();
      const customEditorAttributeName = Configuration.get("imageCustomEditorName");
      if (element.hasAttribute(customEditorAttributeName)) {
        const customEditor = element.getAttribute(customEditorAttributeName);
        this.core.getCustomEditors().enable(customEditor);
      }
      if (Util.containsClass(element, Configuration.get("imageClassName"))) {
        this.core.editionProperties.temporalImage = element;
        this.core.editionProperties.isNewElement = true;
        this.openExistingFormulaEditor();
      }
    }
  }

  /**
   * Handles a mouse up event on the target element. Restores the image size to avoid
   * resizing formulas.
   */
  mouseupHandler() {
    if (this.temporalImageResizing) {
      setTimeout(() => {
        Image.fixAfterResize(this.temporalImageResizing);
      }, 10);
    }
  }

  /**
   * Handles a mouse down event on the target element. Saves the formula size to avoid
   * resizing formulas.
   * @param {HTMLElement} element - target element.
   */
  mousedownHandler(element) {
    if (element.nodeName.toLowerCase() === "img") {
      if (Util.containsClass(element, Configuration.get("imageClassName"))) {
        this.temporalImageResizing = element;
      }
    }
  }

  /**
   * Returns the integration language. By default the browser agent. This method
   * should be overwritten to obtain the integration language, for example using the
   * plugin API of an HTML editor.
   * @returns {string} integration language.
   */
  getLanguage() {
    return this.getBrowserLanguage();
  }

  /**
   * Returns the browser language.
   * @returns {string} the browser language.
   */
  // eslint-disable-next-line class-methods-use-this
  getBrowserLanguage() {
    let language = "en";
    if (navigator.userLanguage) {
      language = navigator.userLanguage.substring(0, 2);
    } else if (navigator.language) {
      language = navigator.language.substring(0, 2);
    } else {
      language = "en";
    }
    return language;
  }

  /**
   * This function is called once the {@link Core} is loaded. IntegrationModel class
   * will fire this method when {@link Core} 'onLoad' event is fired.
   * This method should content all the logic to init
   * the integration.
   */
  callbackFunction() {
    // It's needed to wait until the integration target is ready. The event is fired
    // from the integration side.
    const listener = Listeners.newListener("onTargetReady", () => {
      this.addEvents(this.target);
    });
    this.listeners.add(listener);
  }

  /**
   * Function called when the content submits an action.
   */
  // eslint-disable-next-line class-methods-use-this
  notifyWindowClosed() {
    // Nothing.
  }

  /**
   * Wrapper.
   * Extracts mathml of a determined text node. This function is used as a wrapper inside core.js
   * in order to get mathml from a text node that can contain normal LaTeX or other chosen text.
   * @param {string} textNode - text node to extract the MathML.
   * @param {int} caretPosition - caret position inside the text node.
   * @returns {string} MathML inside the text node.
   */

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getMathmlFromTextNode(textNode, caretPosition) {}

  /**
   * Wrapper
   * It fills wrs event object of nonLatex with the desired data.
   * @param {Object} event - event object.
   * @param {Object} window dom window object.
   * @param {string} mathml valid mathml.
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  fillNonLatexNode(event, window, mathml) {}

  /**
    Wrapper.
   * Returns selected item from the target.
   * @param {HTMLElement} target - target element
   * @param {boolean} iframe
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getSelectedItem(target, isIframe) {}

  // Set temporal image to null and make focus come back.
  static setActionsOnCancelButtons() {
    // Make focus come back on the previous place it was when click cancel button
    const currentInstance = WirisPlugin.currentInstance;
    const editorSelection = currentInstance.getSelection();
    editorSelection.removeAllRanges();

    if (currentInstance.core.editionProperties.range) {
      const { range } = currentInstance.core.editionProperties;
      currentInstance.core.editionProperties.range = null;
      editorSelection.addRange(range);
      if (range.startOffset !== range.endOffset) {
        currentInstance.core.placeCaretAfterNode(currentInstance.core.editionProperties.temporalImage);
      }
    }

    // eslint-disable-next-line no-undef
    if (WirisPlugin.currentInstance) {
      WirisPlugin.currentInstance.core.editionProperties.temporalImage = null; // eslint-disable-line
    }
  }
}

// To know if the integration that extends this class implements
// wrapper methods, they are set as undefined.
IntegrationModel.prototype.getMathmlFromTextNode = undefined;
IntegrationModel.prototype.fillNonLatexNode = undefined;
IntegrationModel.prototype.getSelectedItem = undefined;

/**
 * An object containing a list with the overwritable class constructor properties.
 * @type {Object}
 */
IntegrationModel.integrationParameters = ["serviceProviderProperties", "editorParameters"];
