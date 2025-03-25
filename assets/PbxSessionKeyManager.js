export class PbxSessionKeyManager {
  #shopifyConfigProvider;

  constructor(shopifyConfigProvider) {
    this.#shopifyConfigProvider = shopifyConfigProvider;
  }

  retrieveCustomerSessionKey = async () => {
    const {
      customerEmail,
      customerId,
      apiUrl,
      shopId,
      pbxMetafieldCustomerId,
    } = this.#shopifyConfigProvider();
    window.customerId = pbxMetafieldCustomerId;

    let sessionKey = "";

    if (!window.customerId && customerEmail !== "") {
      try {
        const payload = JSON.stringify({
          email: customerEmail,
          id: customerId,
        });
        const response = await fetch(
          `${apiUrl}/api/customer?shopId=${shopId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
          },
        );

        const { data } = await response.json();

        if (data?.id) {
          window.customerId = data.id;
        }
      } catch (error) {
        console.error(error);
      }
    }

    const storedData = localStorage.getItem("printboxSession");

    if (storedData && storedData !== "undefined") {
      const { session_key, expiry_date } = JSON.parse(storedData);

      if (new Date().getTime() < new Date(expiry_date).getTime()) {
        return session_key;
      }
    }

    if (window.customerId && !sessionKey) {
      try {
        const payload = JSON.stringify({ id: window.customerId });

        const resp = await fetch(
          `${apiUrl}/api/customer/session?shopId=${shopId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
          },
        );

        const { data } = await resp.json();

        if (data?.session_key) {
          localStorage.setItem("printboxSession", JSON.stringify(data));

          sessionKey = data.session_key;
        }
      } catch (error) {
        console.error("session error", error);
      }
    }

    return sessionKey;
  };
}
