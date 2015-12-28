"use strict";

_ = lodash;

var {SetModule, Component, Service, View, Inject, State} = angular2now;

SetModule('mapdiz');

@Component({selector: 'map', controllerAs: 'Map'})
@View({templateUrl: 'client/map/map.html'})
@Inject('$scope', '$meteor', '$rootScope', '$state', '$log', 'mapSvc', '$timeout', '$compile')

class map {
  constructor($scope, $meteor, $rootScope, $state, $log, mapSvc, $timeout, $compile) {
    $log.info('MapCtrl');

    var self = this;

    self.mapSvc = mapSvc;
    self.mapControl = {};
    self.draggableMarkerOnDrag = draggableMarkerOnDrag;
    self.draggableMarkerChanged = draggableMarkerChanged;
    self.getInfoWindowContent = (eventIndex) => {
      var event = mapSvc.filteredEvents[eventIndex];
      var eventContent = `
        <div class='info-window'>
          <div class='iw-container'>
            ${ event.cover ? `<div class='cover' style='background-image:url(${ Images.findOne(event.cover).url() })'></div>` : `` }
            <div class='info-window-content'>
              <h4>${ event.name }</h4>
              <div class='description mxn1' ng-show='eventDetails.newEvent.description'>
                <strong>Description :</strong> ${ event.description }
                <div class="iw-bottom-gradient"></div>
              </div>
            </div>
          </div>
        </div>
      `;
      return eventContent;
    }

    $meteor.autorun($scope, autorun);

    function autorun() {
      $meteor.subscribe('events').then(function(handle){
        self.mapSvc.events = self.mapSvc.filteredEvents = $meteor.collection(Events);
        mapSvc.updateVisibleMarkers();
      });
    };

    $scope.$on('marker.openWindow', function(event, eventId) {
      var event = _.find(self.mapSvc.filteredEvents, {_id: eventId});
      event.show = true;
    });

    $scope.$on('marker.closeWindow', function(event, eventId) {
      var event = _.find(self.mapSvc.filteredEvents, {_id: eventId});
      event.show = false;
    });


    /////////////////////////////

    function draggableMarkerOnDrag() {
      $rootScope.$broadcast('draggableMarker.drag');
    }

    function draggableMarkerChanged() {
      $rootScope.$broadcast('draggableMarker.position.changed', self.mapSvc.draggableMarker.position);
    }

    /*function initInfoWindow(mapInstance, eventIndex, infoWindow, event) {

      $timeout(function () {
        markerInstance.setAnimation(google.maps.Animation.BOUNCE);
      }, 3000);

      console.log('initInfoWindow', mapInstance, eventIndex, infoWindow, event);

      var eventContent = `
        <div class='info-window'>
          <div class='iw-container'>
            <img class='cover' ng-src='{{ Map.mapSvc.filteredEvents[${eventIndex}].cover }}'>
            <div class='info-window-content'>
              <h4>{{ Map.mapSvc.filteredEvents[${eventIndex}].name || "Nom de l'évenement" }}</h4>
              <div class='description mxn1' ng-show='Map.mapSvc.filteredEvents[${eventIndex}].description'>
                <strong>Description :</strong> {{ Map.mapSvc.filteredEvents[${eventIndex}].description }}
                <div class="iw-bottom-gradient"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      console.log('eventContent', eventContent);

      var compiled = $compile(eventContent)($scope);

      console.log('compiled', compiled[0]);

      self.infowindowContent[eventIndex] = compiled[0];
      //self.eventOptions.content = 'modified';
    }*/
  }
}

var toFixed = function(number) {
  return parseFloat(Number(number).toFixed(6));
}
