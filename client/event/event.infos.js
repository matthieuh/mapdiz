let {SetModule, Component, View, Inject, State} = angular2now;

SetModule('mapdiz');

@State({
  name: 'app.event.infos',
  url: '/infos',
  params: { eventId: 'name', eventSlug: ''},
  defaultRoute: true,
  html5Mode: true
})

@Component({
  selector: 'event-infos',
  controllerAs: 'EventInfos'
})

@View({templateUrl: 'client/event/event.infos.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$stateParams', '$log', 'mapSvc', '$timeout', '$window', '$compile', 'Upload')

class Eventinfos {
  constructor($scope, $reactive, $rootScope, $state, $stateParams) {
    var self = this;

    console.log('$scope.parent', $scope.$parent.$parent.$parent.eventDetails);

    self.eventDetails = $scope.$parent.$parent.$parent.eventDetails;

	}
}
