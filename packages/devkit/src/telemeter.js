import init, { Telemeter as TelemeterWASM } from "@wiris/telemeter-wasm";

/**
 * @classdesc
 * This class implements the @wiris/telemeter-wasm. A utility that helps our Solutions to send the data
 * to Telemetry in a more comfortable and homogeneous way.
 */
export default class Telemeter {
  /**
   * Inits Telemeter class.
   * The parameters structures are defiended on {@link [Telemeter API](https://github.com/wiris/telemeter/blob/main/docs/USAGE.md#telemeter-api)}
   * @param {Object} telemeterAttributes.solution - The product that send data to Telemetry.
   * @param {Object} telemeterAttributes.hosts - Data about the environment where solution is integrated.
   * @param {Object} telemeterAttributes.config - Configuration parameters.
   */
  static init(telemeterAttributes) {
    if (!this.telemeter && !this.waitingForInit) {
      this.waitingForInit = true;
      init(telemeterAttributes.url)
        .then(() => {
          this.telemeter = new TelemeterWASM(
            telemeterAttributes.solution,
            telemeterAttributes.hosts,
            telemeterAttributes.config,
          );
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (this.waitingForInit = false));
    }
  }

  /**
   * Closes the Telemetry Session. After calling this method no data will be added to the Telemetry Session.
   */
  static async finish() {
    if (!this.telemeter) return;

    try {
      const local_telemeter = this.telemeter;
      this.telemeter = undefined;
      await local_telemeter.finish();
    } catch (e) {
      console.error(e);
    }
  }
}
