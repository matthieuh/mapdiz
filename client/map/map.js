_ = lodash;

let {SetModule, Component, Service, View, Inject, State} = angular2now;

SetModule('mapdiz');

@Component({selector: 'map', controllerAs: 'Map'})
@View({templateUrl: 'client/map/map.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$log', 'mapSvc', '$timeout', '$compile')

class Map {
  constructor($scope, $reactive, $rootScope, $state, $log, mapSvc, $timeout, $compile) {
    $log.info('MapCtrl', $scope.$parent);

    var self = this;

    $reactive(self).attach($scope);

    self.mapSvc = mapSvc;
    self.mapControl = {};
    self.draggableMarkerOnDrag = draggableMarkerOnDrag;
    self.draggableMarkerChanged = draggableMarkerChanged;

    $scope.$on('marker.openWindow', function(event, eventId) {
      var event = _.find(self.filteredEvents, {_id: eventId});
      event.show = true;
    });

    $scope.$on('marker.closeWindow', function(event, eventId) {
      var event = _.find(self.filteredEvents, {_id: eventId});
      event.show = false;
    });


    /////////////////////////////

    function draggableMarkerOnDrag() {
      $rootScope.$broadcast('draggableMarker.drag');
    }

    function draggableMarkerChanged() {
      $rootScope.$broadcast('draggableMarker.position.changed', self.mapSvc.draggableMarker.position);
    }
  }
}
