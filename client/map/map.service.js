"use strict";

_ = lodash;

var {SetModule, Service, Inject} = angular2now;

SetModule('mapdiz');

@Service({ name: 'mapSvc' })
@Inject('$rootScope', '$q', '$log', '$meteor', '$timeout', '$document', '$state', '$location')
class MapService {
  constructor($rootScope, $q, $log, $meteor, $timeout, $document, $state, $location) {
  	var _events = [];
    var _visibleEvents = [];
    var _currentBounds = {};
    var _newPosition = {};

    var service = {
      openedWindow: false,
      markerOpen: {},
      mapObj: {},
      map: {
        center: {
          lat: 15,
          lng: 15
        },
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
      getEventIcon: _getEventIcon,
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
      openWindow: openWindow,
      closeWindow: closeWindow,
      setMapCenter: setMapCenter,
      setMapZoom: setMapZoom,
      updateMap: _updateMap,
      updateVisibleMarkers: updateVisibleMarkers,
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
      var gmIw = document.querySelector('.gm-style-iw');
      if (gmIw) {
        gmIw.firstChild.style.display = 'flex';
        var iwPrev = gmIw.previousSibling;
        var iwPrevChildren = iwPrev.children;
        // Hide old infoWindow background
        iwPrevChildren[1].style.display = 'none';
        iwPrevChildren[3].style.display = 'none';
        var iw = document.querySelector('.info-window');

        if (iw) {
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
      var event = _.find(_events,{_id: id});
      return event;
    };

    /**
     * [addEvent description]
     * @param {[type]} newEvent [description]
     */
    function addEvent(newEvent) {
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
      // model.show = false;
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

    function _updateMap(obj){
      service.map = _.merge(service.map, obj);
    };

    function updateVisibleMarkers(map) {
      if(map) setMap(map);
    };

    function setMapCenter(coords, isUserLocation) {
      var deferred = $q.defer();
      if (coords === 'userGeoLoc') {
        var self = this;

        let sessionGeoLoc = Session.get('userGeoLoc');
        console.log('sessionGeoLoc', sessionGeoLoc);

        if (sessionGeoLoc) {
          service.map.center = sessionGeoLoc;
          if (isUserLocation) service.myLocation.position = sessionGeoLoc;
          deferred.resolve();
        } else {

          this.getUserLoc().then(
            (userGeoLoc) => {
              Session.set('userGeoLoc', userGeoLoc);
              //service.myLocation.position = userGeoLoc.center;
              self.map.center = userGeoLoc;
              if (isUserLocation) service.myLocation.position = userGeoLoc;
              //deferred.resolve();
            },
            (error) => {
              console.log('error 22', error);
              self.map.center = {
                lat: 45.764043,
                lng: 4.835659
              };
              self.map.zoom = 12;
              deferred.resolve();
              /*Meteor.call('geoip', function (error, geoInfos) {
                console.log('geoip', error, geoInfos);
                if (error) {
                  self.map.center = {
                    lat: 50,
                    lng: 50
                  };
                } else {
                  self.map.center = {
                    lat: geoInfos.ll[0],
                    lng: geoInfos.ll[1]
                  };
                }
                self.map.zoom = 12;
                deferred.resolve();
              });*/
            }
          );

        }

      } else {
        service.map.center = coords;
        if (isUserLocation) service.myLocation.position = coords;
        deferred.resolve();
      }
      return deferred.promise;
    };

    function _getCurrentLocation(successCallback, errorCallback) {
      // Try HTML5-spec geolocation.
      var geolocation = navigator.geolocation;

      if (geolocation) {
        try {

          function handleSuccess(position) {
            successCallback(position.coords);
          }

          navigator.geolocation.getCurrentPosition(handleSuccess, errorCallback, {
            enableHighAccuracy: true,
            maximumAge: 5000, // 5 sec.
            timeout: 20000
          });

        } catch (err) {
          alert('err', err);
          errorCallback();
        }
      } else {
        alert('Navigateur incompatible');
        errorCallback();
      }
    }

    function _watchLocation(successCallback, errorCallback) {
      successCallback = successCallback || function(){};
      errorCallback = errorCallback || function(){};

      // Try HTML5-spec geolocation.
      var geolocation = navigator.geolocation;

      if (geolocation) {
        // We have a real geolocation service.
        try {
          function handleSuccess(position) {
            successCallback(position.coords);
          }

          geolocation.watchPosition(handleSuccess, errorCallback, {
            enableHighAccuracy: true,
            maximumAge: 5000, // 5 sec.
            timeout: 20000
          });
        } catch (err) {
          alert('err', err);
          errorCallback();
        }
      } else {
        alert('Navigateur incompatible');
        errorCallback();
      }
    }


    function getUserLoc() {
      var deferred = $q.defer();
      _getCurrentLocation(function(coords) {
        console.log('coords', coords);
        deferred.resolve({
          lat: coords.latitude,
          lng: coords.longitude
        });
      }, function() {
        console.log('error getUserLoc');
        deferred.reject();
      });
      /*if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position, error) => {
            if (error) {
              return deferred.reject(error);
            }
            var userGeoLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            deferred.resolve(userGeoLoc);
          },
          (error) => {
            console.log('error 1', error);
            var errors = {
              1: "Authorization fails", // permission denied
              2: "Can\'t detect your location", //position unavailable
              3: "Connection timeout"
            };
            deferred.reject(errors[error.code]);
          },
          { enableHighAccuracy: true }
        );

      } else {
        deferred.reject("Your browser is out of fashion, there\'s no geolocation!");
      }*/
      return deferred.promise;
    };

    function dragEnd(map) {
      console.log('dragEnd');
      setNewPosition(map.center, map.zoom);
      updateVisibleMarkers(map);
    }

    function mapZoomChange(map) {
       setNewPosition(map.center, map.zoom);
      /*updateVisibleMarkers(map);
      if (!service.draggableMarker.position || !service.draggableMarker.position.lat) {
        service.draggableMarker.position = map.center;
      }*/
    }

    function getNewPosition() {
      return _newPosition;
    }

    function setNewPosition(center, zoom) {
      if ($state.current.name === 'app.events') {
        _newPosition = {
          center: center,
          zoom: zoom
        };
      }
    }

    function _getEventIcon(categories, categoryId) {
      let defaultMarker = 'assets/images/markers/default.png';
      let category =  _.find(categories, {_id: categoryId});
      let categoryMarker;

      if (category && category.marker && category.marker.path) {
        categoryMarker = category.marker.path;
      }

      let protocol = $location.protocol();
      let host = $location.host();
      let port = $location.port();
      let url = `${ protocol }:\/\/${ host }:${ port }/${ categoryMarker || defaultMarker }`;

      return url;
    }

  }
}
