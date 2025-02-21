import IntegrationModel from "@wiris/mathtype-html-integration-devkit/src/integrationmodel";
import Configuration from "@wiris/mathtype-html-integration-devkit/src/configuration";
import StringManager from "@wiris/mathtype-html-integration-devkit/src/stringmanager";
import Telemeter from "@wiris/mathtype-html-integration-devkit/src/telemeter";
import Parser from "@wiris/mathtype-html-integration-devkit/src/parser";
import MathML from "@wiris/mathtype-html-integration-devkit/src/mathml";
import Util from "@wiris/mathtype-html-integration-devkit/src/util";
import formulaIcon from "./icons/formula.png";
import chemIcon from "./icons/chem.png";

import packageInfo from "./package.json";

/**
 * This property contains the current Generic integration instance,
 * which is the instance of the active editor.
 * @type {IntegrationModel}
 */
export const currentInstance = null;

/**
 * Inits MathType creating an object with all properties that the IntegrationModel class
 * needs to initialize the plugin and create an instance of IntegrationModel child.
 * @param {HTMLElement} target - DOM target, in this integration the editable iframe.
 * @param {HTMLElement} toolbar - DOM element where icons will be inserted.
 */
export function wrsInitEditor(target, toolbar, mathtypeProperties) {
  /**
   * @type {integrationModelProperties}
   */
  const genericIntegrationProperties = {};
  genericIntegrationProperties.target = target;
  genericIntegrationProperties.toolbar = toolbar;
  if (typeof mathtypeProperties !== "undefined") {
    genericIntegrationProperties.integrationParameters = mathtypeProperties;
  }

  // GenericIntegration instance.
  const genericIntegrationInstance = new GenericIntegration(genericIntegrationProperties); // eslint-disable-line no-use-before-define
  genericIntegrationInstance.init();
  genericIntegrationInstance.listeners.fire("onTargetReady", {});

  WirisPlugin.currentInstance = genericIntegrationInstance;
}

/**
 * Destroys the current instance of the editor and the toolbar.
 * @param instance - The current instance of the editor.
 * @returns {void}
 */
export function wrsDestroyEditor(instance) {
  instance.toolbar.innerHTML = "";
  instance.destroy();
}

/**
 * Gets the html content of the Generic editor and parses it to transform the latex
 * $$$$ into a mathml image
 * @param {HTMLElement} target - DOM target, in this integration the editable iframe
 * @returns {HTMLElement} The html content of the target parsed with the wiris funcions
 */
export function wrsGetTargetHtml(target) {
  const html = target.innerHTML;
  return WirisPlugin.Parser.endParse(html);
}

/**
 * Backwards compatibility init method.
 */
window.wrs_int_init = wrsInitEditor;
/**
 * IntegrationModel constructor. This method sets the dependant
 * integration properties needed by the IntegrationModel class to init the plugin.
 */
export default class GenericIntegration extends IntegrationModel {
  /**
   * @constructs
   * @param {IntegrationModelProperties} integrationModelProperties
   */
  constructor(integrationModelProperties) {
    if (typeof integrationModelProperties.serviceProviderProperties === "undefined") {
      integrationModelProperties.serviceProviderProperties = {
        URI: process.env.SERVICE_PROVIDER_URI,
        server: process.env.SERVICE_PROVIDER_SERVER,
      };
    }
    integrationModelProperties.version = packageInfo.version;
    integrationModelProperties.scriptName = "wirisplugin-generic.js";
    integrationModelProperties.environment = {};
    integrationModelProperties.environment.editor = "GenericHTML";
    integrationModelProperties.environment.editorVersion = "1.0.0";

    super(integrationModelProperties);

    this.toolbar = null;
    this.toolbar = integrationModelProperties.toolbar;
    if (typeof integrationModelProperties.configurationService !== "undefined") {
      this.configurationService = integrationModelProperties.configurationService;
    }
  }

