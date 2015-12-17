"use strict";

var {SetModule, Component, View, Inject, State} = angular2now;

SetModule('mapdiz');

@State({
  name: 'home',
  url: '/',
  html5Mode: true,
  defaultRoute: true
})

@Component({selector: 'home', controllerAs: 'Home'})
@View({templateUrl: 'client/home/home.html'})
@Inject('$scope', '$rootScope', '$state', '$meteor', '$log', 'mapSvc')

class Home {

  constructor($scope, $rootScope, $state, $meteor, $log, mapSvc) {
    $log.info('Home');

    var self = this;
    self.myLocation = {};
    self.setMyLocation = setMyLocation;
    self.gettingGeoloc = false;
    self.search = search;

    $scope.$watchCollection('Home.myLocation', updateMyLocation);

    ////////////////////

    /**
     * [setMyLocation description]
     */
    function setMyLocation() {
      self.gettingGeoloc = true;
      mapSvc.getUserLoc().then((userGeoLoc) => {

        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': userGeoLoc.center}, (results, status) => {
          if (status == 'OK') {
            $scope.$apply( () => {
              self.gettingGeoloc = false;
              self.myLocation.address = results[0].formatted_address;
              self.myLocation.latLng = userGeoLoc.center;
            });
          } else {
            self.gettingGeoloc = false;
          }
        });
      }, () => {
        self.gettingGeoloc = false;
      });
    }

    /**
     * [updateMyLocation description]
     * @return {[type]} [description]
     */
    function updateMyLocation() {
      if (!self.myLocation.address || self.myLocation.address == '') {
        self.myLocation = {};
      }

      if (typeof self.myLocation.address == 'object' && !self.myLocation.latLng) {
        self.myLocation = {
          address: self.myLocation.address.formatted_address,
          latLng: {
            lat: self.myLocation.address.geometry.location.lat(),
            lng: self.myLocation.address.geometry.location.lng()
          }
        }
      }
    }

    function search() {
      var latLng = self.myLocation.latLng;
      if (latLng) {
        var latLngParam = `${ latLng.lat },${ latLng.lng }`;
        console.log('latLngParam', latLngParam);
        $state.go('app.events', {latlng: latLngParam});
      } else {
        $state.go('app.events');
      }
    }
  }
}
