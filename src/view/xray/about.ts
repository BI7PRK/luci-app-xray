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
      E("h2", "%s - %s".format(_("xray"), _("About"))),
      E("p", _("LuCI support for xray and Xray-core.")),
      E(
        "p",
        _("Version: %s").format(
          `${process.env.LUCI_VERSION}-${process.env.LUCI_RELEASE}`
        )
      ),
      E("p", _("Author: %s").format("Xingwang Liao & BI7PRK")),
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
        _("Report Bugs: %s").format(
          '<a href="https://github.com/kuoruan/luci-app-xray/issues" target="_blank">https://github.com/kuoruan/luci-app-xray/issues</a>'
        )
      ),
      E(
        "p",
        _("Donate: %s").format(
          '<a href="https://blog.kuoruan.com/donate" target="_blank">https://blog.kuoruan.com/donate</a>'
        )
      ),
      E("p", _("Current Config File: %s").format(configFile)),
      E(
        "pre",
        {
          style:
            "-moz-tab-size: 4;-o-tab-size: 4;tab-size: 4;word-break: break-all;",
        },
        configContent ? configContent : _("Failed to open file.")
      ),
    ]);
  },
  handleReset: null,
  handleSave: null,
  handleSaveApply: null,
});
