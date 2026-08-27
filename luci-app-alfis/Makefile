include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-alfis
PKG_VERSION:=1.0
PKG_RELEASE:=1

PKG_MAINTAINER:=Revertron
PKG_LICENSE:=AGPL-3.0

include $(INCLUDE_DIR)/package.mk


define Package/luci-app-alfis
	SECTION:=luci
	CATEGORY:=LuCI
	SUBMENU:=3. Applications
	TITLE:=LuCI support for Alfis
	DEPENDS:=+alfis +luci-base
	PKGARCH:=all
endef


define Package/luci-app-alfis/description
	LuCI web interface for Alfis.
endef


define Build/Compile
endef


define Package/luci-app-alfis/install
	$(INSTALL_DIR) $(1)/www

	$(CP) \
		./htdocs/* \
		$(1)/www/

	$(CP) \
		./root/* \
		$(1)/
endef


$(eval $(call BuildPackage,luci-app-alfis))
