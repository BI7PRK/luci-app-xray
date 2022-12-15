module("luci.controller.xray", package.seeall)

local fs = require "nixio.fs"
local http = require "luci.http"
local i18n = require "luci.i18n"
local sys = require "luci.sys"

function index()
	if not nixio.fs.access("/etc/config/xray") then
		return
	end

	entry({"admin", "services", "xray"}, firstchild(), _("XRay")).dependent = false

	entry({"admin", "services", "xray", "main"}, view("xray/main"), _("Global Settings"), 10)

	entry({"admin", "services", "xray", "inbound"}, view("xray/inbound"), _("Inbound"), 20).leaf = true

	entry({"admin", "services", "xray", "outbound"}, view("xray/outbound"), _("Outbound"), 30).leaf = true

	entry({"admin", "services", "xray", "dns"}, view("xray/dns"), _("DNS"), 40)

  entry({"admin", "services", "xray", "routing"}, view("xray/routing"), _("Routing"), 50)

  entry({"admin", "services", "xray", "observatory"}, view("xray/observatory"), _("Observatory"), 60)

	entry({"admin", "services", "xray", "policy"}, view("xray/policy"), _("Policy"), 70)

	entry({"admin", "services", "xray", "reverse"}, view("xray/reverse"), _("Reverse"), 80)

	entry({"admin", "services", "xray", "transparent-proxy"}, view("xray/transparent-proxy"), _("Transparent Proxy"), 90)

  entry({"admin", "services", "xray", "about"}, view("xray/about"), _("About"), 100)

  entry({"admin", "services", "xray", "request"}, call("action_request"))
end

function action_request()
  local url = http.formvalue("url")

  if not url or url == "" then
    http.prepare_content("application/json")
    http.write_json({
      code = 1,
      message = i18n.translate("Invalid url")
    })
    return
  end

  if string.sub(url, 1, 5) == "https" and
    not fs.stat("/lib/libustream-ssl.so") then
    http.prepare_content("application/json")
    http.write_json({
      code = 1,
      message = i18n.translatef("wget: SSL support not available, please install %s or %s.", "libustream-openssl", "libustream-mbedtls")
    })
    return
  end

  local content = sys.httpget(url, false)

  if not content or content == "" then
    http.prepare_content("application/json")
    http.write_json({
      code = 1,
      message = i18n.translate("Failed to request.")
    })
  else
    http.prepare_content("application/json")
    http.write_json({
      code = 0,
      content = content
    })
  end
end
