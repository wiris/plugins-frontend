import { Command, Plugin } from '@ckeditor/ckeditor5-core/dist/index.js';
import { ButtonView } from '@ckeditor/ckeditor5-ui/dist/index.js';
import { ClickObserver, XmlDataProcessor, UpcastWriter, HtmlDataProcessor } from '@ckeditor/ckeditor5-engine/dist/index.js';
import { Widget, viewToModelPositionOutsideModelElement, toWidget } from '@ckeditor/ckeditor5-widget/dist/index.js';
import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel.js';
import Core from '@wiris/mathtype-html-integration-devkit/src/core.src.js';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser.js';
import Util from '@wiris/mathtype-html-integration-devkit/src/util.js';
import Image from '@wiris/mathtype-html-integration-devkit/src/image.js';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration.js';
import Listeners from '@wiris/mathtype-html-integration-devkit/src/listeners.js';
import MathML from '@wiris/mathtype-html-integration-devkit/src/mathml.js';
import Latex from '@wiris/mathtype-html-integration-devkit/src/latex.js';
import StringManager from '@wiris/mathtype-html-integration-devkit/src/stringmanager.js';
import Telemeter from '@wiris/mathtype-html-integration-devkit/src/telemeter.js';

/**
 * This class represents the MathType integration for CKEditor5.
 * @extends {IntegrationModel}
 */ class CKEditor5Integration extends IntegrationModel {
    constructor(ckeditorIntegrationModelProperties){
        const editor = ckeditorIntegrationModelProperties.editorObject;
        if (typeof editor.config !== "undefined" && typeof editor.config.get("mathTypeParameters") !== "undefined") {
            ckeditorIntegrationModelProperties.integrationParameters = editor.config.get("mathTypeParameters");
        }
        /**
     * CKEditor5 Integration.
     *
     * @param {integrationModelProperties} integrationModelAttributes
     */ super(ckeditorIntegrationModelProperties);
        /**
     * Folder name used for the integration inside CKEditor plugins folder.
     */ this.integrationFolderName = "ckeditor_wiris";
    }
    /**
   * @inheritdoc
   * @returns {string} - The CKEditor instance language.
   * @override
   */ getLanguage() {
        // Returns the CKEDitor instance language taking into account that the language can be an object.
        // Try to get editorParameters.language, fail silently otherwise
        try {
            return this.editorParameters.language;
        } catch (e) {}
        const languageObject = this.editorObject.config.get("language");
        if (languageObject != null) {
            if (typeof languageObject === "object") {
                // eslint-disable-next-line no-prototype-builtins
                if (languageObject.hasOwnProperty("ui")) {
                    return languageObject.ui;
                }
                return languageObject;
            }
            return languageObject;
        }
        return super.getLanguage();
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
   */ addEditorListeners() {
        const editor = this.editorObject;
        if (typeof editor.config.wirislistenersdisabled === "undefined" || !editor.config.wirislistenersdisabled) {
            this.checkElement();
        }
    }
    /**
   * Checks the current container and assign events in case that it doesn't have them.
   * CKEditor replaces several times the element element during its execution,
   * so we must assign the events again to editor element.
   */ checkElement() {
        const editor = this.editorObject;
        const newElement = editor.sourceElement;
        // If the element wasn't treated, add the events.
        if (!newElement.wirisActive) {
            this.setTarget(newElement);
            this.addEvents();
            // Set the element as treated
            newElement.wirisActive = true;
        }
    }
    /**
   * @inheritdoc
   * @param {HTMLElement} element - HTMLElement target.
   * @param {MouseEvent} event - event which trigger the handler.
   */ doubleClickHandler(element, event) {
        this.core.editionProperties.dbclick = true;
        if (this.editorObject.isReadOnly === false) {
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
                    this.openExistingFormulaEditor();
                }
            }
        }
    }
    /** @inheritdoc */ static getCorePath() {
        return null; // TODO
    }
    /** @inheritdoc */ callbackFunction() {
        super.callbackFunction();
        this.addEditorListeners();
    }
    openNewFormulaEditor() {
        // Store the editor selection as it will be lost upon opening the modal
        this.core.editionProperties.selection = this.editorObject.editing.view.document.selection;
        // Focus on the selected editor when multiple editor instances are present
        WirisPlugin.currentInstance = this;
        return super.openNewFormulaEditor();
    }
    /**
   * Replaces old formula with new MathML or inserts it in caret position if new
   * @param {String} mathml MathML to update old one or insert
   * @returns {module:engine/model/element~Element} The model element corresponding to the inserted image
   */ insertMathml(mathml) {
        // This returns the value returned by the callback function (writer => {...})
        return this.editorObject.model.change((writer)=>{
            const core = this.getCore();
            const selection = this.editorObject.model.document.selection;
            const modelElementNew = writer.createElement("mathml", {
                formula: mathml,
                ...Object.fromEntries(selection.getAttributes())
            });
            // Obtain the DOM <span><img ... /></span> object corresponding to the formula
            if (core.editionProperties.isNewElement) {
                // Don't bother inserting anything at all if the MathML is empty.
                if (!mathml) return;
                const viewSelection = this.core.editionProperties.selection || this.editorObject.editing.view.document.selection;
                const modelPosition = this.editorObject.editing.mapper.toModelPosition(viewSelection.getLastPosition());
                this.editorObject.model.insertObject(modelElementNew, modelPosition);
                // Remove selection
                if (!viewSelection.isCollapsed) {
                    for (const range of viewSelection.getRanges()){
                        writer.remove(this.editorObject.editing.mapper.toModelRange(range));
                    }
                }
                // Set carret after the formula
                const position = this.editorObject.model.createPositionAfter(modelElementNew);
                writer.setSelection(position);
            } else {
                const img = core.editionProperties.temporalImage;
                const viewElement = this.editorObject.editing.view.domConverter.domToView(img).parent;
                const modelElementOld = this.editorObject.editing.mapper.toModelElement(viewElement);
                // Insert the new <mathml> and remove the old one
                const position = this.editorObject.model.createPositionBefore(modelElementOld);
                // If the given MathML is empty, don't insert a new formula.
                if (mathml) {
                    this.editorObject.model.insertObject(modelElementNew, position);
                }
                writer.remove(modelElementOld);
            }
            // eslint-disable-next-line consistent-return
            return modelElementNew;
        });
    }
    /**
   * Finds the text node corresponding to given DOM text element.
   * @param {element} viewElement Element to find corresponding text node of.
   * @returns {module:engine/model/text~Text|undefined} Text node corresponding to the given element or undefined if it doesn't exist.
   */ findText(viewElement) {
        // eslint-disable-line consistent-return
        // mapper always converts text nodes to *new* model elements so we need to convert the text's parents and then come back down
        let pivot = viewElement;
        let element;
        while(!element){
            element = this.editorObject.editing.mapper.toModelElement(this.editorObject.editing.view.domConverter.domToView(pivot));
            pivot = pivot.parentElement;
        }
        // Navigate through all the subtree under `pivot` in order to find the correct text node
        const range = this.editorObject.model.createRangeIn(element);
        const descendants = Array.from(range.getItems());
        for (const node of descendants){
            let viewElementData = viewElement.data;
            if (viewElement.nodeType === 3) {
                // Remove invisible white spaces
                viewElementData = viewElementData.replaceAll(String.fromCharCode(8288), "");
            }
            if (node.is("textProxy") && node.data === viewElementData.replace(String.fromCharCode(160), " ")) {
                return node.textNode;
            }
        }
    }
    /** @inheritdoc */ insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
        // eslint-disable-line no-unused-vars
        const returnObject = {};
        let mathmlOrigin;
        if (!mathml) {
            this.insertMathml("");
        } else if (this.core.editMode === "latex") {
            returnObject.latex = Latex.getLatexFromMathML(mathml);
            returnObject.node = windowTarget.document.createTextNode(`$$${returnObject.latex}$$`);
            this.editorObject.model.change((writer)=>{
                const { latexRange } = this.core.editionProperties;
                const startNode = this.findText(latexRange.startContainer);
                const endNode = this.findText(latexRange.endContainer);
                let startPosition = writer.createPositionAt(startNode.parent, startNode.startOffset + latexRange.startOffset);
                let endPosition = writer.createPositionAt(endNode.parent, endNode.startOffset + latexRange.endOffset);
                let range = writer.createRange(startPosition, endPosition);
                // When Latex is next to image/formula.
                if (latexRange.startContainer.nodeType === 3 && latexRange.startContainer.previousSibling?.nodeType === 1) {
                    // Get the position of the latex to be replaced.
                    let latexEdited = "$$" + Latex.getLatexFromMathML(MathML.safeXmlDecode(this.core.editionProperties.temporalImage.dataset.mathml)) + "$$";
                    let data = latexRange.startContainer.data;
                    // Remove invisible characters.
                    data = data.replaceAll(String.fromCharCode(8288), "");
                    // Get to the start of the latex we are editing.
                    let offset = data.indexOf(latexEdited);
                    let dataOffset = data.substring(offset);
                    let second$ = dataOffset.substring(2).indexOf("$$") + 4;
                    let substring = dataOffset.substr(0, second$);
                    data = data.replace(substring, "");
                    if (!data) {
                        startPosition = writer.createPositionBefore(startNode);
                        range = startNode;
                    } else {
                        startPosition = startPosition = writer.createPositionAt(startNode.parent, startNode.startOffset + offset);
                        endPosition = writer.createPositionAt(endNode.parent, endNode.startOffset + second$ + offset);
                        range = writer.createRange(startPosition, endPosition);
                    }
                }
                writer.remove(range);
                writer.insertText(`$$${returnObject.latex}$$`, startNode.getAttributes(), startPosition);
            });
        } else {
            mathmlOrigin = this.core.editionProperties.temporalImage?.dataset.mathml;
            try {
                returnObject.node = this.editorObject.editing.view.domConverter.viewToDom(this.editorObject.editing.mapper.toViewElement(this.insertMathml(mathml)), windowTarget.document);
            } catch (e) {
                const x = e.toString();
                if (x.includes("CKEditorError: Cannot read property 'parent' of undefined")) {
                    this.core.modalDialog.cancelAction();
                }
            }
        }
        // Build the telemeter payload separated to delete null/undefined entries.
        let payload = {
            mathml_origin: mathmlOrigin ? MathML.safeXmlDecode(mathmlOrigin) : mathmlOrigin,
            mathml: mathml ? MathML.safeXmlDecode(mathml) : mathml,
            elapsed_time: Date.now() - this.core.editionProperties.editionStartTime,
            editor_origin: null,
            toolbar: this.core.modalDialog.contentManager.toolbar,
            size: mathml?.length
        };
        // Remove desired null keys.
        Object.keys(payload).forEach((key)=>{
            if (key === "mathml_origin" || key === "editor_origin") !payload[key] ? delete payload[key] : {};
        });
        // Call Telemetry service to track the event.
        try {
            Telemeter.telemeter.track("INSERTED_FORMULA", {
                ...payload
            });
        } catch (error) {
            console.error("Error tracking INSERTED_FORMULA", error);
        }
        /* Due to PLUGINS-1329, we add the onChange event to the CK4 insertFormula.
        We probably should add it here as well, but we should look further into how */ // this.editorObject.fire('change');
        // Remove temporal image of inserted formula
        this.core.editionProperties.temporalImage = null;
        return returnObject;
    }
    /**
   * Function called when the content submits an action.
   */ notifyWindowClosed() {
        this.editorObject.editing.view.focus();
    }
}

