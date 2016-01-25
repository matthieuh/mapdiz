Tags = new Mongo.Collection("tags");

Schema.Tag = new SimpleSchema({
  "symbol": {
    type: String,
    label: "Symbol"
  },
  "label": {
    type: String,
    label: "Label"
  },
  "slug": {
    type: String,
    label: "Slug",
    optional: true
  },
  "advisable": {
    type: Boolean,
    label: "Conseillé",
    optional: true
  },
  "image": {
    type: Object,
    optional: true,
  },
  "image.url": {
    type: String,
    optional: true,
  },
  "image.file": {
    type: String,
    optional: true,
  },
  "image.path": {
    type: String,
    optional: true,
  },
  "events": {
    label: "Evenements",
    type: [Object],
    optional: true
  },
  "events.$._id": {
    type: String
  },
  "events.$.name": {
    type: String
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

Tags.attachSchema(Schema.Tag);

Tags.allow({
  insert: function (userId, tag) {
    return true;
  },
  update: function (userId, tag, fields, modifier) {
    return true;
  },
  remove: function (userId, tag) {
    return true;
  }
});

/*String.prototype.parseHashtag = function() {
  return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
    var tag = t.replace("#","%23")
    return t.link("http://search.twitter.com/search?q="+tag);
  });
};*/
