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
    self.answer = answer;

    /////////////////

    function openSetGeolocModal() {
      var parentEl = angular.element(document.querySelector('.main-section'))[0];
      console.log('parentEl', parentEl);
      $mdDialog.show({
        parent: parentEl,
        controller: function addImageModal($scope, $rootScope, $state, $mdDialog, newOrder) {

        },
        templateUrl: 'client/geoloc/set-geoloc-modal.html',
        scope: $scope.$new(),
        locals: {
          newOrder: 0
        }
      }).then(function(image) {
        if (image) {
          console.log('new image', image);
          self.picture = image;
        }
      })
    };

    function answer(location) {
      if (location) {
        $mdDialog.hide($scope.cropper.croppedImage);
      } else {
        $scope.cropper = {};
        $mdDialog.hide();
      }
    }
  }
}
