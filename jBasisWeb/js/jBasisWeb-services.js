'use strict';

angular.module('jBasisWeb.services', []).
    run([function () {
        console.info("jBasisWeb.services injected!!");
    }]).
    service('jBWService', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {

        function init() {
            $rootScope.windowTitle = "JBasisWeb";
            $rootScope.pageTitle = "";
            $rootScope.headerInfo = "";
            $rootScope.menuItems = [];
            $rootScope.hideMenuFolding = false;
            $rootScope.initExecuted = false
        }

        init();

        function fillBreadCrumbs(menuItem) {
            var breadcrumbs = [menuItem];
            if (menuItem.father != null) {
                var fatherItem = MenuItem.searchItemFromItems(getMenuItems(), menuItem.father);
                var items = fillBreadCrumbs(fatherItem);
                for (var index in items) {
                    breadcrumbs.push(items[index]);
                }
            }
            return breadcrumbs;
        }

        function setWindowTitle(windowTitle) {
            $rootScope.windowTitle = windowTitle;
        }

        function getWindowTitle() {
            return $rootScope.pageTitle;
        }

        function setPageTitle(pageTitle) {
            $rootScope.pageTitle = pageTitle;
        }

        function getPageTitle() {
            return $rootScope.pageTitle;
        }

        function setHeaderInfo(headerInfo) {
            $rootScope.headerInfo = headerInfo;
        }

        function getHeaderInfo() {
            return $rootScope.headerInfo;
        }

        $rootScope.isMenuOpen = true;

        function setMenuOpen(menuOpen) {
            $rootScope.isMenuOpen = menuOpen;
        }

        function isMenuOpen() {
            return $rootScope.isMenuOpen;
        }

        function getMenuItems() {
            return $rootScope.menuItems;
        }

        function getMainMenu() {
            return $rootScope.mainMenu;
        }

        function setMainMenu(mainMenu) {
            $rootScope.mainMenu = mainMenu;
            setSelectedMenuItem(mainMenu);
            setMainMenuItem(mainMenu);
            $rootScope.menuItems = fillMenuItems(mainMenu);
            setBreadCrumbs(fillBreadCrumbs(mainMenu));
        }

        function setMainMenuItem(mainMenuItem) {
            $rootScope.mainMenuItem = mainMenuItem;
        }

        function getMainMenuItem() {
            return $rootScope.mainMenuItem;
        }

        function setSelectedMenuItem(selectedMenuItem) {
            $rootScope.selectedMenuItem = selectedMenuItem;
        }

        function getSelectedMenuItem() {
            return $rootScope.selectedMenuItem;
        }

        function setSelectedMenuName(selectedMenuName) {
            $rootScope.selectedMenuName = selectedMenuName;
        }

        function getSelectedMenuName() {
            return $rootScope.selectedMenuName;
        }

        function fillMenuItems(menuItem) {
            var menuItems = [menuItem];
            for (var index in menuItem.getChildren()) {
                var child = menuItem.getChildren()[index];
                var childrenFound = fillMenuItems(child);
                for (var index in childrenFound) {
                    menuItems.push(childrenFound[index]);
                }
            }
            return menuItems;
        }

        function setBreadCrumbs(breadCrumbs) {
            $rootScope.breadCrumbs = breadCrumbs;
        }

        function getBreadCrumbs() {
            return $rootScope.breadCrumbs;
        }

        function getUserLoggedIn() {
            return $rootScope.userLoggedIn;
        }

        function setUserLoggedIn(userLoggedIn) {
            $rootScope.userLoggedIn = userLoggedIn;
        }

        function setInitExecuted(initExecuted) {
            $rootScope.initExecuted = initExecuted;
        }

        function isInitExecuted() {
            return $rootScope.initExecuted;
        }

        function logout() {
            $rootScope.userLoggedIn = null;
            $rootScope.initExecuted = false;
        }

        function checkLogin() {
            var userLoggedIn = getUserLoggedIn();

            if (userLoggedIn == null) {
                console.log("checkLogin() -->" + $location.path(), "no user logged in found ---> redirect to gatekeeper");
                $location.path("gatekeeper/" + $location.path());
                return false;
            }

            return true;
        }

        return  {
            getMenuItems: getMenuItems,
            setMainMenu: setMainMenu,
            getMainMenu: getMainMenu,
            setMainMenuItem: setMainMenuItem,
            getMainMenuItem: getMainMenuItem,
            setSelectedMenuItem: setSelectedMenuItem,
            getSelectedMenuItem: getSelectedMenuItem,
            setSelectedMenuName: setSelectedMenuName,
            getSelectedMenuName: getSelectedMenuName,
            setWindowTitle: setWindowTitle,
            getWindowTitle: getWindowTitle,
            getPageTitle: getPageTitle,
            setPageTitle: setPageTitle,
            setHeaderInfo: setHeaderInfo,
            getHeaderInfo: getHeaderInfo,
            isMenuOpen: isMenuOpen,
            setMenuOpen: setMenuOpen,
            fillBreadCrumbs: fillBreadCrumbs,
            fillMenuItems: fillMenuItems,
            setBreadCrumbs: setBreadCrumbs,
            getBreadCrumbs: getBreadCrumbs,
            getUserLoggedIn: getUserLoggedIn,
            setUserLoggedIn: setUserLoggedIn,
            setInitExecuted: setInitExecuted,
            isInitExecuted: isInitExecuted,
            checkLogin: checkLogin,
            logout: logout
        }
    }]).
    factory('jBWUtility', ['$rootScope', 'jBWService', function ($rootScope, jBWService) {
        return {
            toggleMenu: function () {
                var widthMenu = jBWService.isMenuOpen() ? $("#menu").css('width') : '0px';
                if (jBWService.isMenuOpen()) {
                    this.hideMenu();
                }
                else {
                    this.showMenu();
                }
            },
            hideMenu: function () {
                if (jBWService.isMenuOpen()) {
                    $("#foldingmenu").attr("src", 'images/jbasisweb/unfoldMenu.png');
                    $("#body").css("left", "0px");
                    $("#menufolding").css("left", "0px");
                    $("#header-content-top-left").css("margin-left", "23px");
                    $("#menuvoices").css("width", "0px");
                    $("#menu").css("width", "0px");
                    $("#menu").css("overflow-y", "hidden");
                    jBWService.setMenuOpen(false);
                }
            },
            showMenu: function () {
                if (!jBWService.isMenuOpen()) {
                    $("#menufolding").css("left", "205px");
                    $("#foldingmenu").attr("src", 'images/jbasisweb/foldMenu.png');
                    $("#body").css("left", "205px");
                    $("#menuvoices").css("width", "205px");
                    $("#menu").css("width", "205px");
                    $("#menu").css("padding-left", "0px");
                    $("#body").css("left", "205px");
                    $("#menu").css("overflow-y", "auto");
                    $("#header-content-top-left").css("margin-left", ($("#menu").width() + 23) + "px");
                    jBWService.setMenuOpen(true);
                }
            },
            hideMenuFolding: function (hideMenuFolding) {
                $("#foldingmenu").css("visibility", hideMenuFolding ? "hidden" : "visible");
            }
        }
    }]);
