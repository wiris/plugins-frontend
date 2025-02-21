import IntegrationModel from "@wiris/mathtype-html-integration-devkit/src/integrationmodel";
import Parser from "@wiris/mathtype-html-integration-devkit/src/parser";
import Util from "@wiris/mathtype-html-integration-devkit/src/util";
import Configuration from "@wiris/mathtype-html-integration-devkit/src/configuration";
import StringManager from "@wiris/mathtype-html-integration-devkit/src/stringmanager";

import packageInfo from "./package.json";

/**
 * This property contains all CKEditor4 Integration instances.
 * @type {Object}
 */
export const instances = {};
/**
 * This property contains the current CKEditor4 integration instance,
 * which is the instance of the active editor.
 * @class
 * @type {IntegrationModel}
 */
export const currentInstance = null;

/**
 * This class represents the MathType integration from CKEditor4.
 * @extends {IntegrationModel}
 */

export class CKEditor4Integration extends IntegrationModel {
  /**
   *
   * @param {IntegrationModelProperties}
   */
  constructor(ckeditorIntegrationModelProperties) {
    /**
     * CKEditor4 Integration.
     *
     * @param {IntegrationModelProperties} integrationModelAttributes
     */
    super(ckeditorIntegrationModelProperties);
    /**
     * Folder name used for the integration inside CKEditor plugins folder.
     */
    this.integrationFolderName = "ckeditor_wiris";
  }

  /** @inheritdoc */
  init() {
    super.init();

    const editor = this.editorObject;
    if ("wiriseditorparameters" in editor.config) {
      Configuration.update("editorParameters", editor.config.wiriseditorparameters);
    }

    // Hide MathType toolbar button if is disabled by config.
    if (!Configuration.get("editorEnabled")) {
      document.getElementsByClassName("cke_button__ckeditor_wiris_formulaeditor")[0].style.display = "none";
    }

    // Hide ChemType toolbar button if is disabled by config.
    if (!Configuration.get("chemEnabled")) {
      document.getElementsByClassName("cke_button__ckeditor_wiris_formulaeditorchemistry")[0].style.display = "none";
    }
    // Change the destroy behavior to also destroy the Mathtype instance.
    editor.on("destroy", () => {
      this.destroy();
    });
  }

  /**
   * When no language is set, ckeditor sets the toolbar to user's browser language.
   * @inheritdoc
   * @returns {String} - The CKEditor instance language.
   * @override
   */
  getLanguage() {
    // Try to get editorParameters.language, fail silently otherwise
    try {
      return this.editorParameters.language;
    } catch (e) {}
    // Returns the CKEDitor instance language.
    if (this.editorObject.langCode != null) {
      return this.editorObject.langCode;
    }
    return super.getLanguage();
  }

  /**
   * @override
   */
  getPath() {
    // Delegates the responsability to get the path to CKEditor.
    return this.editorObject.plugins.ckeditor_wiris.path;
  }

  /**
   * Adds callbacks to the following CKEditor listeners:
   * - 'focus' - updates the current instance.
   * - 'contentDom' - adds 'doubleclick' callback.
   * - 'doubleclick' - sets to null data.dialog property to avoid modifications for MathType formulas.
   * - 'setData' - parses the data converting MathML into images.
   * - 'afterSetData' - adds an observer to MathType formulas to avoid modifications.
   * - 'getData' - parses the data converting images into selected save mode (MathML by default).
   * - 'mode' - recalculates the active element.
   */
  addEditorListeners() {
    const editor = this.editorObject;

    if (typeof editor.config.wirislistenersdisabled === "undefined" || !editor.config.wirislistenersdisabled) {
      // First editor parsing.
      editor.setData(Parser.initParse(editor.getData()));

      // Maintain currentInstance updated.
      editor.on("focus", (event) => {
        WirisPlugin.currentInstance = WirisPlugin.instances[event.editor.name];
      });

      editor.on("contentDom", () => {
        editor.on("doubleclick", (event) => {
          if (
            (event.data.element.$.nodeName.toLowerCase() === "img" &&
              Util.containsClass(event.data.element.$, Configuration.get("imageClassName"))) ||
            Util.containsClass(event.data.element.$, Configuration.get("CASClassName"))
          ) {
            event.data.dialog = null;
          }
        });

        this.addEvents();
      });

      editor.on("setData", (e) => {
        e.data.dataValue = Parser.initParse(e.data.dataValue || "");
      });

      editor.on("afterSetData", (e) => {
        // eslint-disable-line no-unused-vars
        if (typeof Parser.observer !== "undefined") {
          Array.prototype.forEach.call(document.getElementsByClassName("Wirisformula"), (wirisImages) => {
            Parser.observer.observe(wirisImages);
          });
        }
      });

      editor.on("getData", (e) => {
        e.data.dataValue = Parser.endParse(e.data.dataValue || "");
      });

      // When CKEditors changes from WYSIWYG to source element, recalculate 'element' variable is mandatory.
      editor.on("mode", (e) => {
        // eslint-disable-line no-unused-vars
        this.checkElement();
      });

      this.checkElement();
    } else {
      // CKEditor replaces several times the element element during its execution, so we must assign the events again.
      // We need to set a callback function to set 'element' variable inside CKEDITOR.plugins.add scope.
      editor.on("instanceReady", (params) => {
        // eslint-disable-line no-unused-vars
        this.checkElement();
      });

      editor.resetDirty();
    }
  }

