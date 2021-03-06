var app = angular.module('app', ['ngResource', 'ngRoute', 'angulike']).value('toastr', toastr);

app.config(function($routeProvider, $locationProvider) {

    var routeUserChecks = {
        adminRole: {
            authenticate: function(auth) {
                return auth.isAuthorizedForRole('admin');
            }
        },
        authenticated: {
            authenticate: function(auth) {
                return auth.isAuthenticated();
            }
        }
    };

    $routeProvider
        .when('/', {
            templateUrl: '/partials/main/home',
            controller: 'MainCtrl'
        })
        .when('/signup', {
            templateUrl: '/partials/account/signup',
            controller: 'SignUpCtrl'
        })
        .when('/profile', {
            templateUrl: '/partials/account/profile',
            controller: 'ProfileCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/admin/users', {
            templateUrl: '/partials/admin/users-list',
            controller: 'UserListCtrl',
            resolve: routeUserChecks.adminRole
        })
        .when('/planet', {
            templateUrl: '/partials/planet/planet',
            controller: 'PlanetCtrl',
            resolve: routeUserChecks.authenticated
        })
        .when('/manage', {
          templateUrl: '/partials/manage/manage',
          controller: 'ManageCtrl',
          resolve: routeUserChecks.authenticated
        })
});

app.run(function($rootScope, $location) {
    $rootScope.facebookAppId = '[1644913802451554]';
    $rootScope.$on('$routeChangeError', function(ev, current, previous, rejection) {
        if (rejection === 'not authorized') {
            $location.path('/');
        }
    })
});
