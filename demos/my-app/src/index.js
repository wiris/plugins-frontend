import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { wrsInitEditor } from "@wiris/mathtype-generic/wirisplugin-generic.src";
import "@wiris/mathtype-generic/wirisplugin-generic";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Toolbar() {
  return <div id="toolbar"></div>;
}

function HtmlEditor(props) {
  return (
    <div
      id="htmlEditor"
      contentEditable="true"
      dangerouslySetInnerHTML={{ __html: props.data }}
    ></div>
  );
}

class Editor extends Component {
  componentDidMount() {
    // Dynamically load WIRIS plugins script
    const jsDemoImagesTransform = document.createElement("script");
    jsDemoImagesTransform.type = "text/javascript";
    jsDemoImagesTransform.src =
      "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
    document.head.appendChild(jsDemoImagesTransform);

    const editableDiv = document.getElementById("htmlEditor");
    const toolbarDiv = document.getElementById("toolbar");

    // Initialize the editor after the DOM has been loaded
    wrsInitEditor(editableDiv, toolbarDiv);
  }

  render() {
    return (
      <>
        <Toolbar key={0} />
        <HtmlEditor key={1} data={""} />
      </>
    );
  }
}

// Use React StrictMode for development best practices
root.render(
  <React.StrictMode>
    <Editor />
  </React.StrictMode>
);

// Optional: log performance metrics
reportWebVitals();