/**
 * Command for opening the MathType editor
 */ class MathTypeCommand extends Command {
    execute(options = {}) {
        // Check we get a valid integration
        // eslint-disable-next-line no-prototype-builtins
        if (!options.hasOwnProperty("integration") || !(options.integration instanceof CKEditor5Integration)) {
            throw 'Must pass a valid CKEditor5Integration instance as attribute "integration" of options';
        }
        // Save the integration instance as a property of the command.
        this.integration = options.integration;
        // Set custom editor or disable it
        this.setEditor();
        // Open the editor
        this.openEditor();
    }
    /**
   * Sets the appropriate custom editor, if any, or disables them.
   */ setEditor() {
        // It's possible that a custom editor was last used.
        // We need to disable it to avoid wrong behaviors.
        this.integration.core.getCustomEditors().disable();
    }
    /**
   * Checks whether we are editing an existing formula or a new one and opens the editor.
   */ openEditor() {
        this.integration.core.editionProperties.dbclick = false;
        const image = this._getSelectedImage();
        if (typeof image !== "undefined" && image !== null && image.classList.contains(WirisPlugin.Configuration.get("imageClassName"))) {
            this.integration.core.editionProperties.temporalImage = image;
            this.integration.openExistingFormulaEditor();
        } else {
            this.integration.openNewFormulaEditor();
        }
    }
    /**
   * Gets the currently selected formula image
   * @returns {Element} selected image, if any, undefined otherwise
   */ _getSelectedImage() {
        const { selection } = this.editor.editing.view.document;
        // If we can not extract the formula, fall back to default behavior.
        if (selection.isCollapsed || selection.rangeCount !== 1) {
            return;
        }
        // Look for the <span> wrapping the formula and then for the <img/> inside
        const range = selection.getFirstRange();
        let image;
        for (const span of range){
            if (span.item.name !== "span") {
                return;
            }
            image = span.item.getChild(0);
            break;
        }
        if (!image) {
            return;
        }
        // eslint-disable-next-line consistent-return
        return this.editor.editing.view.domConverter.mapViewToDom(image);
    }
}
/**
 * Command for opening the ChemType editor
 */ class ChemTypeCommand extends MathTypeCommand {
    setEditor() {
        this.integration.core.getCustomEditors().enable("chemistry");
    }
}

