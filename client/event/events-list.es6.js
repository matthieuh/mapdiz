"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@State({
  name: 'app.events',
  url: '/events',
  defaultRoute: true,
  html5Mode: true
})

@Component({selector: 'events-list'})
@View({templateUrl: 'client/event/events-list.html'})
@Inject(['$scope', '$meteor', '$rootScope', '$state', '$filter', '$log', 'mapSvc', 'localStorageService'])

class EventsList {
  constructor($scope, $meteor, $rootScope, $state, $filter, $log, mapSvc, localStorageService) {

    var self = this;
    var orderBy = $filter('orderBy');
    var subscriptionHandle;

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
    self.images = $meteor.collectionFS(Images, false).subscribe('images');

    // Bind filters parameters in session stoage
    localStorageService.bind($scope, 'vm.timeFilter.min', 0);
    localStorageService.bind($scope, 'vm.timeFilter.max', 15);
    localStorageService.bind($scope, 'vm.timeFilter.infinite', false);
    localStorageService.bind($scope, 'vm.timeFilter.disabled', true);

    localStorageService.bind($scope, 'vm.distanceFilter.min', 0);
    localStorageService.bind($scope, 'vm.distanceFilter.max', 15);
    localStorageService.bind($scope, 'vm.distanceFilter.infinite', false);
    localStorageService.bind($scope, 'vm.distanceFilter.disabled', true);

    $meteor.autorun($scope, autorun);
    function autorun() {
      mapSvc.updateVisibleMarkers();
      $meteor.subscribe('users').then(function(handle){
        subscriptionHandle = handle;
        self.users = $meteor.collection(Meteor.users, false);
      });
      var newPosition = mapSvc.getNewPosition();
      console.log('Set last position 1', newPosition, !_.isEmpty(newPosition));
      if (_.isEmpty(newPosition)){
        centerOnUserGeoLoc();
      } else {
        console.log('Set last position', newPosition);
        mapSvc.setMapCenter(newPosition.center);
        mapSvc.setMapZoom(newPosition.zoom);
      }
    };

    $scope.$on('$destroy', function() {
      if(angular.isDefined(subscriptionHandle)){
        subscriptionHandle.stop();
        subscriptionHandle = undefined;
      }
    });

    function centerOnUserGeoLoc() {
      mapSvc.setMapCenter('userGeoLoc');
    };

    function url(event, store) {
      if(event && event.mainPic) {
        var image = _.find(self.images, {_id: event.mainPic});
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

    function creator(event) {
      if (!event)
        return;
      var owner = self.getUserById(event.owner);
      if (!owner)
        return "nobody";

      if ($rootScope.currentUser)
        if ($rootScope.currentUser._id)
          if (owner._id === $rootScope.currentUser._id)
            return "me";

      return owner;
    }

    function rsvp(eventId, rsvp) {
      $meteor.call('rsvp', eventId, rsvp).then(
        function (data) {
          console.log('success responding', data);
        },
        function (err) {
          console.log('failed', err);
        }
      );
    }
  }
}
