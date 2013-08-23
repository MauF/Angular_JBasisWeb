'use strict';

function User(name) {
    this.name = name;

    this.getName = function () {
        return this.name;
    }
}

function MenuItem(name, label, route) {
    this.name = name;
    this.label = label;
    this.route = route;
    this.children = [];

    this.father = null;

    this.setName = function (name) {
        this.name = name;
    }

    this.getName = function () {
        return this.name;
    }

    this.setLabel = function (label) {
        this.label = label;
    }

    this.getLabel = function () {
        return this.label;
    }

    this.setRoute = function (route) {
        this.route = route;
    }

    this.getRoute = function () {
        return this.route;
    }

    this.getChildren = function () {
        return this.children;
    }

    this.getChildByName = function (childName) {
        for (var i = 0; i < this.getChildren().length; i++) {
            var menuItem = this.getChildren()[i];
            if (menuItem.getName() == childName)
                return  menuItem;
        }
        return null;
    }

    this.addChild = function (child) {
        child.father = this.getName();
        this.getChildren().push(child);
    }

    this.addChildren = function (children) {
        if (children instanceof Array) {
            for (var i = 0; i < children.length; i++) {
                this.addChild(children[i]);
            }
        }
    }

    this.hasChildren = function () {
        return this.getChildren().length > 0;
    }
};

MenuItem.searchItemFromItems = function (menuItems, menuName) {
    for (var index in menuItems) {
        var child = menuItems[index];
        var menuItem = MenuItem.searchItem(child, menuName);
        if (menuItem != null)
            return menuItem;
    }
    return null;
}

MenuItem.searchItem = function (menuItem, menuName) {
    if (menuItem.getName() == menuName) {
        return menuItem;
    }
    for (var index in menuItem.getChildren()) {
        return MenuItem.searchItem(menuItem.getChildren()[index], menuName);
    }
    return null;
}

