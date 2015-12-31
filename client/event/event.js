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
  params: { eventId: 'name', eventSlug: ''},
  html5Mode: true
})

@Component({selector: 'event', controllerAs: 'eventDetails'})
@View({templateUrl: 'client/event/event.html'})
@Inject(['$scope', '$reactive', '$meteor', '$rootScope', '$state', '$stateParams', '$log', 'mapSvc', '$timeout', '$window', '$compile', 'Upload'])

class Event {
  constructor($scope, $reactive, $meteor, $rootScope, $state, $stateParams, $log, mapSvc, $timeout, $window, $compile, Upload) {
    var self = this;

    $reactive(self).attach($scope);

    let method = isNaN($stateParams.eventId) && $stateParams.eventId === 'add' ? 'create' : 'update';
    mapSvc.updateVisibleMarkers();

    $('event').slimScroll({
      height: 'inherit'
    });

    self.helpers({
      newEvent() {
        if (method === 'create') {
          return {
            name: '',
            description: '',
            position: {},
            public: true
          };
        } else {
          return Events.findOne($stateParams.eventId);
        }
      }
    });

    self.autorun(initMap);

    //setMapCenter();

    $scope.$watch('eventDetails.newEvent.cover', () => {
      if (self.newEvent && self.newEvent.cover) {
        self.helpers({
          cover: () => {
            return Images.findOne(self.newEvent.cover);
          }
        })
      }
    });

    $scope.$watch('eventDetails.cover', () => {
      if (typeof self.cover == 'object') {
        self.cover = self.cover.url();
      }
    });

    self.beginTimeSelected = beginTimeSelected;
    self.endTimeSelected = endTimeSelected;
    self.save = save;
    self.deleteCover = deleteCover;
    self.validFormBtn = method === 'create' ? 'Ajouter' : 'Sauvergarder'

    $scope.addTimeToDatetime = addTimeToDatetime;
    $scope.$on('$destroy', () => {
      mapSvc.draggableMarker.visible = false;
    });

    var beginDatePicker = new Pikaday({
      field: document.getElementById('beginDate'),
      trigger: document.getElementById('edit-beginDate'),
      format: 'DD/MM/YYYY',
      firstDay: 1,
      i18n: i18n_FR,
      onSelect: () => {
        var beginDateValue = this.getMoment().toDate();
        self.newEvent.beginDate = beginDateValue;
        if (!$scope.$$phase) $scope.$apply();
      }
    });

    var endDatePicker = new Pikaday({
      field: document.getElementById('endDate'),
      trigger: document.getElementById('edit-endDate'),
      format: 'DD/MM/YYYY',
      firstDay: 1,
      i18n: i18n_FR,
      onSelect: () => {
        var endDateValue = this.getMoment().toDate();
        self.newEvent.endDate = endDateValue;
        if (!$scope.$$phase) $scope.$apply();
      }
    });

    var content = `
      <div class='info-window'>
        <div class='iw-container'>
          <img class='cover' ng-src='{{ eventDetails.cover }}'>
          <div class='info-window-content'>
            <h4>{{ eventDetails.newEvent.name || "Nom de l'évenement" }}</h4>
            <div class='description mxn1' ng-show='eventDetails.newEvent.description'>
              <strong>Description :</strong> {{ eventDetails.newEvent.description }}
              <div class="iw-bottom-gradient"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    var compiled = $compile(content)($scope);


    //mapSvc.draggableMarker.visible = false;
    //mapSvc.draggableMarker.visible = true;

    /////////////////////

    function initMap() {
      console.log('method', method);

      if (method === 'create') {

        /*mapSvc.getUserLoc().then((userGeoLoc) => {
          mapSvc.map.center = userGeoLoc;
          mapSvc.draggableMarker.position = userGeoLoc;
        });

        mapSvc.draggableMarker.content = compiled[0];*/

      } else {
        /*mapSvc.map.zoom = 14;

          console.log('eventDetails.newEvent.position', newValue, oldValue);
          if (self.newEvent && self.newEvent.position && self.newEvent.position.lat) {
            mapSvc.map.center = {
              lat: self.newEvent.position.lat,
              lng: self.newEvent.position.lng
            };
            //mapSvc.draggableMarker.content = compiled[0];
          }
        });*/

        console.log('self.newEvent.position', self.newEvent);


        // Open window

        let position = self.getReactively('newEvent.position');
        // Set zomm and center

        if (position) {
          mapSvc.updateMap({
            zoom: 15,
            center: {
              lat: position.lat,
              lng: position.lng
            }
          });

          $rootScope.openedWindow = self.newEvent._id;
        }
      }
    }

    function addTimeToDatetime(time, datimeScopeName) {
      var momentDate = moment(self.newEvent[datimeScopeName]);

      momentDate.set('hour', time.value.get('hour'));
      momentDate.set('min', time.value.get('min'));

      self.newEvent[datimeScopeName] = momentDate.toDate();
    }

    function deleteCover() {
      delete self.cover;
      delete self.newEvent.cover;
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

    function save() {
      console.log('save', self.newEvent, method);
      delete self.errorMsg;

      if (method == 'create') { // Create
        Events.insert(self.newEvent, (error, savedEventId) => {
          console.log('Events.insert', error, savedEventId, self.cover);
          if (error) {
            self.errorMsg = error.message;
          }
          else {
            if (self.cover) {
              uploadPictures(savedEventId);
            } else {
              $state.go('app.events');
            }
          }
        });
      } else { // Update
        Events.update({_id: $stateParams.eventId}, {
          $set: {
            name: self.newEvent.name,
            description: self.newEvent.description,
            'public': self.newEvent.public,
            position: self.newEvent.position
          }
        }, (error) => {
          console.log('Events.update', error);
          if (error) {
            self.errorMsg = error.message;
          } else {
            if (self.cover) {
              uploadPictures(self.newEvent._id);
            } else {
              $state.go('app.events');
            }
          }
        });
      }
    };

    function uploadPictures(savedEventId) {
      console.log('uploadPictures', savedEventId);
      // Create
      Images.insert(self.cover, (error, image) => {

        console.log('Images.insert', error, image);

        if (error) {
          self.errorMsg = error.message;
        } else {

          if (self.newEvent.cover) { // Update
            Images.remove(self.newEvent.cover);
          }

          Events.update({_id: savedEventId}, {
            $set: {cover: image._id}
          }, (err) => {

            if (error) {
              self.errorMsg = err.message;
            } else {
              $state.go('app.events');
            }
          });


        }
      });
    }
	}
}
