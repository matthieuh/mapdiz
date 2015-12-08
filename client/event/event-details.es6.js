/*"use strict";

var {SetModule, Component, View, Inject, State} = angular2now;

SetModule('mapdiz');

@State({
  name: 'app.events-detail',
  url: '/events/:eventId/:eventName',
  html5Mode: true
})

@Component({selector: 'event-details'})
@View({templateUrl: 'client/event/event-details.html'})
@Inject(['$scope', '$rootScope', '$meteor', '$stateParams', '$log', '$timeout', 'mapSvc'])

class EventDetails {

  constructor($scope, $rootScope, $meteor, $stateParams, $log, $timeout, mapSvc) {
    $log.info('EventDetails');

    var self = this;
    var prevMap = {};
    var previousState;
    var subscriptionHandle;

    $scope.$meteorSubscribe('events').then(function(subscriptionHandle){
      self.event = $meteor.object(Events, $stateParams.eventId);
      self.images = $meteor.collectionFS(Images, false).subscribe('images');
      console.log('self.eventDetails', self.event, mapSvc.map.center);
      mapSvc.map.zoom = 15;
      mapSvc.map.center = self.event.position;
      if(self.event.mainPic) self.image = $meteor.object(Images, self.event.mainPic, false);

    });

    $rootScope.gmapLoaded = function() {
      console.log('map loaded');

    };

    function url(store) {
      var image = _.find(self.images, {_id: self.event.mainPic});
      if (!image && !image.url) return null;
      return image.url({store: store});
    }

    $scope.$on('$destroy', function () {
      console.log('mapSvc.getNewPosition()', mapSvc.getNewPosition());
      if(subscriptionHandle) subscriptionHandle.stop();
      if(previousState === 'events') mapSvc.updateMap(prevMap);
    });
  }
}
*/
