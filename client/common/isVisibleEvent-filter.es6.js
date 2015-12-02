var {SetModule, Filter, Inject} = angular2now;

SetModule('mapdiz');

@Filter({name: 'isVisibleEvent'})
@Inject(['mapSvc'])

class isVisibleEvent {
  constructor(mapSvc) {
    return function (items) {
      var map = mapSvc.getMap();
      if(angular.isDefined(map) && angular.isFunction(map.getBounds) && angular.isDefined(map.getBounds())){
        var filtered = [];
        angular.forEach(items, function(item, index) {
          if(  map.getBounds().contains({lat: function(){return item.position.lat}, lng: function(){return item.position.lng}})){
            filtered.push(item);
          }
        });
        return _.sortBy(filtered, 'distance');
      }
    }
  }
}
