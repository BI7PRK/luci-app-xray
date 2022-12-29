/**
 * @license
 * Copyright 2020 Xingwang Liao <kuoruan@gmail.com>
 *
 * Licensed to the public under the MIT License.
 */

"use strict";

"require form";
"require fs";
"require ui";
"require xray";
// "require view";

"require view/xray/include/custom as custom";

// @ts-ignore
return L.view.extend<SectionItem[][]>({
  handleServiceReload: function (ev: MouseEvent) {
    return fs
      .exec("/etc/init.d/luci_xray", ["reload"])
      .then(
        L.bind(
          function (btn, res) {
            if (res.code !== 0) {
              ui.addNotification(null, [
                E(
                  "p",
                  _("Reload service failed with code %d").format(res.code)
                ),
                res.stderr ? E("pre", {}, [res.stderr]) : "",
              ]);
              L.raise("Error", "Reload failed");
            }
          },
          this,
          ev.target
        )
      )
      .catch(function (e: Error) {
        ui.addNotification(null, E("p", e.message));
      });
  },
  load: function () {
    try {
      return Promise.all([
        xray.getSections("inbound"),
        xray.getSections("outbound"),
      ]);
    } catch {
      return Promise.resolve([[], []]);
    }
  },
  render: function ([inboundSections = [], outBoundSections = []] = []) {
    const m = new form.Map(
      "xray",
      "%s - %s".format(_("XRay"), _("Global Settings")),
      "<p>%s</p><p>%s</p>".format(
        _("A platform for building proxies to bypass network restrictions."),
        _("For more information, please visit: %s").format(
          '<a href="https://github.com/XTLS/Xray-core" target="_blank">https://github.com/XTLS/Xray-core</a>'
        )
      )
    );

    const s = m.section(form.NamedSection, "main", "xray");
    s.addremove = false;
    s.anonymous = true;

    s.option(custom.RunningStatus, "_status");

    let o;

    o = s.option(form.Flag, "enabled", _("Enabled"));
    o.rmempty = false;

    o = s.option(
      form.Button,
      "_reload",
      _("Reload Service"),
      _("This will restart service when config file changes.")
    );
    o.inputstyle = "action reload";
    o.inputtitle = _("Reload");
    o.onclick = L.bind(this.handleServiceReload, this);

    o = s.option(
      form.Value,
      "xray_file",
      _("core file"),
      _("Set the core executable file path.")
    );
    o.datatype = "file";
    o.placeholder = "/usr/bin/xray";
    o.rmempty = false;

    o = s.option(
      form.Value,
      "asset_location",
      _("core asset location"),
      _(
        "Directory where geoip.dat and geosite.dat files are, default: same directory as core file."
      )
    );
    o.datatype = "directory";
    o.placeholder = "/usr/share/xray";

    o = s.option(
      form.Value,
      "mem_percentage",
      _("Memory percentage"),
      _("The maximum percentage of memory used by xray-core.")
    );
    o.datatype = "and(uinteger, max(100))";
    o.placeholder = "80";

    o = s.option(
      form.Value,
      "config_file",
      _("Config file"),
      _("Use custom config file.")
    );
    o.datatype = "file";
    o.value("", _("None"));

    o = s.option(form.Value, "access_log", _("Access log file"));
    o.depends("config_file", "");
    o.value("/dev/null");
    o.value("/var/log/xray-access.log");

    o = s.option(form.ListValue, "loglevel", _("Log level"));
    o.depends("config_file", "");
    o.value("debug", _("Debug"));
    o.value("info", _("Info"));
    o.value("warning", _("Warning"));
    o.value("error", _("Error"));
    o.value("none", _("None"));
    o.default = "warning";

    o = s.option(form.Value, "error_log", _("Error log file"));
    o.value("/dev/null");
    o.value("/var/log/xray-error.log");
    o.depends("loglevel", "debug");
    o.depends("loglevel", "info");
    o.depends("loglevel", "warning");
    o.depends("loglevel", "error");

    o = s.option(form.Flag, "dnsLog", _("Enabled DNS log"));

    o = s.option(form.MultiValue, "inbounds", _("Inbounds enabled"));
    o.depends("config_file", "");
    for (const s of inboundSections) {
      o.value(s.value, s.caption);
    }

    o = s.option(form.MultiValue, "outbounds", _("Outbounds enabled"));
    o.depends("config_file", "");
    for (const s of outBoundSections) {
      o.value(s.value, s.caption);
    }

    o = s.option(
      form.Flag,
      "stats_enabled",
      "%s - %s".format(_("Stats"), _("Enabled"))
    );
    o.depends("config_file", "");

    o = s.option(
      form.Flag,
      "transport_enabled",
      "%s - %s".format(_("Transport"), _("Enabled"))
    );
    o.depends("config_file", "");

    o = s.option(
      custom.TextValue,
      "_transport",
      "%s - %s".format(_("Transport"), _("Settings")),
      _("<code>transport</code> field in top level configuration, JSON string")
    );
    o.depends("transport_enabled", "1");
    o.wrap = "off";
    o.rows = 5;
    o.datatype = "string";
    o.filepath = "/etc/xray/transport.json";
    o.required = true;
    o.isjson = true;

    return m.render();
  },
});
