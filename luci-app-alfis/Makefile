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
	DEPENDS:=+alfis
	PKGARCH:=all
endef


define Package/luci-app-alfis/description
	LuCI web interface for Alfis.
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/luci-app-alfis/install
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./root/usr/share/luci/menu.d/luci-app-alfis.json $(1)/usr/share/luci/menu.d/

	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) ./root/usr/share/rpcd/acl.d/luci-app-alfis.json $(1)/usr/share/rpcd/acl.d/

	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/alfis
	$(INSTALL_DATA) ./root/www/luci-static/resources/view/alfis/*.js $(1)/www/luci-static/resources/view/alfis/
endef


$(eval $(call BuildPackage,luci-app-alfis))
