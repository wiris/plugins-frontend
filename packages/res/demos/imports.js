// Import styles.
import "./design.css";

// Export generic functions.
// eslint-disable-next-line import/extensions
export * from "./common.js";

// Display html content.
// We force the use of html-loader, for angular and react applications.
// const htmlModule = require("html-loader!./index.html");

// Since html-loader versions 2.0.0, it returns a module with its default valude beeing the html.
// const htmlBody = htmlModule.default;
// document.body.innerHTML = htmlBody;

// Generate scripts.
const jsDemoImagesTransform = document.createElement("script");
jsDemoImagesTransform.type = "text/javascript";
jsDemoImagesTransform.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);