var mathIcon = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 300 261.7\" style=\"enable-background:new 0 0 300 261.7;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:#FFFFFF;}\n\t.st1{fill:#EF4A5F;}\n\t.st2{fill:#C8202F;}\n</style>\n<path class=\"st0\" d=\"M300,32.8c0-16.4-13.4-29.7-29.9-29.7c-2.9,0-7.2,0.8-7.2,0.8c-37.9,9.1-71.3,14-112,14c-0.3,0-0.6,0-1,0\n\tc-16.5,0-29.9,13.3-29.9,29.7c0,16.4,13.4,29.7,29.9,29.7l0,0c45.3,0,83.1-5.3,125.3-15.3h0C289.3,59.5,300,47.4,300,32.8\"/>\n<path class=\"st0\" d=\"M90.2,257.7c-11.4,0-21.9-6.4-27-16.7l-60-119.9c-7.5-14.9-1.4-33.1,13.5-40.5c14.9-7.5,33.1-1.4,40.5,13.5\n\tl27.3,54.7L121.1,39c5.3-15.8,22.4-24.4,38.2-19.1c15.8,5.3,24.4,22.4,19.1,38.2l-59.6,179c-3.9,11.6-14.3,19.7-26.5,20.6\n\tC91.6,257.7,90.9,257.7,90.2,257.7\"/>\n<g>\n\t<g>\n\t\t<path class=\"st1\" d=\"M90.2,257.7c-11.4,0-21.9-6.4-27-16.7l-60-119.9c-7.5-14.9-1.4-33.1,13.5-40.5c14.9-7.5,33.1-1.4,40.5,13.5\n\t\t\tl27.3,54.7L121.1,39c5.3-15.8,22.4-24.4,38.2-19.1c15.8,5.3,24.4,22.4,19.1,38.2l-59.6,179c-3.9,11.6-14.3,19.7-26.5,20.6\n\t\t\tC91.6,257.7,90.9,257.7,90.2,257.7\"/>\n\t</g>\n</g>\n<g>\n\t<g>\n\t\t<path class=\"st2\" d=\"M300,32.8c0-16.4-13.4-29.7-29.9-29.7c-2.9,0-7.2,0.8-7.2,0.8c-37.9,9.1-71.3,14-112,14c-0.3,0-0.6,0-1,0\n\t\t\tc-16.5,0-29.9,13.3-29.9,29.7c0,16.4,13.4,29.7,29.9,29.7l0,0c45.3,0,83.1-5.3,125.3-15.3h0C289.3,59.5,300,47.4,300,32.8\"/>\n\t</g>\n</g>\n</svg>\n";

