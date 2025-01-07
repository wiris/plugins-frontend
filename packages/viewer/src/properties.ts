import { configurationJson, StatusError } from "./services";
import Util from "@wiris/mathtype-html-integration-devkit/src/util";

// Helper types for Config below
type Viewer = "none" | "image" | "mathml" | "latex";
type Wirispluginperformance = "true" | "false";

/**
 * Type representing all the configuration for the viewer.
 */
export interface Config {
  editorServicesRoot: string;
  editorServicesExtension: string;
  backendConfig: {
    wirispluginperformance: Wirispluginperformance;
    wiriseditormathmlattribute: string;
    wiriscustomheaders: object;
  };
  dpi: number;
  element: string;
  lang: string;
  viewer: Viewer;
  zoom: number;
  ignored_containers: string | null;
}

/**
 * Fallback values for the configurations that are not set.
 */
const defaultValues: Config = {
  editorServicesRoot: "https://www.wiris.net/demo/plugins/app/",
  editorServicesExtension: "",
  backendConfig: {
    wirispluginperformance: "true",
    wiriseditormathmlattribute: "data-mathml",
    wiriscustomheaders: {},
  },
  dpi: 96,
  element: "body",
  lang: "en",
  viewer: "none",
  zoom: 1,
  ignored_containers: null,
};

/**
 * This class will handle the parameters defined by the user.
 */
export class Properties {
  private static instance: Properties | null = null;

  render: () => Promise<void> = async () => {};

  // Get URL properties (retrocompatibility).
  config: Config = defaultValues;

  /**
   * Private constructor to avoid multiple instances of the class.
   * To instantiate the class, use the static method  {@link Properties.getInstance}.
   */
  private constructor() {}

  static async getInstance(): Promise<Properties> {
    if (!Properties.instance) {
      Properties.instance = new Properties();
      await Properties.instance.initialize();
    }
    return Properties.instance;
  }

  /**
   * Creates and sets up a new instance of class Properties
   */
  private async initialize(): Promise<void> {
    if (!Properties.instance) {
      console.error("Properties.instance is not set");
      return;
    }
    // Get URL parameters from <script>
    const pluginName = "WIRISplugins.js";
    const script: HTMLScriptElement | null = document.querySelector(`script[src*="${pluginName}"]`);

    // If the absence of the script is an error maybe this should throw
    if (script) {
      this.setProperties(script, pluginName, Properties.instance);
    }

    await Properties.instance.checkServices();

    // Get backend parameters calling the configurationjson service
    try {
      Properties.instance.config.backendConfig = await configurationJson(
        ["wirispluginperformance", "wiriseditormathmlattribute", "wiriscustomheaders"],
        Properties.instance.editorServicesRoot,
        Properties.instance.editorServicesExtension,
        false,
      );

      // We'll always get a string from the wiriscustomheaders backend parameter. It needs to be converted to an object.
      Properties.instance.config.backendConfig.wiriscustomheaders = Util.convertStringToObject(
        Properties.instance.config.backendConfig.wiriscustomheaders,
      );
    } catch (e) {
      if (e instanceof StatusError) {
        // Do nothing; leave default values.
        console.error(e);
      } else {
        throw e;
      }
    }
  }

  /**
   * Initialize properties from <script>
   * @param script
   * @param pluginName
   * @param instance
   */
  private setProperties(script: HTMLScriptElement, pluginName: string, instance: Properties) {
    const pluginNamePosition: number = script.src.lastIndexOf(pluginName);
    const params: string = script.src.substring(pluginNamePosition + pluginName.length);
    const urlParams = new URLSearchParams(params);

    const dpi = urlParams.get("dpi");
    if (dpi !== null && dpi !== undefined) {
      instance.config.dpi = +dpi;
    }

    const element = urlParams.get("element");
    if (element !== null && element !== undefined) {
      instance.config.element = element;
    }

    const lang = urlParams.get("lang");
    if (lang !== null && lang !== undefined) {
      instance.config.lang = lang;
    }

    const viewer = urlParams.get("viewer");
    if (viewer !== null && viewer !== undefined) {
      instance.config.viewer = viewer as Viewer;
    }

    const zoom = urlParams.get("zoom");
    if (zoom !== null && zoom !== undefined) {
      instance.config.zoom = +zoom;
    }

    const ignored_containers = urlParams.get("ignored_containers");
    if (ignored_containers !== null && ignored_containers !== undefined) {
      instance.config.ignored_containers = ignored_containers;
    }
  }

