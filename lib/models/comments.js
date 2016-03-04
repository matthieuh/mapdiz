Comments = new Mongo.Collection("comments");

Schema.Comment = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true
  },
  /**
    The `_id` of the parent comment, if there is one
  */
  parentCommentId: {
    type: String,
    optional: true
  },
  /**
    The `_id` of the top-level parent comment, if there is one
  */
  topLevelCommentId: {
    type: String,
    optional: true
  },
  /**
    The comment body (Markdown)
  */
  body: {
    type: String,
    max: 3000
  },
  /**
    The HTML version of the comment body
  */
  htmlBody: {
    type: String,
    optional: true
  },
  /**
    An array containing the `_id`s of upvoters
  */
  upvoters: {
    type: [String],
    optional: true
  },
  /**
    An array containing the `_id`s of downvoters
  */
  downvoters: {
    type: [String],
    optional: true
  },
  /**
    The post's `_id`
  */
  postId: {
    type: String,
    optional: true
  },
  eventId: {
    type: String,
    optional: true
  },
  /**
    The comment author's `_id`
  */
  userId: {
    type: String,
    optional: true
  },
  /**
    Whether the comment is deleted. Delete comments' content doesn't appear on the site. 
  */
  isDeleted: {
    type: Boolean,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  /**
    Timetstamp of post update
  */
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
});

Comments.attachSchema(Schema.Comment);

if (Meteor.isServer) {
  Comments.before.insert((userId, doc) => {
    doc.userId = userId;
    console.log('Posts.before.insert', userId, doc);
  });
}