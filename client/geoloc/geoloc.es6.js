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

    console.log('location', self.location);

    /////////////////

    function openSetGeolocModal() {

      var parentEl = angular.element(document.querySelector('.main-section'))[0];

      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        controller: setGeolocModalController,
        templateUrl: 'client/geoloc/set-geoloc-modal.html',
        scope: $scope.$new(),
        locals: {
          location: self.location
        }
      }).then(function(location) {
        console.log('then openSetGeolocModal', $scope.placesObj);
        if (location) {
          self.location = location;
        }
      })
    };

    function setGeolocModalController($scope, $rootScope, $state, $mdDialog, location, mapSvc) {

      // Scope vars & fns
      $scope.location = location;
      console.log('init $scope.location', $scope.location);
      $scope.placesObj = null;
      $scope.geolocChoiceType = 'address';
      $scope.answer = answer;
      $scope.placeObjToLocation = placeObjToLocation;

      // Events listener
      $scope.$watch('location.lat', latLngChanged);
      $scope.$watch('location.lng', latLngChanged);
      $scope.$on('draggableMarker.drag', draggableMarkerOnDrag);
      $scope.$on('draggableMarker.position.changed', draggableMarkerChanged);
      $scope.$on('$destroy', reinitDialog);

      mapSvc.draggableMarker.draggable = true;

      ///////////////////

      /**
       * [reinitDialog description]
       * @return {[type]} [description]
       */
      function reinitDialog() {
        mapSvc.draggableMarker.draggable = false;
      }

      function latLngChanged() {
        console.log('latLngChanged', $scope.location);
        if ($scope.location && $scope.location.lat && $scope.location.lng) {
          mapSvc.draggableMarker.position = {
            lat: $scope.location.lat,
            lng: $scope.location.lng
          };

          mapSvc.setMapCenter(mapSvc.draggableMarker.position);
        }
      }

      /**
       * [draggableMarkerOnDrag description]
       * @param  {[type]} event [description]
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      function draggableMarkerOnDrag(event, value) {
        $scope.geolocChoiceType = 'coordinates';
        $scope.placesObj = {};
      }

      /**
       * [draggableMarkerChanged description]
       * @return {[type]} [description]
       */
      function draggableMarkerChanged(event, value) {
        var latLng = {};

        if (value.hasOwnProperty('lat') && value.hasOwnProperty('lng')) {

          if (typeof value.lat == 'function' && typeof value.lng == 'function') {
            latLng = {
              lat: value.lat(),
              lng: value.lng()
            };
          } else {
            latLng = {
              lat: value.lat,
              lng: value.lng
            }
          }
        }

        if (Object.keys(latLng).length && $scope.geolocChoiceType == 'coordinates') {
          $scope.location = latLng;
        }

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

          mapSvc.draggableMarker.position = {
            lat: $scope.location.lat,
            lng: $scope.location.lng
          };

          mapSvc.setMapCenter(mapSvc.draggableMarker.position);
        }
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

    }
  }
}
