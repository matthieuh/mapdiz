Cities = new Mongo.Collection("cities");

Schema.City = new SimpleSchema({
  "label": {
    type: String,
    label: "Label"
  },
  "slug": {
    type: String,
    label: "Slug",
    optional: true
  },
  "highlighted": {
    type: Boolean,
    label: "Mis en avant",
    defaultValue: false,
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
  "center": {
    type: Object,
    label: "Emplacement",
    optional: true
  },
  "center.lat": {
    type: Number,
    label: "Latitude",
    decimal: true,
  },
  "center.lng": {
    type: Number,
    label: "Longitude",
    decimal: true
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

Cities.attachSchema(Schema.City);

Cities.allow({
  insert: function (userId, city) {
    return true;
  },
  update: function (userId, city, fields, modifier) {
    return true;
  },
  remove: function (userId, city) {
    return true;
  }
});
