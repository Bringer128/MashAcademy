var mashAcademy = angular.module('MashAcademy', ['vr.directives.slider'])
.run(function ($rootScope) {
    $rootScope.fireResize = function () {
        $rootScope.$broadcast('resize');
    };

    $(window).resize(function () {
        $rootScope.fireResize();
    });

});