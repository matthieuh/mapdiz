let {SetModule, Component, View, Inject, State} = angular2now;

SetModule('mapdiz');

@State({
  name: 'app.event.posts',
  url: '/events/:eventId/:eventSlug/posts',
  params: { eventId: 'name', eventSlug: ''},
  defaultRoute: true,
  html5Mode: true
})

@Component({
  selector: 'event-posts',
  controllerAs: 'EventPosts'
})

@View({templateUrl: 'client/event/event.posts.html'})
@Inject(['$scope', '$reactive', '$rootScope', '$state', '$stateParams', '$log', 'mapSvc', '$timeout', '$window', '$compile', 'Upload'])

class EventPosts {
  constructor($scope, $reactive, $rootScope, $state, $stateParams) {
    var self = this;

    $reactive(self).attach($scope);


	}
}
