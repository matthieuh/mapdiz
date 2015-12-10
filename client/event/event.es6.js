let {SetModule, Component, View, Inject, State} = angular2now;

var i18n_FR = {
  previousMonth : 'Mois suivant',
  nextMonth     : 'Mois précédent ',
  months        : ['janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Decembre'],
  weekdays      : ['Dimanche','Mundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  weekdaysShort : ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
};

SetModule('mapdiz');

@State({
  name: 'app.event',
  url: '/events/:eventId/:eventSlug',
  html5Mode: true
})

@Component({selector: 'event'})
@View({templateUrl: 'client/event/event.html'})
@Inject(['$scope', '$reactive', '$meteor', '$rootScope', '$state', '$stateParams', '$log', 'mapSvc', '$timeout', '$window', '$compile', 'Upload'])

class EventCreate {
  constructor($scope, $reactive, $meteor, $rootScope, $state, $stateParams, $log, mapSvc, $timeout, $window, $compile, Upload) {


    let reactiveContext = $reactive(this).attach($scope);
    let method = isNaN($stateParams.eventId) && $stateParams.eventId === 'add' ? 'create' : 'update'

    this.newEvent = {};

    reactiveContext.helpers({
      newEvent: () => {
        if (method === 'create') {
          return {
            name: '',
            description: '',
            position: {},
            public: true
          };
        } else {
          console.log('$stateParams.eventId', $stateParams.eventId);
          return Events.findOne($stateParams.eventId)
        }
      }
    });

    reactiveContext.subscribe('images', () => [this.newEvent]);

    reactiveContext.helpers({
      cover: () => {
        Images.findOne(this.newEvent.cover)
      }
    });


    console.log('cover', this.newEvent, self.cover);



    self.beginTimeSelected = beginTimeSelected;
    self.endTimeSelected = endTimeSelected;
    self.mapSvc = mapSvc;
    self.addEvent = addEvent;
    self.deleteCover = deleteCover;
    self.url = url;
    //self.cover =

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
        this.newEvent.beginDate = beginDateValue;
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
        this.newEvent.endDate = endDateValue;
        $scope.$apply();
      }
    });

    var content = `
      <div class='info-window'>
        <div class='iw-container'>
          <img class='cover' ng-src='{{ vm.cover || vm.url(vm.newEvent, "original") }}'>
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

    mapSvc.getUserLoc().then(function(userGeoLoc) {
      mapSvc.map.center = userGeoLoc.center;
      mapSvc.draggableMarker.position = userGeoLoc.center;
    });
    mapSvc.draggableMarker.content = compiled[0];
    mapSvc.draggableMarker.visible = false;
    mapSvc.draggableMarker.visible = true; // !!this.newEvent.position.lat;

    /*if (this.newEvent.cover) {
      self.cover = this.newEvent.cover.url({store: 'original'});
      delete this.newEvent.cover;
    }*/

    /////////////////////

    function url(event, store) {
      if(event && event.cover) {
        var image = $meteor.object(Images, event.cover);
        if (!image || !image.url) return null
        return image.url({store: store});
      }
    };

    function addTimeToDatetime(time, datimeScopeName) {
      var momentDate = moment(this.newEvent[datimeScopeName]);

      momentDate.set('hour', time.value.get('hour'));
      momentDate.set('min', time.value.get('min'));

      this.newEvent[datimeScopeName] = momentDate.toDate();
    }

    function deleteCover() {
      delete self.cover;
    }

    function beginTimeSelected(selected) {
      if(selected && selected.title) {
        this.newEvent.beginTime = selected.title;
      } else {
        this.newEvent.beginTime = undefined;
      }
    };

    function endTimeSelected(selected) {
      if(selected && selected.title) {
        this.newEvent.endTime = selected.title;
      } else {
        this.newEvent.endTime = undefined;
      }
    };

    function addEvent(newEvent) {
      self.events
      .save(newEvent)
      .then(function(events) {
        console.log('events', events);
        if (self.cover) {
          uploadPictures(events[0]._id);
        } else {
          $state.go('app.events');
        }

      }, function(err) {
        console.log('err', err);
        self.errorMsg = err.message;
      });
    };

    function uploadPictures(savedEventId) {
      var newSavedEvent = $meteor.object(Events, savedEventId);
      self.images
      .save(self.cover)
      .then(function(covers) {
        newSavedEvent.cover = covers[0]._id._id;
        $state.go('app.events');
      }, function(err) {
        console.log('err', err);
      });
    }


	}
}
