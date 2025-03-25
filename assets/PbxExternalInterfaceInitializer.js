/**
 * Class responsible for initializing external interface for Printbox editor
 */
export class PbxExternalInterfaceInitializer {
  pbxSessionKeyManager = null;
  #pbxCartItemAdder = null;
  #pbxEditorConfigState = null;

  /**
   * @param {Object} params - Constructor parameters
   * @param {Object} params.pbxSessionKeyManager - Session key manager instance
   * @param {Object} params.pbxCartItemAdder - Cart item adder instance
   * @param {Object} params.pbxEditorConfigState - Editor config state instance
   * @throws {Error} When required dependencies are not provided
   */
  constructor({
    pbxSessionKeyManager,
    pbxCartItemAdder,
    pbxEditorConfigState,
  }) {
    if (!pbxSessionKeyManager || !pbxCartItemAdder || !pbxEditorConfigState)
      throw new Error(
        "You have to provide all dependencies to PbxExternalInterfaceInitializer"
      );

    if (
      !pbxEditorConfigState ||
      typeof pbxEditorConfigState.getState !== "function"
    ) {
      throw new Error(
        "Invalid configState object. It must have a getState method."
      );
    }

    this.pbxSessionKeyManager = pbxSessionKeyManager;
    this.#pbxCartItemAdder = pbxCartItemAdder;
    this.#pbxEditorConfigState = pbxEditorConfigState;
  }

  /**
   * Assigns external interface methods to window.printbox object
   */
  assignExternalInterface = () => {
    Object.assign(window.printbox, {
      refreshSession: this.#refreshSession,
      authUserRequest: this.#authUserRequest,
      hideECommerce: this.#hideECommerce,
      goToCartFinished: this.#goToCartFinished,
      showECommerce: () => {},
    });
  };

  /**
   * Refreshes the user session by retrieving a new session key
   * @returns {Promise<string>} Session key
   * @private
   */
  #refreshSession = async () => {
    return await this.pbxSessionKeyManager.retrieveCustomerSessionKey();
  };

  /**
   * Handles user authentication request
   * @returns {Promise<string|null>} Session key if authenticated, null otherwise
   * @private
   */
  #authUserRequest = async () => {
    const sessionKey =
      await this.pbxSessionKeyManager.retrieveCustomerSessionKey();

    if (!sessionKey) {
      localStorage.setItem(
        "printbox_last_project_url",
        window.location.pathname + window.location.search + window.location.hash
      );

      window.location.href =
        "/account/login?return_url=" + window.location.pathname;
    }

    return sessionKey;
  };

  /**
   * Hides the e-commerce interface
   * @private
   */
  #hideECommerce = () => {
    const element = document.getElementById("customModal");
    if (!element) return;

    element.style.display = "block";
  };

  /**
   * Handles adding project to cart when editor is finished
   * @param {*} _ - Unused parameter
   * @param {Object} data - Project data
   * @param {Object} data.project - Project details
   * @param {boolean} data.redirectToCartAfterAddingProjectToCart - Whether to redirect to cart after adding
   * @returns {Promise<boolean>} Success status
   * @private
   */
  #goToCartFinished = (_, data) => {
    return new Promise(async (resolve, _) => {
      try {
        this.#pbxCartItemAdder.handleAddToCart({
          project: data.project,
          variantId: this.#pbxEditorConfigState.getState().variantId,
          redirectToCartAfterAdding:
            !!data.redirectToCartAfterAddingProjectToCart,
        });

        resolve(true);
      } catch (error) {
        console.error(error);
        resolve(false);
      }
    });
  };
}
