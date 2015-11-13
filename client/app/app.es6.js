var {SetModule, Component, View, Events, Inject, bootstrap, Filter} = angular2now;
var google;
// Tell angular2-now to set controllerAs to "vm", instead of the default componentName
// This is mostly because "vm" is shorter to type :)
angular2now.options({
  controllerAs: 'vm' ,
  spinner: {
    show: function () { document.body.style['background-color'] = 'yellow'; },
    hide: function () { document.body.style['background-color'] = ''; }
  }
})

SetModule('secretp', [
  'ngSanitize',
  'angular-meteor',
  'angular-img-cropper',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'GoogleMapsNative',
  'ngFileUpload',
  'ngMaterial',
  'ngImgCrop',
  'xeditable',
  'angular-sortable-view',
  'google.places',
  'angucomplete-alt',
  'duScroll',
  'angularMoment',
  'rzModule',
  'LocalStorageModule',
  'angular-click-outside'
]);

@Inject('gmLibraryProvider', '$windowProvider', 'localStorageServiceProvider')

class config {
  constructor (gmLibraryProvider, $windowProvider, localStorageServiceProvider) {

    gmLibraryProvider.configure({
      language: 'fr',
      libraries: ['places']
    });

    localStorageServiceProvider
      .setPrefix('secretp')
      .setStorageType('sessionStorage');
  }
}

@Component({selector: 'secretp'})
@View({ templateUrl: 'client/app/app.html' })
@Inject('$scope', '$rootScope', '$state', '$meteor')

class secretp {
  constructor ($scope, $rootScope, $state, $meteor) {
    self = this;
    self.url = url;
    self.profilePics = $meteor.collectionFS(ProfilePics, true);
    google = $scope.google;

    $scope.$state = $state;
    $rootScope.$on("$stateChangeError",
      function (event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireUser promise is rejected
      // and redirect the user back to the main page
      if (error === "AUTH_REQUIRED") {
        $state.go('events');
      }
    });

    $rootScope.$watch('currentUser', function(nv, ov) {
      // user logout - redirect to parties-list
      if (!nv && ov) {
        $state.go('events');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
	    $rootScope.previousState = from.name;
	    $rootScope.currentState = to.name;
  	});

    $meteor.waitForUser().then(function() {
      if (!$rootScope.currentUser) return;
      var profilePicsHandle;
      var usersHandle;
      $meteor.subscribe('users').then(function(handle) {
        usersHandle = handle;
        self.user =  Meteor.users.findOne($rootScope.currentUser._id);
      });
      $meteor.subscribe('profilePics').then(function(handle) {
        profilePicsHandle = handle;
        self.profilePic = $meteor.object(ProfilePics, self.user.profilePicture, true);
      });

      $scope.$on('$destroy', function() {
        subscriptionHandle.stop();
        usersHandle.stop();
      });
    });

    function url() {
      var image = self.profilePic;
      if (!image || !image.url) return null;
      return image.url({store: 'profilePic-small'});
    };

  }
}

bootstrap(secretp, config);