var chemIcon = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 40.3 49.5\" style=\"enable-background:new 0 0 40.3 49.5;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:#A4CF61;}\n</style>\n<path class=\"st0\" d=\"M39.2,12.1c0-1.9-1.1-3.6-2.7-4.4L24.5,0.9l0,0c-0.7-0.4-1.5-0.6-2.4-0.6c-0.9,0-1.7,0.2-2.4,0.6l0,0L2.3,10.8\n\tl0,0C0.9,11.7,0,13.2,0,14.9h0v19.6h0c0,1.7,0.9,3.3,2.3,4.1l0,0l17.4,9.9l0,0c0.7,0.4,1.5,0.6,2.4,0.6c0.9,0,1.7-0.2,2.4-0.6l0,0\n\tl12.2-6.9h0c1.5-0.8,2.6-2.5,2.6-4.3c0-2.7-2.2-4.9-4.9-4.9c-0.9,0-1.8,0.3-2.5,0.7l0,0l-9.7,5.6l-12.3-7V17.8l12.3-7l9.9,5.7l0,0\n\tc0.7,0.4,1.5,0.6,2.4,0.6C37,17,39.2,14.8,39.2,12.1\"/>\n</svg>\n";

var name = "@wiris/mathtype-ckeditor5";
var version = "8.11.1";
var description = "MathType Web for CKEditor5 editor";
var keywords = [
	"chem",
	"chemistry",
	"chemtype",
	"ckeditor",
	"ckeditor5",
	"editor",
	"equation",
	"latex",
	"math",
	"mathml",
	"maths",
	"mathtype",
	"wiris"
];
var repository = "https://github.com/wiris/html-integrations/tree/stable/packages/mathtype-ckeditor5";
var homepage = "https://www.wiris.com/";
var bugs = {
	email: "support@wiris.com"
};
var license = "MIT";
var author = "WIRIS Team (http://www.wiris.com)";
var files = [
	"dist",
	"src",
	"icons",
	"theme",
	"lang"
];
var main = "src/plugin.js";
var type = "module";
var exports = {
	".": "./src/plugin.js",
	"./dist/*": "./dist/*",
	"./browser/*": null,
	"./src/*": "./src/*",
	"./theme/*": "./theme/*",
	"./package.json": "./package.json"
};
var scripts = {
	build: "node ./scripts/build-dist.mjs",
	"build:dist": "node ./scripts/build-dist.mjs",
	prepare: "npm run build:dist"
};
var dependencies = {
	"@wiris/mathtype-html-integration-devkit": "1.17.5"
};
var devDependencies = {
	"@ckeditor/ckeditor5-dev-build-tools": "^42.1.0",
	ckeditor5: ">=43.0.0"
};
var peerDependencies = {
	ckeditor5: ">=43.0.0"
};
var packageInfo = {
	name: name,
	version: version,
	description: description,
	keywords: keywords,
	repository: repository,
	homepage: homepage,
	bugs: bugs,
	license: license,
	author: author,
	files: files,
	main: main,
	type: type,
	exports: exports,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	peerDependencies: peerDependencies
};

