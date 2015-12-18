var {SetModule, Component, View, Inject, State} = angular2now;

SetModule('mapdiz');

@State({
  name: 'app.profile',
  url: '/profile'
})

@Component({selector: 'profile', controllerAs: 'Profile'})
@View({templateUrl: 'client/user/profile.html'})
@Inject('$scope', '$reactive', 'mapSvc', '$log')

class Profile {

  constructor($scope, $reactive, mapSvc, $log) {
    $log.info('Profile');

    $reactive(this).attach($scope);

    this.helpers({
      isLoggedIn() {
        return Meteor.userId() != null;
      },
      currentUser() {
        return Meteor.user();
      }
    });

    console.log('currentUser', this.currentUser);

    centerMapOnUserLoc();

    this.openProfilePicInput = openProfilePicInput;
    var profilPicInput = $('#profile-pic-input');
    profilPicInput.bind("change", uploadProfilePic);

   /*function getUserInfos() {
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
    };*/

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



    /*function url() {
      if (!self.user || !self.user.profilePicture) return null;
      self.profilePic = _.find(self.profilePics, {_id: self.user.profilePicture});
      if (!self.profilePic || !self.profilePic.url) return null;
      return self.profilePic.url({store: 'profilePic-large'});
    };*/

    ///////////////////

    /**
     * [centerOnUserGeoloc description]
     * @return {[type]} [description]
     */
    function centerMapOnUserLoc() {
      var newPosition = mapSvc.getNewPosition();

      if (_.isEmpty(newPosition)){
        mapSvc.setMapCenter('userGeoLoc');
      } else {
        mapSvc.setMapCenter(newPosition.center);
        mapSvc.setMapZoom(newPosition.zoom);
      }
    }

    /**
     * [uploadImage description]
     * @return {[type]} [description]
     */
    function openProfilePicInput() {
      profilPicInput.click();
    };

    function uploadProfilePic(event) {
      console.log('uploadImage', event.target.files[0]);
      ProfilePics.insert(event.target.files[0], function (err, fileObj) {
        if (err)
          console.log('uploadProfilePic', err);
        else
          console.log('success');
      });
    }
  }
}
