"use strict";

_ = lodash;

var {Component, Service, View, Inject, State} = angular2now;

angular.module('secretp');

@Component({selector: 'map'})
@View({templateUrl: 'client/map/map.html'})
@Inject(['$scope', '$meteor', '$rootScope', '$state', '$log', 'mapSvc', '$timeout'])

class Map {
  constructor($scope, $meteor, $rootScope, $state, $log, mapSvc, $timeout) {
    $log.info('MapCtrl');

    var self = this;
    var subscriptionHandle;

    self.mapSvc = mapSvc;
    self.mapControl = {};
    self.draggableMarkerOnDrag = draggableMarkerOnDrag;
    self.draggableMarkerChanged = draggableMarkerChanged;

    $meteor.autorun($scope, autorun);

    function autorun() {
      $meteor.subscribe('events').then(function(handle){
        self.mapSvc.events = self.mapSvc.filteredEvents = $meteor.collection(Events);
        mapSvc.updateVisibleMarkers();
        console.log('self.events', mapSvc.filteredEvents, self.mapSvc.filteredEvents);
      });
    };

    $scope.$on('marker.openWindow', function(event, eventId) {
      console.log('marker.openWindow');
      var event = _.find(self.mapSvc.filteredEvents, {_id: eventId});
      event.show = true;
    });

    $scope.$on('marker.closeWindow', function(event, eventId) {
      var event = _.find(self.mapSvc.filteredEvents, {_id: eventId});
      event.show = false;
    });

    $scope.$on('$destroy', function() {
      // subscriptionHandle.stop();
    });

    /////////////////////////////

    function draggableMarkerOnDrag() {
      $rootScope.$broadcast('draggableMarker.drag');
    }

    function draggableMarkerChanged() {
      console.log('draggableMarkerChanged', self.mapSvc.draggableMarker.position);
      $rootScope.$broadcast('draggableMarker.position.changed', self.mapSvc.draggableMarker.position);
    }
  }
}

var toFixed = function (number) {
  return parseFloat(Number(number).toFixed(6));
}
