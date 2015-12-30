let {SetModule, Component, View, Inject, State} = angular2now;
let google; // Used for google place autocomplete

SetModule('mapdiz');

@State({
  name: 'app',
  abstract: true
})

@Component({selector: 'app', controllerAs: 'App'})
@View({templateUrl: 'client/app/app.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$meteor', '$log', '$compile')

class App {

  constructor($scope, $reactive, $rootScope, $state, $meteor, $log, $compile) {
    $log.info('App');

    var self = this;

    $reactive(self).attach($scope);

    self.helpers({
      events: eventsCollection
    });

    self.subscribe('events', eventsSubscription);
    self.subscribe('images');

    google = $scope.google;

    $scope.$state = $state;


    //////////////////////////

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

    function eventsCollection() {
      console.log('eventsCollection', self.events);
      return Events.find();
    }

    function eventsSubscription() {
      console.log('eventsSubscription', self.events);
      self.allEvents = self.filteredEvents = self.events;
      return [];
    }

  }
}
