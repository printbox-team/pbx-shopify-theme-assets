export class PbxProjectListComponents {
  static createButton = ({ onclick, textContent, icon }) => {
    try {
      const btn = document.createElement("button");
      btn.onclick = onclick;
      btn.classList.add("pbx-project-action-btn");

      const btnTextLabel = document.createElement("span");
      btnTextLabel.textContent = textContent;

      btn.innerHTML += this.#html`
      <div class="pbx-project-action-btn__icon">
        ${icon()}
      </div>
    `;

      btn.appendChild(btnTextLabel);
      return btn;
    } catch (e) {
      console.error(`Something went wrong with create button ${e}`);
    }
  };

  static tableHeaders = () => this.#html`
    <div class="pbx-project-list__col-header col-1-2 hide-on-phone" style="justify-self: center">
      Project
    </div>
    <div class="pbx-project-list__col-header col-2-3 hide-on-tablet">
      Editable
    </div>
    <div class="pbx-project-list__col-header hide-on-tablet col-3-4">
      Created
    </div>
    <div class="pbx-project-list__col-header hide-on-tablet col-4-5">
      Modified
    </div>
    <div class="pbx-project-list__col-header hide-on-tablet col-5-6">
      Ordered
    </div>
    <div class="pbx-project-list__col-header hide-on-tablet col-6-7">
      Deletion
    </div>
    <div class="pbx-project-list__col-header col-7-8 hide-on-phone">
      Actions
    </div>
    <div class="pbx-project-list__divider hide-on-phone"></div>
  `;

  static createAttributeListComponent = (attrList) => {
    if (!Array.isArray(attrList))
      throw new Error("Attributes list must be array");

    let list = "";

    attrList.forEach((it) => {
      list += this.#html`
        <div class="pbx-project-information__attributes__list__item">
          <span class="pbx-project-information__attributes__list__name">${it.key}:</span>
          <span class="pbx-project-information__attributes__list__value"">${it.value}</span>
        </div>
      `;
    });

    return list;
  };

  static #html = (strings, ...values) =>
    String.raw({ raw: strings }, ...values);
}
