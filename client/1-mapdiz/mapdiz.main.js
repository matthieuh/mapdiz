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
  'angular-meteor.auth',
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
  'accounts.ui',
  'angularify.semantic.dropdown',
]);

@Component({
  selector: 'mapdiz',
  controllerAs: 'Mapdiz'
})

@View({ templateUrl: 'client/1-mapdiz/mapdiz.html' })
@Inject('$scope', '$reactive', '$rootScope', '$state', '$meteor')

class Mapdiz {
  constructor($scope, $reactive, $rootScope, $state, $meteor) {
    var self = this;

    $reactive(self).attach($scope);

    self.subscribe('avatars');
    self.subscribe('users');

    $scope.$state = $state;

    console.log('$scope.$state', $scope.$state);

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });
  }
}

let mapdizApp = angular.module('mapdiz');

mapdizApp.config((gmLibraryProvider, $windowProvider, localStorageServiceProvider, $translateProvider) => {
  console.log('config');

  //$translateProvider.useSanitizeValueStrategy('sanitize');
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
});

mapdizApp.run((amMoment) => {
  amMoment.changeLocale('fr');
});

function onReady() {
  console.log('ready');
  angular.bootstrap(document, ['mapdiz'], {
    strictDi: true
  });
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);
