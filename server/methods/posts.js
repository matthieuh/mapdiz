Meteor.methods({
  postVoteUp: function (postId) {
    check(postId, String);

    console.log('postId', postId);

    let post = Posts.findOne(postId);

    if (!post)
      throw new Meteor.Error(404, "No such post");

    if (!this.userId)
      throw new Meteor.Error(403);

    if (!_.contains(post.upvoters, this.userId)) {
      Posts.update(postId, { 
        $addToSet: { upvoters: this.userId },
        $pull: { downvoters: this.userId }
      });
    } else {
      Posts.update(postId, { 
        $pull: { upvoters: this.userId }
      });
    }
  },
  postVoteDown: function (postId) {
    check(postId, String);

    console.log('postId', postId);

    let post = Posts.findOne(postId);

    if (!post)
      throw new Meteor.Error(404, "No such post");

    if (!this.userId)
      throw new Meteor.Error(403);

    if (!_.contains(post.downvoters, this.userId)) {
      Posts.update(postId, { 
        $addToSet: { downvoters: this.userId },
        $pull: { upvoters: this.userId }
      });
    } else {
      Posts.update(postId, { 
        $pull: { downvoters: this.userId }
      });
    }
  }
});