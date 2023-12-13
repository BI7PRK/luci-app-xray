/**
 * @license
 * Copyright 2020 Xingwang Liao <kuoruan@gmail.com>
 *
 * Licensed to the public under the MIT License.
 */
"use strict";"require form";"require uci";"require xray";"require ui";"require view/xray/include/custom as custom";"require view/xray/tools/converters as converters";return L.view.extend({handleImportSave:function(e){for(var o=e.split(/\r?\n/),s=0,a=0,t=o;a<t.length;a++){var r=t[a],l=void 0;if(r&&(l=converters.vmessLinkToVmess(r))&&"2"===l.v){var n=uci.add("xray","outbound");if(n){var d=l.add||"0.0.0.0",p=l.port||"0",m=l.tls||"",i=l.net||"",u=l.type||"",c=l.path||"",y=l.ps||"%s:%s".format(d,p);uci.set("xray",n,"alias",y),uci.set("xray",n,"protocol","vmess"),uci.set("xray",n,"s_vmess_address",d),uci.set("xray",n,"s_vmess_port",p),uci.set("xray",n,"s_vmess_user_id",l.id||""),uci.set("xray",n,"ss_security",m);var f=[];switch(l.host&&(f=l.host.split(",")),i){case"tcp":uci.set("xray",n,"ss_network","tcp"),uci.set("xray",n,"ss_tcp_header_type",u),"http"===u&&f.length>0&&(uci.set("xray",n,"ss_tcp_header_request_headers",["Host=%s".format(f[0])]),"tls"===m&&uci.set("xray",n,"ss_tls_server_name",f[0]));break;case"kcp":case"mkcp":uci.set("xray",n,"ss_network","kcp"),uci.set("xray",n,"ss_kcp_header_type",u);break;case"ws":uci.set("xray",n,"ss_network","ws"),uci.set("xray",n,"ss_websocket_path",c);break;case"http":case"h2":uci.set("xray",n,"ss_network","http"),uci.set("xray",n,"ss_http_path",c),f.length>0&&(uci.set("xray",n,"ss_http_host",f),uci.set("xray",n,"ss_tls_server_name",f[0]));break;case"quic":uci.set("xray",n,"ss_network","quic"),uci.set("xray",n,"ss_quic_header_type",u),uci.set("xray",n,"ss_quic_key",c),f.length>0&&(uci.set("xray",n,"ss_quic_security",f[0]),"tls"===m&&uci.set("xray",n,"ss_tls_server_name",f[0]));break;default:uci.remove("xray",n);continue}s++}}}if(s>0)return uci.save().then((function(){ui.showModal(_("Outbound Import"),[E("p",{},_("Imported %d links.").format(s)),E("div",{class:"right"},E("button",{class:"btn",click:ui.createHandlerFn(this,(function(){return uci.apply().then((function(){ui.hideModal(),window.location.reload()}))}))},_("OK")))])}));ui.showModal(_("Outbound Import"),[E("p",{},_("No links imported.")),E("div",{class:"right"},E("button",{class:"btn",click:ui.hideModal},_("OK")))])},handleImportClick:function(){var e=new ui.Textarea("",{rows:10,placeholder:_("You can add multiple links at once, one link per line."),validate:function(e){return e?!!/^(vmess:\/\/[a-zA-Z0-9/+=]+\s*)+$/i.test(e)||_("Invalid links."):_("Empty field.")}});ui.showModal(_("Import Vmess Links"),[E("div",{},[E("p",{},_("Allowed link format: <code>%s</code>").format("vmess://xxxxx")),e.render()]),E("div",{class:"right"},[E("button",{class:"btn",click:ui.hideModal},_("Dismiss"))," ",E("button",{class:"cbi-button cbi-button-positive important",click:ui.createHandlerFn(this,(function(e){var o;if(e.triggerValidation(),e.isValid()&&(o=e.getValue())&&(o=o.trim()))return this.handleImportSave(o)}),e)},_("Save"))])])},load:function(){return Promise.all([xray.getLocalIPs()])},render:function(e){var o,s=e[0],a=void 0===s?[]:s,t=new form.Map("xray","%s - %s".format(_("XRay"),_("Outbound")),_("Details: %s").format('<a href="https://xtls.github.io/config/outbound.html" target="_blank"> OutboundObject</a>')),r=t.section(form.GridSection,"outbound");r.anonymous=!0,r.addremove=!0,r.sortable=!0,r.modaltitle=function(e){var o=uci.get("xray",e,"alias");return _("Outbound")+" » "+(null!=o?o:_("Add"))},r.nodescriptions=!0,r.tab("general",_("General Settings")),r.tab("stream",_("Stream Settings")),r.tab("other",_("Other Settings")),(o=r.taboption("general",form.Value,"alias",_("Alias"))).rmempty=!1,(o=r.taboption("general",form.Value,"send_through",_("Send through"))).datatype="ipaddr";for(var l=0,n=a;l<n.length;l++){var d=n[l];o.value(d)}(o=r.taboption("general",form.ListValue,"protocol",_("Protocol"))).value("blackhole","Blackhole"),o.value("dns","DNS"),o.value("freedom","Freedom"),o.value("http","HTTP/2"),o.value("shadowsocks","Shadowsocks"),o.value("socks","Socks"),o.value("trojan","Trojan"),o.value("vmess","VMess"),o.value("vless","VLESS"),o.value("loopback","Loopback"),o.value("wireguard","WireGuard"),(o=r.taboption("general",form.ListValue,"s_blackhole_reponse_type","%s - %s".format("Blackhole",_("Response type")))).modalonly=!0,o.depends("protocol","blackhole"),o.value(""),o.value("none",_("None")),o.value("http","HTTP"),(o=r.taboption("general",form.ListValue,"s_dns_network","%s - %s".format("DNS",_("Network")))).modalonly=!0,o.depends("protocol","dns"),o.value(""),o.value("tcp","TCP"),o.value("udp","UDP"),(o=r.taboption("general",form.Value,"s_dns_address","%s - %s".format("DNS",_("Address")))).modalonly=!0,o.depends("protocol","dns"),(o=r.taboption("general",form.Value,"s_dns_port","%s - %s".format("DNS",_("Port")))).modalonly=!0,o.depends("protocol","dns"),o.datatype="port",(o=r.taboption("general",form.ListValue,"s_dns_nonIPQuery","%s - %s".format("DNS",_("Non IP Query")))).depends("protocol","dns"),o.modalonly=!0,o.value(""),o.value("drop"),o.value("skip"),(o=r.taboption("general",form.ListValue,"s_freedom_domain_strategy","%s - %s".format("Freedom",_("Domain strategy")))).depends("protocol","freedom"),o.modalonly=!0,o.value(""),o.value("AsIs"),o.value("UseIP"),o.value("UseIPv4"),o.value("UseIPv6"),(o=r.taboption("general",form.Value,"s_freedom_redirect","%s - %s".format("Freedom",_("Redirect")))).modalonly=!0,o.depends("protocol","freedom"),(o=r.taboption("general",form.Value,"s_freedom_user_level","%s - %s".format("Freedom",_("User level")))).modalonly=!0,o.depends("protocol","freedom"),o.datatype="uinteger",(o=r.taboption("general",form.Value,"s_http_server_address","%s - %s".format("HTTP",_("Server address")))).modalonly=!0,o.depends("protocol","http"),o.datatype="host",(o=r.taboption("general",form.Value,"s_http_server_port","%s - %s".format("HTTP",_("Server port")))).modalonly=!0,o.depends("protocol","http"),o.datatype="port",(o=r.taboption("general",form.Value,"s_http_account_user","%s - %s".format("HTTP",_("User")))).modalonly=!0,o.depends("protocol","http"),(o=r.taboption("general",form.Value,"s_http_account_pass","%s - %s".format("HTTP",_("Password")))).modalonly=!0,o.depends("protocol","http"),o.password=!0,(o=r.taboption("general",form.DynamicList,"s_http_headers","%s - %s".format("HTTP",_("Headers")))).modalonly=!0,o.depends("protocol","http"),o.placeholder=_("Query headers"),(o=r.taboption("general",form.Value,"s_shadowsocks_email","%s - %s".format("Shadowsocks",_("Email")))).modalonly=!0,o.depends("protocol","shadowsocks"),(o=r.taboption("general",form.Value,"s_shadowsocks_address","%s - %s".format("Shadowsocks",_("Address")))).modalonly=!0,o.depends("protocol","shadowsocks"),o.datatype="host",(o=r.taboption("general",form.Value,"s_shadowsocks_port","%s - %s".format("Shadowsocks",_("Port")))).modalonly=!0,o.depends("protocol","shadowsocks"),o.datatype="port",(o=r.taboption("general",form.ListValue,"s_shadowsocks_method","%s - %s".format("Shadowsocks",_("Method")))).modalonly=!0,o.depends("protocol","shadowsocks"),o.value(""),o.value("aes-256-cfb"),o.value("aes-128-cfb"),o.value("chacha20"),o.value("chacha20-ietf"),o.value("aes-256-gcm"),o.value("aes-128-gcm"),o.value("chacha20-poly1305"),o.value("chacha20-ietf-poly1305"),(o=r.taboption("general",form.Value,"s_shadowsocks_password","%s - %s".format("Shadowsocks",_("Password")))).modalonly=!0,o.depends("protocol","shadowsocks"),o.password=!0,(o=r.taboption("general",form.Value,"s_shadowsocks_level","%s - %s".format("Shadowsocks",_("User level")))).modalonly=!0,o.depends("protocol","shadowsocks"),o.datatype="uinteger",(o=r.taboption("general",form.Flag,"s_shadowsocks_ota","%s - %s".format("Shadowsocks",_("OTA")))).modalonly=!0,o.depends("protocol","shadowsocks"),(o=r.taboption("general",form.Value,"s_socks_server_address","%s - %s".format("Socks",_("Server address")))).modalonly=!0,o.depends("protocol","socks"),o.datatype="host",(o=r.taboption("general",form.Value,"s_socks_server_port","%s - %s".format("Socks",_("Server port")))).modalonly=!0,o.depends("protocol","socks"),o.datatype="port",(o=r.taboption("general",form.Value,"s_socks_account_user","%s - %s".format("Socks",_("User")))).modalonly=!0,o.depends("protocol","socks"),(o=r.taboption("general",form.Value,"s_socks_account_pass","%s - %s".format("Socks",_("Password")))).modalonly=!0,o.depends("protocol","socks"),o.password=!0,(o=r.taboption("general",form.Value,"s_socks_user_level","%s - %s".format("Socks",_("User level")))).modalonly=!0,o.depends("protocol","socks"),o.datatype="uinteger",(o=r.taboption("general",form.Value,"s_trojan_address","%s - %s".format("Trojan",_("Address")))).modalonly=!0,o.depends("protocol","trojan"),o.datatype="host",(o=r.taboption("general",form.Value,"s_trojan_port","%s - %s".format("Trojan",_("Port")))).modalonly=!0,o.depends("protocol","trojan"),o.datatype="port",(o=r.taboption("general",form.Value,"s_trojan_password","%s - %s".format("Trojan",_("Password")))).modalonly=!0,o.depends("protocol","trojan"),(o=r.taboption("general",form.Value,"s_vmess_address","%s - %s".format("VMess",_("Address")))).modalonly=!0,o.depends("protocol","vmess"),o.datatype="host",(o=r.taboption("general",form.Value,"s_vmess_port","%s - %s".format("VMess",_("Port")))).modalonly=!0,o.depends("protocol","vmess"),o.datatype="port",(o=r.taboption("general",form.Value,"s_vmess_user_id","%s - %s".format("VMess",_("User ID")))).modalonly=!0,o.depends("protocol","vmess"),(o=r.taboption("general",form.ListValue,"s_vmess_user_security","%s - %s".format("VMess",_("Security")))).modalonly=!0,o.depends("protocol","vmess"),o.value(""),o.value("auto",_("Auto")),o.value("aes-128-gcm"),o.value("chacha20-poly1305"),o.value("none",_("None")),(o=r.taboption("general",form.Value,"s_vmess_user_level","%s - %s".format("VMess",_("User level")))).modalonly=!0,o.depends("protocol","vmess"),o.datatype="uinteger",(o=r.taboption("general",form.Value,"s_vless_address","%s - %s".format("VLESS",_("Address")))).modalonly=!0,o.depends("protocol","vless"),o.datatype="host",(o=r.taboption("general",form.Value,"s_vless_port","%s - %s".format("VLESS",_("Port")))).modalonly=!0,o.depends("protocol","vless"),o.datatype="port",(o=r.taboption("general",form.Value,"s_vless_user_id","%s - %s".format("VLESS",_("User ID")))).modalonly=!0,o.depends("protocol","vless"),(o=r.taboption("general",form.Value,"s_vless_user_level","%s - %s".format("VLESS",_("User level")))).modalonly=!0,o.depends("protocol","vless"),o.datatype="and(uinteger, max(10))",(o=r.taboption("general",form.ListValue,"s_vless_user_encryption","%s - %s".format("VLESS",_("Encryption")))).modalonly=!0,o.depends("protocol","vless"),o.value("none","none"),(o=r.taboption("general",form.Value,"s_loopback_inboundtag","%s - %s".format("Loopback",_("Inbound tag")))).modalonly=!0,o.depends("protocol","loopback"),(o=r.taboption("general",form.Value,"wg_secretKey",_("secretKey"))).modalonly=!0,o.depends("protocol","wireguard"),(o=r.taboption("general",form.Value,"wg_publicKey",_("publicKey"))).modalonly=!0,o.depends("protocol","wireguard"),(o=r.taboption("general",form.Value,"wg_endpoint",_("Endpoint"))).modalonly=!0,o.depends("protocol","wireguard"),(o=r.taboption("stream",form.ListValue,"ss_network",_("Network"))).value(""),o.value("tcp","TCP"),o.value("kcp","mKCP"),o.value("ws","WebSocket"),o.value("http","HTTP/2"),o.value("domainsocket","Domain Socket"),o.value("quic","QUIC"),o.value("grpc","gRPC"),(o=r.taboption("stream",form.ListValue,"ss_security",_("Security"))).modalonly=!0,o.value("none",_("None")),o.value("tls","TLS"),o.value("reality","Reality"),(o=r.taboption("stream",form.ListValue,"s_xtls_flow",_("xTLS Flow"),_("Use xTLS flow"))).modalonly=!0,o.value("none",_("None")),o.value("xtls-rprx-vision"),o.value("xtls-rprx-vision-udp443"),o.depends("ss_security","tls"),o.depends("ss_security","reality"),(o=r.taboption("stream",form.ListValue,"min_tls_version",_("min TLS version"))).modalonly=!0,o.value("",_("Default")),o.value("1.0"),o.value("1.1"),o.value("1.2"),o.value("1.3"),o.depends("ss_security","tls"),(o=r.taboption("stream",form.ListValue,"max_tls_version",_("max TLS version"))).modalonly=!0,o.value("",_("Default")),o.value("1.0"),o.value("1.1"),o.value("1.2"),o.value("1.3"),o.depends("ss_security","tls"),(o=r.taboption("stream",form.Value,"ss_tls_server_name",_("Server name"))).modalonly=!0,o.depends("ss_security","tls"),o.depends("ss_security","reality"),(o=r.taboption("stream",form.DynamicList,"ss_tls_alpn","%s - %s".format("TLS","ALPN"))).modalonly=!0,o.placeholder="http/1.1",o.depends({ss_security:"tls",ss_network:"tcp"}),(o=r.taboption("stream",form.Value,"u_tls",_("Fingerprint"))).modalonly=!0,o.value("",_("None")),o.value("chrome"),o.value("firefox"),o.value("safari"),o.value("ios"),o.value("android"),o.value("edge"),o.value("360"),o.value("qq"),o.value("random"),o.value("randomized"),o.depends("ss_security","tls"),o.depends("ss_security","reality"),(o=r.taboption("stream",form.Value,"real_shortId","%s - %s".format("Reality",_("ShortId")),_("The length is a multiple of 2, and the maximum length is 16 bits"))).modalonly=!0,o.depends("ss_security","reality"),(o=r.taboption("stream",form.Value,"real_spiderX","%s - %s".format("Reality",_("SpiderX")),_("crawler path"))).modalonly=!0,o.depends("ss_security","reality"),(o=r.taboption("stream",form.Value,"real_publicKey","%s - %s".format("Reality",_("publicKey")))).modalonly=!0,o.depends("ss_security","reality"),(o=r.taboption("stream",form.Flag,"ss_tls_rejectUnknownSni","%s - %s".format("TLS",_("Reject Unknown SNI")))).depends("ss_security","tls"),o.modalonly=!0,(o=r.taboption("stream",form.Flag,"ss_tls_allow_insecure","%s - %s".format("TLS",_("Allow insecure")))).modalonly=!0,o.depends("ss_security","tls"),(o=r.taboption("stream",form.Flag,"ss_tls_allow_insecure_ciphers","%s - %s".format("TLS",_("Allow insecure ciphers")))).modalonly=!0,o.depends("ss_security","tls"),(o=r.taboption("stream",form.Flag,"ss_tls_disable_system_root","%s - %s".format("TLS",_("Disable system root")))).modalonly=!0,o.depends("ss_security","tls"),(o=r.taboption("stream",form.ListValue,"ss_tls_cert_usage","%s - %s".format("TLS",_("Certificate usage")))).modalonly=!0,o.depends("ss_security","tls"),o.value(""),o.value("encipherment"),o.value("verify"),o.value("issue"),(o=r.taboption("stream",form.ListValue,"ss_tcp_header_type","%s - %s".format("TCP",_("Header type")))).modalonly=!0,o.value(""),o.value("none",_("None")),o.value("http","HTTP"),o.depends({ss_security:"tls",ss_network:"tcp"}),(o=r.taboption("stream",form.Value,"ss_tcp_header_request_version","%s - %s".format("TCP",_("HTTP request version")))).modalonly=!0,o.depends("ss_tcp_header_type","http"),(o=r.taboption("stream",form.ListValue,"ss_tcp_header_request_method","%s - %s".format("TCP",_("HTTP request method")))).modalonly=!0,o.depends("ss_tcp_header_type","http"),o.value(""),o.value("GET"),o.value("HEAD"),o.value("POST"),o.value("DELETE"),o.value("PUT"),o.value("PATCH"),o.value("OPTIONS"),(o=r.taboption("stream",form.Value,"ss_tcp_header_request_path","%s - %s".format("TCP",_("Request path")))).modalonly=!0,o.depends("ss_tcp_header_type","http"),(o=r.taboption("stream",form.DynamicList,"ss_tcp_header_request_headers","%s - %s".format("TCP",_("Request headers")),_("A list of HTTP headers, format: <code>header=value</code>. eg: %s").format("Host=www.bing.com"))).modalonly=!0,o.depends("ss_tcp_header_type","http"),(o=r.taboption("stream",form.Value,"ss_tcp_header_response_version","%s - %s".format("TCP",_("HTTP response version")))).modalonly=!0,o.depends("ss_tcp_header_type","http"),(o=r.taboption("stream",form.Value,"ss_tcp_header_response_status","%s - %s".format("TCP",_("HTTP response status")))).modalonly=!0,o.depends("ss_tcp_header_type","http"),(o=r.taboption("stream",form.Value,"ss_tcp_header_response_reason","%s - %s".format("TCP",_("HTTP response reason")))).modalonly=!0,o.depends("ss_tcp_header_type","http"),(o=r.taboption("stream",form.DynamicList,"ss_tcp_header_response_headers","%s - %s".format("TCP",_("Response headers")),_("A list of HTTP headers, format: <code>header=value</code>. eg: %s").format("Host=www.bing.com"))).modalonly=!0,o.depends("ss_tcp_header_type","http"),(o=r.taboption("stream",form.Value,"ss_kcp_mtu","%s - %s".format("mKCP",_("Maximum transmission unit (MTU)")))).modalonly=!0,o.depends("ss_network","kcp"),o.datatype="and(min(576), max(1460))",o.placeholder="1350",(o=r.taboption("stream",form.Value,"ss_kcp_tti","%s - %s".format("mKCP",_("Transmission time interval (TTI)")))).modalonly=!0,o.depends("ss_network","kcp"),o.datatype="and(min(10), max(100))",o.placeholder="50",(o=r.taboption("stream",form.Value,"ss_kcp_uplink_capacity","%s - %s".format("mKCP",_("Uplink capacity")))).modalonly=!0,o.depends("ss_network","kcp"),o.datatype="uinteger",o.placeholder="5",(o=r.taboption("stream",form.Value,"ss_kcp_downlink_capacity","%s - %s".format("mKCP",_("Downlink capacity")))).modalonly=!0,o.depends("ss_network","kcp"),o.datatype="uinteger",o.placeholder="20",(o=r.taboption("stream",form.Flag,"ss_kcp_congestion","%s - %s".format("mKCP",_("Congestion enabled")))).modalonly=!0,o.depends("ss_network","kcp"),(o=r.taboption("stream",form.Value,"ss_kcp_read_buffer_size","%s - %s".format("mKCP",_("Read buffer size")))).modalonly=!0,o.depends("ss_network","kcp"),o.datatype="uinteger",o.placeholder="2",(o=r.taboption("stream",form.Value,"ss_kcp_write_buffer_size","%s - %s".format("mKCP",_("Write buffer size")))).modalonly=!0,o.depends("ss_network","kcp"),o.datatype="uinteger",o.placeholder="2",(o=r.taboption("stream",form.ListValue,"ss_kcp_header_type","%s - %s".format("mKCP",_("Header type")))).modalonly=!0,o.depends("ss_network","kcp"),o.value(""),o.value("none",_("None")),o.value("srtp","SRTP"),o.value("utp","uTP"),o.value("dns","DNS"),o.value("wechat-video",_("Wechat Video")),o.value("dtls","DTLS 1.2"),o.value("wireguard","WireGuard"),(o=r.taboption("stream",form.Value,"ss_kcp_header_domain","%s - %s".format("mKCP",_("Fake Domain")))).modalonly=!0,o.depends({ss_kcp_header_type:"dns"}),(o=r.taboption("stream",form.Value,"ss_websocket_path","%s - %s".format("WebSocket",_("Path")))).modalonly=!0,o.depends("ss_network","ws"),(o=r.taboption("stream",form.DynamicList,"ss_websocket_headers","%s - %s".format("WebSocket",_("Headers")),_("A list of HTTP headers, format: <code>header=value</code>. eg: %s").format("Host=www.bing.com"))).modalonly=!0,o.depends("ss_network","ws"),(o=r.taboption("stream",form.DynamicList,"ss_http_host","%s - %s".format("HTTP/2",_("Host")))).modalonly=!0,o.depends("ss_network","http"),(o=r.taboption("stream",form.Value,"ss_http_path","%s - %s".format("HTTP/2",_("Path")))).modalonly=!0,o.depends("ss_network","http"),o.placeholder="/",(o=r.taboption("stream",form.Value,"ss_domainsocket_path","%s - %s".format("Domain Socket",_("Path")))).modalonly=!0,o.depends("ss_network","domainsocket"),(o=r.taboption("stream",form.ListValue,"ss_quic_security","%s - %s".format("QUIC",_("Security")))).modalonly=!0,o.depends("ss_network","quic"),o.value(""),o.value("none",_("None")),o.value("aes-128-gcm"),o.value("chacha20-poly1305"),(o=r.taboption("stream",form.Value,"ss_quic_key","%s - %s".format("QUIC",_("Key")))).modalonly=!0,o.depends("ss_quic_security","aes-128-gcm"),o.depends("ss_quic_security","chacha20-poly1305"),(o=r.taboption("stream",form.ListValue,"ss_quic_header_type","%s - %s".format("QUIC",_("Header type")))).modalonly=!0,o.depends("ss_network","quic"),o.value(""),o.value("none",_("None")),o.value("srtp","SRTP"),o.value("utp","uTP"),o.value("wechat-video",_("Wechat Video")),o.value("dtls","DTLS 1.2"),o.value("wireguard","WireGuard"),(o=r.taboption("stream",form.Value,"service_name","%s - %s".format("gRPC",_("Service name")))).depends("ss_network","grpc"),o.modalonly=!0,(o=r.taboption("stream",form.Flag,"multi_mode","%s - %s".format("gRPC",_("Multi mode")))).modalonly=!0,o.depends("ss_network","grpc"),(o=r.taboption("stream",form.Value,"idle_timeout","%s - %s".format("gRPC",_("Idle timeout")))).modalonly=!0,o.datatype="uinteger",o.depends("ss_network","grpc"),(o=r.taboption("stream",form.Value,"health_check_timeout","%s - %s".format("gRPC",_("Health check timeout")))).modalonly=!0,o.datatype="uinteger",o.depends("ss_network","grpc"),(o=r.taboption("stream",form.Flag,"permit_without_stream","%s - %s".format("gRPC",_("Permit without stream")))).modalonly=!0,o.depends("ss_network","grpc"),(o=r.taboption("stream",form.Value,"initial_windows_size","%s - %s".format("gRPC",_("Initial windows size")))).modalonly=!0,o.datatype="uinteger",o.depends("ss_network","grpc"),(o=r.taboption("stream",form.Value,"ss_sockopt_mark","%s - %s".format(_("Sockopt"),_("Mark")),_("If transparent proxy is enabled, this option is ignored and will be set to 255."))).modalonly=!0,o.datatype="uinteger",o.placeholder="255",(o=r.taboption("stream",form.Value,"ss_sockopt_tcpUserTimeout","%s - %s".format(_("Sockopt"),_("Tcp User Timeout")))).datatype="uinteger",o.placeholder="10000",o.modalonly=!0,(o=r.taboption("stream",form.Value,"ss_sockopt_tcpMaxSeg","%s - %s".format(_("Sockopt"),_("TCP Max Seg")))).datatype="uinteger",o.placeholder="1440",o.modalonly=!0,(o=r.taboption("stream",form.ListValue,"ss_sockopt_tcp_fast_open","%s - %s".format(_("Sockopt"),_("TCP fast open")))).modalonly=!0,o.value(""),o.value("0",_("False")),o.value("1",_("True")),(o=r.taboption("stream",form.ListValue,"sockopt_tcpMptcp","%s - %s".format(_("Sockopt"),_("MPTCP")))).modalonly=!0,o.value(""),o.value("0",_("False")),o.value("1",_("True")),(o=r.taboption("stream",form.ListValue,"sockopt_tcpnodelay","%s - %s".format(_("Sockopt"),_("TCP No Delay")))).modalonly=!0,o.value(""),o.value("0",_("False")),o.value("1",_("True")),(o=r.taboption("stream",form.ListValue,"ss_sockopt_domain_strategy",_("Domain Strategy"))).depends({protocol:"freedom","!reverse":!0}),o.modalonly=!0,o.value(""),o.value("UseIPv4v6"),o.value("UseIPv6v4"),o.value("ForceIP"),o.value("ForceIPv4"),o.value("ForceIPv6"),o.value("ForceIPv4v6"),o.value("ForceIPv6v4"),o=r.taboption("general",form.Value,"tag",_("Tag")),(o=r.taboption("general",form.Value,"proxy_settings_tag","%s - %s".format(_("Proxy settings"),_("Tag")))).modalonly=!0,(o=r.taboption("other",form.Flag,"mux_enabled","%s - %s".format(_("Mux"),_("Enabled")))).modalonly=!0,(o=r.taboption("other",form.Value,"mux_concurrency","%s - %s".format(_("Mux"),_("Concurrency")))).modalonly=!0,o.datatype="uinteger",o.placeholder="8";var p=this;return t.render().then((function(e){var o=t.findElement("id","cbi-xray-outbound"),s=E("div",{class:"cbi-section-create cbi-tblsection-create"},E("button",{class:"cbi-button cbi-button-neutral",title:_("Import"),click:L.bind(p.handleImportClick,p)},_("Import")));return L.dom.append(o,s),e}))}});