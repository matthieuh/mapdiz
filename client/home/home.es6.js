"use strict";

var {SetModule, Component, View, Inject, State} = angular2now;

SetModule('mapdiz');

@State({
  name: 'home',
  url: '/',
  html5Mode: true,
  defaultRoute: true
})

@Component({selector: 'home'})
@View({templateUrl: 'client/home/home.html'})
@Inject('$scope', '$rootScope', '$state', '$meteor', '$log')

class Home {

  constructor($scope, $rootScope, $state, $meteor, $log) {
    $log.info('home');
  }
}
