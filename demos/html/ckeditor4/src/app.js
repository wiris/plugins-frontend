// Load styles.
import "./static/style.css";

// Load the file that contains common imports between demos.
import * as Generic from "resources/demos/imports";

// Apply specific demo names to all the objects.
document.getElementById("header_title_name").innerHTML = "MathType for CKEditor 4 on HTML";
document.getElementById("version_editor").innerHTML = "CKEditor: ";

// Copy the editor content before initializing it.
// Currently disabled by decision of QA.
// document.getElementById('transform_content').innerHTML = Generic.editorContentImg;

// Add wiris plugin.
CKEDITOR.plugins.addExternal(
  "ckeditor_wiris",
  `${window.location.href}node_modules/@wiris/mathtype-ckeditor4/`,
  "plugin.js",
); //eslint-disable-line

// Initialize plugin.
CKEDITOR.replace("editor", {
  //eslint-disable-line
  extraPlugins: "ckeditor_wiris",
  // Allow MathML content.
  allowedContent: true,
  toolbar: [
    { name: "basicstyles", items: ["Bold", "Italic", "Strike"] },
    { name: "clipboard", items: ["Undo", "Redo"] },
    {
      name: "wirisplugins",
      items: ["ckeditor_wiris_formulaEditor", "ckeditor_wiris_formulaEditorChemistry"],
    },
    { name: "others" },
  ],

  licenseKey: process.env.CKEDITOR4_API_KEY || "",
  // language: 'de',
  // mathTypeParameters: {
  //   editorParameters: { language: 'es' }, // MathType config, including language
  // },
});

// Handle on editor ready event.
CKEDITOR.on("instanceReady", () => {
  //eslint-disable-line
  // Get and set the editor and wiris versions in this order.
  Generic.setEditorAndWirisVersion(CKEDITOR.version, WirisPlugin.currentInstance.version); //eslint-disable-line
});

CKEDITOR.instances.editor.on("instanceReady", (evt) => {
  evt.editor.setData(Generic.editorContentImg);
});

// Add listener on click button to launch updateContent function.
document.getElementById("btn_update").addEventListener("click", (e) => {
  e.preventDefault();
  Generic.updateContent(CKEDITOR.instances.editor.getData(), "transform_content"); //eslint-disable-line
});
