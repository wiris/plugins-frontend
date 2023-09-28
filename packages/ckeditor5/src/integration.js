import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel';
import Util from '@wiris/mathtype-html-integration-devkit/src/util';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration';
import Latex from '@wiris/mathtype-html-integration-devkit/src/latex';
import MathML from '@wiris/mathtype-html-integration-devkit/src/mathml';
import Telemeter from '@wiris/mathtype-html-integration-devkit/src/telemeter';

/**
 * This class represents the MathType integration for CKEditor5.
 * @extends {IntegrationModel}
 */
export default class CKEditor5Integration extends IntegrationModel {
  constructor(ckeditorIntegrationModelProperties) {
    const editor = ckeditorIntegrationModelProperties.editorObject;

    if (typeof editor.config !== 'undefined' && typeof editor.config.get('mathTypeParameters') !== 'undefined') {
      ckeditorIntegrationModelProperties.integrationParameters = editor.config.get('mathTypeParameters');
    }
    /**
         * CKEditor5 Integration.
         *
         * @param {integrationModelProperties} integrationModelAttributes
         */
    super(ckeditorIntegrationModelProperties);

    /**
     * Folder name used for the integration inside CKEditor plugins folder.
     */
    this.integrationFolderName = 'ckeditor_wiris';
  }

