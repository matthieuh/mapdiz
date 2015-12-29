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

SetModule('mapdiz', [
  'ngSanitize',
  'angular-meteor',
  'angular-img-cropper',
  'ui.router',
  'GoogleMapsNative',
  'ngFileUpload',
  'ngMaterial',
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
      .setPrefix('mapdiz')
      .setStorageType('sessionStorage');

  }
}


@Component({selector: 'mapdiz', controllerAs: 'Mapdiz'})
@View({ templateUrl: 'client/1mapdiz/mapdiz.html' })
@Inject('$scope', '$reactive', '$rootScope', '$state', '$meteor')

class Mapdiz {
  constructor($scope, $reactive, $rootScope, $state, $meteor) {
    var self = this;

    $reactive(self).attach($scope);

    self.subscribe('avatars');
    self.subscribe('users');

    $scope.$state = $state;

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });


    /*self.helpers({
      isLoggedIn: () => {
        return Meteor.userId() !== null;
      },
      currentUser: () => {
        return Meteor.user();
      }
    });*/


  }
}

bootstrap(Mapdiz, config);