  /**
   * Object containing all the Telemeter functions.
   */
  telemeter = {
    /**
     *
     * @param {string} toolbar The MT/CT button clicked from the toolbar: 'general' for the MathType and 'chemistry' for the ChemType
     * @param {string} trigger 'button' when the modal is opened by clicking the MathType or ChemType button from the toolbar
     *                         'formula' when the modal is opened by double-click on the formula
     */
    async wrsOpenedEditorModal(toolbar, trigger) {
      // Check that the manual string inputs contain the values we want, if not throw error.
      if (/^(button|formula)$/.test(trigger) && /^(general|chemistry)$/.test(toolbar)) {
        // Call Telemetry service to track the event.
        try {
          await Telemeter.telemeter.track("OPENED_MTCT_EDITOR", {
            toolbar,
            trigger,
          });
        } catch (error) {
          console.error("Error tracking OPENED_MTCT_EDITOR", error);
        }
      } else {
        console.error("Invalid trigger or toolbar value for open editor modal");
      }
    },

    /**
     *
     * @param {string} toolbar The MT/CT button clicked from the toolbar: 'general' for the MathType and 'chemistry' for the ChemType
     * @param {string} trigger 'mtct_insert' when the modal is closed due to inserting or modifying a formula. 'mtct_close' otherwise
     ** The function was changed to async to ensure that telemetry tracking is completed before closing the modal.
     */
    async wrsClosedEditorModal(toolbar, trigger) {
      // Check that the manual string inputs contain the values we want, if not throw error.
      if (!/^(mtct_insert|mtct_close)$/.test(trigger) || !/^(general|chemistry)$/.test(toolbar)) {
        console.error("Invalid trigger or toolbar value for close editor modal");
        return;
      }

      try {
        await Telemeter.telemeter.track("CLOSED_MTCT_EDITOR", {
          toolbar,
          trigger,
        });
      } catch (error) {
        console.error("Error tracking CLOSED_MTCT_EDITOR", error);
      }
    },

    /**
     *
     * @param {string} mathml_origin If editing a formula, the original mathml that's going to be edited. Otherwise null
     * @param {string} mathml The mathml that's going to be inserted
     * @param {number} time The time passed since the MT/CT modal opened until the calling of this function
     * @param {string} toolbar The MT/CT button clicked from the toolbar: 'general' for the MathType and 'chemistry' for the ChemType
     */
    async wrsInsertedFormula(mathml_origin, mathml, time, toolbar) {
      const validToolbar = /^(general|chemistry)$/.test(toolbar);
      const validDate = !isNaN(new Date(time));
      // Check that the manual string inputs contain the values we want, if not throw error.
      if (validToolbar && validDate) {
        // Build the telemeter payload separated to delete null/undefined entries.
        const payload = {
          mathml_origin: mathml_origin ? MathML.safeXmlDecode(mathml_origin) : mathml_origin,
          mathml: mathml ? MathML.safeXmlDecode(mathml) : mathml,
          elapsed_time: time,
          editor_origin: null,
          toolbar,
          size: mathml?.length,
        };

        // Remove desired null keys.
        Object.keys(payload).forEach((key) => {
          if (key === "mathml_origin" || key === "editor_origin") !payload[key] ? delete payload[key] : {};
        });

        // Call Telemetry service to track the event.
        try {
          await Telemeter.telemeter.track("INSERTED_FORMULA", {
            ...payload,
          });
        } catch (error) {
          console.error("Error tracking INSERTED_FORMULA", error);
        }
      } else {
        console.error("Invalid toolbar or time input for insert formula");
      }
    },
  };

  /**
   * Returns the demo language, stored in _wrs_int_langCode variable. If the language
   * is no set set, calls parent getLanguage() method.
   * @returns {string} demo language.
   */
  getLanguage() {
    // Try to get editorParameters.language, fail silently otherwise
    try {
      return this.editorParameters.language;
    } catch (e) {}
    if (typeof _wrs_int_langCode !== "undefined") {
      // eslint-disable-line camelcase
      console.warn("Deprecated property wirisformulaeditorlang. Use mathTypeParameters on instead.");
      return _wrs_int_langCode; // eslint-disable-line camelcase, no-undef
    }
    return super.getLanguage();
  }

  /** @inheritdoc */
  callbackFunction() {
    // Call parent callbackFunction in order to addEvents to integration target.
    super.callbackFunction();
    /* Parsing input text */
    if (this.isIframe) {
      this.target.contentWindow.document.body.innerHTML = Parser.initParse(
        this.target.contentWindow.document.body.innerHTML,
      );
    } else {
      this.target.innerHTML = Parser.initParse(this.target.innerHTML);
    }

    // Check if MathType is enabled
    if (Configuration.get("editorEnabled")) {
      /* Creating toolbar buttons */
      const formulaButton = document.createElement("img");
      formulaButton.id = "editorIcon";
      formulaButton.src = formulaIcon;
      formulaButton.title = formulaButton.alt = StringManager.get("insert_math", this.getLanguage());
      formulaButton.style.cursor = "pointer";

      Util.addEvent(formulaButton, "click", () => {
        this.core.getCustomEditors().disable();
        this.openNewFormulaEditor();
      });

      this.toolbar.appendChild(formulaButton);
    }

    // Dynamic customEditors buttons.
    const customEditors = this.getCore().getCustomEditors();
    // Iterate from all custom editors.
    for (const customEditor in customEditors.editors) {
      // Check if CustomEditor is enabled
      if (Configuration.get(customEditors.editors[customEditor].confVariable)) {
        const customEditorButton = document.createElement("img");
        // TODO make this work and add promises polyfill
        // import('./icons/' + customEditors.editors[customEditor].icon).then(({default: customEditorIcon}) => {
        //     customEditorButton.src = customEditorIcon;
        // });
        // Horrible hard-coded temporary fix
        if (customEditor === "chemistry") {
          customEditorButton.src = chemIcon;
          customEditorButton.title = customEditorButton.alt = StringManager.get("insert_chem", this.getLanguage());
        }
        customEditorButton.id = `${customEditor}Icon`;
        customEditorButton.style.cursor = "pointer";

        Util.addEvent(customEditorButton, "click", () => {
          customEditors.enable(customEditor);
          this.openNewFormulaEditor();
        });

        this.toolbar.appendChild(customEditorButton);
      }
    }
  }

  /** @inheritdoc */
  openNewFormulaEditor() {
    this.core.editionProperties.dbclick = false;
    // If it exists a temporal image saved, open the existing formula editor
    const image = this.core.editionProperties.temporalImage;
    if (image !== null && typeof image !== "undefined") {
      super.openExistingFormulaEditor();
    } else {
      super.openNewFormulaEditor();
    }
  }

  insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
    return super.insertFormula(focusElement, windowTarget, mathml, wirisProperties);
  }
}
