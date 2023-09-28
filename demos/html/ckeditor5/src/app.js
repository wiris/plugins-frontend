// Load scripts.
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import MathType from '@wiris/mathtype-ckeditor5/src/plugin';
import Font from '@ckeditor/ckeditor5-font/src/font';
import { Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar } from '@ckeditor/ckeditor5-image';

// Load styles.
import './static/style.css';

import packageInfo from '@wiris/mathtype-ckeditor5/package.json';

// Load the file that contains common imports between demos.
import * as Generic from 'resources/demos/imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'MathType for CKEditor 5 on HTML';
document.getElementById('version_editor').innerHTML = 'CKEditor editor: ';

// Insert the initial content in the editor
document.getElementById('editor').innerHTML = Generic.editorContentMathML;

// Copy the editor content before initializing it.
// Currently disabled by decision of QA.
// Generic.copyContentFromxToy('editor', 'transform_content');

window.editor = null;

// Create the CKEditor 5.
ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [Essentials, Paragraph, Bold, Italic, MathType, Alignment, Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, Font],
    toolbar: ['fontFamily','bold', 'italic', 'MathType', 'ChemType', 'alignment:left', 'alignment:center', 'alignment:right', 'imageStyle:block',
    'imageStyle:side',
    '|',
    'toggleImageCaption',
    'imageTextAlternative'],
    // language: 'de',
    // mathTypeParameters: {
    //   editorParameters: { language: 'es' }, // MathType config, including language
    // },
    fontFamily: {
      options: [
          'default',
          'Ubuntu, Arial, sans-serif',
          'Ubuntu Mono, Courier New, Courier, monospace'
      ]
  },

  })
  .then((editor) => {
    window.editor = editor;
    // Add listener on click button to launch updateContent function.
    // document.getElementById('btn_update').addEventListener('click', (e) => {
    //   e.preventDefault();
    //   Generic.updateContent(editor.getData(), 'transform_content');
    // });

    // Get and set the editor and wiris versions in this order.
    Generic.setEditorAndWirisVersion('5.0.0', packageInfo.version);
    editor.editing.view.focus();
    // updateFunction();
  })
  .catch((error) => {
    console.error(error.stack); //eslint-disable-line
  });

document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(window.editor.getData(), 'transform_content');
});