  /**
   * Checks the current container and assign events in case that it doesn't have them.
   * CKEditor replaces several times the element element during its execution,
   * so we must assign the events again to editor element.
   */
  checkElement() {
    const editor = this.editorObject;
    const elem = document.getElementById(`cke_contents_${editor.name}`)
      ? document.getElementById(`cke_contents_${editor.name}`)
      : document.getElementById(`cke_${editor.name}`);

    let newElement;
    if (editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE) {
      newElement = editor.container.$;
    } else {
      newElement = elem.getElementsByTagName("iframe")[0]; // eslint-disable-line prefer-destructuring
    }

    let _wrs_int_divIframe = false; // eslint-disable-line camelcase
    if (!newElement) {
      // On this case, CKEditor uses a div area instead of and iframe as the editable area. Events must be integrated on the div area.
      let dataContainer;
      // eslint-disable-next-line guard-for-in
      for (const classElementIndex in elem.classList) {
        const classElement = elem.classList[classElementIndex];
        if (classElement.search("cke_\\d") !== -1) {
          dataContainer = classElement;
          break;
        }
      }
      if (dataContainer) {
        newElement = document.getElementById(`${dataContainer}_contents`);
        _wrs_int_divIframe = true; // eslint-disable-line camelcase
        // The events have to be added again
        newElement.wirisActive = false;
      }
    }

    // If the element wasn't treated, add the events.
    if (!newElement.wirisActive) {
      if (editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE) {
        if (newElement.tagName === "TEXTAREA") {
          // Inline editor from a textarea element. In this case the textarea will be replaced by a div element with inline editing enabled.
          const eventElements = document.getElementsByClassName("cke_textarea_inline");
          Array.prototype.forEach.call(eventElements, function (entry) {
            this.setTarget(entry);
            this.addEvents();
          });
        } else {
          this.setTarget(newElement);
          this.addEvents();
        }
        // Set the element as treated.
        newElement.wirisActive = true;
      } else if (!!newElement.contentWindow || _wrs_int_divIframe) {
        // eslint-disable-line camelcase
        this.setTarget(newElement);
        this.addEvents();
        // Set the element as treated.
        newElement.wirisActive = true;
      }
    }
  }

  /**
   * @inheritdoc
   * @param {HTMLElement} element - HTMLElement target.
   * @param {MouseEvent} event - Event which trigger the handler.
   */
  doubleClickHandler(element, event) {
    if (element.nodeName.toLowerCase() === "img") {
      if (Util.containsClass(element, Configuration.get("imageClassName"))) {
        // Some plugins (image2, image) open a dialog on Double-click. On formulas
        // doubleclick event ends here.
        if (typeof event.stopPropagation !== "undefined") {
          // old I.E compatibility.
          event.stopPropagation();
        } else {
          event.returnValue = false;
        }
        this.core.getCustomEditors().disable();
        const customEditorAttr = element.getAttribute(Configuration.get("imageCustomEditorName"));
        if (customEditorAttr) {
          this.core.getCustomEditors().enable(customEditorAttr);
        }
        this.core.editionProperties.temporalImage = element;
        this.core.editionProperties.dbclick = true;
        this.openExistingFormulaEditor();
      }
    }
  }

  /** @inheritdoc */
  insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
    // Due to insertFormula adds an image using pure JavaScript functions,
    // it is needed notificate to the editorObject that placeholder status
    // has to be updated.
    const formula = super.insertFormula(focusElement, windowTarget, mathml, wirisProperties);
    this.editorObject.fire("change");
    return formula;
  }

  /** @inheritdoc */
  getCorePath() {
    return CKEDITOR.plugins.getPath(this.integrationFolderName);
  }

  /** @inheritdoc */
  getSelection() {
    this.editorObject.editable().$.focus();
    return this.editorObject.getSelection().getNative();
  }

  /** @inheritdoc */
  callbackFunction() {
    super.callbackFunction();
    this.addEditorListeners();
  }
}

