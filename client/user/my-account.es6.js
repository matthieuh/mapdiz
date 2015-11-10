"use strict";

var {Component, View, Inject, State} = angular2now;

angular.module('secretp');

@State({
  name: 'my-account', url: '/my-account'
})

@Component({selector: 'my-account'})
@View({templateUrl: 'client/user/my-account.html'})
@Inject(['$scope', '$rootScope', '$meteor', '$stateParams', '$log', 'mapSvc'])

class MyAccount {

  constructor($scope, $rootScope, $meteor, $stateParams, $log, mapSvc) {
    $log.info('MyAccount Class')
    console.log('MyAccount Class', $rootScope.currentUser);
    var self = this;
    var subscriptionHandle;

    self.addImage = addImage;
    self.profilePics = $meteor.collectionFS(ProfilePics, false).subscribe('profilePics');

    $meteor.waitForUser().then(getUserInfos);

    function getUserInfos() {
      self.url = url;
      $meteor.subscribe('users').then(function(handle){
        subscriptionHandle = handle;
        self.user =  $meteor.object(Meteor.users, $rootScope.currentUser._id, false);
        //Meteor.users.findOne($rootScope.currentUser._id);
        // self.profilePic = _.find(self.profilePics, {_id: self.user.profilePicture});
        // self.profilePic = $meteor.object(ProfilePics, self.user.profilePicture, false);
        console.log('autorun account', self.user);
        console.log('autorun account 2', self.profilePic);
      });
    };

    // $scope.$on('$destroy', function() {
    //   if(angular.isDefined(subscriptionHandle)){
    //     subscriptionHandle.stop();
    //     subscriptionHandle = undefined;
    //   }
    // });

    // self.user = $meteor.object( Meteor.users, $rootScope.currentUser._id, true).subscribe('users');
    // console.log('self.user ;)', self.user);
    // self.profilePic = $meteor.object(ProfilePics, self.user.profilePicture, true).subscribe('profilePics');
    // console.log('self.profilePic 2 ;)', self.profilePic);

    function addImage() {
      $('#upload-file').bind("change", function(event) {
        var picToSave = new FS.File( event.target.files[0]);
        console.log('addImage', event.target.files[0], picToSave);
        self.profilePics.save(picToSave).then(function(fileObj){
          console.log('then', fileObj);
          self.profilePic = fileObj[0]._id;
          console.log('self.profilePic add ;)', self.profilePic);
        }, function(error){
          console.log('save error', error);
        });
      }).click();
    };

    function url() {
      if (!self.user || !self.user.profilePicture) return null;
      self.profilePic = _.find(self.profilePics, {_id: self.user.profilePicture});
      if (!self.profilePic || !self.profilePic.url) return null;
      return self.profilePic.url({store: 'profilePic-large'});
    };
  }
}
