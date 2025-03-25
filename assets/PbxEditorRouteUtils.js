export class PbxEditorRouteUtils {
  static #EDITOR_PATHNAME = "editor";

  static onEditorPathExistsInUrl(cb) {
    const lastPathnameSegment = this.#getCurrentUrlLastPathnameSegment();
    if (!lastPathnameSegment.includes(this.#EDITOR_PATHNAME)) return;
    cb(this.#getCurrentUrl());
  }

  static onEditorPathDoesntExistInUrl(cb) {
    const lastPathnameSegment = this.#getCurrentUrlLastPathnameSegment();
    if (lastPathnameSegment.includes(this.#EDITOR_PATHNAME)) return;
    cb(this.#getCurrentUrl());
  }

  static appendEditorPathnameWhenDoesntExist() {
    this.onEditorPathDoesntExistInUrl((url) => {
      url.pathname += `/${this.#EDITOR_PATHNAME}`;
      history.pushState(null, "", url);
    });
  }

  static #getCurrentUrlLastPathnameSegment() {
    const url = this.#getCurrentUrl();
    const segments = url.pathname.split("/");
    return segments[segments.length - 1];
  }

  static #getCurrentUrl() {
    return new URL(window.location.href);
  }
}