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

PKG_BUILD_PARALLEL:=1
PKG_BUILD_DEPENDS:=rust/host

include $(INCLUDE_DIR)/package.mk


define Package/alfis
	SECTION:=net
	CATEGORY:=Network
	TITLE:=Alternative Free Identity System
	URL:=https://github.com/Revertron/Alfis
	DEPENDS:=+libgcc +libpthread +librt
endef

define Package/alfis/description
	Alternative Free Identity System.
	Decentralized blockchain-based DNS and peer-to-peer network.
endef


define Build/Compile
	+$(STAGING_DIR_HOST)/bin/cargo build \
		--release \
		--no-default-features \
		--locked \
		--target $(RUSTC_TARGET_ARCH)
endef


define Package/alfis/conffiles
/etc/config/alfis
endef


define Package/alfis/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) \
		$(PKG_BUILD_DIR)/target/$(RUSTC_TARGET_ARCH)/release/alfis \
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
endef


$(eval $(call BuildPackage,alfis))
