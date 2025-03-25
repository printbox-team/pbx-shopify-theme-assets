import { PbxEditorRouteUtils } from "pbx-editor-route-utils";

export class PbxEditorInitializer {
  #pbxEditorConfigState = null;

  constructor(configState) {
    if (!configState || typeof configState.getState !== "function") {
      throw new Error(
        "Invalid configState object. It must have a getState method."
      );
    }
    this.#pbxEditorConfigState = configState;
  }

  initEditor() {
    if (!window.printbox)
      throw new Error("Printbox isn't available in window object");
    PbxEditorRouteUtils.appendEditorPathnameWhenDoesntExist();

    window.printbox.setEditorConfig(this.getEditorConfig());
  }

  getEditorConfig() {
    const pbxState = this.#pbxEditorConfigState.getState();
    return {
      currency: pbxState.currency,
      instanceId: pbxState.instanceId,
      language: pbxState.language,
      locale: pbxState.locale,
      moduleId: pbxState.moduleId,
      productId: pbxState.productId,
      productFamilyId: pbxState.productFamilyId,
      storeName: pbxState.storeName,
      useIframe: false,
      isEmbededInWebview: false,
      sessionId: pbxState.sessionId,
      projectId: pbxState.projectId,
      attributeValues: pbxState.attributeValues
        ? pbxState.attributeValues
        : null,
      ecommerceVariant: "shopify",
    };
  }
}
