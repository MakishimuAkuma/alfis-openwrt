# alfis-openwrt 25.12+

### Install trust key once

```sh
wget -qO "/etc/apk/keys/alfis-feed.pem" "https://raw.githubusercontent.com/MakishimuAkuma/alfis-openwrt/gh-pages/25.12/$(apk info --print-arch)/alfis-feed.pub.pem"
```

### Add repository

```sh
echo "https://raw.githubusercontent.com/MakishimuAkuma/alfis-openwrt/gh-pages/25.12/$(apk info --print-arch)/packages.adb" > "/etc/apk/repositories.d/alfis.list"
apk update
apk add alfis
```

### Update Alfis

```sh
apk update
apk upgrade alfis
```