  /**
     * @inheritdoc
     * @returns {string} - The CKEditor instance language.
     * @override
     */
  getLanguage() {
    // Returns the CKEDitor instance language taking into account that the language can be an object.
    // Try to get editorParameters.language, fail silently otherwise
    try {
      return this.editorParameters.language;
    } catch (e) {}
    const languageObject = this.editorObject.config.get('language');
    if (languageObject != null) {
      if (typeof (languageObject) === 'object') {
        // eslint-disable-next-line no-prototype-builtins
        if (languageObject.hasOwnProperty('ui')) {
          return languageObject.ui;
        } return languageObject;
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
     */
  addEditorListeners() {
    const editor = this.editorObject;

    if (typeof editor.config.wirislistenersdisabled === 'undefined'
      || !editor.config.wirislistenersdisabled) {
      this.checkElement();
    }
  }

  /**
     * Checks the current container and assign events in case that it doesn't have them.
     * CKEditor replaces several times the element element during its execution,
     * so we must assign the events again to editor element.
     */
  checkElement() {
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
     */
  doubleClickHandler(element, event) {
    this.core.editionProperties.dbclick = true;
    if (this.editorObject.isReadOnly === false) {
      if (element.nodeName.toLowerCase() === 'img') {
        if (Util.containsClass(element, Configuration.get('imageClassName'))) {
          // Some plugins (image2, image) open a dialog on Double-click. On formulas
          // doubleclick event ends here.
          if (typeof event.stopPropagation !== 'undefined') { // old I.E compatibility.
            event.stopPropagation();
          } else {
            event.returnValue = false;
          }
          this.core.getCustomEditors().disable();
          const customEditorAttr = element.getAttribute(Configuration.get('imageCustomEditorName'));
          if (customEditorAttr) {
            this.core.getCustomEditors().enable(customEditorAttr);
          }
          this.core.editionProperties.temporalImage = element;
          this.openExistingFormulaEditor();
        }
      }
    }
  }

  /** @inheritdoc */
  static getCorePath() {
    return null; // TODO
  }

  /** @inheritdoc */
  callbackFunction() {
    super.callbackFunction();
    this.addEditorListeners();
  }

  openNewFormulaEditor() {
    // Store the editor selection as it will be lost upon opening the modal
    this.core.editionProperties.selection = this.editorObject.editing.view.document.selection;

    return super.openNewFormulaEditor();
  }

  /**
     * Replaces old formula with new MathML or inserts it in caret position if new
     * @param {String} mathml MathML to update old one or insert
     * @returns {module:engine/model/element~Element} The model element corresponding to the inserted image
     */
  insertMathml(mathml) {
    // This returns the value returned by the callback function (writer => {...})
    return this.editorObject.model.change((writer) => {
      const core = this.getCore();

      const modelElementNew = writer.createElement('mathml', { formula: mathml });
      modelElementNew.data = mathml;

      // Obtain the DOM <span><img ... /></span> object corresponding to the formula
      if (core.editionProperties.isNewElement) {
        // Don't bother inserting anything at all if the MathML is empty.
        if (!mathml) return;

        const viewSelection = this.core.editionProperties.selection || this.editorObject.editing.view.document.selection;
        const modelPosition = this.editorObject.editing.mapper.toModelPosition(viewSelection.getLastPosition());

        // writer.setSelection(modelPosition);
        this.editorObject.model.insertObject(modelElementNew, modelPosition, null, { setSelection: 'after' });

        // Remove selection
        if (!viewSelection.isCollapsed) {
          for (const range of viewSelection.getRanges()) {
            writer.remove(this.editorObject.editing.mapper.toModelRange(range));
          }
        }

        // Set carret after the formula
        // const position = this.editorObject.model.createPositionAfter(modelElementNew);
        // writer.setSelection(position);
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
     */
  findText(viewElement) { // eslint-disable-line consistent-return
    // mapper always converts text nodes to *new* model elements so we need to convert the text's parents and then come back down
    let pivot = viewElement;
    let element;
    while (!element) {
      element = this.editorObject.editing.mapper.toModelElement(
        this.editorObject.editing.view.domConverter.domToView(
          pivot,
        ),
      );
      pivot = pivot.parentElement;
    }

    // Navigate through all the subtree under `pivot` in order to find the correct text node
    const range = this.editorObject.model.createRangeIn(element);
    const descendants = Array.from(range.getItems());
    for (const node of descendants) {
      let viewElementData = viewElement.data;
      if (viewElement.nodeType === 3) {
        // Remove invisible white spaces
        viewElementData = viewElementData.replaceAll(String.fromCharCode(8288), '')
      }
      if (node.is('textProxy') && node.data === viewElementData.replace(String.fromCharCode(160), ' ')) {
        return node.textNode;
      }
    }
  }

  /** @inheritdoc */
  insertFormula(focusElement, windowTarget, mathml, wirisProperties) { // eslint-disable-line no-unused-vars
    const returnObject = {};

    let mathmlOrigin;
    if (!mathml) {
      this.insertMathml('');
    } else if (this.core.editMode === 'latex') {
      returnObject.latex = Latex.getLatexFromMathML(mathml);
      returnObject.node = windowTarget.document.createTextNode(`$$${returnObject.latex}$$`);

      this.editorObject.model.change((writer) => {
        const { latexRange } = this.core.editionProperties;

        const startNode = this.findText(latexRange.startContainer);
        const endNode = this.findText(latexRange.endContainer);

        let startPosition = writer.createPositionAt(startNode.parent, startNode.startOffset + latexRange.startOffset);
        let endPosition = writer.createPositionAt(endNode.parent, endNode.startOffset + latexRange.endOffset);

        let range = writer.createRange(
          startPosition,
          endPosition,
        );



        // When Latex is next to image/formula.
        if (latexRange.startContainer.nodeType === 3 && latexRange.startContainer.previousSibling?.nodeType === 1) {
          // Get the position of the latex to be replaced.
          let latexEdited = '$$' +(Latex.getLatexFromMathML(MathML.safeXmlDecode(this.core.editionProperties.temporalImage.dataset.mathml))) + '$$';
          let data = latexRange.startContainer.data;

          // Remove invisible characters.
          data = data.replaceAll(String.fromCharCode(8288), '')

          // Get to the start of the latex we are editing.
          let offset = data.indexOf(latexEdited);
          let dataOffset = data.substring(offset);
          let second$ = dataOffset.substring(2).indexOf("$$") + 4;
          let substring = dataOffset.substr(0, second$);
          data = data.replace(substring, '');

          if (!data) {
            startPosition = writer.createPositionBefore(startNode);
            range = startNode;
          } else {
            startPosition = startPosition = writer.createPositionAt(startNode.parent, startNode.startOffset + offset);
            endPosition = writer.createPositionAt(endNode.parent, endNode.startOffset + second$ + offset);
            range = writer.createRange(
              startPosition,
              endPosition,
            );
          }
        }

        writer.remove(range);
        writer.insertText(`$$${returnObject.latex}$$`, startNode.getAttributes(), startPosition);
      });
    } else {
      mathmlOrigin = this.core.editionProperties.temporalImage?.dataset.mathml;
      try {
        returnObject.node = this.editorObject.editing.view.domConverter.viewToDom(
          this.editorObject.editing.mapper.toViewElement(
            this.insertMathml(mathml),
          ), windowTarget.document,
        );
      } catch (e) {
        const x = e.toString();
        if ((x).includes("CKEditorError: Cannot read property 'parent' of undefined")) {
          this.core.modalDialog.cancelAction();
        }
      }
    }

    // Build the telemeter payload separated to delete null/undefined entries.
    let payload = {
      mathml_origin: mathmlOrigin ? MathML.safeXmlDecode(mathmlOrigin) : mathmlOrigin,
      mathml: mathml ? MathML.safeXmlDecode(mathml) : mathml,
      elapsed_time: Date.now() - this.core.editionProperties.editionStartTime,
      editor_origin: null, // TODO read formula to find out whether it comes from Oxygen Desktop
      toolbar: this.core.modalDialog.contentManager.toolbar,
      size: mathml?.length,
    };

    // Remove desired null keys.
    Object.keys(payload).forEach(key => {
      if (key === 'mathml_origin' || key === 'editor_origin') !payload[key] ? delete payload[key] : {}
    });

    try {
      Telemeter.telemeter.track("INSERTED_FORMULA", {
        ...payload,
      });
    } catch (err) {
      console.error(err);
    }

    /* Due to PLUGINS-1329, we add the onChange event to the CK4 insertFormula.
        We probably should add it here as well, but we should look further into how */
    // this.editorObject.fire('change');

    // Remove temporal image of inserted formula
    this.core.editionProperties.temporalImage = null;

    return returnObject;
  }

  /**
     * Function called when the content submits an action.
     */
  notifyWindowClosed() {
    this.editorObject.editing.view.focus();
  }
}
