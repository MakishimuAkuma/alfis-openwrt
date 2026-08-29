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
# This package lives in a custom feed (FEEDNAME=action in the workflow).
# gh-action-sdk mounts it via "src-link action /feed/", i.e. a plain
# filesystem symlink to /feed — NOT a git-cloned feed under
# $(TOPDIR)/feeds/action like the default feeds. Because of that, make
# actually runs with /feed/alfis as its working directory (see "Entering
# directory '/feed/alfis'" in the build log), which sits completely
# outside $(TOPDIR). ANY relative "../../..." include path is therefore
# wrong here — it can never reach $(TOPDIR)/feeds/packages, no matter how
# many "../" segments are used.
#
# The "packages" feed (which ships rust-package.mk) IS fetched the normal
# way (src-git) and is guaranteed to exist at $(TOPDIR)/feeds/packages
# after "./scripts/feeds update -a", which the SDK action always runs
# first. So reference it with an absolute, $(TOPDIR)-based path instead
# of a relative one.
include $(TOPDIR)/feeds/packages/lang/rust/rust-package.mk

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
	# +libsqlite3 is required: Alfis depends on the "sqlite" crate, whose
	# default feature ("linkage") dynamically links against the system
	# libsqlite3 via pkg-config instead of building it from source.
	# Without this dependency, sqlite3.h / libsqlite3.so are never staged
	# for the target arch and the cross-compile link step fails on every
	# architecture with the same generic "failed to build" error.
	DEPENDS:=$(RUST_ARCH_DEPENDS) +libgcc +libpthread +librt +libsqlite3
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
