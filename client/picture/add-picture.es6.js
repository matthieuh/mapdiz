"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('secretp');

@Component({
  selector: 'add-picture',
  bind: {
    picture: '='
  }
})

@View({
  templateUrl: 'client/picture/add-picture.html',
  transclude: true
})

@Inject('$scope', '$meteor', '$rootScope', '$state', '$log', '$mdDialog')

class AddPicture {
  constructor($scope, $meteor, $rootScope, $state, $log, $mdDialog) {
    $log.info('test');

    var self = this;
    self.openAddImageModal = openAddImageModal;

    /////////////////

    function openAddImageModal() {
      var parentEl = angular.element(document.querySelector('.main-content'))[0];
      console.log('parentEl', parentEl);
      $mdDialog.show({
        parent: parentEl,
        controller: function addImageModal($scope, $rootScope, $state, $mdDialog, newOrder) {
          $scope.myAreaCoords = {};
          $scope.cropper = {};
          $scope.cropper.sourceImage = null;
          $scope.cropper.croppedImage   = null;
          $scope.bounds = {};
          $scope.bounds.left = 0;
          $scope.bounds.right = 522;
          $scope.bounds.top = 522;
          $scope.bounds.bottom = 0;

          $scope.answer = answer;
          $scope.addPicture = addPicture;

          ////////////

          function addPicture($event) {
            console.log('add pic', document.querySelector('input[type="file"]'));
            document.querySelector('input[type="file"]').click();
          }

          function answer(saveImage) {
            if (saveImage) {
              $mdDialog.hide($scope.cropper.croppedImage);
            } else {
              $scope.cropper = {};
              $mdDialog.hide();
            }
          }
        },
        templateUrl: 'client/picture/add-picture-modal.html',
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
  }
}
