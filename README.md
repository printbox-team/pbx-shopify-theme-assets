## 1. Copy assets / snippets

- Copy all files from `assets` directory to your Shopify theme's `assets` folder
- Copy all files from `snippets` directory to your Shopify theme's `snippets` folder

## 2. Add importmap to your theme.liquid layout

```html
<script type="importmap">
  {
    "imports": {
      "pbx-editor-config-state": "{{ 'PbxEditorConfigState.js' | asset_url }}",
      "pbx-session-key-manager": "{{ 'PbxSessionKeyManager.js' | asset_url }}",
      "pbx-editor-route-utils": "{{ 'PbxEditorRouteUtils.js' | asset_url }}",
      "pbx-external-interface-initializer": "{{ 'PbxExternalInterfaceInitializer.js' | asset_url }}",
      "pbx-editor-initializer": "{{ 'PbxEditorInitializer.js' | asset_url }}",
      "pbx-editor-script-loader": "{{ 'PbxEditorScriptLoader.js' | asset_url }}",
      "pbx-editor-route-utils": "{{ 'PbxEditorRouteUtils.js' | asset_url }}",
      "pbx-product-variant-handler": "{{ 'PbxProductVariantHandler.js' | asset_url }}",
      "printbox": "{{ 'PrintboxModuleInitializer.js' | asset_url }}",
      "pbx-projects-api-repository": "{{ 'PbxProjectsApiRepository.js' | asset_url }}",
      "pbx-project-attributes-extractors": "{{ 'PbxProjectAttributesExtractors.js' | asset_url }}",
      "pbx-project-list-components": "{{ 'PbxProjectListComponents.js' | asset_url }}",
      "pbx-cart-item-adder": "{{ 'PbxCartItemAdder.js' | asset_url }}"
    }
  }
</script>
```

## 3. Include printbox-editor-modal snippet to product card layout

> **Important:** The "Customize" button must be placed before the modal snippet in your code for proper functionality.

```html
<button
  class="product-form__submit button button--full-width"
  type="button"
  id="openModalButton"
>
  Customize
</button>

{%- render 'printbox-editor-modal' -%}
```

> **Important:** If you want to display the project thumbnail in the cart instead of the default Shopify product image, you can extract the thumbnail URL from item properties using `Printbox Thumbnail URL` parameter.

## 4. Configure editing project from cart page

> **Important:** You must create a page in Shopify accessible at `/pages/edit-project` and this page must include the `pbx-edit-project.liquid` snippet.

To enable project editing from the cart page, add the following code to your cart layout:

1. In the place where you display all cart items, extract project information from item properties:

```html
{%- for property in item.properties -%} {%- if property.first == 'Project ID'
-%} {% assign project_id = property.last %} {%- endif -%} {%- if property.first
== 'productFamilyId' -%} {% assign family_id = property.last %} {%- endif -%}
{%- endfor -%}
```

2. After extracting the project information, add an edit button that links to the editor:

```html
<a
  href="/pages/edit-project/editor?projectId={{ project_id }}&familyId={{ family_id }}&variantId={{ item.variant_id }}&skipWhenAddToCart=true"
  class="edit-project-button"
  style="background-color: rgba(var(--color-button),var(--alpha-button-background)); color: white; padding: 10px 30px; text-decoration: none; display: inline-block; margin: 10px 0; font-size: 1.5rem;"
>
  Edit project
</a>
```

## 5. Configure project-list page

> **Important:** You must create a page in Shopify accessible at `/pages/project-list` and this page must include the `pbx-project-list.liquid` snippet.
