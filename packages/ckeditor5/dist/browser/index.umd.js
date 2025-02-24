(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ckeditor5')) :
  typeof define === 'function' && define.amd ? define(['ckeditor5'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["@wiris/mathtype-ckeditor5"] = factory(global.CKEDITOR));
})(this, (function (ckeditor5) { 'use strict';

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  /*! @license DOMPurify 3.2.4 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.4/LICENSE */

  const {
    entries,
    setPrototypeOf,
    isFrozen,
    getPrototypeOf,
    getOwnPropertyDescriptor
  } = Object;
  let {
    freeze,
    seal,
    create
  } = Object; // eslint-disable-line import/no-mutable-exports
  let {
    apply,
    construct
  } = typeof Reflect !== 'undefined' && Reflect;
  if (!freeze) {
    freeze = function freeze(x) {
      return x;
    };
  }
  if (!seal) {
    seal = function seal(x) {
      return x;
    };
  }
  if (!apply) {
    apply = function apply(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }
  if (!construct) {
    construct = function construct(Func, args) {
      return new Func(...args);
    };
  }
  const arrayForEach = unapply(Array.prototype.forEach);
  const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
  const arrayPop = unapply(Array.prototype.pop);
  const arrayPush = unapply(Array.prototype.push);
  const arraySplice = unapply(Array.prototype.splice);
  const stringToLowerCase = unapply(String.prototype.toLowerCase);
  const stringToString = unapply(String.prototype.toString);
  const stringMatch = unapply(String.prototype.match);
  const stringReplace = unapply(String.prototype.replace);
  const stringIndexOf = unapply(String.prototype.indexOf);
  const stringTrim = unapply(String.prototype.trim);
  const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
  const regExpTest = unapply(RegExp.prototype.test);
  const typeErrorCreate = unconstruct(TypeError);
  /**
   * Creates a new function that calls the given function with a specified thisArg and arguments.
   *
   * @param func - The function to be wrapped and called.
   * @returns A new function that calls the given function with a specified thisArg and arguments.
   */
  function unapply(func) {
    return function (thisArg) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return apply(func, thisArg, args);
    };
  }
  /**
   * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
   *
   * @param func - The constructor function to be wrapped and called.
   * @returns A new function that constructs an instance of the given constructor function with the provided arguments.
   */
  function unconstruct(func) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return construct(func, args);
    };
  }
  /**
   * Add properties to a lookup table
   *
   * @param set - The set to which elements will be added.
   * @param array - The array containing elements to be added to the set.
   * @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
   * @returns The modified set with added elements.
   */
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) {
      // Make 'in' and truthy checks like Boolean(set.constructor)
      // independent of any properties defined on Object.prototype.
      // Prevent prototype setters from intercepting set as a this value.
      setPrototypeOf(set, null);
    }
    let l = array.length;
    while (l--) {
      let element = array[l];
      if (typeof element === 'string') {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          // Config presets (e.g. tags.js, attrs.js) are immutable.
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  /**
   * Clean up an array to harden against CSPP
   *
   * @param array - The array to be cleaned.
   * @returns The cleaned version of the array
   */
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) {
      const isPropertyExist = objectHasOwnProperty(array, index);
      if (!isPropertyExist) {
        array[index] = null;
      }
    }
    return array;
  }
  /**
   * Shallow clone an object
   *
   * @param object - The object to be cloned.
   * @returns A new object that copies the original.
   */
  function clone(object) {
    const newObject = create(null);
    for (const [property, value] of entries(object)) {
      const isPropertyExist = objectHasOwnProperty(object, property);
      if (isPropertyExist) {
        if (Array.isArray(value)) {
          newObject[property] = cleanArray(value);
        } else if (value && typeof value === 'object' && value.constructor === Object) {
          newObject[property] = clone(value);
        } else {
          newObject[property] = value;
        }
      }
    }
    return newObject;
  }
  /**
   * This method automatically checks if the prop is function or getter and behaves accordingly.
   *
   * @param object - The object to look up the getter function in its prototype chain.
   * @param prop - The property name for which to find the getter function.
   * @returns The getter function found in the prototype chain or a fallback function.
   */
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }
        if (typeof desc.value === 'function') {
          return unapply(desc.value);
        }
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }

  const html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);
  const svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
  const svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);
  // List of SVG elements that are disallowed by default.
  // We still need to know them so that we can do namespace
  // checks properly in case one wants to add them to
  // allow-list.
  const svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
  const mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'mprescripts']);
  // Similarly to SVG, we want to know all MathML elements,
  // even those that we disallow by default.
  const mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
  const text = freeze(['#text']);

  const html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'popover', 'popovertarget', 'popovertargetaction', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'wrap', 'xmlns', 'slot']);
  const svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'amplitude', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'exponent', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'intercept', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'slope', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'tablevalues', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
  const mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
  const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

  // eslint-disable-next-line unicorn/better-regex
  const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
  const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
  const TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm); // eslint-disable-line unicorn/better-regex
  const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
  const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
  const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
  );
  const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
  );
  const DOCTYPE_NAME = seal(/^html$/i);
  const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);

  var EXPRESSIONS = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ARIA_ATTR: ARIA_ATTR,
    ATTR_WHITESPACE: ATTR_WHITESPACE,
    CUSTOM_ELEMENT: CUSTOM_ELEMENT,
    DATA_ATTR: DATA_ATTR,
    DOCTYPE_NAME: DOCTYPE_NAME,
    ERB_EXPR: ERB_EXPR,
    IS_ALLOWED_URI: IS_ALLOWED_URI,
    IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
    MUSTACHE_EXPR: MUSTACHE_EXPR,
    TMPLIT_EXPR: TMPLIT_EXPR
  });

  /* eslint-disable @typescript-eslint/indent */
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  const NODE_TYPE = {
    element: 1,
    text: 3,
    // Deprecated
    progressingInstruction: 7,
    comment: 8,
    document: 9};
  const getGlobal = function getGlobal() {
    return typeof window === 'undefined' ? null : window;
  };
  /**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param trustedTypes The policy factory.
   * @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
   * @return The policy created (or null, if Trusted Types
   * are not supported or creating the policy failed).
   */
  const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
      return null;
    }
    // Allow the callers to control the unique policy name
    // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
    // Policy creation with duplicate names throws in Trusted Types.
    let suffix = null;
    const ATTR_NAME = 'data-tt-policy-suffix';
    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
      suffix = purifyHostElement.getAttribute(ATTR_NAME);
    }
    const policyName = 'dompurify' + (suffix ? '#' + suffix : '');
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html) {
          return html;
        },
        createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_) {
      // Policy creation failed (most likely another DOMPurify script has
      // already run). Skip creating the policy, as this will only cause errors
      // if TT are enforced.
      console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
      return null;
    }
  };
  const _createHooksMap = function _createHooksMap() {
    return {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: []
    };
  };
  function createDOMPurify() {
    let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();
    const DOMPurify = root => createDOMPurify(root);
    DOMPurify.version = '3.2.4';
    DOMPurify.removed = [];
    if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
      // Not running in a browser, provide a factory function
      // so that you can pass your own Window
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let {
      document
    } = window;
    const originalDocument = document;
    const currentScript = originalDocument.currentScript;
    const {
      DocumentFragment,
      HTMLTemplateElement,
      Node,
      Element,
      NodeFilter,
      NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap,
      HTMLFormElement,
      DOMParser,
      trustedTypes
    } = window;
    const ElementPrototype = Element.prototype;
    const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
    const remove = lookupGetter(ElementPrototype, 'remove');
    const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
    const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
    const getParentNode = lookupGetter(ElementPrototype, 'parentNode');
    // As per issue #47, the web-components registry is inherited by a
    // new document created via createHTMLDocument. As per the spec
    // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
    // a new empty registry is used when creating a template contents owner
    // document, so we use that as our parent document to ensure nothing
    // is inherited.
    if (typeof HTMLTemplateElement === 'function') {
      const template = document.createElement('template');
      if (template.content && template.content.ownerDocument) {
        document = template.content.ownerDocument;
      }
    }
    let trustedTypesPolicy;
    let emptyHTML = '';
    const {
      implementation,
      createNodeIterator,
      createDocumentFragment,
      getElementsByTagName
    } = document;
    const {
      importNode
    } = originalDocument;
    let hooks = _createHooksMap();
    /**
     * Expose whether this browser supports running the full DOMPurify.
     */
    DOMPurify.isSupported = typeof entries === 'function' && typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined;
    const {
      MUSTACHE_EXPR,
      ERB_EXPR,
      TMPLIT_EXPR,
      DATA_ATTR,
      ARIA_ATTR,
      IS_SCRIPT_OR_DATA,
      ATTR_WHITESPACE,
      CUSTOM_ELEMENT
    } = EXPRESSIONS;
    let {
      IS_ALLOWED_URI: IS_ALLOWED_URI$1
    } = EXPRESSIONS;
    /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */
    /* allowed element names */
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    /* Allowed attribute names */
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    /*
     * Configure how DOMPurify should handle custom elements and their attributes as well as customized built-in elements.
     * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
     * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
     * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
     */
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
    let FORBID_TAGS = null;
    /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
    let FORBID_ATTR = null;
    /* Decide if ARIA attributes are okay */
    let ALLOW_ARIA_ATTR = true;
    /* Decide if custom data attributes are okay */
    let ALLOW_DATA_ATTR = true;
    /* Decide if unknown protocols are okay */
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    /* Decide if self-closing tags in attributes are allowed.
     * Usually removed due to a mXSS issue in jQuery 3.0 */
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */
    let SAFE_FOR_TEMPLATES = false;
    /* Output should be safe even for XML used within HTML and alike.
     * This means, DOMPurify removes comments when containing risky content.
     */
    let SAFE_FOR_XML = true;
    /* Decide if document with <html>... should be returned */
    let WHOLE_DOCUMENT = false;
    /* Track whether config is already set on this instance of DOMPurify. */
    let SET_CONFIG = false;
    /* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */
    let FORCE_BODY = false;
    /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */
    let RETURN_DOM = false;
    /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */
    let RETURN_DOM_FRAGMENT = false;
    /* Try to return a Trusted Type object instead of a string, return a string in
     * case Trusted Types are not supported  */
    let RETURN_TRUSTED_TYPE = false;
    /* Output should be free from DOM clobbering attacks?
     * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
     */
    let SANITIZE_DOM = true;
    /* Achieve full DOM Clobbering protection by isolating the namespace of named
     * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
     *
     * HTML/DOM spec rules that enable DOM Clobbering:
     *   - Named Access on Window (§7.3.3)
     *   - DOM Tree Accessors (§3.1.5)
     *   - Form Element Parent-Child Relations (§4.10.3)
     *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
     *   - HTMLCollection (§4.2.10.2)
     *
     * Namespace isolation is implemented by prefixing `id` and `name` attributes
     * with a constant string, i.e., `user-content-`
     */
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
    /* Keep element content when removing element? */
    let KEEP_CONTENT = true;
    /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */
    let IN_PLACE = false;
    /* Allow usage of profiles like html, svg and mathMl */
    let USE_PROFILES = {};
    /* Tags to ignore content of when KEEP_CONTENT is true */
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
    /* Tags that are safe for data: URIs */
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
    /* Attributes safe for values like "javascript:" */
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
    const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
    /* Document namespace */
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    /* Allowed XHTML+XML namespaces */
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
    let HTML_INTEGRATION_POINTS = addToSet({}, ['annotation-xml']);
    // Certain elements are allowed in both SVG and HTML
    // namespace. We need to specify them explicitly
    // so that they don't get erroneously deleted from
    // HTML namespace.
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
    /* Parsing of strict XHTML documents */
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
    const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
    let transformCaseFunc = null;
    /* Keep a reference to config to pass to hooks */
    let CONFIG = null;
    /* Ideally, do not touch anything below this line */
    /* ______________________________________________ */
    const formElement = document.createElement('form');
    const isRegexOrFunction = function isRegexOrFunction(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    /**
     * _parseConfig
     *
     * @param cfg optional config literal
     */
    // eslint-disable-next-line complexity
    const _parseConfig = function _parseConfig() {
      let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      /* Shield configuration object from tampering */
      if (!cfg || typeof cfg !== 'object') {
        cfg = {};
      }
      /* Shield configuration object from prototype pollution */
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE =
      // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
      transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
      /* Set configuration parameters */
      ALLOWED_TAGS = objectHasOwnProperty(cfg, 'ALLOWED_TAGS') ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = objectHasOwnProperty(cfg, 'ALLOWED_ATTR') ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
      ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, 'ALLOWED_NAMESPACES') ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
      URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, 'ADD_URI_SAFE_ATTR') ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = objectHasOwnProperty(cfg, 'ADD_DATA_URI_TAGS') ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
      FORBID_CONTENTS = objectHasOwnProperty(cfg, 'FORBID_CONTENTS') ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
      FORBID_TAGS = objectHasOwnProperty(cfg, 'FORBID_TAGS') ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
      FORBID_ATTR = objectHasOwnProperty(cfg, 'FORBID_ATTR') ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
      USE_PROFILES = objectHasOwnProperty(cfg, 'USE_PROFILES') ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
      RETURN_DOM = cfg.RETURN_DOM || false; // Default false
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
      FORCE_BODY = cfg.FORCE_BODY || false; // Default false
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
      IN_PLACE = cfg.IN_PLACE || false; // Default false
      IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
      NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
      HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
      CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
      }
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      /* Parse profile info */
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      /* Merge configuration parameters */
      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }
      if (cfg.FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      /* Add #text in case KEEP_CONTENT is set to true */
      if (KEEP_CONTENT) {
        ALLOWED_TAGS['#text'] = true;
      }
      /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
      }
      /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ['tbody']);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        }
        // Overwrite existing TrustedTypes policy.
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        // Sign local variables required by `sanitize`.
        emptyHTML = trustedTypesPolicy.createHTML('');
      } else {
        // Uninitialized policy, attempt to initialize the internal dompurify policy.
        if (trustedTypesPolicy === undefined) {
          trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        }
        // If creating the internal policy succeeded sign internal variables.
        if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
          emptyHTML = trustedTypesPolicy.createHTML('');
        }
      }
      // Prevent further manipulation of configuration.
      // Not available in IE8, Safari 5, etc.
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    /* Keep track of all possible SVG and MathML tags
     * so that we can perform the namespace checks
     * correctly. */
    const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    /**
     * @param element a DOM element whose namespace is being checked
     * @returns Return false if the element has a
     *  namespace that a spec-compliant parser would never
     *  return. Return true otherwise.
     */
    const _checkValidNamespace = function _checkValidNamespace(element) {
      let parent = getParentNode(element);
      // In JSDOM, if we're inside shadow DOM, then parentNode
      // can be null. We just simulate parent in this case.
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: 'template'
        };
      }
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }
      if (element.namespaceURI === SVG_NAMESPACE) {
        // The only way to switch from HTML namespace to SVG
        // is via <svg>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'svg';
        }
        // The only way to switch from MathML to SVG is via`
        // svg if parent is either <annotation-xml> or MathML
        // text integration points.
        if (parent.namespaceURI === MATHML_NAMESPACE) {
          return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
        }
        // We only allow elements that are defined in SVG
        // spec. All others are disallowed in SVG namespace.
        return Boolean(ALL_SVG_TAGS[tagName]);
      }
      if (element.namespaceURI === MATHML_NAMESPACE) {
        // The only way to switch from HTML namespace to MathML
        // is via <math>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'math';
        }
        // The only way to switch from SVG to MathML is via
        // <math> and HTML integration points
        if (parent.namespaceURI === SVG_NAMESPACE) {
          return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
        }
        // We only allow elements that are defined in MathML
        // spec. All others are disallowed in MathML namespace.
        return Boolean(ALL_MATHML_TAGS[tagName]);
      }
      if (element.namespaceURI === HTML_NAMESPACE) {
        // The only way to switch from SVG to HTML is via
        // HTML integration points, and from MathML to HTML
        // is via MathML text integration points
        if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        // We disallow tags that are specific for MathML
        // or SVG and should never appear in HTML namespace
        return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
      }
      // For XHTML and XML documents that support custom namespaces
      if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      }
      // The code should never reach this place (this means
      // that the element somehow got namespace that is not
      // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
      // Return false just in case.
      return false;
    };
    /**
     * _forceRemove
     *
     * @param node a DOM node
     */
    const _forceRemove = function _forceRemove(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });
      try {
        // eslint-disable-next-line unicorn/prefer-dom-node-remove
        getParentNode(node).removeChild(node);
      } catch (_) {
        remove(node);
      }
    };
    /**
     * _removeAttribute
     *
     * @param name an Attribute name
     * @param element a DOM node
     */
    const _removeAttribute = function _removeAttribute(name, element) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: element.getAttributeNode(name),
          from: element
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: element
        });
      }
      element.removeAttribute(name);
      // We void attribute values for unremovable "is" attributes
      if (name === 'is') {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(element);
          } catch (_) {}
        } else {
          try {
            element.setAttribute(name, '');
          } catch (_) {}
        }
      }
    };
    /**
     * _initDocument
     *
     * @param dirty - a string of dirty markup
     * @return a DOM, filled with the dirty markup
     */
    const _initDocument = function _initDocument(dirty) {
      /* Create a HTML document */
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) {
        dirty = '<remove></remove>' + dirty;
      } else {
        /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
        // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
      }
      const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      /*
       * Use the DOMParser API by default, fallback later if needs be
       * DOMParser not work for svg when has multiple root element.
       */
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {}
      }
      /* Use createHTMLDocument in case DOMParser is not available */
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, 'template', null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_) {
          // Syntax error if dirtyPayload is invalid xml
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) {
        body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      /* Work on whole document or just its body */
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
      }
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    /**
     * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
     *
     * @param root The root element or node to start traversing on.
     * @return The created NodeIterator
     */
    const _createNodeIterator = function _createNodeIterator(root) {
      return createNodeIterator.call(root.ownerDocument || root, root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
    };
    /**
     * _isClobbered
     *
     * @param element element to check for clobbering attacks
     * @return true if clobbered, false if safe
     */
    const _isClobbered = function _isClobbered(element) {
      return element instanceof HTMLFormElement && (typeof element.nodeName !== 'string' || typeof element.textContent !== 'string' || typeof element.removeChild !== 'function' || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== 'function' || typeof element.setAttribute !== 'function' || typeof element.namespaceURI !== 'string' || typeof element.insertBefore !== 'function' || typeof element.hasChildNodes !== 'function');
    };
    /**
     * Checks whether the given object is a DOM node.
     *
     * @param value object to check whether it's a DOM node
     * @return true is object is a DOM node
     */
    const _isNode = function _isNode(value) {
      return typeof Node === 'function' && value instanceof Node;
    };
    function _executeHooks(hooks, currentNode, data) {
      arrayForEach(hooks, hook => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     * @param currentNode to check for permission to exist
     * @return true if node was killed, false if left alive
     */
    const _sanitizeElements = function _sanitizeElements(currentNode) {
      let content = null;
      /* Execute a hook if present */
      _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
      /* Check if element is clobbered or can clobber */
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      /* Now let's check the element's type and name */
      const tagName = transformCaseFunc(currentNode.nodeName);
      /* Execute a hook if present */
      _executeHooks(hooks.uponSanitizeElement, currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      /* Detect mXSS attempts abusing namespace confusion */
      if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
        _forceRemove(currentNode);
        return true;
      }
      /* Remove any occurrence of processing instructions */
      if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
        _forceRemove(currentNode);
        return true;
      }
      /* Remove any kind of possibly harmful comments */
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
        _forceRemove(currentNode);
        return true;
      }
      /* Remove element if anything forbids its presence */
      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        /* Check if we have a custom element to handle */
        if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
            return false;
          }
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
            return false;
          }
        }
        /* Keep content except for bad-listed elements */
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
          const parentNode = getParentNode(currentNode) || currentNode.parentNode;
          const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
          if (childNodes && parentNode) {
            const childCount = childNodes.length;
            for (let i = childCount - 1; i >= 0; --i) {
              const childClone = cloneNode(childNodes[i], true);
              childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
              parentNode.insertBefore(childClone, getNextSibling(currentNode));
            }
          }
        }
        _forceRemove(currentNode);
        return true;
      }
      /* Check whether element has a valid namespace */
      if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      /* Make sure that older browsers don't get fallback-tag mXSS */
      if ((tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      /* Sanitize element content to be template-safe */
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        /* Get the element's text content */
        content = currentNode.textContent;
        arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
          content = stringReplace(content, expr, ' ');
        });
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      /* Execute a hook if present */
      _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      return false;
    };
    /**
     * _isValidAttribute
     *
     * @param lcTag Lowercase tag name of containing element.
     * @param lcName Lowercase attribute name.
     * @param value Attribute value.
     * @return Returns true if `value` is valid, otherwise false.
     */
    // eslint-disable-next-line complexity
    const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
      /* Make sure attribute cannot clobber */
      if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
        return false;
      }
      /* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */
      if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) ||
        // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
          return false;
        }
        /* Check value is safe. First, is attr inert? If so, is safe */
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if (value) {
        return false;
      } else ;
      return true;
    };
    /**
     * _isBasicCustomElement
     * checks if at least one dash is included in tagName, and it's not the first char
     * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
     *
     * @param tagName name of the tag of the node to sanitize
     * @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
     */
    const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
      return tagName !== 'annotation-xml' && stringMatch(tagName, CUSTOM_ELEMENT);
    };
    /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param currentNode to sanitize
     */
    const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
      /* Execute a hook if present */
      _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
      const {
        attributes
      } = currentNode;
      /* Check if we have attributes; if not we might have a text node */
      if (!attributes || _isClobbered(currentNode)) {
        return;
      }
      const hookEvent = {
        attrName: '',
        attrValue: '',
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: undefined
      };
      let l = attributes.length;
      /* Go backwards over all attributes; safely remove bad ones */
      while (l--) {
        const attr = attributes[l];
        const {
          name,
          namespaceURI,
          value: attrValue
        } = attr;
        const lcName = transformCaseFunc(name);
        let value = name === 'value' ? attrValue : stringTrim(attrValue);
        /* Execute a hook if present */
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
        _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
        value = hookEvent.attrValue;
        /* Full DOM Clobbering protection via namespace isolation,
         * Prefix id and name attributes with `user-content-`
         */
        if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
          // Remove the attribute with this value
          _removeAttribute(name, currentNode);
          // Prefix the value and later re-create the attribute with the sanitized value
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        /* Work around a security issue with comments inside attributes */
        if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title)/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        /* Did the hooks approve of the attribute? */
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        /* Remove attribute */
        _removeAttribute(name, currentNode);
        /* Did the hooks approve of the attribute? */
        if (!hookEvent.keepAttr) {
          continue;
        }
        /* Work around a security issue in jQuery 3.0 */
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        /* Sanitize attribute content to be template-safe */
        if (SAFE_FOR_TEMPLATES) {
          arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
            value = stringReplace(value, expr, ' ');
          });
        }
        /* Is `value` valid for this attribute? */
        const lcTag = transformCaseFunc(currentNode.nodeName);
        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }
        /* Handle attributes that require Trusted Types */
        if (trustedTypesPolicy && typeof trustedTypes === 'object' && typeof trustedTypes.getAttributeType === 'function') {
          if (namespaceURI) ; else {
            switch (trustedTypes.getAttributeType(lcTag, lcName)) {
              case 'TrustedHTML':
                {
                  value = trustedTypesPolicy.createHTML(value);
                  break;
                }
              case 'TrustedScriptURL':
                {
                  value = trustedTypesPolicy.createScriptURL(value);
                  break;
                }
            }
          }
        }
        /* Handle invalid data-* attribute set by try-catching it */
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_) {}
      }
      /* Execute a hook if present */
      _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
    };
    /**
     * _sanitizeShadowDOM
     *
     * @param fragment to iterate over recursively
     */
    const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      /* Execute a hook if present */
      _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        /* Execute a hook if present */
        _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
        /* Sanitize tags and elements */
        _sanitizeElements(shadowNode);
        /* Check attributes next */
        _sanitizeAttributes(shadowNode);
        /* Deep shadow DOM detected */
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(shadowNode.content);
        }
      }
      /* Execute a hook if present */
      _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
    };
    // eslint-disable-next-line complexity
    DOMPurify.sanitize = function (dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      /* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = '<!-->';
      }
      /* Stringify, in case dirty is an object */
      if (typeof dirty !== 'string' && !_isNode(dirty)) {
        if (typeof dirty.toString === 'function') {
          dirty = dirty.toString();
          if (typeof dirty !== 'string') {
            throw typeErrorCreate('dirty is not a string, aborting');
          }
        } else {
          throw typeErrorCreate('toString is not a function');
        }
      }
      /* Return dirty HTML if DOMPurify cannot run */
      if (!DOMPurify.isSupported) {
        return dirty;
      }
      /* Assign config vars */
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }
      /* Clean up removed elements */
      DOMPurify.removed = [];
      /* Check if dirty is correctly typed for IN_PLACE */
      if (typeof dirty === 'string') {
        IN_PLACE = false;
      }
      if (IN_PLACE) {
        /* Do some early pre-sanitization to avoid unsafe root nodes */
        if (dirty.nodeName) {
          const tagName = transformCaseFunc(dirty.nodeName);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
          }
        }
      } else if (dirty instanceof Node) {
        /* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */
        body = _initDocument('<!---->');
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === 'BODY') {
          /* Node is already a body, use as is */
          body = importedNode;
        } else if (importedNode.nodeName === 'HTML') {
          body = importedNode;
        } else {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          body.appendChild(importedNode);
        }
      } else {
        /* Exit directly if we have nothing to do */
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
        // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf('<') === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }
        /* Initialize the document to work on */
        body = _initDocument(dirty);
        /* Check we have a DOM node from the data */
        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
        }
      }
      /* Remove first element node (ours) if FORCE_BODY is set */
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      /* Get node iterator */
      const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
      /* Now start iterating over the created document */
      while (currentNode = nodeIterator.nextNode()) {
        /* Sanitize tags and elements */
        _sanitizeElements(currentNode);
        /* Check attributes next */
        _sanitizeAttributes(currentNode);
        /* Shadow DOM detected, sanitize it */
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }
      }
      /* If we sanitized `dirty` in-place, return it. */
      if (IN_PLACE) {
        return dirty;
      }
      /* Return sanitized string or DOM */
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            // eslint-disable-next-line unicorn/prefer-dom-node-append
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
          /*
            AdoptNode() is not used because internal state is not reset
            (e.g. the past names map of a HTMLFormElement), this is safe
            in theory but we would rather not risk another attack vector.
            The state that is cloned by importNode() is explicitly defined
            by the specs.
          */
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      /* Serialize doctype if allowed */
      if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
      }
      /* Sanitize final string template-safe */
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
          serializedHTML = stringReplace(serializedHTML, expr, ' ');
        });
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function () {
      let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
    };
    DOMPurify.clearConfig = function () {
      CONFIG = null;
      SET_CONFIG = false;
    };
    DOMPurify.isValidAttribute = function (tag, attr, value) {
      /* Initialize shared config vars if necessary. */
      if (!CONFIG) {
        _parseConfig({});
      }
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function (entryPoint, hookFunction) {
      if (typeof hookFunction !== 'function') {
        return;
      }
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function (entryPoint, hookFunction) {
      if (hookFunction !== undefined) {
        const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
        return index === -1 ? undefined : arraySplice(hooks[entryPoint], index, 1)[0];
      }
      return arrayPop(hooks[entryPoint]);
    };
    DOMPurify.removeHooks = function (entryPoint) {
      hooks[entryPoint] = [];
    };
    DOMPurify.removeAllHooks = function () {
      hooks = _createHooksMap();
    };
    return DOMPurify;
  }
  var purify = createDOMPurify();

  /**
   * This class represents all the constants needed in a MathType integration among different classes.
   * If a constant should be used across different classes should be defined using attribute
   * accessors.
   */ class Constants {
      /**
     * Safe XML entities.
     * @type {Object}
     */ static get safeXmlCharactersEntities() {
          return {
              tagOpener: "&laquo;",
              tagCloser: "&raquo;",
              doubleQuote: "&uml;",
              realDoubleQuote: "&quot;"
          };
      }
      /**
     * Blackboard invalid safe characters.
     * @type {Object}
     */ static get safeBadBlackboardCharacters() {
          return {
              ltElement: "«mo»<«/mo»",
              gtElement: "«mo»>«/mo»",
              ampElement: "«mo»&«/mo»"
          };
      }
      /**
     * Blackboard valid safe characters.
     * @type{Object}
     */ static get safeGoodBlackboardCharacters() {
          return {
              ltElement: "«mo»§lt;«/mo»",
              gtElement: "«mo»§gt;«/mo»",
              ampElement: "«mo»§amp;«/mo»"
          };
      }
      /**
     * Standard XML special characters.
     * @type {Object}
     */ static get xmlCharacters() {
          return {
              id: "xmlCharacters",
              tagOpener: "<",
              tagCloser: ">",
              doubleQuote: '"',
              ampersand: "&",
              quote: "'"
          };
      }
      /**
     * Safe XML special characters. This characters are used instead the standard
     * the standard to parse the  MathML if safeXML save mode is enable. Each XML
     * special character have a UTF-8 representation.
     * @type {Object}
     */ static get safeXmlCharacters() {
          return {
              id: "safeXmlCharacters",
              tagOpener: "«",
              tagCloser: "»",
              doubleQuote: "¨",
              ampersand: "§",
              quote: "`",
              realDoubleQuote: "¨"
          };
      }
  }

  /**
   * @classdesc
   * This class represents a class to manage MathML objects.
   */ class MathML {
      /**
     * Checks if the mathml at position i is inside an HTML attribute or not.
     * @param {string} content - a string containing MathML code.
     * @param {number} i -  search index.
     * @return {boolean} true if is inside an HTML attribute. false otherwise.
     */ static isMathmlInAttribute(content, i) {
          // Regex =
          // '^[\'"][\\s]*=[\\s]*[\\w-]+([\\s]*("[^"]*"|\'[^\']*\')[\\s]*
          // =[\\s]*[\\w-]+[\\s]*)*[\\s]+gmi<';
          const mathAtt = "['\"][\\s]*=[\\s]*[\\w-]+"; // "=att OR '=att
          const attContent = "\"[^\"]*\"|'[^']*'"; // "blabla" OR 'blabla'
          const att = `[\\s]*(${attContent})[\\s]*=[\\s]*[\\w-]+[\\s]*`; // "blabla"=att OR 'blabla'=att
          const atts = `('${att}')*`; // "blabla"=att1 "blabla"=att2
          const regex = `^${mathAtt}${atts}[\\s]+gmi<`; // "=att "blabla"=att1 "blabla"=att2 gmi< .
          const expression = new RegExp(regex);
          const actualContent = content.substring(0, i);
          const reversed = actualContent.split("").reverse().join("");
          const exists = expression.test(reversed);
          return exists;
      }
      /**
     * Decodes an encoded MathML with standard XML tags.
     * We use these entities because IE doesn't support html entities
     * on its attributes sometimes. Yes, sometimes.
     * @param {string} input - string to be decoded.
     * @return {string} decoded string.
     */ static safeXmlDecode(input) {
          let { tagOpener } = Constants.safeXmlCharactersEntities;
          let { tagCloser } = Constants.safeXmlCharactersEntities;
          let { doubleQuote } = Constants.safeXmlCharactersEntities;
          let { realDoubleQuote } = Constants.safeXmlCharactersEntities;
          // Decoding entities.
          input = input.split(tagOpener).join(Constants.safeXmlCharacters.tagOpener);
          input = input.split(tagCloser).join(Constants.safeXmlCharacters.tagCloser);
          input = input.split(doubleQuote).join(Constants.safeXmlCharacters.doubleQuote);
          // Added to fix problem due to import from 1.9.x.
          input = input.split(realDoubleQuote).join(Constants.safeXmlCharacters.realDoubleQuote);
          // Blackboard.
          const { ltElement } = Constants.safeBadBlackboardCharacters;
          const { gtElement } = Constants.safeBadBlackboardCharacters;
          const { ampElement } = Constants.safeBadBlackboardCharacters;
          if ("_wrs_blackboard" in window && window._wrs_blackboard) {
              input = input.split(ltElement).join(Constants.safeGoodBlackboardCharacters.ltElement);
              input = input.split(gtElement).join(Constants.safeGoodBlackboardCharacters.gtElement);
              input = input.split(ampElement).join(Constants.safeGoodBlackboardCharacters.ampElement);
          }
          ({ tagOpener } = Constants.safeXmlCharacters);
          ({ tagCloser } = Constants.safeXmlCharacters);
          ({ doubleQuote } = Constants.safeXmlCharacters);
          ({ realDoubleQuote } = Constants.safeXmlCharacters);
          const { ampersand } = Constants.safeXmlCharacters;
          const { quote } = Constants.safeXmlCharacters;
          // Decoding characters.
          input = input.split(tagOpener).join(Constants.xmlCharacters.tagOpener);
          input = input.split(tagCloser).join(Constants.xmlCharacters.tagCloser);
          input = input.split(doubleQuote).join(Constants.xmlCharacters.doubleQuote);
          input = input.split(ampersand).join(Constants.xmlCharacters.ampersand);
          input = input.split(quote).join(Constants.xmlCharacters.quote);
          // We are replacing $ by & when its part of an entity for retro-compatibility.
          // Now, the standard is replace § by &.
          let returnValue = "";
          let currentEntity = null;
          for(let i = 0; i < input.length; i += 1){
              const character = input.charAt(i);
              if (currentEntity == null) {
                  if (character === "$") {
                      currentEntity = "";
                  } else {
                      returnValue += character;
                  }
              } else if (character === ";") {
                  returnValue += `&${currentEntity}`;
                  currentEntity = null;
              } else if (character.match(/([a-zA-Z0-9#._-] | '-')/)) {
                  // Character is part of an entity.
                  currentEntity += character;
              } else {
                  returnValue += `$${currentEntity}`; // Is not an entity.
                  currentEntity = null;
                  i -= 1; // Parse again the current character.
              }
          }
          return returnValue;
      }
      /**
     * Encodes a MathML with standard XML tags to a MMathML encoded with safe XML tags.
     * We use these entities because IE doesn't support html entities on its attributes sometimes.
     * @param {string} input - input string to be encoded
     * @returns {string} encoded string.
     */ static safeXmlEncode(input) {
          const { tagOpener } = Constants.xmlCharacters;
          const { tagCloser } = Constants.xmlCharacters;
          const { doubleQuote } = Constants.xmlCharacters;
          const { ampersand } = Constants.xmlCharacters;
          const { quote } = Constants.xmlCharacters;
          input = input.split(tagOpener).join(Constants.safeXmlCharacters.tagOpener);
          input = input.split(tagCloser).join(Constants.safeXmlCharacters.tagCloser);
          input = input.split(doubleQuote).join(Constants.safeXmlCharacters.doubleQuote);
          input = input.split(ampersand).join(Constants.safeXmlCharacters.ampersand);
          input = input.split(quote).join(Constants.safeXmlCharacters.quote);
          return input;
      }
      /**
     * Converts special symbols (> 128) to entities and replaces all textual
     * entities by its number entities.
     * @param {string} mathml - MathML string containing - or not - special symbols
     * @returns {string} MathML with all textual entities replaced.
     */ static mathMLEntities(mathml) {
          let toReturn = "";
          for(let i = 0; i < mathml.length; i += 1){
              const character = mathml.charAt(i);
              // Parsing > 128 characters.
              if (mathml.codePointAt(i) > 128) {
                  toReturn += `&#${mathml.codePointAt(i)};`;
                  // For UTF-32 characters we need to move the index one position.
                  if (mathml.codePointAt(i) > 0xffff) {
                      i += 1;
                  }
              } else if (character === "&") {
                  const end = mathml.indexOf(";", i + 1);
                  if (end >= 0) {
                      const container = document.createElement("span");
                      container.innerHTML = mathml.substring(i, end + 1);
                      toReturn += `&#${Util.fixedCharCodeAt(container.textContent || container.innerText, 0)};`;
                      i = end;
                  } else {
                      toReturn += character;
                  }
              } else {
                  toReturn += character;
              }
          }
          return toReturn;
      }
      /**
     * Add a custom editor name with the prefix wrs_ to a MathML class attribute.
     * @param {string} mathml - a MathML string created with a custom editor, like chemistry.
     * @param {string} customEditor - custom editor name.
     * @returns {string} MathML string with his class containing the editor toolbar string.
     */ static addCustomEditorClassAttribute(mathml, customEditor) {
          let toReturn = "";
          const start = mathml.indexOf("<math");
          if (start === 0) {
              const end = mathml.indexOf(">");
              if (mathml.indexOf("class") === -1) {
                  // Adding custom editor type.
                  toReturn = `${mathml.substr(start, end)} class="wrs_${customEditor}">`;
                  toReturn += mathml.substr(end + 1, mathml.length);
                  return toReturn;
              }
          }
          return mathml;
      }
      /**
     * Remove a custom editor name from the MathML class attribute.
     * @param {string} mathml - a MathML string.
     * @param {string} customEditor - custom editor name.
     * @returns {string} The input MathML without customEditor name in his class.
     */ static removeCustomEditorClassAttribute(mathml, customEditor) {
          // Discard MathML without the specified class.
          if (mathml.indexOf("class") === -1 || mathml.indexOf(`wrs_${customEditor}`) === -1) {
              return mathml;
          }
          // Trivial case: class attribute value equal to editor name. Then
          // class attribute is removed.
          // First try to remove it with a space before if there is one
          // Otherwise without the space
          if (mathml.indexOf(` class="wrs_${customEditor}"`) !== -1) {
              return mathml.replace(` class="wrs_${customEditor}"`, "");
          } else if (mathml.indexOf(`class="wrs_${customEditor}"`) !== -1) {
              return mathml.replace(`class="wrs_${customEditor}"`, "");
          }
          // Non Trivial case: class attribute contains editor name.
          return mathml.replace(`wrs_${customEditor}`, "");
      }
      /**
     * Adds annotation tag in MathML element.
     * @param {String} mathml - valid MathML.
     * @param {String} content - value to put inside annotation tag.
     * @param {String} annotationEncoding - annotation encoding.
     * @returns {String} - 'mathml' with an annotation that contains
     * 'content' and encoding 'encoding'.
     */ static addAnnotation(mathml, content, annotationEncoding) {
          // If contains annotation, also contains semantics tag.
          const containsAnnotation = mathml.indexOf("<annotation");
          let mathmlWithAnnotation = "";
          if (containsAnnotation !== -1) {
              const closeSemanticsIndex = mathml.indexOf("</semantics>");
              mathmlWithAnnotation = `${mathml.substring(0, closeSemanticsIndex)}<annotation encoding="${annotationEncoding}">${content}</annotation>${mathml.substring(closeSemanticsIndex)}`;
          } else if (MathML.isEmpty(mathml)) {
              const endIndexInline = mathml.indexOf("/>");
              const endIndexNonInline = mathml.indexOf(">");
              const endIndex = endIndexNonInline === endIndexInline ? endIndexInline : endIndexNonInline;
              mathmlWithAnnotation = `${mathml.substring(0, endIndex)}><semantics><annotation encoding="${annotationEncoding}">${content}</annotation></semantics></math>`;
          } else {
              const beginMathMLContent = mathml.indexOf(">") + 1;
              const endMathmlContent = mathml.lastIndexOf("</math>");
              const mathmlContent = mathml.substring(beginMathMLContent, endMathmlContent);
              mathmlWithAnnotation = `${mathml.substring(0, beginMathMLContent)}<semantics><mrow>${mathmlContent}</mrow><annotation encoding="${annotationEncoding}">${content}</annotation></semantics></math>`; // eslint-disable-line max-len
          }
          return mathmlWithAnnotation;
      }
      /**
     * Removes specific annotation tag in MathML element.
     * In case of remove the unique annotation, also is removed semantics tag.
     * @param {String} mathml - valid MathML.
     * @param {String} annotationEncoding - annotation encoding to remove.
     * @returns {String} - 'mathml' without the annotation encoding specified.
     */ static removeAnnotation(mathml, annotationEncoding) {
          let mathmlWithoutAnnotation = mathml;
          const openAnnotationTag = `<annotation encoding="${annotationEncoding}">`;
          const closeAnnotationTag = "</annotation>";
          const startAnnotationIndex = mathml.indexOf(openAnnotationTag);
          if (startAnnotationIndex !== -1) {
              let differentAnnotationFound = false;
              let differentAnnotationIndex = mathml.indexOf("<annotation");
              while(differentAnnotationIndex !== -1){
                  if (differentAnnotationIndex !== startAnnotationIndex) {
                      differentAnnotationFound = true;
                  }
                  differentAnnotationIndex = mathml.indexOf("<annotation", differentAnnotationIndex + 1);
              }
              if (differentAnnotationFound) {
                  const closeIndex = mathml.indexOf(closeAnnotationTag, startAnnotationIndex);
                  const endAnnotationIndex = closeIndex + closeAnnotationTag.length;
                  const startIndex = mathml.substring(0, startAnnotationIndex);
                  mathmlWithoutAnnotation = startIndex + mathml.substring(endAnnotationIndex);
              } else {
                  mathmlWithoutAnnotation = MathML.removeSemantics(mathml);
              }
          }
          return mathmlWithoutAnnotation;
      }
      /**
     * Removes semantics tag to mathml.
     * When using Hand to create formulas, it adds the mrow tag due to the semantics one, this one is also removed.
     * @param {string} mathml - MathML string.
     * @returns {string} - 'mathml' without semantics tag.
     */ static removeSemantics(mathml) {
          // If `mrow` is found right before the `semantics` starting tag, it's removed as well
          const semanticsStartingTagRegex = /<semantics>\s*?(<mrow>)?/gm;
          // If `mrow` is found right after the `annotation` ending tag, it's removed as well
          // alongside `semantics` closing tag and the whole `annotation` tag and its contents.
          const semanticsEndingTagRegex = /(<\/mrow>)?\s*<annotation[\W\w]*?<\/semantics>/gm;
          return mathml.replace(semanticsStartingTagRegex, "").replace(semanticsEndingTagRegex, "");
      }
      /**
     * Removes semantics tag to element that contains mathml.
     * When using Hand to create formulas, it adds the mrow tag due to the semantics one, this one is also removed.
     * @param {string} element - Inner HTML text string.
     * @returns {string} - 'mathml' without semantics tag.
     */ static removeSafeXMLSemantics(element) {
          // If `mrow` is found right before the `semantics` starting tag, it's removed as well
          const semanticsSafeStartingTagRegex = /«semantics»\s*?(«mrow»)?/gm;
          // If `mrow` is found right after the `annotation` ending tag, it's removed as well
          // alongside `semantics` closing tag and the whole `annotation` tag and its contents.
          const semanticsSafeEndingTagRegex = /(«\/mrow»)?\s*«annotation[\W\w]*?«\/semantics»/gm;
          return element.replace(semanticsSafeStartingTagRegex, "").replace(semanticsSafeEndingTagRegex, "");
      }
      /**
     * Transforms all xml mathml occurrences that contain semantics to the same
     * xml mathml occurrences without semantics.
     * @param {string} text - string that can contain xml mathml occurrences.
     * @param {Constants} [characters] - Constant object containing xmlCharacters
     * or safeXmlCharacters relation.
     * xmlCharacters by default.
     * @returns {string} - 'text' with all xml mathml occurrences without annotation tag.
     */ static removeSemanticsOcurrences(text, characters = Constants.xmlCharacters) {
          const mathTagStart = `${characters.tagOpener}math`;
          const mathTagEnd = `${characters.tagOpener}/math${characters.tagCloser}`;
          const mathTagEndline = `/${characters.tagCloser}`;
          const { tagCloser } = characters;
          const semanticsTagStart = `${characters.tagOpener}semantics${characters.tagCloser}`;
          const annotationTagStart = `${characters.tagOpener}annotation encoding=`;
          let output = "";
          let start = text.indexOf(mathTagStart);
          let end = 0;
          while(start !== -1){
              output += text.substring(end, start);
              // MathML can be written as '<math></math>' or '<math />'.
              const mathTagEndIndex = text.indexOf(mathTagEnd, start);
              const mathTagEndlineIndex = text.indexOf(mathTagEndline, start);
              const firstTagCloser = text.indexOf(tagCloser, start);
              if (mathTagEndIndex !== -1) {
                  end = mathTagEndIndex;
              } else if (mathTagEndlineIndex === firstTagCloser - 1) {
                  end = mathTagEndlineIndex;
              }
              const semanticsIndex = text.indexOf(semanticsTagStart, start);
              if (semanticsIndex !== -1) {
                  const mmlTagStart = text.substring(start, semanticsIndex);
                  const annotationIndex = text.indexOf(annotationTagStart, start);
                  if (annotationIndex !== -1) {
                      const startIndex = semanticsIndex + semanticsTagStart.length;
                      const mmlContent = text.substring(startIndex, annotationIndex);
                      output += mmlTagStart + mmlContent + mathTagEnd;
                      start = text.indexOf(mathTagStart, start + mathTagStart.length);
                      end += mathTagEnd.length;
                  } else {
                      end = start;
                      start = text.indexOf(mathTagStart, start + mathTagStart.length);
                  }
              } else {
                  end = start;
                  start = text.indexOf(mathTagStart, start + mathTagStart.length);
              }
          }
          output += text.substring(end, text.length);
          return output;
      }
      /**
     * Returns true if a MathML contains a certain class.
     * @param {string} mathML - input MathML.
     * @param {string} className - className.
     * @returns {boolean} true if the input MathML contains the input class.
     * false otherwise.
     * @static
     */ static containClass(mathML, className) {
          const classIndex = mathML.indexOf("class");
          if (classIndex === -1) {
              return false;
          }
          const classTagEndIndex = mathML.indexOf(">", classIndex);
          const classTag = mathML.substring(classIndex, classTagEndIndex);
          if (classTag.indexOf(className) !== -1) {
              return true;
          }
          return false;
      }
      /**
     * Returns true if mathml is empty. Otherwise, false.
     * @param {string} mathml - valid MathML with standard XML tags.
     * @returns {boolean} - true if mathml is empty. Otherwise, false.
     */ static isEmpty(mathml) {
          // MathML can have the shape <math></math> or '<math />'.
          const closeTag = ">";
          const closeTagInline = "/>";
          const firstCloseTagIndex = mathml.indexOf(closeTag);
          const firstCloseTagInlineIndex = mathml.indexOf(closeTagInline);
          let empty = false;
          // MathML is always empty in the second shape.
          if (firstCloseTagInlineIndex !== -1) {
              if (firstCloseTagInlineIndex === firstCloseTagIndex - 1) {
                  empty = true;
              }
          }
          // MathML is always empty in the first shape when there aren't elements
          // between math tags.
          if (!empty) {
              const mathTagEndRegex = new RegExp("</(.+:)?math>");
              const mathTagEndArray = mathTagEndRegex.exec(mathml);
              if (mathTagEndArray) {
                  empty = firstCloseTagIndex + 1 === mathTagEndArray.index;
              }
          }
          return empty;
      }
      /**
     * Encodes html entities inside properties.
     * @param {String} mathml - valid MathML with standard XML tags.
     * @returns {String} - 'mathml' with property entities encoded.
     */ static encodeProperties(mathml) {
          // Search all the properties.
          const regex = /\w+=".*?"/g;
          // Encode html entities.
          const replacer = (match)=>{
              // It has the shape:
              // <math propertyOne="somethingOne"><children propertyTwo="somethingTwo"></children></math>.
              const quoteIndex = match.indexOf('"');
              const propertyValue = match.substring(quoteIndex + 1, match.length - 1);
              const propertyValueEncoded = Util.htmlEntities(propertyValue);
              const matchEncoded = `${match.substring(0, quoteIndex + 1)}${propertyValueEncoded}"`;
              return matchEncoded;
          };
          const mathmlEncoded = mathml.replace(regex, replacer);
          return mathmlEncoded;
      }
  }

  /**
   * This class represents the configuration class.
   * Usually used to retrieve configuration properties generated in the backend into the frontend.
   */ class Configuration {
      /**
     * Adds a properties object to {@link Configuration.properties}.
     * @param {Object} properties - properties to append to current properties.
     */ static addConfiguration(properties) {
          Object.assign(Configuration.properties, properties);
      }
      /**
     * Static property.
     * The configuration properties object.
     * @private
     * @type {Object}
     */ static get properties() {
          return Configuration._properties;
      }
      /**
     * Static property setter.
     * Set configuration properties.
     * @param {Object} value - The property value.
     * @ignore
     */ static set properties(value) {
          Configuration._properties = value;
      }
      /**
     * Returns the value of a property key.
     * @param {String} key - Property key
     * @returns {String} Property value
     */ static get(key) {
          if (!Object.prototype.hasOwnProperty.call(Configuration.properties, key)) {
              // Backwards compatibility.
              if (Object.prototype.hasOwnProperty.call(Configuration.properties, "_wrs_conf_")) {
                  return Configuration.properties[`_wrs_conf_${key}`];
              }
              return false;
          }
          return Configuration.properties[key];
      }
      /**
     * Adds a new property to Configuration class.
     * @param {String} key - Property key.
     * @param {Object} value - Property value.
     */ static set(key, value) {
          Configuration.properties[key] = value;
      }
      /**
     * Updates a property object value with new values.
     * @param {String} key - The property key to be updated.
     * @param {Object} propertyValue - Object containing the new values.
     */ static update(key, propertyValue) {
          if (!Configuration.get(key)) {
              Configuration.set(key, propertyValue);
          } else {
              const updateProperty = Object.assign(Configuration.get(key), propertyValue);
              Configuration.set(key, updateProperty);
          }
      }
  }
  /**
   * Static properties object. Stores all configuration properties.
   * Needed to attribute accessors.
   * @private
   * @type {Object}
   */ Configuration._properties = {};

  class TextCache {
      /**
     * @classdesc
     * This class represent a client-side text cache class. Contains pairs of
     * strings (key/value) which can be retrieved in any moment. Usually used
     * to store AJAX responses for text services like mathml2latex
     * (c.f {@link Latex} class) or mathml2accessible (c.f {@link Accessibility} class).
     * @constructs
     */ constructor(){
          /**
       * Cache array property storing the cache entries.
       * @type {Array.<String>}
       */ this.cache = [];
      }
      /**
     * This method populates a key/value pair into the {@link this.cache} property.
     * @param {String} key - Cache key, usually the service string parameter.
     * @param {String} value - Cache value, usually the service response.
     */ populate(key, value) {
          this.cache[key] = value;
      }
      /**
     * Returns the cache value associated to certain cache key.
     * @param {String} key - Cache key, usually the service string parameter.
     * @return {String} value - Cache value, if exists. False otherwise.
     */ get(key) {
          if (Object.prototype.hasOwnProperty.call(this.cache, key)) {
              return this.cache[key];
          }
          return false;
      }
  }

  /**
   * This object represents a custom listener.
   * @typedef {Object} Listener
   * @property {String} Listener.eventName - The listener name.
   * @property {Function} Listener.callback - The listener callback function.
   */ class Listeners {
      /**
     * @classdesc
     * This class represents a custom listeners manager.
     * @constructs
     */ constructor(){
          /**
       * Array containing all custom listeners.
       * @type {Object[]}
       */ this.listeners = [];
      }
      /**
     * Add a listener to Listener class.
     * @param {Object} listener - A listener object.
     */ add(listener) {
          this.listeners.push(listener);
      }
      /**
     * Fires MathType event listeners
     * @param {String} eventName - event name
     * @param {Event} event - event object.
     * @return {boolean} false if event has been prevented. true otherwise.
     */ fire(eventName, event) {
          for(let i = 0; i < this.listeners.length && !event.cancelled; i += 1){
              if (this.listeners[i].eventName === eventName) {
                  // Calling listener.
                  this.listeners[i].callback(event);
              }
          }
          return event.defaultPrevented;
      }
      /**
     * Creates a new listener object.
     * @param {string} eventName - Event name.
     * @param {Object} callback - Callback function.
     * @returns {object} the listener object.
     */ static newListener(eventName, callback) {
          const listener = {};
          listener.eventName = eventName;
          listener.callback = callback;
          return listener;
      }
  }

  /**
   * @typedef {Object} ServiceProviderProperties
   * @property {String} URI - Service URI.
   * @property {String} server - Service server language.
   */ /**
   * @classdesc
   * Class representing a serviceProvider. A serviceProvider is a class containing
   * an arbitrary number of services with the correspondent path.
   */ class ServiceProvider {
      /**
     * Returns Service Provider listeners.
     * @type {Listeners}
     */ static get listeners() {
          return ServiceProvider._listeners;
      }
      /**
     * Adds a {@link Listener} instance to {@link ServiceProvider} class.
     * @param {Listener} listener - Instance of {@link Listener}.
     */ static addListener(listener) {
          ServiceProvider.listeners.add(listener);
      }
      /**
     * Fires events in Service Provider.
     * @param {String} eventName - Event name.
     * @param {Event} event - Event object.
     */ static fireEvent(eventName, event) {
          ServiceProvider.listeners.fire(eventName, event);
      }
      /**
     * Service parameters.
     * @type {ServiceProviderProperties}
     *
     */ static get parameters() {
          return ServiceProvider._parameters;
      }
      /**
     * Service parameters.
     * @private
     * @type {ServiceProviderProperties}
     */ static set parameters(parameters) {
          ServiceProvider._parameters = parameters;
      }
      /**
     * Static property.
     * Return service provider paths.
     * @private
     * @type {String}
     */ static get servicePaths() {
          return ServiceProvider._servicePaths;
      }
      /**
     * Static property setter.
     * Set service paths.
     * @param {String} value - The property value.
     * @ignore
     */ static set servicePaths(value) {
          ServiceProvider._servicePaths = value;
      }
      /**
     * Adds a new service to the ServiceProvider.
     * @param {String} service - Service name.
     * @param {String} path - Service path.
     * @static
     */ static setServicePath(service, path) {
          ServiceProvider.servicePaths[service] = path;
      }
      /**
     * Returns the service path for a certain service.
     * @param {String} serviceName - Service name.
     * @returns {String} The service path.
     * @static
     */ static getServicePath(serviceName) {
          return ServiceProvider.servicePaths[serviceName];
      }
      /**
     * Static property.
     * Service provider integration path.
     * @type {String}
     */ static get integrationPath() {
          return ServiceProvider._integrationPath;
      }
      /**
     * Static property setter.
     * Set service provider integration path.
     * @param {String} value - The property value.
     * @ignore
     */ static set integrationPath(value) {
          ServiceProvider._integrationPath = value;
      }
      /**
     * Returns the server URL in the form protocol://serverName:serverPort.
     * @return {String} The client side server path.
     */ static getServerURL() {
          const url = window.location.href;
          const arr = url.split("/");
          const result = `${arr[0]}//${arr[2]}`;
          return result;
      }
      /**
     * Inits {@link this} class. Uses {@link this.integrationPath} as
     * base path to generate all backend services paths.
     * @param {Object} parameters - Function parameters.
     * @param {String} parameters.integrationPath - Service path.
     */ static init(parameters) {
          ServiceProvider.parameters = parameters;
          // Services path (tech dependant).
          let configurationURI = ServiceProvider.createServiceURI("configurationjs");
          let createImageURI = ServiceProvider.createServiceURI("createimage");
          let showImageURI = ServiceProvider.createServiceURI("showimage");
          let getMathMLURI = ServiceProvider.createServiceURI("getmathml");
          let serviceURI = ServiceProvider.createServiceURI("service");
          // Some backend integrations (like Java o Ruby) have an absolute backend path,
          // for example: /app/service. For them we calculate the absolute URL path, i.e
          // protocol://domain:port/app/service
          if (ServiceProvider.parameters.URI.indexOf("/") === 0) {
              const serverPath = ServiceProvider.getServerURL();
              configurationURI = serverPath + configurationURI;
              showImageURI = serverPath + showImageURI;
              createImageURI = serverPath + createImageURI;
              getMathMLURI = serverPath + getMathMLURI;
              serviceURI = serverPath + serviceURI;
          }
          ServiceProvider.setServicePath("configurationjs", configurationURI);
          ServiceProvider.setServicePath("showimage", showImageURI);
          ServiceProvider.setServicePath("createimage", createImageURI);
          ServiceProvider.setServicePath("service", serviceURI);
          ServiceProvider.setServicePath("getmathml", getMathMLURI);
          ServiceProvider.setServicePath("configurationjs", configurationURI);
          ServiceProvider.listeners.fire("onInit", {});
      }
      /**
     * Gets the content from an URL.
     * @param {String} url - Target URL.
     * @param {Object} [postVariables] - Object containing post variables.
     * null if a GET query should be done.
     * @returns {String} Content of the target URL.
     * @private
     * @static
     */ static getUrl(url, postVariables) {
          const currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf("/") + 1);
          const httpRequest = Util.createHttpRequest();
          if (httpRequest) {
              if (typeof postVariables === "undefined" || typeof postVariables === "undefined") {
                  httpRequest.open("GET", url, false);
              } else if (url.substr(0, 1) === "/" || url.substr(0, 7) === "http://" || url.substr(0, 8) === "https://") {
                  httpRequest.open("POST", url, false);
              } else {
                  httpRequest.open("POST", currentPath + url, false);
              }
              let header = Configuration.get("customHeaders");
              if (header) {
                  if (typeof header === "string") {
                      header = Util.convertStringToObject(header);
                  }
                  Object.entries(header).forEach(([key, val])=>httpRequest.setRequestHeader(key, val));
              }
              if (typeof postVariables !== "undefined" && postVariables) {
                  httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                  httpRequest.send(Util.httpBuildQuery(postVariables));
              } else {
                  httpRequest.send(null);
              }
              return httpRequest.responseText;
          }
          return "";
      }
      /**
     * Returns the response text of a certain service.
     * @param {String} service - Service name.
     * @param {String} postVariables - Post variables.
     * @param {Boolean} get - True if the request is GET instead of POST. false otherwise.
     * @returns {String} Service response text.
     */ static getService(service, postVariables, get) {
          let response;
          if (get === true) {
              const getVariables = postVariables ? `?${postVariables}` : "";
              const serviceUrl = `${ServiceProvider.getServicePath(service)}${getVariables}`;
              response = ServiceProvider.getUrl(serviceUrl);
          } else {
              const serviceUrl = ServiceProvider.getServicePath(service);
              response = ServiceProvider.getUrl(serviceUrl, postVariables);
          }
          return response;
      }
      /**
     * Returns the server language of a certain service. The possible values
     * are: php, aspx, java and ruby.
     * This method has backward compatibility purposes.
     * @param {String} service - The configuration service.
     * @returns {String} - The server technology associated with the configuration service.
     */ static getServerLanguageFromService(service) {
          if (service.indexOf(".php") !== -1) {
              return "php";
          }
          if (service.indexOf(".aspx") !== -1) {
              return "aspx";
          }
          if (service.indexOf("wirispluginengine") !== -1) {
              return "ruby";
          }
          return "java";
      }
      /**
     * Returns the URI associated with a certain service.
     * @param {String} service - The service name.
     * @return {String} The service path.
     */ static createServiceURI(service) {
          const extension = ServiceProvider.serverExtension();
          return Util.concatenateUrl(ServiceProvider.parameters.URI, service) + extension;
      }
      static serverExtension() {
          if (ServiceProvider.parameters.server.indexOf("php") !== -1) {
              return ".php";
          }
          if (ServiceProvider.parameters.server.indexOf("aspx") !== -1) {
              return ".aspx";
          }
          return "";
      }
  }
  /**
   * @property {String} service - The service name.
   * @property {String} path - The service path.
   * @static
   */ ServiceProvider._servicePaths = {};
  /**
   * The integration path. Contains the path of the configuration service.
   * Used to define the path for all services.
   * @type {String}
   * @private
   */ ServiceProvider._integrationPath = "";
  /**
   * ServiceProvider static listeners.
   * @type {Listeners}
   * @private
   */ ServiceProvider._listeners = new Listeners();
  /**
   * Service provider parameters.
   * @type {ServiceProviderParameters}
   */ ServiceProvider._parameters = {};

  /**
   * @classdesc
   * This class represents a LaTeX parser. Manages the services which allows to convert
   * LaTeX into MathML and MathML into LaTeX.
   */ class Latex {
      /**
     * Static property.
     * Return latex cache.
     * @private
     * @type {Cache}
     */ static get cache() {
          return Latex._cache;
      }
      /**
     * Static property setter.
     * Set latex cache.
     * @param {Cache} value - The property value.
     * @ignore
     */ static set cache(value) {
          Latex._cache = value;
      }
      /**
     * Converts MathML to LaTeX by calling mathml2latex service. For text services
     * we call a text service with the param mathml2latex.
     * @param {String} mathml - MathML String.
     * @return {String} LaTeX string generated by the MathML argument.
     */ static getLatexFromMathML(mathml) {
          const mathmlWithoutSemantics = MathML.removeSemantics(mathml);
          /**
       * @type {TextCache}
       */ const { cache } = Latex;
          const data = {
              service: "mathml2latex",
              mml: mathmlWithoutSemantics
          };
          const jsonResponse = JSON.parse(ServiceProvider.getService("service", data));
          // TODO: Error handling.
          let latex = "";
          if (jsonResponse.status === "ok") {
              latex = jsonResponse.result.text;
              const latexHtmlEntitiesEncoded = Util.htmlEntities(latex);
              // Inserting LaTeX semantics.
              const mathmlWithSemantics = MathML.addAnnotation(mathml, latexHtmlEntitiesEncoded, "LaTeX");
              cache.populate(latex, mathmlWithSemantics);
          }
          return latex;
      }
      /**
     * Converts LaTeX to MathML by calling latex2mathml service. For text services
     * we call a text service with the param latex2mathml.
     * @param {String} latex - String containing a LaTeX formula.
     * @param {Boolean} includeLatexOnSemantics
     * - If true LaTeX would me included into MathML semantics.
     * @return {String} MathML string generated by the LaTeX argument.
     */ static getMathMLFromLatex(latex, includeLatexOnSemantics) {
          /**
       * @type {TextCache}
       */ const latexCache = Latex.cache;
          if (Latex.cache.get(latex)) {
              return Latex.cache.get(latex);
          }
          const data = {
              service: "latex2mathml",
              latex
          };
          if (includeLatexOnSemantics) {
              data.saveLatex = "";
          }
          const jsonResponse = JSON.parse(ServiceProvider.getService("service", data));
          let output;
          if (jsonResponse.status === "ok") {
              let mathml = jsonResponse.result.text;
              mathml = mathml.split("\r").join("").split("\n").join(" ");
              // Populate LatexCache.
              if (mathml.indexOf("semantics") === -1 && mathml.indexOf("annotation") === -1) {
                  const content = Util.htmlEntities(latex);
                  mathml = MathML.addAnnotation(mathml, content, "LaTeX");
                  output = mathml;
              } else {
                  output = mathml;
              }
              if (!latexCache.get(latex)) {
                  latexCache.populate(latex, mathml);
              }
          } else {
              output = `$$${latex}$$`;
          }
          return output;
      }
      /**
     * Converts all occurrences of MathML code to LaTeX.
     * The MathML code should containing <annotation encoding="LaTeX"/> to be converted.
     * @param {String} content - A string containing MathML valid code.
     * @param {Object} characters - An object containing special characters.
     * @return {String} A string containing all MathML annotated occurrences
     * replaced by the corresponding LaTeX code.
     */ static parseMathmlToLatex(content, characters) {
          let output = "";
          const mathTagBegin = `${characters.tagOpener}math`;
          const mathTagEnd = `${characters.tagOpener}/math${characters.tagCloser}`;
          const openTarget = `${characters.tagOpener}annotation encoding=${characters.doubleQuote}LaTeX${characters.doubleQuote}${characters.tagCloser}`;
          const closeTarget = `${characters.tagOpener}/annotation${characters.tagCloser}`;
          let start = content.indexOf(mathTagBegin);
          let end = 0;
          let mathml;
          let startAnnotation;
          let closeAnnotation;
          while(start !== -1){
              output += content.substring(end, start);
              end = content.indexOf(mathTagEnd, start);
              if (end === -1) {
                  end = content.length - 1;
              } else {
                  end += mathTagEnd.length;
              }
              mathml = content.substring(start, end);
              startAnnotation = mathml.indexOf(openTarget);
              if (startAnnotation !== -1) {
                  startAnnotation += openTarget.length;
                  closeAnnotation = mathml.indexOf(closeTarget);
                  let latex = mathml.substring(startAnnotation, closeAnnotation);
                  if (characters === Constants.safeXmlCharacters) {
                      latex = MathML.safeXmlDecode(latex);
                  }
                  output += `$$${latex}$$`;
                  // Populate latex into cache.
                  Latex.cache.populate(latex, mathml);
              } else {
                  output += mathml;
              }
              start = content.indexOf(mathTagBegin, end);
          }
          output += content.substring(end, content.length);
          return output;
      }
      /**
     * Extracts the latex of a determined position in a text.
     * @param {Node} textNode - textNode to extract the LaTeX
     * @param {Number} caretPosition - Starting position to find LaTeX.
     * @param {Object} latexTags - Optional parameter representing tags between latex is inserted.
     * It has the 'open' attribute for the open tag and the 'close' attribute for the close tag.
     * "$$" by default.
     * @return {Object} An object with 3 keys: 'latex', 'start' and 'end'. Null if latex is not found.
     * @static
     */ static getLatexFromTextNode(textNode, caretPosition, latexTags) {
          // TODO: Set LaTeX Tags as Core variable. Fix the call to this function (third argument).
          // Tags used for LaTeX formulas.
          const defaultLatexTags = {
              open: "$$",
              close: "$$"
          };
          // latexTags is an optional parameter. If is not set, use default latexTags.
          if (typeof latexTags === "undefined" || latexTags == null) {
              latexTags = defaultLatexTags;
          }
          // Looking for the first textNode.
          let startNode = textNode;
          while(startNode.previousSibling && startNode.previousSibling.nodeType === 3){
              // TEXT_NODE.
              startNode = startNode.previousSibling;
          }
          /**
       * Returns the next latex position and node from a specific node and position.
       * @param {Node} currentNode - Node where searching latex.
       * @param {Number} currentPosition - Current position inside the currentNode.
       * @param {Object} latexTagsToUse - Tags used at latex beginning and latex final.
       * "$$" by default.
       * @param {Boolean} tag - Tag containing the current search.
       * @returns {Object} Object containing the current node and the position.
       */ function getNextLatexPosition(currentNode, currentPosition, tag) {
              let position = currentNode.nodeValue.indexOf(tag, currentPosition);
              while(position === -1){
                  currentNode = currentNode.nextSibling;
                  if (!currentNode) {
                      // TEXT_NODE.
                      return null; // Not found.
                  }
                  position = currentNode.nodeValue ? currentNode.nodeValue.indexOf(latexTags.close) : -1;
              }
              return {
                  node: currentNode,
                  position
              };
          }
          /**
       * Determines if a node is previous, or not, to a second one.
       * @param {Node} node - Start node.
       * @param {Number} position - Start node position.
       * @param {Node} endNode - End node.
       * @param {Number} endPosition - End node position.
       * @returns {Boolean} True if the starting node is previous thant the en node. false otherwise.
       */ function isPrevious(node, position, endNode, endPosition) {
              if (node === endNode) {
                  return position <= endPosition;
              }
              while(node && node !== endNode){
                  node = node.nextSibling;
              }
              return node === endNode;
          }
          let start;
          let end = {
              node: startNode,
              position: 0
          };
          // Is supposed that open and close tags has the same length.
          const tagLength = latexTags.open.length;
          do {
              start = getNextLatexPosition(end.node, end.position, latexTags.open);
              if (start == null || isPrevious(textNode, caretPosition, start.node, start.position)) {
                  return null;
              }
              end = getNextLatexPosition(start.node, start.position + tagLength, latexTags.close);
              if (end == null) {
                  return null;
              }
              end.position += tagLength;
          }while (isPrevious(end.node, end.position, textNode, caretPosition))
          // Isolating latex.
          let latex;
          if (start.node === end.node) {
              latex = start.node.nodeValue.substring(start.position + tagLength, end.position - tagLength);
          } else {
              const index = start.position + tagLength;
              latex = start.node.nodeValue.substring(index, start.node.nodeValue.length);
              let currentNode = start.node;
              do {
                  currentNode = currentNode.nextSibling;
                  if (currentNode === end.node) {
                      latex += end.node.nodeValue.substring(0, end.position - tagLength);
                  } else {
                      latex += currentNode.nodeValue ? currentNode.nodeValue : "";
                  }
              }while (currentNode !== end.node)
          }
          return {
              latex,
              startNode: start.node,
              startPosition: start.position,
              endNode: end.node,
              endPosition: end.position
          };
      }
  }
  /**
   * Text cache. Stores all processed LaTeX strings and it's correspondent MathML string.
   * @type {Cache}
   * @static
   */ Latex._cache = new TextCache();

  var ar = {
  	latex: "LaTeX",
  	cancel: "إلغاء",
  	accept: "إدراج",
  	manual: "الدليل",
  	insert_math: "إدراج صيغة رياضية - MathType",
  	insert_chem: "إدراج صيغة كيميائية - ChemType",
  	minimize: "تصغير",
  	maximize: "تكبير",
  	fullscreen: "ملء الشاشة",
  	exit_fullscreen: "الخروج من ملء الشاشة",
  	close: "إغلاق",
  	mathtype: "MathType",
  	title_modalwindow: "نافذة MathType مشروطة",
  	close_modal_warning: "هل تريد المغادرة بالتأكيد؟ ستُفقد التغييرات التي أجريتها.",
  	latex_name_label: "صيغة Latex",
  	browser_no_compatible: "المستعرض غير متوافق مع تقنية AJAX. الرجاء استخدام أحدث إصدار من Mozilla Firefox.",
  	error_convert_accessibility: "حدث خطأ أثناء التحويل من MathML إلى نص قابل للاستخدام.",
  	exception_cross_site: "البرمجة النصية للمواقع المشتركة مسموح بها لـ HTTP فقط.",
  	exception_high_surrogate: "المركّب المرتفع غير متبوع بمركّب منخفض في fixedCharCodeAt()‎",
  	exception_string_length: "سلسلة غير صالحة. يجب أن يكون الطول من مضاعفات العدد 4",
  	exception_key_nonobject: "Object.keys مستدعاة على غير كائن",
  	exception_null_or_undefined: " هذا فارغ أو غير محدد",
  	exception_not_function: " ليست دالة",
  	exception_invalid_date_format: "تنسيق تاريخ غير صالح: ",
  	exception_casting: "لا يمكن الصياغة ",
  	exception_casting_to: " إلى "
  };
  var ca = {
  	latex: "LaTeX",
  	cancel: "Cancel·lar",
  	accept: "Inserir",
  	manual: "Manual",
  	insert_math: "Inserir fórmula matemàtica - MathType",
  	insert_chem: "Inserir fórmula química - ChemType",
  	minimize: "Minimitza",
  	maximize: "Maximitza",
  	fullscreen: "Pantalla completa",
  	exit_fullscreen: "Sortir de la pantalla complera",
  	close: "Tanca",
  	mathtype: "MathType",
  	title_modalwindow: " Finestra modal de MathType",
  	close_modal_warning: "N'estàs segur que vols sortir? Es perdran els canvis que has fet.",
  	latex_name_label: "Fórmula en Latex",
  	browser_no_compatible: "El teu navegador no és compatible amb AJAX. Si us plau, usa la darrera versió de Mozilla Firefox.",
  	error_convert_accessibility: "Error en convertir de MathML a text accessible.",
  	exception_cross_site: "Els scripts de llocs creuats només estan permesos per HTTP.",
  	exception_high_surrogate: "Subrogat alt no seguit de subrogat baix a fixedCharCodeAt()",
  	exception_string_length: "Cadena invàlida. La longitud ha de ser un múltiple de 4",
  	exception_key_nonobject: "Object.keys anomenat a non-object",
  	exception_null_or_undefined: " això és null o no definit",
  	exception_not_function: " no és una funció",
  	exception_invalid_date_format: "Format de data invàlid : ",
  	exception_casting: "No es pot emetre ",
  	exception_casting_to: " a "
  };
  var cs = {
  	latex: "LaTeX",
  	cancel: "Storno",
  	accept: "Vložit",
  	manual: "Příručka",
  	insert_math: "Vložit matematický vzorec - MathType",
  	insert_chem: "Vložení chemického vzorce – ChemType",
  	minimize: "Minimalizovat",
  	maximize: "Maximalizovat",
  	fullscreen: "Celá obrazovka",
  	exit_fullscreen: "Opustit režim celé obrazovky",
  	close: "Zavřít",
  	mathtype: "MathType",
  	title_modalwindow: "Modální okno MathType",
  	close_modal_warning: "Opravdu chcete okno zavřít? Provedené změny budou ztraceny.",
  	latex_name_label: "Vzorec v LaTeXu",
  	browser_no_compatible: "Váš prohlížeč nepodporuje technologii AJAX. Použijte nejnovější verzi prohlížeče Mozilla Firefox.",
  	error_convert_accessibility: "Při převodu kódu MathML na čitelný text došlo k chybě.",
  	exception_cross_site: "Skriptování mezi více servery je povoleno jen v HTTP.",
  	exception_high_surrogate: "Ve funkci fixedCharCodeAt() nenásleduje po první části kódu znaku druhá část",
  	exception_string_length: "Neplatný řetězec. Délka musí být násobkem 4.",
  	exception_key_nonobject: "Funkce Object.keys byla použita pro prvek, který není objektem",
  	exception_null_or_undefined: " hodnota je null nebo není definovaná",
  	exception_not_function: " není funkce",
  	exception_invalid_date_format: "Neplatný formát data: ",
  	exception_casting: "Nelze přetypovat ",
  	exception_casting_to: " na "
  };
  var da = {
  	latex: "LaTeX",
  	cancel: "Annuller",
  	accept: "Indsæt",
  	manual: "Brugervejledning",
  	insert_math: "Indsæt matematisk formel - MathType",
  	insert_chem: "Indsæt en kemisk formel - ChemType",
  	minimize: "Minimer",
  	maximize: "Maksimer",
  	fullscreen: "Fuld skærm",
  	exit_fullscreen: "Afslut Fuld skærm",
  	close: "Luk",
  	mathtype: "MathType",
  	title_modalwindow: "MathType-modalvindue",
  	close_modal_warning: "Er du sikker på, du vil lukke? Dine ændringer går tabt.",
  	latex_name_label: "LaTex-formel",
  	browser_no_compatible: "Din browser er ikke kompatibel med AJAX-teknologi. Brug den nyeste version af Mozilla Firefox.",
  	error_convert_accessibility: "Fejl under konvertering fra MathML til tilgængelig tekst.",
  	exception_cross_site: "Scripts på tværs af websteder er kun tilladt for HTTP.",
  	exception_high_surrogate: "Et højt erstatningstegn er ikke fulgt af et lavt erstatningstegn i fixedCharCodeAt()",
  	exception_string_length: "Ugyldig streng. Længden skal være et multiplum af 4",
  	exception_key_nonobject: "Object.keys kaldet ved ikke-objekt",
  	exception_null_or_undefined: " dette er nul eller ikke defineret",
  	exception_not_function: " er ikke en funktion",
  	exception_invalid_date_format: "Ugyldigt datoformat: ",
  	exception_casting: "Kan ikke beregne ",
  	exception_casting_to: " til "
  };
  var de = {
  	latex: "LaTeX",
  	cancel: "Abbrechen",
  	accept: "Einfügen",
  	manual: "Handbuch",
  	insert_math: "Mathematische Formel einfügen - MathType",
  	insert_chem: "Eine chemische Formel einfügen – ChemType",
  	minimize: "Verkleinern",
  	maximize: "Vergrößern",
  	fullscreen: "Vollbild",
  	exit_fullscreen: "Vollbild schließen",
  	close: "Schließen",
  	mathtype: "MathType",
  	title_modalwindow: "Modales MathType-Fenster",
  	close_modal_warning: "Bist du sicher, dass du das Programm verlassen willst? Alle vorgenommenen Änderungen gehen damit verloren.",
  	latex_name_label: "Latex-Formel",
  	browser_no_compatible: "Dein Browser ist nicht mit der AJAX-Technologie kompatibel. Verwende bitte die neueste Version von Mozilla Firefox.",
  	error_convert_accessibility: "Fehler beim Konvertieren von MathML in barrierefreien Text.",
  	exception_cross_site: "Cross-Site-Scripting ist nur bei HTTP zulässig.",
  	exception_high_surrogate: "Hoher Ersatz bei bei festerZeichenkodierungbei() nicht von niedrigem Ersatz befolgt.",
  	exception_string_length: "Ungültige Zeichenfolge. Länge muss ein Vielfaches von 4 sein.",
  	exception_key_nonobject: "Object.keys wurde für ein Nicht-Objekt aufgerufen.",
  	exception_null_or_undefined: " Das ist Null oder nicht definiert.",
  	exception_not_function: " ist keine Funktion",
  	exception_invalid_date_format: "Ungültiges Datumsformat: ",
  	exception_casting: "Umwandlung nicht möglich ",
  	exception_casting_to: " zu "
  };
  var el = {
  	latex: "LaTeX",
  	cancel: "Άκυρο",
  	accept: "Εισαγωγή",
  	manual: "Χειροκίνητα",
  	insert_math: "Εισαγωγή μαθηματικού τύπου - MathType",
  	insert_chem: "Εισαγωγή χημικού τύπου - ChemType",
  	minimize: "Ελαχιστοποίηση",
  	maximize: "Μεγιστοποίηση",
  	fullscreen: "Πλήρης οθόνη",
  	exit_fullscreen: "Έξοδος από πλήρη οθόνη",
  	close: "Κλείσιμο",
  	mathtype: "MathType",
  	title_modalwindow: "Τροπικό παράθυρο MathType",
  	close_modal_warning: "Επιθυμείτε σίγουρα αποχώρηση; Θα χαθούν οι αλλαγές που έχετε κάνει.",
  	latex_name_label: "Τύπος LaTeX",
  	browser_no_compatible: "Το πρόγραμμα περιήγησής σας δεν είναι συμβατό με την τεχνολογία AJAX. Χρησιμοποιήστε την πιο πρόσφατη έκδοση του Mozilla Firefox.",
  	error_convert_accessibility: "Σφάλμα κατά τη μετατροπή από MathML σε προσβάσιμο κείμενο.",
  	exception_cross_site: "Το XSS (Cross site scripting) επιτρέπεται μόνο για HTTP.",
  	exception_high_surrogate: "Το υψηλό υποκατάστατο δεν ακολουθείται από χαμηλό υποκατάστατο στο fixedCharCodeAt()",
  	exception_string_length: "Μη έγκυρη συμβολοσειρά. Το μήκος πρέπει να είναι πολλαπλάσιο του 4",
  	exception_key_nonobject: "Έγινε κλήση του Object.keys σε μη αντικείμενο",
  	exception_null_or_undefined: " αυτό είναι μηδενικό ή δεν έχει οριστεί",
  	exception_not_function: " δεν είναι συνάρτηση",
  	exception_invalid_date_format: "Μη έγκυρη μορφή ημερομηνίας: ",
  	exception_casting: "Δεν είναι δυνατή η μετατροπή ",
  	exception_casting_to: " σε "
  };
  var en = {
  	latex: "LaTeX",
  	cancel: "Cancel",
  	accept: "Insert",
  	manual: "Manual",
  	insert_math: "Insert a math equation - MathType",
  	insert_chem: "Insert a chemistry formula - ChemType",
  	minimize: "Minimize",
  	maximize: "Maximize",
  	fullscreen: "Full-screen",
  	exit_fullscreen: "Exit full-screen",
  	close: "Close",
  	mathtype: "MathType",
  	title_modalwindow: "MathType modal window",
  	close_modal_warning: "Are you sure you want to leave? The changes you made will be lost.",
  	latex_name_label: "Latex Formula",
  	browser_no_compatible: "Your browser is not compatible with AJAX technology. Please, use the latest version of Mozilla Firefox.",
  	error_convert_accessibility: "Error converting from MathML to accessible text.",
  	exception_cross_site: "Cross site scripting is only allowed for HTTP.",
  	exception_high_surrogate: "High surrogate not followed by low surrogate in fixedCharCodeAt()",
  	exception_string_length: "Invalid string. Length must be a multiple of 4",
  	exception_key_nonobject: "Object.keys called on non-object",
  	exception_null_or_undefined: " this is null or not defined",
  	exception_not_function: " is not a function",
  	exception_invalid_date_format: "Invalid date format : ",
  	exception_casting: "Cannot cast ",
  	exception_casting_to: " to "
  };
  var es = {
  	latex: "LaTeX",
  	cancel: "Cancelar",
  	accept: "Insertar",
  	manual: "Manual",
  	insert_math: "Insertar fórmula matemática - MathType",
  	insert_chem: "Insertar fórmula química - ChemType",
  	minimize: "Minimizar",
  	maximize: "Maximizar",
  	fullscreen: "Pantalla completa",
  	exit_fullscreen: "Salir de pantalla completa",
  	close: "Cerrar",
  	mathtype: "MathType",
  	title_modalwindow: "Ventana modal de MathType",
  	close_modal_warning: "Seguro que quieres cerrar? Los cambios que has hecho se perderán",
  	latex_name_label: "Formula en Latex",
  	browser_no_compatible: "Tu navegador no es complatible con AJAX. Por favor, usa la última version de Mozilla Firefox.",
  	error_convert_accessibility: "Error conviertiendo una fórmula MathML a texto accesible.",
  	exception_cross_site: "Cross site scripting solo está permitido para HTTP.",
  	exception_high_surrogate: "Subrogado alto no seguido por subrogado bajo en fixedCharCodeAt()",
  	exception_string_length: "Cadena no válida. La longitud debe ser múltiplo de 4",
  	exception_key_nonobject: "Object.keys called on non-object",
  	exception_null_or_undefined: " esto es null o no definido",
  	exception_not_function: " no es una función",
  	exception_invalid_date_format: "Formato de fecha inválido: ",
  	exception_casting: "No se puede emitir",
  	exception_casting_to: " a "
  };
  var et = {
  	latex: "LaTeX",
  	cancel: "Loobu",
  	accept: "Lisa",
  	manual: "Käsiraamat",
  	insert_math: "Lisa matemaatiline valem – WIRIS",
  	insert_chem: "Lisa keemiline valem – ChemType",
  	minimize: "Minimeeri",
  	maximize: "Maksimeeri",
  	fullscreen: "Täiskuva",
  	exit_fullscreen: "Välju täiskuvalt",
  	close: "Sule",
  	mathtype: "MathType",
  	title_modalwindow: "MathType'i modaalaken",
  	close_modal_warning: "Kas soovite kindlasti lahkuda? Tehtud muudatused lähevad kaduma.",
  	latex_name_label: "Latexi valem",
  	browser_no_compatible: "Teie brauser ei ühildu AJAXi tehnoloogiaga. Palun kasutage Mozilla Firefoxi uusimat versiooni.",
  	error_convert_accessibility: "Tõrge teisendamisel MathML-ist muudetavaks tekstiks.",
  	exception_cross_site: "Ristskriptimine on lubatud ainult HTTP kasutamisel.",
  	exception_high_surrogate: "Funktsioonis fixedCharCodeAt() ei järgne kõrgemale asendusliikmele madalam asendusliige.",
  	exception_string_length: "Vigane string. Pikkus peab olema 4 kordne.",
  	exception_key_nonobject: "Protseduur Object.keys kutsuti mitteobjekti korral.",
  	exception_null_or_undefined: " see on null või määramata",
  	exception_not_function: " ei ole funktsioon",
  	exception_invalid_date_format: "Sobimatu kuupäeva kuju: ",
  	exception_casting: "Esitamine ei õnnestu ",
  	exception_casting_to: " – "
  };
  var eu = {
  	latex: "LaTeX",
  	cancel: "Ezeztatu",
  	accept: "Txertatu",
  	manual: "Gida",
  	insert_math: "Txertatu matematikako formula - MathType",
  	insert_chem: "Txertatu formula kimiko bat - ChemType",
  	minimize: "Ikonotu",
  	maximize: "Maximizatu",
  	fullscreen: "Pantaila osoa",
  	exit_fullscreen: "Irten pantaila osotik",
  	close: "Itxi",
  	mathtype: "MathType",
  	title_modalwindow: "MathType leiho modala",
  	close_modal_warning: "Ziur irten nahi duzula? Egiten dituzun aldaketak galdu egingo dira.",
  	latex_name_label: "LaTex Formula",
  	browser_no_compatible: "Zure arakatzailea ez da bateragarria AJAX teknologiarekin. Erabili Mozilla Firefoxen azken bertsioa.",
  	error_convert_accessibility: "Errorea MathMLtik testu irisgarrira bihurtzean.",
  	exception_cross_site: "Gune arteko scriptak HTTPrako soilik onartzen dira.",
  	exception_high_surrogate: "Ordezko baxuak ez dio ordezko altuari jarraitzen, hemen: fixedCharCodeAt()",
  	exception_string_length: "Kate baliogabea. Luzerak 4ren multiploa izan behar du",
  	exception_key_nonobject: "Object.keys deitu zaio objektua ez den zerbaiti",
  	exception_null_or_undefined: " nulua edo definitu gabea da",
  	exception_not_function: " ez da funtzio bat",
  	exception_invalid_date_format: "Data-formatu baliogabea : ",
  	exception_casting: "Ezin da igorri ",
  	exception_casting_to: " honi "
  };
  var fi = {
  	latex: "LaTeX",
  	cancel: "Peruuta",
  	accept: "Lisää",
  	manual: "Manual",
  	insert_math: "Liitä matemaattinen kaava - MathType",
  	insert_chem: "Lisää kemian kaava - ChemType",
  	minimize: "Pienennä",
  	maximize: "Suurenna",
  	fullscreen: "Koko ruutu",
  	exit_fullscreen: "Poistu koko ruudun tilasta",
  	close: "Sulje",
  	mathtype: "MathType",
  	title_modalwindow: "MathTypen modaalinen ikkuna",
  	close_modal_warning: "Oletko varma, että haluat poistua? Menetät tekemäsi muutokset.",
  	latex_name_label: "Latex-kaava",
  	browser_no_compatible: "Selaimesi ei tue AJAX-tekniikkaa. Ole hyvä ja käytä uusinta Firefox-versiota.",
  	error_convert_accessibility: "Virhe muunnettaessa MathML:stä tekstiksi.",
  	exception_cross_site: "Cross site scripting sallitaan vain HTTP:llä.",
  	exception_high_surrogate: "fixedCharCodeAt(): yläsijaismerkkiä ei seurannut alasijaismerkki",
  	exception_string_length: "Epäkelpo merkkijono. Pituuden on oltava 4:n kerrannainen",
  	exception_key_nonobject: "Object.keys kutsui muuta kuin oliota",
  	exception_null_or_undefined: " tämä on null tai ei määritelty",
  	exception_not_function: " ei ole funktio",
  	exception_invalid_date_format: "Virheellinen päivämäärämuoto : ",
  	exception_casting: "Ei voida muuntaa tyyppiä ",
  	exception_casting_to: " tyyppiin "
  };
  var fr = {
  	latex: "LaTeX",
  	cancel: "Annuler",
  	accept: "Insérer",
  	manual: "Manuel",
  	insert_math: "Insérer une formule mathématique - MathType",
  	insert_chem: "Insérer une formule chimique - ChemType",
  	minimize: "Minimiser",
  	maximize: "Maximiser",
  	fullscreen: "Plein écran",
  	exit_fullscreen: "Quitter le plein écran",
  	close: "Fermer",
  	mathtype: "MathType",
  	title_modalwindow: "Fenêtre modale MathType",
  	close_modal_warning: "Confirmez-vous vouloir fermer ? Les changements effectués seront perdus.",
  	latex_name_label: "Formule LaTeX",
  	browser_no_compatible: "Votre navigateur n’est pas compatible avec la technologie AJAX. Veuillez utiliser la dernière version de Mozilla Firefox.",
  	error_convert_accessibility: "Une erreur de conversion du format MathML en texte accessible est survenue.",
  	exception_cross_site: "Le cross-site scripting n’est autorisé que pour HTTP.",
  	exception_high_surrogate: "Substitut élevé non suivi d’un substitut inférieur dans fixedCharCodeAt()",
  	exception_string_length: "Chaîne non valide. Longueur limitée aux multiples de 4",
  	exception_key_nonobject: "Object.keys appelé sur un non-objet",
  	exception_null_or_undefined: " nul ou non défini",
  	exception_not_function: " n’est pas une fonction",
  	exception_invalid_date_format: "Format de date non valide : ",
  	exception_casting: "Impossible de convertir ",
  	exception_casting_to: " sur "
  };
  var gl = {
  	latex: "LaTeX",
  	cancel: "Cancelar",
  	accept: "Inserir",
  	manual: "Manual",
  	insert_math: "Inserir unha fórmula matemática - MathType",
  	insert_chem: "Inserir unha fórmula química - ChemType",
  	minimize: "Minimizar",
  	maximize: "Maximizar",
  	fullscreen: "Pantalla completa",
  	exit_fullscreen: "Saír da pantalla completa",
  	close: "Pechar",
  	mathtype: "MathType",
  	title_modalwindow: "Ventá modal de MathType",
  	close_modal_warning: "Seguro que quere saír? Perderanse os cambios realizados.",
  	latex_name_label: "Fórmula Latex",
  	browser_no_compatible: "O seu explorador non é compatible coa tecnoloxía AJAX. Use a versión máis recente de Mozilla Firefox.",
  	error_convert_accessibility: "Erro ao converter de MathML a texto accesible.",
  	exception_cross_site: "Os scripts de sitios só se permiten para HTTP.",
  	exception_high_surrogate: "Suplente superior non seguido por suplente inferior en fixedCharCodeAt()",
  	exception_string_length: "Cadea non válida. A lonxitude debe ser un múltiplo de 4",
  	exception_key_nonobject: "Claves de obxecto chamadas en non obxecto",
  	exception_null_or_undefined: " nulo ou non definido",
  	exception_not_function: " non é unha función",
  	exception_invalid_date_format: "Formato de data non válido: ",
  	exception_casting: "Non se pode converter ",
  	exception_casting_to: " a "
  };
  var he = {
  	latex: "LaTeX",
  	cancel: "ביטול",
  	accept: "עדכון",
  	manual: "ידני",
  	insert_math: "הוספת נוסחה מתמטית - MathType",
  	insert_chem: "הוספת כתיבה כימית - ChemType",
  	minimize: "מזערי",
  	maximize: "מרבי",
  	fullscreen: "מסך מלא",
  	exit_fullscreen: "יציאה ממצב מסך מלא",
  	close: "סגירה",
  	mathtype: "MathType",
  	title_modalwindow: "חלון מודאלי של MathType",
  	close_modal_warning: "האם לצאת? שינויים אשר בוצעו ימחקו.",
  	latex_name_label: "נוסחת Latex",
  	browser_no_compatible: "הדפדפן שלך אינו תואם לטכנולוגיית AJAX. יש להשתמש בגרסה העדכנית ביותר של Mozilla Firefox.",
  	error_convert_accessibility: "שגיאה בהמרה מ-MathML לטקסט נגיש.",
  	exception_cross_site: "סקריפטינג חוצה-אתרים מורשה עבור HTTP בלבד.",
  	exception_high_surrogate: "ערך ממלא מקום גבוה אינו מופיע אחרי ערך ממלא מקום נמוך ב-fixedCharCodeAt()‎",
  	exception_string_length: "מחרוזת לא חוקית. האורך חייב להיות כפולה של 4",
  	exception_key_nonobject: "בוצעה קריאה אל Object.keys ברכיב שאינו אובייקט",
  	exception_null_or_undefined: " הוא Null או לא מוגדר",
  	exception_not_function: "איננה פונקציה",
  	exception_invalid_date_format: "תסדיר תאריך אינו תקין : ",
  	exception_casting: "לא ניתן להמיר ",
  	exception_casting_to: " ל "
  };
  var hr = {
  	latex: "LaTeX",
  	cancel: "Poništi",
  	accept: "Umetni",
  	manual: "Priručnik",
  	insert_math: "Umetnite matematičku formulu - MathType",
  	insert_chem: "Umetnite kemijsku formulu - ChemType",
  	minimize: "Minimiziraj",
  	maximize: "Maksimiziraj",
  	fullscreen: "Cijeli zaslon",
  	exit_fullscreen: "Izlaz iz prikaza na cijelom zaslonu",
  	close: "Zatvori",
  	mathtype: "MathType",
  	title_modalwindow: "MathType modalni prozor",
  	close_modal_warning: "Sigurno želite zatvoriti? Izgubit će se unesene promjene.",
  	latex_name_label: "Latex formula",
  	browser_no_compatible: "Vaš preglednik nije kompatibilan s AJAX tehnologijom. Upotrijebite najnoviju verziju Mozilla Firefoxa.",
  	error_convert_accessibility: "Pogreška konverzije iz MathML-a u dostupni tekst.",
  	exception_cross_site: "Skriptiranje na različitim web-mjestima dopušteno je samo za HTTP.",
  	exception_high_surrogate: "Iza visoke zamjene ne slijedi niska zamjena u fixedCharCodeAt()",
  	exception_string_length: "Nevažeći niz. Duljina mora biti višekratnik broja 4",
  	exception_key_nonobject: "Object.keys pozvano na ne-objekt",
  	exception_null_or_undefined: " ovo je nula ili nije definirano",
  	exception_not_function: " nije funkcija",
  	exception_invalid_date_format: "Nevažeći format datuma : ",
  	exception_casting: "Ne može se poslati ",
  	exception_casting_to: " na "
  };
  var hu = {
  	latex: "LaTeX",
  	cancel: "Mégsem",
  	accept: "Beszúrás",
  	manual: "Kézikönyv",
  	insert_math: "Matematikai képlet beszúrása - MathType",
  	insert_chem: "Kémiai képet beillesztése - ChemType",
  	minimize: "Kis méret",
  	maximize: "Nagy méret",
  	fullscreen: "Teljes képernyő",
  	exit_fullscreen: "Teljes képernyő elhagyása",
  	close: "Bezárás",
  	mathtype: "MathType",
  	title_modalwindow: "MathType modális ablak",
  	close_modal_warning: "Biztosan kilép? A módosítások el fognak veszni.",
  	latex_name_label: "Latex képlet",
  	browser_no_compatible: "A böngészője nem kompatibilis az AJAX technológiával. Használja a Mozilla Firefox legújabb verzióját.",
  	error_convert_accessibility: "Hiba lépett fel a MathML szöveggé történő konvertálása során.",
  	exception_cross_site: "Az oldalak közti scriptelés csak HTTP esetén engedélyezett.",
  	exception_high_surrogate: "A magas helyettesítő karaktert nem alacsony helyettesítő karakter követi a fixedCharCodeAt() esetében",
  	exception_string_length: "Érvénytelen karakterlánc. A hossznak a 4 többszörösének kell lennie",
  	exception_key_nonobject: "Az Object.keys egy nem objektumra került meghívásra",
  	exception_null_or_undefined: " null vagy nem definiált",
  	exception_not_function: " nem függvény",
  	exception_invalid_date_format: "Érvénytelen dátumformátum: ",
  	exception_casting: "Nem alkalmazható ",
  	exception_casting_to: " erre "
  };
  var id = {
  	latex: "LaTeX",
  	cancel: "Membatalkan",
  	accept: "Masukkan",
  	manual: "Manual",
  	insert_math: "Masukkan rumus matematika - MathType",
  	insert_chem: "Masukkan rumus kimia - ChemType",
  	minimize: "Minikan",
  	maximize: "Perbesar",
  	fullscreen: "Layar penuh",
  	exit_fullscreen: "Keluar layar penuh",
  	close: "Tutup",
  	mathtype: "MathType",
  	title_modalwindow: "Jendela modal MathType",
  	close_modal_warning: "Anda yakin ingin keluar? Anda akan kehilangan perubahan yang Anda buat.",
  	latex_name_label: "Rumus Latex",
  	browser_no_compatible: "Penjelajah Anda tidak kompatibel dengan teknologi AJAX. Harap gunakan Mozilla Firefox versi terbaru.",
  	error_convert_accessibility: "Kesalahan konversi dari MathML menjadi teks yang dapat diakses.",
  	exception_cross_site: "Skrip lintas situs hanya diizinkan untuk HTTP.",
  	exception_high_surrogate: "Pengganti tinggi tidak diikuti oleh pengganti rendah di fixedCharCodeAt()",
  	exception_string_length: "String tidak valid. Panjang harus kelipatan 4",
  	exception_key_nonobject: "Object.keys meminta nonobjek",
  	exception_null_or_undefined: " ini tidak berlaku atau tidak didefinisikan",
  	exception_not_function: " bukan sebuah fungsi",
  	exception_invalid_date_format: "Format tanggal tidak valid : ",
  	exception_casting: "Tidak dapat mentransmisikan ",
  	exception_casting_to: " untuk "
  };
  var it = {
  	latex: "LaTeX",
  	cancel: "Annulla",
  	accept: "Inserisci",
  	manual: "Manuale",
  	insert_math: "Inserisci una formula matematica - MathType",
  	insert_chem: "Inserisci una formula chimica - ChemType",
  	minimize: "Riduci a icona",
  	maximize: "Ingrandisci",
  	fullscreen: "Schermo intero",
  	exit_fullscreen: "Esci da schermo intero",
  	close: "Chiudi",
  	mathtype: "MathType",
  	title_modalwindow: "Finestra modale di MathType",
  	close_modal_warning: "Confermi di voler uscire? Le modifiche effettuate andranno perse.",
  	latex_name_label: "Formula LaTeX",
  	browser_no_compatible: "Il tuo browser non è compatibile con la tecnologia AJAX. Utilizza la versione più recente di Mozilla Firefox.",
  	error_convert_accessibility: "Errore durante la conversione da MathML in testo accessibile.",
  	exception_cross_site: "Lo scripting tra siti è consentito solo per HTTP.",
  	exception_high_surrogate: "Surrogato alto non seguito da surrogato basso in fixedCharCodeAt()",
  	exception_string_length: "Stringa non valida. La lunghezza deve essere un multiplo di 4",
  	exception_key_nonobject: "Metodo Object.keys richiamato in un elemento non oggetto",
  	exception_null_or_undefined: " questo è un valore null o non definito",
  	exception_not_function: " non è una funzione",
  	exception_invalid_date_format: "Formato di data non valido: ",
  	exception_casting: "Impossibile eseguire il cast ",
  	exception_casting_to: " a "
  };
  var ja = {
  	latex: "LaTeX",
  	cancel: "キャンセル",
  	accept: "挿入",
  	manual: "マニュアル",
  	insert_math: "数式を挿入 - MathType",
  	insert_chem: "化学式を挿入 - ChemType",
  	minimize: "最小化",
  	maximize: "最大化",
  	fullscreen: "全画面表示",
  	exit_fullscreen: "全画面表示を解除",
  	close: "閉じる",
  	mathtype: "MathType",
  	title_modalwindow: "MathType モードウィンドウ",
  	close_modal_warning: "このページから移動してもよろしいですか？変更内容は失われます。",
  	latex_name_label: "LaTeX 数式",
  	browser_no_compatible: "お使いのブラウザは、AJAX 技術と互換性がありません。Mozilla Firefox の最新バージョンをご使用ください。",
  	error_convert_accessibility: "MathML からアクセシブルなテキストへの変換中にエラーが発生しました。",
  	exception_cross_site: "クロスサイトスクリプティングは、HTTP のみに許可されています。",
  	exception_high_surrogate: "fixedCharCodeAt（）で上位サロゲートの後に下位サロゲートがありません",
  	exception_string_length: "無効な文字列です。長さは4の倍数である必要があります",
  	exception_key_nonobject: "Object.keys が非オブジェクトで呼び出されました",
  	exception_null_or_undefined: " null であるか、定義されていません",
  	exception_not_function: " は関数ではありません",
  	exception_invalid_date_format: "無効な日付形式: ",
  	exception_casting: "次にキャスト ",
  	exception_casting_to: " できません "
  };
  var ko = {
  	latex: "LaTeX",
  	cancel: "취소",
  	accept: "삽입",
  	manual: "설명서",
  	insert_math: "수학 공식 삽입 - MathType",
  	insert_chem: "화학 공식 입력하기 - ChemType",
  	minimize: "최소화",
  	maximize: "최대화",
  	fullscreen: "전체 화면",
  	exit_fullscreen: "전체 화면 나가기",
  	close: "닫기",
  	mathtype: "MathType",
  	title_modalwindow: "MathType 모달 창",
  	close_modal_warning: "정말로 나가시겠습니까? 변경 사항이 손실됩니다.",
  	latex_name_label: "Latex 공식",
  	browser_no_compatible: "사용자의 브라우저는 AJAX 기술과 호환되지 않습니다. Mozilla Firefox 최신 버전을 사용하십시오.",
  	error_convert_accessibility: "MathML로부터 접근 가능한 텍스트로 오류 변환.",
  	exception_cross_site: "사이트 교차 스크립팅은 HTTP 환경에서만 사용할 수 있습니다.",
  	exception_high_surrogate: "fixedCharCodeAt()에서는 상위 서러게이트 뒤에 하위 서러게이트가 붙지 않습니다",
  	exception_string_length: "유효하지 않은 스트링입니다. 길이는 4의 배수여야 합니다",
  	exception_key_nonobject: "Object.keys가 non-object를 요청하였습니다",
  	exception_null_or_undefined: " Null값이거나 정의되지 않았습니다",
  	exception_not_function: " 함수가 아닙니다",
  	exception_invalid_date_format: "유효하지 않은 날짜 포맷 : ",
  	exception_casting: "캐스팅할 수 없습니다 ",
  	exception_casting_to: " (으)로 "
  };
  var nl = {
  	latex: "LaTeX",
  	cancel: "Annuleren",
  	accept: "Invoegen",
  	manual: "Handmatig",
  	insert_math: "Een wiskundige vergelijking invoegen - MathType",
  	insert_chem: "Een scheikundige formule invoegen - ChemType",
  	minimize: "Minimaliseer",
  	maximize: "Maximaliseer",
  	fullscreen: "Schermvullend",
  	exit_fullscreen: "Verlaat volledig scherm",
  	close: "Sluit",
  	mathtype: "MathType",
  	title_modalwindow: "Modaal venster MathType",
  	close_modal_warning: "Weet je zeker dat je de app wilt sluiten? De gemaakte wijzigingen gaan verloren.",
  	latex_name_label: "LaTeX-formule",
  	browser_no_compatible: "Je browser is niet compatibel met AJAX-technologie. Gebruik de meest recente versie van Mozilla Firefox.",
  	error_convert_accessibility: "Fout bij conversie van MathML naar toegankelijke tekst.",
  	exception_cross_site: "Cross-site scripting is alleen toegestaan voor HTTP.",
  	exception_high_surrogate: "Hoog surrogaat niet gevolgd door laag surrogaat in fixedCharCodeAt()",
  	exception_string_length: "Ongeldige tekenreeks. Lengte moet een veelvoud van 4 zijn",
  	exception_key_nonobject: "Object.keys opgeroepen voor niet-object",
  	exception_null_or_undefined: " dit is nul of niet gedefinieerd",
  	exception_not_function: " is geen functie",
  	exception_invalid_date_format: "Ongeldige datumnotatie: ",
  	exception_casting: "Kan niet weergeven ",
  	exception_casting_to: " op "
  };
  var no = {
  	latex: "LaTeX",
  	cancel: "Avbryt",
  	accept: "Set inn",
  	manual: "Håndbok",
  	insert_math: "Sett inn matematikkformel - MathType",
  	insert_chem: "Set inn ein kjemisk formel – ChemType",
  	minimize: "Minimer",
  	maximize: "Maksimer",
  	fullscreen: "Fullskjerm",
  	exit_fullscreen: "Avslutt fullskjerm",
  	close: "Lukk",
  	mathtype: "MathType",
  	title_modalwindow: "Modalt MathType-vindu",
  	close_modal_warning: "Er du sikker på at du vil gå ut? Endringane du har gjort, vil gå tapt.",
  	latex_name_label: "LaTeX-formel",
  	browser_no_compatible: "Nettlesaren er ikkje kompatibel med AJAX-teknologien. Bruk den nyaste versjonen av Mozilla Firefox.",
  	error_convert_accessibility: "Feil under konvertering frå MathML til tilgjengeleg tekst.",
  	exception_cross_site: "Skripting på tvers av nettstadar er bere tillaten med HTTP.",
  	exception_high_surrogate: "Høgt surrogat er ikkje etterfølgt av lågt surrogat i fixedCharCodeAt()",
  	exception_string_length: "Ugyldig streng. Lengda må vera deleleg på 4",
  	exception_key_nonobject: "Object.keys kalla på eit ikkje-objekt",
  	exception_null_or_undefined: " dette er null eller ikkje definert",
  	exception_not_function: " er ikkje ein funksjon",
  	exception_invalid_date_format: "Ugyldig datoformat: ",
  	exception_casting: "Kan ikkje bruka casting ",
  	exception_casting_to: " til "
  };
  var nb = {
  	latex: "LaTeX",
  	cancel: "Avbryt",
  	accept: "Insert",
  	manual: "Håndbok",
  	insert_math: "Sett inn matematikkformel - MathType",
  	insert_chem: "Sett inn en kjemisk formel – ChemType",
  	minimize: "Minimer",
  	maximize: "Maksimer",
  	fullscreen: "Fullskjerm",
  	exit_fullscreen: "Avslutt fullskjerm",
  	close: "Lukk",
  	mathtype: "MathType",
  	title_modalwindow: "Modalt MathType-vindu",
  	close_modal_warning: "Er du sikker på at du vil gå ut? Endringene du har gjort, vil gå tapt.",
  	latex_name_label: "LaTeX-formel",
  	browser_no_compatible: "Nettleseren er ikke kompatibel med AJAX-teknologien. Bruk den nyeste versjonen av Mozilla Firefox.",
  	error_convert_accessibility: "Feil under konvertering fra MathML til tilgjengelig tekst.",
  	exception_cross_site: "Skripting på tvers av nettsteder er bare tillatt med HTTP.",
  	exception_high_surrogate: "Høyt surrogat etterfølges ikke av lavt surrogat i fixedCharCodeAt()",
  	exception_string_length: "Ugyldig streng. Lengden må være delelig på 4",
  	exception_key_nonobject: "Object.keys kalte på et ikke-objekt",
  	exception_null_or_undefined: " dette er null eller ikke definert",
  	exception_not_function: " er ikke en funksjon",
  	exception_invalid_date_format: "Ugyldig datoformat: ",
  	exception_casting: "Kan ikke bruke casting ",
  	exception_casting_to: " til "
  };
  var nn = {
  	latex: "LaTeX",
  	cancel: "Avbryt",
  	accept: "Set inn",
  	manual: "Håndbok",
  	insert_math: "Sett inn matematikkformel - MathType",
  	insert_chem: "Set inn ein kjemisk formel – ChemType",
  	minimize: "Minimer",
  	maximize: "Maksimer",
  	fullscreen: "Fullskjerm",
  	exit_fullscreen: "Avslutt fullskjerm",
  	close: "Lukk",
  	mathtype: "MathType",
  	title_modalwindow: "Modalt MathType-vindu",
  	close_modal_warning: "Er du sikker på at du vil gå ut? Endringane du har gjort, vil gå tapt.",
  	latex_name_label: "LaTeX-formel",
  	browser_no_compatible: "Nettlesaren er ikkje kompatibel med AJAX-teknologien. Bruk den nyaste versjonen av Mozilla Firefox.",
  	error_convert_accessibility: "Feil under konvertering frå MathML til tilgjengeleg tekst.",
  	exception_cross_site: "Skripting på tvers av nettstadar er bere tillaten med HTTP.",
  	exception_high_surrogate: "Høgt surrogat er ikkje etterfølgt av lågt surrogat i fixedCharCodeAt()",
  	exception_string_length: "Ugyldig streng. Lengda må vera deleleg på 4",
  	exception_key_nonobject: "Object.keys kalla på eit ikkje-objekt",
  	exception_null_or_undefined: " dette er null eller ikkje definert",
  	exception_not_function: " er ikkje ein funksjon",
  	exception_invalid_date_format: "Ugyldig datoformat: ",
  	exception_casting: "Kan ikkje bruka casting ",
  	exception_casting_to: " til "
  };
  var pl = {
  	latex: "LaTeX",
  	cancel: "Anuluj",
  	accept: "Wstaw",
  	manual: "Instrukcja",
  	insert_math: "Wstaw formułę matematyczną - MathType",
  	insert_chem: "Wstaw wzór chemiczny — ChemType",
  	minimize: "Minimalizuj",
  	maximize: "Maksymalizuj",
  	fullscreen: "Pełny ekran",
  	exit_fullscreen: "Opuść tryb pełnoekranowy",
  	close: "Zamknij",
  	mathtype: "MathType",
  	title_modalwindow: "Okno modalne MathType",
  	close_modal_warning: "Czy na pewno chcesz zamknąć? Wprowadzone zmiany zostaną utracone.",
  	latex_name_label: "Wzór Latex",
  	browser_no_compatible: "Twoja przeglądarka jest niezgodna z technologią AJAX Użyj najnowszej wersji Mozilla Firefox.",
  	error_convert_accessibility: "Błąd podczas konwertowania z formatu MathML na dostępny tekst.",
  	exception_cross_site: "Krzyżowanie skryptów witryny jest dozwolone tylko dla HTTP.",
  	exception_high_surrogate: "Brak niskiego surogatu po wysokim surogacie w fixedCharCodeAt()",
  	exception_string_length: "Niewłaściwy ciąg znaków. Długość musi być wielokrotnością liczby 4.",
  	exception_key_nonobject: "Argumentem wywołanej funkcji Object.key nie jest obiekt.",
  	exception_null_or_undefined: " jest zerowy lub niezdefiniowany",
  	exception_not_function: " nie jest funkcją",
  	exception_invalid_date_format: "Nieprawidłowy format daty: ",
  	exception_casting: "Nie można rzutować ",
  	exception_casting_to: " na "
  };
  var pt = {
  	latex: "LaTeX",
  	cancel: "Cancelar",
  	accept: "Inserir",
  	manual: "Manual",
  	insert_math: "Inserir fórmula matemática - MathType",
  	insert_chem: "Inserir uma fórmula química - ChemType",
  	minimize: "Minimizar",
  	maximize: "Maximizar",
  	fullscreen: "Ecrã completo",
  	exit_fullscreen: "Sair do ecrã completo",
  	close: "Fechar",
  	mathtype: "MathType",
  	title_modalwindow: "Janela modal do MathType",
  	close_modal_warning: "Pretende sair? As alterações efetuadas serão perdidas.",
  	latex_name_label: "Fórmula Latex",
  	browser_no_compatible: "O seu navegador não é compatível com a tecnologia AJAX. Utilize a versão mais recente do Mozilla Firefox.",
  	error_convert_accessibility: "Erro ao converter de MathML para texto acessível.",
  	exception_cross_site: "O processamento de scripts em vários sites só é permitido para HTTP.",
  	exception_high_surrogate: "Substituto alto não seguido por um substituto baixo em fixedCharCodeAt()",
  	exception_string_length: "Cadeia inválida. O comprimento tem de ser um múltiplo de 4",
  	exception_key_nonobject: "Object.keys chamou um não-objeto",
  	exception_null_or_undefined: " é nulo ou não está definido",
  	exception_not_function: " não é uma função",
  	exception_invalid_date_format: "Formato de data inválido: ",
  	exception_casting: "Não é possível adicionar ",
  	exception_casting_to: " até "
  };
  var pt_br = {
  	latex: "LaTeX",
  	cancel: "Cancelar",
  	accept: "Inserir",
  	manual: "Manual",
  	insert_math: "Inserir fórmula matemática - MathType",
  	insert_chem: "Insira uma fórmula química - ChemType",
  	minimize: "Minimizar",
  	maximize: "Maximizar",
  	fullscreen: "Tela cheia",
  	exit_fullscreen: "Sair de tela cheia",
  	close: "Fechar",
  	mathtype: "MathType",
  	title_modalwindow: "Janela modal do MathType",
  	close_modal_warning: "Tem certeza de que deseja sair? Todas as alterações serão perdidas.",
  	latex_name_label: "Fórmula LaTeX",
  	browser_no_compatible: "O navegador não é compatível com a tecnologia AJAX. Use a versão mais recente do Mozilla Firefox.",
  	error_convert_accessibility: "Erro ao converter de MathML para texto acessível.",
  	exception_cross_site: "O uso de scripts entre sites só é permitido para HTTP.",
  	exception_high_surrogate: "High surrogate não seguido de low surrogate em fixedCharCodeAt()",
  	exception_string_length: "String inválida. O comprimento deve ser um múltiplo de 4",
  	exception_key_nonobject: "Object.keys chamados em não objeto",
  	exception_null_or_undefined: " isto é nulo ou não definido",
  	exception_not_function: " não é uma função",
  	exception_invalid_date_format: "Formato de data inválido: ",
  	exception_casting: "Não é possível transmitir ",
  	exception_casting_to: " para "
  };
  var ro = {
  	latex: "LaTeX",
  	cancel: "Anulare",
  	accept: "Inserați",
  	manual: "Ghid",
  	insert_math: "Inserați o formulă matematică - MathType",
  	insert_chem: "Inserați o formulă chimică - ChemType",
  	minimize: "Minimizați",
  	maximize: "Maximizați",
  	fullscreen: "Afișați pe tot ecranul",
  	exit_fullscreen: "Opriți afișarea pe tot ecranul",
  	close: "Închideți",
  	mathtype: "MathType",
  	title_modalwindow: "Fereastră modală MathType",
  	close_modal_warning: "Sigur doriți să ieșiți? Modificările realizate se vor pierde.",
  	latex_name_label: "Formulă Latex",
  	browser_no_compatible: "Browserul dvs. nu este compatibil cu tehnologia AJAX. Utilizați cea mai recentă versiune de Mozilla Firefox.",
  	error_convert_accessibility: "Eroare la convertirea din MathML în text accesibil.",
  	exception_cross_site: "Scriptarea între site‑uri este permisă doar pentru HTTP.",
  	exception_high_surrogate: "Surogatul superior nu este urmat de un surogat inferior în fixedCharCodeAt()",
  	exception_string_length: "Șir nevalid. Lungimea trebuie să fie multiplu de 4",
  	exception_key_nonobject: "Object.keys a apelat un non-obiect",
  	exception_null_or_undefined: " este null sau nu este definit",
  	exception_not_function: " nu este funcție",
  	exception_invalid_date_format: "Format de dată nevalid: ",
  	exception_casting: "nu se poate difuza ",
  	exception_casting_to: " către "
  };
  var ru = {
  	latex: "LaTeX",
  	cancel: "отмена",
  	accept: "Вставка",
  	manual: "вручную",
  	insert_math: "Вставить математическую формулу: WIRIS",
  	insert_chem: "Вставить химическую формулу — ChemType",
  	minimize: "Свернуть",
  	maximize: "Развернуть",
  	fullscreen: "На весь экран",
  	exit_fullscreen: "Выйти из полноэкранного режима",
  	close: "Закрыть",
  	mathtype: "MathType",
  	title_modalwindow: "Режимное окно MathType",
  	close_modal_warning: "Вы уверены, что хотите выйти? Все внесенные изменения будут утрачены.",
  	latex_name_label: "Формула Latex",
  	browser_no_compatible: "Ваш браузер несовместим с технологией AJAX. Используйте последнюю версию Mozilla Firefox.",
  	error_convert_accessibility: "При преобразовании формулы в текст допустимого формата произошла ошибка.",
  	exception_cross_site: "Межсайтовые сценарии доступны только для HTTP.",
  	exception_high_surrogate: "Младший символ-заместитель не сопровождает старший символ-заместитель в исправленном методе CharCodeAt()",
  	exception_string_length: "Недопустимая строка. Длинна должна быть кратной 4.",
  	exception_key_nonobject: "Метод Object.keys вызван не для объекта",
  	exception_null_or_undefined: " значение пустое или не определено",
  	exception_not_function: " не функция",
  	exception_invalid_date_format: "Недопустимый формат даты: ",
  	exception_casting: "Не удается привести ",
  	exception_casting_to: " к "
  };
  var sv = {
  	latex: "LaTeX",
  	cancel: "Avbryt",
  	accept: "Infoga",
  	manual: "Bruksanvisning",
  	insert_math: "Infoga matematisk formel - MathType",
  	insert_chem: "Infoga en kemiformel – ChemType",
  	minimize: "Minimera",
  	maximize: "Maximera",
  	fullscreen: "Helskärm",
  	exit_fullscreen: "Stäng helskärm",
  	close: "Stäng",
  	mathtype: "MathType",
  	title_modalwindow: "MathType modulfönster",
  	close_modal_warning: "Vill du avsluta? Inga ändringar kommer att sparas.",
  	latex_name_label: "Latex-formel",
  	browser_no_compatible: "Din webbläsare är inte kompatibel med AJAX-teknik. Använd den senaste versionen av Mozilla Firefox.",
  	error_convert_accessibility: "Det uppstod ett fel vid konvertering från MathML till åtkomlig text.",
  	exception_cross_site: "Skriptkörning över flera sajter är endast tillåtet för HTTP.",
  	exception_high_surrogate: "Hög surrogat följs inte av låg surrogat i fixedCharCodeAt()",
  	exception_string_length: "Ogiltig sträng. Längden måste vara en multipel av 4",
  	exception_key_nonobject: "Object.keys anropade icke-objekt",
  	exception_null_or_undefined: " det är null eller inte definierat",
  	exception_not_function: " är inte en funktion",
  	exception_invalid_date_format: "Ogiltigt datumformat: ",
  	exception_casting: "Går inte att konvertera ",
  	exception_casting_to: " till "
  };
  var tr = {
  	latex: "LaTeX",
  	cancel: "Vazgeç",
  	accept: "Ekle",
  	manual: "Kılavuz",
  	insert_math: "Matematik formülü ekle - MathType",
  	insert_chem: "Kimya formülü ekleyin - ChemType",
  	minimize: "Simge Durumuna Küçült",
  	maximize: "Ekranı Kapla",
  	fullscreen: "Tam Ekran",
  	exit_fullscreen: "Tam Ekrandan Çık",
  	close: "Kapat",
  	mathtype: "MathType",
  	title_modalwindow: "MathType kalıcı penceresi",
  	close_modal_warning: "Çıkmak istediğinizden emin misiniz? Yaptığınız değişiklikler kaybolacak.",
  	latex_name_label: "Latex Formülü",
  	browser_no_compatible: "Tarayıcınız AJAX teknolojisiyle uyumlu değil. Lütfen en güncel Mozilla Firefox sürümünü kullanın.",
  	error_convert_accessibility: "MathML biçiminden erişilebilir metne dönüştürme hatası.",
  	exception_cross_site: "Siteler arası komut dosyası yazma işlemine yalnızca HTTP için izin verilir.",
  	exception_high_surrogate: "fixedCharCodeAt() fonksiyonunda üst vekilin ardından alt vekil gelmiyor",
  	exception_string_length: "Geçersiz dizgi. Uzunluk, 4'ün katlarından biri olmalıdır",
  	exception_key_nonobject: "Nesne olmayan öğe üzerinde Object.keys çağrıldı",
  	exception_null_or_undefined: " bu değer boş veya tanımlanmamış",
  	exception_not_function: " bir fonksiyon değil",
  	exception_invalid_date_format: "Geçersiz tarih biçimi: ",
  	exception_casting: "Tür dönüştürülemiyor ",
  	exception_casting_to: " hedef: "
  };
  var zh = {
  	latex: "LaTeX",
  	cancel: "取消",
  	accept: "插入",
  	manual: "手册",
  	insert_math: "插入数学公式 - MathType",
  	insert_chem: "插入化学分子式 - ChemType",
  	minimize: "最小化",
  	maximize: "最大化",
  	fullscreen: "全屏幕",
  	exit_fullscreen: "退出全屏幕",
  	close: "关闭",
  	mathtype: "MathType",
  	title_modalwindow: "MathType 模式窗口",
  	close_modal_warning: "您确定要离开吗？您所做的修改将丢失。",
  	latex_name_label: "Latex 分子式",
  	browser_no_compatible: "您的浏览器不兼容 AJAX 技术。请使用最新版 Mozilla Firefox。",
  	error_convert_accessibility: "将 MathML 转换为可访问文本时出错。",
  	exception_cross_site: "仅 HTTP 允许跨站脚本。",
  	exception_high_surrogate: "fixedCharCodeAt() 中的高位代理之后未跟随低位代理",
  	exception_string_length: "无效字符串。长度必须是 4 的倍数",
  	exception_key_nonobject: "非对象调用了 Object.keys",
  	exception_null_or_undefined: " 该值为空或未定义",
  	exception_not_function: " 不是一个函数",
  	exception_invalid_date_format: "无效日期格式： ",
  	exception_casting: "无法转换 ",
  	exception_casting_to: " 为 "
  };
  var translations = {
  	ar: ar,
  	ca: ca,
  	cs: cs,
  	da: da,
  	de: de,
  	el: el,
  	en: en,
  	es: es,
  	et: et,
  	eu: eu,
  	fi: fi,
  	fr: fr,
  	gl: gl,
  	he: he,
  	hr: hr,
  	hu: hu,
  	id: id,
  	it: it,
  	ja: ja,
  	ko: ko,
  	nl: nl,
  	no: no,
  	nb: nb,
  	nn: nn,
  	pl: pl,
  	pt: pt,
  	pt_br: pt_br,
  	ro: ro,
  	ru: ru,
  	sv: sv,
  	tr: tr,
  	zh: zh,
  	"": {
  }
  };

  /**
   * This class represents a string manager. It's used to load localized strings.
   */ class StringManager {
      constructor(){
          throw new Error("Static class StringManager can not be instantiated.");
      }
      /**
     * Returns the associated value of certain string key. If the associated value
     * doesn't exits returns the original key.
     * @param {string} key - string key
     * @param {string} lang - DEFAULT = null. Specify the language to translate the string
     * @returns {string} correspondent value. If doesn't exists original key.
     */ static get(key, lang) {
          // Default language definition
          let { language } = this;
          // If parameter language, use it
          if (lang) {
              language = lang;
          }
          // Cut down on strings. e.g. en_US -> en
          if (language && language.length > 2) {
              language = language.slice(0, 2);
          }
          // Check if we support the language
          if (!this.strings.hasOwnProperty(language)) {
              // eslint-disable-line no-prototype-builtins
              console.warn(`Unknown language ${language} set in StringManager.`);
              language = "en";
          }
          // Check if the key is supported in the given language
          if (!this.strings[language].hasOwnProperty(key)) {
              // eslint-disable-line no-prototype-builtins
              console.warn(`Unknown key ${key} for language ${language} in StringManager.`);
              return key;
          }
          return this.strings[language][key];
      }
  }
  /**
   * Dictionary of dictionaries:
   * Key: language code
   * Value: Key: id of the string
   *        Value: translation of the string
   */ StringManager.strings = translations;
  /**
   * Language of the translations; English by default
   */ StringManager.language = "en";

  /**
   * This class represents an utility class.
   */ class Util {
      /**
     * Fires an event in a target.
     * @param {EventTarget} eventTarget - target where event should be fired.
     * @param {string} eventName event to fire.
     * @static
     */ static fireEvent(eventTarget, eventName) {
          if (document.createEvent) {
              const eventObject = document.createEvent("HTMLEvents");
              eventObject.initEvent(eventName, true, true);
              return !eventTarget.dispatchEvent(eventObject);
          }
          const eventObject = document.createEventObject();
          return eventTarget.fireEvent(`on${eventName}`, eventObject);
      }
      /**
     * Cross-browser addEventListener/attachEvent function.
     * @param {EventTarget} eventTarget - target to add the event.
     * @param {string} eventName - specifies the type of event.
     * @param {Function} callBackFunction - callback function.
     * @static
     */ static addEvent(eventTarget, eventName, callBackFunction) {
          if (eventTarget.addEventListener) {
              eventTarget.addEventListener(eventName, callBackFunction, true);
          } else if (eventTarget.attachEvent) {
              // Backwards compatibility.
              eventTarget.attachEvent(`on${eventName}`, callBackFunction);
          }
      }
      /**
     * Cross-browser removeEventListener/detachEvent function.
     * @param {EventTarget} eventTarget - target to add the event.
     * @param {string} eventName - specifies the type of event.
     * @param {Function} callBackFunction - function to remove from the event target.
     * @static
     */ static removeEvent(eventTarget, eventName, callBackFunction) {
          if (eventTarget.removeEventListener) {
              eventTarget.removeEventListener(eventName, callBackFunction, true);
          } else if (eventTarget.detachEvent) {
              eventTarget.detachEvent(`on${eventName}`, callBackFunction);
          }
      }
      /**
     * Adds the a callback function, for a certain event target, to the following event types:
     * - dblclick
     * - mousedown
     * - mouseup
     * @param {EventTarget} eventTarget - event target.
     * @param {Function} doubleClickHandler - function to run when on dblclick event.
     * @param {Function} mousedownHandler - function to run when on mousedown event.
     * @param {Function} mouseupHandler - function to run when on mouseup event.
     * @static
     */ static addElementEvents(eventTarget, doubleClickHandler, mousedownHandler, mouseupHandler) {
          if (doubleClickHandler) {
              this.callbackDblclick = (event)=>{
                  const realEvent = event || window.event;
                  const element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
                  doubleClickHandler(element, realEvent);
              };
              Util.addEvent(eventTarget, "dblclick", this.callbackDblclick);
          }
          if (mousedownHandler) {
              this.callbackMousedown = (event)=>{
                  const realEvent = event || window.event;
                  const element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
                  mousedownHandler(element, realEvent);
              };
              Util.addEvent(eventTarget, "mousedown", this.callbackMousedown);
          }
          if (mouseupHandler) {
              this.callbackMouseup = (event)=>{
                  const realEvent = event || window.event;
                  const element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
                  mouseupHandler(element, realEvent);
              };
              // Chrome doesn't trigger this event for eventTarget if we release the mouse button
              // while the mouse is outside the editor text field.
              // This is a workaround: we trigger the event independently of where the mouse
              // is when we release its button.
              Util.addEvent(document, "mouseup", this.callbackMouseup);
              Util.addEvent(eventTarget, "mouseup", this.callbackMouseup);
          }
      }
      /**
     * Remove all callback function, for a certain event target, to the following event types:
     * - dblclick
     * - mousedown
     * - mouseup
     * @param {EventTarget} eventTarget - event target.
     * @static
     */ static removeElementEvents(eventTarget) {
          Util.removeEvent(eventTarget, "dblclick", this.callbackDblclick);
          Util.removeEvent(eventTarget, "mousedown", this.callbackMousedown);
          Util.removeEvent(document, "mouseup", this.callbackMouseup);
          Util.removeEvent(eventTarget, "mouseup", this.callbackMouseup);
      }
      /**
     * Adds a class name to a HTMLElement.
     * @param {HTMLElement} element - the HTML element.
     * @param {string} className - the class name.
     * @static
     */ static addClass(element, className) {
          if (!Util.containsClass(element, className)) {
              element.className += ` ${className}`;
          }
      }
      /**
     * Checks if a HTMLElement contains a certain class.
     * @param {HTMLElement} element - the HTML element.
     * @param {string} className - the className.
     * @returns {boolean} true if the HTMLElement contains the class name. false otherwise.
     * @static
     */ static containsClass(element, className) {
          if (element == null || !("className" in element)) {
              return false;
          }
          const currentClasses = element.className.split(" ");
          for(let i = currentClasses.length - 1; i >= 0; i -= 1){
              if (currentClasses[i] === className) {
                  return true;
              }
          }
          return false;
      }
      /**
     * Remove a certain class for a HTMLElement.
     * @param {HTMLElement} element - the HTML element.
     * @param {string} className - the class name.
     * @static
     */ static removeClass(element, className) {
          let newClassName = "";
          const classes = element.className.split(" ");
          for(let i = 0; i < classes.length; i += 1){
              if (classes[i] !== className) {
                  newClassName += `${classes[i]} `;
              }
          }
          element.className = newClassName.trim();
      }
      /**
     * Converts old xml initial text attribute (with «») to the correct one(with §lt;§gt;). It's
     * used to parse old applets.
     * @param {string} text - string containing safeXml characters
     * @returns {string} a string with safeXml characters parsed.
     * @static
     */ static convertOldXmlinitialtextAttribute(text) {
          // Used to fix a bug with Cas imported from Moodle 1.9 to Moodle 2.x.
          // This could be removed in future.
          const val = "value=";
          const xitpos = text.indexOf("xmlinitialtext");
          const valpos = text.indexOf(val, xitpos);
          const quote = text.charAt(valpos + val.length);
          const startquote = valpos + val.length + 1;
          const endquote = text.indexOf(quote, startquote);
          const value = text.substring(startquote, endquote);
          let newvalue = value.split("«").join("§lt;");
          newvalue = newvalue.split("»").join("§gt;");
          newvalue = newvalue.split("&").join("§");
          newvalue = newvalue.split("¨").join("§quot;");
          text = text.split(value).join(newvalue);
          return text;
      }
      /**
     * Convert a string representation of key-value pairs to an object.
     * @param {string} keyValueString - String with key-value pairs in the format key1='value1', key2='value2'
     * @returns {Object} - Object containing the key-value pairs
     */ static convertStringToObject(keyValueString) {
          if (!keyValueString || typeof keyValueString !== "string") {
              return {};
          }
          return keyValueString.split(",").map((pair)=>pair.trim().split("=")).reduce((resultObject, [key, value])=>{
              if (key && value) {
                  resultObject[key] = value;
              }
              return resultObject;
          }, {});
      }
      /**
     * Cross-browser solution for creating new elements.
     * @param {string} tagName - tag name of the wished element.
     * @param {Object} attributes - an object where each key is a wished
     * attribute name and each value is its value.
     * @param {Object} [creator] - if supplied, this function will use
     * the "createElement" method from this param. Otherwise
     * document will be used as creator.
     * @returns {Element} The DOM element with the specified attributes assigned.
     * @static
     */ static createElement(tagName, attributes, creator) {
          if (attributes === undefined) {
              attributes = {};
          }
          if (creator === undefined) {
              creator = document;
          }
          let element;
          /*
       * Internet Explorer fix:
       * If you create a new object dynamically, you can't set a non-standard attribute.
       * For example, you can't set the "src" attribute on an "applet" object.
       * Other browsers will throw an exception and will run the standard code.
       */ try {
              let html = `<${tagName}`;
              Object.keys(attributes).forEach((attributeName)=>{
                  html += ` ${attributeName}="${Util.htmlEntities(attributes[attributeName])}"`;
              });
              html += ">";
              element = creator.createElement(html);
          } catch (e) {
              element = creator.createElement(tagName);
              Object.keys(attributes).forEach((attributeName)=>{
                  element.setAttribute(attributeName, attributes[attributeName]);
              });
          }
          return element;
      }
      /**
     * Creates new HTML from it's HTML code as string.
     * @param {string} objectCode - html code
     * @returns {Element} the HTML element.
     * @static
     */ static createObject(objectCode, creator) {
          if (creator === undefined) {
              creator = document;
          }
          // Internet Explorer can't include "param" tag when is setting an innerHTML property.
          objectCode = objectCode.split("<applet ").join('<span wirisObject="WirisApplet" ').split("<APPLET ").join('<span wirisObject="WirisApplet" '); // It is a 'span' because 'span' objects can contain 'br' nodes.
          objectCode = objectCode.split("</applet>").join("</span>").split("</APPLET>").join("</span>");
          objectCode = objectCode.split("<param ").join('<br wirisObject="WirisParam" ').split("<PARAM ").join('<br wirisObject="WirisParam" '); // It is a 'br' because 'br' can't contain nodes.
          objectCode = objectCode.split("</param>").join("</br>").split("</PARAM>").join("</br>");
          const container = Util.createElement("div", {}, creator);
          container.innerHTML = objectCode;
          function recursiveParamsFix(object) {
              if (object.getAttribute && object.getAttribute("wirisObject") === "WirisParam") {
                  const attributesParsed = {};
                  for(let i = 0; i < object.attributes.length; i += 1){
                      if (object.attributes[i].nodeValue !== null) {
                          attributesParsed[object.attributes[i].nodeName] = object.attributes[i].nodeValue;
                      }
                  }
                  const param = Util.createElement("param", attributesParsed, creator);
                  // IE fix.
                  if (param.NAME) {
                      param.name = param.NAME;
                      param.value = param.VALUE;
                  }
                  param.removeAttribute("wirisObject");
                  object.parentNode.replaceChild(param, object);
              } else if (object.getAttribute && object.getAttribute("wirisObject") === "WirisApplet") {
                  const attributesParsed = {};
                  for(let i = 0; i < object.attributes.length; i += 1){
                      if (object.attributes[i].nodeValue !== null) {
                          attributesParsed[object.attributes[i].nodeName] = object.attributes[i].nodeValue;
                      }
                  }
                  const applet = Util.createElement("applet", attributesParsed, creator);
                  applet.removeAttribute("wirisObject");
                  for(let i = 0; i < object.childNodes.length; i += 1){
                      recursiveParamsFix(object.childNodes[i]);
                      if (object.childNodes[i].nodeName.toLowerCase() === "param") {
                          applet.appendChild(object.childNodes[i]);
                          i -= 1; // When we insert the object child into the applet, object loses one child.
                      }
                  }
                  object.parentNode.replaceChild(applet, object);
              } else {
                  for(let i = 0; i < object.childNodes.length; i += 1){
                      recursiveParamsFix(object.childNodes[i]);
                  }
              }
          }
          recursiveParamsFix(container);
          return container.firstChild;
      }
      /**
     * Converts an Element to its HTML code.
     * @param {Element} element - entry element.
     * @return {string} the HTML code of the input element.
     * @static
     */ static createObjectCode(element) {
          // In case that the image was not created, the object can be null or undefined.
          if (typeof element === "undefined" || element === null) {
              return null;
          }
          if (element.nodeType === 1) {
              // ELEMENT_NODE.
              let output = `<${element.tagName}`;
              for(let i = 0; i < element.attributes.length; i += 1){
                  if (element.attributes[i].specified) {
                      output += ` ${element.attributes[i].name}="${Util.htmlEntities(element.attributes[i].value)}"`;
                  }
              }
              if (element.childNodes.length > 0) {
                  output += ">";
                  for(let i = 0; i < element.childNodes.length; i += 1){
                      output += Util.createObject(element.childNodes[i]);
                  }
                  output += `</${element.tagName}>`;
              } else if (element.nodeName === "DIV" || element.nodeName === "SCRIPT") {
                  output += `></${element.tagName}>`;
              } else {
                  output += "/>";
              }
              return output;
          }
          if (element.nodeType === 3) {
              // TEXT_NODE.
              return Util.htmlEntities(element.nodeValue);
          }
          return "";
      }
      /**
     * Concatenates two URL paths.
     * @param {string} path1 - first URL path
     * @param {string} path2 - second URL path
     * @returns {string} new URL.
     */ static concatenateUrl(path1, path2) {
          let separator = "";
          if (path1.indexOf("/") !== path1.length && path2.indexOf("/") !== 0) {
              separator = "/";
          }
          return (path1 + separator + path2).replace(/([^:]\/)\/+/g, "$1");
      }
      /**
     * Parses a text and replaces all HTML special characters by their correspondent entities.
     * @param {string} input - text to be parsed.
     * @returns {string} the input text with all their special characters replaced by their entities.
     * @static
     */ static htmlEntities(input) {
          return input.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;");
      }
      /**
     * Sanitize HTML to prevent XSS injections.
     * @param {string} html - html to be sanitize.
     * @returns {string} html sanitized.
     * @static
     */ static htmlSanitize(html) {
          let annotationRegex = /\<annotation.+\<\/annotation\>/;
          // Get all the annotation content including the tags.
          let annotation = html.match(annotationRegex);
          // Sanitize html code without removing our supported MathML tags and attributes.
          html = purify.sanitize(html, {
              ADD_TAGS: [
                  "semantics",
                  "annotation",
                  "mstack",
                  "msline",
                  "msrow",
                  "none"
              ],
              ADD_ATTR: [
                  "linebreak",
                  "charalign",
                  "stackalign"
              ]
          });
          // Readd old annotation content.
          return html.replace(annotationRegex, annotation);
      }
      /**
     * Parses a text and replaces all the HTML entities by their characters.
     * @param {string} input - text to be parsed
     * @returns {string} the input text with all their entities replaced by characters.
     * @static
     */ static htmlEntitiesDecode(input) {
          // Textarea element decodes when inner html is set.
          const textarea = document.createElement("textarea");
          textarea.innerHTML = input;
          return textarea.value;
      }
      /**
     * Returns a cross-browser http request.
     * @return {object} httpRequest request object.
     * @returns {XMLHttpRequest|ActiveXObject} the proper request object.
     */ static createHttpRequest() {
          const currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf("/") + 1);
          if (currentPath.substr(0, 7) === "file://") {
              throw StringManager.get("exception_cross_site");
          }
          if (typeof XMLHttpRequest !== "undefined") {
              return new XMLHttpRequest();
          }
          try {
              return new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
              try {
                  return new ActiveXObject("Microsoft.XMLHTTP");
              } catch (oc) {
                  return null;
              }
          }
      }
      /**
     * Converts a hash to a HTTP query.
     * @param {Object[]} properties - a key/value object.
     * @returns {string} a HTTP query containing all the key value pairs with
     * all the special characters replaced by their entities.
     * @static
     */ static httpBuildQuery(properties) {
          let result = "";
          Object.keys(properties).forEach((i)=>{
              if (properties[i] != null) {
                  result += `${Util.urlEncode(i)}=${Util.urlEncode(properties[i])}&`;
              }
          });
          // Deleting last '&' empty character.
          if (result.substring(result.length - 1) === "&") {
              result = result.substring(0, result.length - 1);
          }
          return result;
      }
      /**
     * Convert a hash to string sorting keys to get a deterministic output
     * @param {Object[]} hash - a key/value object.
     * @returns {string} a string with the form key1=value1...keyn=valuen
     * @static
     */ static propertiesToString(hash) {
          // 1. Sort keys. We sort the keys because we want a deterministic output.
          const keys = [];
          Object.keys(hash).forEach((key)=>{
              if (Object.prototype.hasOwnProperty.call(hash, key)) {
                  keys.push(key);
              }
          });
          const n = keys.length;
          for(let i = 0; i < n; i += 1){
              for(let j = i + 1; j < n; j += 1){
                  const s1 = keys[i];
                  const s2 = keys[j];
                  if (Util.compareStrings(s1, s2) > 0) {
                      // Swap.
                      keys[i] = s2;
                      keys[j] = s1;
                  }
              }
          }
          // 2. Generate output.
          let output = "";
          for(let i = 0; i < n; i += 1){
              const key = keys[i];
              output += key;
              output += "=";
              let value = hash[key];
              value = value.replace("\\", "\\\\");
              value = value.replace("\n", "\\n");
              value = value.replace("\r", "\\r");
              value = value.replace("\t", "\\t");
              output += value;
              output += "\n";
          }
          return output;
      }
      /**
     * Compare two strings using charCodeAt method
     * @param {string} a - first string to compare.
     * @param {string} b - second string to compare.
     * @returns {number} the difference between a and b
     * @static
     */ static compareStrings(a, b) {
          let i;
          const an = a.length;
          const bn = b.length;
          const n = an > bn ? bn : an;
          for(i = 0; i < n; i += 1){
              const c = Util.fixedCharCodeAt(a, i) - Util.fixedCharCodeAt(b, i);
              if (c !== 0) {
                  return c;
              }
          }
          return a.length - b.length;
      }
      /**
     * Fix charCodeAt() JavaScript function to handle non-Basic-Multilingual-Plane characters.
     * @param {string} string - input string
     * @param {number} idx - an integer greater than or equal to 0
     * and less than the length of the string
     * @returns {number} an integer representing the UTF-16 code of the string at the given index.
     * @static
     */ static fixedCharCodeAt(string, idx) {
          idx = idx || 0;
          const code = string.charCodeAt(idx);
          let hi;
          let low;
          /* High surrogate (could change last hex to 0xDB7F to treat high
      private surrogates as single characters) */ if (code >= 0xd800 && code <= 0xdbff) {
              hi = code;
              low = string.charCodeAt(idx + 1);
              if (Number.isNaN(low)) {
                  throw StringManager.get("exception_high_surrogate");
              }
              return (hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000;
          }
          if (code >= 0xdc00 && code <= 0xdfff) {
              // Low surrogate.
              /* We return false to allow loops to skip this iteration since should have
        already handled high surrogate above in the previous iteration. */ return false;
          }
          return code;
      }
      /**
     * Returns an URL with it's query params converted into array.
     * @param {string} url - input URL.
     * @returns {Object[]} an array containing all URL query params.
     * @static
     */ static urlToAssArray(url) {
          let i;
          i = url.indexOf("?");
          if (i > 0) {
              const query = url.substring(i + 1);
              const ss = query.split("&");
              const h = {};
              for(i = 0; i < ss.length; i += 1){
                  const s = ss[i];
                  const kv = s.split("=");
                  if (kv.length > 1) {
                      h[kv[0]] = decodeURIComponent(kv[1].replace(/\+/g, " "));
                  }
              }
              return h;
          }
          return {};
      }
      /**
     * Returns an encoded URL by replacing each instance of certain characters by
     * one, two, three or four escape sequences using encodeURIComponent method.
     * !'()* . will not be encoded.
     *
     * @param {string} clearString - URL string to be encoded
     * @returns {string} URL with it's special characters replaced.
     * @static
     */ static urlEncode(clearString) {
          let output = "";
          // Method encodeURIComponent doesn't encode !'()*~ .
          output = encodeURIComponent(clearString);
          return output;
      }
      // TODO: To parser?
      /**
     * Converts the HTML of a image into the output code that WIRIS must return.
     * By default returns the MathML stored on data-mahml attribute (if imgCode is a formula)
     * or the Wiriscas attribute of a WIRIS applet.
     * @param {string} imgCode - the html code from a formula or a CAS image.
     * @param {boolean} convertToXml - true if the image should be converted to XML.
     * @param {boolean} convertToSafeXml - true if the image should be converted to safeXML.
     * @returns {string} the XML or safeXML of a WIRIS image.
     * @static
     */ static getWIRISImageOutput(imgCode, convertToXml, convertToSafeXml) {
          const imgObject = Util.createObject(imgCode);
          if (imgObject) {
              if (imgObject.className === Configuration.get("imageClassName") || imgObject.getAttribute(Configuration.get("imageMathmlAttribute"))) {
                  if (!convertToXml) {
                      return imgCode;
                  }
                  const dataMathML = imgObject.getAttribute(Configuration.get("imageMathmlAttribute"));
                  // To handle annotations, first we need the MathML in XML.
                  let mathML = MathML.safeXmlDecode(dataMathML);
                  if (!Configuration.get("saveHandTraces")) {
                      mathML = MathML.removeAnnotation(mathML, "application/json");
                  }
                  if (mathML == null) {
                      mathML = imgObject.getAttribute("alt");
                  }
                  if (convertToSafeXml) {
                      const safeMathML = MathML.safeXmlEncode(mathML);
                      return safeMathML;
                  }
                  return mathML;
              }
          }
          return imgCode;
      }
      /**
     * Gets the node length in characters.
     * @param {Node} node - HTML node.
     * @returns {number} node length.
     * @static
     */ static getNodeLength(node) {
          const staticNodeLengths = {
              IMG: 1,
              BR: 1
          };
          if (node.nodeType === 3) {
              // TEXT_NODE.
              return node.nodeValue.length;
          }
          if (node.nodeType === 1) {
              // ELEMENT_NODE.
              let length = staticNodeLengths[node.nodeName.toUpperCase()];
              if (length === undefined) {
                  length = 0;
              }
              for(let i = 0; i < node.childNodes.length; i += 1){
                  length += Util.getNodeLength(node.childNodes[i]);
              }
              return length;
          }
          return 0;
      }
      /**
     * Gets a selected node or text from an editable HTMLElement.
     * If the caret is on a text node, concatenates it with all the previous and next text nodes.
     * @param {HTMLElement} target - the editable HTMLElement.
     * @param {boolean} isIframe  - specifies if the target is an iframe or not
     * @param {boolean} forceGetSelection - if true, ignores IE system to get
     * the current selection and uses window.getSelection()
     * @returns {object} an object with the 'node' key set if the item is an
     * element or the keys 'node' and 'caretPosition' if the element is text.
     * @static
     */ static getSelectedItem(target, isIframe, forceGetSelection) {
          let windowTarget;
          if (isIframe) {
              windowTarget = target.contentWindow;
              windowTarget.focus();
          } else {
              windowTarget = window;
              target.focus();
          }
          if (document.selection && !forceGetSelection) {
              const range = windowTarget.document.selection.createRange();
              if (range.parentElement) {
                  if (range.htmlText.length > 0) {
                      if (range.text.length === 0) {
                          return Util.getSelectedItem(target, isIframe, true);
                      }
                      return null;
                  }
                  windowTarget.document.execCommand("InsertImage", false, "#");
                  let temporalObject = range.parentElement();
                  if (temporalObject.nodeName.toUpperCase() !== "IMG") {
                      // IE9 fix: parentElement() does not return the IMG node,
                      // returns the parent DIV node. In IE < 9, pasteHTML does not work well.
                      range.pasteHTML('<span id="wrs_openEditorWindow_temporalObject"></span>');
                      temporalObject = windowTarget.document.getElementById("wrs_openEditorWindow_temporalObject");
                  }
                  let node;
                  let caretPosition;
                  if (temporalObject.nextSibling && temporalObject.nextSibling.nodeType === 3) {
                      // TEXT_NODE.
                      node = temporalObject.nextSibling;
                      caretPosition = 0;
                  } else if (temporalObject.previousSibling && temporalObject.previousSibling.nodeType === 3) {
                      node = temporalObject.previousSibling;
                      caretPosition = node.nodeValue.length;
                  } else {
                      node = windowTarget.document.createTextNode("");
                      temporalObject.parentNode.insertBefore(node, temporalObject);
                      caretPosition = 0;
                  }
                  temporalObject.parentNode.removeChild(temporalObject);
                  return {
                      node,
                      caretPosition
                  };
              }
              if (range.length > 1) {
                  return null;
              }
              return {
                  node: range.item(0)
              };
          }
          if (windowTarget.getSelection) {
              let range;
              const selection = windowTarget.getSelection();
              try {
                  range = selection.getRangeAt(0);
              } catch (e) {
                  range = windowTarget.document.createRange();
              }
              const node = range.startContainer;
              if (node.nodeType === 3) {
                  // TEXT_NODE.
                  return {
                      node,
                      caretPosition: range.startOffset
                  };
              }
              if (node !== range.endContainer) {
                  return null;
              }
              if (node.nodeType === 1) {
                  // ELEMENT_NODE.
                  const position = range.startOffset;
                  if (node.childNodes[position]) {
                      // In case that a formula is detected but not selected,
                      // we create an empty span where we could insert the new formula.
                      if (range.startOffset === range.endOffset) {
                          if (position !== 0 && node.childNodes[position - 1].localName === "span" && node.childNodes[position].classList?.contains("Wirisformula")) {
                              node.childNodes[position - 1].remove();
                              return Util.getSelectedItem(target, isIframe, forceGetSelection);
                          } else if (node.childNodes[position].classList?.contains("Wirisformula")) {
                              if (position > 0 && node.childNodes[position - 1].classList?.contains("Wirisformula") || position === 0) {
                                  var emptySpan = document.createElement("span");
                                  node.insertBefore(emptySpan, node.childNodes[position]);
                                  return {
                                      node: node.childNodes[position]
                                  };
                              }
                          }
                      }
                      return {
                          node: node.childNodes[position]
                      };
                  }
              }
          }
          return null;
      }
      /**
     * Returns null if there isn't any item or if it is malformed.
     * Otherwise returns an object containing the node with the MathML image
     * and the cursor position inside the textarea.
     * @param {HTMLTextAreaElement} textarea - textarea element.
     * @returns {Object} An object containing the node, the index of the
     * beginning  of the selected text, caret position and the start and end position of the
     * text node.
     * @static
     */ static getSelectedItemOnTextarea(textarea) {
          const textNode = document.createTextNode(textarea.value);
          const textNodeValues = Latex.getLatexFromTextNode(textNode, textarea.selectionStart);
          if (textNodeValues === null) {
              return null;
          }
          return {
              node: textNode,
              caretPosition: textarea.selectionStart,
              startPosition: textNodeValues.startPosition,
              endPosition: textNodeValues.endPosition
          };
      }
      /**
     * Looks for elements that match the given name in a HTML code string.
     * Important: this function is very concrete for WIRIS code.
     * It takes as preconditions lots of behaviors that are not the general case.
     * @param {string} code -  HTML code.
     * @param {string} name - element name.
     * @param {boolean} autoClosed - true if the elements are autoClosed.
     * @return {Object[]} an object containing all HTML elements of code matching the name argument.
     * @static
     */ static getElementsByNameFromString(code, name, autoClosed) {
          const elements = [];
          code = code.toLowerCase();
          name = name.toLowerCase();
          let start = code.indexOf(`<${name} `);
          while(start !== -1){
              // Look for nodes.
              let endString;
              if (autoClosed) {
                  endString = ">";
              } else {
                  endString = `</${name}>`;
              }
              let end = code.indexOf(endString, start);
              if (end !== -1) {
                  end += endString.length;
                  elements.push({
                      start,
                      end
                  });
              } else {
                  end = start + 1;
              }
              start = code.indexOf(`<${name} `, end);
          }
          return elements;
      }
      /**
     * Returns the numeric value of a base64 character.
     * @param  {string} character - base64 character.
     * @returns {number} base64 character numeric value.
     * @static
     */ static decode64(character) {
          const PLUS = "+".charCodeAt(0);
          const SLASH = "/".charCodeAt(0);
          const NUMBER = "0".charCodeAt(0);
          const LOWER = "a".charCodeAt(0);
          const UPPER = "A".charCodeAt(0);
          const PLUS_URL_SAFE = "-".charCodeAt(0);
          const SLASH_URL_SAFE = "_".charCodeAt(0);
          const code = character.charCodeAt(0);
          if (code === PLUS || code === PLUS_URL_SAFE) {
              return 62; // Char '+'.
          }
          if (code === SLASH || code === SLASH_URL_SAFE) {
              return 63; // Char '/'.
          }
          if (code < NUMBER) {
              return -1; // No match.
          }
          if (code < NUMBER + 10) {
              return code - NUMBER + 26 + 26;
          }
          if (code < UPPER + 26) {
              return code - UPPER;
          }
          if (code < LOWER + 26) {
              return code - LOWER + 26;
          }
          return null;
      }
      /**
     * Converts a base64 string to a array of bytes.
     * @param {string} b64String - base64 string.
     * @param {number} length - dimension of byte array (by default whole string).
     * @return {Object[]} the resultant byte array.
     * @static
     */ static b64ToByteArray(b64String, length) {
          let tmp;
          if (b64String.length % 4 > 0) {
              throw new Error("Invalid string. Length must be a multiple of 4"); // Tipped base64. Length is fixed.
          }
          const arr = [];
          let l;
          let placeHolders;
          if (!length) {
              // All b64String string.
              if (b64String.charAt(b64String.length - 2) === "=") {
                  placeHolders = 2;
              } else if (b64String.charAt(b64String.length - 1) === "=") {
                  placeHolders = 1;
              } else {
                  placeHolders = 0;
              }
              l = placeHolders > 0 ? b64String.length - 4 : b64String.length;
          } else {
              l = length;
          }
          let i;
          for(i = 0; i < l; i += 4){
              // Ignoring code checker standards (bitewise operators).
              // See https://tracker.moodle.org/browse/CONTRIB-5862 for further information.
              // @codingStandardsIgnoreStart
              // eslint-disable-next-line max-len
              tmp = Util.decode64(b64String.charAt(i)) << 18 | Util.decode64(b64String.charAt(i + 1)) << 12 | Util.decode64(b64String.charAt(i + 2)) << 6 | Util.decode64(b64String.charAt(i + 3));
              arr.push(tmp >> 16 & 0xff);
              arr.push(tmp >> 8 & 0xff);
              arr.push(tmp & 0xff);
          // @codingStandardsIgnoreEnd
          }
          if (placeHolders) {
              if (placeHolders === 2) {
                  // Ignoring code checker standards (bitewise operators).
                  // @codingStandardsIgnoreStart
                  // eslint-disable-next-line max-len
                  tmp = Util.decode64(b64String.charAt(i)) << 2 | Util.decode64(b64String.charAt(i + 1)) >> 4;
                  arr.push(tmp & 0xff);
              } else if (placeHolders === 1) {
                  // eslint-disable-next-line max-len
                  tmp = Util.decode64(b64String.charAt(i)) << 10 | Util.decode64(b64String.charAt(i + 1)) << 4 | Util.decode64(b64String.charAt(i + 2)) >> 2;
                  arr.push(tmp >> 8 & 0xff);
                  arr.push(tmp & 0xff);
              // @codingStandardsIgnoreEnd
              }
          }
          return arr;
      }
      /**
     * Returns the first 32-bit signed integer from a byte array.
     * @param {Object[]} bytes - array of bytes.
     * @returns {number} the 32-bit signed integer.
     * @static
     */ static readInt32(bytes) {
          if (bytes.length < 4) {
              return false;
          }
          const int32 = bytes.splice(0, 4);
          // @codingStandardsIgnoreStart¡
          return int32[0] << 24 | int32[1] << 16 | int32[2] << 8 | int32[3] << 0;
      // @codingStandardsIgnoreEnd
      }
      /**
     * Read the first byte from a byte array.
     * @param {Object} bytes - input byte array.
     * @returns {number} first byte of the byte array.
     * @static
     */ static readByte(bytes) {
          // @codingStandardsIgnoreStart
          return bytes.shift() << 0;
      // @codingStandardsIgnoreEnd
      }
      /**
     * Read an arbitrary number of bytes, from a fixed position on a byte array.
     * @param  {Object[]} bytes - byte array.
     * @param  {number} pos - start position.
     * @param  {number} len - number of bytes to read.
     * @returns {Object[]} the byte array.
     * @static
     */ static readBytes(bytes, pos, len) {
          return bytes.splice(pos, len);
      }
      /**
     * Inserts or modifies formulas or CAS on a textarea.
     * @param {HTMLTextAreaElement} textarea - textarea target.
     * @param {string} text - text to add in the textarea. For example, to add the link to the image,
     * call this function as (textarea, Parser.createImageSrc(mathml));
     * @static
     */ static updateTextArea(textarea, text) {
          if (textarea && text) {
              textarea.focus();
              if (textarea.selectionStart != null) {
                  const { selectionEnd } = textarea;
                  const selectionStart = textarea.value.substring(0, textarea.selectionStart);
                  const selectionEndSub = textarea.value.substring(selectionEnd, textarea.value.length);
                  textarea.value = selectionStart + text + selectionEndSub;
                  textarea.selectionEnd = selectionEnd + text.length;
              } else {
                  const selection = document.selection.createRange();
                  selection.text = text;
              }
          }
      }
      /**
     * Modifies existing formula on a textarea.
     * @param {HTMLTextAreaElement} textarea - text area target.
     * @param {string} text - text to add in the textarea. For example, if you want to add the link
     * to the image,you can call this function as
     * Util.updateTextarea(textarea, Parser.createImageSrc(mathml));
     * @param {number} start - beginning index from textarea where it needs to be replaced by text.
     * @param {number} end - ending index from textarea where it needs to be replaced by text
     * @static
     */ static updateExistingTextOnTextarea(textarea, text, start, end) {
          textarea.focus();
          const textareaStart = textarea.value.substring(0, start);
          textarea.value = textareaStart + text + textarea.value.substring(end, textarea.value.length);
          textarea.selectionEnd = start + text.length;
      }
      /**
     * Add a parameter with it's correspondent value to an URL (GET).
     * @param {string} path - URL path
     * @param {string} parameter - parameter
     * @param {string} value - value
     * @static
     */ static addArgument(path, parameter, value) {
          let sep;
          if (path.indexOf("?") > 0) {
              sep = "&";
          } else {
              sep = "?";
          }
          return `${path + sep + parameter}=${value}`;
      }
  }

  /**
   * @classdesc
   * This class represents MathType Image class. Contains all the logic related
   * to MathType images manipulation.
   * All MathType images are generated using the appropriate MathType
   * integration service: showimage or createimage.
   *
   * There are two available image formats:
   * - svg (default)
   * - png
   *
   * There are two formats for the image src attribute:
   * - A data-uri scheme containing the URL-encoded SVG or a PNG's base64.
   * - A link to the showimage service.
   */ class Image {
      /**
     * Removes data attributes from an image.
     * @param {HTMLImageElement} img - Image where remove data attributes.
     */ static removeImgDataAttributes(img) {
          const attributesToRemove = [];
          const { attributes } = img;
          Object.keys(attributes).forEach((key)=>{
              const attribute = attributes[key];
              if (attribute !== undefined && attribute.name !== undefined && attribute.name.indexOf("data-") === 0) {
                  // Is preferred keep an array and remove after the search
                  // because when attribute is removed the array of attributes
                  // is modified.
                  attributesToRemove.push(attribute.name);
              }
          });
          attributesToRemove.forEach((attribute)=>{
              img.removeAttribute(attribute);
          });
      }
      /**
     * @static
     * Clones all MathType image attributes from a HTMLImageElement to another.
     * @param {HTMLImageElement} originImg - The original image.
     * @param {HTMLImageElement} destImg - The destination image.
     */ static clone(originImg, destImg) {
          const customEditorAttributeName = Configuration.get("imageCustomEditorName");
          if (!originImg.hasAttribute(customEditorAttributeName)) {
              destImg.removeAttribute(customEditorAttributeName);
          }
          const mathmlAttributeName = Configuration.get("imageMathmlAttribute");
          const imgAttributes = [
              mathmlAttributeName,
              customEditorAttributeName,
              "alt",
              "height",
              "width",
              "style",
              "src",
              "role"
          ];
          imgAttributes.forEach((iterator)=>{
              const originAttribute = originImg.getAttribute(iterator);
              if (originAttribute) {
                  destImg.setAttribute(iterator, originAttribute);
              }
          });
      }
      /**
     * Determines whether an img src contains an SVG.
     * @param {HTMLImageElement} img the img element to inspect
     * @returns true if the img src contains an SVG, false otherwise
     */ static isSvg(img) {
          return img.src.startsWith("data:image/svg+xml;");
      }
      /**
     * Determines whether an img src is encoded in base64 or not.
     * @param {HTMLImageElement} img the img element to inspect
     * @returns true if the img src is encoded in base64, false otherwise
     */ static isBase64(img) {
          return img.src.startsWith("data:image/svg+xml;base64,") || img.src.startsWith("data:image/png;base64,");
      }
      /**
     * Calculates the metrics of a MathType image given the the service response and the image format.
     * @param {HTMLImageElement} img - The HTMLImageElement.
     * @param {String} uri - The URI generated by the image service: can be a data URI scheme or a URL.
     * @param {Boolean} jsonResponse - True the response of the image service is a
     * JSON object. False otherwise.
     */ static setImgSize(img, uri, jsonResponse) {
          let ar;
          let base64String;
          let bytes;
          let svgString;
          if (jsonResponse) {
              // Cleaning data:image/png;base64.
              if (Image.isSvg(img)) {
                  // SVG format.
                  // If SVG is encoded in base64 we need to convert the base64 bytes into a SVG string.
                  if (!Image.isBase64(img)) {
                      ar = Image.getMetricsFromSvgString(uri);
                  } else {
                      base64String = img.src.substr(img.src.indexOf("base64,") + 7, img.src.length);
                      svgString = "";
                      bytes = Util.b64ToByteArray(base64String, base64String.length);
                      for(let i = 0; i < bytes.length; i += 1){
                          svgString += String.fromCharCode(bytes[i]);
                      }
                      ar = Image.getMetricsFromSvgString(svgString);
                  }
              // PNG format: we store all metrics information in the first 88 bytes.
              } else {
                  base64String = img.src.substr(img.src.indexOf("base64,") + 7, img.src.length);
                  bytes = Util.b64ToByteArray(base64String, 88);
                  ar = Image.getMetricsFromBytes(bytes);
              }
          // Backwards compatibility: we store the metrics into createimage response.
          } else {
              ar = Util.urlToAssArray(uri);
          }
          let width = ar.cw;
          if (!width) {
              return;
          }
          let height = ar.ch;
          let baseline = ar.cb;
          const { dpi } = ar;
          if (dpi) {
              width = width * 96 / dpi;
              height = height * 96 / dpi;
              baseline = baseline * 96 / dpi;
          }
          img.width = width;
          img.height = height;
          img.style.verticalAlign = `-${height - baseline}px`;
      }
      /**
     * Calculates the metrics of an image which has been resized. Is used to restore the original
     * metrics of a resized image.
     * @param {HTMLImageElement } img - The resized HTMLImageElement.
     */ static fixAfterResize(img) {
          img.removeAttribute("style");
          img.removeAttribute("width");
          img.removeAttribute("height");
          // In order to avoid resize with max-width css property.
          img.style.maxWidth = "none";
          const processImg = (img)=>{
              if (img.src.indexOf("data:image") !== -1) {
                  if (img.src.indexOf("data:image/svg+xml") !== -1) {
                      // Image is in base64: decode it in order to calculate the size, and then bring it back to base64
                      // This is a bit of an ugly hack used to recycle the logic of Image.setImgSize instead of rewriting it
                      // (which would actually make more sense for readibility and efficiency).
                      if (img.src.indexOf("data:image/svg+xml;base64,") !== -1) {
                          // 'data:image/svg+xml;base64,'.length === 26
                          const base64String = img.getAttribute("src").substring(26);
                          const svgString = window.atob(base64String);
                          const encodedSvgString = encodeURIComponent(svgString);
                          img.setAttribute("src", `data:image/svg+xml;charset=utf8,${encodedSvgString}`);
                          // 'data:image/svg+xml;charset=utf8,'.length === 32.
                          const svg = decodeURIComponent(img.src.substring(32, img.src.length));
                          Image.setImgSize(img, svg, true);
                          // Return src to base64!
                          img.setAttribute("src", `data:image/svg+xml;base64,${base64String}`);
                      } else {
                          // 'data:image/svg+xml;charset=utf8,'.length === 32.
                          const svg = decodeURIComponent(img.src.substring(32, img.src.length));
                          Image.setImgSize(img, svg, true);
                      }
                  } else {
                      // 'data:image/png;base64,' === 22.
                      const base64 = img.src.substring(22, img.src.length);
                      Image.setImgSize(img, base64, true);
                  }
              } else {
                  Image.setImgSize(img, img.src);
              }
          };
          // If the image doesn't contain a blob, just process it normally
          if (img.src.indexOf("blob:") === -1) {
              processImg(img);
          // if it does contain a blob, then read that, replace the src with the decoded content, and process it
          } else {
              let reader = new FileReader();
              reader.onload = function() {
                  img.setAttribute("src", reader.result);
                  processImg(img);
              };
              fetch(img.src).then((r)=>r.blob()).then((blob)=>{
                  reader.readAsDataURL(blob);
              });
          }
      }
      /**
     * Returns the metrics (height, width and baseline) contained in a SVG image generated
     * by the MathType image service. This image contains as an extra custom attribute:
     * the baseline (wrs:baseline).
     * @param {String} svgString - The SVG image.
     * @return {Array} - The image metrics.
     */ static getMetricsFromSvgString(svgString) {
          let first = svgString.indexOf('height="');
          let last = svgString.indexOf('"', first + 8, svgString.length);
          const height = svgString.substring(first + 8, last);
          first = svgString.indexOf('width="');
          last = svgString.indexOf('"', first + 7, svgString.length);
          const width = svgString.substring(first + 7, last);
          first = svgString.indexOf('wrs:baseline="');
          last = svgString.indexOf('"', first + 14, svgString.length);
          const baseline = svgString.substring(first + 14, last);
          if (typeof width !== "undefined") {
              const arr = [];
              arr.cw = width;
              arr.ch = height;
              if (typeof baseline !== "undefined") {
                  arr.cb = baseline;
              }
              return arr;
          }
          return [];
      }
      /**
     * Returns the metrics (width, height, baseline and dpi) contained in a PNG byte array.
     * @param  {Array.<Bytes>} bytes - png byte array.
     * @return {Array} The png metrics.
     */ static getMetricsFromBytes(bytes) {
          Util.readBytes(bytes, 0, 8);
          let width;
          let height;
          let typ;
          let baseline;
          let dpi;
          while(bytes.length >= 4){
              typ = Util.readInt32(bytes);
              if (typ === 0x49484452) {
                  width = Util.readInt32(bytes);
                  height = Util.readInt32(bytes);
                  // Read 5 bytes.
                  Util.readInt32(bytes);
                  Util.readByte(bytes);
              } else if (typ === 0x62615345) {
                  // Baseline: 'baSE'.
                  baseline = Util.readInt32(bytes);
              } else if (typ === 0x70485973) {
                  // Dpis: 'pHYs'.
                  dpi = Util.readInt32(bytes);
                  dpi = Math.round(dpi / 39.37);
                  Util.readInt32(bytes);
                  Util.readByte(bytes);
              }
              Util.readInt32(bytes);
          }
          if (typeof width !== "undefined") {
              const arr = [];
              arr.cw = width;
              arr.ch = height;
              arr.dpi = dpi;
              if (baseline) {
                  arr.cb = baseline;
              }
              return arr;
          }
          return [];
      }
  }

  /**
   * @classdesc
   * This class represents MathType accessible class. Converts MathML to accessible text and manages
   * the associated client-side cache.
   */ class Accessibility {
      /**
     * Static property.
     * Accessibility cache, each entry contains a MathML and its correspondent accessibility text.
     * @type {TextCache}
     */ static get cache() {
          return Accessibility._cache;
      }
      /**
     * Static property setter.
     * Set accessibility cache.
     * @param {TextCahe} value - The property value.
     * @ignore
     */ static set cache(value) {
          Accessibility._cache = value;
      }
      /**
     * Converts MathML strings to its accessible text representation.
     * @param {String} mathML - MathML to be converted to accessible text.
     * @param {String} [language] - Language of the accessible text. 'en' by default.
     * @param {Array.<String>} [data] - Parameters to send to mathml2accessible service.
     * @return {String} Accessibility text.
     */ static mathMLToAccessible(mathML, language, data) {
          if (typeof language === "undefined") {
              language = "en";
          }
          // Check MathML class. If the class is chemistry,
          // we add chemistry to data to force accessibility service
          // to load chemistry grammar.
          if (MathML.containClass(mathML, "wrs_chemistry")) {
              data.mode = "chemistry";
          }
          // Ignore accesibility styles
          data.ignoreStyles = true;
          let accessibleText = "";
          if (Accessibility.cache.get(mathML)) {
              accessibleText = Accessibility.cache.get(mathML);
          } else {
              data.service = "mathml2accessible";
              data.lang = language;
              const accessibleJsonResponse = JSON.parse(ServiceProvider.getService("service", data));
              if (accessibleJsonResponse.status !== "error") {
                  accessibleText = accessibleJsonResponse.result.text;
                  Accessibility.cache.populate(mathML, accessibleText);
              } else {
                  accessibleText = StringManager.get("error_convert_accessibility");
              }
          }
          return accessibleText;
      }
  }
  /**
   * Contains an instance of TextCache class to manage the JavaScript accessible cache.
   * Each entry of the cache object contains the MathML and it's correspondent accessibility text.
   * @private
   * @type {TextCache}
   */ Accessibility._cache = new TextCache();

  /**
   * @classdesc
   * This class represent a MahML parser. Converts MathML into formulas depending on the
   * image format (SVG, PNG, base64) and the save mode (XML, safeXML, Image) configured
   * in the backend.
   */ class Parser {
      /**
     * Converts a MathML string to an img element.
     * @param {Document} creator - Document object to call createElement method.
     * @param {string} mathml - MathML code
     * @param {Object[]} wirisProperties - object containing WIRIS custom properties
     * @param {language} language - custom language for accessibility.
     * @returns {HTMLImageElement} the formula image corresponding to initial MathML string.
     * @static
     */ static mathmlToImgObject(creator, mathml, wirisProperties, language) {
          const imgObject = creator.createElement("img");
          imgObject.align = "middle";
          imgObject.style.maxWidth = "none";
          let data = wirisProperties || {};
          // Take into account the backend config
          const wirisEditorProperties = Configuration.get("editorParameters");
          data = {
              ...wirisEditorProperties,
              ...data
          };
          data.mml = mathml;
          data.lang = language;
          // Request metrics of the generated image.
          data.metrics = "true";
          data.centerbaseline = "false";
          // Full base64 method (edit & save).
          if (Configuration.get("saveMode") === "base64" && Configuration.get("base64savemode") === "default") {
              data.base64 = true;
          }
          // Render js params: _wrs_int_wirisProperties contains some js render params.
          // Since MathML can support render params, js params should be send only to editor.
          imgObject.className = Configuration.get("imageClassName");
          if (mathml.indexOf('class="') !== -1) {
              // We check here if the MathML has been created from a customEditor (such chemistry)
              // to add custom editor name attribute to img object (if necessary).
              let mathmlSubstring = mathml.substring(mathml.indexOf('class="') + 'class="'.length, mathml.length);
              mathmlSubstring = mathmlSubstring.substring(0, mathmlSubstring.indexOf('"'));
              mathmlSubstring = mathmlSubstring.substring(4, mathmlSubstring.length);
              imgObject.setAttribute(Configuration.get("imageCustomEditorName"), mathmlSubstring);
          }
          // Performance enabled.
          if (Configuration.get("wirisPluginPerformance") && (Configuration.get("saveMode") === "xml" || Configuration.get("saveMode") === "safeXml")) {
              let result = JSON.parse(Parser.createShowImageSrc(data, language));
              if (result.status === "warning") {
                  // POST call.
                  // if the mathml is malformed, this function will throw an exception.
                  try {
                      result = JSON.parse(ServiceProvider.getService("showimage", data));
                  } catch (e) {
                      return null;
                  }
              }
              ({ result } = result);
              if (result.format === "png") {
                  imgObject.src = `data:image/png;base64,${result.content}`;
              } else {
                  imgObject.src = `data:image/svg+xml;charset=utf8,${Util.urlEncode(result.content)}`;
              }
              imgObject.setAttribute(Configuration.get("imageMathmlAttribute"), MathML.safeXmlEncode(mathml));
              Image.setImgSize(imgObject, result.content, true);
              if (Configuration.get("enableAccessibility")) {
                  if (typeof result.alt === "undefined") {
                      imgObject.alt = Accessibility.mathMLToAccessible(mathml, language, data);
                  } else {
                      imgObject.alt = result.alt;
                  }
              }
          } else {
              const result = Parser.createImageSrc(mathml, data);
              imgObject.setAttribute(Configuration.get("imageMathmlAttribute"), MathML.safeXmlEncode(mathml));
              imgObject.src = result;
              Image.setImgSize(imgObject, result, Configuration.get("saveMode") === "base64" && Configuration.get("base64savemode") === "default");
              if (Configuration.get("enableAccessibility")) {
                  imgObject.alt = Accessibility.mathMLToAccessible(mathml, language, data);
              }
          }
          if (typeof Parser.observer !== "undefined") {
              Parser.observer.observe(imgObject);
          }
          // Role math https://www.w3.org/TR/wai-aria/roles#math.
          imgObject.setAttribute("role", "math");
          return imgObject;
      }
      /**
     * Returns the source to showimage service by calling createimage service. The
     * output of the createimage service is a URL path pointing to showimage service.
     * This method is called when performance is disabled.
     * @param {string} mathml - MathML code.
     * @param {Object[]} data - data object containing service parameters.
     * @returns {string} the showimage path.
     */ static createImageSrc(mathml, data) {
          // Full base64 method (edit & save).
          if (Configuration.get("saveMode") === "base64" && Configuration.get("base64savemode") === "default") {
              data.base64 = true;
          }
          let result = ServiceProvider.getService("createimage", data);
          if (result.indexOf("@BASE@") !== -1) {
              // Replacing '@BASE@' with the base URL of createimage.
              const baseParts = ServiceProvider.getServicePath("createimage").split("/");
              baseParts.pop();
              result = result.split("@BASE@").join(baseParts.join("/"));
          }
          return result;
      }
      /**
     * Parses initial HTML code. If the HTML contains data generated by WIRIS,
     * this data would be converted as following:
     * <pre>
     * MathML code: Image containing the corresponding MathML formulas.
     * MathML code with LaTeX annotation : LaTeX string.
     * </pre>
     * @param {string} code - HTML code containing MathML data.
     * @param {string} language - language to create image alt text.
     * @returns {string} HTML code with the original MathML converted into LaTeX and images.
     */ static initParse(code, language) {
          /* Note: The code inside this function has been inverted.
      If you invert again the code then you cannot use correctly LaTeX
      in Moodle.
      */ code = Parser.initParseSaveMode(code, language);
          return Parser.initParseEditMode(code);
      }
      /**
     * Parses initial HTML code depending on the save mode. Transforms all MathML
     * occurrences for it's correspondent image or LaTeX.
     * @param {string} code - HTML code to be parsed
     * @param {string} language - language to create image alt text.
     * @returns {string} HTML code parsed.
     */ static initParseSaveMode(code, language) {
          if (Configuration.get("saveMode")) {
              // Converting XML to tags.
              code = Latex.parseMathmlToLatex(code, Constants.safeXmlCharacters);
              code = Latex.parseMathmlToLatex(code, Constants.xmlCharacters);
              code = Parser.parseMathmlToImg(code, Constants.safeXmlCharacters, language);
              code = Parser.parseMathmlToImg(code, Constants.xmlCharacters, language);
              if (Configuration.get("saveMode") === "base64" && Configuration.get("base64savemode") === "image") {
                  code = Parser.codeImgTransform(code, "base642showimage");
              }
          }
          return code;
      }
      /**
     * Parses initial HTML code depending on the edit mode.
     * If 'latex' parseMode is enabled all MathML containing an annotation with encoding='LaTeX' will
     * be converted into a LaTeX string instead of an image.
     * @param {string} code - HTML code containing MathML.
     * @returns {string} parsed HTML code.
     */ static initParseEditMode(code) {
          if (Configuration.get("parseModes").indexOf("latex") !== -1) {
              const imgList = Util.getElementsByNameFromString(code, "img", true);
              const token = 'encoding="LaTeX">';
              // While replacing images with latex, the indexes of the found images changes
              // respecting the original code, so this carry is needed.
              let carry = 0;
              for(let i = 0; i < imgList.length; i += 1){
                  const imgCode = code.substring(imgList[i].start + carry, imgList[i].end + carry);
                  if (imgCode.indexOf(` class="${Configuration.get("imageClassName")}"`) !== -1) {
                      let mathmlStartToken = ` ${Configuration.get("imageMathmlAttribute")}="`;
                      let mathmlStart = imgCode.indexOf(mathmlStartToken);
                      if (mathmlStart === -1) {
                          mathmlStartToken = ' alt="';
                          mathmlStart = imgCode.indexOf(mathmlStartToken);
                      }
                      if (mathmlStart !== -1) {
                          mathmlStart += mathmlStartToken.length;
                          const mathmlEnd = imgCode.indexOf('"', mathmlStart);
                          const mathml = Util.htmlSanitize(MathML.safeXmlDecode(imgCode.substring(mathmlStart, mathmlEnd)));
                          let latexStartPosition = mathml.indexOf(token);
                          if (latexStartPosition !== -1) {
                              latexStartPosition += token.length;
                              const latexEndPosition = mathml.indexOf("</annotation>", latexStartPosition);
                              const latex = mathml.substring(latexStartPosition, latexEndPosition);
                              const replaceText = `$$${Util.htmlEntitiesDecode(latex)}$$`;
                              const start = code.substring(0, imgList[i].start + carry);
                              const end = code.substring(imgList[i].end + carry);
                              code = start + replaceText + end;
                              carry += replaceText.length - (imgList[i].end - imgList[i].start);
                          }
                      }
                  }
              }
          }
          return code;
      }
      /**
     * Parses end HTML code. The end HTML code is HTML code with embedded images
     * or LaTeX formulas created with MathType. <br>
     * By default this method converts the formula images and LaTeX strings in MathML. <br>
     * If image mode is enabled the images will not be converted into MathML. For further information see {@link https://docs.wiris.com/mathtype/en/mathtype-integrations/mathtype-web-interface-features/full-mathml-mode---wirisplugins-js.html}.
     * @param {string} code - HTML to be parsed
     * @returns {string} the HTML code parsed.
     */ static endParse(code) {
          // Transform LaTeX ocurrences to MathML elements.
          const codeEndParsedEditMode = Parser.endParseEditMode(code);
          // Transform img elements to MathML elements.
          const codeEndParseSaveMode = Parser.endParseSaveMode(codeEndParsedEditMode);
          return codeEndParseSaveMode;
      }
      /**
     * Parses end HTML code depending on the edit mode.
     * - LaTeX is an enabled parse mode, all LaTeX occurrences will be converted into MathML.
     * @param {string} code - HTML code to be parsed.
     * @returns {string} HTML code parsed.
     */ static endParseEditMode(code) {
          // Converting LaTeX to images.
          if (Configuration.get("parseModes").indexOf("latex") !== -1) {
              let output = "";
              let endPosition = 0;
              let startPosition = code.indexOf("$$");
              while(startPosition !== -1){
                  output += code.substring(endPosition, startPosition);
                  endPosition = code.indexOf("$$", startPosition + 2);
                  if (endPosition !== -1) {
                      // Before, it was a condition here to execute the next codelines
                      // 'latex.indexOf('<') == -1'.
                      // We don't know why it was used, but seems to have a conflict with
                      // latex formulas that contains '<'.
                      const latex = code.substring(startPosition + 2, endPosition);
                      const decodedLatex = Util.htmlEntitiesDecode(latex);
                      let mathml = Util.htmlSanitize(Latex.getMathMLFromLatex(decodedLatex, true));
                      if (!Configuration.get("saveHandTraces")) {
                          // Remove hand traces.
                          mathml = MathML.removeAnnotation(mathml, "application/json");
                      }
                      output += mathml;
                      endPosition += 2;
                  } else {
                      output += "$$";
                      endPosition = startPosition + 2;
                  }
                  startPosition = code.indexOf("$$", endPosition);
              }
              output += code.substring(endPosition, code.length);
              code = output;
          }
          return code;
      }
      /**
     * Parses end HTML code depending on the save mode. Converts all
     * images into the element determined by the save mode:
     * - xml: Parses images formulas into MathML.
     * - safeXml: Parses images formulas into safeMAthML
     * - base64: Parses images into base64 images.
     * - image: Parse images into images (no parsing)
     * @param {string} code - HTML code to be parsed
     * @returns {string} HTML code parsed.
     */ static endParseSaveMode(code) {
          const savemode = Configuration.get("saveMode");
          const base64savemode = Configuration.get("base64savemode");
          if (savemode) {
              if (savemode === "safeXml") {
                  code = Parser.codeImgTransform(code, "img2mathml");
              } else if (savemode === "xml") {
                  code = Parser.codeImgTransform(code, "img2mathml");
              } else if (savemode === "base64" && base64savemode === "image") {
                  code = Parser.codeImgTransform(code, "img264");
              }
          }
          return code;
      }
      /**
     * Auxiliar function that builds the data object to send to the showimage endpoint
     * @param {Object[]} data - object containing showimage service parameters.
     * @param {string} language - string containing the language of the formula.
     * @returns {Object} JSON object with the data to send to showimage.
     */ static createShowImageSrcData(data, language) {
          const dataMd5 = {};
          const renderParams = [
              "mml",
              "color",
              "centerbaseline",
              "zoom",
              "dpi",
              "fontSize",
              "fontFamily",
              "defaultStretchy",
              "backgroundColor",
              "format"
          ];
          renderParams.forEach((param)=>{
              if (typeof data[param] !== "undefined") {
                  dataMd5[param] = data[param];
              }
          });
          // Data variables to get.
          const dataObject = {};
          Object.keys(data).forEach((key)=>{
              // We don't need mathml in this request we try to get cached.
              // Only need the formula md5 calculated before.
              if (key !== "mml") {
                  dataObject[key] = data[key];
              }
          });
          dataObject.formula = com.wiris.js.JsPluginTools.md5encode(Util.propertiesToString(dataMd5));
          dataObject.lang = typeof language === "undefined" ? "en" : language;
          dataObject.version = Configuration.get("version");
          return dataObject;
      }
      /**
     * Returns the result to call showimage service with the formula md5 as parameter.
     *  The result could be:
     * - {'status' : warning'} : The image associated to the MathML md5 is not in cache.
     * - {'status' : 'ok' ...} : The image associated to the MathML md5 is in cache.
     * @param {Object[]} data - object containing showimage service parameters.
     * @param {string} language - string containing the language of the formula.
     * @returns {Object} JSON object containing showimage response.
     */ static createShowImageSrc(data, language) {
          const dataObject = this.createShowImageSrcData(data, language);
          const result = ServiceProvider.getService("showimage", Util.httpBuildQuery(dataObject), true);
          return result;
      }
      /**
     * Transform html img tags inside a html code to mathml, base64 img tags (i.e with base64 on src)
     * or showimage img tags (i.e with showimage.php on src)
     * @param  {string} code - HTML code
     * @param  {string} mode - base642showimage or img2mathml or img264 transform.
     * @returns {string} html - code transformed.
     */ static codeImgTransform(code, mode) {
          let output = "";
          let endPosition = 0;
          const pattern = /<img/gi;
          const patternLength = pattern.source.length;
          while(pattern.test(code)){
              const startPosition = pattern.lastIndex - patternLength;
              output += code.substring(endPosition, startPosition);
              let i = startPosition + 1;
              while(i < code.length && endPosition <= startPosition){
                  const character = code.charAt(i);
                  if (character === '"' || character === "'") {
                      const characterNextPosition = code.indexOf(character, i + 1);
                      if (characterNextPosition === -1) {
                          i = code.length; // End while.
                      } else {
                          i = characterNextPosition;
                      }
                  } else if (character === ">") {
                      endPosition = i + 1;
                  }
                  i += 1;
              }
              if (endPosition < startPosition) {
                  // The img tag is stripped.
                  output += code.substring(startPosition, code.length);
                  return output;
              }
              let imgCode = code.substring(startPosition, endPosition);
              const imgObject = Util.createObject(imgCode);
              let xmlCode = imgObject.getAttribute(Configuration.get("imageMathmlAttribute"));
              let convertToXml;
              let convertToSafeXml;
              if (mode === "base642showimage") {
                  if (xmlCode == null) {
                      xmlCode = imgObject.getAttribute("alt");
                  }
                  xmlCode = MathML.safeXmlDecode(xmlCode);
                  imgCode = Parser.mathmlToImgObject(document, xmlCode, null, null);
                  output += Util.createObjectCode(imgCode);
              } else if (mode === "img2mathml") {
                  if (Configuration.get("saveMode")) {
                      if (Configuration.get("saveMode") === "safeXml") {
                          convertToXml = true;
                          convertToSafeXml = true;
                      } else if (Configuration.get("saveMode") === "xml") {
                          convertToXml = true;
                          convertToSafeXml = false;
                      }
                  }
                  output += Util.getWIRISImageOutput(imgCode, convertToXml, convertToSafeXml);
              } else if (mode === "img264") {
                  if (xmlCode === null) {
                      xmlCode = imgObject.getAttribute("alt");
                  }
                  xmlCode = MathML.safeXmlDecode(xmlCode);
                  const properties = {};
                  properties.base64 = "true";
                  imgCode = Parser.mathmlToImgObject(document, xmlCode, properties, null);
                  // Metrics.
                  Image.setImgSize(imgCode, imgCode.src, true);
                  output += Util.createObjectCode(imgCode);
              }
          }
          output += code.substring(endPosition, code.length);
          return output;
      }
      /**
     * Converts all occurrences of MathML to the corresponding image.
     * @param {string} content - string with valid MathML code.
     * The MathML code doesn't contain semantics.
     * @param {Constants} characters - Constant object containing xmlCharacters
     * or safeXmlCharacters relation.
     * @param {string} language - a valid language code
     * in order to generate formula accessibility.
     * @returns {string} The input string with all the MathML
     * occurrences replaced by the corresponding image.
     */ static parseMathmlToImg(content, characters, language) {
          let output = "";
          const mathTagBegin = `${characters.tagOpener}math`;
          const mathTagEnd = `${characters.tagOpener}/math${characters.tagCloser}`;
          let start = content.indexOf(mathTagBegin);
          let end = 0;
          while(start !== -1){
              output += content.substring(end, start);
              // Avoid WIRIS images to be parsed.
              const imageMathmlAtrribute = content.indexOf(Configuration.get("imageMathmlAttribute"));
              end = content.indexOf(mathTagEnd, start);
              if (end === -1) {
                  end = content.length - 1;
              } else if (imageMathmlAtrribute !== -1) {
                  // First close tag of img attribute
                  // If a mathmlAttribute exists should be inside a img tag.
                  end += content.indexOf("/>", start);
              } else {
                  end += mathTagEnd.length;
              }
              if (!MathML.isMathmlInAttribute(content, start) && imageMathmlAtrribute === -1) {
                  let mathml = content.substring(start, end);
                  mathml = characters.id === Constants.safeXmlCharacters.id ? MathML.safeXmlDecode(mathml) : MathML.mathMLEntities(mathml);
                  output += Util.createObjectCode(Parser.mathmlToImgObject(document, mathml, null, language));
              } else {
                  output += content.substring(start, end);
              }
              start = content.indexOf(mathTagBegin, end);
          }
          output += content.substring(end, content.length);
          return output;
      }
  }
  // Mutation observers to avoid wiris image formulas class be removed.
  if (typeof MutationObserver !== "undefined") {
      const mutationObserver = new MutationObserver((mutations)=>{
          mutations.forEach((mutation)=>{
              if (mutation.oldValue === Configuration.get("imageClassName") && mutation.attributeName === "class" && mutation.target.className.indexOf(Configuration.get("imageClassName")) === -1) {
                  mutation.target.className = Configuration.get("imageClassName");
              }
          });
      });
      Parser.observer = Object.create(mutationObserver);
      Parser.observer.Config = {
          attributes: true,
          attributeOldValue: true
      };
      // We use own default config.
      Parser.observer.observe = function(target) {
          Object.getPrototypeOf(this).observe(target, this.Config);
      };
  }

  /* eslint-disable class-methods-use-this */ /* eslint-disable no-unused-vars */ /* eslint-disable no-extra-semi */ // The rules above are disabled because we are implementing
  // an external interface.
  class EditorListener {
      /**
     * @classdesc
     * Determines if the content of the
     * MathType Editor has changes.
     * @implements {EditorListeners}
     * @constructs
     */ constructor(){
          /**
       * Indicates if the content of the editor has changed.
       * @type {Boolean}
       */ this.isContentChanged = false;
          /**
       * Indicates if the listener should be waiting for changes in the editor.
       * @type {Boolean}
       */ this.waitingForChanges = false;
      }
      /**
     * Sets {@link EditorListener.isContentChanged} property.
     * @param {Boolean} value - The new vlue.
     */ setIsContentChanged(value) {
          this.isContentChanged = value;
      }
      /**
     * Returns true if the content of the editor has been changed, false otherwise.
     * @return {Boolean}
     */ getIsContentChanged() {
          return this.isContentChanged;
      }
      /**
     * Determines if the EditorListener should wait for any changes.
     * @param {Boolean} value - True if the editor should wait for changes, false otherwise.
     */ setWaitingForChanges(value) {
          this.waitingForChanges = value;
      }
      /**
     * EditorListener method to overwrite.
     * @type {JsEditor}
     * @ignore
     */ caretPositionChanged(_editor) {}
      /**
     * EditorListener method to overwrite
     * @type {JsEditor}
     * @ignore
     */ clipboardChanged(_editor) {}
      /**
     * Determines if the content of an editor has been changed.
     * @param {JsEditor} editor - editor object.
     */ contentChanged(_editor) {
          if (this.waitingForChanges === true && this.isContentChanged === false) {
              this.isContentChanged = true;
          }
      }
      /**
     * EditorListener method to overwrite
     * @param {JsEditor} editor - The editor instance.
     */ styleChanged(_editor) {}
      /**
     * EditorListener method to overwrite
     * @param {JsEditor} - The editor instance.
     */ transformationReceived(_editor) {}
  }

  let wasm;
  const cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
  }) : {
      decode: ()=>{
          throw Error("TextDecoder not available");
      }
  };
  if (typeof TextDecoder !== "undefined") {
      cachedTextDecoder.decode();
  }
  let cachedUint8Memory0 = null;
  function getUint8Memory0() {
      if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
          cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
      }
      return cachedUint8Memory0;
  }
  function getStringFromWasm0(ptr, len) {
      ptr = ptr >>> 0;
      return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }
  const heap = new Array(128).fill(undefined);
  heap.push(undefined, null, true, false);
  let heap_next = heap.length;
  function addHeapObject(obj) {
      if (heap_next === heap.length) heap.push(heap.length + 1);
      const idx = heap_next;
      heap_next = heap[idx];
      heap[idx] = obj;
      return idx;
  }
  function getObject(idx) {
      return heap[idx];
  }
  function dropObject(idx) {
      if (idx < 132) return;
      heap[idx] = heap_next;
      heap_next = idx;
  }
  function takeObject(idx) {
      const ret = getObject(idx);
      dropObject(idx);
      return ret;
  }
  let WASM_VECTOR_LEN = 0;
  const cachedTextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder("utf-8") : {
      encode: ()=>{
          throw Error("TextEncoder not available");
      }
  };
  const encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
      return cachedTextEncoder.encodeInto(arg, view);
  } : function(arg, view) {
      const buf = cachedTextEncoder.encode(arg);
      view.set(buf);
      return {
          read: arg.length,
          written: buf.length
      };
  };
  function passStringToWasm0(arg, malloc, realloc) {
      if (realloc === undefined) {
          const buf = cachedTextEncoder.encode(arg);
          const ptr = malloc(buf.length, 1) >>> 0;
          getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
          WASM_VECTOR_LEN = buf.length;
          return ptr;
      }
      let len = arg.length;
      let ptr = malloc(len, 1) >>> 0;
      const mem = getUint8Memory0();
      let offset = 0;
      for(; offset < len; offset++){
          const code = arg.charCodeAt(offset);
          if (code > 0x7f) break;
          mem[ptr + offset] = code;
      }
      if (offset !== len) {
          if (offset !== 0) {
              arg = arg.slice(offset);
          }
          ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
          const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
          const ret = encodeString(arg, view);
          offset += ret.written;
      }
      WASM_VECTOR_LEN = offset;
      return ptr;
  }
  function isLikeNone(x) {
      return x === undefined || x === null;
  }
  let cachedInt32Memory0 = null;
  function getInt32Memory0() {
      if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
          cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
      }
      return cachedInt32Memory0;
  }
  let cachedFloat64Memory0 = null;
  function getFloat64Memory0() {
      if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
          cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
      }
      return cachedFloat64Memory0;
  }
  let cachedBigInt64Memory0 = null;
  function getBigInt64Memory0() {
      if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
          cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
      }
      return cachedBigInt64Memory0;
  }
  function debugString(val) {
      // primitive types
      const type = typeof val;
      if (type == "number" || type == "boolean" || val == null) {
          return `${val}`;
      }
      if (type == "string") {
          return `"${val}"`;
      }
      if (type == "symbol") {
          const description = val.description;
          if (description == null) {
              return "Symbol";
          } else {
              return `Symbol(${description})`;
          }
      }
      if (type == "function") {
          const name = val.name;
          if (typeof name == "string" && name.length > 0) {
              return `Function(${name})`;
          } else {
              return "Function";
          }
      }
      // objects
      if (Array.isArray(val)) {
          const length = val.length;
          let debug = "[";
          if (length > 0) {
              debug += debugString(val[0]);
          }
          for(let i = 1; i < length; i++){
              debug += ", " + debugString(val[i]);
          }
          debug += "]";
          return debug;
      }
      // Test for built-in
      const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
      let className;
      if (builtInMatches.length > 1) {
          className = builtInMatches[1];
      } else {
          // Failed to match the standard '[object ClassName]'
          return toString.call(val);
      }
      if (className == "Object") {
          // we're a user defined class or Object
          // JSON.stringify avoids problems with cycles, and is generally much
          // easier than looping through ownProperties of `val`.
          try {
              return "Object(" + JSON.stringify(val) + ")";
          } catch (_) {
              return "Object";
          }
      }
      // errors
      if (val instanceof Error) {
          return `${val.name}: ${val.message}\n${val.stack}`;
      }
      // TODO we could test for more things here, like `Set`s and `Map`s.
      return className;
  }
  function makeClosure(arg0, arg1, dtor, f) {
      const state = {
          a: arg0,
          b: arg1,
          cnt: 1,
          dtor
      };
      const real = (...args)=>{
          // First up with a closure we increment the internal reference
          // count. This ensures that the Rust closure environment won't
          // be deallocated while we're invoking it.
          state.cnt++;
          try {
              return f(state.a, state.b, ...args);
          } finally{
              if (--state.cnt === 0) {
                  wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                  state.a = 0;
              }
          }
      };
      real.original = state;
      return real;
  }
  function __wbg_adapter_46(arg0, arg1, arg2) {
      wasm.__wbindgen_export_3(arg0, arg1, addHeapObject(arg2));
  }
  function makeMutClosure(arg0, arg1, dtor, f) {
      const state = {
          a: arg0,
          b: arg1,
          cnt: 1,
          dtor
      };
      const real = (...args)=>{
          // First up with a closure we increment the internal reference
          // count. This ensures that the Rust closure environment won't
          // be deallocated while we're invoking it.
          state.cnt++;
          const a = state.a;
          state.a = 0;
          try {
              return f(a, state.b, ...args);
          } finally{
              if (--state.cnt === 0) {
                  wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
              } else {
                  state.a = a;
              }
          }
      };
      real.original = state;
      return real;
  }
  function __wbg_adapter_49(arg0, arg1) {
      wasm.__wbindgen_export_4(arg0, arg1);
  }
  function __wbg_adapter_52(arg0, arg1, arg2) {
      wasm.__wbindgen_export_5(arg0, arg1, addHeapObject(arg2));
  }
  function handleError(f, args) {
      try {
          return f.apply(this, args);
      } catch (e) {
          wasm.__wbindgen_export_6(addHeapObject(e));
      }
  }
  function __wbg_adapter_103(arg0, arg1, arg2, arg3) {
      wasm.__wbindgen_export_7(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
  }
  function getArrayU8FromWasm0(ptr, len) {
      ptr = ptr >>> 0;
      return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
  }
  /**
   */ let Telemeter$1 = class Telemeter {
      __destroy_into_raw() {
          const ptr = this.__wbg_ptr;
          this.__wbg_ptr = 0;
          return ptr;
      }
      free() {
          const ptr = this.__destroy_into_raw();
          wasm.__wbg_telemeter_free(ptr);
      }
      /**
     * @param {any} solution
     * @param {any} hosts
     * @param {any} config
     */ constructor(solution, hosts, config){
          try {
              const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
              wasm.telemeter_new(retptr, addHeapObject(solution), addHeapObject(hosts), addHeapObject(config));
              var r0 = getInt32Memory0()[retptr / 4 + 0];
              var r1 = getInt32Memory0()[retptr / 4 + 1];
              var r2 = getInt32Memory0()[retptr / 4 + 2];
              if (r2) {
                  throw takeObject(r1);
              }
              this.__wbg_ptr = r0 >>> 0;
              return this;
          } finally{
              wasm.__wbindgen_add_to_stack_pointer(16);
          }
      }
      /**
     * @param {string} sender_id
     * @returns {Promise<any>}
     */ identify(sender_id) {
          const ptr0 = passStringToWasm0(sender_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.telemeter_identify(this.__wbg_ptr, ptr0, len0);
          return takeObject(ret);
      }
      /**
     * @param {string} event_type
     * @param {any} event_payload
     * @returns {Promise<any>}
     */ track(event_type, event_payload) {
          const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.telemeter_track(this.__wbg_ptr, ptr0, len0, addHeapObject(event_payload));
          return takeObject(ret);
      }
      /**
     * @param {any} level
     * @param {string} message
     * @param {any} payload
     * @returns {Promise<any>}
     */ log(level, message, payload) {
          const ptr0 = passStringToWasm0(message, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.telemeter_log(this.__wbg_ptr, addHeapObject(level), ptr0, len0, addHeapObject(payload));
          return takeObject(ret);
      }
      /**
     * @returns {Promise<any>}
     */ finish() {
          const ptr = this.__destroy_into_raw();
          const ret = wasm.telemeter_finish(ptr);
          return takeObject(ret);
      }
      /**
     * @param {boolean | undefined} [new_debug_status]
     */ debug(new_debug_status) {
          wasm.telemeter_debug(this.__wbg_ptr, isLikeNone(new_debug_status) ? 0xffffff : new_debug_status ? 1 : 0);
      }
  };
  async function __wbg_load(module1, imports) {
      if (typeof Response === "function" && module1 instanceof Response) {
          if (typeof WebAssembly.instantiateStreaming === "function") {
              try {
                  return await WebAssembly.instantiateStreaming(module1, imports);
              } catch (e) {
                  if (module1.headers.get("Content-Type") != "application/wasm") {
                      console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                  } else {
                      throw e;
                  }
              }
          }
          const bytes = await module1.arrayBuffer();
          return await WebAssembly.instantiate(bytes, imports);
      } else {
          const instance = await WebAssembly.instantiate(module1, imports);
          if (instance instanceof WebAssembly.Instance) {
              return {
                  instance,
                  module: module1
              };
          } else {
              return instance;
          }
      }
  }
  function __wbg_get_imports() {
      const imports = {};
      imports.wbg = {};
      imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
          const ret = getStringFromWasm0(arg0, arg1);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_new_c728d68b8b34487e = function() {
          const ret = new Object();
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_status_7841bb47be2a8f16 = function(arg0) {
          const ret = getObject(arg0).status;
          return ret;
      };
      imports.wbg.__wbg_headers_ea7ef583d1564b08 = function(arg0) {
          const ret = getObject(arg0).headers;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_new0_ad75dd38f92424e2 = function() {
          const ret = new Date();
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_getTime_ed6ee333b702f8fc = function(arg0) {
          const ret = getObject(arg0).getTime();
          return ret;
      };
      imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
          takeObject(arg0);
      };
      imports.wbg.__wbindgen_is_object = function(arg0) {
          const val = getObject(arg0);
          const ret = typeof val === "object" && val !== null;
          return ret;
      };
      imports.wbg.__wbg_crypto_58f13aa23ffcb166 = function(arg0) {
          const ret = getObject(arg0).crypto;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_process_5b786e71d465a513 = function(arg0) {
          const ret = getObject(arg0).process;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_versions_c2ab80650590b6a2 = function(arg0) {
          const ret = getObject(arg0).versions;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_node_523d7bd03ef69fba = function(arg0) {
          const ret = getObject(arg0).node;
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_is_string = function(arg0) {
          const ret = typeof getObject(arg0) === "string";
          return ret;
      };
      imports.wbg.__wbg_msCrypto_abcb1295e768d1f2 = function(arg0) {
          const ret = getObject(arg0).msCrypto;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_require_2784e593a4674877 = function() {
          return handleError(function() {
              const ret = module.require;
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_newwithlength_13b5319ab422dcf6 = function(arg0) {
          const ret = new Uint8Array(arg0 >>> 0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_get_4a9aa5157afeb382 = function(arg0, arg1) {
          const ret = getObject(arg0)[arg1 >>> 0];
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_next_1989a20442400aaa = function() {
          return handleError(function(arg0) {
              const ret = getObject(arg0).next();
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_done_bc26bf4ada718266 = function(arg0) {
          const ret = getObject(arg0).done;
          return ret;
      };
      imports.wbg.__wbg_value_0570714ff7d75f35 = function(arg0) {
          const ret = getObject(arg0).value;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_iterator_7ee1a391d310f8e4 = function() {
          const ret = Symbol.iterator;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_get_2aff440840bb6202 = function() {
          return handleError(function(arg0, arg1) {
              const ret = Reflect.get(getObject(arg0), getObject(arg1));
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_next_15da6a3df9290720 = function(arg0) {
          const ret = getObject(arg0).next;
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_is_function = function(arg0) {
          const ret = typeof getObject(arg0) === "function";
          return ret;
      };
      imports.wbg.__wbg_call_669127b9d730c650 = function() {
          return handleError(function(arg0, arg1) {
              const ret = getObject(arg0).call(getObject(arg1));
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
          const ret = getObject(arg0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_self_3fad056edded10bd = function() {
          return handleError(function() {
              const ret = self.self;
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_window_a4f46c98a61d4089 = function() {
          return handleError(function() {
              const ret = window.window;
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_globalThis_17eff828815f7d84 = function() {
          return handleError(function() {
              const ret = globalThis.globalThis;
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_global_46f939f6541643c5 = function() {
          return handleError(function() {
              const ret = global.global;
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbindgen_is_undefined = function(arg0) {
          const ret = getObject(arg0) === undefined;
          return ret;
      };
      imports.wbg.__wbg_newnoargs_ccdcae30fd002262 = function(arg0, arg1) {
          const ret = new Function(getStringFromWasm0(arg0, arg1));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_isArray_38525be7442aa21e = function(arg0) {
          const ret = Array.isArray(getObject(arg0));
          return ret;
      };
      imports.wbg.__wbg_call_53fc3abd42e24ec8 = function() {
          return handleError(function(arg0, arg1, arg2) {
              const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_isSafeInteger_c38b0a16d0c7cef7 = function(arg0) {
          const ret = Number.isSafeInteger(getObject(arg0));
          return ret;
      };
      imports.wbg.__wbg_new_feb65b865d980ae2 = function(arg0, arg1) {
          try {
              var state0 = {
                  a: arg0,
                  b: arg1
              };
              var cb0 = (arg0, arg1)=>{
                  const a = state0.a;
                  state0.a = 0;
                  try {
                      return __wbg_adapter_103(a, state0.b, arg0, arg1);
                  } finally{
                      state0.a = a;
                  }
              };
              const ret = new Promise(cb0);
              return addHeapObject(ret);
          } finally{
              state0.a = state0.b = 0;
          }
      };
      imports.wbg.__wbindgen_memory = function() {
          const ret = wasm.memory;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_buffer_344d9b41efe96da7 = function(arg0) {
          const ret = getObject(arg0).buffer;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_new_d8a000788389a31e = function(arg0) {
          const ret = new Uint8Array(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_set_dcfd613a3420f908 = function(arg0, arg1, arg2) {
          getObject(arg0).set(getObject(arg1), arg2 >>> 0);
      };
      imports.wbg.__wbg_length_a5587d6cd79ab197 = function(arg0) {
          const ret = getObject(arg0).length;
          return ret;
      };
      imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
          const obj = getObject(arg1);
          const ret = typeof obj === "string" ? obj : undefined;
          var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          var len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_stringify_4039297315a25b00 = function() {
          return handleError(function(arg0) {
              const ret = JSON.stringify(getObject(arg0));
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_set_40f7786a25a9cc7e = function() {
          return handleError(function(arg0, arg1, arg2) {
              const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
              return ret;
          }, arguments);
      };
      imports.wbg.__wbg_has_cdf8b85f6e903c80 = function() {
          return handleError(function(arg0, arg1) {
              const ret = Reflect.has(getObject(arg0), getObject(arg1));
              return ret;
          }, arguments);
      };
      imports.wbg.__wbg_fetch_701fcd2bde06379a = function(arg0, arg1) {
          const ret = getObject(arg0).fetch(getObject(arg1));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_fetch_b5d6bebed1e6c2d2 = function(arg0) {
          const ret = fetch(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_newwithbyteoffsetandlength_2dc04d99088b15e3 = function(arg0, arg1, arg2) {
          const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_new_e4960143e41697a4 = function() {
          return handleError(function() {
              const ret = new AbortController();
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_signal_1ed842bebd6ae322 = function(arg0) {
          const ret = getObject(arg0).signal;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_abort_8355f201f30300bb = function(arg0) {
          getObject(arg0).abort();
      };
      imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
          const ret = new Error(getStringFromWasm0(arg0, arg1));
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
          const ret = getObject(arg0) == getObject(arg1);
          return ret;
      };
      imports.wbg.__wbindgen_boolean_get = function(arg0) {
          const v = getObject(arg0);
          const ret = typeof v === "boolean" ? v ? 1 : 0 : 2;
          return ret;
      };
      imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
          const obj = getObject(arg1);
          const ret = typeof obj === "number" ? obj : undefined;
          getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
          getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
      };
      imports.wbg.__wbg_instanceof_Uint8Array_19e6f142a5e7e1e1 = function(arg0) {
          let result;
          try {
              result = getObject(arg0) instanceof Uint8Array;
          } catch (_) {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_instanceof_ArrayBuffer_c7cc317e5c29cc0d = function(arg0) {
          let result;
          try {
              result = getObject(arg0) instanceof ArrayBuffer;
          } catch (_) {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_entries_6d727b73ee02b7ce = function(arg0) {
          const ret = Object.entries(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_String_917f38a1211cf44b = function(arg0, arg1) {
          const ret = String(getObject(arg1));
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_warn_ade8d3b7ecee11ff = function(arg0, arg1) {
          console.warn(getObject(arg0), getObject(arg1));
      };
      imports.wbg.__wbg_readyState_13e55da5ad6d64e2 = function(arg0) {
          const ret = getObject(arg0).readyState;
          return ret;
      };
      imports.wbg.__wbg_warn_4affe1093892a4ef = function(arg0) {
          console.warn(getObject(arg0));
      };
      imports.wbg.__wbg_close_f4135085ec3fc8f0 = function() {
          return handleError(function(arg0) {
              getObject(arg0).close();
          }, arguments);
      };
      imports.wbg.__wbg_new_b9b318679315404f = function() {
          return handleError(function(arg0, arg1) {
              const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_setbinaryType_dcb62e0f2b346301 = function(arg0, arg1) {
          getObject(arg0).binaryType = takeObject(arg1);
      };
      imports.wbg.__wbg_log_7811587c4c6d2844 = function(arg0) {
          console.log(getObject(arg0));
      };
      imports.wbg.__wbg_error_f0a6627f4b23c19d = function(arg0) {
          console.error(getObject(arg0));
      };
      imports.wbg.__wbg_info_3ca7870690403fee = function(arg0) {
          console.info(getObject(arg0));
      };
      imports.wbg.__wbg_document_183cf1eecfdbffee = function(arg0) {
          const ret = getObject(arg0).document;
          return isLikeNone(ret) ? 0 : addHeapObject(ret);
      };
      imports.wbg.__wbg_visibilityState_9721703a5ef75faf = function(arg0) {
          const ret = getObject(arg0).visibilityState;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_getwithrefkey_3b3c46ba20582127 = function(arg0, arg1) {
          const ret = getObject(arg0)[getObject(arg1)];
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_length_cace2e0b3ddc0502 = function(arg0) {
          const ret = getObject(arg0).length;
          return ret;
      };
      imports.wbg.__wbg_addEventListener_0f2891b0794e07fa = function() {
          return handleError(function(arg0, arg1, arg2, arg3) {
              getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
          }, arguments);
      };
      imports.wbg.__wbg_removeEventListener_104d11302bb212d1 = function() {
          return handleError(function(arg0, arg1, arg2, arg3) {
              getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
          }, arguments);
      };
      imports.wbg.__wbindgen_is_bigint = function(arg0) {
          const ret = typeof getObject(arg0) === "bigint";
          return ret;
      };
      imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
          const ret = arg0;
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_in = function(arg0, arg1) {
          const ret = getObject(arg0) in getObject(arg1);
          return ret;
      };
      imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
          const ret = BigInt.asUintN(64, arg0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
          const ret = getObject(arg0) === getObject(arg1);
          return ret;
      };
      imports.wbg.__wbg_localStorage_e11f72e996a4f5d9 = function() {
          return handleError(function(arg0) {
              const ret = getObject(arg0).localStorage;
              return isLikeNone(ret) ? 0 : addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_getItem_c81cd3ae30cd579a = function() {
          return handleError(function(arg0, arg1, arg2, arg3) {
              const ret = getObject(arg1).getItem(getStringFromWasm0(arg2, arg3));
              var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
              var len1 = WASM_VECTOR_LEN;
              getInt32Memory0()[arg0 / 4 + 1] = len1;
              getInt32Memory0()[arg0 / 4 + 0] = ptr1;
          }, arguments);
      };
      imports.wbg.__wbg_navigator_7078da62d92ff5ad = function(arg0) {
          const ret = getObject(arg0).navigator;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_mediaDevices_e00b1f64d2b9939f = function() {
          return handleError(function(arg0) {
              const ret = getObject(arg0).mediaDevices;
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_enumerateDevices_619d52f5eef34c2f = function() {
          return handleError(function(arg0) {
              const ret = getObject(arg0).enumerateDevices();
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_setItem_fe04f524052a3839 = function() {
          return handleError(function(arg0, arg1, arg2, arg3, arg4) {
              getObject(arg0).setItem(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
          }, arguments);
      };
      imports.wbg.__wbindgen_cb_drop = function(arg0) {
          const obj = takeObject(arg0).original;
          if (obj.cnt-- == 1) {
              obj.a = 0;
              return true;
          }
          const ret = false;
          return ret;
      };
      imports.wbg.__wbg_deviceId_58f7da2228a26c02 = function(arg0, arg1) {
          const ret = getObject(arg1).deviceId;
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_instanceof_Response_944e2745b5db71f5 = function(arg0) {
          let result;
          try {
              result = getObject(arg0) instanceof Response;
          } catch (_) {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_randomFillSync_a0d98aa11c81fe89 = function() {
          return handleError(function(arg0, arg1) {
              getObject(arg0).randomFillSync(takeObject(arg1));
          }, arguments);
      };
      imports.wbg.__wbg_subarray_6ca5cfa7fbb9abbe = function(arg0, arg1, arg2) {
          const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_getRandomValues_504510b5564925af = function() {
          return handleError(function(arg0, arg1) {
              getObject(arg0).getRandomValues(getObject(arg1));
          }, arguments);
      };
      imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
          const v = getObject(arg1);
          const ret = typeof v === "bigint" ? v : undefined;
          getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
          getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
      };
      imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
          const ret = debugString(getObject(arg1));
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbindgen_throw = function(arg0, arg1) {
          throw new Error(getStringFromWasm0(arg0, arg1));
      };
      imports.wbg.__wbg_then_89e1c559530b85cf = function(arg0, arg1) {
          const ret = getObject(arg0).then(getObject(arg1));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_queueMicrotask_e5949c35d772a669 = function(arg0) {
          queueMicrotask(getObject(arg0));
      };
      imports.wbg.__wbg_then_1bbc9edafd859b06 = function(arg0, arg1, arg2) {
          const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_queueMicrotask_2be8b97a81fe4d00 = function(arg0) {
          const ret = getObject(arg0).queueMicrotask;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_resolve_a3252b2860f0a09e = function(arg0) {
          const ret = Promise.resolve(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_url_1f609e63ff1a7983 = function(arg0, arg1) {
          const ret = getObject(arg1).url;
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_send_2860805104507701 = function() {
          return handleError(function(arg0, arg1, arg2) {
              getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2));
          }, arguments);
      };
      imports.wbg.__wbg_instanceof_Window_cde2416cf5126a72 = function(arg0) {
          let result;
          try {
              result = getObject(arg0) instanceof Window;
          } catch (_) {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_new_19676474aa414d62 = function() {
          return handleError(function() {
              const ret = new Headers();
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbg_append_feec4143bbf21904 = function() {
          return handleError(function(arg0, arg1, arg2, arg3, arg4) {
              getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
          }, arguments);
      };
      imports.wbg.__wbg_newwithstrandinit_29038da14d09e330 = function() {
          return handleError(function(arg0, arg1, arg2) {
              const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
              return addHeapObject(ret);
          }, arguments);
      };
      imports.wbg.__wbindgen_closure_wrapper1532 = function(arg0, arg1, arg2) {
          const ret = makeClosure(arg0, arg1, 76, __wbg_adapter_46);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper1602 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 76, __wbg_adapter_49);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper1834 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 76, __wbg_adapter_52);
          return addHeapObject(ret);
      };
      return imports;
  }
  function __wbg_finalize_init(instance, module1) {
      wasm = instance.exports;
      __wbg_init.__wbindgen_wasm_module = module1;
      cachedBigInt64Memory0 = null;
      cachedFloat64Memory0 = null;
      cachedInt32Memory0 = null;
      cachedUint8Memory0 = null;
      wasm.__wbindgen_start();
      return wasm;
  }
  async function __wbg_init(input) {
      if (wasm !== undefined) return wasm;
      if (typeof input === "undefined") {
          input = new URL("telemeter_wasm_bg.wasm", (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index.umd.js', document.baseURI).href)));
      }
      const imports = __wbg_get_imports();
      if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
          input = fetch(input);
      }
      const { instance, module: module1 } = await __wbg_load(await input, imports);
      return __wbg_finalize_init(instance, module1);
  }

  /**
   * @classdesc
   * This class implements the @wiris/telemeter-wasm. A utility that helps our Solutions to send the data
   * to Telemetry in a more comfortable and homogeneous way.
   */ class Telemeter {
      /**
     * Inits Telemeter class.
     * The parameters structures are defiended on {@link [Telemeter API](https://github.com/wiris/telemeter/blob/main/docs/USAGE.md#telemeter-api)}
     * @param {Object} telemeterAttributes.solution - The product that send data to Telemetry.
     * @param {Object} telemeterAttributes.hosts - Data about the environment where solution is integrated.
     * @param {Object} telemeterAttributes.config - Configuration parameters.
     */ static init(telemeterAttributes) {
          if (!this.telemeter && !this.waitingForInit) {
              this.waitingForInit = true;
              __wbg_init(telemeterAttributes.url).then(()=>{
                  this.telemeter = new Telemeter$1(telemeterAttributes.solution, telemeterAttributes.hosts, telemeterAttributes.config);
              }).catch((error)=>{
                  console.log(error);
              }).finally(()=>this.waitingForInit = false);
          }
      }
      /**
     * Closes the Telemetry Session. After calling this method no data will be added to the Telemetry Session.
     */ static async finish() {
          if (!this.telemeter) return;
          try {
              let local_telemeter = this.telemeter;
              this.telemeter = undefined;
              await local_telemeter.finish();
          } catch (e) {
              console.error(e);
          }
      }
  }

  class ContentManager {
      /**
     * @classdesc
     * This class represents a modal dialog, managing the following:
     * - The insertion of content into the current instance of the {@link ModalDialog} class.
     * - The actions to be done once the modal object has been submitted
     *   (submitAction} method).
     * - The update of the content when the {@link ModalDialog} class is also updated,
     *   for example when ModalDialog is re-opened.
     * - The communication between the {@link ModalDialog} class and itself, if the content
     *   has been changed (hasChanges} method).
     * @constructs
     * @param {Object} contentManagerAttributes - Object containing all attributes needed to
     * create a new instance.
     */ constructor(contentManagerAttributes){
          /**
       * An object containing MathType editor parameters. See
       * http://docs.wiris.com/en/mathtype/mathtype_web/sdk-api/parameters for further information.
       * @type {Object}
       */ this.editorAttributes = {};
          if ("editorAttributes" in contentManagerAttributes) {
              this.editorAttributes = contentManagerAttributes.editorAttributes;
          } else {
              throw new Error("ContentManager constructor error: editorAttributes property missed.");
          }
          /**
       * CustomEditors instance. Contains the custom editors.
       * @type {CustomEditors}
       */ this.customEditors = null;
          if ("customEditors" in contentManagerAttributes) {
              this.customEditors = contentManagerAttributes.customEditors;
          }
          /**
       * Environment properties. This object contains data about the integration platform.
       * @type {Object}
       * @property {String} editor - Editor name. Usually the HTML editor.
       * @property {String} mode - Save mode. Xml by default.
       * @property {String} version - Plugin version.
       */ this.environment = {};
          if ("environment" in contentManagerAttributes) {
              this.environment = contentManagerAttributes.environment;
          } else {
              throw new Error("ContentManager constructor error: environment property missed");
          }
          /**
       * ContentManager language.
       * @type {String}
       */ this.language = "";
          if ("language" in contentManagerAttributes) {
              this.language = contentManagerAttributes.language;
          } else {
              throw new Error("ContentManager constructor error: language property missed");
          }
          /**
       * {@link EditorListener} instance. Manages the changes inside the editor.
       * @type {EditorListener}
       */ this.editorListener = new EditorListener();
          /**
       * MathType editor instance.
       * @type {JsEditor}
       */ this.editor = null;
          /**
       * Navigator user agent.
       * @type {String}
       */ this.ua = navigator.userAgent.toLowerCase();
          /**
       * Mobile device properties object
       * @type {DeviceProperties}
       */ this.deviceProperties = {};
          this.deviceProperties.isAndroid = this.ua.indexOf("android") > -1;
          this.deviceProperties.isIOS = ContentManager.isIOS();
          /**
       * Custom editor toolbar.
       * @type {String}
       */ this.toolbar = null;
          /**
       * Custom editor toolbar.
       * @type {String}
       */ this.dbclick = null;
          /**
       * Instance of the {@link ModalDialog} class associated with the current
       * {@link ContentManager} instance.
       * @type {ModalDialog}
       */ this.modalDialogInstance = null;
          /**
       * ContentManager listeners.
       * @type {Listeners}
       */ this.listeners = new Listeners();
          /**
       * MathML associated to the ContentManager instance.
       * @type {String}
       */ this.mathML = null;
          /**
       * Indicates if the edited element is a new one or not.
       * @type {Boolean}
       */ this.isNewElement = true;
          /**
       * {@link IntegrationModel} instance. Needed to call wrapper methods.
       * @type {IntegrationModel}
       */ this.integrationModel = null;
      }
      /**
     * Adds a new listener to the current {@link ContentManager} instance.
     * @param {Object} listener - The listener to be added.
     */ addListener(listener) {
          this.listeners.add(listener);
      }
      /**
     * Sets an instance of {@link IntegrationModel} class to the current {@link ContentManager}
     * instance.
     * @param {IntegrationModel} integrationModel - The {@link IntegrationModel} instance.
     */ setIntegrationModel(integrationModel) {
          this.integrationModel = integrationModel;
      }
      /**
     * Sets the {@link ModalDialog} instance into the current {@link ContentManager} instance.
     * @param {ModalDialog} modalDialogInstance - The {@link ModalDialog} instance
     */ setModalDialogInstance(modalDialogInstance) {
          this.modalDialogInstance = modalDialogInstance;
      }
      /**
     * Inserts the content into the current {@link ModalDialog} instance updating
     * the title and inserting the JavaScript editor.
     */ insert() {
          // Before insert the editor we update the modal object title to avoid weird render display.
          this.updateTitle(this.modalDialogInstance);
          this.insertEditor(this.modalDialogInstance);
      }
      /**
     * Inserts MathType editor into the {@link ModalDialog.contentContainer}. It waits until
     * editor's JavaScript is loaded.
     */ insertEditor() {
          if (ContentManager.isEditorLoaded()) {
              this.editor = window.com.wiris.jsEditor.JsEditor.newInstance(this.editorAttributes);
              this.editor.insertInto(this.modalDialogInstance.contentContainer);
              this.editor.focus();
              if (this.modalDialogInstance.rtl) {
                  this.editor.action("rtl");
              }
              // Setting div in rtl in case of it's activated.
              if (this.editor.getEditorModel().isRTL()) {
                  this.editor.element.style.direction = "rtl";
              }
              // Editor listener: this object manages the changes logic of editor.
              this.editor.getEditorModel().addEditorListener(this.editorListener);
              // iOS events.
              if (this.modalDialogInstance.deviceProperties.isIOS) {
                  setTimeout(function() {
                      // Make sure the modalDialogInstance is available when the timeout is over
                      // to avoid throw errors and stop execution.
                      if (this.hasOwnProperty("modalDialogInstance")) this.modalDialogInstance.hideKeyboard(); // eslint-disable-line no-prototype-builtins
                  }, 400);
                  const formulaDisplayDiv = document.getElementsByClassName("wrs_formulaDisplay")[0];
                  Util.addEvent(formulaDisplayDiv, "focus", this.modalDialogInstance.handleOpenedIosSoftkeyboard);
                  Util.addEvent(formulaDisplayDiv, "blur", this.modalDialogInstance.handleClosedIosSoftkeyboard);
              }
              // Fire onLoad event. Necessary to set the MathML into the editor
              // after is loaded.
              this.listeners.fire("onLoad", {});
          } else {
              setTimeout(ContentManager.prototype.insertEditor.bind(this), 100);
          }
      }
      /**
     * Initializes the current class by loading MathType script.
     */ init() {
          if (!ContentManager.isEditorLoaded()) {
              this.addEditorAsExternalDependency();
          }
      }
      /**
     * Adds script element to the DOM to include editor externally.
     */ addEditorAsExternalDependency() {
          const script = document.createElement("script");
          script.type = "text/javascript";
          let editorUrl = Configuration.get("editorUrl");
          // We create an object url for parse url string and work more efficiently.
          const anchorElement = document.createElement("a");
          ContentManager.setHrefToAnchorElement(anchorElement, editorUrl);
          ContentManager.setProtocolToAnchorElement(anchorElement);
          editorUrl = ContentManager.getURLFromAnchorElement(anchorElement);
          // Load editor URL. We add stats as GET params.
          const stats = this.getEditorStats();
          script.src = `${editorUrl}?lang=${this.language}&stats-editor=${stats.editor}&stats-mode=${stats.mode}&stats-version=${stats.version}`;
          document.getElementsByTagName("head")[0].appendChild(script);
      }
      /**
     * Sets the specified url to the anchor element.
     * @param {HTMLAnchorElement} anchorElement - Element where set 'url'.
     * @param {String} url - URL to set.
     */ static setHrefToAnchorElement(anchorElement, url) {
          anchorElement.href = url;
      }
      /**
     * Sets the current protocol to the anchor element.
     * @param {HTMLAnchorElement} anchorElement - Element where set its protocol.
     */ static setProtocolToAnchorElement(anchorElement) {
          // Change to https if necessary.
          if (window.location.href.indexOf("https://") === 0) {
              // It check if browser is https and configuration is http.
              // If this is so, we will replace protocol.
              if (anchorElement.protocol === "http:") {
                  anchorElement.protocol = "https:";
              }
          }
      }
      /**
     * Returns the url of the anchor element adding the current port
     * if it is needed.
     * @param {HTMLAnchorElement} anchorElement - Element where extract the url.
     * @returns {String}
     */ static getURLFromAnchorElement(anchorElement) {
          // Check protocol and remove port if it's standard.
          const removePort = anchorElement.port === "80" || anchorElement.port === "443" || anchorElement.port === "";
          return `${anchorElement.protocol}//${anchorElement.hostname}${removePort ? "" : `:${anchorElement.port}`}${anchorElement.pathname.startsWith("/") ? anchorElement.pathname : `/${anchorElement.pathname}`}`; // eslint-disable-line max-len
      }
      /**
     * Returns object with editor stats.
     *
     * @typedef {Object} EditorStatsObject
     * @property {string} editor - Editor name.
     * @property {string} mode - Current configuration for formula save mode.
     * @property {string} version - Current plugins version.
     * @returns {EditorStatsObject}
     */ getEditorStats() {
          // Editor stats. Use environment property to set it.
          const stats = {};
          if ("editor" in this.environment) {
              stats.editor = this.environment.editor;
          } else {
              stats.editor = "unknown";
          }
          if ("mode" in this.environment) {
              stats.mode = this.environment.mode;
          } else {
              stats.mode = Configuration.get("saveMode");
          }
          if ("version" in this.environment) {
              stats.version = this.environment.version;
          } else {
              stats.version = Configuration.get("version");
          }
          return stats;
      }
      /**
     * Returns true if device is iOS. Otherwise, false.
     * @returns {Boolean}
     */ static isIOS() {
          return [
              "iPad Simulator",
              "iPhone Simulator",
              "iPod Simulator",
              "iPad",
              "iPhone",
              "iPod"
          ].includes(navigator.platform) || // iPad on iOS 13 detection
          navigator.userAgent.includes("Mac") && "ontouchend" in document;
      }
      /**
     * Returns true if device is Mobile. Otherwise, false.
     * @returns {Boolean}
     */ static isMobile() {
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }
      /**
     * Returns true if editor is loaded. Otherwise, false.
     * @returns {Boolean}
     */ static isEditorLoaded() {
          // To know if editor JavaScript is loaded we need to wait until
          // window.com.wiris.jsEditor.JsEditor.newInstance is ready.
          return window.com && window.com.wiris && window.com.wiris.jsEditor && window.com.wiris.jsEditor.JsEditor && window.com.wiris.jsEditor.JsEditor.newInstance;
      }
      /**
     * Sets the {@link ContentManager.editor} initial content.
     */ setInitialContent() {
          if (!this.isNewElement) {
              this.setMathML(this.mathML);
          }
      }
      /**
     * Sets a MathML into {@link ContentManager.editor} instance.
     * @param {String} mathml - MathML string.
     * @param {Boolean} focusDisabled - If true editor don't get focus after the MathML is set.
     * False by default.
     */ setMathML(mathml, focusDisabled) {
          // By default focus is enabled.
          if (typeof focusDisabled === "undefined") {
              focusDisabled = false;
          }
          // Using setMathML method is not a change produced by the user but for the API
          // so we set to false the contentChange property of editorListener.
          this.editor.setMathMLWithCallback(mathml, ()=>{
              this.editorListener.setWaitingForChanges(true);
          });
          // We need to wait a little until the callback finish.
          setTimeout(()=>{
              this.editorListener.setIsContentChanged(false);
          }, 500);
          // In some scenarios - like closing modal object - editor mustn't be focused.
          if (!focusDisabled) {
              this.onFocus();
          }
      }
      /**
     * Sets the focus to the current instance of {@link ContentManager.editor}. Triggered by
     * {@link ModalDialog.focus}.
     */ onFocus() {
          if (typeof this.editor !== "undefined" && this.editor != null) {
              this.editor.focus();
              // On WordPress integration, the focus gets lost right after setting it.
              // To fix this, we enforce another focus some milliseconds after this behaviour.
              setTimeout(()=>{
                  this.editor.focus();
              }, 100);
          }
      }
      /**
     * Updates the edition area by calling {@link IntegrationModel.updateFormula}.
     * Triggered by {@link ModalDialog.submitAction}.
     */ submitAction() {
          if (!this.editor.isFormulaEmpty()) {
              let mathML = this.editor.getMathMLWithSemantics();
              // Add class for custom editors.
              if (this.customEditors.getActiveEditor() !== null) {
                  const { toolbar } = this.customEditors.getActiveEditor();
                  mathML = MathML.addCustomEditorClassAttribute(mathML, toolbar);
              } else {
                  // We need - if exists - the editor name from MathML
                  // class attribute.
                  Object.keys(this.customEditors.editors).forEach((key)=>{
                      mathML = MathML.removeCustomEditorClassAttribute(mathML, key);
                  });
              }
              const mathmlEntitiesEncoded = MathML.mathMLEntities(mathML);
              this.integrationModel.updateFormula(mathmlEntitiesEncoded);
          } else {
              this.integrationModel.updateFormula(null);
          }
          this.customEditors.disable();
          this.integrationModel.notifyWindowClosed();
          // Set disabled focus to prevent lost focus.
          this.setEmptyMathML();
          this.customEditors.disable();
      }
      /**
     * Sets an empty MathML as {@link ContentManager.editor} content.
     * This will open the MT/CT editor with the hand mode.
     * It adds dir rtl in case of it's activated.
     */ setEmptyMathML() {
          const isMobile = this.deviceProperties.isAndroid || this.deviceProperties.isIOS;
          const isRTL = this.editor.getEditorModel().isRTL();
          if (isMobile || this.integrationModel.forcedHandMode) {
              // For mobile devices or forced hand mode, set an empty annotation MATHML to maintain the editor in Hand mode.
              const mathML = `<math${isRTL ? ' dir="rtl"' : ""}><semantics><annotation encoding="application/json">[]</annotation></semantics></math>`;
              this.setMathML(mathML, true);
          } else {
              // For non-mobile devices or not forced hand mode, set the empty MathML without an annotation.
              const mathML = `<math${isRTL ? ' dir="rtl"' : ""}/>`;
              this.setMathML(mathML, true);
          }
      }
      /**
     * Open event. Triggered by {@link ModalDialog.open}. Does the following:
     * - Updates the {@link ContentManager.editor} content
     *   (with an empty MathML or an existing formula),
     * - Updates the {@link ContentManager.editor} toolbar.
     * - Recovers the the focus.
     */ onOpen() {
          if (this.isNewElement) {
              this.setEmptyMathML();
          } else {
              this.setMathML(this.mathML);
          }
          let toolbar = this.updateToolbar();
          this.onFocus();
          if (this.deviceProperties.isIOS) {
              const zoom = document.documentElement.clientWidth / window.innerWidth;
              if (zoom !== 1) {
                  // Open editor in Keyboard mode if user use iOS, Safari and page is zoomed.
                  this.setKeyboardMode();
              }
          }
          let trigger = this.dbclick ? "formula" : "button";
          // Call Telemetry service to track the event.
          try {
              Telemeter.telemeter.track("OPENED_MTCT_EDITOR", {
                  toolbar: toolbar,
                  trigger: trigger
              });
          } catch (error) {
              console.error("Error tracking OPENED_MTCT_EDITOR", error);
          }
          Core.globalListeners.fire("onModalOpen", {});
          if (this.integrationModel.forcedHandMode) {
              this.hideHandModeButton();
              // In case we have a keyboard written formula, we still want it to be opened with handMode.
              if (this.mathML && !this.mathML.includes('<annotation encoding="application/json">') && !this.isNewElement) {
                  this.openHandOnKeyboardMathML(this.mathML, this.editor);
              }
          }
      }
      /**
     * Change Editor in keyboard mode when is loaded
     */ setKeyboardMode() {
          const wrsEditor = document.getElementsByClassName("wrs_handOpen wrs_disablePalette")[0];
          if (wrsEditor) {
              wrsEditor.classList.remove("wrs_handOpen");
              wrsEditor.classList.remove("wrs_disablePalette");
          } else {
              setTimeout(ContentManager.prototype.setKeyboardMode.bind(this), 100);
          }
      }
      /**
     * Hides the hand <-> keyboard mode switch.
     *
     * This method relies completely on the classes used on different HTML elements within the editor itself, meaning
     * any change on those classes will make this code stop working properly.
     *
     * On top of that, some of those classes are changed on runtime (for example, the one that makes some buttons change).
     * This forces us to use some delayed code (this is, a timeout) to make sure everything exists when we need it.
     * @param {*} forced (boolean) Forces the user to stay in Hand mode by hiding the keyboard mode button.
     */ hideHandModeButton(forced = true) {
          if (this.handSwitchHidden) {
              return; // hand <-> keyboard button already hidden.
          }
          // "Open hand mode" button takes a little bit to be available.
          // This selector gets the hand <-> keyboard mode switch
          const handModeButtonSelector = "div.wrs_editor.wrs_flexEditor.wrs_withHand.wrs_animated .wrs_handWrapper input[type=button]";
          // If in "forced mode", we hide the "keyboard button" so the user can't can't change between hand and keyboard modes.
          // We use an observer to ensure that the button it hidden as soon as it appears.
          if (forced) {
              const mutationInstance = new MutationObserver((mutations)=>{
                  const handModeButton = document.querySelector(handModeButtonSelector);
                  if (handModeButton) {
                      handModeButton.hidden = true;
                      this.handSwitchHidden = true;
                      mutationInstance.disconnect();
                  }
              });
              mutationInstance.observe(document.body, {
                  attributes: true,
                  childList: true,
                  characterData: true,
                  subtree: true
              });
          }
      }
      /**
     * It will open any formula written in Keyboard mode with the hand mode with the default hand trace.
     *
     * @param {String} mathml The original KeyBoard MathML
     * @param {Object} editor The editor object.
     */ async openHandOnKeyboardMathML(mathml, editor) {
          // First, as an editor requirement, we need to update the editor object with the current MathML formula.
          // Once the MathML formula is updated to the one we want to open with handMode, we will be able to proceed.
          await new Promise((resolve)=>{
              editor.setMathMLWithCallback(mathml, resolve);
          });
          // We wait until the hand editor object exists.
          await this.waitForHand(editor);
          // Logic to get the hand traces and open the formula in hand mode.
          // This logic comes from the editor.
          const handEditor = editor.hand;
          editor.handTemporalMathML = editor.getMathML();
          const handCoordinates = editor.editorModel.getHandStrokes();
          handEditor.setStrokes(handCoordinates);
          handEditor.fitStrokes(true);
          editor.openHand();
      }
      /**
     * Waits until the hand editor object exists.
     * @param {Obect} editor The editor object.
     */ async waitForHand(editor) {
          while(!editor.hand){
              await new Promise((resolve)=>setTimeout(resolve, 100));
          }
      }
      /**
     * Sets the correct toolbar depending if exist other custom toolbars
     * at the same time (e.g: Chemistry).
     */ updateToolbar() {
          this.updateTitle(this.modalDialogInstance);
          const customEditor = this.customEditors.getActiveEditor();
          let toolbar;
          if (customEditor) {
              toolbar = customEditor.toolbar ? customEditor.toolbar : _wrs_int_wirisProperties.toolbar;
              if (this.toolbar == null || this.toolbar !== toolbar) {
                  this.setToolbar(toolbar);
              }
          } else {
              toolbar = this.getToolbar();
              if (this.toolbar == null || this.toolbar !== toolbar) {
                  this.setToolbar(toolbar);
                  this.customEditors.disable();
              }
          }
          return toolbar;
      }
      /**
     * Updates the current {@link ModalDialog.title}. If a {@link CustomEditors} is enabled
     * sets the custom editor title. Otherwise sets the default title.
     */ updateTitle() {
          const customEditor = this.customEditors.getActiveEditor();
          if (customEditor) {
              this.modalDialogInstance.setTitle(customEditor.title);
          } else {
              this.modalDialogInstance.setTitle("MathType");
          }
      }
      /**
     * Returns the editor toolbar, depending on the configuration local or server side.
     * @returns {String} - Toolbar identifier.
     */ getToolbar() {
          let toolbar = "general";
          if ("toolbar" in this.editorAttributes) {
              ({ toolbar } = this.editorAttributes);
          }
          // TODO: Change global integration variable for integration custom toolbar.
          if (toolbar === "general") {
              // eslint-disable-next-line camelcase
              toolbar = typeof _wrs_int_wirisProperties === "undefined" || typeof _wrs_int_wirisProperties.toolbar === "undefined" ? "general" : _wrs_int_wirisProperties.toolbar;
          }
          return toolbar;
      }
      /**
     * Sets the current {@link ContentManager.editor} instance toolbar.
     * @param {String} toolbar - The toolbar name.
     */ setToolbar(toolbar) {
          this.toolbar = toolbar;
          this.editor.setParams({
              toolbar: this.toolbar
          });
      }
      /**
     * Sets the custom headers added on editor requests.
     * @returns {Object} headers - key value headers.
     */ setCustomHeaders(headers) {
          let headersObj = {};
          // We control that we only get String or Object as the input.
          if (typeof headers === "object") {
              headersObj = headers;
          } else if (typeof headers === "string") {
              headersObj = Util.convertStringToObject(headers);
          }
          this.editor.setParams({
              customHeaders: headersObj
          });
          return headersObj;
      }
      /**
     * Returns true if the content of the editor has been changed. The logic of the changes
     * is delegated to {@link EditorListener} class.
     * @returns {Boolean} True if the editor content has been changed. False otherwise.
     */ hasChanges() {
          return !this.editor.isFormulaEmpty() && this.editorListener.getIsContentChanged();
      }
      /**
     * Handle keyboard events detected in modal when elements of this class intervene.
     * @param {KeyboardEvent} keyboardEvent - The keyboard event.
     */ onKeyDown(keyboardEvent) {
          if (keyboardEvent.key !== undefined && keyboardEvent.repeat === false) {
              if (keyboardEvent.key === "Escape" || keyboardEvent.key === "Esc") {
                  // Code to detect Esc event.
                  // There should be only one element with class name 'wrs_pressed' at the same time.
                  let list = document.getElementsByClassName("wrs_expandButton wrs_expandButtonFor3RowsLayout wrs_pressed");
                  if (list.length === 0) {
                      list = document.getElementsByClassName("wrs_expandButton wrs_expandButtonFor2RowsLayout wrs_pressed");
                      if (list.length === 0) {
                          list = document.getElementsByClassName("wrs_select wrs_pressed");
                          if (list.length === 0) {
                              this.modalDialogInstance.cancelAction();
                              keyboardEvent.stopPropagation();
                              keyboardEvent.preventDefault();
                          }
                      }
                  }
              } else if (keyboardEvent.shiftKey && keyboardEvent.key === "Tab") {
                  // Code to detect shift Tab event.
                  if (document.activeElement === this.modalDialogInstance.submitButton) {
                      // Focus is on OK button.
                      this.editor.focus();
                      keyboardEvent.stopPropagation();
                      keyboardEvent.preventDefault();
                  } else if (document.querySelector('[title="Manual"]') === document.activeElement) {
                      // Focus is on minimize button (_).
                      this.modalDialogInstance.closeDiv.focus();
                      keyboardEvent.stopPropagation();
                      keyboardEvent.preventDefault();
                  } else {
                      if (document.activeElement === this.modalDialogInstance.minimizeDiv) {
                          // Focus on cancel button.
                          if (!(this.modalDialogInstance.properties.state === "minimized")) {
                              this.modalDialogInstance.cancelButton.focus();
                              keyboardEvent.stopPropagation();
                              keyboardEvent.preventDefault();
                          }
                      }
                  }
              } else if (keyboardEvent.key === "Tab") {
                  // Code to detect Tab event.
                  if (document.activeElement === this.modalDialogInstance.cancelButton) {
                      // Focus is on X button.
                      this.modalDialogInstance.minimizeDiv.focus();
                      keyboardEvent.stopPropagation();
                      keyboardEvent.preventDefault();
                  } else if (document.activeElement === this.modalDialogInstance.closeDiv) {
                      // Focus on help button.
                      if (!(this.modalDialogInstance.properties.state === "minimized")) {
                          const element = document.querySelector('[title="Manual"]');
                          element.focus();
                          keyboardEvent.stopPropagation();
                          keyboardEvent.preventDefault();
                      }
                  } else {
                      // There should be only one element with class name 'wrs_formulaDisplay'.
                      const element = document.getElementsByClassName("wrs_formulaDisplay")[0];
                      if (element.getAttribute("class") === "wrs_formulaDisplay wrs_focused") {
                          // Focus is on formuladisplay.
                          this.modalDialogInstance.submitButton.focus();
                          keyboardEvent.stopPropagation();
                          keyboardEvent.preventDefault();
                      }
                  }
              }
          }
      }
  }

  /**
   * A custom editor is MathType editor with a different
   * @typedef {Object} CustomEditor
   * @property {String} CustomEditor.name - Custom editor name.
   * @property {String} CustomEditor.toolbar - Custom editor toolbar.
   * @property {String} CustomEditor.icon - Custom editor icon.
   * @property {String} CustomEditor.confVariable - Configuration property to manage
   * the availability of the custom editor.
   * @property {String} CustomEditor.title - Custom editor modal dialog title.
   * @property {String} CustomEditor.tooltip - Custom editor icon tooltip.
   */ class CustomEditors {
      /**
     * @classdesc
     * This class represents the MathType custom editors manager.
     * A custom editor is MathType editor with a custom  toolbar.
     * This class associates a {@link CustomEditor} to:
     * - It's own formulas
     * - A custom toolbar
     * - An icon to open it from a HTML editor.
     * - A tooltip for the icon.
     * - A global variable to enable or disable it globally.
     * @constructs
     */ constructor(){
          /**
       * The custom editors.
       * @type {Array.<CustomEditor>}
       */ this.editors = [];
          /**
       * The active editor name.
       * @type {String}
       */ this.activeEditor = "default";
      }
      /**
     * Adds a {@link CustomEditor} to editors array.
     * @param {String} editorName - The editor name.
     * @param {CustomEditor} editorParams - The custom editor parameters.
     */ addEditor(editorName, editorParams) {
          const customEditor = {};
          customEditor.name = editorParams.name;
          customEditor.toolbar = editorParams.toolbar;
          customEditor.icon = editorParams.icon;
          customEditor.confVariable = editorParams.confVariable;
          customEditor.title = editorParams.title;
          customEditor.tooltip = editorParams.tooltip;
          this.editors[editorName] = customEditor;
      }
      /**
     * Enables a {@link CustomEditor}.
     * @param {String} customEditorName - The custom editor name.
     */ enable(customEditorName) {
          this.activeEditor = customEditorName;
      }
      /**
     * Disables a {@link CustomEditor}.
     */ disable() {
          this.activeEditor = "default";
      }
      /**
     * Returns the active editor.
     * @return {CustomEditor} - A {@link CustomEditor} if a custom editor is enabled. Null otherwise.
     */ getActiveEditor() {
          if (this.activeEditor !== "default") {
              return this.editors[this.activeEditor];
          }
          return null;
      }
  }

  /**
   * Represents the configuration properties generated from the frontend (JavaScript variables).
   * @type {Object}
   * @property {string} imageClassName - Default MathType formula image class.
   * @property {string} imageClassName - Default MathType CAS image class.
   * @ignore
   */ const jsProperties = {
      imageCustomEditorName: "data-custom-editor",
      imageClassName: "Wirisformula",
      CASClassName: "Wiriscas"
  };

  class Event {
      /**
     * @classdesc
     * This class represents a custom event. Events should be fired by the {@link Listener} class.
     *
     * ```js
     *  let customEvent = new Event();
     *  customEvent.properties = {};
     *
     *  let listeners = new Listeners();
     *  listeners.newListener(eventName, callback);
     *
     *  listeners.fire(eventName, customEvent) *
     * ```
     * @constructs
     */ constructor(){
          /**
       * Indicates if the event should be cancelled.
       * @type {Boolean}
       */ this.cancelled = false;
          /**
       * Indicates if the event should be prevented.
       * @type {Boolean}
       */ this.defaultPrevented = false;
      }
      /**
     * Cancels the event.
     */ cancel() {
          this.cancelled = true;
      }
      /**
     * Prevents the default action.
     */ preventDefault() {
          this.defaultPrevented = true;
      }
  }

  /**

   */ class PopUpMessage {
      /**
     * @classdesc
     * This class represents a dialog message overlaying a DOM element in order to
     * accept / cancel discard changes. The dialog can be closed i.e the overlay disappears
     * o canceled. In this last case a callback function should be called.
     * @constructs
     * @param {Object} popupMessageAttributes - Object containing popup properties.
     * @param {HTMLElement} popupMessageAttributes.overlayElement - Element to overlay.
     * @param {Object} popupMessageAttributes.callbacks - Contains callback
     * methods for close and cancel actions.
     * @param {Object} popupMessageAttributes.strings - Contains all the strings needed.
     */ constructor(popupMessageAttributes){
          /**
       * Element to be overlaid when the popup appears.
       */ this.overlayElement = popupMessageAttributes.overlayElement;
          this.callbacks = popupMessageAttributes.callbacks;
          /**
       * HTMLElement element to wrap all HTML elements inside the popupMessage.
       */ this.overlayWrapper = this.overlayElement.appendChild(document.createElement("div"));
          this.overlayWrapper.setAttribute("class", "wrs_popupmessage_overlay_envolture");
          /**
       * HTMLElement to display the popup message, close button and cancel button.
       */ this.message = this.overlayWrapper.appendChild(document.createElement("div"));
          this.message.id = "wrs_popupmessage";
          this.message.setAttribute("class", "wrs_popupmessage_panel");
          this.message.setAttribute("role", "dialog");
          this.message.setAttribute("aria-describedby", "description_txt");
          const paragraph = document.createElement("p");
          const text = document.createTextNode(popupMessageAttributes.strings.message);
          paragraph.appendChild(text);
          paragraph.id = "description_txt";
          this.message.appendChild(paragraph);
          /**
       * HTML element overlaying the overlayElement.
       */ const overlay = this.overlayWrapper.appendChild(document.createElement("div"));
          overlay.setAttribute("class", "wrs_popupmessage_overlay");
          // We create a overlay that close popup message on click in there
          overlay.addEventListener("click", this.cancelAction.bind(this));
          /**
       * HTML element containing cancel and close buttons.
       */ this.buttonArea = this.message.appendChild(document.createElement("div"));
          this.buttonArea.setAttribute("class", "wrs_popupmessage_button_area");
          this.buttonArea.id = "wrs_popup_button_area";
          // Close button arguments.
          const buttonSubmitArguments = {
              class: "wrs_button_accept",
              innerHTML: popupMessageAttributes.strings.submitString,
              id: "wrs_popup_accept_button",
              // To identifiy the element in automated testing
              "data-testid": "mtcteditor-cd-close-button"
          };
          /**
       * Close button arguments.
       */ this.closeButton = this.createButton(buttonSubmitArguments, this.closeAction.bind(this));
          this.buttonArea.appendChild(this.closeButton);
          // Cancel button arguments.
          const buttonCancelArguments = {
              class: "wrs_button_cancel",
              innerHTML: popupMessageAttributes.strings.cancelString,
              id: "wrs_popup_cancel_button",
              // To identifiy the element in automated testing
              "data-testid": "mtcteditor-cd-cancel-button"
          };
          /**
       * Cancel button.
       */ this.cancelButton = this.createButton(buttonCancelArguments, this.cancelAction.bind(this));
          this.buttonArea.appendChild(this.cancelButton);
      }
      /**
     * This method create a button with arguments and return button dom object
     * @param {Object} parameters - An object containing id, class and innerHTML button text.
     * @param {String} parameters.id - Button id.
     * @param {String} parameters.class - Button class name.
     * @param {String} parameters.innerHTML - Button innerHTML text.
     * @param {Object} callback- Callback method to call on click event.
     * @returns {HTMLElement} HTML button.
     */ // eslint-disable-next-line class-methods-use-this
      createButton(parameters, callback) {
          let element = {};
          element = document.createElement("button");
          element.setAttribute("id", parameters.id);
          element.setAttribute("class", parameters.class);
          element.innerHTML = parameters.innerHTML;
          element.addEventListener("click", callback);
          if (parameters["data-testid"]) {
              element.setAttribute("data-testid", parameters["data-testid"]);
          }
          return element;
      }
      /**
     * Shows the popupmessage containing a message, and two buttons
     * to cancel the action or close the modal dialog.
     */ show() {
          if (this.overlayWrapper.style.display !== "block") {
              // Clear focus with blur for prevent press any key.
              document.activeElement.blur();
              this.overlayWrapper.style.display = "block";
              this.closeButton.focus();
          } else {
              this.overlayWrapper.style.display = "none";
          // _wrs_modalWindow.focus(); This throws an error of not existing _wrs_modalWindow
          }
      }
      /**
     * This method cancels the popupMessage: the dialog disappears revealing the overlaid element.
     * A callback method is called (if defined). For example a method to focus the overlaid element.
     */ cancelAction() {
          this.overlayWrapper.style.display = "none";
          if (typeof this.callbacks.cancelCallback !== "undefined") {
              this.callbacks.cancelCallback();
          // Set temporal image to null to prevent loading
          // an existent formula when starting one from scratch. Make focus come back too.
          // IntegrationModel.setActionsOnCancelButtons();
          }
      }
      /**
     * This method closes the popupMessage: the dialog disappears and the close callback is called.
     * For example to close the overlaid element.
     */ closeAction() {
          this.cancelAction();
          if (typeof this.callbacks.closeCallback !== "undefined") {
              this.callbacks.closeCallback();
          }
          IntegrationModel.setActionsOnCancelButtons();
      }
      /**
     * Handle keyboard events detected in modal when elements of this class intervene.
     * @param {KeyboardEvent} keyboardEvent - The keyboard event.
     */ onKeyDown(keyboardEvent) {
          if (keyboardEvent.key !== undefined) {
              // Code to detect Esc event.
              if (keyboardEvent.key === "Escape" || keyboardEvent.key === "Esc") {
                  this.cancelAction();
                  keyboardEvent.stopPropagation();
                  keyboardEvent.preventDefault();
              } else if (keyboardEvent.key === "Tab") {
                  // Code to detect Tab event.
                  if (document.activeElement === this.closeButton) {
                      this.cancelButton.focus();
                  } else {
                      this.closeButton.focus();
                  }
                  keyboardEvent.stopPropagation();
                  keyboardEvent.preventDefault();
              }
          }
      }
  }

  var closeIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.76 13.76\"\n   height=\"13.76\"\n   width=\"13.76\"\n   id=\"svg3783\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata3789\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3787\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image3791\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAACXBIWXMAAC4jAAAuIwF4pT92AAAB\nvklEQVRYw83Z23GDMBAF0AsNhBIowSVQgjuISnAJKSEdZNOBS6CDOBUkqSC4gs2PyGhAQg92se4M\n4w8bccYW2hVumBmRdAB6ADfopQcw2SOYNoIkAL8APgB8AzgLI0/2S/iy1xkt3B9m9h0dM9/YHxM4\nJ/c4MfPkGX+y763OyYVKgUPQTXAJdC84Bg2CS6Gl4FSoF7wHmgvOhbrgzsW+8L4YJegccrEj749R\ngs7ZXGdz8wbAeNbREcDTzrHvblEgBbAUFACuy6JALJeL0E/P9sbvmBnNojcgAM+oJ58AhrlnWM5Z\nA+C9RmiokakBvIJuNTLSc7hojqY0Mo8EB6Ep2CPBm9BU7BHgKDQHqwlOguZiNcDJ0JLe4FV4iaLY\nJjF16dLqnoob+EdDs8A1QJPBtUCTwDVBo+DaoJvgNvBIR6rDl9wirbA1QIPgVgl6VwHb+dAr7Jkk\nS/Pg3mCkVOslxxV9yBFqSqTA/3N2Utkzye3pftw5OxzQ5tHeddcdzGj3o4VgClUwowgtAVOs3BpF\naA6YUnsDowhNAVNu12UUoVtgCn2+ifxp1wO42Ner4KPR5dJ2tsse2ZLvTQxbVf4AmC2z7WnSvpIA\nAAAASUVORK5CYII=\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.76\" />\n</svg>\n";

  var closeHoverIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.76 13.76\"\n   height=\"13.76\"\n   width=\"13.76\"\n   id=\"svg2\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata8\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs6\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image10\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAACXBIWXMAAC4jAAAuIwF4pT92AAAB\n2ElEQVRYw9XZoXPCMBTH8S+5KfDzQ29606CH3/SmQTO96aGHHn/F0Himh8eDZSblQknSJH2F0DtE\nQw8+12vyfulr7XY7LuW4qvj+DugD18AC+AE2woa+/mz07y9cF7Y8d7YPDEtjK2AsCB4BvdLYHPi0\nXawioAA3wAfQaQiKHhuFYl1QSbAL6gWrSKgEuArqBKsEaB1wKNQKVsasHybcpRhwLNQED0zsoMbz\nFwJOhWL6Cmzd2e0D14Wi1/k9di2wFNnAEtBifd9jv4GtIPgaeBOCAkzLFayr/6idWSSY6DJ8sHT9\n6VK6zRFqKwo5gQ+grnKbA/gI6gsy5wRboT7sucBOaBX21GAvNAR7KnAlNBTbNDgIGoMtwO/C0Gko\nNBZbN525tk+dJrAj4F4YGxXgVQS019DkCgarM0OjwCoDaDBYZQINAquMoJVglRnUC1YZQp1g1RB0\nJryn65jYJ0HoRGPHguDX8hsZ6VAiGX4eUrJBbHqSArdN7LLBmCcBnpvYWfHWo6E8Wge8Ar7Kj8E4\nARwcnBPBB20BE7uJBMdAU8BH/YvyBAsFp0BjwNZGi201qALXgYaAnR0hX2upAzwDj/p8raFL5I4u\n8ALc6vNfvc+ztq5al9Rh/AfwZZ/LmlMllAAAAABJRU5ErkJggg==\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.76\" />\n</svg>\n";

  var fullsIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.76 13.76\"\n   height=\"13.76\"\n   width=\"13.76\"\n   id=\"svg3793\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata3799\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3797\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image3801\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAAAXNSR0IArs4c6QAAAARnQU1BAACx\njwv8YQUAAAAJcEhZcwAALiMAAC4jAXilP3YAAAG4SURBVFhHvZnhUYNAEEbRBkwH2oGUkA40FWgJ\nKSEdaAmxA0vQDmIHKSFWgPuAHZkEAnd8y5v5kuNHMm+WY1mSm6qqCiGlZdUspXzxopY9Wu6bpZQf\nSxlRWapwVx9p2dy2CxUHy9ryWx9pKdWyECYcIQshwlGyIBeOlAWpcLQsyISXkAWEX5tlPkvJwnP7\nns1SsnvLS7PMZwlZiShEy8pEIVJWKgpRsnJRiJBNFf2wbCzjfZgRUZi9JYWDxT9bWk6WIXbKym4t\nKRVloObO5oze6ZClWX9a5jyOcOrfmuUkXPRUH/1zVRhZpvsnCxN+jnDqHh0SdQaFu9vg0ZIqrBZ1\neoXP92yKcJSocyHcd4FNEY4WdbrCR1rGrukMF9BWVhZvLZ7U9rS2nH9HVvoq63iFu+RUlOpIuCYL\nCCPIqVjq1A9j5R3aBnMY2kKzMlbZHPQVbVHLhomCUjZUFFSy35ZQUVDIMo+Gi4JCltFwERSy75Y5\n4+VkFLLcKHLHyyRUF1jOeJmMShbChZWy0Df8yFDLgg8/cpCN6I9cdHJhZHmy7X2anAnCtDUZ/j/Y\ng2X2j709MHhTDAFF8QdK9SRpUl2yFgAAAABJRU5ErkJggg==\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.76\" />\n</svg>\n";

  var fullsHoverIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.76 13.76\"\n   height=\"13.76\"\n   width=\"13.76\"\n   id=\"svg12\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata18\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs16\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image20\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAAAXNSR0IArs4c6QAAAARnQU1BAACx\njwv8YQUAAAAJcEhZcwAALiMAAC4jAXilP3YAAAGMSURBVFhHvdk7TsNAFIVhQ0l6elLDJqCGngXQ\nU7MA6rALahZATQ81C6APrXP/jEaKHD/i8TnzS1eaICF/2I4f4qxt20bYOmaVlrK2Mb8s1Nj3mIu0\nlPYZszlPa1kvMf9pKe02Zq3Gcrhc4JUaSzawA0sWsAtLcrATS1KwG0sycA0sAd6kZXm1sNzVHtOy\nvBpYoK8xV/tPC3JjZVByYqVQcmHlUHJgLVBSY0ugPP7xO5PXYSW2FMr19ytm8sahxD7ElEBzk3c6\nsFysn/afymKPvsXMueh3oblRMNibmPuYZ34wsyWHfqhB8OFpwKvDHLADmusFd8/ZU8FOaO4I3PcF\nmwLXgOYOwVtexdnwdUy3vg2UQPnD2eji+vZsrruHS/eoBEpjWMpgrhi1Dv1gY6fBkuRQmtqzJVmg\npMbaoKTEWqGkwtqhpMBWgZICWwVKCuwpzxKSFNi5T2vFqb5gVcAqLNnBSixZwWos2cBg/9JSmgUM\n9iMt5QFe8tZ8VP6n3WXMHQtxPzHfabm0ptkBwWhpthzMp7YAAAAASUVORK5CYII=\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.76\" />\n</svg>\n";

  var minIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.76 13.76\"\n   height=\"13.76\"\n   width=\"13.76\"\n   id=\"svg3813\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata3819\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3817\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image3821\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAACXBIWXMAAC4jAAAuIwF4pT92AAAA\nnUlEQVRYw+3Z0QnCMBSF4T/FATqCG1g3cISO0NE6iiPoCE5gneD40ohPvgkJ/AcC9/EjHELgliT0\nkoGOIlasWLFixYoVK1asWLFixYoVK1bsjxy+5hlYgLEx47ofSEKSJW1nTUJJMgLPDlpwHoCpk8rO\nvgZixf4Zu3Vi3cq+WroBp4ahL+BYa3AB7o1CH7vvc7M1U4N/g2sdSk8bxjfDaMNdr+hmAQAAAABJ\nRU5ErkJggg==\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.76\" />\n</svg>\n";

  var minHoverIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.76 13.76\"\n   height=\"13.76\"\n   width=\"13.76\"\n   id=\"svg32\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata38\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs36\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image40\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAACXBIWXMAAC4jAAAuIwF4pT92AAAA\npklEQVRYw+3ZLQ4CMRCG4bcbFOvXg99T7FG4BafAw1VALx7dWyy2mIoGgSOZJu/n6p70ZybppFIK\nvWSgo4gVK1asWLFixYoVK1asWLFixYoV+yO7r/UMHIAxiO8FZGBrsUfgDEwBN/QNXIA11S/PW1Bo\nCz4N9ein4Nd1Dyw9PbDR0iVW7J+xudax6HkOtZVdg0MfQE7N0G4GlmANYgNW4A6QepowfgDMXB26\nb1V6LAAAAABJRU5ErkJggg==\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.76\" />\n</svg>\n";

  var minsIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.76 13.76\"\n   height=\"13.76\"\n   width=\"13.76\"\n   id=\"svg3823\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata3829\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3827\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image3831\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAAAXNSR0IArs4c6QAAAARnQU1BAACx\njwv8YQUAAAAJcEhZcwAALiMAAC4jAXilP3YAAAHOSURBVFhH1ZiLUcMwEEQNDcQl0AEuISVABZhO\nUkroICVAB6ECoINQgdmVfR5FlmQrkZzjzezEzsc8NPqcdNd1XfVfuB9ec3NAmv4yiRo5ImzBlm+c\nwZYtEHJCGsT3eSgHxKZFxs/tL+aMkCK8R3yMwu4PcsVmiXBIVDDCvh/miEtMeE5UaEsNMJcN8o64\ng26PvPSXs9S+/zRHQtgtvLRFCb9blZpnYw/9Rb6RR3M3zxtiprFbyKYwipK1+uwlnIkSrbITUaJR\n1itKtMkGRYk2WRZAQbTNBpzWtggrrwnaWja00hk0DrCgsEZZ4hXWKksmwjLAHobkgOv+V3+ZhXHQ\niWxKqXYLKNyILDdqbPKlldASPhA+Mxc7uwatkSOSix1iP//q2APshLBvfJo7hbizgQj/mDtl+KYu\nCj8h7NSqCM2zXJvZwqqEY4uCOuGYLKEwJ3kVzMlyscg5915FTFbdqhaSVbn8+mTV1gmurOqCxpZN\nEeUu9BlZd1obioTkQ7IhPGTjYZuPIoUMK/GUFrX39asuHJTlH3w1d3FCBxCrCUufZX+NCUdPSsAq\nwu4A8wnPiQrFhW1Z4govFRWKCoeOjzjoZF92CdwpZy6AquoPvJRHJxB8bJ8AAAAASUVORK5CYII=\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.76\" />\n</svg>\n";

  var minsHoverIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.76 13.76\"\n   height=\"13.76\"\n   width=\"13.76\"\n   id=\"svg42\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata48\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs46\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image50\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAAAXNSR0IArs4c6QAAAARnQU1BAACx\njwv8YQUAAAAJcEhZcwAALiMAAC4jAXilP3YAAAG/SURBVFhH1ZgxUsMwEEUNJRyAGmp6qKGn5xRQ\nQ08NNfRQQw11DpAaanIAWrMv8WaELSlexhLLm/mRnImiF48jr7zVtm3zX9ju2ik5llxLdpdHNg4k\nT5I7yWB8Cdl9yZHkRmIRRpQxOxK+YzC+hKwSnTBBKKoMxpeUBSbkksgRE1V+CJeWhUPJ5ao7ICeq\nrIVryMKJpC88RlTZk1SThVDYIvoluZIsSqyz511SfEg4UxbRdw5qnlmFa9AsCn8hO4aBKHiUjYqC\nN9mkKHiSzYqCJ9lPSVIUPMmySqTudEu8XbOxO90ab7KQFPYoC1Fhr7IwENbagMLCUtXnoCTM1QZW\n3iS3dFT2mRfHvEjuVfZUckFnQh67dgqo1GYqC1MLn3XtZIR/sFcJW2C39FcD18KxpcutcGqddSmc\nuykg/LDq+iAnC/OudUFOVrfLbkjJWvb11YjJuhSFvqxbUQhlXYuCylpE2YXy2SkLlVEgaxVluzyT\nIEutWQ1kKZYtouF2maK4mjCyFN6bJsw9gKgmrNdsbsKNT0qEKsIqC7EJx4gqxYVDWQgntIgqRYXD\nbY3CLpcVgmdPC974BYy3/MgRNM03hR9ubFTHT48AAAAASUVORK5CYII=\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.76\" />\n</svg>\n";

  var maxIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.44 13.76\"\n   height=\"13.76\"\n   width=\"13.44\"\n   id=\"svg3803\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata3809\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3807\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image3811\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAArCAYAAAAOnxr+AAAACXBIWXMAAC4jAAAuIwF4pT92AAAA\nvElEQVRYw+3ZSw0CMRSF4b8T9iAFB4wDkDAWcICEkTA4GAeAA3AADurgsCkbAgsSMrmFczZNd1/a\n3vSVJFFDGipJNdBZaRdAB2wC2TIwAgNAkrQEjsA86GBegDZJGoF18JnfJtVR9idXvaGGGmrod/b6\nV9kD14k9LbD6FDqUM8CU2b2Deo0aaqihhhpqqKGGGhr1hH/wiP469FaBMzflEhc9PZKQ1CtmsqRO\nEunpHbeNNN3A+dFJ/mf6V+gduGPIoUgKLbAAAAAASUVORK5CYII=\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.44\" />\n</svg>\n";

  var maxHoverIcon = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n   viewBox=\"0 0 13.44 13.76\"\n   height=\"13.76\"\n   width=\"13.44\"\n   id=\"svg22\"\n   version=\"1.1\">\n  <metadata\n     id=\"metadata28\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs26\" />\n  <image\n     y=\"0\"\n     x=\"0\"\n     id=\"image30\"\n     xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAArCAYAAAAOnxr+AAAACXBIWXMAAC4jAAAuIwF4pT92AAAA\nvUlEQVRYw+3ZsQ3CMBCF4d8WFekZgBqWIDUDZACmYBQWYIn0pGYAegZIexROERHRIBTdhXeVy08+\nyT4/JzMjQmWCVBjoarSugK0z3/0degKODjeyBy5Am8ysARrnnT8nM7sCa+fQLgdAAlQ6ngQVVFBB\nfzeUTK6t8VAwU328ztV6QQUVVFBBBRVUUEG9Ds41sJvZs/8GelDrlw7tAjhvmZLo9o6RD4bEGUp+\nX1My/I0T4HN4rrcASf9M/wp9ASNzIKYYz2hAAAAAAElFTkSuQmCC\n\"\n     style=\"image-rendering:optimizeQuality\"\n     preserveAspectRatio=\"none\"\n     height=\"13.76\"\n     width=\"13.44\" />\n</svg>\n";

  // eslint-disable-next-line max-classes-per-file
  /**
   * @typedef {Object} DeviceProperties
   * @property {String} DeviceProperties.orientation - Indicates of the orientation of the device.
   * @property {Boolean} DeviceProperties.isAndroid - True if the device is Android. False otherwise.
   * @property {Boolean} DeviceProperties.isIOS - True if the device is iOS. False otherwise.
   * @property {Boolean} DeviceProperties.isMobile - True if the device is a mobile one.
   * False otherwise.
   * @property {Boolean} DeviceProperties.isDesktop - True if the device is a desktop one.
   * False otherwise.
   */ class ModalDialog {
      /**
     * @classdesc
     * This class represents a modal dialog. The modal dialog admits
     * a {@link ContentManager} instance to manage the content of the dialog.
     * @constructs
     * @param {Object} modalDialogAttributes  - An object containing all modal dialog attributes.
     */ constructor(modalDialogAttributes){
          this.attributes = modalDialogAttributes;
          // Metrics.
          const ua = navigator.userAgent.toLowerCase();
          const isAndroid = ua.indexOf("android") > -1;
          const isIOS = ContentManager.isIOS();
          this.iosSoftkeyboardOpened = false;
          this.iosMeasureUnit = ua.indexOf("crios") === -1 ? "%" : "vh";
          this.iosDivHeight = `auto`;
          const deviceWidth = window.outerWidth;
          const deviceHeight = window.outerHeight;
          const landscape = deviceWidth > deviceHeight;
          const portrait = deviceWidth < deviceHeight;
          // TODO: Detect isMobile without using editor metrics.
          landscape && this.attributes.height > deviceHeight;
          portrait && this.attributes.width > deviceWidth;
          const isMobile = ContentManager.isMobile();
          // Obtain number of current instance.
          this.instanceId = document.getElementsByClassName("wrs_modal_dialogContainer").length;
          // Device object properties.
          /**
       * @type {DeviceProperties}
       */ this.deviceProperties = {
              orientation: landscape ? "landscape" : "portrait",
              isAndroid,
              isIOS,
              isMobile,
              isDesktop: !isMobile && !isIOS && !isAndroid
          };
          this.properties = {
              created: false,
              state: "",
              previousState: "",
              position: {
                  bottom: 0,
                  right: 10
              },
              size: {
                  height: 338,
                  width: 580
              }
          };
          /**
       * Object to keep website's style before change it on lock scroll for mobile devices.
       * @type {Object}
       * @property {String} bodyStylePosition - Previous body style position.
       * @property {String} bodyStyleOverflow - Previous body style overflow.
       * @property {String} htmlStyleOverflow - Previous body style overflow.
       * @property {String} windowScrollX - Previous window's scroll Y.
       * @property {String} windowScrollY - Previous window's scroll X.
       */ this.websiteBeforeLockParameters = null;
          let attributes = {};
          attributes.class = "wrs_modal_overlay";
          attributes.id = this.getElementId(attributes.class);
          this.overlay = Util.createElement("div", attributes);
          attributes = {};
          attributes.class = "wrs_modal_title_bar";
          attributes.id = this.getElementId(attributes.class);
          this.titleBar = Util.createElement("div", attributes);
          attributes = {};
          attributes.class = "wrs_modal_title";
          attributes.id = this.getElementId(attributes.class);
          this.title = Util.createElement("div", attributes);
          this.title.innerHTML = "offline";
          attributes = {};
          attributes.class = "wrs_modal_close_button";
          attributes.id = this.getElementId(attributes.class);
          attributes.title = StringManager.get("close");
          attributes.style = {};
          this.closeDiv = Util.createElement("a", attributes);
          this.closeDiv.setAttribute("role", "button");
          this.closeDiv.setAttribute("tabindex", 3);
          // Apply styles and events after the creation as createElement doesn't process them correctly
          let generalStyle = `background-size: 10px; background-image: url(data:image/svg+xml;base64,${window.btoa(closeIcon)})`;
          let hoverStyle = `background-size: 10px; background-image: url(data:image/svg+xml;base64,${window.btoa(closeHoverIcon)})`;
          this.closeDiv.setAttribute("style", generalStyle);
          this.closeDiv.setAttribute("onmouseover", `this.style = "${hoverStyle}";`);
          this.closeDiv.setAttribute("onmouseout", `this.style = "${generalStyle}";`);
          // To identifiy the element in automated testing
          this.closeDiv.setAttribute("data-testid", "mtcteditor-close-button");
          attributes = {};
          attributes.class = "wrs_modal_stack_button";
          attributes.id = this.getElementId(attributes.class);
          attributes.title = StringManager.get("exit_fullscreen");
          this.stackDiv = Util.createElement("a", attributes);
          this.stackDiv.setAttribute("role", "button");
          this.stackDiv.setAttribute("tabindex", 2);
          generalStyle = `background-size: 10px; background-image: url(data:image/svg+xml;base64,${window.btoa(minsIcon)})`;
          hoverStyle = `background-size: 10px; background-image: url(data:image/svg+xml;base64,${window.btoa(minsHoverIcon)})`;
          this.stackDiv.setAttribute("style", generalStyle);
          this.stackDiv.setAttribute("onmouseover", `this.style = "${hoverStyle}";`);
          this.stackDiv.setAttribute("onmouseout", `this.style = "${generalStyle}";`);
          // To identifiy the element in automated testing
          this.stackDiv.setAttribute("data-testid", "mtcteditor-fullscreen-disable-button");
          attributes = {};
          attributes.class = "wrs_modal_maximize_button";
          attributes.id = this.getElementId(attributes.class);
          attributes.title = StringManager.get("fullscreen");
          this.maximizeDiv = Util.createElement("a", attributes);
          this.maximizeDiv.setAttribute("role", "button");
          this.maximizeDiv.setAttribute("tabindex", 2);
          generalStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(fullsIcon)})`;
          hoverStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(fullsHoverIcon)})`;
          this.maximizeDiv.setAttribute("style", generalStyle);
          this.maximizeDiv.setAttribute("onmouseover", `this.style = "${hoverStyle}";`);
          this.maximizeDiv.setAttribute("onmouseout", `this.style = "${generalStyle}";`);
          // To identifiy the element in automated testing
          this.maximizeDiv.setAttribute("data-testid", "mtcteditor-fullscreen-enable-button");
          attributes = {};
          attributes.class = "wrs_modal_minimize_button";
          attributes.id = this.getElementId(attributes.class);
          attributes.title = StringManager.get("minimize");
          this.minimizeDiv = Util.createElement("a", attributes);
          this.minimizeDiv.setAttribute("role", "button");
          this.minimizeDiv.setAttribute("tabindex", 1);
          generalStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(minIcon)})`;
          hoverStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(minHoverIcon)})`;
          this.minimizeDiv.setAttribute("style", generalStyle);
          this.minimizeDiv.setAttribute("onmouseover", `this.style = "${hoverStyle}";`);
          this.minimizeDiv.setAttribute("onmouseout", `this.style = "${generalStyle}";`);
          // To identify the element in automated testing
          this.minimizeDiv.setAttribute("data-testid", "mtcteditor-minimize-button");
          attributes = {};
          attributes.class = "wrs_modal_dialogContainer";
          attributes.id = this.getElementId(attributes.class);
          attributes.role = "dialog";
          this.container = Util.createElement("div", attributes);
          this.container.setAttribute("aria-labeledby", "wrs_modal_title[0]");
          attributes = {};
          attributes.class = "wrs_modal_wrapper";
          attributes.id = this.getElementId(attributes.class);
          this.wrapper = Util.createElement("div", attributes);
          attributes = {};
          attributes.class = "wrs_content_container";
          attributes.id = this.getElementId(attributes.class);
          this.contentContainer = Util.createElement("div", attributes);
          attributes = {};
          attributes.class = "wrs_modal_controls";
          attributes.id = this.getElementId(attributes.class);
          this.controls = Util.createElement("div", attributes);
          attributes = {};
          attributes.class = "wrs_modal_buttons_container";
          attributes.id = this.getElementId(attributes.class);
          this.buttonContainer = Util.createElement("div", attributes);
          // Buttons: all button must be created using createSubmitButton method.
          this.submitButton = this.createSubmitButton({
              id: this.getElementId("wrs_modal_button_accept"),
              class: "wrs_modal_button_accept",
              innerHTML: StringManager.get("accept"),
              // To identifiy the element in automated testing
              "data-testid": "mtcteditor-insert-button"
          }, this.submitAction.bind(this));
          this.cancelButton = this.createSubmitButton({
              id: this.getElementId("wrs_modal_button_cancel"),
              class: "wrs_modal_button_cancel",
              innerHTML: StringManager.get("cancel"),
              // To identifiy the element in automated testing
              "data-testid": "mtcteditor-cancel-button"
          }, this.cancelAction.bind(this));
          this.contentManager = null;
          // Overlay popup.
          const popupStrings = {
              cancelString: StringManager.get("cancel"),
              submitString: StringManager.get("close"),
              message: StringManager.get("close_modal_warning")
          };
          const callbacks = {
              closeCallback: ()=>{
                  this.close("mtc_close");
              },
              cancelCallback: ()=>{
                  this.focus();
              }
          };
          const popupupProperties = {
              overlayElement: this.container,
              callbacks,
              strings: popupStrings
          };
          this.popup = new PopUpMessage(popupupProperties);
          /**
       * Indicates if directionality of the modal dialog is RTL. false by default.
       * @type {Boolean}
       */ this.rtl = false;
          if ("rtl" in this.attributes) {
              this.rtl = this.attributes.rtl;
          }
          // Event handlers need modal instance context.
          this.handleOpenedIosSoftkeyboard = this.handleOpenedIosSoftkeyboard.bind(this);
          this.handleClosedIosSoftkeyboard = this.handleClosedIosSoftkeyboard.bind(this);
      }
      /**
     * This method sets an ContentManager instance to ModalDialog. ContentManager
     * manages the logic of ModalDialog content: submit, update, close and changes.
     * @param {ContentManager} contentManager - ContentManager instance.
     */ setContentManager(contentManager) {
          this.contentManager = contentManager;
      }
      /**
     * Returns the modal contentElement object.
     * @returns {ContentManager} the instance of the ContentManager class.
     */ getContentManager() {
          return this.contentManager;
      }
      /**
     * This method is called when the modal object has been submitted. Calls
     * contentElement submitAction method - if exists - and closes the modal
     * object. No logic about the content should be placed here,
     * contentElement.submitAction is the responsible of the content logic.
     */ async submitAction() {
          if (typeof this.contentManager.submitAction !== "undefined") {
              this.contentManager.submitAction();
          }
          await this.close("mtc_insert");
      }
      /**
     * Performs the cancel action.
     * If there are no changes in the content, it closes the modal.
     * Otherwise, it shows a pop-up message to confirm the cancel action.
     * @returns {Promise<void>} - A promise that resolves when the modal is closed.
     */ async cancelAction() {
          if (typeof this.contentManager.hasChanges === "undefined" || !this.contentManager.hasChanges()) {
              IntegrationModel.setActionsOnCancelButtons();
              await this.close("mtc_close");
          } else {
              this.showPopUpMessage();
          }
      }
      /**
     * Returns a button element.
     * @param {Object} properties - Input button properties.
     * @param {String} properties.class - Input button class.
     * @param {String} properties.innerHTML - Input button innerHTML.
     * @param {Object} callback - Callback function associated to click event.
     * @returns {HTMLButtonElement} The button element.
     *
     */ // eslint-disable-next-line class-methods-use-this
      createSubmitButton(properties, callback) {
          class SubmitButton {
              constructor(){
                  this.element = document.createElement("button");
                  this.element.id = properties.id;
                  this.element.className = properties.class;
                  this.element.innerHTML = properties.innerHTML;
                  this.element.dataset.testid = properties["data-testid"];
                  Util.addEvent(this.element, "click", callback);
              }
              getElement() {
                  return this.element;
              }
          }
          return new SubmitButton(properties, callback).getElement();
      }
      /**
     * Creates the modal window object inserting a contentElement object.
     */ create() {
          /* Modal Window Structure
      _____________________________________________________________________________________
      |wrs_modal_dialog_Container                                                         |
      | _________________________________________________________________________________ |
      | |title_bar                          minimize_button  stack_button  close_button | |
      | |_______________________________________________________________________________| |
      | |wrapper                                                                        | |
      | | _____________________________________________________________________________ | |
      | | |content                                                                    | | |
      | | |                                                                           | | |
      | | |                                                                           | | |
      | | |___________________________________________________________________________| | |
      | | _____________________________________________________________________________ | |
      | | |controls                                                                   | | |
      | | | ___________________________________                                       | | |
      | | | |buttonContainer                  |                                       | | |
      | | | | _______________________________ |                                       | | |
      | | | | |button_accept | button_cancel| |                                       | | |
      | | | |_|_____________ |______________|_|                                       | | |
      | | |___________________________________________________________________________| | |
      | |_______________________________________________________________________________| |
      |___________________________________________________________________________________| */ this.titleBar.appendChild(this.closeDiv);
          this.titleBar.appendChild(this.stackDiv);
          this.titleBar.appendChild(this.maximizeDiv);
          this.titleBar.appendChild(this.minimizeDiv);
          this.titleBar.appendChild(this.title);
          if (this.deviceProperties.isDesktop) {
              this.container.appendChild(this.titleBar);
          }
          this.wrapper.appendChild(this.contentContainer);
          this.wrapper.appendChild(this.controls);
          this.controls.appendChild(this.buttonContainer);
          this.buttonContainer.appendChild(this.submitButton);
          this.buttonContainer.appendChild(this.cancelButton);
          this.container.appendChild(this.wrapper);
          // Check if browser has scrollBar before modal has modified.
          this.recalculateScrollBar();
          document.body.appendChild(this.container);
          document.body.appendChild(this.overlay);
          if (this.deviceProperties.isDesktop) {
              // Desktop.
              this.createModalWindowDesktop();
              this.createResizeButtons();
              this.addListeners();
              // Maximize window only when the configuration is set and the device is not iOS or Android.
              if (Configuration.get("modalWindowFullScreen")) {
                  this.maximize();
              }
          } else if (this.deviceProperties.isAndroid) {
              this.createModalWindowAndroid();
          } else if (this.deviceProperties.isIOS) {
              this.createModalWindowIos();
          }
          if (this.contentManager != null) {
              this.contentManager.insert(this);
          }
          this.properties.open = true;
          this.properties.created = true;
          // Checks language directionality.
          if (this.isRTL()) {
              this.container.style.right = `${window.innerWidth - this.scrollbarWidth - this.container.offsetWidth}px`;
              this.container.className += " wrs_modal_rtl";
          }
      }
      /**
     * Creates a button in the modal object to resize it.
     */ createResizeButtons() {
          // This is a definition of Resize Button Bottom-Right.
          this.resizerBR = document.createElement("div");
          this.resizerBR.className = "wrs_bottom_right_resizer";
          this.resizerBR.innerHTML = "◢";
          // To identifiy the element in automated testing
          this.resizerBR.dataset.testid = "mtcteditor-resize-button-right";
          // This is a definition of Resize Button Top-Left.
          this.resizerTL = document.createElement("div");
          this.resizerTL.className = "wrs_bottom_left_resizer";
          // To identifiy the element in automated testing
          this.resizerTL.dataset.testid = "mtcteditor-resize-button-left";
          // Append resize buttons to modal.
          this.container.appendChild(this.resizerBR);
          this.titleBar.appendChild(this.resizerTL);
          // Add events to resize on click and drag.
          Util.addEvent(this.resizerBR, "mousedown", this.activateResizeStateBR.bind(this));
          Util.addEvent(this.resizerTL, "mousedown", this.activateResizeStateTL.bind(this));
      }
      /**
     * Initialize variables for Bottom-Right resize button
     * @param {MouseEvent} mouseEvent - Mouse event.
     */ activateResizeStateBR(mouseEvent) {
          this.initializeResizeProperties(mouseEvent, false);
      }
      /**
     * Initialize variables for Top-Left resize button
     * @param {MouseEvent} mouseEvent - Mouse event.
     */ activateResizeStateTL(mouseEvent) {
          this.initializeResizeProperties(mouseEvent, true);
      }
      /**
     * Common method to initialize variables at resize.
     * @param {MouseEvent} mouseEvent - Mouse event.
     */ initializeResizeProperties(mouseEvent, leftOption) {
          // Apply class for disable involuntary select text when drag.
          Util.addClass(document.body, "wrs_noselect");
          Util.addClass(this.overlay, "wrs_overlay_active");
          this.resizeDataObject = {
              x: this.eventClient(mouseEvent).X,
              y: this.eventClient(mouseEvent).Y
          };
          // Save Initial state of modal to compare on drag and obtain the difference.
          this.initialWidth = parseInt(this.container.style.width, 10);
          this.initialHeight = parseInt(this.container.style.height, 10);
          if (!leftOption) {
              this.initialRight = parseInt(this.container.style.right, 10);
              this.initialBottom = parseInt(this.container.style.bottom, 10);
          } else {
              this.leftScale = true;
          }
          if (!this.initialRight) {
              this.initialRight = 0;
          }
          if (!this.initialBottom) {
              this.initialBottom = 0;
          }
          // Disable mouse events on editor when we start to drag modal.
          document.body.style["user-select"] = "none";
      }
      /**
     * This method opens the modal window, restoring the previous state, position and metrics,
     * if exists. By default the modal object opens in stack mode.
     */ open() {
          // Removing close class.
          this.removeClass("wrs_closed");
          // Hiding keyboard for mobile devices.
          const { isIOS } = this.deviceProperties;
          const { isAndroid } = this.deviceProperties;
          const { isMobile } = this.deviceProperties;
          if (isIOS || isAndroid || isMobile) {
              // Restore scale to 1.
              this.restoreWebsiteScale();
              this.lockWebsiteScroll();
              // Due to editor wait we need to wait until editor focus.
              setTimeout(()=>{
                  this.hideKeyboard();
              }, 400);
          }
          // New modal window. He need to create the whole object.
          if (!this.properties.created) {
              this.create();
          } else {
              // Previous state closed. Open method can be called even the previous state is open,
              // for example updating the content of the modal object.
              if (!this.properties.open) {
                  this.properties.open = true;
                  // Restoring the previous open state: if the modal object has been closed
                  // re-open it should preserve the state and the metrics.
                  if (!this.deviceProperties.isAndroid && !this.deviceProperties.isIOS) {
                      this.restoreState();
                  }
              }
              // Maximize window only when the configuration is set and the device is not iOs or Android.
              if (this.deviceProperties.isDesktop && Configuration.get("modalWindowFullScreen")) {
                  this.maximize();
              }
              // In iOS we need to recalculate the size of the modal object because
              // iOS keyboard is a float div which can overlay the modal object.
              if (this.deviceProperties.isIOS) {
                  this.iosSoftkeyboardOpened = false;
              }
          }
          if (!ContentManager.isEditorLoaded()) {
              const listener = Listeners.newListener("onLoad", ()=>{
                  this.contentManager.onOpen(this);
              });
              this.contentManager.addListener(listener);
          } else {
              this.contentManager.onOpen(this);
          }
      }
      /**
     * Closes the modal.
     * Removes specific CSS classes, saves modal properties, unlocks website scroll,
     * sets the 'open' property to false, and triggers the 'onModalClose' event.
     * If a close trigger is defined, it tracks the telemetry event 'CLOSED_MTCT_EDITOR' with the trigger.
     * @returns {Promise<void>} A promise that resolves when the modal is closed.
     */ async close(trigger) {
          this.removeClass("wrs_maximized");
          this.removeClass("wrs_minimized");
          this.removeClass("wrs_stack");
          this.addClass("wrs_closed");
          this.saveModalProperties();
          this.unlockWebsiteScroll();
          this.properties.open = false;
          if (trigger) {
              try {
                  await Telemeter.telemeter.track("CLOSED_MTCT_EDITOR", {
                      toolbar: this.contentManager.toolbar,
                      trigger: trigger
                  });
              } catch (error) {
                  console.error("Error tracking CLOSED_MTCT_EDITOR", error);
              }
          }
          Core.globalListeners.fire("onModalClose", {});
      }
      /**
     * Closes modal window and destroys the object.
     */ destroy() {
          // Close modal window.
          this.close();
          // Remove listeners and destroy the object.
          this.removeListeners();
          this.overlay.remove();
          this.container.remove();
          // Reset properties to allow open again.
          this.properties.created = false;
      }
      /**
     * Sets the website scale to one.
     */ // eslint-disable-next-line class-methods-use-this
      restoreWebsiteScale() {
          let viewportmeta = document.querySelector("meta[name=viewport]");
          // Let the equal symbols in order to search and make meta's final content.
          const contentAttrsToUpdate = [
              "initial-scale=",
              "minimum-scale=",
              "maximum-scale="
          ];
          const contentAttrsValuesToUpdate = [
              "1.0",
              "1.0",
              "1.0"
          ];
          const setMetaAttrFunc = (viewportelement, contentAttrs)=>{
              const contentAttr = viewportelement.getAttribute("content");
              // If it exists, we need to maintain old values and put our values.
              if (contentAttr) {
                  const attrArray = contentAttr.split(",");
                  let finalContentMeta = "";
                  const oldAttrs = [];
                  for(let i = 0; i < attrArray.length; i += 1){
                      let isAttrToUpdate = false;
                      let j = 0;
                      while(!isAttrToUpdate && j < contentAttrs.length){
                          if (attrArray[i].indexOf(contentAttrs[j])) {
                              isAttrToUpdate = true;
                          }
                          j += 1;
                      }
                      if (!isAttrToUpdate) {
                          oldAttrs.push(attrArray[i]);
                      }
                  }
                  for(let i = 0; i < contentAttrs.length; i += 1){
                      const attr = contentAttrs[i] + contentAttrsValuesToUpdate[i];
                      finalContentMeta += i === 0 ? attr : `,${attr}`;
                  }
                  for(let i = 0; i < oldAttrs.length; i += 1){
                      finalContentMeta += `,${oldAttrs[i]}`;
                  }
                  viewportelement.setAttribute("content", finalContentMeta);
                  // It needs to set to empty because setAttribute refresh only when attribute is different.
                  viewportelement.setAttribute("content", "");
                  viewportelement.setAttribute("content", contentAttr);
              } else {
                  viewportelement.setAttribute("content", "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
                  viewportelement.removeAttribute("content");
              }
          };
          if (!viewportmeta) {
              viewportmeta = document.createElement("meta");
              document.getElementsByTagName("head")[0].appendChild(viewportmeta);
              setMetaAttrFunc(viewportmeta, contentAttrsToUpdate);
              viewportmeta.remove();
          } else {
              setMetaAttrFunc(viewportmeta, contentAttrsToUpdate);
          }
      }
      /**
     * Locks website scroll for mobile devices.
     */ lockWebsiteScroll() {
          this.websiteBeforeLockParameters = {
              bodyStylePosition: document.body.style.position ? document.body.style.position : "",
              bodyStyleOverflow: document.body.style.overflow ? document.body.style.overflow : "",
              htmlStyleOverflow: document.documentElement.style.overflow ? document.documentElement.style.overflow : "",
              windowScrollX: window.scrollX,
              windowScrollY: window.scrollY
          };
      }
      /**
     * Unlocks website scroll for mobile devices.
     */ unlockWebsiteScroll() {
          if (this.websiteBeforeLockParameters) {
              document.body.style.position = this.websiteBeforeLockParameters.bodyStylePosition;
              document.body.style.overflow = this.websiteBeforeLockParameters.bodyStyleOverflow;
              document.documentElement.style.overflow = this.websiteBeforeLockParameters.htmlStyleOverflow;
              const { windowScrollX } = this.websiteBeforeLockParameters;
              const { windowScrollY } = this.websiteBeforeLockParameters;
              window.scrollTo(windowScrollX, windowScrollY);
              this.websiteBeforeLockParameters = null;
          }
      }
      /**
     * Util function to known if browser is IE11.
     * @returns {Boolean} true if the browser is IE11. false otherwise.
     */ // eslint-disable-next-line class-methods-use-this
      isIE11() {
          if (navigator.userAgent.search("Msie/") >= 0 || navigator.userAgent.search("Trident/") >= 0 || navigator.userAgent.search("Edge/") >= 0) {
              return true;
          }
          return false;
      }
      /**
     * Returns if the current language type is RTL.
     * @return {Boolean} true if current language is RTL. false otherwise.
     */ isRTL() {
          if (this.attributes.language === "ar" || this.attributes.language === "he") {
              return true;
          }
          return this.rtl;
      }
      /**
     * Adds a class to all modal ModalDialog DOM elements.
     * @param {String} className - Class name.
     */ addClass(className) {
          Util.addClass(this.overlay, className);
          Util.addClass(this.titleBar, className);
          Util.addClass(this.overlay, className);
          Util.addClass(this.container, className);
          Util.addClass(this.contentContainer, className);
          Util.addClass(this.stackDiv, className);
          Util.addClass(this.minimizeDiv, className);
          Util.addClass(this.maximizeDiv, className);
          Util.addClass(this.wrapper, className);
      }
      /**
     * Remove a class from all modal DOM elements.
     * @param {String} className - Class name.
     */ removeClass(className) {
          Util.removeClass(this.overlay, className);
          Util.removeClass(this.titleBar, className);
          Util.removeClass(this.overlay, className);
          Util.removeClass(this.container, className);
          Util.removeClass(this.contentContainer, className);
          Util.removeClass(this.stackDiv, className);
          Util.removeClass(this.minimizeDiv, className);
          Util.removeClass(this.maximizeDiv, className);
          Util.removeClass(this.wrapper, className);
      }
      /**
     * Create modal dialog for desktop.
     */ createModalWindowDesktop() {
          this.addClass("wrs_modal_desktop");
          this.stack();
      }
      /**
     * Create modal dialog for non android devices.
     */ createModalWindowAndroid() {
          this.addClass("wrs_modal_android");
          window.addEventListener("resize", this.orientationChangeAndroidSoftkeyboard.bind(this));
      }
      /**
     * Create modal dialog for iOS devices.
     */ createModalWindowIos() {
          this.addClass("wrs_modal_ios");
          // Refresh the size when the orientation is changed.
          window.addEventListener("resize", this.orientationChangeIosSoftkeyboard.bind(this));
      }
      /**
     * Restore previous state, position and size of previous stacked modal dialog.
     */ restoreState() {
          if (this.properties.state === "maximized") {
              // Reset states for prevent return to stack state.
              this.maximize();
          } else if (this.properties.state === "minimized") {
              // Reset states for prevent return to stack state.
              this.properties.state = this.properties.previousState;
              this.properties.previousState = "";
              this.minimize();
          } else {
              this.stack();
          }
      }
      /**
     * Stacks the modal object.
     */ stack() {
          this.properties.previousState = this.properties.state;
          this.properties.state = "stack";
          this.removeClass("wrs_maximized");
          this.minimizeDiv.title = StringManager.get("minimize");
          this.removeClass("wrs_minimized");
          this.addClass("wrs_stack");
          // Change maximize/minimize icon to minimize icon
          const generalStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(minIcon)})`;
          const hoverStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(minHoverIcon)})`;
          this.minimizeDiv.setAttribute("style", generalStyle);
          this.minimizeDiv.setAttribute("onmouseover", `this.style = "${hoverStyle}";`);
          this.minimizeDiv.setAttribute("onmouseout", `this.style = "${generalStyle}";`);
          this.restoreModalProperties();
          if (typeof this.resizerBR !== "undefined" && typeof this.resizerTL !== "undefined") {
              this.setResizeButtonsVisibility();
          }
          // Need recalculate position of actual modal because window can was changed in fullscreenmode.
          this.recalculateScrollBar();
          this.recalculatePosition();
          this.recalculateScale();
          this.focus();
      }
      /**
     * Minimizes the modal object.
     */ minimize() {
          // Saving width, height, top and bottom parameters to restore when opening.
          this.saveModalProperties();
          this.title.style.cursor = "pointer";
          if (this.properties.state === "minimized" && this.properties.previousState === "stack") {
              this.stack();
          } else if (this.properties.state === "minimized" && this.properties.previousState === "maximized") {
              this.maximize();
          } else {
              // Setting css to prevent important tag into css style.
              this.container.style.height = "30px";
              this.container.style.width = "250px";
              this.container.style.bottom = "0px";
              this.container.style.right = "10px";
              this.removeListeners();
              this.properties.previousState = this.properties.state;
              this.properties.state = "minimized";
              this.setResizeButtonsVisibility();
              this.minimizeDiv.title = StringManager.get("maximize");
              if (Util.containsClass(this.overlay, "wrs_stack")) {
                  this.removeClass("wrs_stack");
              } else {
                  this.removeClass("wrs_maximized");
              }
              this.addClass("wrs_minimized");
              // Change minimize icon to maximize icon
              const generalStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(maxIcon)})`;
              const hoverStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(maxHoverIcon)})`;
              this.minimizeDiv.setAttribute("style", generalStyle);
              this.minimizeDiv.setAttribute("onmouseover", `this.style = "${hoverStyle}";`);
              this.minimizeDiv.setAttribute("onmouseout", `this.style = "${generalStyle}";`);
          }
      }
      /**
     * Maximizes the modal object.
     */ maximize() {
          // Saving width, height, top and bottom parameters to restore when opening.
          this.saveModalProperties();
          if (this.properties.state !== "maximized") {
              this.properties.previousState = this.properties.state;
              this.properties.state = "maximized";
          }
          // Don't permit resize on maximize mode.
          this.setResizeButtonsVisibility();
          if (Util.containsClass(this.overlay, "wrs_minimized")) {
              this.minimizeDiv.title = StringManager.get("minimize");
              this.removeClass("wrs_minimized");
          } else if (Util.containsClass(this.overlay, "wrs_stack")) {
              this.container.style.left = null;
              this.container.style.top = null;
              this.removeClass("wrs_stack");
          }
          this.addClass("wrs_maximized");
          // Change maximize icon to minimize icon
          const generalStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(minIcon)})`;
          const hoverStyle = `background-size: 10px; background-repeat: no-repeat; background-image: url(data:image/svg+xml;base64,${window.btoa(minHoverIcon)})`;
          this.minimizeDiv.setAttribute("style", generalStyle);
          this.minimizeDiv.setAttribute("onmouseover", `this.style = "${hoverStyle}";`);
          this.minimizeDiv.setAttribute("onmouseout", `this.style = "${generalStyle}";`);
          // Set size to 80% screen with a max size.
          this.setSize(parseInt(window.innerHeight * 0.8, 10), parseInt(window.innerWidth * 0.8, 10));
          if (this.container.clientHeight > 700) {
              this.container.style.height = "700px";
          }
          if (this.container.clientWidth > 1200) {
              this.container.style.width = "1200px";
          }
          // Setting modal position in center on screen.
          const { innerHeight } = window;
          const { innerWidth } = window;
          const { offsetHeight } = this.container;
          const { offsetWidth } = this.container;
          const bottom = innerHeight / 2 - offsetHeight / 2;
          const right = innerWidth / 2 - offsetWidth / 2;
          this.setPosition(bottom, right);
          this.recalculateScale();
          this.recalculatePosition();
          this.recalculateSize();
          this.focus();
      }
      /**
     * Expand again the modal object from a minimized state.
     */ reExpand() {
          if (this.properties.state === "minimized") {
              if (this.properties.previousState === "maximized") {
                  this.maximize();
              } else {
                  this.stack();
              }
              this.title.style.cursor = "";
          }
      }
      /**
     * Sets modal size.
     * @param {Number} height - Height of the ModalDialog
     * @param {Number} width - Width of the ModalDialog.
     */ setSize(height, width) {
          this.container.style.height = `${height}px`;
          this.container.style.width = `${width}px`;
          this.recalculateSize();
      }
      /**
     * Sets modal position using bottom and right style attributes.
     * @param  {number} bottom - bottom attribute.
     * @param  {number} right - right attribute.
     */ setPosition(bottom, right) {
          this.container.style.bottom = `${bottom}px`;
          this.container.style.right = `${right}px`;
      }
      /**
     * Saves position and size parameters of and open ModalDialog. This attributes
     * are needed to restore it on re-open.
     */ saveModalProperties() {
          // Saving values of modal only when modal is in stack state.
          if (this.properties.state === "stack") {
              this.properties.position.bottom = parseInt(this.container.style.bottom, 10);
              this.properties.position.right = parseInt(this.container.style.right, 10);
              this.properties.size.width = parseInt(this.container.style.width, 10);
              this.properties.size.height = parseInt(this.container.style.height, 10);
          }
      }
      /**
     * Restore ModalDialog position and size parameters.
     */ restoreModalProperties() {
          if (this.properties.state === "stack") {
              // Restoring Bottom and Right values from last modal.
              this.setPosition(this.properties.position.bottom, this.properties.position.right);
              // Restoring Height and Left values from last modal.
              this.setSize(this.properties.size.height, this.properties.size.width);
          }
      }
      /**
     * Sets the modal dialog initial size.
     */ recalculateSize() {
          this.contentContainer.style.height = `${parseInt(this.wrapper.offsetHeight - 50, 10)}px`;
      }
      /**
     * Enable or disable visibility of resize buttons in modal window depend on state.
     */ setResizeButtonsVisibility() {
          if (this.properties.state === "stack") {
              this.resizerTL.style.visibility = "visible";
              this.resizerBR.style.visibility = "visible";
          } else {
              this.resizerTL.style.visibility = "hidden";
              this.resizerBR.style.visibility = "hidden";
          }
      }
      /**
     * Makes an object draggable adding mouse and touch events.
     */ addListeners() {
          // Button events (maximize, minimize, stack and close).
          this.maximizeDiv.addEventListener("click", this.maximize.bind(this), true);
          this.stackDiv.addEventListener("click", this.stack.bind(this), true);
          this.minimizeDiv.addEventListener("click", this.minimize.bind(this), true);
          this.closeDiv.addEventListener("click", this.cancelAction.bind(this));
          this.maximizeDiv.addEventListener("keypress", function(e) {
              if (e.key === "Enter" || e.key === " " || e.keyCode === 13 || e.keyCode === 32) {
                  // Handle enter and space.
                  e.target.click();
              }
          }, true);
          this.stackDiv.addEventListener("keypress", function(e) {
              if (e.key === "Enter" || e.key === " " || e.keyCode === 13 || e.keyCode === 32) {
                  // Handle enter and space.
                  e.target.click();
                  e.preventDefault();
              }
          }, true);
          this.minimizeDiv.addEventListener("keypress", function(e) {
              if (e.key === "Enter" || e.key === " " || e.keyCode === 13 || e.keyCode === 32) {
                  // Handle enter and space.
                  e.target.click();
                  e.preventDefault();
              }
          }, true);
          this.closeDiv.addEventListener("keypress", function(e) {
              if (e.key === "Enter" || e.key === " " || e.keyCode === 13 || e.keyCode === 32) {
                  // Handle enter and space.
                  e.target.click();
                  e.preventDefault();
              }
          });
          this.title.addEventListener("click", this.reExpand.bind(this));
          // Overlay events (close).
          this.overlay.addEventListener("click", this.cancelAction.bind(this));
          // Mouse events.
          Util.addEvent(window, "mousedown", this.startDrag.bind(this));
          Util.addEvent(window, "mouseup", this.stopDrag.bind(this));
          Util.addEvent(window, "mousemove", this.drag.bind(this));
          Util.addEvent(window, "resize", this.onWindowResize.bind(this));
          // Key events.
          Util.addEvent(window, "keydown", this.onKeyDown.bind(this));
      }
      /**
     * Removes draggable events from an object.
     */ removeListeners() {
          // Mouse events.
          Util.removeEvent(window, "mousedown", this.startDrag);
          Util.removeEvent(window, "mouseup", this.stopDrag);
          Util.removeEvent(window, "mousemove", this.drag);
          Util.removeEvent(window, "resize", this.onWindowResize);
          // Key events.
          Util.removeEvent(window, "keydown", this.onKeyDown);
      }
      /**
     * Returns mouse or touch coordinates (on touch events ev.ClientX doesn't exists)
     * @param {MouseEvent} mouseEvent - Mouse event.
     * @return {Object} With the X and Y coordinates.
     */ // eslint-disable-next-line class-methods-use-this
      eventClient(mouseEvent) {
          if (typeof mouseEvent.clientX === "undefined" && mouseEvent.changedTouches) {
              const client = {
                  X: mouseEvent.changedTouches[0].clientX,
                  Y: mouseEvent.changedTouches[0].clientY
              };
              return client;
          }
          const client = {
              X: mouseEvent.clientX,
              Y: mouseEvent.clientY
          };
          return client;
      }
      /**
     * Start drag function: set the object dragDataObject with the draggable
     * object offsets coordinates.
     * when drag starts (on touchstart or mousedown events).
     * @param {MouseEvent} mouseEvent - Touchstart or mousedown event.
     */ startDrag(mouseEvent) {
          if (this.properties.state === "minimized") {
              return;
          }
          if (mouseEvent.target === this.title) {
              if (typeof this.dragDataObject === "undefined" || this.dragDataObject === null) {
                  // Save first click mouse point on screen.
                  this.dragDataObject = {
                      x: this.eventClient(mouseEvent).X,
                      y: this.eventClient(mouseEvent).Y
                  };
                  // Reset last drag position when start drag.
                  this.lastDrag = {
                      x: "0px",
                      y: "0px"
                  };
                  // Init right and bottom values for window modal if it isn't exist.
                  if (this.container.style.right === "") {
                      this.container.style.right = "0px";
                  }
                  if (this.container.style.bottom === "") {
                      this.container.style.bottom = "0px";
                  }
                  // Needed for IE11 for apply disabled mouse events on editor because
                  // internet explorer needs a dynamic object to apply this property.
                  if (this.isIE11()) ;
                  // Apply class for disable involuntary select text when drag.
                  Util.addClass(document.body, "wrs_noselect");
                  Util.addClass(this.overlay, "wrs_overlay_active");
                  // Obtain screen limits for prevent overflow.
                  this.limitWindow = this.getLimitWindow();
              }
          }
      }
      /**
     * Updates dragDataObject with the draggable object coordinates when
     * the draggable object is being moved.
     * @param {MouseEvent} mouseEvent - The mouse event.
     */ drag(mouseEvent) {
          if (this.dragDataObject) {
              mouseEvent.preventDefault();
              // Calculate max and min between actual mouse position and limit of screeen.
              // It restric the movement of modal into window.
              let limitY = Math.min(this.eventClient(mouseEvent).Y, this.limitWindow.minPointer.y);
              limitY = Math.max(this.limitWindow.maxPointer.y, limitY);
              let limitX = Math.min(this.eventClient(mouseEvent).X, this.limitWindow.minPointer.x);
              limitX = Math.max(this.limitWindow.maxPointer.x, limitX);
              // Subtract limit with first position to obtain relative pixels increment
              // to the anchor point.
              const dragX = `${limitX - this.dragDataObject.x}px`;
              const dragY = `${limitY - this.dragDataObject.y}px`;
              // Save last valid position of modal before window overflow.
              this.lastDrag = {
                  x: dragX,
                  y: dragY
              };
              // This move modal with hardware acceleration.
              this.container.style.transform = `translate3d(${dragX},${dragY},0)`;
          }
          if (this.resizeDataObject) {
              const { innerWidth } = window;
              const { innerHeight } = window;
              let limitX = Math.min(this.eventClient(mouseEvent).X, innerWidth - this.scrollbarWidth - 7);
              let limitY = Math.min(this.eventClient(mouseEvent).Y, innerHeight - 7);
              if (limitX < 0) {
                  limitX = 0;
              }
              if (limitY < 0) {
                  limitY = 0;
              }
              let scaleMultiplier;
              if (this.leftScale) {
                  scaleMultiplier = -1;
              } else {
                  scaleMultiplier = 1;
              }
              this.container.style.width = `${this.initialWidth + scaleMultiplier * (limitX - this.resizeDataObject.x)}px`;
              this.container.style.height = `${this.initialHeight + scaleMultiplier * (limitY - this.resizeDataObject.y)}px`;
              if (!this.leftScale) {
                  if (this.resizeDataObject.x - limitX - this.initialWidth < -580) {
                      this.container.style.right = `${this.initialRight - (limitX - this.resizeDataObject.x)}px`;
                  } else {
                      this.container.style.right = `${this.initialRight + this.initialWidth - 580}px`;
                      this.container.style.width = "580px";
                  }
                  if (this.resizeDataObject.y - limitY < this.initialHeight - 338) {
                      this.container.style.bottom = `${this.initialBottom - (limitY - this.resizeDataObject.y)}px`;
                  } else {
                      this.container.style.bottom = `${this.initialBottom + this.initialHeight - 338}px`;
                      this.container.style.height = "338px";
                  }
              }
              this.recalculateScale();
              this.recalculatePosition();
          }
      }
      /**
     * Returns the boundaries of actual window to limit modal movement.
     * @return {Object} Object containing mouseX and mouseY coordinates of actual mouse on screen.
     */ getLimitWindow() {
          // Obtain dimensions of window page.
          const maxWidth = window.innerWidth;
          const maxHeight = window.innerHeight;
          // Calculate relative position of mouse point into window.
          const { offsetHeight } = this.container;
          const contStyleBottom = parseInt(this.container.style.bottom, 10);
          const contStyleRight = parseInt(this.container.style.right, 10);
          const { pageXOffset } = window;
          const dragY = this.dragDataObject.y;
          const dragX = this.dragDataObject.x;
          const offSetToolbarY = offsetHeight + contStyleBottom - (maxHeight - (dragY - pageXOffset));
          const offSetToolbarX = maxWidth - this.scrollbarWidth - (dragX - pageXOffset) - contStyleRight;
          // Calculate limits with sizes of window, modal and mouse position.
          const minPointerY = maxHeight - this.container.offsetHeight + offSetToolbarY;
          const maxPointerY = this.title.offsetHeight - (this.title.offsetHeight - offSetToolbarY);
          const minPointerX = maxWidth - offSetToolbarX - this.scrollbarWidth;
          const maxPointerX = this.container.offsetWidth - offSetToolbarX;
          const minPointer = {
              x: minPointerX,
              y: minPointerY
          };
          const maxPointer = {
              x: maxPointerX,
              y: maxPointerY
          };
          return {
              minPointer,
              maxPointer
          };
      }
      /**
     * Returns the scrollbar width size of browser
     * @returns {Number} The scrollbar width.
     */ // eslint-disable-next-line class-methods-use-this
      getScrollBarWidth() {
          // Create a paragraph with full width of page.
          const inner = document.createElement("p");
          inner.style.width = "100%";
          inner.style.height = "200px";
          // Create a hidden div to compare sizes.
          const outer = document.createElement("div");
          outer.style.position = "absolute";
          outer.style.top = "0px";
          outer.style.left = "0px";
          outer.style.visibility = "hidden";
          outer.style.width = "200px";
          outer.style.height = "150px";
          outer.style.overflow = "hidden";
          outer.appendChild(inner);
          document.body.appendChild(outer);
          const widthOuter = inner.offsetWidth;
          // Change type overflow of paragraph for measure scrollbar.
          outer.style.overflow = "scroll";
          let widthInner = inner.offsetWidth;
          // If measure is the same, we compare with internal div.
          if (widthOuter === widthInner) {
              widthInner = outer.clientWidth;
          }
          document.body.removeChild(outer);
          return widthOuter - widthInner;
      }
      /**
     * Set the dragDataObject to null.
     */ stopDrag() {
          // Due to we have multiple events that call this function, we need only to execute
          // the next modifiers one time,
          // when the user stops to drag and dragDataObject is not null (the object to drag is attached).
          if (this.dragDataObject || this.resizeDataObject) {
              // If modal doesn't change, it's not necessary to set position with interpolation.
              this.container.style.transform = "";
              if (this.dragDataObject) {
                  this.container.style.right = `${parseInt(this.container.style.right, 10) - parseInt(this.lastDrag.x, 10)}px`;
                  this.container.style.bottom = `${parseInt(this.container.style.bottom, 10) - parseInt(this.lastDrag.y, 10)}px`;
              }
              // We make focus on editor after drag modal windows to prevent lose focus.
              this.focus();
              // Restore mouse events on iframe.
              // this.iframe.style['pointer-events'] = 'auto';
              document.body.style["user-select"] = "";
              // Restore static state of iframe if we use Internet Explorer.
              if (this.isIE11()) ;
              // Active text select event.
              Util.removeClass(document.body, "wrs_noselect");
              Util.removeClass(this.overlay, "wrs_overlay_active");
          }
          this.dragDataObject = null;
          this.resizeDataObject = null;
          this.initialWidth = null;
          this.leftScale = null;
      }
      /**
     * Recalculates scale for modal when resize browser window.
     */ onWindowResize() {
          this.recalculateScrollBar();
          this.recalculatePosition();
          this.recalculateScale();
      }
      /**
     * Triggers keyboard events:
     * - Tab key tab to go to submit button.
     * - Esc key to close the modal dialog.
     * @param {KeyboardEvent} keyboardEvent - The keyboard event.
     */ onKeyDown(keyboardEvent) {
          if (keyboardEvent.key !== undefined) {
              // Popupmessage is not oppened.
              if (this.popup.overlayWrapper.style.display !== "block") {
                  // Code to detect Esc event
                  if (keyboardEvent.key === "Escape" || keyboardEvent.key === "Esc") {
                      if (this.properties.open) {
                          this.contentManager.onKeyDown(keyboardEvent);
                      }
                  } else if (keyboardEvent.shiftKey && keyboardEvent.key === "Tab") {
                      // Code to detect shift Tab event.
                      if (document.activeElement === this.cancelButton) {
                          this.submitButton.focus();
                          keyboardEvent.stopPropagation();
                          keyboardEvent.preventDefault();
                      } else {
                          this.contentManager.onKeyDown(keyboardEvent);
                      }
                  } else if (keyboardEvent.key === "Tab") {
                      // Code to detect Tab event.
                      if (document.activeElement === this.submitButton) {
                          this.cancelButton.focus();
                          keyboardEvent.stopPropagation();
                          keyboardEvent.preventDefault();
                      } else {
                          this.contentManager.onKeyDown(keyboardEvent);
                      }
                  }
              } else {
                  // Popupmessage oppened.
                  this.popup.onKeyDown(keyboardEvent);
              }
          }
      }
      /**
     * Recalculating position for modal dialog when the browser is resized.
     */ recalculatePosition() {
          this.container.style.right = `${Math.min(parseInt(this.container.style.right, 10), window.innerWidth - this.scrollbarWidth - this.container.offsetWidth)}px`;
          if (parseInt(this.container.style.right, 10) < 0) {
              this.container.style.right = "0px";
          }
          this.container.style.bottom = `${Math.min(parseInt(this.container.style.bottom, 10), window.innerHeight - this.container.offsetHeight)}px`;
          if (parseInt(this.container.style.bottom, 10) < 0) {
              this.container.style.bottom = "0px";
          }
      }
      /**
     * Recalculating scale for modal when the browser is resized.
     */ recalculateScale() {
          let sizeModified = false;
          if (parseInt(this.container.style.width, 10) > 580) {
              this.container.style.width = `${Math.min(parseInt(this.container.style.width, 10), window.innerWidth - this.scrollbarWidth)}px`;
              sizeModified = true;
          } else {
              this.container.style.width = "580px";
              sizeModified = true;
          }
          if (parseInt(this.container.style.height, 10) > 338) {
              this.container.style.height = `${Math.min(parseInt(this.container.style.height, 10), window.innerHeight)}px`;
              sizeModified = true;
          } else {
              this.container.style.height = "338px";
              sizeModified = true;
          }
          if (sizeModified) {
              this.recalculateSize();
          }
      }
      /**
     * Recalculating width of browser scroll bar.
     */ recalculateScrollBar() {
          this.hasScrollBar = window.innerWidth > document.documentElement.clientWidth;
          if (this.hasScrollBar) {
              this.scrollbarWidth = this.getScrollBarWidth();
          } else {
              this.scrollbarWidth = 0;
          }
      }
      /**
     * Hide soft keyboards on iOS devices.
     */ // eslint-disable-next-line class-methods-use-this
      hideKeyboard() {
          // iOS keyboard can't be detected or hide directly from JavaScript.
          // So, this method simulates that user focus a text input and blur
          // the selection.
          const inputField = document.createElement("input");
          this.container.appendChild(inputField);
          inputField.focus();
          inputField.blur();
          // Is removed to not see it.
          inputField.remove();
      }
      /**
     * Focus to contentManager object.
     */ focus() {
          if (this.contentManager != null && typeof this.contentManager.onFocus !== "undefined") {
              this.contentManager.onFocus();
          }
      }
      /**
     * Returns true when the device is on portrait mode.
     */ // eslint-disable-next-line class-methods-use-this
      portraitMode() {
          return window.innerHeight > window.innerWidth;
      }
      /**
     * Event handler that change container size when IOS soft keyboard is opened.
     */ handleOpenedIosSoftkeyboard() {
          if (!this.iosSoftkeyboardOpened && this.iosDivHeight != null && this.iosDivHeight === `auto`) {
              if (this.portraitMode()) {
                  this.setContainerHeight(`60${this.iosMeasureUnit}`);
              } else {
                  this.setContainerHeight(`35${this.iosMeasureUnit}`);
              }
          }
          this.iosSoftkeyboardOpened = true;
          this.wrapper.style.flexGrow = "1";
      }
      /**
     * Event handler that change container size when IOS soft keyboard is closed.
     */ handleClosedIosSoftkeyboard() {
          this.iosSoftkeyboardOpened = false;
          this.wrapper.style.flexGrow = "1";
      }
      /**
     * Change container sizes when orientation is changed on iOS.
     */ orientationChangeIosSoftkeyboard() {
          if (this.iosSoftkeyboardOpened) {
              if (this.portraitMode()) {
                  this.setContainerHeight(`65${this.iosMeasureUnit}`);
              } else {
                  this.setContainerHeight(`45${this.iosMeasureUnit}`);
              }
          } else {
              this.wrapper.style.flexGrow = "1";
          }
      }
      /**
     * Change container sizes when orientation is changed on Android.
     */ orientationChangeAndroidSoftkeyboard() {
          this.wrapper.style.flexGrow = "1";
      }
      /**
     * Set iframe container height.
     * @param {Number} height - New height.
     */ setContainerHeight(height) {
          this.iosDivHeight = height;
          this.wrapper.style.height = height;
      }
      /**
     * Check content of editor before close action.
     */ showPopUpMessage() {
          if (this.properties.state === "minimized") {
              this.stack();
          }
          this.popup.show();
      }
      /**
     * Sets the title of the modal dialog.
     * @param {String} title - Modal dialog title.
     */ setTitle(title) {
          this.title.innerHTML = title;
      }
      /**
     * Returns the id of an element, adding the instance number to
     * the element class name:
     * className --> className[idNumber]
     * @param {String} className - The element class name.
     * @returns {String} A string appending the instance id to the className.
     */ getElementId(className) {
          return `${className}[${this.instanceId}]`;
      }
  }

  // Polyfills.
  /*! http://mths.be/codepointat v0.1.0 by @mathias */ if (!String.prototype.codePointAt) {
      (function() {
          var codePointAt = function(position) {
              if (this == null) {
                  throw TypeError();
              }
              var string = String(this);
              var size = string.length;
              // `ToInteger`
              var index = position ? Number(position) : 0;
              if (index != index) {
                  // better `isNaN`
                  index = 0;
              }
              // Account for out-of-bounds indices:
              if (index < 0 || index >= size) {
                  return undefined;
              }
              // Get the first code unit
              var first = string.charCodeAt(index);
              var second;
              if (// check if it’s the start of a surrogate pair
              first >= 0xd800 && first <= 0xdbff && // high surrogate
              size > index + 1 // there is a next code unit
              ) {
                  second = string.charCodeAt(index + 1);
                  if (second >= 0xdc00 && second <= 0xdfff) {
                      // low surrogate
                      // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                      return (first - 0xd800) * 0x400 + second - 0xdc00 + 0x10000;
                  }
              }
              return first;
          };
          if (Object.defineProperty) {
              Object.defineProperty(String.prototype, "codePointAt", {
                  value: codePointAt,
                  configurable: true,
                  writable: true
              });
          } else {
              String.prototype.codePointAt = codePointAt;
          }
      })();
  }
  // Object.assign polyfill.
  if (typeof Object.assign != "function") {
      // Must be writable: true, enumerable: false, configurable: true
      Object.defineProperty(Object, "assign", {
          value: function assign(target, varArgs) {
              if (target == null) {
                  // TypeError if undefined or null
                  throw new TypeError("Cannot convert undefined or null to object");
              }
              var to = Object(target);
              for(var index = 1; index < arguments.length; index++){
                  var nextSource = arguments[index];
                  if (nextSource != null) {
                      // Skip over if undefined or null
                      for(var nextKey in nextSource){
                          // Avoid bugs when hasOwnProperty is shadowed
                          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                              to[nextKey] = nextSource[nextKey];
                          }
                      }
                  }
              }
              return to;
          },
          writable: true,
          configurable: true
      });
  }
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  if (!Array.prototype.includes) {
      Object.defineProperty(Array.prototype, "includes", {
          value: function(searchElement, fromIndex) {
              if (this == null) {
                  throw new TypeError('"this" s null or is not defined');
              }
              // 1. Let O be ? ToObject(this value).
              var o = Object(this);
              // 2. Let len be ? ToLength(? Get(O, "length")).
              var len = o.length >>> 0;
              // 3. if len is 0, return false.
              if (len === 0) {
                  return false;
              }
              // 4. Let n be ? ToInteger(fromIndex).
              //    (if fromIndex is undefinedo, this step generates the value 0.)
              var n = fromIndex | 0;
              // 5. if n ≥ 0, then
              //  a. Let k be n.
              // 6. Else n < 0,
              //  a. Let k be len + n.
              //  b. if k < 0, let k be 0.
              var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
              function sameValueZero(x, y) {
                  return x === y || typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y);
              }
              // 7. Repeat while k < len
              while(k < len){
                  // a. let element k be the result of ? Get(O, ! ToString(k)).
                  // b. if SameValueZero(searchElement, elementK) is true, return true.
                  if (sameValueZero(o[k], searchElement)) {
                      return true;
                  }
                  // c. Increase k by 1.
                  k++;
              }
              // 8. Return false
              return false;
          }
      });
  }
  if (!String.prototype.includes) {
      String.prototype.includes = function(search, start) {
          if (search instanceof RegExp) {
              throw TypeError("first argument must not be a RegExp");
          }
          if (start === undefined) {
              start = 0;
          }
          return this.indexOf(search, start) !== -1;
      };
  }
  if (!String.prototype.startsWith) {
      Object.defineProperty(String.prototype, "startsWith", {
          value: function(search, rawPos) {
              var pos = rawPos > 0 ? rawPos | 0 : 0;
              return this.substring(pos, pos + search.length) === search;
          }
      });
  }

  /**
   * @typedef {Object} CoreProperties
   * @property {ServiceProviderProperties} serviceProviderProperties
   * - The ServiceProvider class properties. *
   */ class Core {
      /**
     * @classdesc
     * This class represents MathType integration Core, managing the following:
     * - Integration initialization.
     * - Event managing.
     * - Insertion of formulas into the edit area.
     * ```js
     *       let core = new Core();
     *       core.addListener(listener);
     *       core.language = 'en';
     *
     *       // Initializing Core class.
     *       core.init(configurationService);
     * ```
     * @constructs
     * Core constructor.
     * @param {CoreProperties}
     */ constructor(coreProperties){
          /**
       * Language. Needed for accessibility and locales. 'en' by default.
       * @type {String}
       */ this.language = "en";
          /**
       * Edit mode, 'images' by default. Admits the following values:
       * - images
       * - latex
       * @type {String}
       */ this.editMode = "images";
          /**
       * Modal dialog instance.
       * @type {ModalDialog}
       */ this.modalDialog = null;
          /**
       * The instance of {@link CustomEditors}. By default
       * the only custom editor is the Chemistry editor.
       * @type {CustomEditors}
       */ this.customEditors = new CustomEditors();
          /**
       * Chemistry editor.
       * @type {CustomEditor}
       */ const chemEditorParams = {
              name: "Chemistry",
              toolbar: "chemistry",
              icon: "chem.png",
              confVariable: "chemEnabled",
              title: "ChemType",
              tooltip: "Insert a chemistry formula - ChemType"
          };
          this.customEditors.addEditor("chemistry", chemEditorParams);
          /**
       * Environment properties. This object contains data about the integration platform.
       * @typedef IntegrationEnvironment
       * @property {String} IntegrationEnvironment.editor - Editor name. For example the HTML editor.
       * @property {String} IntegrationEnvironment.mode - Integration save mode.
       * @property {String} IntegrationEnvironment.version - Integration version.
       *
       */ /**
       * The environment properties object.
       * @type {IntegrationEnvironment}
       */ this.environment = {};
          /**
       * @typedef EditionProperties
       * @property {Boolean} editionProperties.isNewElement - True if the formula is a new one.
       * False otherwise.
       * @property {HTMLImageElement} editionProperties.temporalImage- The image element.
       * Null if the formula is new.
       * @property {Range} editionProperties.latexRange - Tha range that contains the LaTeX formula.
       * @property {Range} editionProperties.range - The range that contains the image element.
       * @property {String} editionProperties.editMode - The edition mode. 'images' by default.
       */ /**
       * The properties of the current edition process.
       * @type {EditionProperties}
       */ this.editionProperties = {};
          this.editionProperties.isNewElement = true;
          this.editionProperties.temporalImage = null;
          this.editionProperties.latexRange = null;
          this.editionProperties.range = null;
          this.editionProperties.editionStartTime = null;
          /**
       * The {@link IntegrationModel} instance.
       * @type {IntegrationModel}
       */ this.integrationModel = null;
          /**
       * The {@link ContentManager} instance.
       * @type {ContentManager}
       */ this.contentManager = null;
          /**
       * The current browser.
       * @type {String}
       */ this.browser = (()=>{
              const ua = navigator.userAgent;
              let browser = "none";
              if (ua.search("Edge/") >= 0) {
                  browser = "EDGE";
              } else if (ua.search("Chrome/") >= 0) {
                  browser = "CHROME";
              } else if (ua.search("Trident/") >= 0) {
                  browser = "IE";
              } else if (ua.search("Firefox/") >= 0) {
                  browser = "FIREFOX";
              } else if (ua.search("Safari/") >= 0) {
                  browser = "SAFARI";
              }
              return browser;
          })();
          /**
       * Plugin listeners.
       * @type {Array.<Object>}
       */ this.listeners = new Listeners();
          /**
       * Service provider properties.
       * @type {ServiceProviderProperties}
       */ this.serviceProviderProperties = {};
          if ("serviceProviderProperties" in coreProperties) {
              this.serviceProviderProperties = coreProperties.serviceProviderProperties;
          } else {
              throw new Error("serviceProviderProperties property missing.");
          }
      }
      /**
     * Static property.
     * Core listeners.
     * @private
     * @type {Listeners}
     */ static get globalListeners() {
          return Core._globalListeners;
      }
      /**
     * Static property setter.
     * Set core listeners.
     * @param {Listeners} value - The property value.
     * @ignore
     */ static set globalListeners(value) {
          Core._globalListeners = value;
      }
      /**
     * Core state. Says if it was loaded previously.
     * True when Core.init was called. Otherwise, false.
     * @private
     * @type {Boolean}
     */ static get initialized() {
          return Core._initialized;
      }
      /**
     * Core state. Says if it was loaded previously.
     * @param {Boolean} value - True to say that Core.init was called. Otherwise, false.
     * @ignore
     */ static set initialized(value) {
          Core._initialized = value;
      }
      /**
     * Sets the {@link Core.integrationModel} property.
     * @param {IntegrationModel} integrationModel - The {@link IntegrationModel} property.
     */ setIntegrationModel(integrationModel) {
          this.integrationModel = integrationModel;
      }
      /**
     * Sets the {@link Core.environment} property.
     * @param {IntegrationEnvironment} integrationEnvironment -
     * The {@link IntegrationEnvironment} object.
     */ setEnvironment(integrationEnvironment) {
          if ("editor" in integrationEnvironment) {
              this.environment.editor = integrationEnvironment.editor;
          }
          if ("mode" in integrationEnvironment) {
              this.environment.mode = integrationEnvironment.mode;
          }
          if ("version" in integrationEnvironment) {
              this.environment.version = integrationEnvironment.version;
          }
      }
      /**
     * Sets the custom headers added on editor requests if contentManager isn't undefined.
     * @returns {Object} headers - key value headers.
     */ setHeaders(headers) {
          const headerObject = this?.contentManager?.setCustomHeaders(headers) || headers;
          Configuration.set("customHeaders", headerObject);
      }
      /**
     * Returns the current {@link ModalDialog} instance.
     * @returns {ModalDialog} The current {@link ModalDialog} instance.
     */ getModalDialog() {
          return this.modalDialog;
      }
      /**
     * Inits the {@link Core} class, doing the following:
     * - Calls asynchronously configuration service, retrieving the backend configuration in a JSON.
     * - Updates {@link Configuration} class with the previous configuration properties.
     * - Updates the {@link ServiceProvider} class using the configuration service path as reference.
     * - Loads language strings.
     * - Fires onLoad event.
     * @param {Object} serviceParameters - Service parameters.
     */ init() {
          if (!Core.initialized) {
              const serviceProviderListener = Listeners.newListener("onInit", ()=>{
                  const jsConfiguration = ServiceProvider.getService("configurationjs", "", "get");
                  const jsonConfiguration = JSON.parse(jsConfiguration);
                  Configuration.addConfiguration(jsonConfiguration);
                  // Adding JavaScript (not backend) configuration variables.
                  Configuration.addConfiguration(jsProperties);
                  // Fire 'onLoad' event:
                  // All integration must listen this event in order to know if the plugin
                  // has been properly loaded.
                  StringManager.language = this.language;
                  this.listeners.fire("onLoad", {});
              });
              ServiceProvider.addListener(serviceProviderListener);
              ServiceProvider.init(this.serviceProviderProperties);
              Core.initialized = true;
          } else {
              // Case when there are more than two editor instances.
              // After the first editor all the other editors don't need to load any file or service.
              this.listeners.fire("onLoad", {});
          }
      }
      /**
     * Adds a {@link Listener} to the current instance of the {@link Core} class.
     * @param {Listener} listener - The listener object.
     */ addListener(listener) {
          this.listeners.add(listener);
      }
      /**
     * Adds the global {@link Listener} instance to {@link Core} class.
     * @param {Listener} listener - The event listener to be added.
     * @static
     */ static addGlobalListener(listener) {
          Core.globalListeners.add(listener);
      }
      beforeUpdateFormula(mathml, wirisProperties) {
          /**
       * This event is fired before updating the formula.
       * @type {Object}
       * @property {String} mathml - MathML to be transformed.
       * @property {String} editMode - Edit mode.
       * @property {Object} wirisProperties - Extra attributes for the formula.
       * @property {String} language - Formula language.
       */ const beforeUpdateEvent = new Event();
          beforeUpdateEvent.mathml = mathml;
          // Cloning wirisProperties object
          // We don't want wirisProperties object modified.
          beforeUpdateEvent.wirisProperties = {};
          if (wirisProperties != null) {
              Object.keys(wirisProperties).forEach((attr)=>{
                  beforeUpdateEvent.wirisProperties[attr] = wirisProperties[attr];
              });
          }
          // Read only.
          beforeUpdateEvent.language = this.language;
          beforeUpdateEvent.editMode = this.editMode;
          if (this.listeners.fire("onBeforeFormulaInsertion", beforeUpdateEvent)) {
              return {};
          }
          if (Core.globalListeners.fire("onBeforeFormulaInsertion", beforeUpdateEvent)) {
              return {};
          }
          return {
              mathml: beforeUpdateEvent.mathml,
              wirisProperties: beforeUpdateEvent.wirisProperties
          };
      }
      /**
     * Converts a MathML into it's correspondent image and inserts the image is
     * inserted in a HTMLElement target by creating
     * a new image or updating an existing one.
     * @param {HTMLElement} focusElement - The HTMLElement to be focused after the insertion.
     * @param {Window} windowTarget - The window element where the editable content is.
     * @param {String} mathml - The MathML.
     * @param {Array.<Object>} wirisProperties - The extra attributes for the formula.
     * @returns {ReturnObject} - Object with the information of the node or latex to insert.
     */ insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
          /**
       * It is the object with the information of the node or latex to insert.
       * @typedef ReturnObject
       * @property {Node} [node] - The DOM node to insert.
       * @property {String} [latex] - The latex to insert.
       */ const returnObject = {};
          if (!mathml) {
              this.insertElementOnSelection(null, focusElement, windowTarget);
          } else if (this.editMode === "latex") {
              returnObject.latex = Latex.getLatexFromMathML(mathml);
              // this.integrationModel.getNonLatexNode is an integration wrapper
              // to have special behaviours for nonLatex.
              // Not all the integrations have special behaviours for nonLatex.
              if (!!this.integrationModel.fillNonLatexNode && !returnObject.latex) {
                  const afterUpdateEvent = new Event();
                  afterUpdateEvent.editMode = this.editMode;
                  afterUpdateEvent.windowTarget = windowTarget;
                  afterUpdateEvent.focusElement = focusElement;
                  afterUpdateEvent.latex = returnObject.latex;
                  this.integrationModel.fillNonLatexNode(afterUpdateEvent, windowTarget, mathml);
              } else {
                  returnObject.node = windowTarget.document.createTextNode(`$$${returnObject.latex}$$`);
              }
              this.insertElementOnSelection(returnObject.node, focusElement, windowTarget);
          } else {
              returnObject.node = Parser.mathmlToImgObject(windowTarget.document, mathml, wirisProperties, this.language);
              this.insertElementOnSelection(returnObject.node, focusElement, windowTarget);
          }
          return returnObject;
      }
      afterUpdateFormula(focusElement, windowTarget, node, latex) {
          /**
       * This event is fired after update the formula.
       * @type {Event}
       * @param {String} editMode - edit mode.
       * @param {Object} windowTarget - target window.
       * @param {Object} focusElement - target element to be focused after update.
       * @param {String} latex - LaTeX generated by the formula (editMode=latex).
       * @param {Object} node - node generated after update the formula (text if LaTeX img otherwise).
       */ const afterUpdateEvent = new Event();
          afterUpdateEvent.editMode = this.editMode;
          afterUpdateEvent.windowTarget = windowTarget;
          afterUpdateEvent.focusElement = focusElement;
          afterUpdateEvent.node = node;
          afterUpdateEvent.latex = latex;
          if (this.listeners.fire("onAfterFormulaInsertion", afterUpdateEvent)) {
              return {};
          }
          if (Core.globalListeners.fire("onAfterFormulaInsertion", afterUpdateEvent)) {
              return {};
          }
          return {};
      }
      /**
     * Sets the caret after a given Node and set the focus to the owner document.
     * @param {Node} node - The Node element.
     */ placeCaretAfterNode(node) {
          if (node === null) return;
          this.integrationModel.getSelection();
          const nodeDocument = node.ownerDocument;
          if (typeof nodeDocument.getSelection !== "undefined" && !!node.parentElement) {
              const range = nodeDocument.createRange();
              range.setStartAfter(node);
              range.collapse(true);
              const selection = nodeDocument.getSelection();
              selection.removeAllRanges();
              selection.addRange(range);
              nodeDocument.body.focus();
          }
      }
      /**
     * Replaces a Selection object with an HTMLElement.
     * @param {HTMLElement} element - The HTMLElement to replace the selection.
     * @param {HTMLElement} focusElement - The HTMLElement to be focused after the replace.
     * @param {Window} windowTarget - The window target.
     */ insertElementOnSelection(element, focusElement, windowTarget) {
          let mathmlOrigin = null;
          if (this.editionProperties.isNewElement) {
              if (element) {
                  if (focusElement.type === "textarea") {
                      Util.updateTextArea(focusElement, element.textContent);
                  } else if (document.selection && document.getSelection === 0) {
                      let range = windowTarget.document.selection.createRange();
                      windowTarget.document.execCommand("InsertImage", false, element.src);
                      if (!("parentElement" in range)) {
                          windowTarget.document.execCommand("delete", false);
                          range = windowTarget.document.selection.createRange();
                          windowTarget.document.execCommand("InsertImage", false, element.src);
                      }
                      if ("parentElement" in range) {
                          const temporalObject = range.parentElement();
                          if (temporalObject.nodeName.toUpperCase() === "IMG") {
                              temporalObject.parentNode.replaceChild(element, temporalObject);
                          } else {
                              // IE9 fix: parentNode() does not return the IMG node,
                              // returns the parent DIV node. In IE < 9, pasteHTML does not work well.
                              range.pasteHTML(Util.createObjectCode(element));
                          }
                      }
                  } else {
                      let range = null;
                      // In IE is needed keep the range due to after focus the modal window
                      // it can't be retrieved the last selection.
                      if (this.editionProperties.range) {
                          ({ range } = this.editionProperties);
                          this.editionProperties.range = null;
                      } else {
                          const editorSelection = this.integrationModel.getSelection();
                          range = editorSelection.getRangeAt(0);
                      }
                      // Delete if something was surrounded.
                      range.deleteContents();
                      let node = range.startContainer;
                      const position = range.startOffset;
                      if (node.nodeType === 3) {
                          // TEXT_NODE.
                          node = node.splitText(position);
                          node.parentNode.insertBefore(element, node);
                      } else if (node.nodeType === 1) {
                          // ELEMENT_NODE.
                          node.insertBefore(element, node.childNodes[position]);
                      }
                      this.placeCaretAfterNode(element);
                  }
              } else if (focusElement.type === "textarea") {
                  focusElement.focus();
              } else {
                  const editorSelection = this.integrationModel.getSelection();
                  editorSelection.removeAllRanges();
                  if (this.editionProperties.range) {
                      const { range } = this.editionProperties;
                      this.editionProperties.range = null;
                      editorSelection.addRange(range);
                  }
              }
          } else if (this.editionProperties.latexRange) {
              if (document.selection && document.getSelection === 0) {
                  this.editionProperties.isNewElement = true;
                  this.editionProperties.latexRange.select();
                  this.insertElementOnSelection(element, focusElement, windowTarget);
              } else {
                  this.editionProperties.latexRange.deleteContents();
                  this.editionProperties.latexRange.insertNode(element);
                  this.placeCaretAfterNode(element);
              }
          } else if (focusElement.type === "textarea") {
              let item;
              // Wrapper for some integrations that can have special behaviours to show latex.
              if (typeof this.integrationModel.getSelectedItem !== "undefined") {
                  item = this.integrationModel.getSelectedItem(focusElement, false);
              } else {
                  item = Util.getSelectedItemOnTextarea(focusElement);
              }
              Util.updateExistingTextOnTextarea(focusElement, element.textContent, item.startPosition, item.endPosition);
          } else {
              mathmlOrigin = this.editionProperties.temporalImage?.dataset.mathml;
              if (element && element.nodeName.toLowerCase() === "img") {
                  // Editor empty, formula has been erased on edit.
                  // There are editors (e.g: CKEditor) that put attributes in images.
                  // We don't allow that behaviour in our images.
                  Image.removeImgDataAttributes(this.editionProperties.temporalImage);
                  // Clone is needed to maintain event references to temporalImage.
                  Image.clone(element, this.editionProperties.temporalImage);
              } else {
                  this.editionProperties.temporalImage.remove();
              }
              this.placeCaretAfterNode(this.editionProperties.temporalImage);
          }
          // Build the telemeter payload separated to delete null/undefined entries.
          const mathml = element?.dataset?.mathml;
          let payload = {
              mathml_origin: mathmlOrigin ? MathML.safeXmlDecode(mathmlOrigin) : mathmlOrigin,
              mathml: mathml ? MathML.safeXmlDecode(mathml) : mathml,
              elapsed_time: Date.now() - this.editionProperties.editionStartTime,
              editor_origin: null,
              toolbar: this.modalDialog.contentManager.toolbar,
              size: mathml?.length
          };
          // Remove the desired null keys.
          Object.keys(payload).forEach((key)=>{
              if (key === "mathml_origin" || key === "editor_origin") !payload[key] ? delete payload[key] : {};
          });
          // Call Telemetry service to track the event.
          try {
              Telemeter.telemeter.track("INSERTED_FORMULA", {
                  ...payload
              });
          } catch (error) {
              console.error("Error tracking INSERTED_FORMULA", error);
          }
      }
      /**
     * Opens a modal dialog containing MathType editor..
     * @param {HTMLElement} target - The target HTMLElement where formulas should be inserted.
     * @param {Boolean} isIframe - True if the target HTMLElement is an iframe. False otherwise.
     */ openModalDialog(target, isIframe) {
          // Count the time since the editor is open
          this.editionProperties.editionStartTime = Date.now();
          // Textarea elements don't have normal document ranges. It only accepts latex edit.
          this.editMode = "images";
          // In IE is needed keep the range due to after focus the modal window
          // it can't be retrieved the last selection.
          try {
              if (isIframe) {
                  // Is needed focus the target first.
                  target.contentWindow.focus();
                  const selection = target.contentWindow.getSelection();
                  this.editionProperties.range = selection.getRangeAt(0);
              } else {
                  // Is needed focus the target first.
                  target.focus();
                  const selection = getSelection();
                  this.editionProperties.range = selection.getRangeAt(0);
              }
          } catch (e) {
              this.editionProperties.range = null;
          }
          if (isIframe === undefined) {
              isIframe = true;
          }
          this.editionProperties.latexRange = null;
          if (target) {
              let selectedItem;
              if (typeof this.integrationModel.getSelectedItem !== "undefined") {
                  selectedItem = this.integrationModel.getSelectedItem(target, isIframe);
              } else {
                  selectedItem = Util.getSelectedItem(target, isIframe);
              }
              // Check LaTeX if and only if the node is a text node (nodeType==3).
              if (selectedItem) {
                  // Case when image was selected and button pressed.
                  if (!selectedItem.caretPosition && Util.containsClass(selectedItem.node, Configuration.get("imageClassName"))) {
                      this.editionProperties.temporalImage = selectedItem.node;
                      this.editionProperties.isNewElement = false;
                  } else if (selectedItem.node.nodeType === 3) {
                      // If it's a text node means that editor is working with LaTeX.
                      if (this.integrationModel.getMathmlFromTextNode) {
                          // If integration has this function it isn't set range due to we don't
                          // know if it will be put into a textarea as a text or image.
                          const mathml = this.integrationModel.getMathmlFromTextNode(selectedItem.node, selectedItem.caretPosition);
                          if (mathml) {
                              this.editMode = "latex";
                              this.editionProperties.isNewElement = false;
                              this.editionProperties.temporalImage = document.createElement("img");
                              this.editionProperties.temporalImage.setAttribute(Configuration.get("imageMathmlAttribute"), MathML.safeXmlEncode(mathml));
                          }
                      } else {
                          const latexResult = Latex.getLatexFromTextNode(selectedItem.node, selectedItem.caretPosition);
                          if (latexResult) {
                              const mathml = Latex.getMathMLFromLatex(latexResult.latex);
                              this.editMode = "latex";
                              this.editionProperties.isNewElement = false;
                              this.editionProperties.temporalImage = document.createElement("img");
                              this.editionProperties.temporalImage.setAttribute(Configuration.get("imageMathmlAttribute"), MathML.safeXmlEncode(mathml));
                              const windowTarget = isIframe ? target.contentWindow : window;
                              if (target.tagName.toLowerCase() !== "textarea") {
                                  if (document.selection) {
                                      let leftOffset = 0;
                                      let previousNode = latexResult.startNode.previousSibling;
                                      while(previousNode){
                                          leftOffset += Util.getNodeLength(previousNode);
                                          previousNode = previousNode.previousSibling;
                                      }
                                      this.editionProperties.latexRange = windowTarget.document.selection.createRange();
                                      this.editionProperties.latexRange.moveToElementText(latexResult.startNode.parentNode);
                                      this.editionProperties.latexRange.move("character", leftOffset + latexResult.startPosition);
                                      this.editionProperties.latexRange.moveEnd("character", latexResult.latex.length + 4); // Plus 4 for the '$$' characters.
                                  } else {
                                      this.editionProperties.latexRange = windowTarget.document.createRange();
                                      this.editionProperties.latexRange.setStart(latexResult.startNode, latexResult.startPosition);
                                      this.editionProperties.latexRange.setEnd(latexResult.endNode, latexResult.endPosition);
                                  }
                              }
                          }
                      }
                  }
              } else if (target.tagName.toLowerCase() === "textarea") {
                  // By default editMode is 'images', but when target is a textarea it needs to be 'latex'.
                  this.editMode = "latex";
              }
          }
          // Setting an object with the editor parameters.
          // Editor parameters can be customized in several ways:
          // 1 - editorAttributes: Contains the default editor attributes,
          //  usually the metrics in a comma separated string. Always exists.
          // 2 - editorParameters: Object containing custom editor parameters.
          // These parameters are defined in the backend. So they affects all integration instances.
          // The backend send the default editor attributes in a coma separated
          // with the following structure: key1=value1,key2=value2...
          const defaultEditorAttributesArray = Configuration.get("editorAttributes").split(", ");
          const defaultEditorAttributes = {};
          for(let i = 0, len = defaultEditorAttributesArray.length; i < len; i += 1){
              const tempAttribute = defaultEditorAttributesArray[i].split("=");
              const key = tempAttribute[0];
              const value = tempAttribute[1];
              defaultEditorAttributes[key] = value;
          }
          // Custom editor parameters.
          const editorAttributes = {
              language: this.language
          };
          // Editor parameters in backend, usually configuration.ini.
          const serverEditorParameters = Configuration.get("editorParameters");
          // Editor parameters through JavaScript configuration.
          const clientEditorParameters = this.integrationModel.editorParameters;
          Object.assign(editorAttributes, defaultEditorAttributes, serverEditorParameters);
          Object.assign(editorAttributes, defaultEditorAttributes, clientEditorParameters);
          // Now, update backwards: if user has set a custom language, pass that back to core properties
          this.language = editorAttributes.language;
          StringManager.language = this.language;
          editorAttributes.rtl = this.integrationModel.rtl;
          const customHeaders = Configuration.get("customHeaders");
          // This is not being used in the code, we are keeping it just in case it's needed.
          // We check if it is a string since we have a setter that will make the customHeaders an object. And we do the conversion for the case when we get the headers from the backend.
          editorAttributes.customHeaders = typeof customHeaders === "string" ? Util.convertStringToObject(customHeaders) : customHeaders;
          const contentManagerAttributes = {};
          contentManagerAttributes.editorAttributes = editorAttributes;
          contentManagerAttributes.language = this.language;
          contentManagerAttributes.customEditors = this.customEditors;
          contentManagerAttributes.environment = this.environment;
          if (this.modalDialog == null) {
              this.modalDialog = new ModalDialog(editorAttributes);
              this.contentManager = new ContentManager(contentManagerAttributes);
              // When an instance of ContentManager is created we need to wait until
              // the ContentManager is ready by listening 'onLoad' event.
              const listener = Listeners.newListener("onLoad", ()=>{
                  this.contentManager.dbclick = this.editionProperties.dbclick;
                  this.contentManager.isNewElement = this.editionProperties.isNewElement;
                  if (this.editionProperties.temporalImage != null) {
                      const mathML = MathML.safeXmlDecode(this.editionProperties.temporalImage.getAttribute(Configuration.get("imageMathmlAttribute")));
                      this.contentManager.mathML = mathML;
                  }
              });
              this.contentManager.addListener(listener);
              this.contentManager.init();
              this.modalDialog.setContentManager(this.contentManager);
              this.contentManager.setModalDialogInstance(this.modalDialog);
          } else {
              this.contentManager.dbclick = this.editionProperties.dbclick;
              this.contentManager.isNewElement = this.editionProperties.isNewElement;
              if (this.editionProperties.temporalImage != null) {
                  const mathML = MathML.safeXmlDecode(this.editionProperties.temporalImage.getAttribute(Configuration.get("imageMathmlAttribute")));
                  this.contentManager.mathML = mathML;
              }
          }
          this.contentManager.setIntegrationModel(this.integrationModel);
          this.modalDialog.open();
      }
      /**
     * Returns the {@link CustomEditors} instance.
     * @return {CustomEditors} The current {@link CustomEditors} instance.
     */ getCustomEditors() {
          return this.customEditors;
      }
  }
  /**
   * Core static listeners.
   * @type {Listeners}
   * @private
   */ Core._globalListeners = new Listeners();
  /**
   * Resources state. Says if they were loaded or not.
   * @type {Boolean}
   * @private
   */ Core._initialized = false;

  var warnIcon = "<svg width=\"16\" height=\"14\" viewBox=\"0 0 16 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.25706 1.09882C7.02167 -0.26048 8.97875 -0.26048 9.74336 1.09882L15.3237 11.0194C16.0736 12.3526 15.1102 13.9999 13.5805 13.9999H2.4199C0.890251 13.9999 -0.073177 12.3526 0.676753 11.0194L6.25706 1.09882ZM9.00012 11C9.00012 11.5523 8.55241 12 8.00012 12C7.44784 12 7.00012 11.5523 7.00012 11C7.00012 10.4477 7.44784 10 8.00012 10C8.55241 10 9.00012 10.4477 9.00012 11ZM8.00012 3C7.44784 3 7.00012 3.44772 7.00012 4V7C7.00012 7.55228 7.44784 8 8.00012 8C8.55241 8 9.00012 7.55228 9.00012 7V4C9.00012 3.44772 8.55241 3 8.00012 3Z\" fill=\"#FB923C\"/>\n</svg>\n";

  // eslint-disable-next-line no-unused-vars, import/named
  /**
   * @typedef {Object} IntegrationModelProperties
   * @property {string} configurationService - Configuration service path.
   * This parameter is needed to determine all services paths.
   * @property {HTMLElement} integrationModelProperties.target - HTML target.
   * @property {string} integrationModelProperties.scriptName - Integration script name.
   * Usually the name of the integration script.
   * @property {Object} integrationModelProperties.environment - integration environment properties.
   * @property {Object} [integrationModelProperties.callbackMethodArguments] - object containing
   * callback method arguments.
   * @property {string} [integrationModelProperties.version] - integration version number.
   * @property {Object} [integrationModelProperties.editorObject] - object containing
   * the integration editor instance.
   * @property {boolean} [integrationModelProperties.rtl] - true if the editor is in RTL mode.
   * false otherwise.
   * @property {ServiceProviderProperties} [integrationModelProperties.serviceProviderProperties]
   * - The service parameters.
   * @property {Object} [integrationModelProperties.integrationParameters]
   * - Overwritten integration parameters.
   */ class IntegrationModel {
      /**
     * @classdesc
     * This class represents an integration model, allowing the integration script to
     * communicate with Core class. Each integration must extend this class.
     * @constructs
     * @param {IntegrationModelProperties} integrationModelProperties
     */ constructor(integrationModelProperties){
          /**
       * Language. Needed for accessibility and locales. English by default.
       */ this.language = "en";
          /**
       * Service parameters
       * @type {ServiceProviderProperties}
       */ this.serviceProviderProperties = integrationModelProperties.serviceProviderProperties ?? {};
          /**
       * Configuration service path. The integration service is needed by Core class to
       * load all the backend configuration into the frontend and also to create the paths
       * of all services (all services lives in the same route). Mandatory property.
       */ this.configurationService = "";
          if ("configurationService" in integrationModelProperties) {
              this.serviceProviderProperties.URI = integrationModelProperties.configurationService;
              console.warn("Deprecated property configurationService. Use serviceParameters on instead.", [
                  integrationModelProperties.configurationService
              ]);
          }
          /**
       * Plugin version. Needed to stats and caching.
       * @type {string}
       */ this.version = "version" in integrationModelProperties ? integrationModelProperties.version : "";
          /**
       * DOM target in which the plugin works. Needed to associate events, insert formulas, etc.
       * Mandatory property.
       */ this.target = null;
          if ("target" in integrationModelProperties) {
              this.target = integrationModelProperties.target;
          } else {
              throw new Error("IntegrationModel constructor error: target property missed.");
          }
          /**
       * Integration script name. Needed to know the plugin path.
       */ if ("scriptName" in integrationModelProperties) {
              this.scriptName = integrationModelProperties.scriptName;
          }
          /**
       * Object containing the arguments needed by the callback function.
       */ this.callbackMethodArguments = integrationModelProperties.callbackMethodArguments ?? {};
          /**
       * Contains information about the integration environment:
       * like the name of the editor, the version, etc.
       */ this.environment = integrationModelProperties.environment ?? {};
          /**
       * Indicates if the DOM target is - or not - and iframe.
       */ this.isIframe = false;
          if (this.target != null) {
              this.isIframe = this.target.tagName.toUpperCase() === "IFRAME";
          }
          /**
       * Instance of the integration editor object. Usually the entry point to access the API
       * of a HTML editor.
       */ this.editorObject = integrationModelProperties.editorObject ?? null;
          /**
       * Specifies if the direction of the text is RTL. false by default.
       */ this.rtl = integrationModelProperties.rtl ?? false;
          /**
       * Specifies if the integration model exposes the locale strings. false by default.
       */ this.managesLanguage = integrationModelProperties.managesLanguage ?? false;
          /**
       * Specify if editor will open in hand mode only
       */ this.forcedHandMode = integrationModelProperties?.integrationParameters?.forcedHandMode ?? false;
          /**
       * Indicates if an image is selected. Needed to resize the image to the original size in case
       * the image is resized.
       * @type {boolean}
       */ this.temporalImageResizing = false;
          /**
       * The Core class instance associated to the integration model.
       * @type {Core}
       */ this.core = null;
          /**
       * Integration model listeners.
       * @type {Listeners}
       */ this.listeners = new Listeners();
          // Parameters overwrite.
          if ("integrationParameters" in integrationModelProperties) {
              IntegrationModel.integrationParameters.forEach((parameter)=>{
                  if (parameter in integrationModelProperties.integrationParameters) {
                      // Don't add empty parameters.
                      const value = integrationModelProperties.integrationParameters[parameter];
                      if (Object.keys(value).length !== 0) {
                          this[parameter] = value;
                      }
                  }
              });
          }
      }
      /**
     * Init function. Usually called from the integration side once the core.js file is loaded.
     */ init() {
          // Check if language is an object and select the property necessary
          this.language = this.getLanguage();
          // We need to wait until Core class is loaded ('onLoad' event) before
          // call the callback method.
          const listener = Listeners.newListener("onLoad", ()=>{
              this.callbackFunction(this.callbackMethodArguments);
          });
          // Backwards compatibility.
          if (this.serviceProviderProperties.URI.indexOf("configuration") !== -1) {
              const uri = this.serviceProviderProperties.URI;
              const server = ServiceProvider.getServerLanguageFromService(uri);
              this.serviceProviderProperties.server = server;
              const configurationIndex = this.serviceProviderProperties.URI.indexOf("configuration");
              const subsTring = this.serviceProviderProperties.URI.substring(0, configurationIndex);
              this.serviceProviderProperties.URI = subsTring;
          }
          let serviceParametersURI = this.serviceProviderProperties.URI;
          serviceParametersURI = serviceParametersURI.indexOf("/") === 0 || serviceParametersURI.indexOf("http") === 0 ? serviceParametersURI : Util.concatenateUrl(this.getPath(), serviceParametersURI);
          this.serviceProviderProperties.URI = serviceParametersURI;
          const coreProperties = {};
          coreProperties.serviceProviderProperties = this.serviceProviderProperties;
          this.setCore(new Core(coreProperties));
          this.core.addListener(listener);
          this.core.language = this.language;
          // Initializing Core class.
          this.core.init();
          // TODO: Move to Core constructor.
          this.core.setEnvironment(this.environment);
          // No internet connection modal.
          let attributes = {};
          attributes.class = attributes.id = "wrs_modal_offline";
          this.offlineModal = Util.createElement("div", attributes);
          attributes = {};
          attributes.class = "wrs_modal_content_offline";
          this.offlineModalContent = Util.createElement("div", attributes);
          attributes = {};
          attributes.class = "wrs_modal_offline_close";
          this.offlineModalClose = Util.createElement("span", attributes);
          this.offlineModalClose.innerHTML = "&times;";
          attributes = {};
          attributes.class = "wrs_modal_offline_warn";
          this.offlineModalWarn = Util.createElement("span", attributes);
          let generalStyle = `background-image: url(data:image/svg+xml;base64,${window.btoa(warnIcon)})`;
          this.offlineModalWarn.setAttribute("style", generalStyle);
          attributes = {};
          attributes.class = "wrs_modal_offline_text_container";
          this.offlineModalMessage = Util.createElement("div", attributes);
          attributes = {};
          attributes.class = "wrs_modal_offline_text_warn";
          this.offlineModalMessage1 = Util.createElement("p", attributes);
          this.offlineModalMessage1.innerHTML = "You are not online!";
          attributes = {};
          attributes.class = "wrs_modal_offline_text";
          this.offlineModalMessage2 = Util.createElement("p", attributes);
          this.offlineModalMessage2.innerHTML = `Thank you for using MathType. We have detected you are disconnected from the network. We remind you that you'll need to be connected to use MathType. <br /><br />Please refresh the page if this message continues appearing.`;
          //Append offline modal elements
          this.offlineModalContent.appendChild(this.offlineModalClose);
          this.offlineModalMessage.appendChild(this.offlineModalMessage1);
          this.offlineModalMessage.appendChild(this.offlineModalMessage2);
          this.offlineModalContent.appendChild(this.offlineModalMessage);
          this.offlineModalContent.appendChild(this.offlineModalWarn);
          this.offlineModal.appendChild(this.offlineModalContent);
          document.body.appendChild(this.offlineModal);
          let modal = document.getElementById("wrs_modal_offline");
          this.offlineModalClose.addEventListener("click", function() {
              modal.style.display = "none";
          });
          // Store editor name for telemetry purposes.
          let editorName = this.environment.editor;
          editorName = editorName.slice(0, -1); // Remove version number from editors
          if (editorName.includes("TinyMCE")) editorName = "TinyMCE"; // Remove version from Tinymce editor.
          if (editorName.includes("Generic")) editorName = "Generic"; // Remove version from Generic editor.
          let solutionTelemeter = editorName;
          // If moodle, add information to hosts and solution.
          let isMoodle = !!(typeof M === "object" && M !== null), lms;
          if (isMoodle) {
              solutionTelemeter = "Moodle";
              lms = {
                  nam: "moodle",
                  fam: "lms",
                  ver: this.environment.moodleVersion,
                  category: this.environment.moodleCourseCategory,
                  course: this.environment.moodleCourseName
              };
              if (!editorName.includes("TinyMCE")) {
                  editorName = "Atto";
              }
          }
          // Get the OS and its version.
          let OSData = this.getOS();
          // Get the broswer and its version.
          let broswerData = this.getBrowser();
          // Create list of hosts to send to telemetry.
          let hosts = [
              {
                  nam: broswerData.detectedBrowser,
                  fam: "browser",
                  ver: broswerData.versionBrowser
              },
              {
                  nam: editorName.toLowerCase(),
                  fam: "html-editor",
                  ver: this.environment.editorVersion
              },
              {
                  nam: OSData.detectedOS,
                  fam: "os",
                  ver: OSData.versionOS
              },
              {
                  nam: window.location.hostname,
                  fam: "domain"
              },
              lms
          ];
          // Filter hosts to remove empty objects and empty keys.
          hosts = hosts.filter(function(element) {
              if (element) Object.keys(element).forEach((key)=>element[key] === "unknown" ? delete element[key] : {});
              return element !== undefined;
          });
          // Initialize telemeter
          Telemeter.init({
              solution: {
                  name: "MathType for " + solutionTelemeter,
                  version: this.version
              },
              hosts: hosts,
              config: {
                  test: false,
                  debug: false,
                  dry_run: false,
                  api_key: "eda2ce9b-0e8a-46f2-acdd-c228a615314e"
              },
              url: undefined
          });
      }
      /**
     * Returns the Browser name and its version.
     * @return {array} - detectedBrowser = Operating System name.
     *                   versionBrowser = Operating System version.
     */ getBrowser() {
          // default value for OS just in case nothing is detected
          let detectedBrowser = "unknown", versionBrowser = "unknown";
          let userAgent = window.navigator.userAgent;
          if (/Brave/.test(userAgent)) {
              detectedBrowser = "brave";
              if (userAgent.indexOf("Brave/")) {
                  let start = userAgent.indexOf("Brave") + 6;
                  let end = userAgent.substring(start).indexOf(" ");
                  end = end === -1 ? userAgent.lastIndexOf("") : end;
                  versionBrowser = userAgent.substring(start, end + start).replace("_", ".").replace(/[^\d.-]/g, "");
              }
          } else if (userAgent.indexOf("Edg/") !== -1) {
              detectedBrowser = "edge_chromium";
              let start = userAgent.indexOf("Edg/") + 4;
              versionBrowser = userAgent.substring(start).replace("_", ".").replace(/[^\d.-]/g, "");
          } else if (/Edg/.test(userAgent)) {
              detectedBrowser = "edge";
              let start = userAgent.indexOf("Edg") + 3;
              start = start + userAgent.substring(start).indexOf("/");
              let end = userAgent.substring(start).indexOf(" ");
              end = end === -1 ? userAgent.lastIndexOf("") : end;
              versionBrowser = userAgent.substring(start, end + start).replace("_", ".").replace(/[^\d.-]/g, "");
          } else if (/Firefox/.test(userAgent) || /FxiOS/.test(userAgent)) {
              detectedBrowser = "firefox";
              let start = userAgent.indexOf("Firefox");
              start = start === -1 ? userAgent.indexOf("FxiOS") : start;
              start = start + userAgent.substring(start).indexOf("/") + 1;
              let end = userAgent.substring(start).indexOf(" ");
              end = end === -1 ? userAgent.lastIndexOf("") : end;
              versionBrowser = userAgent.substring(start, end + start).replace("_", ".");
          } else if (/OPR/.test(userAgent)) {
              detectedBrowser = "opera";
              let start = userAgent.indexOf("OPR/") + 4;
              let end = userAgent.substring(start).indexOf(" ");
              end = end === -1 ? userAgent.lastIndexOf("") : end;
              versionBrowser = userAgent.substring(start, end + start).replace("_", ".").replace(/[^\d.-]/g, "");
          } else if (/Chrome/.test(userAgent) || /CriOS/.test(userAgent)) {
              detectedBrowser = "chrome";
              let start = userAgent.indexOf("Chrome");
              start = start === -1 ? userAgent.indexOf("CriOS") : start;
              start = start + userAgent.substring(start).indexOf("/") + 1;
              let end = userAgent.substring(start).indexOf(" ");
              end = end === -1 ? userAgent.lastIndexOf("") : end;
              versionBrowser = userAgent.substring(start, end + start).replace("_", ".");
          } else if (/Safari/.test(userAgent)) {
              detectedBrowser = "safari";
              let start = userAgent.indexOf("Version/");
              start = start + userAgent.substring(start).indexOf("/") + 1;
              let end = userAgent.substring(start).indexOf(" ");
              end = end === -1 ? userAgent.lastIndexOf("") : end;
              versionBrowser = userAgent.substring(start, end + start).replace("_", ".");
          }
          return {
              detectedBrowser,
              versionBrowser
          };
      }
      /**
     * Returns the operating system and its version.
     * @return {array} - detectedOS = Operating System name.
     *                   versionOS = Operating System version.
     */ getOS() {
          // default value for OS just in case nothing is detected
          let detectedOS = "unknown", versionOS = "unknown";
          // Retrieve properties to easily detect the OS
          let userAgent = window.navigator.userAgent, platform = window.navigator.platform, macosPlatforms = [
              "Macintosh",
              "MacIntel",
              "MacPPC",
              "Mac68K"
          ], windowsPlatforms = [
              "Win32",
              "Win64",
              "Windows",
              "WinCE"
          ], iosPlatforms = [
              "iPhone",
              "iPad",
              "iPod"
          ];
          // Find OS and their respective versions
          if (macosPlatforms.indexOf(platform) !== -1) {
              detectedOS = "macos";
              if (userAgent.indexOf("OS X") !== -1) {
                  let start = userAgent.indexOf("OS X") + 5;
                  let end = userAgent.substring(start).indexOf(" ");
                  versionOS = userAgent.substring(start, end + start).replace("_", ".").replace(/[^\d.-]/g, "");
              }
          } else if (iosPlatforms.indexOf(platform) !== -1) {
              detectedOS = "ios";
              if (userAgent.indexOf("OS ") !== -1) {
                  let start = userAgent.indexOf("OS ") + 3;
                  let end = userAgent.substring(start).indexOf(")");
                  versionOS = userAgent.substring(start, end + start).replace("_", ".").replace(/[^\d.-]/g, "");
              }
          } else if (windowsPlatforms.indexOf(platform) !== -1) {
              detectedOS = "windows";
              let start = userAgent.indexOf("Windows");
              let end = userAgent.substring(start).indexOf(";");
              if (end === -1) {
                  end = userAgent.substring(start).indexOf(")");
              }
              versionOS = userAgent.substring(start, end + start).replace("_", ".").replace(/[^\d.-]/g, "");
          } else if (/Android/.test(userAgent)) {
              detectedOS = "android";
              let start = userAgent.indexOf("Android");
              let end = userAgent.substring(start).indexOf(";");
              if (end === -1) {
                  end = userAgent.substring(start).indexOf(")");
              }
              versionOS = userAgent.substring(start, end + start).replace("_", ".").replace(/[^\d.-]/g, "");
          } else if (/CrOS/.test(userAgent)) {
              detectedOS = "chromeos";
              let start = userAgent.indexOf("CrOS ") + 5;
              start = start + userAgent.substring(start).indexOf(" ");
              let end = userAgent.substring(start).indexOf(")");
              versionOS = userAgent.substring(start, end + start).replace("_", ".").replace(/[^\d.-]/g, "");
          } else if (detectedOS === "unknown" && /Linux/.test(platform)) {
              detectedOS = "linux";
          }
          return {
              detectedOS,
              versionOS
          };
      }
      /**
     * Returns the absolute path of the integration script.
     * @return {string} - Absolute path for the integration script.
     */ getPath() {
          if (typeof this.scriptName === "undefined") {
              throw new Error("scriptName property needed for getPath.");
          }
          const col = document.getElementsByTagName("script");
          let path = "";
          for(let i = 0; i < col.length; i += 1){
              const j = col[i].src.lastIndexOf(this.scriptName);
              if (j >= 0) {
                  path = col[i].src.substr(0, j - 1);
              }
          }
          return path;
      }
      /**
     * Returns integration model plugin version
     * @param {string} - Plugin version
     */ getVersion() {
          return this.version;
      }
      /**
     * Sets the language property.
     * @param {string} language - language code.
     */ setLanguage(language) {
          this.language = language;
      }
      /**
     * Sets a Core instance.
     * @param {Core} core - instance of Core class.
     */ setCore(core) {
          this.core = core;
          core.setIntegrationModel(this);
      }
      /**
     * Returns the Core instance.
     * @returns {Core} instance of Core class.
     */ getCore() {
          return this.core;
      }
      /**
     * Sets the object target and updates the iframe property.
     * @param {HTMLElement} target - target object.
     */ setTarget(target) {
          this.target = target;
          this.isIframe = this.target.tagName.toUpperCase() === "IFRAME";
      }
      /**
     * Sets the editor object.
     * @param {Object} editorObject - The editor object.
     */ setEditorObject(editorObject) {
          this.editorObject = editorObject;
      }
      /**
     * Opens formula editor to editing a new formula. Can be overwritten in order to make some
     * actions from integration part before the formula is edited.
     */ openNewFormulaEditor() {
          if (window.navigator.onLine) {
              this.core.editionProperties.dbclick = false;
              this.core.editionProperties.isNewElement = true;
              this.core.openModalDialog(this.target, this.isIframe);
          } else {
              let modal = document.getElementById("wrs_modal_offline");
              modal.style.display = "block";
          }
      }
      /**
     * Opens formula editor to editing an existing formula. Can be overwritten in order to make some
     * actions from integration part before the formula is edited.
     */ openExistingFormulaEditor() {
          if (window.navigator.onLine) {
              this.core.editionProperties.isNewElement = false;
              this.core.openModalDialog(this.target, this.isIframe);
          } else {
              let modal = document.getElementById("wrs_modal_offline");
              modal.style.display = "block";
          }
      }
      /**
     * Wrapper to Core.updateFormula method.
     * Transform a MathML into a image formula.
     * Then the image formula is inserted in the specified target, creating a new image (new formula)
     * or updating an existing one.
     * @param {string} mathml - MathML to generate the formula.
     * @param {string} editMode - Edit Mode (LaTeX or images).
     */ updateFormula(mathml) {
          if (this.editorParameters) {
              mathml = com.wiris.editor.util.EditorUtils.addAnnotation(mathml, "application/vnd.wiris.mtweb-params+json", JSON.stringify(this.editorParameters));
          }
          let focusElement;
          let windowTarget;
          const wirisProperties = null;
          if (this.isIframe) {
              focusElement = this.target.contentWindow;
              windowTarget = this.target.contentWindow;
          } else {
              focusElement = this.target;
              windowTarget = window;
          }
          let obj = this.core.beforeUpdateFormula(mathml, wirisProperties);
          if (!obj) {
              return "";
          }
          obj = this.insertFormula(focusElement, windowTarget, obj.mathml, obj.wirisProperties);
          if (!obj) {
              return "";
          }
          return this.core.afterUpdateFormula(obj.focusElement, obj.windowTarget, obj.node, obj.latex);
      }
      /**
     * Wrapper to Core.insertFormula method.
     * Inserts the formula in the specified target, creating
     * a new image (new formula) or updating an existing one.
     * @param {string} mathml - MathML to generate the formula.
     * @param {string} editMode - Edit Mode (LaTeX or images).
     * @returns {ReturnObject} - Object with the information of the node or latex to insert.
     */ insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
          const obj = this.core.insertFormula(focusElement, windowTarget, mathml, wirisProperties);
          // Delete temporal image when inserted
          this.core.editionProperties.temporalImage = null;
          return obj;
      }
      /**
     * Returns the target selection.
     * @returns {Selection} target selection.
     */ getSelection() {
          if (this.isIframe) {
              this.target.contentWindow.focus();
              return this.target.contentWindow.getSelection();
          }
          this.target.focus();
          return window.getSelection();
      }
      /**
     * Add events to formulas in the DOM target. The events added are the following:
     * - doubleClickHandler: handles Double-click event on formulas by opening an editor
     * to edit them.
     * - mouseDownHandler: handles mouse down event on formulas by saving the size of the formula
     * in case the the formula is resized.
     * - mouseUpHandler: handles mouse up event on formulas by restoring the saved formula size
     * in case the formula is resized.
     */ addEvents() {
          const eventTarget = this.isIframe ? this.target.contentWindow.document : this.target;
          Util.addElementEvents(eventTarget, (element, event)=>{
              this.doubleClickHandler(element, event);
              // Avoid creating the double click listener more than once for each element.
              event.stopImmediatePropagation();
          }, (element, event)=>{
              this.mousedownHandler(element, event);
          }, (element, event)=>{
              this.mouseupHandler(element, event);
          });
      }
      /**
     * Remove events to formulas in the DOM target.
     */ removeEvents() {
          const eventTarget = this.isIframe && this.target.contentWindow?.document ? this.target.contentWindow.document : this.target;
          if (!eventTarget) {
              return;
          }
          Util.removeElementEvents(eventTarget);
      }
      /**
     * Remove events, modals and set this.editorObject to null in order to prevent memory leaks.
     */ destroy() {
          this.removeEvents();
          // Destroy modal dialog if exists.
          if (this.core.modalDialog) {
              this.core.modalDialog.destroy();
          }
          // Remove offline modal dialog if exists.
          if (this.offlineModal) {
              this.offlineModal.remove();
          }
          this.editorObject = null;
      }
      /**
     * Handles a Double-click on the target element. Opens an editor
     * to re-edit the double-clicked formula.
     * @param {HTMLElement} element - DOM object target.
     */ doubleClickHandler(element) {
          this.core.editionProperties.dbclick = true;
          if (element.nodeName.toLowerCase() === "img") {
              this.core.getCustomEditors().disable();
              const customEditorAttributeName = Configuration.get("imageCustomEditorName");
              if (element.hasAttribute(customEditorAttributeName)) {
                  const customEditor = element.getAttribute(customEditorAttributeName);
                  this.core.getCustomEditors().enable(customEditor);
              }
              if (Util.containsClass(element, Configuration.get("imageClassName"))) {
                  this.core.editionProperties.temporalImage = element;
                  this.core.editionProperties.isNewElement = true;
                  this.openExistingFormulaEditor();
              }
          }
      }
      /**
     * Handles a mouse up event on the target element. Restores the image size to avoid
     * resizing formulas.
     */ mouseupHandler() {
          if (this.temporalImageResizing) {
              setTimeout(()=>{
                  Image.fixAfterResize(this.temporalImageResizing);
              }, 10);
          }
      }
      /**
     * Handles a mouse down event on the target element. Saves the formula size to avoid
     * resizing formulas.
     * @param {HTMLElement} element - target element.
     */ mousedownHandler(element) {
          if (element.nodeName.toLowerCase() === "img") {
              if (Util.containsClass(element, Configuration.get("imageClassName"))) {
                  this.temporalImageResizing = element;
              }
          }
      }
      /**
     * Returns the integration language. By default the browser agent. This method
     * should be overwritten to obtain the integration language, for example using the
     * plugin API of an HTML editor.
     * @returns {string} integration language.
     */ getLanguage() {
          return this.getBrowserLanguage();
      }
      /**
     * Returns the browser language.
     * @returns {string} the browser language.
     */ // eslint-disable-next-line class-methods-use-this
      getBrowserLanguage() {
          let language = "en";
          if (navigator.userLanguage) {
              language = navigator.userLanguage.substring(0, 2);
          } else if (navigator.language) {
              language = navigator.language.substring(0, 2);
          } else {
              language = "en";
          }
          return language;
      }
      /**
     * This function is called once the {@link Core} is loaded. IntegrationModel class
     * will fire this method when {@link Core} 'onLoad' event is fired.
     * This method should content all the logic to init
     * the integration.
     */ callbackFunction() {
          // It's needed to wait until the integration target is ready. The event is fired
          // from the integration side.
          const listener = Listeners.newListener("onTargetReady", ()=>{
              this.addEvents(this.target);
          });
          this.listeners.add(listener);
      }
      /**
     * Function called when the content submits an action.
     */ // eslint-disable-next-line class-methods-use-this
      notifyWindowClosed() {
      // Nothing.
      }
      /**
     * Wrapper.
     * Extracts mathml of a determined text node. This function is used as a wrapper inside core.js
     * in order to get mathml from a text node that can contain normal LaTeX or other chosen text.
     * @param {string} textNode - text node to extract the MathML.
     * @param {int} caretPosition - caret position inside the text node.
     * @returns {string} MathML inside the text node.
     */ // eslint-disable-next-line class-methods-use-this, no-unused-vars
      getMathmlFromTextNode(textNode, caretPosition) {}
      /**
     * Wrapper
     * It fills wrs event object of nonLatex with the desired data.
     * @param {Object} event - event object.
     * @param {Object} window dom window object.
     * @param {string} mathml valid mathml.
     */ // eslint-disable-next-line class-methods-use-this, no-unused-vars
      fillNonLatexNode(event, window1, mathml) {}
      /**
      Wrapper.
     * Returns selected item from the target.
     * @param {HTMLElement} target - target element
     * @param {boolean} iframe
     */ // eslint-disable-next-line class-methods-use-this, no-unused-vars
      getSelectedItem(target, isIframe) {}
      // Set temporal image to null and make focus come back.
      static setActionsOnCancelButtons() {
          // Make focus come back on the previous place it was when click cancel button
          const currentInstance = WirisPlugin.currentInstance;
          const editorSelection = currentInstance.getSelection();
          editorSelection.removeAllRanges();
          if (currentInstance.core.editionProperties.range) {
              const { range } = currentInstance.core.editionProperties;
              currentInstance.core.editionProperties.range = null;
              editorSelection.addRange(range);
              if (range.startOffset !== range.endOffset) {
                  currentInstance.core.placeCaretAfterNode(currentInstance.core.editionProperties.temporalImage);
              }
          }
          // eslint-disable-next-line no-undef
          if (WirisPlugin.currentInstance) {
              WirisPlugin.currentInstance.core.editionProperties.temporalImage = null; // eslint-disable-line
          }
      }
  }
  // To know if the integration that extends this class implements
  // wrapper methods, they are set as undefined.
  IntegrationModel.prototype.getMathmlFromTextNode = undefined;
  IntegrationModel.prototype.fillNonLatexNode = undefined;
  IntegrationModel.prototype.getSelectedItem = undefined;
  /**
   * An object containing a list with the overwritable class constructor properties.
   * @type {Object}
   */ IntegrationModel.integrationParameters = [
      "serviceProviderProperties",
      "editorParameters"
  ];

  /**
   * This class represents the MathType integration for CKEditor5.
   * @extends {IntegrationModel}
   */ class CKEditor5Integration extends IntegrationModel {
      constructor(ckeditorIntegrationModelProperties){
          const editor = ckeditorIntegrationModelProperties.editorObject;
          if (typeof editor.config !== "undefined" && typeof editor.config.get("mathTypeParameters") !== "undefined") {
              ckeditorIntegrationModelProperties.integrationParameters = editor.config.get("mathTypeParameters");
          }
          /**
       * CKEditor5 Integration.
       *
       * @param {integrationModelProperties} integrationModelAttributes
       */ super(ckeditorIntegrationModelProperties);
          /**
       * Folder name used for the integration inside CKEditor plugins folder.
       */ this.integrationFolderName = "ckeditor_wiris";
      }
      /**
     * @inheritdoc
     * @returns {string} - The CKEditor instance language.
     * @override
     */ getLanguage() {
          // Returns the CKEDitor instance language taking into account that the language can be an object.
          // Try to get editorParameters.language, fail silently otherwise
          try {
              return this.editorParameters.language;
          } catch (e) {}
          const languageObject = this.editorObject.config.get("language");
          if (languageObject != null) {
              if (typeof languageObject === "object") {
                  // eslint-disable-next-line no-prototype-builtins
                  if (languageObject.hasOwnProperty("ui")) {
                      return languageObject.ui;
                  }
                  return languageObject;
              }
              return languageObject;
          }
          return super.getLanguage();
      }
      /**
     * Adds callbacks to the following CKEditor listeners:
     * - 'focus' - updates the current instance.
     * - 'contentDom' - adds 'doubleclick' callback.
     * - 'doubleclick' - sets to null data.dialog property to avoid modifications for MathType formulas.
     * - 'setData' - parses the data converting MathML into images.
     * - 'afterSetData' - adds an observer to MathType formulas to avoid modifications.
     * - 'getData' - parses the data converting images into selected save mode (MathML by default).
     * - 'mode' - recalculates the active element.
     */ addEditorListeners() {
          const editor = this.editorObject;
          if (typeof editor.config.wirislistenersdisabled === "undefined" || !editor.config.wirislistenersdisabled) {
              this.checkElement();
          }
      }
      /**
     * Checks the current container and assign events in case that it doesn't have them.
     * CKEditor replaces several times the element element during its execution,
     * so we must assign the events again to editor element.
     */ checkElement() {
          const editor = this.editorObject;
          const newElement = editor.sourceElement;
          // If the element wasn't treated, add the events.
          if (!newElement.wirisActive) {
              this.setTarget(newElement);
              this.addEvents();
              // Set the element as treated
              newElement.wirisActive = true;
          }
      }
      /**
     * @inheritdoc
     * @param {HTMLElement} element - HTMLElement target.
     * @param {MouseEvent} event - event which trigger the handler.
     */ doubleClickHandler(element, event) {
          this.core.editionProperties.dbclick = true;
          if (this.editorObject.isReadOnly === false) {
              if (element.nodeName.toLowerCase() === "img") {
                  if (Util.containsClass(element, Configuration.get("imageClassName"))) {
                      // Some plugins (image2, image) open a dialog on Double-click. On formulas
                      // doubleclick event ends here.
                      if (typeof event.stopPropagation !== "undefined") {
                          // old I.E compatibility.
                          event.stopPropagation();
                      } else {
                          event.returnValue = false;
                      }
                      this.core.getCustomEditors().disable();
                      const customEditorAttr = element.getAttribute(Configuration.get("imageCustomEditorName"));
                      if (customEditorAttr) {
                          this.core.getCustomEditors().enable(customEditorAttr);
                      }
                      this.core.editionProperties.temporalImage = element;
                      this.openExistingFormulaEditor();
                  }
              }
          }
      }
      /** @inheritdoc */ static getCorePath() {
          return null; // TODO
      }
      /** @inheritdoc */ callbackFunction() {
          super.callbackFunction();
          this.addEditorListeners();
      }
      openNewFormulaEditor() {
          // Store the editor selection as it will be lost upon opening the modal
          this.core.editionProperties.selection = this.editorObject.editing.view.document.selection;
          // Focus on the selected editor when multiple editor instances are present
          WirisPlugin.currentInstance = this;
          return super.openNewFormulaEditor();
      }
      /**
     * Replaces old formula with new MathML or inserts it in caret position if new
     * @param {String} mathml MathML to update old one or insert
     * @returns {module:engine/model/element~Element} The model element corresponding to the inserted image
     */ insertMathml(mathml) {
          // This returns the value returned by the callback function (writer => {...})
          return this.editorObject.model.change((writer)=>{
              const core = this.getCore();
              const selection = this.editorObject.model.document.selection;
              const modelElementNew = writer.createElement("mathml", {
                  formula: mathml,
                  ...Object.fromEntries(selection.getAttributes())
              });
              // Obtain the DOM <span><img ... /></span> object corresponding to the formula
              if (core.editionProperties.isNewElement) {
                  // Don't bother inserting anything at all if the MathML is empty.
                  if (!mathml) return;
                  const viewSelection = this.core.editionProperties.selection || this.editorObject.editing.view.document.selection;
                  const modelPosition = this.editorObject.editing.mapper.toModelPosition(viewSelection.getLastPosition());
                  this.editorObject.model.insertObject(modelElementNew, modelPosition);
                  // Remove selection
                  if (!viewSelection.isCollapsed) {
                      for (const range of viewSelection.getRanges()){
                          writer.remove(this.editorObject.editing.mapper.toModelRange(range));
                      }
                  }
                  // Set carret after the formula
                  const position = this.editorObject.model.createPositionAfter(modelElementNew);
                  writer.setSelection(position);
              } else {
                  const img = core.editionProperties.temporalImage;
                  const viewElement = this.editorObject.editing.view.domConverter.domToView(img).parent;
                  const modelElementOld = this.editorObject.editing.mapper.toModelElement(viewElement);
                  // Insert the new <mathml> and remove the old one
                  const position = this.editorObject.model.createPositionBefore(modelElementOld);
                  // If the given MathML is empty, don't insert a new formula.
                  if (mathml) {
                      this.editorObject.model.insertObject(modelElementNew, position);
                  }
                  writer.remove(modelElementOld);
              }
              // eslint-disable-next-line consistent-return
              return modelElementNew;
          });
      }
      /**
     * Finds the text node corresponding to given DOM text element.
     * @param {element} viewElement Element to find corresponding text node of.
     * @returns {module:engine/model/text~Text|undefined} Text node corresponding to the given element or undefined if it doesn't exist.
     */ findText(viewElement) {
          // eslint-disable-line consistent-return
          // mapper always converts text nodes to *new* model elements so we need to convert the text's parents and then come back down
          let pivot = viewElement;
          let element;
          while(!element){
              element = this.editorObject.editing.mapper.toModelElement(this.editorObject.editing.view.domConverter.domToView(pivot));
              pivot = pivot.parentElement;
          }
          // Navigate through all the subtree under `pivot` in order to find the correct text node
          const range = this.editorObject.model.createRangeIn(element);
          const descendants = Array.from(range.getItems());
          for (const node of descendants){
              let viewElementData = viewElement.data;
              if (viewElement.nodeType === 3) {
                  // Remove invisible white spaces
                  viewElementData = viewElementData.replaceAll(String.fromCharCode(8288), "");
              }
              if (node.is("textProxy") && node.data === viewElementData.replace(String.fromCharCode(160), " ")) {
                  return node.textNode;
              }
          }
      }
      /** @inheritdoc */ insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
          // eslint-disable-line no-unused-vars
          const returnObject = {};
          let mathmlOrigin;
          if (!mathml) {
              this.insertMathml("");
          } else if (this.core.editMode === "latex") {
              returnObject.latex = Latex.getLatexFromMathML(mathml);
              returnObject.node = windowTarget.document.createTextNode(`$$${returnObject.latex}$$`);
              this.editorObject.model.change((writer)=>{
                  const { latexRange } = this.core.editionProperties;
                  const startNode = this.findText(latexRange.startContainer);
                  const endNode = this.findText(latexRange.endContainer);
                  let startPosition = writer.createPositionAt(startNode.parent, startNode.startOffset + latexRange.startOffset);
                  let endPosition = writer.createPositionAt(endNode.parent, endNode.startOffset + latexRange.endOffset);
                  let range = writer.createRange(startPosition, endPosition);
                  // When Latex is next to image/formula.
                  if (latexRange.startContainer.nodeType === 3 && latexRange.startContainer.previousSibling?.nodeType === 1) {
                      // Get the position of the latex to be replaced.
                      let latexEdited = "$$" + Latex.getLatexFromMathML(MathML.safeXmlDecode(this.core.editionProperties.temporalImage.dataset.mathml)) + "$$";
                      let data = latexRange.startContainer.data;
                      // Remove invisible characters.
                      data = data.replaceAll(String.fromCharCode(8288), "");
                      // Get to the start of the latex we are editing.
                      let offset = data.indexOf(latexEdited);
                      let dataOffset = data.substring(offset);
                      let second$ = dataOffset.substring(2).indexOf("$$") + 4;
                      let substring = dataOffset.substr(0, second$);
                      data = data.replace(substring, "");
                      if (!data) {
                          startPosition = writer.createPositionBefore(startNode);
                          range = startNode;
                      } else {
                          startPosition = startPosition = writer.createPositionAt(startNode.parent, startNode.startOffset + offset);
                          endPosition = writer.createPositionAt(endNode.parent, endNode.startOffset + second$ + offset);
                          range = writer.createRange(startPosition, endPosition);
                      }
                  }
                  writer.remove(range);
                  writer.insertText(`$$${returnObject.latex}$$`, startNode.getAttributes(), startPosition);
              });
          } else {
              mathmlOrigin = this.core.editionProperties.temporalImage?.dataset.mathml;
              try {
                  returnObject.node = this.editorObject.editing.view.domConverter.viewToDom(this.editorObject.editing.mapper.toViewElement(this.insertMathml(mathml)), windowTarget.document);
              } catch (e) {
                  const x = e.toString();
                  if (x.includes("CKEditorError: Cannot read property 'parent' of undefined")) {
                      this.core.modalDialog.cancelAction();
                  }
              }
          }
          // Build the telemeter payload separated to delete null/undefined entries.
          let payload = {
              mathml_origin: mathmlOrigin ? MathML.safeXmlDecode(mathmlOrigin) : mathmlOrigin,
              mathml: mathml ? MathML.safeXmlDecode(mathml) : mathml,
              elapsed_time: Date.now() - this.core.editionProperties.editionStartTime,
              editor_origin: null,
              toolbar: this.core.modalDialog.contentManager.toolbar,
              size: mathml?.length
          };
          // Remove desired null keys.
          Object.keys(payload).forEach((key)=>{
              if (key === "mathml_origin" || key === "editor_origin") !payload[key] ? delete payload[key] : {};
          });
          // Call Telemetry service to track the event.
          try {
              Telemeter.telemeter.track("INSERTED_FORMULA", {
                  ...payload
              });
          } catch (error) {
              console.error("Error tracking INSERTED_FORMULA", error);
          }
          /* Due to PLUGINS-1329, we add the onChange event to the CK4 insertFormula.
          We probably should add it here as well, but we should look further into how */ // this.editorObject.fire('change');
          // Remove temporal image of inserted formula
          this.core.editionProperties.temporalImage = null;
          return returnObject;
      }
      /**
     * Function called when the content submits an action.
     */ notifyWindowClosed() {
          this.editorObject.editing.view.focus();
      }
  }

  /**
   * Command for opening the MathType editor
   */ class MathTypeCommand extends ckeditor5.Command {
      execute(options = {}) {
          // Check we get a valid integration
          // eslint-disable-next-line no-prototype-builtins
          if (!options.hasOwnProperty("integration") || !(options.integration instanceof CKEditor5Integration)) {
              throw 'Must pass a valid CKEditor5Integration instance as attribute "integration" of options';
          }
          // Save the integration instance as a property of the command.
          this.integration = options.integration;
          // Set custom editor or disable it
          this.setEditor();
          // Open the editor
          this.openEditor();
      }
      /**
     * Sets the appropriate custom editor, if any, or disables them.
     */ setEditor() {
          // It's possible that a custom editor was last used.
          // We need to disable it to avoid wrong behaviors.
          this.integration.core.getCustomEditors().disable();
      }
      /**
     * Checks whether we are editing an existing formula or a new one and opens the editor.
     */ openEditor() {
          this.integration.core.editionProperties.dbclick = false;
          const image = this._getSelectedImage();
          if (typeof image !== "undefined" && image !== null && image.classList.contains(WirisPlugin.Configuration.get("imageClassName"))) {
              this.integration.core.editionProperties.temporalImage = image;
              this.integration.openExistingFormulaEditor();
          } else {
              this.integration.openNewFormulaEditor();
          }
      }
      /**
     * Gets the currently selected formula image
     * @returns {Element} selected image, if any, undefined otherwise
     */ _getSelectedImage() {
          const { selection } = this.editor.editing.view.document;
          // If we can not extract the formula, fall back to default behavior.
          if (selection.isCollapsed || selection.rangeCount !== 1) {
              return;
          }
          // Look for the <span> wrapping the formula and then for the <img/> inside
          const range = selection.getFirstRange();
          let image;
          for (const span of range){
              if (span.item.name !== "span") {
                  return;
              }
              image = span.item.getChild(0);
              break;
          }
          if (!image) {
              return;
          }
          // eslint-disable-next-line consistent-return
          return this.editor.editing.view.domConverter.mapViewToDom(image);
      }
  }
  /**
   * Command for opening the ChemType editor
   */ class ChemTypeCommand extends MathTypeCommand {
      setEditor() {
          this.integration.core.getCustomEditors().enable("chemistry");
      }
  }

  var mathIcon = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 300 261.7\" style=\"enable-background:new 0 0 300 261.7;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:#FFFFFF;}\n\t.st1{fill:#EF4A5F;}\n\t.st2{fill:#C8202F;}\n</style>\n<path class=\"st0\" d=\"M300,32.8c0-16.4-13.4-29.7-29.9-29.7c-2.9,0-7.2,0.8-7.2,0.8c-37.9,9.1-71.3,14-112,14c-0.3,0-0.6,0-1,0\n\tc-16.5,0-29.9,13.3-29.9,29.7c0,16.4,13.4,29.7,29.9,29.7l0,0c45.3,0,83.1-5.3,125.3-15.3h0C289.3,59.5,300,47.4,300,32.8\"/>\n<path class=\"st0\" d=\"M90.2,257.7c-11.4,0-21.9-6.4-27-16.7l-60-119.9c-7.5-14.9-1.4-33.1,13.5-40.5c14.9-7.5,33.1-1.4,40.5,13.5\n\tl27.3,54.7L121.1,39c5.3-15.8,22.4-24.4,38.2-19.1c15.8,5.3,24.4,22.4,19.1,38.2l-59.6,179c-3.9,11.6-14.3,19.7-26.5,20.6\n\tC91.6,257.7,90.9,257.7,90.2,257.7\"/>\n<g>\n\t<g>\n\t\t<path class=\"st1\" d=\"M90.2,257.7c-11.4,0-21.9-6.4-27-16.7l-60-119.9c-7.5-14.9-1.4-33.1,13.5-40.5c14.9-7.5,33.1-1.4,40.5,13.5\n\t\t\tl27.3,54.7L121.1,39c5.3-15.8,22.4-24.4,38.2-19.1c15.8,5.3,24.4,22.4,19.1,38.2l-59.6,179c-3.9,11.6-14.3,19.7-26.5,20.6\n\t\t\tC91.6,257.7,90.9,257.7,90.2,257.7\"/>\n\t</g>\n</g>\n<g>\n\t<g>\n\t\t<path class=\"st2\" d=\"M300,32.8c0-16.4-13.4-29.7-29.9-29.7c-2.9,0-7.2,0.8-7.2,0.8c-37.9,9.1-71.3,14-112,14c-0.3,0-0.6,0-1,0\n\t\t\tc-16.5,0-29.9,13.3-29.9,29.7c0,16.4,13.4,29.7,29.9,29.7l0,0c45.3,0,83.1-5.3,125.3-15.3h0C289.3,59.5,300,47.4,300,32.8\"/>\n\t</g>\n</g>\n</svg>\n";

  var chemIcon = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 40.3 49.5\" style=\"enable-background:new 0 0 40.3 49.5;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:#A4CF61;}\n</style>\n<path class=\"st0\" d=\"M39.2,12.1c0-1.9-1.1-3.6-2.7-4.4L24.5,0.9l0,0c-0.7-0.4-1.5-0.6-2.4-0.6c-0.9,0-1.7,0.2-2.4,0.6l0,0L2.3,10.8\n\tl0,0C0.9,11.7,0,13.2,0,14.9h0v19.6h0c0,1.7,0.9,3.3,2.3,4.1l0,0l17.4,9.9l0,0c0.7,0.4,1.5,0.6,2.4,0.6c0.9,0,1.7-0.2,2.4-0.6l0,0\n\tl12.2-6.9h0c1.5-0.8,2.6-2.5,2.6-4.3c0-2.7-2.2-4.9-4.9-4.9c-0.9,0-1.8,0.3-2.5,0.7l0,0l-9.7,5.6l-12.3-7V17.8l12.3-7l9.9,5.7l0,0\n\tc0.7,0.4,1.5,0.6,2.4,0.6C37,17,39.2,14.8,39.2,12.1\"/>\n</svg>\n";

  var version = "8.12.0";
  var packageInfo = {
  	version: version};

  // CKEditor imports
  let currentInstance = null; // eslint-disable-line import/no-mutable-exports
  class MathType extends ckeditor5.Plugin {
      static get requires() {
          return [
              ckeditor5.Widget
          ];
      }
      static get pluginName() {
          return "MathType";
      }
      init() {
          // Create the MathType API Integration object
          const integration = this._addIntegration();
          currentInstance = integration;
          // Add the MathType and ChemType commands to the editor
          this._addCommands();
          // Add the buttons for MathType and ChemType
          this._addViews(integration);
          // Registers the <mathml> element in the schema
          this._addSchema();
          // Add the downcast and upcast converters
          this._addConverters(integration);
          // Expose the WirisPlugin variable to the window
          this._exposeWiris();
      }
      /**
     * Inherited from Plugin class: Executed when CKEditor5 is destroyed
     */ destroy() {
          if (currentInstance) {
              // eslint-disable-line class-methods-use-this
              currentInstance.destroy();
          }
      }
      /**
     * Create the MathType API Integration object
     * @returns {CKEditor5Integration} the integration object
     */ _addIntegration() {
          const { editor } = this;
          /**
       * Integration model constructor attributes.
       * @type {integrationModelProperties}
       */ const integrationProperties = {};
          integrationProperties.environment = {};
          integrationProperties.environment.editor = "CKEditor5";
          integrationProperties.environment.editorVersion = "5.x";
          integrationProperties.version = packageInfo.version;
          integrationProperties.editorObject = editor;
          integrationProperties.serviceProviderProperties = {};
          integrationProperties.serviceProviderProperties.URI = "https://www.wiris.net/demo/plugins/app";
          integrationProperties.serviceProviderProperties.server = "java";
          integrationProperties.target = editor.sourceElement;
          integrationProperties.scriptName = "bundle.js";
          integrationProperties.managesLanguage = true;
          // etc
          // There are platforms like Drupal that initialize CKEditor but they hide or remove the container element.
          // To avoid a wrong behavior, this integration only starts if the workspace container exists.
          let integration;
          if (integrationProperties.target) {
              // Instance of the integration associated to this editor instance
              integration = new CKEditor5Integration(integrationProperties);
              integration.init();
              integration.listeners.fire("onTargetReady", {});
              integration.checkElement();
              this.listenTo(editor.editing.view.document, "click", (evt, data)=>{
                  // Is Double-click
                  if (data.domEvent.detail === 2) {
                      integration.doubleClickHandler(data.domTarget, data.domEvent);
                      evt.stop();
                  }
              }, {
                  priority: "highest"
              });
          }
          return integration;
      }
      /**
     * Add the MathType and ChemType commands to the editor
     */ _addCommands() {
          const { editor } = this;
          // Add command to open the formula editor
          editor.commands.add("MathType", new MathTypeCommand(editor));
          // Add command to open the chemistry formula editor
          editor.commands.add("ChemType", new ChemTypeCommand(editor));
      }
      /**
     * Add the buttons for MathType and ChemType
     * @param {CKEditor5Integration} integration the integration object
     */ _addViews(integration) {
          const { editor } = this;
          // Check if MathType editor is enabled
          if (Configuration.get("editorEnabled")) {
              // Add button for the formula editor
              editor.ui.componentFactory.add("MathType", (locale)=>{
                  const view = new ckeditor5.ButtonView(locale);
                  // View is enabled iff command is enabled
                  view.bind("isEnabled").to(editor.commands.get("MathType"), "isEnabled");
                  view.set({
                      label: StringManager.get("insert_math", integration.getLanguage()),
                      icon: mathIcon,
                      tooltip: true
                  });
                  // Callback executed once the image is clicked.
                  view.on("execute", ()=>{
                      editor.execute("MathType", {
                          integration
                      });
                  });
                  return view;
              });
          }
          // Check if ChemType editor is enabled
          if (Configuration.get("chemEnabled")) {
              // Add button for the chemistry formula editor
              editor.ui.componentFactory.add("ChemType", (locale)=>{
                  const view = new ckeditor5.ButtonView(locale);
                  // View is enabled iff command is enabled
                  view.bind("isEnabled").to(editor.commands.get("ChemType"), "isEnabled");
                  view.set({
                      label: StringManager.get("insert_chem", integration.getLanguage()),
                      icon: chemIcon,
                      tooltip: true
                  });
                  // Callback executed once the image is clicked.
                  view.on("execute", ()=>{
                      editor.execute("ChemType", {
                          integration
                      });
                  });
                  return view;
              });
          }
          // Observer for the Double-click event
          editor.editing.view.addObserver(ckeditor5.ClickObserver);
      }
      /**
     * Registers the <mathml> element in the schema
     */ _addSchema() {
          const { schema } = this.editor.model;
          schema.register("mathml", {
              inheritAllFrom: "$inlineObject",
              allowAttributes: [
                  "formula",
                  "htmlContent"
              ]
          });
      }
      /**
     * Add the downcast and upcast converters
     */ _addConverters(integration) {
          const { editor } = this;
          // Editing view -> Model
          editor.conversion.for("upcast").elementToElement({
              view: {
                  name: "span",
                  classes: "ck-math-widget"
              },
              model: (viewElement, { writer: modelWriter })=>{
                  const formula = MathML.safeXmlDecode(viewElement.getChild(0).getAttribute("data-mathml"));
                  return modelWriter.createElement("mathml", {
                      formula
                  });
              }
          });
          // Data view -> Model
          editor.data.upcastDispatcher.on("element:math", (evt, data, conversionApi)=>{
              const { consumable, writer } = conversionApi;
              const { viewItem } = data;
              // When element was already consumed then skip it.
              if (!consumable.test(viewItem, {
                  name: true
              })) {
                  return;
              }
              // If we encounter any <math> with a LaTeX annotation inside,
              // convert it into a "$$...$$" string.
              const isLatex = mathIsLatex(viewItem); // eslint-disable-line no-use-before-define
              // Get the formula of the <math> (which is all its children).
              const processor = new ckeditor5.XmlDataProcessor(editor.editing.view.document);
              // Only god knows why the following line makes viewItem lose all of its children,
              // so we obtain isLatex before doing this because we need viewItem's children for that.
              const upcastWriter = new ckeditor5.UpcastWriter(editor.editing.view.document);
              const viewDocumentFragment = upcastWriter.createDocumentFragment(viewItem.getChildren());
              // and obtain the attributes of <math> too!
              const mathAttributes = [
                  ...viewItem.getAttributes()
              ].map(([key, value])=>` ${key}="${value}"`).join("");
              // We process the document fragment
              let formula = processor.toData(viewDocumentFragment) || "";
              // And obtain the complete formula
              formula = Util.htmlSanitize(`<math${mathAttributes}>${formula}</math>`);
              // Replaces the < & > characters to its HTMLEntity to avoid render issues.
              formula = formula.replaceAll('"<"', '"&lt;"').replaceAll('">"', '"&gt;"').replaceAll("><<", ">&lt;<");
              /* Model node that contains what's going to actually be inserted. This can be either:
              - A <mathml> element with a formula attribute set to the given formula, or
              - If the original <math> had a LaTeX annotation, then the annotation surrounded by "$$...$$" */ const modelNode = isLatex ? writer.createText(Parser.initParse(formula, integration.getLanguage())) : writer.createElement("mathml", {
                  formula
              });
              // Find allowed parent for element that we are going to insert.
              // If current parent does not allow to insert element but one of the ancestors does
              // then split nodes to allowed parent.
              const splitResult = conversionApi.splitToAllowedParent(modelNode, data.modelCursor);
              // When there is no split result it means that we can't insert element to model tree, so let's skip it.
              if (!splitResult) {
                  return;
              }
              // Insert element on allowed position.
              conversionApi.writer.insert(modelNode, splitResult.position);
              // Consume appropriate value from consumable values list.
              consumable.consume(viewItem, {
                  name: true
              });
              const parts = conversionApi.getSplitParts(modelNode);
              // Set conversion result range.
              data.modelRange = writer.createRange(conversionApi.writer.createPositionBefore(modelNode), conversionApi.writer.createPositionAfter(parts[parts.length - 1]));
              // Now we need to check where the `modelCursor` should be.
              if (splitResult.cursorParent) {
                  // If we split parent to insert our element then we want to continue conversion in the new part of the split parent.
                  //
                  // before: <allowed><notAllowed>foo[]</notAllowed></allowed>
                  // after:  <allowed><notAllowed>foo</notAllowed><converted></converted><notAllowed>[]</notAllowed></allowed>
                  data.modelCursor = conversionApi.writer.createPositionAt(splitResult.cursorParent, 0);
              } else {
                  // Otherwise just continue after inserted element.
                  data.modelCursor = data.modelRange.end;
              }
          });
          // Data view -> Model
          editor.data.upcastDispatcher.on("element:img", (evt, data, conversionApi)=>{
              const { consumable, writer } = conversionApi;
              const { viewItem } = data;
              // Only upcast when is wiris formula
              if (viewItem.getClassNames().next().value !== "Wirisformula") {
                  return;
              }
              const mathAttributes = [
                  ...viewItem.getAttributes()
              ].map(([key, value])=>` ${key}="${value}"`).join("");
              let htmlContent = Util.htmlSanitize(`<img${mathAttributes}>`);
              const modelNode = writer.createElement("mathml", {
                  htmlContent
              });
              // Find allowed parent for element that we are going to insert.
              // If current parent does not allow to insert element but one of the ancestors does
              // then split nodes to allowed parent.
              const splitResult = conversionApi.splitToAllowedParent(modelNode, data.modelCursor);
              // When there is no split result it means that we can't insert element to model tree, so let's skip it.
              if (!splitResult) {
                  return;
              }
              // Insert element on allowed position.
              conversionApi.writer.insert(modelNode, splitResult.position);
              // Consume appropriate value from consumable values list.
              consumable.consume(viewItem, {
                  name: true
              });
              const parts = conversionApi.getSplitParts(modelNode);
              // Set conversion result range.
              data.modelRange = writer.createRange(conversionApi.writer.createPositionBefore(modelNode), conversionApi.writer.createPositionAfter(parts[parts.length - 1]));
              // Now we need to check where the `modelCursor` should be.
              if (splitResult.cursorParent) {
                  // If we split parent to insert our element then we want to continue conversion in the new part of the split parent.
                  //
                  // before: <allowed><notAllowed>foo[]</notAllowed></allowed>
                  // after:  <allowed><notAllowed>foo</notAllowed><converted></converted><notAllowed>[]</notAllowed></allowed>
                  data.modelCursor = conversionApi.writer.createPositionAt(splitResult.cursorParent, 0);
              } else {
                  // Otherwise just continue after inserted element.
                  data.modelCursor = data.modelRange.end;
              }
          });
          /**
       * Whether the given view <math> element has a LaTeX annotation element.
       * @param {*} math
       * @returns {bool}
       */ function mathIsLatex(math) {
              const semantics = math.getChild(0);
              if (!semantics || semantics.name !== "semantics") return false;
              for (const child of semantics.getChildren()){
                  if (child.name === "annotation" && child.getAttribute("encoding") === "LaTeX") {
                      return true;
                  }
              }
              return false;
          }
          function createViewWidget(modelItem, { writer: viewWriter }) {
              const widgetElement = viewWriter.createContainerElement("span", {
                  class: "ck-math-widget"
              });
              const mathUIElement = createViewImage(modelItem, {
                  writer: viewWriter
              }); // eslint-disable-line no-use-before-define
              if (mathUIElement) {
                  viewWriter.insert(viewWriter.createPositionAt(widgetElement, 0), mathUIElement);
              }
              return ckeditor5.toWidget(widgetElement, viewWriter);
          }
          function createViewImage(modelItem, { writer: viewWriter }) {
              const htmlDataProcessor = new ckeditor5.HtmlDataProcessor(viewWriter.document);
              const formula = modelItem.getAttribute("formula");
              const htmlContent = modelItem.getAttribute("htmlContent");
              if (!formula && !htmlContent) {
                  return null;
              }
              let imgElement = null;
              if (htmlContent) {
                  imgElement = htmlDataProcessor.toView(htmlContent).getChild(0);
              } else if (formula) {
                  const mathString = formula.replaceAll('ref="<"', 'ref="&lt;"');
                  const imgHtml = Parser.initParse(mathString, integration.getLanguage());
                  imgElement = htmlDataProcessor.toView(imgHtml).getChild(0);
                  // Add HTML element (<img>) to model
                  viewWriter.setAttribute("htmlContent", imgHtml, modelItem);
              }
              /* Although we use the HtmlDataProcessor to obtain the attributes,
         *  we must create a new EmptyElement which is independent of the
         *  DataProcessor being used by this editor instance
         */ if (imgElement) {
                  return viewWriter.createEmptyElement("img", imgElement.getAttributes(), {
                      renderUnsafeAttributes: [
                          "src"
                      ]
                  });
              }
              return null;
          }
          // Model -> Editing view
          editor.conversion.for("editingDowncast").elementToElement({
              model: "mathml",
              view: createViewWidget
          });
          // Model -> Data view
          editor.conversion.for("dataDowncast").elementToElement({
              model: "mathml",
              view: createDataString
          });
          /**
       * Makes a copy of the given view node.
       * @param {module:engine/view/node~Node} sourceNode Node to copy.
       * @returns {module:engine/view/node~Node} Copy of the node.
       */ function clone(viewWriter, sourceNode) {
              if (sourceNode.is("text")) {
                  return viewWriter.createText(sourceNode.data);
              }
              if (sourceNode.is("element")) {
                  if (sourceNode.is("emptyElement")) {
                      return viewWriter.createEmptyElement(sourceNode.name, sourceNode.getAttributes());
                  }
                  const element = viewWriter.createContainerElement(sourceNode.name, sourceNode.getAttributes());
                  for (const child of sourceNode.getChildren()){
                      viewWriter.insert(viewWriter.createPositionAt(element, "end"), clone(viewWriter, child));
                  }
                  return element;
              }
              throw new Exception("Given node has unsupported type."); // eslint-disable-line no-undef
          }
          function createDataString(modelItem, { writer: viewWriter }) {
              const htmlDataProcessor = new ckeditor5.HtmlDataProcessor(viewWriter.document);
              // Load img element
              let mathString = modelItem.getAttribute("htmlContent") || Parser.endParseSaveMode(modelItem.getAttribute("formula"));
              const sourceMathElement = htmlDataProcessor.toView(mathString).getChild(0);
              return clone(viewWriter, sourceMathElement);
          }
          // This stops the view selection getting into the <span>s and messing up caret movement
          editor.editing.mapper.on("viewToModelPosition", ckeditor5.viewToModelPositionOutsideModelElement(editor.model, (viewElement)=>viewElement.hasClass("ck-math-widget")));
          // Keep a reference to the original get and set function.
          const { get, set } = editor.data;
          /**
       * Hack to transform $$latex$$ into <math> in editor.getData()'s output.
       */ editor.data.on("get", (e)=>{
              let output = e.return;
              const parsedResult = Parser.endParse(output);
              // Cleans all the semantics tag for safexml
              // including the handwritten data points
              e.return = MathML.removeSafeXMLSemantics(parsedResult);
          }, {
              priority: "low"
          });
          /**
       * Hack to transform <math> with LaTeX into $$LaTeX$$ and formula images in editor.setData().
       */ editor.data.on("set", (e, args)=>{
              // Retrieve the data to be set on the CKEditor.
              let modifiedData = args[0];
              // Regex to find all mathml formulas.
              const regexp = /(<img\b[^>]*>)|(<math(.*?)<\/math>)/gm;
              const formulas = [];
              let formula;
              // Both data.set from the source plugin and console command are taken into account as the data received is MathML or an image containing the MathML.
              while((formula = regexp.exec(modifiedData)) !== null){
                  formulas.push(formula[0]);
              }
              // Loop to find LaTeX and formula images and replace the MathML for the both.
              formulas.forEach((formula)=>{
                  if (formula.includes('encoding="LaTeX"')) {
                      // LaTeX found.
                      let latex = "$$$" + Latex.getLatexFromMathML(formula) + "$$$"; // We add $$$ instead of $$ because the replace function ignores one $.
                      modifiedData = modifiedData.replace(formula, latex);
                  } else if (formula.includes("<img")) {
                      // If we found a formula image, we should find MathML data, and then substitute the entire image.
                      const regexp = /«math\b[^»]*»(.*?)«\/math»/g;
                      const safexml = formula.match(regexp);
                      if (safexml !== null) {
                          let decodeXML = MathML.safeXmlDecode(safexml[0]);
                          modifiedData = modifiedData.replace(formula, decodeXML);
                      }
                  }
              });
              args[0] = modifiedData;
          }, {
              priority: "high"
          });
      }
      /**
     * Expose the WirisPlugin variable to the window
     */ // eslint-disable-next-line class-methods-use-this
      _exposeWiris() {
          window.WirisPlugin = {
              Core,
              Parser,
              Image,
              MathML,
              Util,
              Configuration,
              Listeners,
              IntegrationModel,
              currentInstance,
              Latex
          };
      }
  }

  return MathType;

}));
//# sourceMappingURL=index.umd.js.map
