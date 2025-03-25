export class PbxProjectAttributesExtractors {
  static getProductFamiliesIdsCollectionFromProjectList = (projectList) => {
    return Array.from(new Set(projectList.map((it) => it.productFamilyId)));
  };

  static getAttributesList = (project, productFamily) => {
    const attrsValues =
      PbxProjectAttributesExtractors.#extractPfsAttributesValuesIdWithDisplayName(
        productFamily
      );
    const attrsDisplayNames =
      PbxProjectAttributesExtractors.#extractPfsAttributesIdWithDisplayName(
        productFamily
      );

    const projectAttrs = project?.params[0]?.attributeValues || [];

    return Object.entries(projectAttrs).map(([key, value]) => {
      return {
        key: attrsDisplayNames.find((it) => it.id === key).displayName,
        value: attrsValues.find((it) => it.id === value).displayName,
      };
    });
  };

  static #extractPfsAttributesIdWithDisplayName = (productFamily) => {
    const attributes = productFamily.attributes;

    return attributes.map((it) => ({
      id: it.id,
      displayName: it.displayName,
    }));
  };

  static #extractPfsAttributesValuesIdWithDisplayName = (productFamily) => {
    const attributes = productFamily.attributes;
    const attributesValues = attributes.map((it) => it.values).flat();

    return attributesValues.map((it) => ({
      id: it.id,
      displayName: it.displayName,
    }));
  };
}
