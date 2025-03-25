import { PbxEditorConfigState } from "pbx-editor-config-state";

export class PbxProductVariantHandler {
  #shopifyConfigProvider = null;

  constructor(shopifyConfigProvider) {
    this.#shopifyConfigProvider = shopifyConfigProvider;
  }

  onVariantChangeEvent(variantId) {
    const availableVariants = this.#getProductVariantsWithMetafields();
    const foundVariant = availableVariants.find(it => it.id === variantId);
    PbxEditorConfigState.setVariantId(variantId);

    if (Object.keys(foundVariant.metafields).length !== 0) {
      const { product_family_id, product_id, module_id, attribute_values_dict } = foundVariant.metafields;

      PbxEditorConfigState.setAttributeValues(attribute_values_dict);
      PbxEditorConfigState.setModuleId(module_id);
      PbxEditorConfigState.setProductId(product_id);
      PbxEditorConfigState.setProductFamilyId(product_family_id);
    } else {
      const { productPrintboxMetafields } = this.#shopifyConfigProvider();

      PbxEditorConfigState.setAttributeValues(null);
      PbxEditorConfigState.setModuleId(productPrintboxMetafields.module_id);
      PbxEditorConfigState.setProductId(productPrintboxMetafields.product_id);
      PbxEditorConfigState.setProductFamilyId(productPrintboxMetafields.product_family_id);
    }
  }

  #getProductVariantsWithMetafields() {
    const { pbxProductVariantsMetafields, productVariants } = this.#shopifyConfigProvider();
    if (pbxProductVariantsMetafields.length !== productVariants.length) {
      throw new Error("Variants couldn't be mapped to metafields");
    }

    return productVariants.map((variant, index) => ({
      ...variant,
      metafields: pbxProductVariantsMetafields[index]
    }));
  }
}