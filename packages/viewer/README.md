# MathType Viewer

The MathType viewer renders all MathML and LaTeX-like formulas in a webpage using the MathType rendering engine.

## Usage

To use the MathType viewer in your page, just include the script `dist/WIRISplugins.js`:

```html
<script src="dist/WIRISplugins.js?viewer=image" defer></script>
```

When loading the page now, all MathML and LaTeX formulas should be displayed as images.


## Properties

The MathType viewer admits various properties.

They can be set like this:

```html
<script src="dist/WIRISplugins.js&viewer=image" defer></script>
<script>
  window.document.addEventListener('viewerLoaded', () => {
    window.viewer.properties.key1 = value1;
    window.viewer.properties.key2 = value2;
    // ...
  });
</script>
```


## Compilation

In case you want to compile the source code, you must install the NPM dependencies and then run Webpack.

First, run

```sh
yarn
```

to install the dependencies.
Then run

```sh
yarn build
```

to compile the package.
The output will be found in `dist/`.


## Documentation

For the whole specification, see [here](docs/spec.md).


## Privacy policy

The [MathType Privacy Policy](https://www.wiris.com/en/mathtype-privacy-policy/?utm_source=npmjs&utm_medium=referral) covers the data processing operations for the MathType users. It is an addendum of the company's general Privacy Policy and the [general Privacy Policy](https://www.wiris.com/en/privacy-policy?utm_source=npmjs&utm_medium=referral) still applies to MathType users.
