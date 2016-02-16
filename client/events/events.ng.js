let {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@State({
  name: 'app.events',
  url: '/events?category&latlng',
  defaultRoute: true,
  html5Mode: true
})

@Component({
  selector: 'events-list',
  controllerAs: 'EventsList'
})

@View({templateUrl: 'client/events/events.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$stateParams', '$filter', '$log', 'mapSvc', 'localStorageService', '$timeout')

class EventsList {
  constructor($scope, $reactive, $rootScope, $state, $stateParams, $filter, $log, mapSvc, localStorage, $timeout) {
    $log.info('EventsList', $scope.$parent);

    var self = this;
    var orderBy = $filter('orderBy');

    $reactive(self).attach($scope);

    self.subscribe('categories');
    self.subscribe('tags');

    self.helpers({
      categories: _categoriesCollection,
      tags: _tagsCollection
    });

    self.mapSvc = mapSvc;
    self.creator = creator;
    self.rsvp = rsvp;
    self.getUserById = getUserById;
    self.pageChanged = pageChanged;
    self.myPresence = _myPresence;
    self.isPresent = _isPresent;
    self.order = order;
    self.mapSvc = mapSvc;
    self.tagTermClick = _tagTermClick;
    self.url = url;
    self.mouseenterEvent = _mouseenterEvent;
    self.mouseleaveEvent = _mouseleaveEvent;
    self.initDropdown = _initDropdown;
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
    localStorage.bind($scope, 'EventsList.timeFilter.min', 0);
    localStorage.bind($scope, 'EventsList.timeFilter.max', 15);
    localStorage.bind($scope, 'EventsList.timeFilter.options.infinite', false);
    localStorage.bind($scope, 'EventsList.timeFilter.options.disabled', true);

    localStorage.bind($scope, 'EventsList.distanceFilter.min', 0);
    localStorage.bind($scope, 'EventsList.distanceFilter.max', 15);
    localStorage.bind($scope, 'EventsList.distanceFilter.options.infinite', false);
    localStorage.bind($scope, 'EventsList.distanceFilter.options.disabled', true);

    _init();

    ////////////////////////

    function _init() {
      _getFilteredCategory();
      setMapCenter();
    }

    function _initDropdown(ddValue) {
      let dd = $('.ui.dropdown');

      $timeout(() => {
        if (ddValue) {
          dd.dropdown('set selected', ddValue);
        } else {
          dd.dropdown();
        }
      });
    }

    function _mouseenterEvent(eventId) {
      self.overflownEvent = eventId;
      $scope.$emit('event.overflown', { id: eventId });
    }

    function _mouseleaveEvent() {
      self.overflownEvent = false;
      $scope.$emit('event.overflown.none');
    }

    function _getFilteredCategory() {
      self.autorun(() => {
        let filteredCategory = _.find(self.getReactively('categories'), { slug: $stateParams.category });
        if (filteredCategory) {
          $scope.$parent.App.filteredCategory = filteredCategory._id;
          _initDropdown(filteredCategory._id)
        }
      });
    }

    function _categoriesCollection() {
      return Tags.find({
        advisable: true,
      });
    }

    function _tagsCollection() {
      return Tags.find({
        advisable: false,
      });
    }

    function _tagTermClick(e) {
      var tagText = e.target.innerHTML;
    }

    function url(event, store) {
      if(event && event.cover) {
        var image = _.find(self.images, {_id: event.cover});
        if (!image || !image.url) return null
        return image.url({store: store});
      }
    };

    function order(predicate, reverse) {
      mapSvc.filteredEvents = orderBy(mapSvc.filteredEvents, predicate, reverse);
    };

    function _myPresence(event, answer) {
      return _.some(event.rsvps, function(rsvp) {
        return rsvp.user === $rootScope.currentUser._id && rsvp.rsvp === answer;
      });
    }

    function _isPresent(event) {
      return _.some(event.rsvps, function(rsvp) {
        return rsvp.user === $rootScope.currentUser._id;
      });
    }

    function watchOrderProperty() {
      if (self.orderProperty) self.sort = {name: parseInt(self.orderProperty)};
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
      mapSvc.setMapZoom(12);

      if ($stateParams.latlng) {
        var splittedLatlng = $stateParams.latlng.split(',');

        if (splittedLatlng.length >= 2) {

          var searchedLatlng = {
            lat: splittedLatlng[0],
            lng: splittedLatlng[1]
          };

          mapSvc.setMapCenter(searchedLatlng);
        } else {
          _centerOnUserGeoloc();
        }
      } else {
        _centerOnUserGeoloc()
      }
    }

    /**
     * [_centerOnUserGeoloc description]
     * @return {[type]} [description]
     */
    function _centerOnUserGeoloc() {
      var newPosition = mapSvc.getNewPosition();

      if (_.isEmpty(newPosition)){
        mapSvc.setMapCenter('userGeoLoc', true);
      } else {
        mapSvc.setMapCenter(newPosition.center);
        mapSvc.setMapZoom(newPosition.zoom);
      }
    }
  }
}
