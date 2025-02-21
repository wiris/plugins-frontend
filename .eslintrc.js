module.exports = {
  plugins: ["import", "jsdoc", "@nx", "prettier"],
  extends: ["airbnb-base", "prettier"],
  parser: "@babel/eslint-parser", // Parser that'll help linting demos

  // Variables we use taking into account that our code will run with another one,
  // for example, the TinyMCE integration will use the TinyMCE variable created for the code of the editor but not us.
  // So we suppose that at the time we'll use our code, these variables will exist in another environment.
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    WirisPlugin: "readonly",
    tinymce: "readonly",
    CKEDITOR: "readonly",
    FroalaEditor: "readonly",
  }, // Variables that will be used in the code but are not declared in the code.
  parserOptions: {
    ecmaVersion: 6, // We use version-based naming instead of year-based naming.
    sourceType: "module", // This project's code is in ECMAScript modules.
  },
  rules: {
    // Change 'no-unresolved' to warn to avoid raising errors on node_modules imports.
    "import/no-unresolved": "warn",
    "max-len": [
      "error",
      {
        code: 200, // Increased max-len code lines
        ignoreComments: true, // Ignore comments and comments in code lines as we haven't established a conduct for these (TODO)
        ignoreTrailingComments: true,
      },
    ],
    "no-console": [
      // Throw error when console appears except with console warn and console error
      "error",
      {
        allow: ["warn", "error"],
      },
    ],
    eqeqeq: [
      // Make it smart: Use strict equality checks (=== and !==) except when comparing against null or undefined.
      "error",
      "smart",
    ],

    // Enable using functions without names for one only use...
    // TODO -> change this behavior int the future and create functions with names always if possible
    "func-names": ["error", "never"],
    "no-throw-literal": "off", // The behavior until now is to let it throw literals. TODO -> Change by the recommended
    "no-restricted-syntax": [
      // Disable restricted syntax on forin and forof loops. TODO -> Apply the recommended behavior if possible
      "error",
      "LabeledStatement",
      "WithStatement",
    ],
    "no-plusplus": [
      // Enable the use of ++ in for loops
      "error",
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    "no-mixed-operators": [
      // Define the operators that can not be mixed in the same statement of comparison
      "error",
      {
        groups: [
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["in", "instanceof"],
        ],
        allowSamePrecedence: true,
      },
    ],
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": [
      // Let the BROWSER_GLOBAL variable used in the jest configuration to have an underscore dangle (since it's a private var)
      "error",
      {
        allow: ["__BROWSER_GLOBAL__"],
      },
    ],
  },

  // Specific configuration for the packages folder
  overrides: [
    // 01. Custom rules for all packages.
    {
      files: ["packages/**/*.js"],
      rules: {
        "no-underscore-dangle": "off", // Enable private functions/vars to be preceded by an underscore dangle
        "no-param-reassign": "off", // Enable param re-assign
        "import/no-cycle": "off", // Enable having imported modules in files coming from devDependencies (testing purposes or other actions not needed to run the code properly)
        "no-shadow": "off", // Enable using as a parameter a variable with the same name as the one in the file.

        // Enable not having to declare object in a destructuring method so ypu can use them like this:
        // const local = this.props.local;
        // Instead of this:
        // const { local } = this.props;
        // TODO: Change behavior, as it's the same but the logic behind the preferable way is es6 friendly
        "prefer-destructuring": "off",
      },
      globals: {
        _wrs_int_wirisProperties: "readonly",
        event: "readonly",
        com: "readonly",
        ActiveXObject: "readonly",
      },
    },
    // 03. Custom rules for the packages with jsDoc support.
    {
      files: ["packages/mathtype-html-integration-devkit/src/*.js"],
      extends: ["plugin:jsdoc/recommended"],
    },
  ],
};
