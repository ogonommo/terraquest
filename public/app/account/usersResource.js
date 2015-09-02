app.factory('UsersResource', function($resource) {
    var UsersResource = $resource('/api/users/:id', {_id:'@id'}, { update: {method: 'PUT', isArray: false}});

    UsersResource.prototype.isAdmin = function() {
        return this.roles && this.roles.indexOf('admin') > -1;
    };

    return UsersResource;
});

app.factory('ManageResource', function($resource) {
    var ManageResource = $resource('/api/player', {get: {method: 'GET', isArray: false}});

    return ManageResource;
});
