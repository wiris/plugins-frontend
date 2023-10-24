# Specification

## Object

*What is the object being specified?*

The viewer consists of a single minified JavaScript file ready to be included in a website.
The file has been historically called WIRISplugins.js.


## Distribution

*How can this object be obtained and used by our customers?*

The customers can include the JavaScript file using a `<script>` tag.
They have multiple options as to where this file resides.

- Directly from wiris.net. We serve the last two versions of the viewer as a static asset in wiris.net.
  The historical URLs of this asset are https://www.wiris.net/demo/plugins/app/WIRISplugins.js (for the latest version) and https://www.wiris.net/client/plugins/app/WIRISplugins.js (for the second to last version).
  These come, in fact, from the Java integration services that come with the WIRISplugins.js file included in them (see next bullet point).
- Distributed together with the integration services.
  The backend component of our plugins comes together with the WIRISplugins.js file so that the customer can include it from their own backend directly.
- As an npm package. The file is distributed, together with its source code, as an npm package.
  The publishing system can be the same as the one used for the rest of our npm packages that live in the html-integrations monorepo.


## Behavior

*What should this object do and how should it do it?*

When included in a web page and configured properly, the script will transform certain mathematical formulas into rendered images.
Only the formulas inside the HTML element specified by the `element` property should be transformed.
Whether it transforms them into PNG or SVG images is determined by the property `wirisimageformat`.
Depending on the value of the property `viewer`, just MathML formulas (`<math>` elements), or just LaTeX formulas (LaTeX-like formulas surrounded by `$$`), or both will be transformed.


### Architecture

The rendering process involves three pieces:

- The frontend script ("the viewer").
- The integration services.
  A series of endpoints in the backend of the customer.
  The customer can also choose not to host this part and use the integration services hosted in wiris.net instead as well, but then they won't be able to set the backend properties in the configuration.ini file.
- The editor services.
  A series of endpoints in wiris.net.
  These are the services that actually do the rendering and return the image content.

The viewer only ever calls the endpoints of the integration services, which in turn call the editor services.
Thus, throughout this document, all backend endpoints mentioned are part of the integration services.


### Rendering algorithm

The algorithm for obtaining the rendered images depends on the `wirispluginperformance` property.

If set to `false`, every request to render an image will make a call directly to the createimage endpoint, which returns the data for the image directly.

Otherwise, the algorithm goes throught two cache steps.

1. First, an MD5 hash of the formula is created.
  Then, the MD5 is used to call the showimage service from the integration services.
  The request formula's hash is included as URL parameters, so that the browser can use its cache to spare one call to the integration services.

2. If the browser cache misses, then the browser does actually perform the call to showimage.
  This might either return the image, if it is in the backend cache; or return a warning message, in which case the viewer will then call showimage again passing the whole formula via POST.
  Finally, the response should contain the image.

Once the viewer has obtained the image data, it creates the HTML `<img>` element, adding the following properties:

- `src`: as obtained from showimage.
- `role`: with constant value `math`.
- `class`: with constant value `Wirisformula`.
- `alt`: with the alternative text for the formula, provided by the mathml2accessible service.
- An attribute whose name is the value of the parameter `wiriseditormathmlattribute` and whose value is the original MathML of the formula.

Finally, the viewer replaces the original formula with this new image object.


### Properties

This section contains a reference of all the properties that affect the viewer's behavior.
There are a few different places where these properties can be set.
The place depends on each specific property.

- Backend.
  Set in the configuration.ini file of the customer.
- Frontend.
  There are two ways to set these properties.
  - Either by modifying the `Properties` object via JavaScript:

    ```html
    <script src="dist/WIRISplugins.js" defer></script>
    <script>
      window.document.addEventListener('viewerLoaded', () => {
        window.viewer.properties.key1 = value1;
        window.viewer.properties.key2 = value2;
        // ...
      });
    </script>
    ```

  - Or via URL in the included script (by appending `?key1=value1&key2=value2…`).
    This method is discouraged and deprecated, and only kept for retrocompatibility purposes.

The following table contains a specification of each of the properties.

