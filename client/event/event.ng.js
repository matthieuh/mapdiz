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

@Component({
  selector: 'event',
  controllerAs: 'eventDetails'
})

@View({templateUrl: 'client/event/event.html'})
@Inject(['$scope', '$reactive', '$rootScope', '$state', '$stateParams', '$log', 'mapSvc', '$timeout', '$window', '$compile', 'Upload'])

class Event {
  constructor($scope, $reactive, $rootScope, $state, $stateParams, $log, mapSvc, $timeout, $window, $compile, Upload) {
    var self = this;

    $reactive(self).attach($scope);

    self.method = isNaN($stateParams.eventId) && $stateParams.eventId === 'add' ? 'create' : 'update';
    mapSvc.updateVisibleMarkers();

    $('event').slimScroll({
      height: 'inherit'
    });

    self.subscribe('categories');
    self.subscribe('tags');

    self.helpers({
      newEvent() {
        if (self.method === 'create') {
          return {
            name: '',
            description: '',
            position: {},
            public: true,
            tags: []
          };
        } else {
          if (!$scope.$parent.App.filteredEvents)
            $scope.$parent.App.filteredEvents = $scope.$parent.App.events;
          return Events.findOne($stateParams.eventId);
        }
      },
      categories: _categoriesCollection,
      tags: _tagsCollection
    });

    self.autorun(_initMap);
    self.accessRight = self.method == 'create' ? 'right' : 'read';
    self.editing = self.method == 'create';
    self.beginTimeSelected = _beginTimeSelected;
    self.endTimeSelected = _endTimeSelected;
    self.save = _save;
    self.deleteCover = _deleteCover;
    self.validFormBtn = self.method === 'create' ? 'Ajouter' : 'Sauvegarder';
    self.tagTermClick = _tagTermClick;
    self.rsvp = _rsvp;
    self.myPresence = _myPresence;

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
      if (self.cover && typeof self.cover == 'object') {
        self.cover = self.cover.url();
      }
    });

    $scope.addTimeToDatetime = _addTimeToDatetime;
    $scope.$on('$destroy', () => {
      mapSvc.draggableMarker.visible = false;
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

    /////////////////////

    function _categoriesCollection() {
      return Tags.find({
        advisable: true,
      });
    }

    function _tagsCollection() {
      return Tags.find({
        advisable: false,
      });
    }

    function _initMap() {
      console.log('method', self.method);
      if (self.method === 'create') {

        mapSvc.setMapCenter('userGeoLoc', true);

        //mapSvc.draggableMarker.content = compiled[0];

      } else {

        if (Meteor.userId() && self.getReactively('newEvent.owner') && self.newEvent.owner == Meteor.userId()) {
          self.accessRight = 'right';
        }
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
        console.log('position', position);
        // Set zomm and center

        if (position) {
          /*mapSvc.updateMap({
            zoom: 15,
            center: {
              lat: position.lat,
              lng: position.lng
            }
          });*/

          mapSvc.map.zoom = 15;
          mapSvc.map.center = {
            lat: position.lat,
            lng: position.lng
          };
          $scope.$parent.App.filteredCategory = '';
          $rootScope.openedWindow = self.newEvent._id;
        }
      }
    }

    function _tagTermClick(e) {
      var tagText = e.target.innerHTML;
      console.log('tagTermClick, tagText:', e, tagText);
    }

    function _addTimeToDatetime(time, datimeScopeName) {
      var momentDate = moment(self.newEvent[datimeScopeName]);

      momentDate.set('hour', time.value.get('hour'));
      momentDate.set('min', time.value.get('min'));

      self.newEvent[datimeScopeName] = momentDate.toDate();
    }

    function _deleteCover() {
      delete self.cover;
      delete self.newEvent.cover;
    }

    function _beginTimeSelected(selected) {
      if(selected && selected.title) {
        self.newEvent.beginTime = selected.title;
      } else {
        self.newEvent.beginTime = undefined;
      }
    };

    function _endTimeSelected(selected) {
      if(selected && selected.title) {
        self.newEvent.endTime = selected.title;
      } else {
        self.newEvent.endTime = undefined;
      }
    }

    function _save() {
      delete self.errorMsg;
      console.log('_save');
      if (self.method == 'create') { // Create
        Events.insert(self.newEvent, (error, savedEventId) => {
          console.log('error', error, error.message, savedEventId);
          if (error && error.message) {
            self.errorMsg = error.message;
          } else {
            if (self.cover) {
              _uploadPictures(savedEventId);
            } else { // SUCCESS
              self.editing = false;
              $state.go('app.events', {eventId: savedEventId, eventSlug: convertToSlug(self.newEvent.name)});
            }
          }
        });
      } else { // Update
        Events.update({_id: $stateParams.eventId}, {
          $set: {
            name: self.newEvent.name,
            description: self.newEvent.description,
            beginDate: self.newEvent.beginDate,
            beginTime: self.newEvent.beginTime,
            endDate: self.newEvent.endDate,
            endTime: self.newEvent.endTime,
            position: self.newEvent.position,
            'public': self.newEvent.public,
            position: self.newEvent.position,
            category: self.newEvent.category
          }
        }, (error) => {
          if (error && error.message) {
            self.errorMsg = error.message;
          } else {
            if (self.cover) {
              _uploadPictures(self.newEvent._id);
            } else { // SUCCESS
              self.editing = false;
              //$state.go('app.events', {eventId: savedEventId, eventSlug: self.newEvent.url || convertToSlug(self.newEvent.name)});
            }
          }
        });
      }
    }

    function _uploadPictures(savedEventId) {
      // Create
      Images.insert(self.cover, (error, image) => {

        if (error && error.message) {
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
            } else { // SUCCESS
              self.editing = false;
              $state.go('app.events');
            }
          });


        }
      });
    }

    /**
     * [rsvp description]
     * @param  {[type]} eventId [description]
     * @param  {[type]} rsvp    [description]
     * @return {[type]}         [description]
     */
    function _rsvp(eventId, rsvp) {
      Meteor.call('rsvp', eventId, rsvp);
    }

    function _myPresence(event, answer) {
      if (event) {
        return _.some(event.rsvps, function(rsvp) {
          return rsvp.user === $rootScope.currentUser._id && rsvp.rsvp === answer;
        });
      }
    }

    /**
     * [rsvp description]
     * @param  {[type]} eventId [description]
     * @param  {[type]} rsvp    [description]
     * @return {[type]}         [description]
     */
    function rsvp(eventId, rsvp) {
      Meteor.call('rsvp', eventId, rsvp);
    }

    function _convertToSlug(Text) {
      return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
    };

	}
}
