"use strict";

var {SetModule, Component, View, Inject, State} = angular2now;

var i18n_FR = {
  previousMonth : 'Mois suivant',
  nextMonth     : 'Mois précédent ',
  months        : ['janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Decembre'],
  weekdays      : ['Dimanche','Mundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  weekdaysShort : ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
};

SetModule('mapdiz');

@State({
  name: 'app.events-create',
  url: '/events/add',
  html5Mode: true
})

@Component({selector: 'event-create'})
@View({templateUrl: 'client/event/event-create.html'})
@Inject(['$scope', '$meteor', '$rootScope', '$state', '$log', 'mapSvc', '$timeout', '$window', '$compile', 'Upload'])

class EventCreate {
  constructor($scope, $meteor, $rootScope, $state, $log, mapSvc, $timeout, $window, $compile, Upload) {

    $meteor.subscribe('events');

    var self = this;
    self.newEvent = {
      position: {},
      public: true
    };
    self.beginTimeSelected = beginTimeSelected;
    self.endTimeSelected = endTimeSelected;
    self.mapSvc = mapSvc;
    self.addEvent = addEvent;
    self.deleteCover = deleteCover;
    self.events = $meteor.collection(Events);
    self.images = $meteor.collectionFS(Images, false);

    $scope.addTimeToDatetime = addTimeToDatetime;
    $scope.$on('$destroy', function() {
      mapSvc.draggableMarker.visible = false;
    });

    var beginDatePicker = new Pikaday({
      field: document.getElementById('beginDate'),
      trigger: document.getElementById('edit-beginDate'),
      format: 'DD/MM/YYYY',
      firstDay: 1,
      i18n: i18n_FR,
      onSelect: function() {
        var beginDateValue = this.getMoment().toDate();
        self.newEvent.beginDate = beginDateValue;
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
        var endDateValue = this.getMoment().toDate();;
        self.newEvent.endDate = endDateValue;
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

    mapSvc.getUserLoc().then(function(userGeoLoc) {
      mapSvc.map.center = userGeoLoc.center;
      mapSvc.draggableMarker.position = userGeoLoc.center;
    });
    mapSvc.draggableMarker.content = compiled[0];
    mapSvc.draggableMarker.visible = false;
    mapSvc.draggableMarker.visible = true; // !!self.newEvent.position.lat;

    /////////////////////


    function addTimeToDatetime(time, datimeScopeName) {
      var momentDate = moment(self.newEvent[datimeScopeName]);

      momentDate.set('hour', time.value.get('hour'));
      momentDate.set('min', time.value.get('min'));

      self.newEvent[datimeScopeName] = momentDate.toDate();
      console.log(self.newEvent[datimeScopeName]);
    }

    function deleteCover() {
      delete self.cover;
    }

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

    function addEvent(newEvent) {
      console.log('newEvent', newEvent);
      self.events
      .save(newEvent)
      .then(function(result) {
        console.log('result', result, result[0]._id);

        uploadPictures(result[0]._id);
        //$state.go('app.events');
      }, function(err) {
        console.log('err', err);
      });

      //$state.go('app.events');
    };

    function uploadPictures(savedEventId) {
      Images.insert(self.cover, function (err, cover) {
        console.log('err, cover', err, cover);
        var savedCover = $meteor.object(Images, cover._id);
        console.log('savedCover', savedCover);
        var savedEvent = $meteor.object(Event, savedEventId);
        console.log('savedEvent', savedEvent);
        savedEvent.cover = savedCover;
      });
    }


	}
}
