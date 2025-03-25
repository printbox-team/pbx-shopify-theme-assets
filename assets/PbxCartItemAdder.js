import { PbxProjectAttributesExtractors } from "pbx-project-attributes-extractors";

/**
 * Class responsible for handling adding Printbox projects to Shopify cart
 */
export class PbxCartItemAdder {
  #pbxProjectsApiRepository = null;
  /**
   * @param {Object} params - Constructor parameters
   * @param {PbxProjectsApiRepository} params.pbxProjectsApiRepository - PbxProjectsApiRepository instance
   */
  constructor({ pbxProjectsApiRepository }) {
    if (!pbxProjectsApiRepository) {
      throw new Error("Invalid PbxCartItemAdder constructor parameters");
    }

    this.#pbxProjectsApiRepository = pbxProjectsApiRepository;
  }

  /**
   * Handles adding a Printbox project to Shopify cart
   * @param {Object} params - Parameters for adding to cart
   * @param {Object} params.project - Printbox project object
   * @param {string} params.variantId - Shopify variant ID
   * @param {boolean} [params.redirectToCartAfterAdding=true] - Whether to redirect to cart page after adding
   */
  handleAddToCart = async ({
    project,
    variantId,
    redirectToCartAfterAdding = true,
  }) => {
    let properties = {};

    if (!project.params?.[0]?.attributes) {
      const projectData = await this.#pbxProjectsApiRepository.getProjectData(
        project.id
      );

      const attributes = await this.#retrieveProjectAttributes(
        project.productFamilyId,
        projectData
      );

      if (attributes) {
        for (let key of Object.keys(attributes)) {
          let value = attributes[key];
          properties[value.key] = value.value;
        }
      }
    } else {
      project.params?.[0]?.attributes?.forEach((attribute) => {
        properties[attribute.displayName] = attribute.value.displayName;
      });
    }

    properties["Project name"] = project.name;

    properties["Price Gross"] =
      project.price?.gross ?? project.product.priceGross;
    properties["Price Net"] = project.price?.net ?? project.product.priceNet;
    properties["Project ID"] = project.id;
    properties["productFamilyId"] = project.productFamilyId;

    if (!project.thumbnailUrl.includes("no-thumbnail")) {
      properties["Printbox Thumbnail URL"] = project.thumbnailUrl;
    }

    await this.#processAddToCart({
      variantId,
      quantity: project.quantity,
      properties,
    });

    if (redirectToCartAfterAdding) {
      window.location.href = "/cart";
    }
  };

  /**
   * Processes adding item to cart, handling existing items
   * @param {Object} params - Parameters for processing cart addition
   * @param {string} params.variantId - Shopify variant ID
   * @param {number} params.quantity - Quantity to add
   * @param {Object} params.properties - Line item properties
   * @private
   */
  #processAddToCart = async ({ variantId, quantity, properties }) => {
    const payload = {
      items: [
        {
          id: Number(variantId),
          quantity: quantity,
          properties: properties,
        },
      ],
    };

    const projectId = properties["Project ID"];
    const foundItem = await this.#getVariantFromCartIfExists(
      variantId,
      projectId
    );

    if (foundItem) {
      let qty = foundItem.foundItem.quantity;

      let url = new URL(window.location.href);
      let params = new URLSearchParams(url.search);
      const skipWhenAddToCart = params.get("skipWhenAddToCart");

      if (!skipWhenAddToCart) {
        qty += 1;
      }

      await this.#increaseVariantQuantity(
        foundItem.foundItemIndex,
        qty,
        properties
      );
      return;
    }

    await fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  /**
   * Checks if variant with given project ID already exists in cart
   * @param {string} variantId - Shopify variant ID
   * @param {string} projectId - Printbox project ID
   * @returns {Promise<Object|null>} Found item and index if exists, null otherwise
   * @private
   */
  #getVariantFromCartIfExists = async (variantId, projectId) => {
    const resp = await fetch(window.Shopify.routes.root + "cart.js");
    const cart = await resp.json();
    let foundItemIndex = null;

    const foundItem = cart.items.find((item, index) => {
      if (
        item.id.toString() === variantId.toString() &&
        item.properties["Project ID"] === projectId
      ) {
        foundItemIndex = index;
        return true;
      }
    });

    return foundItem ? { foundItem, foundItemIndex: foundItemIndex + 1 } : null;
  };

  /**
   * Updates quantity of existing cart item
   * @param {number} index - Line item index
   * @param {number} quantity - New quantity
   * @param {Object} parameters - Additional parameters to update
   * @returns {Promise<Object>} Updated cart data
   * @private
   */
  #increaseVariantQuantity = async (index, quantity, properties) => {
    const resp = await fetch(window.Shopify.routes.root + "cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        line: index,
        quantity: quantity,
        properties,
      }),
    });

    const data = await resp.json();

    return data;
  };
  #retrieveProjectAttributes = async (pfId, project) => {
    const pfFamilies = await this.#pbxProjectsApiRepository.loadProductFamilies(
      [pfId]
    );

    return PbxProjectAttributesExtractors.getAttributesList(
      project,
      pfFamilies[0]
    );
  };
}
