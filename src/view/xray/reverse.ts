/**
 * @license
 * Copyright 2020 Xingwang Liao <kuoruan@gmail.com>
 *
 * Licensed to the public under the MIT License.
 */

"use strict";

"require form";
// "require view";

// @ts-ignore
return L.view.extend({
  render: function () {
    const m = new form.Map(
      "xray",
      "%s - %s".format(_("XRay"), _("Reverse")),
      _("Details: %s").format(
        '<a href="https://xtls.github.io/config/reverse.html" target="_blank">ReverseObject</a>'
      )
    );

    const s = m.section(form.NamedSection, "main_reverse", "reverse");
    s.addremove = false;

    let o;
    o = s.option(form.Flag, "enabled", _("Enabled"));
    o.rmempty = false;

    o = s.option(
      form.DynamicList,
      "bridges",
      _("Bridges"),
      _("A list of bridges, format: <code>tag|domain</code>. eg: %s").format(
        "bridge|test.xray.com"
      )
    );

    o = s.option(
      form.DynamicList,
      "portals",
      _("Portals"),
      _("A list of portals, format: <code>tag|domain</code>. eg: %s").format(
        "portal|test.xray.com"
      )
    );

    return m.render();
  },
});
