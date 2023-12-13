/**
 * @license
 * Copyright 2023 BI7PRK
 *
 * Licensed to the public under the MIT License.
 */

"use strict";
"require ui";
"require uci";
"require form";
// "require view";
"require view/xray/include/custom as custom";
// @ts-ignore
return L.view.extend<[string, string]>({
  render: function () {
    return E(
      "div",
      {
        style:
          "border-radius: 8px; background-color: #fff; box-sizing: border-box;padding: 20px;",
      },
      [
        E("strong", {}, "Generate a UUID"),
        E(
          "div",
          {
            style: "display: flex;flex-direction: row;align-items: center;",
          },
          [
            E("span", {}, "UUID: "),
            E(
              "input",
              {
                style: "width: 350px",
                id: "uuid_field",
                readonly: "readonly",
              },
              ""
            ),
            E(
              "button",
              {
                type: "button",
                click: async () => {
                  const uuid = await custom.CallUuid();
                  if (uuid === "") {
                    ui.showModal("Get UUID", [
                      E("p", {}, "Empty output"),
                      E(
                        "div",
                        { class: "right" },
                        E(
                          "button",
                          {
                            class: "btn",
                            click: ui.hideModal,
                          },
                          _("OK")
                        )
                      ),
                    ]);
                    return;
                  }
                  document.getElementById("uuid_field").value = uuid;
                },
              },
              "GET UUID"
            ),
          ]
        ),
        E("hr", {}, ""),
        E("strong", {}, "Generate key pair"),
        E(
          "div",
          {
            style: "display: flex;flex-direction: column;align-items: start;",
          },
          [
            E("span", {}, "publicKey: "),
            E(
              "input",
              {
                style: "width: 350px",
                id: "pu_field",
                readonly: "readonly",
              },
              ""
            ),
            E("span", {}, "PrivateKey: "),
            E(
              "input",
              {
                style: "width: 350px",
                id: "pv_field",
              },
              ""
            ),
            E(
              "button",
              {
                type: "button",
                click: async () => {
                  const privateKey = document.getElementById("pv_field").value;
                  const keys = await custom.CallGenKeys(privateKey);
                  if (keys.code !== 0) {
                    ui.showModal("Get Keys", [
                      E("p", {}, "Service exception"),
                      E(
                        "div",
                        { class: "right" },
                        E(
                          "button",
                          {
                            class: "btn",
                            click: ui.hideModal,
                          },
                          _("OK")
                        )
                      ),
                    ]);
                    return;
                  }
                  document.getElementById("pu_field").value = keys.publicKey;
                  document.getElementById("pv_field").value = keys.privateKey;
                },
              },
              "GET KEYS"
            ),
          ]
        ),
      ]
    );
  },
  handleReset: null,
  handleSave: null,
  handleSaveApply: null,
});
