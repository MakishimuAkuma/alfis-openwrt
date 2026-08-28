include $(TOPDIR)/rules.mk

PKG_NAME:=alfis
PKG_VERSION:=0.10.0
PKG_RELEASE:=1

PKG_SOURCE:=v$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/Revertron/Alfis/archive/refs/tags/
PKG_SOURCE_SUBDIR:=Alfis-$(PKG_VERSION)
PKG_HASH:=65920e382486b9e52d8bce989cb5c6b4381c817c753fbfd5fdf652ef0ba3ee92

PKG_MAINTAINER:=Revertron
PKG_LICENSE:=AGPL-3.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=rust/host
PKG_BUILD_PARALLEL:=1

include $(INCLUDE_DIR)/package.mk
include ../../lang/rust/rust-package.mk

CARGO_PKG_ARGS += --no-default-features

define Package/alfis
SECTION:=net
CATEGORY:=Network
TITLE:=Alternative Free Identity System
URL:=https://github.com/Revertron/Alfis
DEPENDS:=$(RUST_ARCH_DEPENDS)
endef

define Package/alfis/description
Alternative Free Identity System.
Decentralized blockchain-based DNS and peer-to-peer network.
Built without GUI and DoH support.
endef

define Package/alfis/conffiles
/etc/config/alfis
endef

define Package/alfis/install
$(INSTALL_DIR) $(1)/usr/bin

```
$(INSTALL_BIN) \
	$(PKG_INSTALL_DIR)/bin/alfis \
	$(1)/usr/bin/alfis

$(INSTALL_DIR) $(1)/etc/config

$(INSTALL_CONF) \
	./files/alfis.config \
	$(1)/etc/config/alfis

$(INSTALL_DIR) $(1)/etc/init.d

$(INSTALL_BIN) \
	./files/alfis.init \
	$(1)/etc/init.d/alfis

$(INSTALL_DIR) $(1)/var/lib/alfis
```

endef

$(eval $(call RustBinPackage,alfis))
$(eval $(call BuildPackage,alfis))