// CKEditor imports
let currentInstance = null; // eslint-disable-line import/no-mutable-exports
class MathType extends Plugin {
    static get requires() {
        return [
            Widget
        ];
    }
    static get pluginName() {
        return "MathType";
    }
    init() {
        // Create the MathType API Integration object
        const integration = this._addIntegration();
        currentInstance = integration;
        // Add the MathType and ChemType commands to the editor
        this._addCommands();
        // Add the buttons for MathType and ChemType
        this._addViews(integration);
        // Registers the <mathml> element in the schema
        this._addSchema();
        // Add the downcast and upcast converters
        this._addConverters(integration);
        // Expose the WirisPlugin variable to the window
        this._exposeWiris();
    }
    /**
   * Inherited from Plugin class: Executed when CKEditor5 is destroyed
   */ destroy() {
        // eslint-disable-line class-methods-use-this
        currentInstance.destroy();
    }
    /**
   * Create the MathType API Integration object
   * @returns {CKEditor5Integration} the integration object
   */ _addIntegration() {
        const { editor } = this;
        /**
     * Integration model constructor attributes.
     * @type {integrationModelProperties}
     */ const integrationProperties = {};
        integrationProperties.environment = {};
        integrationProperties.environment.editor = "CKEditor5";
        integrationProperties.environment.editorVersion = "5.x";
        integrationProperties.version = packageInfo.version;
        integrationProperties.editorObject = editor;
        integrationProperties.serviceProviderProperties = {};
        integrationProperties.serviceProviderProperties.URI = "https://www.wiris.net/demo/plugins/app";
        integrationProperties.serviceProviderProperties.server = "java";
        integrationProperties.target = editor.sourceElement;
        integrationProperties.scriptName = "bundle.js";
        integrationProperties.managesLanguage = true;
        // etc
        // There are platforms like Drupal that initialize CKEditor but they hide or remove the container element.
        // To avoid a wrong behaviour, this integration only starts if the workspace container exists.
        let integration;
        if (integrationProperties.target) {
            // Instance of the integration associated to this editor instance
            integration = new CKEditor5Integration(integrationProperties);
            integration.init();
            integration.listeners.fire("onTargetReady", {});
            integration.checkElement();
            this.listenTo(editor.editing.view.document, "click", (evt, data)=>{
                // Is Double-click
                if (data.domEvent.detail === 2) {
                    integration.doubleClickHandler(data.domTarget, data.domEvent);
                    evt.stop();
                }
            }, {
                priority: "highest"
            });
        }
        return integration;
    }
    /**
   * Add the MathType and ChemType commands to the editor
   */ _addCommands() {
        const { editor } = this;
        // Add command to open the formula editor
        editor.commands.add("MathType", new MathTypeCommand(editor));
        // Add command to open the chemistry formula editor
        editor.commands.add("ChemType", new ChemTypeCommand(editor));
    }
    /**
   * Add the buttons for MathType and ChemType
   * @param {CKEditor5Integration} integration the integration object
   */ _addViews(integration) {
        const { editor } = this;
        // Check if MathType editor is enabled
        if (Configuration.get("editorEnabled")) {
            // Add button for the formula editor
            editor.ui.componentFactory.add("MathType", (locale)=>{
                const view = new ButtonView(locale);
                // View is enabled iff command is enabled
                view.bind("isEnabled").to(editor.commands.get("MathType"), "isEnabled");
                view.set({
                    label: StringManager.get("insert_math", integration.getLanguage()),
                    icon: mathIcon,
                    tooltip: true
                });
                // Callback executed once the image is clicked.
                view.on("execute", ()=>{
                    editor.execute("MathType", {
                        integration
                    });
                });
                return view;
            });
        }
        // Check if ChemType editor is enabled
        if (Configuration.get("chemEnabled")) {
            // Add button for the chemistry formula editor
            editor.ui.componentFactory.add("ChemType", (locale)=>{
                const view = new ButtonView(locale);
                // View is enabled iff command is enabled
                view.bind("isEnabled").to(editor.commands.get("ChemType"), "isEnabled");
                view.set({
                    label: StringManager.get("insert_chem", integration.getLanguage()),
                    icon: chemIcon,
                    tooltip: true
                });
                // Callback executed once the image is clicked.
                view.on("execute", ()=>{
                    editor.execute("ChemType", {
                        integration
                    });
                });
                return view;
            });
        }
        // Observer for the Double-click event
        editor.editing.view.addObserver(ClickObserver);
    }
    /**
   * Registers the <mathml> element in the schema
   */ _addSchema() {
        const { schema } = this.editor.model;
        schema.register("mathml", {
            inheritAllFrom: "$inlineObject",
            allowAttributes: [
                "formula",
                "htmlContent"
            ]
        });
    }
    /**
   * Add the downcast and upcast converters
   */ _addConverters(integration) {
        const { editor } = this;
        // Editing view -> Model
        editor.conversion.for("upcast").elementToElement({
            view: {
                name: "span",
                classes: "ck-math-widget"
            },
            model: (viewElement, { writer: modelWriter })=>{
                const formula = MathML.safeXmlDecode(viewElement.getChild(0).getAttribute("data-mathml"));
                return modelWriter.createElement("mathml", {
                    formula
                });
            }
        });
        // Data view -> Model
        editor.data.upcastDispatcher.on("element:math", (evt, data, conversionApi)=>{
            const { consumable, writer } = conversionApi;
            const { viewItem } = data;
            // When element was already consumed then skip it.
            if (!consumable.test(viewItem, {
                name: true
            })) {
                return;
            }
            // If we encounter any <math> with a LaTeX annotation inside,
            // convert it into a "$$...$$" string.
            const isLatex = mathIsLatex(viewItem); // eslint-disable-line no-use-before-define
            // Get the formula of the <math> (which is all its children).
            const processor = new XmlDataProcessor(editor.editing.view.document);
            // Only god knows why the following line makes viewItem lose all of its children,
            // so we obtain isLatex before doing this because we need viewItem's children for that.
            const upcastWriter = new UpcastWriter(editor.editing.view.document);
            const viewDocumentFragment = upcastWriter.createDocumentFragment(viewItem.getChildren());
            // and obtain the attributes of <math> too!
            const mathAttributes = [
                ...viewItem.getAttributes()
            ].map(([key, value])=>` ${key}="${value}"`).join("");
            // We process the document fragment
            let formula = processor.toData(viewDocumentFragment) || "";
            // And obtain the complete formula
            formula = Util.htmlSanitize(`<math${mathAttributes}>${formula}</math>`);
            // Replaces the < & > characters to its HTMLEntity to avoid render issues.
            formula = formula.replaceAll('"<"', '"&lt;"').replaceAll('">"', '"&gt;"').replaceAll("><<", ">&lt;<");
            /* Model node that contains what's going to actually be inserted. This can be either:
            - A <mathml> element with a formula attribute set to the given formula, or
            - If the original <math> had a LaTeX annotation, then the annotation surrounded by "$$...$$" */ const modelNode = isLatex ? writer.createText(Parser.initParse(formula, integration.getLanguage())) : writer.createElement("mathml", {
                formula
            });
            // Find allowed parent for element that we are going to insert.
            // If current parent does not allow to insert element but one of the ancestors does
            // then split nodes to allowed parent.
            const splitResult = conversionApi.splitToAllowedParent(modelNode, data.modelCursor);
            // When there is no split result it means that we can't insert element to model tree, so let's skip it.
            if (!splitResult) {
                return;
            }
            // Insert element on allowed position.
            conversionApi.writer.insert(modelNode, splitResult.position);
            // Consume appropriate value from consumable values list.
            consumable.consume(viewItem, {
                name: true
            });
            const parts = conversionApi.getSplitParts(modelNode);
            // Set conversion result range.
            data.modelRange = writer.createRange(conversionApi.writer.createPositionBefore(modelNode), conversionApi.writer.createPositionAfter(parts[parts.length - 1]));
            // Now we need to check where the `modelCursor` should be.
            if (splitResult.cursorParent) {
                // If we split parent to insert our element then we want to continue conversion in the new part of the split parent.
                //
                // before: <allowed><notAllowed>foo[]</notAllowed></allowed>
                // after:  <allowed><notAllowed>foo</notAllowed><converted></converted><notAllowed>[]</notAllowed></allowed>
                data.modelCursor = conversionApi.writer.createPositionAt(splitResult.cursorParent, 0);
            } else {
                // Otherwise just continue after inserted element.
                data.modelCursor = data.modelRange.end;
            }
        });
        // Data view -> Model
        editor.data.upcastDispatcher.on("element:img", (evt, data, conversionApi)=>{
            const { consumable, writer } = conversionApi;
            const { viewItem } = data;
            // Only upcast when is wiris formula
            if (viewItem.getClassNames().next().value !== "Wirisformula") {
                return;
            }
            const mathAttributes = [
                ...viewItem.getAttributes()
            ].map(([key, value])=>` ${key}="${value}"`).join("");
            let htmlContent = Util.htmlSanitize(`<img${mathAttributes}>`);
            const modelNode = writer.createElement("mathml", {
                htmlContent
            });
            // Find allowed parent for element that we are going to insert.
            // If current parent does not allow to insert element but one of the ancestors does
            // then split nodes to allowed parent.
            const splitResult = conversionApi.splitToAllowedParent(modelNode, data.modelCursor);
            // When there is no split result it means that we can't insert element to model tree, so let's skip it.
            if (!splitResult) {
                return;
            }
            // Insert element on allowed position.
            conversionApi.writer.insert(modelNode, splitResult.position);
            // Consume appropriate value from consumable values list.
            consumable.consume(viewItem, {
                name: true
            });
            const parts = conversionApi.getSplitParts(modelNode);
            // Set conversion result range.
            data.modelRange = writer.createRange(conversionApi.writer.createPositionBefore(modelNode), conversionApi.writer.createPositionAfter(parts[parts.length - 1]));
            // Now we need to check where the `modelCursor` should be.
            if (splitResult.cursorParent) {
                // If we split parent to insert our element then we want to continue conversion in the new part of the split parent.
                //
                // before: <allowed><notAllowed>foo[]</notAllowed></allowed>
                // after:  <allowed><notAllowed>foo</notAllowed><converted></converted><notAllowed>[]</notAllowed></allowed>
                data.modelCursor = conversionApi.writer.createPositionAt(splitResult.cursorParent, 0);
            } else {
                // Otherwise just continue after inserted element.
                data.modelCursor = data.modelRange.end;
            }
        });
        /**
     * Whether the given view <math> element has a LaTeX annotation element.
     * @param {*} math
     * @returns {bool}
     */ function mathIsLatex(math) {
            const semantics = math.getChild(0);
            if (!semantics || semantics.name !== "semantics") return false;
            for (const child of semantics.getChildren()){
                if (child.name === "annotation" && child.getAttribute("encoding") === "LaTeX") {
                    return true;
                }
            }
            return false;
        }
        function createViewWidget(modelItem, { writer: viewWriter }) {
            const widgetElement = viewWriter.createContainerElement("span", {
                class: "ck-math-widget"
            });
            const mathUIElement = createViewImage(modelItem, {
                writer: viewWriter
            }); // eslint-disable-line no-use-before-define
            if (mathUIElement) {
                viewWriter.insert(viewWriter.createPositionAt(widgetElement, 0), mathUIElement);
            }
            return toWidget(widgetElement, viewWriter);
        }
        function createViewImage(modelItem, { writer: viewWriter }) {
            const htmlDataProcessor = new HtmlDataProcessor(viewWriter.document);
            const formula = modelItem.getAttribute("formula");
            const htmlContent = modelItem.getAttribute("htmlContent");
            if (!formula && !htmlContent) {
                return null;
            }
            let imgElement = null;
            if (htmlContent) {
                imgElement = htmlDataProcessor.toView(htmlContent).getChild(0);
            } else if (formula) {
                const mathString = formula.replaceAll('ref="<"', 'ref="&lt;"');
                const imgHtml = Parser.initParse(mathString, integration.getLanguage());
                imgElement = htmlDataProcessor.toView(imgHtml).getChild(0);
                // Add HTML element (<img>) to model
                viewWriter.setAttribute("htmlContent", imgHtml, modelItem);
            }
            /* Although we use the HtmlDataProcessor to obtain the attributes,
        *  we must create a new EmptyElement which is independent of the
        *  DataProcessor being used by this editor instance
        */ if (imgElement) {
                return viewWriter.createEmptyElement("img", imgElement.getAttributes(), {
                    renderUnsafeAttributes: [
                        "src"
                    ]
                });
            }
            return null;
        }
        // Model -> Editing view
        editor.conversion.for("editingDowncast").elementToElement({
            model: "mathml",
            view: createViewWidget
        });
        // Model -> Data view
        editor.conversion.for("dataDowncast").elementToElement({
            model: "mathml",
            view: createDataString
        });
        /**
     * Makes a copy of the given view node.
     * @param {module:engine/view/node~Node} sourceNode Node to copy.
     * @returns {module:engine/view/node~Node} Copy of the node.
     */ function clone(viewWriter, sourceNode) {
            if (sourceNode.is("text")) {
                return viewWriter.createText(sourceNode.data);
            }
            if (sourceNode.is("element")) {
                if (sourceNode.is("emptyElement")) {
                    return viewWriter.createEmptyElement(sourceNode.name, sourceNode.getAttributes());
                }
                const element = viewWriter.createContainerElement(sourceNode.name, sourceNode.getAttributes());
                for (const child of sourceNode.getChildren()){
                    viewWriter.insert(viewWriter.createPositionAt(element, "end"), clone(viewWriter, child));
                }
                return element;
            }
            throw new Exception("Given node has unsupported type."); // eslint-disable-line no-undef
        }
        function createDataString(modelItem, { writer: viewWriter }) {
            const htmlDataProcessor = new HtmlDataProcessor(viewWriter.document);
            // Load img element
            let mathString = modelItem.getAttribute("htmlContent");
            const sourceMathElement = htmlDataProcessor.toView(mathString).getChild(0);
            return clone(viewWriter, sourceMathElement);
        }
        // This stops the view selection getting into the <span>s and messing up caret movement
        editor.editing.mapper.on("viewToModelPosition", viewToModelPositionOutsideModelElement(editor.model, (viewElement)=>viewElement.hasClass("ck-math-widget")));
        // Keep a reference to the original get and set function.
        editor.data;
        /**
     * Hack to transform $$latex$$ into <math> in editor.getData()'s output.
     */ editor.data.on("get", (e)=>{
            let output = e.return;
            const parsedResult = Parser.endParse(output);
            // Cleans all the semantics tag for safexml
            // including the handwritten data points
            e.return = MathML.removeSafeXMLSemantics(parsedResult);
        }, {
            priority: "low"
        });
        /**
     * Hack to transform <math> with LaTeX into $$LaTeX$$ and formula images in editor.setData().
     */ editor.data.on("set", (e, args)=>{
            // Retrieve the data to be set on the CKEditor.
            let modifiedData = args[0];
            // Regex to find all mathml formulas.
            const regexp = /(<img\b[^>]*>)|(<math(.*?)<\/math>)/gm;
            const formulas = [];
            let formula;
            // Both data.set from the source plugin and console command are taken into account as the data received is MathML or an image containing the MathML.
            while((formula = regexp.exec(modifiedData)) !== null){
                formulas.push(formula[0]);
            }
            // Loop to find LaTeX and formula images and replace the MathML for the both.
            formulas.forEach((formula)=>{
                if (formula.includes('encoding="LaTeX"')) {
                    // LaTeX found.
                    let latex = "$$$" + Latex.getLatexFromMathML(formula) + "$$$"; // We add $$$ instead of $$ because the replace function ignores one $.
                    modifiedData = modifiedData.replace(formula, latex);
                } else if (formula.includes("<img")) {
                    // If we found a formula image, we should find MathML data, and then substitute the entire image.
                    const regexp = /«math\b[^»]*»(.*?)«\/math»/g;
                    const safexml = formula.match(regexp);
                    if (safexml !== null) {
                        let decodeXML = MathML.safeXmlDecode(safexml[0]);
                        modifiedData = modifiedData.replace(formula, decodeXML);
                    }
                }
            });
            args[0] = modifiedData;
        }, {
            priority: "high"
        });
    }
    /**
   * Expose the WirisPlugin variable to the window
   */ // eslint-disable-next-line class-methods-use-this
    _exposeWiris() {
        window.WirisPlugin = {
            Core,
            Parser,
            Image,
            MathML,
            Util,
            Configuration,
            Listeners,
            IntegrationModel,
            currentInstance,
            Latex
        };
    }
}

export { MathType as default };
//# sourceMappingURL=index.js.map
