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
  "advisable": {
    type: Boolean,
    label: "Conseillé",
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
