"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@Component({
  selector: 'geoloc',
  bind: {
    location: '=',
    edition: '='
  }
})

@View({
  templateUrl: 'client/geoloc/geoloc.html',
  transclude: true
})

@Inject('$scope', '$meteor', '$rootScope', '$state', '$log', '$mdDialog', 'mapSvc')

class Geoloc {
  constructor($scope, $meteor, $rootScope, $state, $log, $mdDialog, mapSvc) {

    var self = this;
    self.openSetGeolocModal = openSetGeolocModal;

    /////////////////

    function openSetGeolocModal() {

      if (self.edition)  {

        console.log('mapSvc.map.center', mapSvc.map.center)
        mapSvc.draggableMarker.position = mapSvc.map.center;
        mapSvc.draggableMarker.visible = true;

        var parentEl = angular.element(document.querySelector('.main-section'))[0];

        $mdDialog.show({
          clickOutsideToClose: true,
          parent: parentEl,
          controller: ['$scope', '$rootScope', '$state', '$mdDialog', 'location', 'mapSvc', _setGeolocModalController],
          templateUrl: 'client/geoloc/set-geoloc-modal.html',
          scope: $scope.$new(),
          locals: {
            location: self.location
          }
        }).then(function(location) {
          if (location) {
            self.location = location;
          }
        })
      } else if (self.location) {
        mapSvc.map.center = self.location;
      }
    };

    function _setGeolocModalController($scope, $rootScope, $state, $mdDialog, location, mapSvc) {

      var blockLatLngBinding = false;

      // Scope vars & fns
      $scope.location = location;
      $scope.placesObj = null;
      $scope.geolocChoiceType = 'address';
      $scope.answer = answer;
      $scope.placeObjToLocation = placeObjToLocation;
      $scope.latLngChanged = latLngChanged;
      $scope.latLngFocused = latLngFocused;

      // Events listener
      $scope.$watch('location.lat', latLngChanged);
      $scope.$watch('location.lng', latLngChanged);
      $scope.$on('draggableMarker.drag', draggableMarkerOnDrag);
      $scope.$on('draggableMarker.position.changed', draggableMarkerChanged);
      $scope.$on('$destroy', reinitDialog);

      mapSvc.draggableMarker.content = "Déplace-moi sur le lieu de l'évenement";
      mapSvc.draggableMarker.draggable = true;
      mapSvc.draggableMarker.visible = true;

      ///////////////////

      /**
       * [reinitDialog description]
       * @return {[type]} [description]
       */
      function reinitDialog() {
        mapSvc.draggableMarker.draggable = false;
      }

      function latLngChanged() {
        if (!blockLatLngBinding && $scope.location && $scope.location.lat && $scope.location.lng) {
          mapSvc.draggableMarker.position = {
            lat: $scope.location.lat,
            lng: $scope.location.lng
          };

          mapSvc.setMapCenter(mapSvc.draggableMarker.position);
        }
      }

      function latLngFocused() {
        blockLatLngBinding = false;
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
          blockLatLngBinding = true;
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
          mapSvc.draggableMarker.visible = false;
          $scope.location = {};
          $mdDialog.hide();
        }
      }

    }
  }
}
