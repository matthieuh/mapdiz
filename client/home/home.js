"use strict";

var {SetModule, Component, View, Inject, State} = angular2now;

SetModule('mapdiz');

@State({
  name: 'home',
  url: '/',
  html5Mode: true,
  defaultRoute: true
})

@Component({
  selector: 'home',
  controllerAs: 'Home',
  replace: false
})
@View({templateUrl: 'client/home/home.html'})
@Inject('$scope', '$rootScope', '$reactive', '$state', '$meteor', '$log', 'mapSvc', '$translate')

class Home {

  constructor($scope, $rootScope, $reactive, $state, $meteor, $log, mapSvc, $translate) {
    $log.info('Home');

    var self = this;

    $reactive(self).attach($scope);

    self.myLocation = {};
    self.gettingGeoloc = false;
    self.setMyLocation = _setMyLocation;
    self.search = _search;

    self.subscribe('categories');
    self.helpers({
      categories: _categoriesCollection
    });

    $scope.$watchCollection('Home.myLocation', _updateMyLocation);

    $translate.use('fr')
    console.log('$translate.use()', $translate.use());

    $translate('SLOGAN').then(function(slogan) {
      console.log('SLOGAN', slogan);
    });

    ////////////////////

    function _categoriesCollection() {
      return Tags.find({
        advisable: true,
      }, {
        sort: { events: -1 }
      });
    }

    /**
     * [setMyLocation description]
     */
    function _setMyLocation() {
      self.gettingGeoloc = true;
      mapSvc.getUserLoc().then((userGeoLoc) => {

        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': userGeoLoc}, (results, status) => {
          if (status == 'OK') {
            $scope.$apply( () => {
              self.gettingGeoloc = false;
              self.myLocation.address = results[0].formatted_address;
              self.myLocation.latLng = userGeoLoc;
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
    function _updateMyLocation() {
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

    function _search() {
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
