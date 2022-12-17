#
# Copyright 2020 Xingwang Liao <kuoruan@gmail.com>
# Licensed to the public under the MIT License.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=#{name}
PKG_VERSION:=#{version}
PKG_RELEASE:=#{release}

PKG_LICENSE:=#{license}
PKG_MAINTAINER:=#{author}

LUCI_TITLE:=#{description}
LUCI_DEPENDS:=+jshn +ip +ipset +iptables +iptables-mod-tproxy +resolveip \
	+dnsmasq-full
LUCI_PKGARCH:=all

define Package/$(PKG_NAME)/conffiles
/etc/config/xray
/etc/xray/transport.json
/etc/xray/directlist.txt
/etc/xray/proxylist.txt
endef

include $(TOPDIR)/feeds/luci/luci.mk

define Package/$(PKG_NAME)/postinst
#!/bin/sh

if [ -z "$${IPKG_INSTROOT}" ] ; then
	( . /etc/uci-defaults/40_luci-xray ) && rm -f /etc/uci-defaults/40_luci-xray

	rm -rf /tmp/luci-indexcache /tmp/luci-modulecache/

	killall -HUP rpcd 2>/dev/null
fi

chmod 755 "$${IPKG_INSTROOT}/etc/init.d/xray" >/dev/null 2>&1
ln -sf "../init.d/xray" \
	"$${IPKG_INSTROOT}/etc/rc.d/S99xray" >/dev/null 2>&1

chmod 755 "$${IPKG_INSTROOT}/usr/libexec/rpcd/luci.xray" >/dev/null 2>&1

exit 0
endef

define Package/$(PKG_NAME)/postrm
#!/bin/sh

if [ -s "$${IPKG_INSTROOT}/etc/rc.d/S99xray" ] ; then
	rm -f "$${IPKG_INSTROOT}/etc/rc.d/S99xray"
fi

if [ -z "$${IPKG_INSTROOT}" ] ; then
	rm -rf /tmp/luci-indexcache /tmp/luci-modulecache/
fi

exit 0
endef

# call BuildPackage - OpenWrt buildroot signature
