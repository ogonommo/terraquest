app.controller('ManageCtrl', function($scope, $http, $interval, identity, notifier) {

    $scope.takeAction = function(action) {
      console.log('action in angular: ' + action);
      $http.get('/api/player/' + action).success(function(s){
        if(s.success) {
          notifier.success(s.msg);
        } else {
          notifier.error(s.msg);
        }
      }).error(function(e){
        notifier.error(e.msg);
      });
    }
    function update(pd) {
      var level, multiplier, prop;
      if (pd.buildings.length) { //Go over the buildings
        for (var i = 0, len = pd.buildings.length; i < len; i+=1) {
          prop = pd.buildings[i];
          level = prop.level;
          multiplier = Math.pow(prop.prop.priceGradient, level);
          if (prop.upgrade) {
            prop.gold = prop.prop.price.gold * multiplier;
            prop.bionium = prop.prop.price.bionium * multiplier;
            prop.qubitium = prop.prop.price.qubitium * multiplier;
            prop.transendium = prop.prop.price.transendium * multiplier;
          } else {
            prop.gold = 0;
            prop.bionium = 0;
            prop.qubitium = 0;
            prop.transendium = 0;
          }
        }
      }
      if (pd.researches.length) {
        for (var i = 0, len = pd.researches.length; i < len; i+=1) {
          prop = pd.researches[i];
          if (prop.upgrade) {
            prop.gold = prop.prop.price.gold;
            prop.bionium = prop.prop.price.bionium;
            prop.qubitium = prop.prop.price.qubitium;
            prop.transendium = prop.prop.price.transendium;
          } else {
            prop.gold = 0;
            prop.bionium = 0;
            prop.qubitium = 0;
            prop.transendium = 0;
          }
        }
      }
      if (pd.tools.length) {
        for (var i = 0, len = pd.tools.length; i < len; i+=1) {
          prop = pd.researches[i];
          if (prop.upgrade) {
            prop.gold = prop.prop.price.gold;
            prop.bionium = prop.prop.price.bionium;
            prop.qubitium = prop.prop.price.qubitium;
            prop.transendium = prop.prop.price.transendium;
          } else {
            prop.gold = 0;
            prop.bionium = 0;
            prop.qubitium = 0;
            prop.transendium = 0;
          }
        }
      }
    }
    $http.get('/api/player').success(function(p){
        //$scope.Player = p;
        var player = new GamePlayer();
        player.put(p);
        player.update(true);
        var PlayerData = player.export();
        update(PlayerData);
        $scope.PlayerData = PlayerData;
        console.log($scope.PlayerData);
    });
    var playerUpdater = $interval(function(){
      if (!identity.isAuthenticated()) {
        $interval.cancel(playerUpdater);
        return;
      }
      $http.get('/api/player').success(function(p){
          //$scope.Player = p;
          var player = new GamePlayer();
          player.put(p);
          player.update(true);
          var PlayerData = player.export();
          update(PlayerData);
          $scope.PlayerData = PlayerData;
          console.log($scope.PlayerData);
      });
    }, 10000);

});