| Name                       | Description                                                                                                                                                                                                                                                                                                                               | Place    | Possible values                                  | Default value                           |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------|-----------------------------------------|
| wiriseditormathmlattribute | The name of the HTML element attribute that will be used in the rendered img elements in order to store the original MathML. According to the HTML spec, it must begin with “data-” [ https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-* ].                                                                       | Backend  | data-*                                           | data-mathml                             |
| wirispluginperformance     | Whether to use the browser cache to render formulas.                                                                                                                                                                                                                                                                                      | Backend  | true, false                                      | true                                    |
| wirisimageformat           | Whether to return PNG or SVG formulas.                                                                                                                                                                                                                                                                                                    | Backend  | svg, png                                         | svg                                     |
| editorServicesRoot         | The URL base for the  showimage and createimage integration services. If distributed together with the backend services, this URL is determined by the backend technology. If distributed with npm, it takes as a default value the integration services from wiris.net. In any case, this parameter can be set manually in the frontend. | Frontend | URL                                              | https://www.wiris.net/demo/plugins/app/ |
| viewer                     | What should the viewer render exactly. none: do nothing image: render both MathML and LaTeX formulas mathml: render only MathML latex: render only LaTeX                                                                                                                                                                                  | Frontend | none, image, mathml, latex (mod capitalization)  | none                                    |
| element                    | A querySelector string that identifies the element in which the viewer should act.                                                                                                                                                                                                                                                        | Frontend |                                                  | document                                |
| lang                       | The language for the alt text.                                                                                                                                                                                                                                                                                                            | Frontend |                                                  | en                                      |
| dpi                        | Resolution in dots per inch of the generated image. This feature scales the formula with a factor of dpi/96.                                                                                                                                                                                                                              | Frontend | Positive integer                                 | 96                                      |
| zoom                       | The scale of the generated image.                                                                                                                                                                                                                                                                                                         | Frontend | Positive floating point number                   | 1                                       |


## API

The viewer exposes an API to the global window object with utilities related to rendering formulas.
This API is obsolete and will eventually be removed or replaced by a newer API.

All of the following methods are exposed inside of `window.com.wiris.js.JsPluginViewer` whenever the script is included in the page.

- `parseSafeMathMLElement`.
  Render all the formulas written in SafeMathML inside the given element.

  This method is deprecated.
  There is currently no replacement for rendering SafeMathML formulas.
  Please consider using {@link renderLatex} or {@link renderMathML}.

  Parameters:
  - {`HTMLElement`} `element` - Element wherein to render SafeMathML formulas.
  - `asynchronously` - Currently ignored, only included for retrocompatibility purposes.
  - `callbackFunc` - Currently ignored, only included for retrocompatibility purposes.

  Return: `void`.

- `parseDocument`.
  Render all the formulas in the document.

  This method is deprecated.
  Please consider using `renderMathML`.

  Parameters:
  - `asynchronously` - Currently ignored, only included for retrocompatibility purposes.
  - `callbackFunc` - Currently ignored, only included for retrocompatibility purposes.
  - `safeXml` - Currently ignored, only included for retrocompatibility purposes.

  Return: `Promise<void>`.

- `parseElement`.
  Render all the formulas inside the given element.

  This method is deprecated.
  Please consider using `renderMathML`.

  Parameters:
  - {`HTMLElement`} `element` - Element wherein to render formulas.
  - `asynchronously` - Currently ignored, only included for retrocompatibility purposes.
  - `callbackFunc` - Currently ignored, only included for retrocompatibility purposes.

  Return: `Promise<void>`.

- `parseLatexDocument`.
  Convert all the LaTeX formulas in the document to MathML.t

  This method is deprecated.
  Please consider using `renderLatex`.

  Parameters:
  - `asynchronously` - Currently ignored, only included for retrocompatibility purposes.
  - `callbackFunc` - Currently ignored, only included for retrocompatibility purposes.

  Return: `Promise<void>`.

- `parseLatexElement`.
  Convert all the LaTeX formulas inside the given element to MathML.

  This method is deprecated.
  Please consider using `renderLatex`.

  Parameters:
  - {`HTMLElement`} `element` - Element wherein to convert formulas.
  - `asynchronously` - Currently ignored, only included for retrocompatibility purposes.
  - `callbackFunc` - Currently ignored, only included for retrocompatibility purposes.

  Return: `Promise<void>`.