(function () {
  CKEDITOR.plugins.add("ckeditor_wiris", {
    init(editor) {
      editor.ui.addButton("ckeditor_wiris_formulaEditor", {
        label: StringManager.get("insert_math", editor.langCode),
        command: "ckeditor_wiris_openFormulaEditor",
        icon: `${CKEDITOR.plugins.getPath("ckeditor_wiris")}./icons/formula.png`,
      });

      editor.ui.addButton("ckeditor_wiris_formulaEditorChemistry", {
        label: StringManager.get("insert_chem", editor.langCode),
        command: "ckeditor_wiris_openFormulaEditorChemistry",
        icon: `${CKEDITOR.plugins.getPath("ckeditor_wiris")}./icons/chem.png`,
      });

      // Is needed specify that our images are allowed.
      let allowedContent = "img[align,";
      allowedContent += Configuration.get("imageMathmlAttribute");
      allowedContent += ",src,alt](!Wirisformula)";

      // MathType Editor.
      editor.addCommand("ckeditor_wiris_openFormulaEditor", {
        async: false,
        canUndo: true,
        editorFocus: true,
        allowedContent,
        requiredContent: allowedContent,

        exec: (editor) => {
          // eslint-disable-line no-shadow
          const ckeditorIntegrationInstance = WirisPlugin.instances[editor.name];
          // Can be that previously custom editor was used. So is needed disable
          // all the editors to avoid wrong behaviours.
          ckeditorIntegrationInstance.core.getCustomEditors().disable();
          ckeditorIntegrationInstance.openNewFormulaEditor();
        },
      });

      // ChemType.
      editor.addCommand("ckeditor_wiris_openFormulaEditorChemistry", {
        async: false,
        canUndo: true,
        editorFocus: true,
        allowedContent,
        requiredContent: allowedContent,

        exec: (editor) => {
          // eslint-disable-line no-shadow
          const ckeditorIntegrationInstance = WirisPlugin.instances[editor.name];
          ckeditorIntegrationInstance.core.getCustomEditors().enable("chemistry");
          ckeditorIntegrationInstance.openNewFormulaEditor();
        },
      });

      editor.on("instanceReady", () => {
        /**
         * Integration model constructor attributes.
         * @type {integrationModelProperties}
         */
        const ckeditorIntegrationModelProperties = {};
        ckeditorIntegrationModelProperties.editorObject = editor;
        // In CKEditor always there is an iframe or a div container. To access, we use the property that
        // the container has a class 'cke_wysiwyg_[container type]' where [container type] can be 'frame' or 'div'.
        ckeditorIntegrationModelProperties.target = editor.container.$.querySelector("*[class^=cke_wysiwyg]");
        ckeditorIntegrationModelProperties.serviceProviderProperties = {
          URI: process.env.SERVICE_PROVIDER_URI,
          server: process.env.SERVICE_PROVIDER_SERVER,
        };
        ckeditorIntegrationModelProperties.version = packageInfo.version;
        ckeditorIntegrationModelProperties.scriptName = "plugin.js";
        ckeditorIntegrationModelProperties.environment = {};
        ckeditorIntegrationModelProperties.environment.editor = "CKEditor4";
        ckeditorIntegrationModelProperties.environment.editorVersion = "4.x";
        // Updating integration paths if context path is overwritten by editor javascript configuration.
        if ("wiriscontextpath" in editor.config) {
          ckeditorIntegrationModelProperties.configurationService =
            editor.config.wiriscontextpath + ckeditorIntegrationModelProperties.configurationService;
          console.warn(
            "Deprecated property wiriscontextpath. Use mathTypeParameters on instead.",
            editor.config.wiriscontextpath,
          );
        }

        // Overriding MathType integration parameters.
        if ("mathTypeParameters" in editor.config) {
          ckeditorIntegrationModelProperties.integrationParameters = editor.config.mathTypeParameters;
        }

        const ckeditorIntegrationInstance = new CKEditor4Integration(ckeditorIntegrationModelProperties);
        ckeditorIntegrationInstance.init();
        ckeditorIntegrationInstance.listeners.fire("onTargetReady", {});
        WirisPlugin.instances[editor.name] = ckeditorIntegrationInstance;
        WirisPlugin.currentInstance = ckeditorIntegrationInstance;
      });

      // Parse the editor content after copy & paste / drag & drop
      editor.on("afterPaste", (event) => {
        editor.setData(Parser.initParse(editor.getData()));
      });
    },
  });
})();
