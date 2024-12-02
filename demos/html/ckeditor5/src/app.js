// Load scripts.
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Alignment, SourceEditing } from "ckeditor5";
import MathType from "@wiris/mathtype-ckeditor5/dist/index.js";

// Load styles.
import "./static/style.css";
import "ckeditor5/ckeditor5.css";

import packageInfo from "@wiris/mathtype-ckeditor5/package.json";

// Load the file that contains common imports between demos.
import * as Generic from "resources/demos/imports";

// Apply specific demo names to all the objects.
document.getElementById("header_title_name").innerHTML = "MathType for CKEditor 5 on HTML";
document.getElementById("version_editor").innerHTML = "CKEditor: ";

// Insert the initial content in the editor
document.getElementById("editor").innerHTML = Generic.editorContentMathML;

// Copy the editor content before initializing it.
// Currently disabled by decision of QA.
// Generic.copyContentFromxToy('editor', 'transform_content');

window.editor = null;

// Create the CKEditor 5.
ClassicEditor.create(document.querySelector("#editor"), {
  licenseKey: 'GPL',
  plugins: [Essentials, Paragraph, Bold, Italic, MathType, Alignment, SourceEditing],
  toolbar: [
    "bold",
    "italic",
    "MathType",
    "ChemType",
    "alignment:left",
    "alignment:center",
    "alignment:right",
    "sourceEditing",
  ],

  // language: 'de',
  // mathTypeParameters: {
  //   editorParameters: { language: 'es' }, // MathType config, including language
  // },
})
  .then((editor) => {
    window["editor"] = editor;
    // Add listener on click button to launch updateContent function.
    // document.getElementById('btn_update').addEventListener('click', (e) => {
    //   e.preventDefault();
    //   Generic.updateContent(editor.getData(), 'transform_content');
    // });

    // Get and set the editor and wiris versions in this order.
    Generic.setEditorAndWirisVersion("5.0.0", packageInfo.version);
    editor.editing.view.focus();
  })
  .catch((error) => {
    console.error(error.stack); //eslint-disable-line
  });

ClassicEditor.create(document.querySelector("#editor2"), {
  licenseKey: 'GPL',
  plugins: [Essentials, Paragraph, Bold, Italic, MathType, Alignment, SourceEditing],
  toolbar: [
    "bold",
    "italic",
    "MathType",
    "ChemType",
    "alignment:left",
    "alignment:center",
    "alignment:right",
    "sourceEditing",
  ],
  // language: 'de',
  // mathTypeParameters: {
  //   editorParameters: { language: 'es' }, // MathType config, including language
  // },
})
  .then((editor) => {
    window["editor2"] = editor;
    // Add listener on click button to launch updateContent function.
    // document.getElementById('btn_update').addEventListener('click', (e) => {
    //   e.preventDefault();
    //   Generic.updateContent(editor.getData(), 'transform_content');
    // });

    // Get and set the editor and wiris versions in this order.
    Generic.setEditorAndWirisVersion("5.0.0", packageInfo.version);
    editor.editing.view.focus();
  })
  .catch((error) => {
    console.error(error.stack); //eslint-disable-line
  });


document.getElementById("btn_update").addEventListener("click", (e) => {
  e.preventDefault();
  Generic.updateContent(window.editor.getData(), "transform_content");
});


function createDeleteButtons() {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.marginBottom = '20px'; // Space between buttons and content
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.justifyContent = 'center'; // Center buttons horizontally
  buttonsContainer.style.padding = '20px'; // Add padding around the buttons
  buttonsContainer.style.backgroundColor = '#f4f4f4'; // Light background to distinguish buttons area
  buttonsContainer.style.position = 'fixed'; // Keep buttons at the top
  buttonsContainer.style.top = '0'; // Stick to the top
  buttonsContainer.style.left = '0'; // Align to left
  buttonsContainer.style.width = '100%'; // Full width container
  buttonsContainer.style.zIndex = '1000'; // Ensure buttons are on top of other elements

  const editors = ['editor'];
  editors.forEach((editorId) => {
    const button = document.createElement('button');
    button.textContent = `Delete ${editorId}`;
    button.style.marginRight = '10px';
    button.style.padding = '10px 20px'; // Bigger buttons
    button.style.fontSize = '16px'; // Larger text
    button.style.cursor = 'pointer'; // Pointer cursor for better UX
    button.style.border = 'none';
    button.style.borderRadius = '5px'; // Rounded edges
    button.style.backgroundColor = '#007BFF'; // Primary button color
    button.style.color = 'white'; // White text
    button.onmouseover = () => button.style.backgroundColor = '#0056b3'; // Hover effect
    button.onmouseout = () => button.style.backgroundColor = '#007BFF'; // Restore color

    // Attach click event listener to delete the editor
    button.addEventListener('click', () => {
      const editorElement = document.querySelector(`#${editorId}`);
      if (window[editorId]) {
        // Destroy the editor instance
        window[editorId].destroy().then(() => {
          console.log(`${editorId} destroyed successfully.`);
          // Remove the editor container from the DOM
          editorElement.remove();
        }).catch(error => {
          console.error(`Error destroying ${editorId}:`, error);
        });
      }
    });

    buttonsContainer.appendChild(button);
  });

  document.body.appendChild(buttonsContainer);
}

createDeleteButtons()
