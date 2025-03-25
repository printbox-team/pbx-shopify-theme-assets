import { PbxExternalInterfaceInitializer } from "pbx-external-interface-initializer";
import { PbxEditorInitializer } from "pbx-editor-initializer";
import { PbxEditorScriptLoader } from "pbx-editor-script-loader";
import { PbxSessionKeyManager } from "pbx-session-key-manager";
import { PbxEditorRouteUtils } from "pbx-editor-route-utils";
import { PbxEditorConfigState } from "pbx-editor-config-state";
import { PbxCartItemAdder } from "pbx-cart-item-adder";
import { PbxProjectsApiRepository } from "pbx-projects-api-repository";

export const printboxModuleInitializer = (shopifyConfigProvider, options) => {
  const {
    instanceId,
    initPbxModuleId,
    initPbxProductId,
    initPbxProductFamilyId,
    shopCurrency,
    language,
    locale,
    storeName,
    variantId,
    variantAttributeValues,
    shopId,
    apiUrl,
    pbxApiUrl,
  } = shopifyConfigProvider();

  PbxEditorConfigState.setCurrency(shopCurrency);
  PbxEditorConfigState.setLocale(locale);
  PbxEditorConfigState.setLanguage(language);
  PbxEditorConfigState.setInstanceId(instanceId);
  PbxEditorConfigState.setStoreName(storeName);

  const setDefaultProjectParams = () => {
    PbxEditorConfigState.setProductFamilyId(initPbxProductFamilyId);
    PbxEditorConfigState.setModuleId(initPbxModuleId);
    PbxEditorConfigState.setProductId(initPbxProductId);
    PbxEditorConfigState.setVariantId(variantId);
    PbxEditorConfigState.setAttributeValues(
      variantAttributeValues ? JSON.parse(variantAttributeValues) : null
    );
  };

  const pbxSessionKeyManager = new PbxSessionKeyManager(shopifyConfigProvider);
  const pbxEditorScriptLoader = new PbxEditorScriptLoader(instanceId);

  const pbxProjectsApi = new PbxProjectsApiRepository({
    editorApiUrl: pbxApiUrl,
    pbxSessionKeyManager,
    shopifyApiUrl: apiUrl,
    storeName: storeName,
  });

  const pbxCartItemAdder = new PbxCartItemAdder({
    pbxProjectsApiRepository: pbxProjectsApi,
  });

  const pbxExternalInterfaceInitializer = new PbxExternalInterfaceInitializer({
    pbxSessionKeyManager,
    pbxCartItemAdder,
    pbxEditorConfigState: PbxEditorConfigState,
  });

  const pbxEditorInitializer = new PbxEditorInitializer(PbxEditorConfigState);

  const refreshPbxSession = async () => {
    const sessionId = await pbxSessionKeyManager.retrieveCustomerSessionKey();
    PbxEditorConfigState.setSessionId(sessionId);
  };

  const openEditorImmediatelyWhenEditorExistsInUrl = () => {
    PbxEditorRouteUtils.onEditorPathExistsInUrl(async () => {
      await refreshPbxSession();

      await pbxEditorInitializer.initEditor();
      publish("openEditorModal");
    });
  };

  const closeEditor = () => {
    PbxEditorRouteUtils.onEditorPathExistsInUrl(() => {
      let currentUrl = new URL(window.location.href);

      const editorSegmentIndex = currentUrl.pathname.indexOf("/editor");

      if (editorSegmentIndex === -1) return;

      currentUrl.pathname = currentUrl.pathname.substring(
        0,
        editorSegmentIndex
      );
      currentUrl.hash = "";

      history.pushState(null, "", currentUrl);

      publish("closeEditorModal");
      window.printbox.deinit();
    });
  };

  const subscribeEvents = () => {
    subscribe("initEditor", async () => {
      await pbxEditorInitializer.initEditor();
      publish("openEditorModal");
    });

    subscribe("closeEditor", () => closeEditor());

    window.addEventListener("popstate", () => {
      PbxEditorRouteUtils.onEditorPathDoesntExistInUrl(() => {
        publish("closeEditorModal");
        window.printbox.deinit();
      });
    });
  };

  return {
    initializePrintboxEditor: async (
      setProjectParams = () => setDefaultProjectParams()
    ) => {
      await setProjectParams();
      await pbxEditorScriptLoader.loadEditor(async () => {
        await refreshPbxSession();

        if (localStorage.getItem("printbox_last_project_url", null)) {
          const url = localStorage.getItem("printbox_last_project_url");
          localStorage.removeItem("printbox_last_project_url");

          if (!window.customerId) return;
          window.location.href = url;
        }

        pbxExternalInterfaceInitializer.assignExternalInterface();
        openEditorImmediatelyWhenEditorExistsInUrl();
        subscribeEvents();
      });
    },
    pbxSessionKeyManager,
    pbxConfigState: PbxEditorConfigState,
  };
};
