export class PbxEditorScriptLoader {
  #instance_id = "";

  constructor(instanceId) {
    if (!instanceId) throw new Error("You have to provide instance id to PbxEditorScriptLoader instance");
    this.#instance_id = instanceId;
  }

  async loadEditor(onLoaded) {
    await this.#loadScriptAsync(
      this.#getEditorUrl()
    );

    onLoaded()
  }

  #getEditorUrl() {
    return `https://js-cdn.getprintbox.com/init/${this.#instance_id}/init.min.js`;
  }

  #loadScriptAsync(uri) {
    return new Promise((resolve, _) => {
      const tag = document.createElement("script");
      tag.src = uri;
      tag.async = true;
      tag.onload = () => {
        resolve();
      };
      tag.rel = "prefetch";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
  }
}