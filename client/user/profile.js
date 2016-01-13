var {SetModule, Component, View, Inject, State} = angular2now;

SetModule('mapdiz');

@State({
  name: 'app.profile',
  url: '/profile'
})

@Component({selector: 'profile', controllerAs: 'Profile'})
@View({templateUrl: 'client/user/profile.html'})
@Inject('$scope', '$reactive', 'mapSvc', '$log', '$timeout')

class Profile {

  constructor($scope, $reactive, mapSvc, $log, $timeout) {
    $log.info('Profile');

    var self = this;
    var avatarInput = $('#avatar-input');

    $reactive(self).attach($scope);

    self.helpers({
      isLoggedIn() {
        return Meteor.userId() != null;
      },
      currentUser() {
        return Meteor.user();
      }
    });

    self.autorun(() => {
      if (Meteor.user() && Meteor.user().avatar) {
        $timeout(self.avatar = Avatars.findOne(self.getReactively('currentUser.avatar')));
        console.log('currentUser', self.currentUser);
      } else {
        delete self.avatar;
      }
    });

    _centerMapOnUserLoc();

    self.openAvatarInput = _openAvatarInput;
    self.deleteAvatar = _deleteAvatar;
    avatarInput.bind("change", _uploadAvatar);

    ///////////////////

    /**
     * [centerOnUserGeoloc description]
     * @return {[type]} [description]
     */
    function _centerMapOnUserLoc() {
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
    function _openAvatarInput() {
      avatarInput.click();
    };

    function _uploadAvatar(event) {
      console.log('uploadImage', event.target.files[0]);
      Avatars.insert(event.target.files[0], function (err, fileObj) {
        if (err) {
          console.log('uploadProfilePic', err);
        } else {
          console.log('success');
        }
      });
    }

    function _deleteAvatar() {
      console.log('deleteAvatar', self.currentUser);
      if (self.currentUser && self.currentUser.avatar) {
        Avatars.remove(self.currentUser.avatar);
        console.log('Meteor.user()._id', Meteor.user()._id);
        Meteor.users.update({_id: Meteor.user()._id}, {$set: { 'avatar': '' }});
      }
    }
  }
}
