var {SetModule, Filter} = angular2now;

SetModule('mapdiz');

@Filter({name: 'distance'})
class distanceFilter {
  constructor() {
    return function (items, filter, userGeoloc) {
      if( items && filter && userGeoloc ) {
        if(filter.disabled) return items;
        if(angular.isDefined(userGeoloc)) {
          var filtered = [];
          angular.forEach(items, function(item, index) {
            var distance = 0;
            if (item.position) {
              var distance = getDistanceFromLatLngInKm(
                userGeoloc.lat, userGeoloc.lng,
                item.position.lat, item.position.lng
              );
            }

            item.distance = distance;
            if(filter.max >= distance && !filter.infinite) filtered.push(item);
            if(filter.infinite) filtered.push(item);
          });
          var result = _.sortBy(filtered, 'distance');
          return result;
        }
      } else {
        console.warn('All of this params are require (%s) in directive distance-filter', 'items, filter , userGeoloc');
        return items;
      }

    };
  }
}

function getDistanceFromLatLngInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
