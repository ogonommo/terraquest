app.factory('ManageResource', function($resource) {
    var ManageResource = $resource('/api/player', {}, {get: {method: 'GET', isArray: false}});

    return ManageResource;
});
