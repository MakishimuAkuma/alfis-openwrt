# alfis-openwrt 25.12+

### Install trust key once

```sh
wget -qO "/etc/apk/keys/alfis-feed.pem" "https://makishimuakuma.github.io/alfis-openwrt/25.12/$(cat /etc/apk/arch)/alfis-feed.pub.pem"
```

### Add repository

```sh
echo "https://makishimuakuma.github.io/alfis-openwrt/25.12/$(cat /etc/apk/arch)/packages.adb" > "/etc/apk/repositories.d/alfis.list"
apk update
apk add alfis
```

### Update Alfis

```sh
apk update
apk upgrade alfis
```
