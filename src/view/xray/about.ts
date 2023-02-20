/**
 * @license
 * Copyright 2020 Xingwang Liao <kuoruan@gmail.com>
 *
 * Licensed to the public under the MIT License.
 */

"use strict";

"require fs";
"require uci";
"require ui";
// "require view";

// @ts-ignore
return L.view.extend<[string, string]>({
  load: function () {
    return uci.load("xray").then(function () {
      let configFile = uci.get("xray", "main", "config_file");

      if (!configFile) {
        configFile = "/var/etc/xray/xray.main.json";
      }

      return Promise.all([
        Promise.resolve(configFile),
        L.resolveDefault(fs.read(configFile), ""),
      ]);
    });
  },
  render: function ([configFile = "", configContent = ""] = []) {
    return E([
      E("h2", "%s - %s".format(_("XRay"), _("About"))),
      E(
        "div",
        {
          style:
            "border-radius: 10px; background-color: #fff; box-sizing: border-box;padding: 20px;",
        },
        [
          E("p", _("LuCI support for xray-core and v2ray-core.")),
          E(
            "p",
            _("Version: %s").format(
              `${process.env.LUCI_VERSION}-${process.env.LUCI_RELEASE}`
            )
          ),
          E("p", _("Author: %s").format("BI7PRK")),
          E(
            "p",
            _("Source: %s").format(
              '<a href="https://github.com/BI7PRK/luci-app-xray" target="_blank">https://github.com/BI7PRK/luci-app-xray</a>'
            )
          ),
          E(
            "p",
            _("Latest: %s").format(
              '<a href="https://github.com/BI7PRK/luci-app-xray/releases/latest" target="_blank">https://github.com/BI7PRK/luci-app-xray/releases/latest</a>'
            )
          ),
          E(
            "p",
            'Source from: <a href="https://github.com/kuoruan/luci-app-v2ray" target="_blank">https://github.com/kuoruan/luci-app-v2ray</a>'
          ),
          E("p", _("Current Config File: %s").format(configFile)),
          E(
            "textarea",
            {
              style:
                "background-color: #363636;color: #fff;width: 100%;height:580px;",
              readonly: "readonly",
            },
            configContent ? configContent : _("Failed to open file.")
          ),
        ]
      ),
    ]);
  },
  handleReset: null,
  handleSave: null,
  handleSaveApply: null,
});
