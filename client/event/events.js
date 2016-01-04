let {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@State({
  name: 'app.events',
  url: '/events?latlng',
  defaultRoute: true,
  html5Mode: true
})

@Component({selector: 'events-list'})
@View({templateUrl: 'client/event/events.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$stateParams', '$filter', '$log', 'mapSvc', 'localStorageService', '$timeout', '@Mapdiz')

class EventsList {
  constructor($scope, $reactive, $rootScope, $state, $stateParams, $filter, $log, mapSvc, localStorage, $timeout, Mapdiz) {
    $log.info('EventsList', $scope.$parent);

    var self = this;
    var orderBy = $filter('orderBy');
    var subscriptionHandle;

    $reactive(self).attach($scope);

    self.creator = creator;
    self.rsvp = rsvp;
    self.getUserById = getUserById;
    self.pageChanged = pageChanged;
    self.remove = remove;
    self.myPresence = myPresence;
    self.order = order;
    self.isOverflown = isOverflown;
    self.mapSvc = mapSvc;
    self.url = url;
    //self.images = $meteor.collectionFS(Images, false).subscribe('images');
    self.timeFilter = {
      options: {
        floor: 0,
        ceil: 15,
        step: 1,
        hideLimitLabels: true,
        disabled: true
      }
    };
    self.distanceFilter = {
      options: {
        floor: 0,
        ceil: 15,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
        disabled: true
      }
    };

    // Bind filters parameters in session storage
    localStorage.bind($scope, 'vm.timeFilter.min', 0);
    localStorage.bind($scope, 'vm.timeFilter.max', 15);
    localStorage.bind($scope, 'vm.timeFilter.options.infinite', false);
    localStorage.bind($scope, 'vm.timeFilter.options.disabled', true);

    localStorage.bind($scope, 'vm.distanceFilter.min', 0);
    localStorage.bind($scope, 'vm.distanceFilter.max', 15);
    localStorage.bind($scope, 'vm.distanceFilter.options.infinite', false);
    localStorage.bind($scope, 'vm.distanceFilter.options.disabled', true);

    /*$meteor.autorun($scope, autorun);
    function autorun() {

      $meteor.subscribe('users').then(function(handle){
        subscriptionHandle = handle;
        self.users = $meteor.collection(Meteor.users, false);
      });

    };*/

    //mapSvc.updateVisibleMarkers();
    setMapCenter();

    $scope.$on('$destroy', function() {
      if(angular.isDefined(subscriptionHandle)){
        subscriptionHandle.stop();
        subscriptionHandle = undefined;
      }
    });

    ////////////////////////

    function url(event, store) {
      if(event && event.cover) {
        var image = _.find(self.images, {_id: event.cover});
        if (!image || !image.url) return null
        return image.url({store: store});
      }
    };

    function isOverflown(eventId) {
      return (mapSvc.getOverflownMarkerId() === eventId);
    };

    function order(predicate, reverse) {
      vm.mapSvc.filteredEvents = orderBy(vm.mapSvc.filteredEvents, predicate, reverse);
    };

    function myPresence(event, answer) {
      return _.some(event.rsvps, function(rsvp) {
        return rsvp.user === $rootScope.currentUser._id && rsvp.rsvp === answer;
      });
    }

    function watchOrderProperty() {
      if (self.orderProperty) self.sort = {name: parseInt(self.orderProperty)};
    }

    function remove(eventId) {
      mapSvc.events.remove(eventId);
    }

    function pageChanged(newPage) {
      self.page = newPage;
    }

    function getUserById(userId) {
      return Meteor.users.findOne(userId);
    }

    /**
     * [creator description]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    function creator(event) {
      if (!event)
        return;
      var owner = self.getUserById(event.owner);
      if (!owner)
        return "Mapdiz";

      if ($rootScope.currentUser)
        if ($rootScope.currentUser._id)
          if (owner._id === $rootScope.currentUser._id)
            return "moi";

      return owner;
    }

    /**
     * [rsvp description]
     * @param  {[type]} eventId [description]
     * @param  {[type]} rsvp    [description]
     * @return {[type]}         [description]
     */
    function rsvp(eventId, rsvp) {
      Meteor.call('rsvp', eventId, rsvp);
    }

    /**
     * [setMapCenter Set map center]
     */
    function setMapCenter() {

      if ($stateParams.latlng) {
        var splittedLatlng = $stateParams.latlng.split(',');

        if (splittedLatlng.length >= 2) {

          var searchedLatlng = {
            lat: splittedLatlng[0],
            lng: splittedLatlng[1]
          };

          mapSvc.setMapCenter(searchedLatlng);
        } else {
          centerOnUserGeoloc();
        }
      } else {
        centerOnUserGeoloc()
      }
    }

    /**
     * [centerOnUserGeoloc description]
     * @return {[type]} [description]
     */
    function centerOnUserGeoloc() {
      var newPosition = mapSvc.getNewPosition();

      if (_.isEmpty(newPosition)){
        mapSvc.setMapCenter('userGeoLoc', true);
        mapSvc.setMapZoom(12);
      } else {
        mapSvc.setMapCenter(newPosition.center);
        mapSvc.setMapZoom(newPosition.zoom);
      }
    }
  }
}