  /**
   * Check if is inside Integrations Services
   * @deprecated This will be removed once the viewer uncouple from the integration services.
   */
  private async checkServices() {
    const path = (document.currentScript as HTMLScriptElement).src;

    if (path.includes("integration/WIRISplugins")) {
      // If the path includes 'integration/WIRISplugins' use PHP Integrations Services
      this.config.editorServicesRoot = path;
      this.config.editorServicesExtension = ".php";
    } else {
      try {
        // We want to know if we are using the integrations java services.
        // So we call the configurationjson service assuming that the path is the one for the Java services.
        // If we get an answer, we know we are using the Java services,
        // otherwise, and since PHP has already been discarded, we'll set the services to wiris.net
        await configurationJson(["wirispluginperformance"], path, "", true);

        this.config.editorServicesRoot = path;
        this.config.editorServicesExtension = "";
      } catch (e) {
        // We do noting.
        // Getting here means that we are not using php nor Java services so we'll stick to the wiris.net default.
      }
    }
  }

  get editorServicesRoot(): string {
    return this.config.editorServicesRoot || defaultValues.editorServicesRoot;
  }

  set editorServicesRoot(editorServicesRoot: string) {
    this.config.editorServicesRoot = editorServicesRoot;
    this.render();
  }

  get editorServicesExtension(): string {
    return this.config.editorServicesExtension || defaultValues.editorServicesExtension;
  }

  set editorServicesExtension(editorServicesExtension: string) {
    this.config.editorServicesExtension = editorServicesExtension;
    this.render();
  }

  /**
   * Return the language.
   * In order of priority, the first of the following that is set is returned:
   * - The lang parameter set in the <script> (WIRISplugin.js?lang=...)
   * - The HTML document language (<html lang=...>).
   * - The language of the browser.
   * - English, by default.
   * @returns {string} Encoded language string.
   */
  get lang(): string {
    const configLang = this.config.lang === "inherit" ? null : this.config.lang;
    return configLang || document.getElementsByTagName("html")[0].lang || navigator.language || defaultValues.lang;
  }

  set lang(lang: string) {
    this.config.lang = lang;
    this.render();
  }

  /**
   * Return the viewer mode for the MathML.
   * In order of priority, the first of the following that is set is returned:
   * - The viewer parameter set in the <script> (WIRISplugin.js?viewer=...)
   * - none, by default.
   */
  get viewer(): Viewer {
    return this.config.viewer || defaultValues.viewer;
  }

  set viewer(viewer: Viewer) {
    this.config.viewer = viewer;
    this.render();
  }

  /**
   * Return the dpi of the images.
   * In order of priority, the first of the following that is set is returned:
   * - The dpi parameter set in the <script> (WIRISplugin.js?dpi=...)
   * - 96, by default.
   */
  get dpi(): number {
    return this.config.dpi || defaultValues.dpi;
  }

  set dpi(dpi: number) {
    this.config.dpi = dpi;
    this.render();
  }

  /**
   * Return the zoom of the images.
   * In order of priority, the first of the following that is set is returned:
   * - The zoom parameter set in the <script> (WIRISplugin.js?zoom=...)
   * - 1, by default.
   */
  get zoom(): number {
    return this.config.zoom || defaultValues.zoom;
  }

  set zoom(zoom: number) {
    this.config.zoom = zoom;
    this.render();
  }

  /**
   * Return the element in which to render formulas.
   * In order of priority, the first of the following that is set is returned:
   * - The zoom parameter set in the <script> (WIRISplugin.js?element=...)
   * - 'body', by default.
   */
  get element(): string {
    return this.config.element || defaultValues.element;
  }

  set element(element: string) {
    this.config.element = element;
    this.render();
  }

  /**
   * Return the Wiris plugin performance.
   * In order of priority, the first of the following that is set is returned:
   * - The backend configuration of the parameter.
   * - true, by default.
   */
  get wirispluginperformance(): Wirispluginperformance {
    return this.config.backendConfig.wirispluginperformance || defaultValues.backendConfig.wirispluginperformance;
  }

  set wirispluginperformance(wirispluginperformance: Wirispluginperformance) {
    this.config.backendConfig.wirispluginperformance = wirispluginperformance;
    this.render();
  }

  /**
   * Return the Wiris MathML attribute.
   * In order of priority, the first of the following that is set is returned:
   * - The backend configuration of the parameter.
   * - data-mathml, by default.
   */
  get wiriseditormathmlattribute(): string {
    return (
      this.config.backendConfig.wiriseditormathmlattribute || defaultValues.backendConfig.wiriseditormathmlattribute
    );
  }

  set wiriseditormathmlattribute(wiriseditormathmlattribute: string) {
    this.config.backendConfig.wiriseditormathmlattribute = wiriseditormathmlattribute;
    this.render();
  }

  get ignored_containers(): string | null {
    return this.config.ignored_containers ?? defaultValues.ignored_containers;
  }

  set ignored_containers(ignored_containers: string) {
    this.config.ignored_containers = ignored_containers;
    this.render();
  }
}
