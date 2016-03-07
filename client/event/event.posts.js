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
@Inject('$scope', '$reactive', '$rootScope', '$state', '$stateParams', '$timeout', '$log', 'mapSvc', '$window', '$compile', 'Upload')

class EventPosts {
  constructor($scope, $reactive, $rootScope, $state, $stateParams, $timeout) {
    var self = this;

    self.eventDetails = $scope.$parent.$parent.$parent.eventDetails;
    self.newPost = {};
    self.addPost = _addPost;
    self.deletePost = _deletePost;
    self.addComment = _addComment;
    self.deleteComment = _deleteComment;
    self.creator = _creator;
    self.voteUp = _voteUp;
    self.voteDown = _voteDown;
    self.isCurrentUserVote = _isCurrentUserVote;
    self.isOwnerOrIsEventGuest = _isOwnerOrIsEventGuest;
    self.isPostOrEventOwner = _isPostOrEventOwner;
    self.isCommentOwner = _isCommentOwner;
    self.showAddPost = false;
    self.showComments = [];
    self.showAddComments = [];
    self.postsComments = [];
    self.newComments = [];
    self.getCommentsLength = _getCommentsLength;

    $reactive(self).attach($scope);

    self.subscribe('eventPosts', _eventPostsSubscribtion);
    self.subscribe('eventComments', _eventCommentsSubscribtion);

    self.helpers({
      posts: _eventPostsCollection,
      comments: _eventCommentsCollection
    });


    ///////////////////

    function _eventPostsCollection() {
      return Posts.find({
        eventId: self.getReactively('eventDetails.newEvent._id')
      });
    }

    function _eventCommentsCollection() {
      return Comments.find({
        eventId: self.getReactively('eventDetails.newEvent._id')
      });
    }

    function _eventPostsSubscribtion() {
      return [self.getReactively('eventDetails.newEvent._id')];
    }

    function _eventCommentsSubscribtion() {
      return [self.getReactively('eventDetails.newEvent._id')];
    }

    function _addPost() {
      if (self.eventDetails && self.eventDetails.newEvent) {

        self.newPost.eventId = self.eventDetails.newEvent._id;

        Posts.insert(self.newPost, (error, savedPostId) => {
          self.newPost = {};
          self.showAddPost = false;

          $scope.$apply();
        });

      } 
    }

    function _deletePost(postId) {
      Posts.remove(postId);
    }

    function _addComment(postId) {
      if (postId && self.eventDetails && self.eventDetails.newEvent) {

        self.newComments[postId].eventId = self.eventDetails.newEvent._id;
        self.newComments[postId].postId = postId;

        Comments.insert(self.newComments[postId], (error, savedCommentId) => {
          self.newComments[postId] = {};
          self.showAddComments[postId] = false;
          
          $scope.$apply();
        });

      }
    }

    function _deleteComment(commentId) {
      Comments.remove(commentId);
    }

    function _getCommentsLength(postId) {
      self.postsComments[postId] = _.filter(self.comments, {postId: postId});
      return self.postsComments[postId].length
    }

    function _getUserById(userId) {
      return Meteor.users.findOne(userId);
    }

    /**
     * [creator description]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    function _creator(doc) {
      if (!doc) return;
      return _getUserById(doc.userId);
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

    function _isOwnerOrIsEventGuest() {
      let event = self.eventDetails.newEvent;
      let userId = Meteor.userId();
      return event && (event.public == true || event.owner == userId || _.contains(userId, event.invited));
    }

    function _isPostOrEventOwner(post) {
      let event = self.eventDetails.newEvent;
      let userId = Meteor.userId();
      return post && post.userId == userId || event.owner == userId ;
    }

    function _isCommentOwner(owner) {
      return Meteor.userId() == owner;
    }
  }
}
