_ = lodash;

let {SetModule, Component, Service, View, Inject, State} = angular2now;

SetModule('mapdiz');

@Component({selector: 'map', controllerAs: 'Map'})
@View({templateUrl: 'client/map/map.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$log', 'mapSvc', '$timeout', '$compile', '$filter')

class Map {
  constructor($scope, $reactive, $rootScope, $state, $log, mapSvc, $timeout, $compile, $filter) {
    $log.info('MapCtrl', $scope.$parent);

    var self = this;

    $reactive(self).attach($scope);

    //self.autorun(_setFilteredEventContent);

    self.mapSvc = mapSvc;
    self.mapControl = {};
    self.draggableMarkerOnDrag = draggableMarkerOnDrag;
    self.draggableMarkerChanged = draggableMarkerChanged;
    self.markerMouseOver = markerMouseOver;
    self.markerMouseOut = markerMouseOut;
    self.getImage = getImage;
    self.App = $scope.$parent.App;
    console.log('self.App', self.App);


    /////////////////////////////

    function draggableMarkerOnDrag() {
      $rootScope.$broadcast('draggableMarker.drag');
    }

    function draggableMarkerChanged() {
      $rootScope.$broadcast('draggableMarker.position.changed', self.mapSvc.draggableMarker.position);
    }

    function markerMouseOver(eventId) {
      self.App.overflownEvent = mapSvc.openedWindow = eventId;
      var containers = document.getElementsByClassName('events-list');
      if (containers) var container = angular.element(containers[0]);
      var someElement = angular.element(document.getElementById('event-' + eventId));

      if (container && someElement && !_.isEmpty(someElement)) {
        container.scrollToElement(someElement, 0, 500);
      }
    };

    function markerMouseOut() {
      mapSvc.openedWindow = false;
    };

    self.getFilteredEventContent = _setFilteredEventContent;

    function _setFilteredEventContent() {

      var content = `
          <div class="info-window">
            <div class="iw-container">
              <div class="info-window-content">
                <h4>{{ filteredEvent.name }}<h4>
                <div class="description mxn1" ng-show="filteredEvent.description && filteredEvent.description.length > 0">
                  <strong>Description :</strong> {{ filteredEvent.description }}
                  <div class="iw-bottom-gradient"></div>
                </div>
              </div>
            </div>
          </div>`;

      var compiled = $compile(content)($scope);

      console.log('content', content, compiled[0].outerHTML);
      self.filteredEventContent = content;
      return compiled[0].outerHTML;
    }

    function getImage(image, onlyUrl) {
      if (image) {
        var imageObject = $filter('filter')($scope.$parent.App.images, {_id: image})[0];
        var url;

        if (imageObject && imageObject.url) {
          url = imageObject.url();
        }

        if (onlyUrl) {

          return url;
        }

        return {
          'background-image': 'url("' + url + '")'
        }
      }
    }
  }
}
