app.factory('PlanetResource', function($resource) {
    var PlanetResource = $resource('/api/planet', {get: {method: 'GET', isArray: false}});

    return PlanetResource;
});