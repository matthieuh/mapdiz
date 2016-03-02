let {SetModule, Component, View, Inject, State} = angular2now;

SetModule('mapdiz');

@State({
  name: 'app.event.posts',
  url: '/posts',
  params: { eventId: 'name', eventSlug: ''},
  defaultRoute: true,
  html5Mode: true
})

@Component({
  selector: 'event-posts',
  controllerAs: 'EventPosts'
})

@View({templateUrl: 'client/event/event.posts.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$stateParams', '$log', 'mapSvc', '$timeout', '$window', '$compile', 'Upload')

class EventPosts {
  constructor($scope, $reactive, $rootScope, $state, $stateParams) {
    var self = this;

    self.eventDetails = $scope.$parent.$parent.$parent.eventDetails;
    self.newPost = {};
    self.addPost = _addPost;
    self.creator = _creator;
    self.voteUp = _voteUp;
    self.voteDown = _voteDown;
    self.isCurrentUserVote = _isCurrentUserVote;

    $reactive(self).attach($scope);

    self.subscribe('eventPosts', _eventPostsSubscribtion);

    self.helpers({
      posts: _eventPostsCollection
    });


    ///////////////////

    function _eventPostsCollection() {
      return Posts.find({
        eventId: self.getReactively('eventDetails.newEvent._id')
      });
    }

    function _eventPostsSubscribtion() {
      return [self.getReactively('eventDetails.newEvent._id')];
    }

    function _addPost() {
      if (self.eventDetails && self.eventDetails.newEvent) {
        self.newPost.eventId = self.eventDetails.newEvent._id;
        Posts.insert(self.newPost, (error, savedPostId) => {
          console.log(error, savedPostId);
          self.newPost = {};
        });
      }
      
    }

    function _getUserById(userId) {
      return Meteor.users.findOne(userId);
    }

    /**
     * [creator description]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    function _creator(post) {
      if (!post) return;
      return _getUserById(post.userId);
    }

    function _voteUp(postId) {
      Meteor.call('postVoteUp', postId);
    }

    function _voteDown(postId) {
      Meteor.call('postVoteDown', postId);
    }

    function _isCurrentUserVote(voters) {
      return _.contains(voters, Meteor.userId());
    }
  }
}
