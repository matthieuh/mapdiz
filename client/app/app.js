let {SetModule, Component, View, Inject, State} = angular2now;
let google; // Used for google place autocomplete

SetModule('mapdiz');

@State({
  name: 'app',
  abstract: true
})

@Component({selector: 'app', controllerAs: 'App'})
@View({templateUrl: 'client/app/app.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$auth', '$log', '$compile', '$filter')

class App {

  constructor($scope, $reactive, $rootScope, $state, $auth, $log, $compile, $filter) {
    $log.info('App');

    var self = this;

    $reactive(self).attach($scope);

    self.subscribe('events', _eventsSubscription);
    self.subscribe('images');
    self.subscribe('categories');

    self.helpers({
      events: _eventsCollection,
      images: _imagesCollection,
      categories: _categoriesCollection
    });

    self.getImage = _getImage;
    self.showMap = true;

    google = $scope.google;
    $scope.$state = $rootScope.$state = $state;

    $scope.$on('event.overflown', function(event, args) {
      self.overflownEvent = args.id;
    });

    $scope.$on('event.overflown.none', function(event) {
      self.overflownEvent = false;
    });

    $scope.$on('map.toggle', _toggleMap);

    $rootScope.$on("$stateChangeError",
      function (event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireUser promise is rejected
      // and redirect the user back to the main page
      if (error === "AUTH_REQUIRED") {
        $state.go('app.events');
      }
    });

    $rootScope.$watch('currentUser', (nv, ov) => {
      if (!nv && ov) {
        $state.go('home');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });

    $auth.waitForUser().then( () => {
      if (!$rootScope.currentUser) return;
      self.user = $auth.currentUser;
    });

    //////////////////////////////

    function _eventsCollection() {
      return Events.find();
    }

    function _eventsSubscription() {
      return [null, null, self.getReactively('filteredCategory')];
    }

    function _imagesCollection() {
      return Images.find({});
    }

    function _categoriesCollection() {
      return Tags.find({
        advisable: true,
      });
    }

    function _toggleMap(event, show) {
      if (show) {
        self.showMap = show;
      } else {
        self.showMap = !self.showMap;
      }
    }

    function _getImage(image, onlyUrl) {

      if (image) {
        var url = $filter('filter')(self.images, {_id: image})[0].url();

        if (onlyUrl) {
          console.log('getImage', url);
          return url;
        }

        return {
          'background-image': 'url("' + url + '")'
        }
      }
    }

  }
}
