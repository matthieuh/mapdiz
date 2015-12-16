"use strict";

_ = lodash;

var {SetModule, Service, Inject} = angular2now;

SetModule('mapdiz');

@Service({ name: 'mapSvc' })
@Inject(['$rootScope', '$q', '$log', '$meteor', '$timeout', '$document', '$state'])
class MapService {
  constructor($rootScope, $q, $log, $meteor, $timeout, $document, $state) {
  	var _events = [];
    var _visibleEvents = [];
    var _currentBounds = {};
    var _overflownMarkerId;
    var _newPosition = {};

    var service = {
      markerOpen: {},
      mapObj: {},
      map: {
        zoom: 12,
        options: {
          //styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
        }
      },
      myLocation: {
        position: {
          lat: 40.1451,
          lng: -99.6680
        }
      },
      mapControl: {},
      draggableMarker: {
        events: {},
        visible: false,
        draggable: false,
        content: "Déplace-moi sur le lieu de l'évenement",
        onDomready: onMarkerDomready
      },
      eventMarker: {
        content: "ttttest"
      },
      events: [],
      visibleEvents: [],
      filteredEvents: [],
      getVisibleEvents: getVisibleEvents,
      getEvent: getEvent,
      addEvent: addEvent,
      removeEvent: removeEvent,
      getMap: getMap,
      markerClick: markerClick,
      windowCloseClick: windowCloseClick,
      markerMouseOver: markerMouseOver,
      markerMouseOut: markerMouseOut,
      getOverflownMarkerId: getOverflownMarkerId,
      openWindow: openWindow,
      closeWindow: closeWindow,
      setMapCenter: setMapCenter,
      setMapZoom: setMapZoom,
      updateMap: updateMap,
      updateVisibleMarkers: updateVisibleMarkers,
      setFilteredEvents: setFilteredEvents,
      getUserLoc: getUserLoc,
      mapZoomChange: mapZoomChange,
      dragEnd: dragEnd,
      getNewPosition: getNewPosition
    };

    return service;

    /////////////////////////

    /**
     * [onMarkerDomready description]
     * @param  {[type]} map [description]
     * @return {[type]}     [description]
     */
    function onMarkerDomready(map) {
      console.log('onMarkerDomready');
      var gmIw = document.querySelector('.gm-style-iw');
      console.log('gmIw', gmIw);
      if (gmIw) {
        gmIw.firstChild.style.display = 'flex';
        var iwPrev = gmIw.previousSibling;
        var iwPrevChildren = iwPrev.children;
        // Hide old infoWindow background
        iwPrevChildren[1].style.display = 'none';
        iwPrevChildren[3].style.display = 'none';
        var iw = document.querySelector('.info-window');

        if (iw) {
          console.log('iw', iw);
          iw.parentNode.style.display = 'block';
          // Arrow over infoWindow
          gmIw.parentNode.children[0].style['z-index'] = 1;
          var arrowContainer = gmIw.parentNode.children[0].children[2];
          arrowContainer.children[0].children[0].style['border-left'] = '1px solid rgba(255, 80, 36, 0.6)';
          arrowContainer.children[1].children[0].style['border-right'] = '1px solid rgba(255, 80, 36, 0.6)';
        }
      }
    }

    /**
     * [getVisibleEvents description]
     * @return {[type]} [description]
     */
    function getVisibleEvents() {
      return _visibleEvents;
    };

    /**
     * [getEvent description]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function getEvent(id) {
      console.log('getEvent', id);
      var event = _.find(_events,{_id: id});
      console.log('getEvent 2', event);
      return event;
    };

    /**
     * [addEvent description]
     * @param {[type]} newEvent [description]
     */
    function addEvent(newEvent) {
      console.log('mapSvc.addEvent', newEvent);
      $rootScope.$broadcast('events.add', newEvent);
    };

    /**
     * [removeEvent description]
     * @param  {[type]} removedEvent [description]
     * @return {[type]}              [description]
     */
    function removeEvent(removedEvent) {
      _events.splice(_events.indexOf(removedEvent), 1);
      this.updateVisibleMarkers();
      $rootScope.$broadcast('events.remove', removedEvent);
    };

    function getMap(attrs){
      $rootScope.$broadcast('map.get');
      var result = {};

      for(var key in attrs) {
        result[attrs[key]] = _.pick(this.map,attrs[key])[attrs[key]];
      }
      return result;
    };

    function markerClick(marker, eventName, model, args) {
      model.show = true;
    };

    function windowCloseClick(id) {
      console.log(marker, eventName, model);
      // model.show = false;
    };

    function markerMouseOver(event) {
      _overflownMarkerId = event._id;
      var containers = document.getElementsByClassName('events-list');
      if (containers) var container = angular.element(containers[0]);
      var someElement = angular.element(document.getElementById('event-' + event._id));
      if (container && someElement && !_.isEmpty(someElement)) container.scrollToElement(someElement, 0, 500);
    };

    function markerMouseOut(event) {
      _overflownMarkerId = undefined;
    };

    function getOverflownMarkerId() {
      return _overflownMarkerId;
    };

    function openWindow(eventId){
      var event = _.find(service.filteredEvents, {_id: eventId});
      if (event) event.showInfo = true;
    };

    function closeWindow(eventId){
      var event = _.find(service.filteredEvents, {_id: eventId});
      if (event) event.showInfo = false;
    };

    function setMapZoom(zoom) {
      service.map.zoom = zoom;
    };

    function getMap(){
      return service.map;
    };

    function setMap(map){
      service.map = map;
    };

    function updateMap(obj){
      service.map = _.merge(service.map, obj);
    };

    function updateVisibleMarkers(map) {
      console.log('updateVisibleMarkers ...');
      if(map) setMap(map);
    };

    function setFilteredEvents(filteredEvents) {
      if(angular.isDefined(filteredEvents)) {
        console.log('filteredEvents', filteredEvents, service.filteredEvents);
        service.filteredEvents = _.filter(filteredEvents, function(n) {
          console.log('n', n);
          var result = _.find(service.events, { '_id': n._id});
          if (result)
            return true;
          else
            return false;
        });
        console.log('service.filteredEvents', service.filteredEvents);
      }
    };

    function setMapCenter(coords) {
      console.log('setMapCenter !!!', coords);
      if (coords === 'userGeoLoc'){
        var self = this;
        var userLoc = this.getUserLoc();
        userLoc.then(function(userGeoLoc){
          console.log('HTML5 geolocation', userGeoLoc);
          service.myLocation.position = userGeoLoc.center;
          self.map.center = userGeoLoc.center;
          self.map.zoom = 12;
        });
        return userLoc;
      } else {
        service.map.center = coords;
      }
    };

    function getUserLoc() {
      var deferred = $q.defer();
      console.log('getting user geolocation ...')

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          var userGeoLoc = {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            zoom: 12
          };
          deferred.resolve(userGeoLoc);
        }, positionError, { enableHighAccuracy: true });
      } else {
          deferred.reject("Your browser is out of fashion, there\'s no geolocation!");
      }
      return deferred.promise;
    };

    function dragEnd(map) {
      setNewPosition(map.center, map.zoom);
      updateVisibleMarkers(map);
    }

    function mapZoomChange(map) {
      console.log($state);
      // setNewPosition(map.center, map.zoom);
      updateVisibleMarkers(map);
      if (!service.draggableMarker.position || !service.draggableMarker.position.lat) {
        service.draggableMarker.position = map.center;
      }
    }

    function getNewPosition() {
      return _newPosition;
    }

    function setNewPosition(center, zoom) {
      if($state.current.name === 'events') {
        _newPosition = {
          center: center,
          zoom: zoom
        };
      }
    }
  }
}

var positionError = function(error) {
  var errors = {
    1: "Authorization fails", // permission denied
    2: "Can\'t detect your location", //position unavailable
    3: "Connection timeout"
  };
};
