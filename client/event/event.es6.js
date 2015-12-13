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

@Component({selector: 'event', controllerAs: 'eventDetails' })
@View({templateUrl: 'client/event/event.html'})
@Inject(['$scope', '$reactive', '$meteor', '$rootScope', '$state', '$stateParams', '$log', 'mapSvc', '$timeout', '$window', '$compile', 'Upload'])

class Event {
  constructor($scope, $reactive, $meteor, $rootScope, $state, $stateParams, $log, mapSvc, $timeout, $window, $compile, Upload) {
    var self = this;

    let reactiveContext = $reactive(self).attach($scope);
    let method = isNaN($stateParams.eventId) && $stateParams.eventId === 'add' ? 'create' : 'update'

    $('event').slimScroll({
      height: 'inherit'
    });

    reactiveContext.helpers({
      newEvent: () => {
        if (method === 'create') {
          return {
            name: '',
            description: '',
            position: {},
            'public': true
          };
        } else {
          return Events.findOne($stateParams.eventId);
        }
      },
    });

    $scope.$watchCollection('eventDetails.newEvent.position', () => {
      if (self.newEvent && self.newEvent.position && self.newEvent.position.lat) {
        mapSvc.map.center = {
          lat: self.newEvent.position.lat,
          lng: self.newEvent.position.lng
        };
      }
    });

    $scope.$watch('eventDetails.newEvent.cover', () => {
      if (self.newEvent && self.newEvent.cover) {
        reactiveContext.helpers({
          cover: () => {
            return Images.findOne(self.newEvent.cover);
          }
        })
      }
    });

    $scope.$watchCollection('eventDetails.cover', () => {
      if (typeof self.cover == 'object') {
        self.cover = self.cover.url();
      }
    });

    self.beginTimeSelected = beginTimeSelected;
    self.endTimeSelected = endTimeSelected;
    self.mapSvc = mapSvc;
    self.save = save;
    self.deleteCover = deleteCover;
    self.url = url;
    self.validFormBtn = method === 'create' ? 'Ajouter' : 'Sauvergarder'

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

    if (method === 'create') {
      mapSvc.getUserLoc().then(function(userGeoLoc) {
        mapSvc.map.center = userGeoLoc.center;
        mapSvc.draggableMarker.position = userGeoLoc.center;
      });
      mapSvc.draggableMarker.content = compiled[0];
      mapSvc.draggableMarker.visible = false;
      mapSvc.draggableMarker.visible = true;
    } else {
      mapSvc.map.zoom = 15;
      console.log('mapSvc.filteredEvents', mapSvc.filteredEvents);
    }
    // !!self.newEvent.position.lat;

    /*if (self.newEvent.cover) {
      self.cover = self.newEvent.cover.url({store: 'original'});
      delete self.newEvent.cover;
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
      if (method == 'create') { // Create
        console.log('saving event');
        Events.insert(self.newEvent, (error, savedEventId) => {
          if (error) {
            console.log('Oops, unable to save the event...', error);
            self.errorMsg = error.message;
          }
          else {
            console.log('Save done!', savedEventId);

            if (typeof self.cover !== 'object') {
              uploadPictures(savedEventId);
            } else {
              $state.go('app.events');
            }
          }
        });
      } else { // Update
        console.log('updating event');
        Events.update({_id: $stateParams.eventId}, {
          $set: {
            name: self.newEvent.name,
            description: self.newEvent.description,
            'public': self.newEvent.public,
            position: self.newEvent.position
          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the event...', error);
            self.errorMsg = error.message;
          } else {
            console.log('Update done!');
            if (typeof self.cover !== 'object') {
              console.log('launch uploadPictures...');
              uploadPictures(self.newEvent._id);
            }
          }
        });
      }
    };

    function uploadPictures(savedEventId) {
      console.log('uploadPictures', self.newEvent.cover);
      if (self.newEvent.cover) { // Update
        Images.update({_id: self.newEvent.cover}, {
          $set: self.cover
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the image...', error);
          } else {
            console.log('Save image done!', savedEventId);
            $state.go('app.events');
          }
        });
      } else { // Create
        Images.insert(self.cover, (error, image) => {
          if (error) {
            console.log('Oops, unable to save the event...', error);
            self.errorMsg = error.message;
          } else {
            console.log('Save done!', savedEventId, image._id);
            Events.update({_id: savedEventId}, {
              $set: {cover: image._id}
            });
            $state.go('app.events');
          }
        });
      }
    }
	}
}
