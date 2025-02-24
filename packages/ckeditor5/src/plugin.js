// CKEditor imports
import { Plugin } from "ckeditor5/src/core.js";
import { ButtonView } from "ckeditor5/src/ui.js";
import { ClickObserver, HtmlDataProcessor, XmlDataProcessor, UpcastWriter } from "ckeditor5/src/engine.js";
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from "ckeditor5/src/widget.js";

// MathType API imports
import IntegrationModel from "@wiris/mathtype-html-integration-devkit/src/integrationmodel.js";
import Core from "@wiris/mathtype-html-integration-devkit/src/core.src.js";
import Parser from "@wiris/mathtype-html-integration-devkit/src/parser.js";
import Util from "@wiris/mathtype-html-integration-devkit/src/util.js";
import Image from "@wiris/mathtype-html-integration-devkit/src/image.js";
import Configuration from "@wiris/mathtype-html-integration-devkit/src/configuration.js";
import Listeners from "@wiris/mathtype-html-integration-devkit/src/listeners.js";
import MathML from "@wiris/mathtype-html-integration-devkit/src/mathml.js";
import Latex from "@wiris/mathtype-html-integration-devkit/src/latex.js";
import StringManager from "@wiris/mathtype-html-integration-devkit/src/stringmanager.js";

// Local imports
import { MathTypeCommand, ChemTypeCommand } from "./commands.js";
import CKEditor5Integration from "./integration.js";

import mathIcon from "../theme/icons/ckeditor5-formula.svg";
import chemIcon from "../theme/icons/ckeditor5-chem.svg";

import packageInfo from "../package.json";

export let currentInstance = null; // eslint-disable-line import/no-mutable-exports

