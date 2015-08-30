app.controller('PlanetCtrl', function($scope, $http, identity) {
    $http.get('/api/planet').success(function(p){
        $scope.Planet = p;
        var player = new Player(identity.currentUser);
        //player.log();
    });
});