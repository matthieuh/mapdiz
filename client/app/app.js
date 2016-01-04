let {SetModule, Component, View, Inject, State} = angular2now;
let google; // Used for google place autocomplete

SetModule('mapdiz');

@State({
  name: 'app',
  abstract: true
})

@Component({selector: 'app', controllerAs: 'App'})
@View({templateUrl: 'client/app/app.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$meteor', '$log', '$compile', '$filter')

class App {

  constructor($scope, $reactive, $rootScope, $state, $meteor, $log, $compile, $filter) {
    $log.info('App');

    var self = this;

    $reactive(self).attach($scope);

    self.helpers({
      events: _eventsCollection,
      images: _imagesCollection
    });

    self.getImage = getImage;
    self.toto = 'toto';

    self.subscribe('events', _eventsSubscription);
    self.subscribe('images');

    google = $scope.google;

    $scope.$state = $state;



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
        $state.go('app.events');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });

    $meteor.waitForUser().then( () => {
      if (!$rootScope.currentUser) return;
      var profilePicsHandle;
      var usersHandle;
      $meteor.subscribe('users').then(function(handle) {
        usersHandle = handle;
        self.user =  Meteor.users.findOne($rootScope.currentUser._id);
      });

      $scope.$on('$destroy', function() {
        usersHandle.stop();
      });
    });

    //////////////////////////////

    function _eventsCollection() {
      console.log('eventsCollection', self.events);
      return Events.find();
    }

    function _eventsSubscription() {
      console.log('eventsSubscription', self.events);
      self.allEvents = self.filteredEvents = self.events;
      return [];
    }

    function _imagesCollection() {
      return Images.find({});
    }

    function getImage(image, onlyUrl) {
      
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
