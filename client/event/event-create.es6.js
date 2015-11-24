"use strict";

var {SetModule, Component, View, Inject, State} = angular2now;

var i18n_FR = {
  previousMonth : 'Mois suivant',
  nextMonth     : 'Mois précédent ',
  months        : ['janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Decembre'],
  weekdays      : ['Dimanche','Mundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  weekdaysShort : ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
};

SetModule('secretp');

@State({ name: 'event-create', url: '/event-create', html5Mode: true })

@Component({selector: 'event-create'})
@View({templateUrl: 'client/event/event-create.html'})
@Inject(['$scope', '$meteor', '$rootScope', '$state', '$log', 'mapSvc', '$timeout', '$window', '$compile'])

class EventCreate {
  constructor($scope, $meteor, $rootScope, $state, $log, mapSvc, $timeout, $window, $compile) {

    $meteor.subscribe('events');

    var self = this;
    self.newEvent = { position: {} };
    self.geoLocChoiceType = 'map';
    self.hours = [];
    self.beginTimeSelected = beginTimeSelected;
    self.endTimeSelected = endTimeSelected;
    self.mapSvc = mapSvc;
    self.addEvent = addEvent;
    self.deleteCover = deleteCover;

    for(var h = 0; h < 24 ; h++) {
      for(var m = 0; m < 12 ; m++) {
        self.hours.push({
          value: ("0" + h).slice(-2) +':'+ ("0" + m * 5).slice(-2)
        });
      }
    }

    var beginDatePicker = new Pikaday({
      field: document.getElementById('beginDate'),
      trigger: document.getElementById('edit-beginDate'),
      format: 'DD/MM/YYYY',
      firstDay: 1,
      i18n: i18n_FR,
      onSelect: function() {
        var beginDateValue = this.getMoment().toDate();
        console.log(beginDateValue);
        self.newEvent.beginDate = beginDateValue;
        console.log(self.newEvent);
        $scope.$apply();
      }
    });

    var endDatePicker = new Pikaday({
      field: document.getElementById('endDate'),
      trigger: document.getElementById('edit-endDate'),
      format: 'DD/MM/YYYY',
      firstDay: 1,
      i18n: i18n_FR,
      onSelect: function() {
        var endDateValue = this.getMoment().toDate();
        console.log(endDateValue);
        self.newEvent.endDate = endDateValue;
        console.log(self.newEvent);
        $scope.$apply();
      }
    });

    var content = `
      <div class='info-window'>
        <div class='iw-container'>
          <img ng-show='vm.cover' class='cover' ng-src='{{ vm.cover }}'>
          <div class='info-window-content'>
            <h4>{{ vm.newEvent.name || "Nom de l'évenement" }}</h4>
            <div class='description mxn1' ng-show='vm.newEvent.description'>
              <strong>Description :</strong> {{ vm.newEvent.description }}
              <div class="iw-bottom-gradient"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    var compiled = $compile(content)($scope);
    console.log('compiled', compiled);

    $scope.cropper = {};
    $scope.cropper.sourceImage = null;
    $scope.cropper.croppedImage   = null;
    $scope.bounds = {};
    $scope.bounds.left = 0;
    $scope.bounds.right = 0;
    $scope.bounds.top = 0;
    $scope.bounds.bottom = 0;
    $scope.$on('$destroy', function() {
      mapSvc.draggableMarker.visible = false;
    });

    mapSvc.getUserLoc().then(function(userGeoLoc) {
      mapSvc.map.center = userGeoLoc.center;
      mapSvc.draggableMarker.position = userGeoLoc.center;
    });
    mapSvc.draggableMarker.content = compiled[0];
    mapSvc.draggableMarker.visible = false;
    mapSvc.draggableMarker.visible = true; // !!self.newEvent.position.lat;

    /////////////////////

    function deleteCover() {
      delete self.cover;
    }

    function addEvent(newEvent) {
      self.newEvent.position.lat = mapSvc.draggableMarker.position.lat();
      self.newEvent.position.lng = mapSvc.draggableMarker.position.lng();
      console.log('newEvent', newEvent);
      mapSvc.events.save(newEvent).then(function() {
        $state.go('events');
      });
    };

    function beginTimeSelected(selected) {
      if(selected && selected.title) {
        self.newEvent.beginTime = selected.title;
      } else {
        self.newEvent.beginTime = undefined;
      }
    };

    function endTimeSelected(selected) {
      if(selected && selected.title) {
        self.newEvent.endTime = selected.title;
      } else {
        self.newEvent.endTime = undefined;
      }
    };

    function getGeoLocFrom(address) {
      console.log(address);
    }
	}
}
