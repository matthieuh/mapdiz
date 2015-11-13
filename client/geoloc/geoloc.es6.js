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
        controller: function addImageModal($scope, $rootScope, $state, $mdDialog, newOrder) {

          $scope.placesObj = null;
          $scope.geolocChoiceType = 'address';
          $scope.answer = answer;
          $scope.placeObjToLocation = placeObjToLocation;

          ///////////////////

          function placeObjToLocation(placeObj) {
            if (placeObj && placeObj.geometry) {
              console.log('placeObjToLocation', placeObj, placeObj.geometry.location.lat(), placeObj.geometry.location.lng());
              $scope.location = {
                address: {
                  html: placeObj.adr_address,
                  display: placeObj.formatted_address
                },
                lat: placeObj.geometry.location.lat(),
                lng: placeObj.geometry.location.lng()
              };
            }
          }

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
          console.log('new location', location);
          self.location = location;
        }
      })
    };


  }
}
