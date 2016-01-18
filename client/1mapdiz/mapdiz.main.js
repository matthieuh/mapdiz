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
  'angular-click-outside',
  'mightyDatepicker',
  'mentio',
  'hashtagify',
  'pascalprecht.translate',
  'accounts.ui'
]);

@Component({
  selector: 'mapdiz',
  controllerAs: 'Mapdiz'
})

@View({ templateUrl: 'client/1mapdiz/mapdiz.html' })
@Inject('$scope', '$reactive', '$rootScope', '$state', '$meteor')

class Mapdiz {
  constructor($scope, $reactive, $rootScope, $state, $meteor) {
    var self = this;

    self.toto = 'toto';

    $reactive(self).attach($scope);

    self.subscribe('avatars');
    self.subscribe('users');

    $scope.$state = $state;

    console.log('$scope.$state', $scope.$state);

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

@Inject('gmLibraryProvider', '$windowProvider', 'localStorageServiceProvider', '$translateProvider')

class MapdizConfig {
  constructor (gmLibraryProvider, $windowProvider, localStorageServiceProvider, $translateProvider) {
    console.log('config');
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.translations({
      'SLOGAN':'Hey Guys, this is a headline!'
    });
    $translateProvider.useStaticFilesLoader(
      {
        prefix: 'assets/translations/locale-',
        suffix: '.json'
      }
    )
    $translateProvider.preferredLanguage('fr');

    gmLibraryProvider.configure({
      language: 'fr',
      libraries: ['places']
    });

    localStorageServiceProvider
      .setPrefix('mapdiz')
      .setStorageType('sessionStorage');

  }
}


bootstrap(Mapdiz/*, MapdizConfig*/);
