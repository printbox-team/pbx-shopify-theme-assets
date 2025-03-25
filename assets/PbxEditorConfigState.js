export class PbxEditorConfigState {
  static #currency = null;
  static #instanceId = null;
  static #language = null;
  static #locale = null;
  static #moduleId = null;
  static #productId = null;
  static #productFamilyId = null;
  static #storeName = null;
  static #sessionId = null;
  static #projectId = null;
  static #variantId = null;
  static #attributeValues = null;

  static getState() {
    return {
      currency: this.#currency,
      instanceId: this.#instanceId,
      language: this.#language,
      locale: this.#locale,
      moduleId: this.#moduleId,
      productId: this.#productId,
      productFamilyId: this.#productFamilyId,
      storeName: this.#storeName,
      sessionId: this.#sessionId,
      projectId: this.#projectId,
      variantId: this.#variantId,
      attributeValues: this.#attributeValues
    };
  }

  static setCurrency(value) {
    this.#currency = value;
  }

  static setInstanceId(value) {
    this.#instanceId = value;
  }

  static setLanguage(value) {
    this.#language = value;
  }

  static setLocale(value) {
    this.#locale = value;
  }

  static setModuleId(value) {
    this.#moduleId = value;
  }

  static setProductId(value) {
    this.#productId = value;
  }

  static setProductFamilyId(value) {
    this.#productFamilyId = value;
  }

  static setStoreName(value) {
    this.#storeName = value;
  }

  static setSessionId(value) {
    this.#sessionId = value;
  }

  static setProjectId(value) {
    this.#projectId = value;
  }

  static setVariantId(value) {
    this.#variantId = value;
  }

  static setAttributeValues(value) {
    this.#attributeValues = value
  }
}
