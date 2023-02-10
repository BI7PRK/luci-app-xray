# luci-app-xray

Luci support for xray

**This branch is new LuCI for OpenWrt 21.02.0 and later.**
it's fork and modify the code from [link](https://github.com/kuoruan/luci-app-v2ray) highly adapted to xray-core.


### Manual install

1. Download ipk files from [release](https://github.com/bi7prk/luci-app-xray/releases) page

2. Upload files to your router

3. Install package with opkg:

```sh
opkg install luci-app-xray_*.ipk
```

Dependencies:

- jshn
- ip (ip-tiny or ip-full)
- ipset
- iptables
- iptables-mod-tproxy
- resolveip
- dnsmasq-full (dnsmasq ipset is required)

For translations, please install ```luci-i18n-xray-*```.

> You may need to remove ```dnsmasq``` before installing this package.

## Configure

1. Download xray file from xray release [link](https://github.com/XTLS/Xray-core) or xray ipk release [link](https://github.com/yichya/openwrt-xray/releases).

2. Upload xray file to your router, or install the ipk file.

3. Config xray file path in LuCI page.

4. Add your inbound and outbound rules.

5. Enable the service via LuCI.

## Build

Package files is in branch [luci2](https://github.com/bi7prk/luci-app-xray/tree/luci2)

Download with Git:

```sh
git clone -b luci2 https://github.com/bi7prk/luci-app-xray.git luci-app-xray
```
