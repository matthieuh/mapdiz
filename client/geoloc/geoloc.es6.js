"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('secretp');

@Component({
  selector: 'geoloc',
  bind: {
    location: '='
  }
})

@View({
  templateUrl: 'client/geoloc/geoloc.html',
  transclude: true
})

@Inject('$scope', '$meteor', '$rootScope', '$state', '$log', '$mdDialog')

class Geoloc {
  constructor($scope, $meteor, $rootScope, $state, $log, $mdDialog) {

    var self = this;
    self.openSetGeolocModal = openSetGeolocModal;

    /////////////////

    function openSetGeolocModal() {
      var parentEl = angular.element(document.querySelector('.main-section'))[0];
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        controller: function addImageModal($scope, $rootScope, $state, $mdDialog, newOrder, mapSvc) {

          $scope.placesObj = null;
          $scope.geolocChoiceType = 'address';
          $scope.answer = answer;
          $scope.placeObjToLocation = placeObjToLocation;

          $scope.$on('draggableMarker.position.changed', draggableMarkerChanged);
          $scope.$on('$destroy', reinitDialog);

          mapSvc.draggableMarker.draggable = true;



          ///////////////////

          function reinitDialog() {
            mapSvc.draggableMarker.draggable = false;
          }

          /**
           * [draggableMarkerChanged description]
           * @return {[type]} [description]
           */
          function draggableMarkerChanged(event, value) {
            $scope.geolocChoiceType = 'coordinates';
            $scope.placesObj = {};
            $scope.location = {
              lat: value.lat() || value.lat || null,
              lng: value.lng() || value.lng || null
            };

          }

          /**
           * Transform google place object to location one
           * @param  {[type]} placeObj [description]
           * @return {[type]}          [description]
           */
          function placeObjToLocation(placeObj) {

            if (placeObj && placeObj.geometry) {
              $scope.location = {
                address: {
                  html: placeObj.adr_address,
                  display: placeObj.formatted_address
                },
                lat: placeObj.geometry.location.lat(),
                lng: placeObj.geometry.location.lng()
              };
            }

            mapSvc.draggableMarker.position = {
              lat: $scope.location.lat,
              lng: $scope.location.lng
            };

            mapSvc.setMapCenter(mapSvc.draggableMarker.position);
          }

          /**
           * close dialog, reset dialog state and return eventual location
           * @param  {[type]} location [description]
           * @return {[type]}          [description]
           */
          function answer(location) {
            if (location) {
              $mdDialog.hide(location);
            } else {
              $scope.location = {};
              $mdDialog.hide();
            }
          }

        },
        templateUrl: 'client/geoloc/set-geoloc-modal.html',
        scope: $scope.$new(),
        locals: {
          newOrder: 0
        }
      }).then(function(location) {
        console.log('then openSetGeolocModal', $scope.placesObj);
        if (location) {
          self.location = location;
        }
      })
    };


  }
}
