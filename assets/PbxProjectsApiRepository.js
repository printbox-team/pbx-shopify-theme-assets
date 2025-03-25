export class PbxProjectsApiRepository {
  #editorApiUrl = null;
  #pbxSessionKeyManager = null;
  #shopifyAppUrl = null;
  #storeName = null;

  constructor({
    editorApiUrl,
    pbxSessionKeyManager,
    shopifyApiUrl,
    storeName,
  }) {
    if (
      typeof editorApiUrl !== "string" ||
      !this.#validateURL(editorApiUrl) ||
      typeof pbxSessionKeyManager.retrieveCustomerSessionKey !== "function" ||
      typeof shopifyApiUrl !== "string" ||
      typeof storeName !== "string"
    )
      throw new Error("Invalid PbxProjectsApiRepository params");

    this.#editorApiUrl = editorApiUrl;
    this.#pbxSessionKeyManager = pbxSessionKeyManager;
    this.#shopifyAppUrl = shopifyApiUrl;
    this.#storeName = storeName;
  }

  async deleteProject(projectId) {
    const sessionId =
      await this.#pbxSessionKeyManager.retrieveCustomerSessionKey();

    await fetch(`${this.#editorApiUrl}/api/editor/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        "Session-Id": sessionId,
        "X-Version": "v6",
        "X-Pbx-Store-Name": this.#storeName,
      },
    });
  }

  async loadProjectList() {
    const sessionId =
      await this.#pbxSessionKeyManager.retrieveCustomerSessionKey();

    const resp = await fetch(`${this.#editorApiUrl}/api/editor/projects`, {
      headers: {
        "Session-Id": sessionId,
        "X-Version": "v6",
        "X-Pbx-Store-Name": this.#storeName,
      },
    });

    return resp.json();
  }

  async duplicateProject(projectId) {
    const sessionId =
      await this.#pbxSessionKeyManager.retrieveCustomerSessionKey();

    const resp = await fetch(
      `${this.#editorApiUrl}/api/editor/projects/${projectId}/duplicate/`,
      {
        method: "POST",
        headers: {
          "Session-Id": sessionId,
          "X-Version": "v6",
          "X-Pbx-Store-Name": this.#storeName,
        },
      }
    );

    return resp.json();
  }

  async getProjectData(projectId) {
    const sessionId =
      await this.#pbxSessionKeyManager.retrieveCustomerSessionKey();

    const resp = await fetch(
      `${this.#editorApiUrl}/api/editor/projects/${projectId}`,
      {
        headers: {
          "Session-Id": sessionId,
          "X-Version": "v6",
          "X-Pbx-Store-Name": this.#storeName,
        },
      }
    );

    return resp.json();
  }

  async loadProductFamilies(productFamiliesIdsCollection) {
    const sessionId =
      await this.#pbxSessionKeyManager.retrieveCustomerSessionKey();

    const resp = await fetch(
      `${
        this.#editorApiUrl
      }/api/editor/product-families/?ids=[${productFamiliesIdsCollection}]`,
      {
        headers: {
          "Session-Id": sessionId,
          "X-Version": "v6",
          "X-Pbx-Store-Name": this.#storeName,
        },
      }
    );

    return resp.json();
  }

  async loadProductById({ project, shopId }) {
    const resp = await fetch(
      `${this.#shopifyAppUrl}/api/product?shopId=${shopId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project,
        }),
      }
    );

    return await resp.json();
  }

  async editProjectName(projectId, newName) {
    const sessionId =
      await this.#pbxSessionKeyManager.retrieveCustomerSessionKey();

    await fetch(`${this.#editorApiUrl}/api/editor/projects/${projectId}/`, {
      method: "POST",
      headers: {
        "Session-Id": sessionId,
        "X-Version": "v6",
        "X-Pbx-Store-Name": this.#storeName,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
      }),
    });
  }

  #validateURL(url) {
    const regex = /^https:\/\/.+/;
    return regex.test(url);
  }
}
