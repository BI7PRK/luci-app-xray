/**
 * @license
 * Copyright 2020 Xingwang Liao <kuoruan@gmail.com>
 *
 * Licensed to the public under the MIT License.
 */

"use strict";

"require form";
"require uci";
"require xray";
// "require view";

// @ts-ignore
return L.view.extend<SectionItem[][]>({
  load: function () {
    return Promise.all([
      xray.getSections("routing_rule"),
      xray.getSections("routing_balancer", "tag"),
      xray.getSections("outbound", "tag"),
    ]);
  },
  render: function ([
    routingRules = [],
    routingBalancers = [],
    outBoundSections = [],
  ] = []) {
    const m = new form.Map(
      "xray",
      "%s - %s".format(_("XRay"), _("Routing")),
      _("Details: %s").format(
        '<a href="https://xtls.github.io/config/routing.html" target="_blank">RoutingObject</a>'
      )
    );

    const s1 = m.section(form.NamedSection, "main_routing", "routing");
    s1.anonymous = true;
    s1.addremove = false;

    let o;
    o = s1.option(form.Flag, "enabled", _("Enabled"));

    o = s1.option(
      form.ListValue,
      "domain_strategy",
      _("Domain resolution strategy")
    );
    o.value("");
    o.value("AsIs");
    o.value("IPIfNonMatch");
    o.value("IPOnDemand");

    o = s1.option(
      form.ListValue,
      "domain_matcher",
      _("Domain name matching algorithm")
    );
    o.value("hybrid");
    o.value("linear");

    o = s1.option(
      form.MultiValue,
      "rules",
      _("Rules"),
      _("Select routing rules to use")
    );
    for (const s of routingRules) {
      o.value(s.value, s.caption);
    }

    o = s1.option(
      form.MultiValue,
      "balancers",
      _("Balancers"),
      _("Select routing balancers to use")
    );
    for (const s of routingBalancers) {
      o.value(s.value, s.caption);
    }

    const s2 = m.section(
      form.GridSection,
      "routing_rule",
      _("Routing Rule"),
      _("Add routing rules here")
    );
    s2.anonymous = true;
    s2.addremove = true;
    s2.sortable = true;
    s2.nodescription = true;

    o = s2.option(form.Value, "alias", _("Alias"));
    o.rmempty = false;

    o = s2.option(form.ListValue, "type", _("Type"));
    o.value("field");

    o = s2.option(form.DynamicList, "domain", _("Domain"));
    o.modalonly = true;

    o = s2.option(form.DynamicList, "ip", _("IP"));
    o.modalonly = true;

    o = s2.option(form.DynamicList, "port", _("Port"));
    o.modalonly = true;
    o.datatype = "or(port, portrange)";

    o = s2.option(form.MultiValue, "network", _("Network"));
    o.value("tcp");
    o.value("udp");

    o = s2.option(form.DynamicList, "source", _("Source"));
    o.modalonly = true;

    o = s2.option(form.DynamicList, "user", _("User"));
    o.modalonly = true;

    o = s2.option(form.DynamicList, "inbound_tag", _("Inbound tag"));

    o = s2.option(form.MultiValue, "protocol", _("Protocol"));
    o.modalonly = true;
    o.value("http");
    o.value("tls");
    o.value("bittorrent");

    o = s2.option(form.Value, "attrs", _("Attrs"));
    o.modalonly = true;

    o = s2.option(form.ListValue, "outbound_tag", _("Outbound tag"));
    o.value("");
    for (const s of outBoundSections) {
      o.value(s.caption);
    }

    o = s2.option(form.ListValue, "balancer_tag", _("Balancer tag"));
    o.depends("outbound_tag", "");
    o.value("");
    for (const s of routingBalancers) {
      o.value(s.caption);
    }

    o = s2.option(
      form.ListValue,
      "domain_matcher_r",
      _("Domain name matching algorithm")
    );
    o.value("");
    o.value("hybrid");
    o.value("linear");

    const s3 = m.section(
      form.TypedSection,
      "routing_balancer",
      _("Routing Balancer", _("Add routing balancers here"))
    );
    s3.anonymous = true;
    s3.addremove = true;

    o = s3.option(form.Value, "tag", _("Tag"));
    o.rmempty = false;

    o = s3.option(form.ListValue, "strategy_type", _("Balancer strategy"));
    o.value("random");
    o.value("leastPing");
    o.value("leastLoad");
    o.modalonly = true;

    o = s3.option(
      form.Value,
      "probeURL",
      _("ProbeURL"),
      _(
        "Ping destination URL. It should return 204 on success. eg: <code>%s</code>."
      ).format("https://www.gstatic.com/generate_204")
    );
    o.placeholder = _("empty use the built-in value");
    o.depends("strategy_type", "leastPing");
    o.depends("strategy_type", "leastLoad");

    o = s3.option(form.Value, "probeInterval", _("ProbeInterval"));
    o.depends("strategy_type", "leastPing");
    o.depends("strategy_type", "leastLoad");

    o = s3.option(form.Flag, "enableConcurrency", _("Enable concurrency"));
    o.depends("strategy_type", "leastPing");

    o = s3.option(form.Value, "leastTimeout", _("Timeout"));
    o.depends("strategy_type", "leastLoad");

    o = s3.option(form.Value, "leastSampling", _("Sampling"));
    o.depends("strategy_type", "leastLoad");

    o = s3.option(
      form.Value,
      "leastConnectivity",
      _("Connectivity"),
      _("Check network connectivity URL. eg: <code>%s</code>.").format(
        "http://connectivitycheck.platform.hicloud.com/generate_204"
      )
    );
    o.depends("strategy_type", "leastLoad");

    o = s3.option(form.DynamicList, "selector", _("Selector"));
    o.depends("strategy_type", "leastPing");
    o.depends("strategy_type", "leastLoad");
    return m.render();
  },
});
