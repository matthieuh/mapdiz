Posts = new Mongo.Collection("posts");

Schema.Post = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true
  },
  /**
    URL
  */
  url: {
    type: String,
    optional: true,
    max: 500
  },
  /**
    Title
  */
  title: {
    type: String,
    optional: false,
    max: 500
  },
  /**
    Slug
  */
  slug: {
    type: String,
    optional: true
  },
  /**
    Post body (markdown)
  */
  body: {
    type: String,
    optional: true,
    max: 3000
  },
  /**
    HTML version of the post body
  */
  htmlBody: {
    type: String,
    optional: true
  },
  /**
    Count of how many times the post's page was viewed
  */
  viewCount: {
    type: Number,
    optional: true
  },
  /**
    Count of the post's comments
  */
  commentCount: {
    type: Number,
    optional: true
  },
  /**
    An array containing the `_id`s of commenters
  */
  commenters: {
    type: [String],
    optional: true
  },
  /**
    Timestamp of the last comment
  */
  lastCommentedAt: {
    type: Date,
    optional: true
  },
  /**
    Count of how many times the post's link was clicked
  */
  clickCount: {
    type: Number,
    optional: true
  },
  /**
    The post's base score (not factoring in the post's age)
  */
  baseScore: {
    type: Number,
    decimal: true,
    optional: true
  },
  /**
    How many upvotes the post has received
  */
  upvotes: {
    type: Number,
    optional: true
  },
  /**
    An array containing the `_id`s of the post's upvoters
  */
  upvoters: {
    type: [String],
    optional: true
  },
  /**
    How many downvotes the post has received
  */
  downvotes: {
    type: Number,
    optional: true
  },
  /**
    An array containing the `_id`s of the post's downvoters
  */
  downvoters: {
    type: [String],
    optional: true
  },
  /**
    The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)
  */
  /*status: {
    type: Number,
    optional: true,
    editableBy: ["admin"],
    autoValue: function () {
      // only provide a default value
      // 1) this is an insert operation
      // 2) status field is not set in the document being inserted
      var user = Meteor.users.findOne(this.userId);
      if (this.isInsert && !this.isSet)
        return Posts.getDefaultStatus(user);
    },
    autoform: {
      noselect: true,
      options: Posts.config.postStatuses,
      group: 'admin'
    }
  },*/
  /**
    Whether the post is sticky (pinned to the top of posts lists)
  */
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  /**
    Whether the post is inactive. Inactive posts see their score recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true
  },
  /**
    Save info for later spam checking on a post. We will use this for the akismet package
  */
  userIP: {
    type: String,
    optional: true
  },
  userAgent: {
    type: String,
    optional: true
  },
  referrer: {
    type: String,
    optional: true
  },
  /**
    The post author's name
  */
  author: {
    type: String,
    optional: true
  },
  /**
    The post author's `_id`.
  */
  userId: {
    type: String,
    optional: true
  }, 
  eventId: {
    type: String,
    optional: true
  },
  /**
    Timetstamp of post creation
  */
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

Posts.attachSchema(Schema.Post);


if (Meteor.isServer) {

  Posts.before.insert((userId, doc) => {
    doc.userId = userId;
    console.log('Posts.before.insert', userId, doc);
  });

}