angular.module('jBasisWeb', ['jBasisWeb.controllers', 'jBasisWeb.directives', 'jBasisWeb.filters', 'jBasisWeb.services']).
    run(['jBWService', function (jBWService) {
        console.info("jBasisWeb injected!!");
        // Menu definitions
        var logoutMenu = new MenuItem("logoutMn", "Logout", "#/login");
        var homeMenu = new MenuItem("mainMn", "MainMenu", "#/home");
        homeMenu.addChildren([logoutMenu]);

        jBWService.setMainMenu(homeMenu);
    }]).
    config(['$routeProvider', function ($routeProvider, $location) {
        $routeProvider.when('/gatekeeper/:path', {
            template: '<div></div>',
            controller: ['$location', '$rootScope', '$scope', 'jBWService', 'jBWUtility', '$routeParams', function ($location, $rootScope, $scope, jBWService, jBWUtility, $routeParams) {

                console.log("gatekeeper", $location.absUrl());

                var userLoggedIn = jBWService.getUserLoggedIn();

                if (userLoggedIn == null) {
                    console.log("gatekeeper", "no user logged in found ---> redirect to login");
                    $location.path("login");
                } else {
                    var redirect = null;
                    if ($routeParams.path == "unknown") {
                        redirect = "home";
                        console.log("gatekeeper", "user logged in found: " + userLoggedIn.getName() + " [the previous route doesn't exist] ---> redirect to " + redirect);
                    } else {
                        redirect = $routeParams.name;
                        console.log("gatekeeper", "user logged in found: " + userLoggedIn.getName() + " ---> redirect to " + $routeParams.name);
                    }

                    $location.path(redirect);
                }


            }]
        });

        $routeProvider.when('/logout', {
            template: '<div></div>',
            controller: ['$location', '$rootScope', '$scope', 'jBWService', 'jBWUtility', '$routeParams', function ($location, $rootScope, $scope, jBWService, jBWUtility, $routeParams) {
                console.log("logout", $location.absUrl());
                jBWUtility.hideMenuFolding(true);
                jBWUtility.hideMenu();
                jBWService.setBreadCrumbs([]);
                jBWService.setPageTitle("");

                jBWService.logout();

                $location.path("home");
                console.log("logout", "logout succeed!! ---> redirect to home");
            }]
        });

        $routeProvider.when('/login', {
            templateUrl: 'modules/jBasisWeb/js/partials/login.html',
            controller: ['$location', '$rootScope', '$scope', 'jBWService', 'jBWUtility', '$routeParams', function ($location, $rootScope, $scope, jBWService, jBWUtility, $routeParams) {

                var init = function () {
                    console.log("login", "init application");

                    jBWUtility.showMenu();
                    jBWUtility.hideMenuFolding(false);
                    jBWService.setPageTitle("Home");
                    jBWService.setHeaderInfo("User: " + jBWService.getUserLoggedIn().getName());

                    console.log("login - mainMenuItem", angular.toJson($scope.mainMenuItem, true));

                    jBWService.setInitExecuted(true);
                };


                console.log("login", $location.absUrl());
                jBWUtility.hideMenuFolding(true);
                jBWUtility.hideMenu();
                jBWService.setBreadCrumbs([]);
                jBWService.setPageTitle("Login");

                $scope.title = "-Please Login-";
                $scope.usernameLbl = "UserName: ";
                $scope.passwordLbl = "Password: ";
                $scope.okBtn = {name: "okBtn", value: "OK", title: "Login..."};
                $scope.clearBtn = {name: "clearBtn", value: "CLEAR", title: "Clear fields..."};

                $scope.tryToLogin = function () {
                    if ($scope.username == "admin" && $scope.password == "b") {
                        jBWService.setUserLoggedIn(new User($scope.username));
                        init();
                        console.log("login", "login succeed!! ---> redirect to home");
                        $location.path("home");
                    } else {
                        console.log("login", "Wrong UserName or Password...");
                        alert("Wrong UserName or Password...");
                    }
                };

                $scope.clearFields = function () {
                    $scope.username = "";
                    $scope.password = "";
                };

            }]
        });

        $routeProvider.when('/home', {
            templateUrl: 'modules/jBasisWeb/js/partials/home.html',
            controller: ['$location', '$rootScope', '$scope', 'jBWService', 'jBWUtility', '$routeParams', function ($location, $rootScope, $scope, jBWService, jBWUtility, $routeParams) {
                console.log("home", $location.absUrl());

                if (jBWService.checkLogin()) {
                    jBWUtility.showMenu();
                    jBWUtility.hideMenuFolding(false);
                    jBWService.setPageTitle("Home");
                }
            }]
        });

        $routeProvider.when('/error', {
            templateUrl: 'modules/jBasisWeb/js/partials/error.html',
            controller: ['$location', '$rootScope', '$scope', 'jBWService', 'jBWUtility', '$routeParams', function ($location, $rootScope, $scope, jBWService, jBWUtility, $routeParams) {
                console.log("error", $location.absUrl());
                $scope.errorMsg = "This page '" + $location.path() + "' doesn't exist!!!";
            }]
        });

        $routeProvider.otherwise({
                template: '<div/>',
                controller: ['$location', '$rootScope', '$scope', 'jBWService', 'jBWUtility', '$route', '$routeParams', function ($location, $rootScope, $scope, jBWService, jBWUtility, $route, $routeParams) {
                    var selectedMenuItem = jBWService.getSelectedMenuItem();
                    var errorMsg = "unknown route!!";
                    if (selectedMenuItem != null) {
                        errorMsg = "This route defined '" + selectedMenuItem.getRoute() + "' into the: '" + selectedMenuItem.getName() + "' menuItem is not defined!!!";
                    }
                    console.log("$routeProvider.otherwise branch", errorMsg);
                }],
                redirectTo: '/gatekeeper/unknown'
            }
        );
    }]).
    controller('appCtrl', ['$location', '$rootScope', '$scope', 'jBWService', 'jBWUtility', '$routeParams', '$http', function ($location, $rootScope, $scope, jBWService, jBWUtility, $routeParams, $http) {
        $scope.toggleMenu = function () {
            jBWUtility.toggleMenu();
        };

        $scope.selectMenuItem = function (menuItem) {
            if (menuItem.hasChildren()) {
                jBWService.setSelectedMenuItem(menuItem);
            }
            jBWService.setSelectedMenuName(menuItem.getName());
            jBWService.setPageTitle(menuItem.getLabel());
            jBWService.setBreadCrumbs(jBWService.fillBreadCrumbs(menuItem).reverse());
            return jBWService.getBreadCrumbs();
        };

        $scope.searchMenuItemByName = function (menuItem, menuItemName) {
            return MenuItem.searchItem(menuItem, menuItemName);
        };

        $scope.isMainMenu = function (menuItem) {
            if (menuItem != null) {
                return menuItem.getName() == jBWService.getMainMenuItem().getName();
            }
            return false;
        };

        $scope.isSelectedMenu = function (menuItem) {
            var isSelectedMenu = false;
            if (menuItem != null) {
                isSelectedMenu = menuItem.getName() == $scope.selectedMenu;
            }
            return isSelectedMenu;
        }

        $scope.resetMenu = function () {
            jBWService.setSelectedMenuItem(jBWService.getMainMenu());
            jBWService.setSelectedMenuName(jBWService.getSelectedMenuItem().getName());
            jBWService.setPageTitle("");
            jBWService.setBreadCrumbs([]);
        };


        $scope.openInfo = function () {
            $(document).ready(function () {

                $("#divDialog").dialog({
                    resizable: false,
                    autoOpen: false,
                    modal: true,
                    /*
                     width:400,
                     height:400,
                     */
                    title: "Info About the WebApp",
                    show: {
                        effect: "blind",
                        duration: 500
                    },
                    hide: {
                        effect: "fade",
                        duration: 500
                    },
                    buttons: {
                        /*
                         'Continue': function() {
                         $(this).dialog('close');
                         alert('You clicked continue');
                         }, // end continue button
                         Cancel: function() {
                         $(this).dialog('close');
                         } //end cancel button
                        */
                    }//end buttons

                });//end dialog

            }); //end ready event

            $http.get('modules/jBasisWeb/js/partials/webAppInfo.html').
                success(function (response) {
                    $('#divDialogBody').html(response);
                });

            $('#divDialogBody').css("height","100%");
            $('#divDialogBody').css("width","100%");
            $('#divDialogBody').css("vertical-align","middle");

            $('#divDialog').dialog('open');

        }

    }]);