export default class MathType extends Plugin {
  static get requires() {
    return [Widget];
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
   */
  destroy() {
    if (currentInstance) {
      // eslint-disable-line class-methods-use-this
      currentInstance.destroy();
    }
  }

  /**
   * Create the MathType API Integration object
   * @returns {CKEditor5Integration} the integration object
   */
  _addIntegration() {
    const { editor } = this;

    /**
     * Integration model constructor attributes.
     * @type {integrationModelProperties}
     */
    const integrationProperties = {};
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
    // To avoid a wrong behavior, this integration only starts if the workspace container exists.
    let integration;
    if (integrationProperties.target) {
      // Instance of the integration associated to this editor instance
      integration = new CKEditor5Integration(integrationProperties);
      integration.init();
      integration.listeners.fire("onTargetReady", {});

      integration.checkElement();

      this.listenTo(
        editor.editing.view.document,
        "click",
        (evt, data) => {
          // Is Double-click
          if (data.domEvent.detail === 2) {
            integration.doubleClickHandler(data.domTarget, data.domEvent);
            evt.stop();
          }
        },
        { priority: "highest" },
      );
    }

    return integration;
  }

  /**
   * Add the MathType and ChemType commands to the editor
   */
  _addCommands() {
    const { editor } = this;

    // Add command to open the formula editor
    editor.commands.add("MathType", new MathTypeCommand(editor));

    // Add command to open the chemistry formula editor
    editor.commands.add("ChemType", new ChemTypeCommand(editor));
  }

  /**
   * Add the buttons for MathType and ChemType
   * @param {CKEditor5Integration} integration the integration object
   */
  _addViews(integration) {
    const { editor } = this;

    // Check if MathType editor is enabled
    if (Configuration.get("editorEnabled")) {
      // Add button for the formula editor
      editor.ui.componentFactory.add("MathType", (locale) => {
        const view = new ButtonView(locale);

        // View is enabled iff command is enabled
        view.bind("isEnabled").to(editor.commands.get("MathType"), "isEnabled");
        view.set({
          label: StringManager.get("insert_math", integration.getLanguage()),
          icon: mathIcon,
          tooltip: true,
        });

        // Callback executed once the image is clicked.
        view.on("execute", () => {
          editor.execute("MathType", {
            integration, // Pass integration as parameter
          });
        });

        return view;
      });
    }

    // Check if ChemType editor is enabled
    if (Configuration.get("chemEnabled")) {
      // Add button for the chemistry formula editor
      editor.ui.componentFactory.add("ChemType", (locale) => {
        const view = new ButtonView(locale);

        // View is enabled iff command is enabled
        view.bind("isEnabled").to(editor.commands.get("ChemType"), "isEnabled");

        view.set({
          label: StringManager.get("insert_chem", integration.getLanguage()),
          icon: chemIcon,
          tooltip: true,
        });

        // Callback executed once the image is clicked.
        view.on("execute", () => {
          editor.execute("ChemType", {
            integration, // Pass integration as parameter
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
   */
  _addSchema() {
    const { schema } = this.editor.model;

    schema.register("mathml", {
      inheritAllFrom: "$inlineObject",
      allowAttributes: ["formula", "htmlContent"],
    });
  }

  /**
   * Add the downcast and upcast converters
   */
  _addConverters(integration) {
    const { editor } = this;

    // Editing view -> Model
    editor.conversion.for("upcast").elementToElement({
      view: {
        name: "span",
        classes: "ck-math-widget",
      },
      model: (viewElement, { writer: modelWriter }) => {
        const formula = MathML.safeXmlDecode(viewElement.getChild(0).getAttribute("data-mathml"));
        return modelWriter.createElement("mathml", {
          formula,
        });
      },
    });

    // Data view -> Model
    editor.data.upcastDispatcher.on("element:math", (evt, data, conversionApi) => {
      const { consumable, writer } = conversionApi;
      const { viewItem } = data;

      // When element was already consumed then skip it.
      if (!consumable.test(viewItem, { name: true })) {
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
      const mathAttributes = [...viewItem.getAttributes()].map(([key, value]) => ` ${key}="${value}"`).join("");

      // We process the document fragment
      let formula = processor.toData(viewDocumentFragment) || "";

      // And obtain the complete formula
      formula = Util.htmlSanitize(`<math${mathAttributes}>${formula}</math>`);

      // Replaces the < & > characters to its HTMLEntity to avoid render issues.
      formula = formula.replaceAll('"<"', '"&lt;"').replaceAll('">"', '"&gt;"').replaceAll("><<", ">&lt;<");

      /* Model node that contains what's going to actually be inserted. This can be either:
            - A <mathml> element with a formula attribute set to the given formula, or
            - If the original <math> had a LaTeX annotation, then the annotation surrounded by "$$...$$" */
      const modelNode = isLatex
        ? writer.createText(Parser.initParse(formula, integration.getLanguage()))
        : writer.createElement("mathml", { formula });

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
      consumable.consume(viewItem, { name: true });

      const parts = conversionApi.getSplitParts(modelNode);

      // Set conversion result range.
      data.modelRange = writer.createRange(
        conversionApi.writer.createPositionBefore(modelNode),
        conversionApi.writer.createPositionAfter(parts[parts.length - 1]),
      );

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
    editor.data.upcastDispatcher.on("element:img", (evt, data, conversionApi) => {
      const { consumable, writer } = conversionApi;
      const { viewItem } = data;

      // Only upcast when is wiris formula
      if (viewItem.getClassNames().next().value !== "Wirisformula") {
        return;
      }

      const mathAttributes = [...viewItem.getAttributes()].map(([key, value]) => ` ${key}="${value}"`).join("");
      let htmlContent = Util.htmlSanitize(`<img${mathAttributes}>`);

      const modelNode = writer.createElement("mathml", { htmlContent });

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
      consumable.consume(viewItem, { name: true });

      const parts = conversionApi.getSplitParts(modelNode);

      // Set conversion result range.
      data.modelRange = writer.createRange(
        conversionApi.writer.createPositionBefore(modelNode),
        conversionApi.writer.createPositionAfter(parts[parts.length - 1]),
      );

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
     */
    function mathIsLatex(math) {
      const semantics = math.getChild(0);
      if (!semantics || semantics.name !== "semantics") return false;
      for (const child of semantics.getChildren()) {
        if (child.name === "annotation" && child.getAttribute("encoding") === "LaTeX") {
          return true;
        }
      }
      return false;
    }

    function createViewWidget(modelItem, { writer: viewWriter }) {
      const widgetElement = viewWriter.createContainerElement("span", {
        class: "ck-math-widget",
      });

      const mathUIElement = createViewImage(modelItem, { writer: viewWriter }); // eslint-disable-line no-use-before-define

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
       */
      if (imgElement) {
        return viewWriter.createEmptyElement("img", imgElement.getAttributes(), {
          renderUnsafeAttributes: ["src"],
        });
      }

      return null;
    }

    // Model -> Editing view
    editor.conversion.for("editingDowncast").elementToElement({
      model: "mathml",
      view: createViewWidget,
    });

    // Model -> Data view
    editor.conversion.for("dataDowncast").elementToElement({
      model: "mathml",
      view: createDataString, // eslint-disable-line no-use-before-define
    });

    /**
     * Makes a copy of the given view node.
     * @param {module:engine/view/node~Node} sourceNode Node to copy.
     * @returns {module:engine/view/node~Node} Copy of the node.
     */
    function clone(viewWriter, sourceNode) {
      if (sourceNode.is("text")) {
        return viewWriter.createText(sourceNode.data);
      }
      if (sourceNode.is("element")) {
        if (sourceNode.is("emptyElement")) {
          return viewWriter.createEmptyElement(sourceNode.name, sourceNode.getAttributes());
        }
        const element = viewWriter.createContainerElement(sourceNode.name, sourceNode.getAttributes());
        for (const child of sourceNode.getChildren()) {
          viewWriter.insert(viewWriter.createPositionAt(element, "end"), clone(viewWriter, child));
        }
        return element;
      }

      throw new Exception("Given node has unsupported type."); // eslint-disable-line no-undef
    }

    function createDataString(modelItem, { writer: viewWriter }) {
      const htmlDataProcessor = new HtmlDataProcessor(viewWriter.document);

      // Load img element
      let mathString =
        modelItem.getAttribute("htmlContent") || Parser.endParseSaveMode(modelItem.getAttribute("formula"));

      const sourceMathElement = htmlDataProcessor.toView(mathString).getChild(0);

      return clone(viewWriter, sourceMathElement);
    }

    // This stops the view selection getting into the <span>s and messing up caret movement
    editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement(editor.model, (viewElement) => viewElement.hasClass("ck-math-widget")),
    );

    // Keep a reference to the original get and set function.
    const { get, set } = editor.data;

    /**
     * Hack to transform $$latex$$ into <math> in editor.getData()'s output.
     */
    editor.data.on(
      "get",
      (e) => {
        let output = e.return;
        const parsedResult = Parser.endParse(output);

        // Cleans all the semantics tag for safexml
        // including the handwritten data points
        e.return = MathML.removeSafeXMLSemantics(parsedResult);
      },
      { priority: "low" },
    );

    /**
     * Hack to transform <math> with LaTeX into $$LaTeX$$ and formula images in editor.setData().
     */
    editor.data.on(
      "set",
      (e, args) => {
        // Retrieve the data to be set on the CKEditor.
        let modifiedData = args[0];
        // Regex to find all mathml formulas.
        const regexp = /(<img\b[^>]*>)|(<math(.*?)<\/math>)/gm;
        const formulas = [];
        let formula;

        // Both data.set from the source plugin and console command are taken into account as the data received is MathML or an image containing the MathML.
        while ((formula = regexp.exec(modifiedData)) !== null) {
          formulas.push(formula[0]);
        }

        // Loop to find LaTeX and formula images and replace the MathML for the both.
        formulas.forEach((formula) => {
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
      },
      { priority: "high" },
    );
  }

  /**
   * Expose the WirisPlugin variable to the window
   */
  // eslint-disable-next-line class-methods-use-this
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
      Latex,
    };
  }
}
