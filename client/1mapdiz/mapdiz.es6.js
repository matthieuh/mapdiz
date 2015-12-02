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
      .setPrefix('mapdiz')
      .setStorageType('sessionStorage');
  }
}


@Component({selector: 'mapdiz'})
@View({ templateUrl: 'client/1mapdiz/mapdiz.html' })
@Inject('$scope', '$rootScope', '$state', '$meteor')

class Mapdiz {
  constructor($scope, $rootScope, $state, $meteor) {
    var self = this;
    console.log('Mapdiz');
    $scope.$state = $state;

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });

  }
}

bootstrap(Mapdiz, config);
