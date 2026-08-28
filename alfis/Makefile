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

# NOTE:
# This package lives in a custom feed (FEEDNAME=action in the workflow),
# which the OpenWrt build system mounts at:
#   package/feeds/action/alfis/Makefile
#
# The "packages" feed (which ships rust-package.mk) is mounted as a
# SIBLING feed directory:
#   package/feeds/packages/lang/rust/rust-package.mk
#
# So the include path needs an extra "packages/" segment. Using
# "../../lang/rust/rust-package.mk" (correct only for Makefiles that live
# *inside* the packages feed itself, e.g. packages/net/foo/Makefile) would
# resolve to the non-existent package/feeds/lang/rust/rust-package.mk and
# break the build for every architecture.
include ../../packages/lang/rust/rust-package.mk

CARGO_PKG_ARGS += --no-default-features

# Alfis' Cargo.toml default features are: default = ["gui", "doh"].
# --no-default-features above drops both. GUI is correctly excluded (not
# needed on a router and pulls in GTK-ish deps), but this also silently
# drops DNS-over-HTTPS support. Uncomment the next line to keep DoH:
# CARGO_PKG_ARGS += --features doh


define Package/alfis
	SECTION:=net
	CATEGORY:=Network
	TITLE:=Alternative Free Identity System
	URL:=https://github.com/Revertron/Alfis
	DEPENDS:=$(RUST_ARCH_DEPENDS) +libgcc +libpthread +librt
endef


define Package/alfis/description
	Alternative Free Identity System.
	Decentralized blockchain-based DNS and peer-to-peer network.
endef


define Package/alfis/conffiles
/etc/config/alfis
endef


define Package/alfis/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/bin/alfis $(1)/usr/bin/alfis

	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./files/alfis.config $(1)/etc/config/alfis

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/alfis.init $(1)/etc/init.d/alfis

	$(INSTALL_DIR) $(1)/var/lib/alfis
endef


$(eval $(call RustBinPackage,alfis))
$(eval $(call BuildPackage,alfis))
