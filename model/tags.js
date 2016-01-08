Tags = new Mongo.Collection("tags");

Schema.Tags = new SimpleSchema({
  "name": {
    type: String,
    label: "Name",
    min: 4,
    max: 200
  },
  "description": {
    type: String,
    label: "Description",
    min: 20,
    max: 1000,
    optional: true
  },
  "beginDate": {
    type: Date,
    label: "Date de début",
    optional: true
  },
  "beginTime": {
    type: Date,
    label: "Heure de début",
    optional: true
  },
  "endDate": {
    type: Date,
    label: "Date de fin",
    optional: true
  },
  "endTime": {
    type: Date,
    label: "Heure de fin",
    optional: true
  },
  "position": {
    type: Object,
    label: "Emplacement",
    optional: true
  },
  "position.lat": {
    type: Number,
    label: "Latitude",
    decimal: true,
  },
  "position.lng": {
    type: Number,
    label: "Longitude",
    decimal: true
  },
  "cover": {
    label: "Image de couverture",
    type: String,
    optional: true
  },
  "owner": {
    type: Schema.User,
    optional: true
  },
  "public": {
    label: "Publique",
    type: Boolean,
    defaultValue: false
  },
  "rsvps": {
    label: "Participants",
    type: [Object],
    optional: true
  },
  "rsvps.$.user": {
    type: Schema.User
  },
  "rsvps.$.rsvp": {
    type: String
  },
  "invited": {
    label: "Invités",
    type: [String],
    optional: true
  }
});
