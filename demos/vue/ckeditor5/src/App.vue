<template>
  <div id="app">
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="onEditorReady"></ckeditor>
  </div>
</template>

<script lang="ts">
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Link, SourceEditing } from "ckeditor5";
import "ckeditor5/ckeditor5.css";

// @ts-ignore
import MathType from "@wiris/mathtype-ckeditor5/dist/index.js";

// @ts-ignore
// Import the wiris plugin version.
import { version as pluginVersion } from "@wiris/mathtype-ckeditor5/package.json";

// @ts-ignore
// Load the file that contains common imports between demos. (functions, styles, etc)
import * as Generic from "resources/demos/vite-imports";

// Apply specific demo names to all the objects.
document.getElementById("header_title_name")!.innerHTML = "MathType for CKEditor 5 on Vue";
document.getElementById("version_editor")!.innerHTML = "CKEditor editor: ";

// Get and set the editor and wiris versions in this order.
Generic.setEditorAndWirisVersion("5.0.0", pluginVersion);

// Get the initial content.
const content = Generic.editorContentMathML;

const toolbar = ["bold", "italic", "link", "undo", "redo", "MathType", "ChemType", "sourceEditing"];
const plugins = [Essentials, Bold, Italic, Link, Paragraph, MathType, SourceEditing];
const editorConfig = {
  licenseKey: "GPL",
  iframe: true,
  charCounterCount: false,
  plugins,
  toolbar,
  htmlAllowedTags: [".*"],
  htmlAllowedAttrs: [".*"],
  htmlAllowedEmptyTags: ["mprescripts"],
  imageResize: false,
  useClasses: false,
};

// Function to call when the editor is initialyzed so it can add listeners on buttons.
function updateContent(ckeditor: ClassicEditor) {
  // Set the initial content on the bottom textArea.
  document.getElementById("transform_content")!.innerHTML = content;

  // Add listener on click button to launch updateContent function.
  document.getElementById("btn_update")!.addEventListener("click", (e) => {
    e.preventDefault();
    Generic.updateContent(ckeditor.getData(), "transform_content");
  });
}

export default {
  name: "#editor",
  data() {
    return {
      editor: ClassicEditor as {
        create: any;
      },
      editorData: content,
      editorConfig,
      onEditorReady: updateContent,
    };
  },
};
</script>
