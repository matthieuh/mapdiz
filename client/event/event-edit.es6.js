"use strict";

var {Component, View, Inject, State} = angular2now;

angular.module('secretp');

@State({
  name: 'eventEdit', url: '/events/:eventId/edit'
  /*resolve: {
    currentUser: $meteor => { "ngInject"; return $meteor.requireUser() }
  }*/
})

@Component({selector: 'event-edit'})
@View({templateUrl: 'client/event/event-edit.html'})
@Inject(['$scope', '$rootScope', '$meteor', '$stateParams', '$mdDialog', 'mapSvc'])

class EventEdit {

  constructor($scope, $rootScope, $meteor, $stateParams, $mdDialog, mapSvc) {
    var self = this;
    var prevMap = {};
    var previousState;

    self.users = $meteor.collection(Meteor.users, false).subscribe('users');

    self.invite = invite;
    self.canInvite = canInvite;
    self.url = url;
    self.openAddImageModal = openAddImageModal;
    //self.addImage = addImage;

    $scope.$meteorSubscribe('images').then(function(subscriptionHandle){
      self.images = $meteor.collection(Images, false);
    });

    $scope.$meteorSubscribe('events').then(function(subscriptionHandle){
      self.event = $meteor.object(Events, $stateParams.eventId);
      self.mainPic = _.find(self.images, {_id: self.event.mainPic});
    });

    console.log('mainPic 1', self.mainPic);

    /*function addImage() {
      $('<input type="file">').bind("change", function (event) {
        var toSave = event.target.files[0];
        console.log('toSave', toSave);
        self.images.save(toSave).then(function(savedImgs){
          console.log('self.images.save', savedImgs[0]);
          self.event.mainPic = savedImgs[0]._id._id;
          console.log(self.event.mainPic);
          self.mainPic = $meteor.object(Images, self.event.mainPic, true);
          console.log(self.mainPic);
        });
      }).click();
    };

    function openAddImageModal() {
      $mdDialog.show({
        controller: function addImageModal($scope, $rootScope, $state, $mdDialog, newOrder) {
          $scope.myAreaCoords = {};
          $scope.addImages = function (files) {
            if (files.length > 0) {
              var reader = new FileReader();
              console.log('addImages', files[0]);
              $scope.myNonCroppedImage = files[0];
              reader.onload = function (e) {
                console.log('onload', e);
                $scope.$apply(function() {
                  $scope.imgSrc = e.target.result;
                  $scope.myCroppedImage = '';
                })
              };
              reader.readAsDataURL(files[0]);
            }
            else {
              $scope.imgSrc = undefined;
            }
          };

          $scope.saveCroppedImage = function() {
            console.log('saveCroppedImage', $scope.myCroppedImage, $scope.myNonCroppedImage);
            if ($scope.myCroppedImage !== '') {
              var nonCroppedFileObject = new FS.File($scope.myNonCroppedImage);

              var f = $scope.cropDetails.image.width / $scope.cropDetails.canvas.width;
              var vx = $scope.cropDetails.size.x;
              var vy = $scope.cropDetails.size.y;
              var vw = $scope.cropDetails.size.w;
              var vh = $scope.cropDetails.size.h;
              var cropInfos = {
                x: vx*f, y: vy*f,
                w: vw*f, h: vh*f
              };

              nonCroppedFileObject.metadata = {
                owner: $rootScope.currentUser._id,
                description: '',
                order: newOrder,
                cropInfos: cropInfos
              };

              self.images.save(nonCroppedFileObject).then(function(result) {
                console.log('save img result', result[0]._id);
                $scope.uploadedOriginalImage = result[0]._id;
                $scope.answer(true);
              });
            }
          };

          $scope.answer = function(saveImage) {
            if (saveImage) {
              $mdDialog.hide($scope.uploadedOriginalImage);
            } else {
              if ($scope.uploadedImage) {
                self.images.remove($scope.uploadedImage._id);
              }
              $mdDialog.hide();
            }
          }
        },
        templateUrl: 'client/picture/add-picture-modal.html',
        scope: $scope.$new(),
        locals: {
          newOrder: 0
        },
        parent: angular.element(document.body)
      }).then(function(image) {
        if (image) {
          console.log('new image', image);
          self.event.mainPic = image._id;
          self.mainPic = image.url({store: 'cropped'});
        }
      })
    };*/

    function url(store) {
      if (!self.event || !self.event.mainPic || !self.event.mainPic) return null;
      self.mainPic = _.find(self.images, {_id: self.event.mainPic});
      if (!self.mainPic || !self.mainPic.url) return null;
      return self.mainPic.url({store: store});
    };

    // Tasks to run on directive initialisation
    var subscriptionHandle;
    $meteor.subscribe('images');
    $meteor.subscribe('events').then(function (handle) {
      subscriptionHandle = handle;
      previousState = $rootScope.previousState;
      prevMap = mapSvc.getMap(['center','zoom']);
      mapSvc.updateMap({'center':{'latitude': self.event.latitude, 'longitude': self.event.longitude}, 'zoom': 8});
    });

    $scope.$on('$destroy', function () {
      subscriptionHandle.stop();
      if(previousState === 'events') {
        mapSvc.updateMap(prevMap);
      } else {
        mapSvc.setMapCenter('userGeoLoc');
      }
    });

    // API and task implementation functions
    function invite(user) {
      $meteor.call('invite', self.event._id, user._id).then(
        function (data) {
          console.log('success inviting', data);
        },
        function (err) {
          console.log('failed', err);
        }
      );
    };

    function canInvite() {
      if (!self.event)
        return false;

      return !self.event.public &&
        self.event.owner === Meteor.userId();
    };
  }
}
