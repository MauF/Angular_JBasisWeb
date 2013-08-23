'use strict';

angular.module('jBasisWeb.directives', ['jBasisWeb.services']).
    run([function(){
        console.info("jBasisWeb.directives injected!!");
    }]).
    directive('infoTable', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                headers: '=',
                data: '=',
                showactions: '=',
                title: '=',
                zoomfn: '&'
            },
            link: function (scope, element, attributes) {

            },
            templateUrl: 'modules/jBasisWeb/js/partials/tableWithPager.html'
        };
    }).
    directive('rgiButton', [function () {
        return {
            restrict: 'A',
            scope: {

            },
            controller: ['$scope', function($scope) {
                console.log("");
                /*
                $("#"+$scope.idElement).attr("name", $scope.name);
                $("#"+$scope.idElement).attr("value", $scope.value);
                $("#"+$scope.idElement).attr("title", $scope.title);
                */
            }],
            link: function (scope, element, attributes) {
                console.log("");
                element.attr("name", scope.name);
                element.attr("value", scope.value);
                element.attr("title", scope.title);
                /*
                scope.idElement = attributes.id;
                */
            }
        };
    }]).
    directive('jbwMenu', [function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                menuItems: '='
            },
            link: function (scope, element, attributes) {
                console.log("jbw-menu", attributes.menuItems);
            },
            templateUrl: 'modules/jBasisWeb/js/partials/jbwMenuTemplate.html'
        };
    }]).
    directive('jbwMenuVoices', [function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                menuItem: '='
            },
            link: function (scope, element, attributes) {
                console.log("jbw-menu-voices", attributes.menuItem);
            },
            templateUrl: 'modules/jBasisWeb/js/partials/jbwMenuVoicesTemplate.html'
        };
    }]);
