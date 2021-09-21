// Load scripts.
import '@wiris/mathtype-ckeditor4/plugin';

// Load styles.
import './static/style.css';

// Load the file that contains common imports between demos.
import * as Generic from '../../../../resources/demos/imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for CKEditor';
document.getElementById('version_editor').innerHTML = 'CKEditor editor: ';

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editor', 'transform_content');

// Add wiris plugin.
CKEDITOR.plugins.addExternal('ckeditor_wiris', `${window.location.href}node_modules/@wiris/mathtype-ckeditor4/`, 'plugin.js'); //eslint-disable-line

// Initialize plugin.
CKEDITOR.replace('editor', { //eslint-disable-line
  extraPlugins: 'ckeditor_wiris',
  // Allow MathML content.
  allowedContent: true,
  toolbar: [
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike'] },
    { name: 'clipboard', items: ['Undo', 'Redo'] },
    { name: 'wirisplugins', items: ['ckeditor_wiris_formulaEditor', 'ckeditor_wiris_formulaEditorChemistry'] },
    { name: 'others' },
  ],
  // language: 'de',
  // mathTypeParameters: {
  //   editorParameters: { language: 'es' }, // MathType config, including language
  // },
});

// Handle on editor ready event.
CKEDITOR.on('instanceReady', function() {                     //eslint-disable-line
  // Get and set the editor and wiris versions in this order.
  Generic.setEditorAndWirisVersion(CKEDITOR.version, WirisPlugin.currentInstance.version);          //eslint-disable-line
});

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(CKEDITOR.instances.editor.getData(), 'transform_content');                  //eslint-disable-line
});
