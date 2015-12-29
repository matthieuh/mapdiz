Schema = {}

Events = new Mongo.Collection("events");

Schema.Event = new SimpleSchema({
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

Events.attachSchema(Schema.Event);

Events.allow({
  insert: function (userId, event) {
    console.log('insert event', userId, event);
    return userId && event.owner === userId;
  },
  update: function (userId, event, fields, modifier) {
    if (userId !== event.owner)
      return false;
    return true;
  },
  remove: function (userId, event) {
    if (userId !== event.owner)
      return false;
    return true;
  }
});

Meteor.methods({
  invite: function (eventId, userId) {

    check(eventId, String);
    check(userId, String);

    let event = Events.findOne(eventId);

    if (!event)
      throw new Meteor.Error(404, "No such event");

    if (event.owner !== this.userId)
      throw new Meteor.Error(404, "No such event");

    if (event.public)
      throw new Meteor.Error(400, "That event is public. No need to invite people.");

    if (userId !== event.owner && ! _.contains(event.invited, userId)) {
      Events.update(eventId, { $addToSet: { invited: userId } });

      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));

      if (Meteor.isServer && to) {
        console.log('email send');
        // This code only runs on the server. If you didn't want clients
        // to be able to see it, you could move it to a separate file.
        Email.send({
          from: "noreply@mapdiz.com",
          to: to,
          replyTo: from || undefined,
          subject: "PARTY: " + event.name,
          text:
          "Bonjour,\n\n" +
          "Je t'invite à mon évenement '" + event.name + "' sur Mapdiz.\n\n" +
          "Venez me donner votre disponibilité : " + Meteor.absoluteUrl() + "events/" + eventId + "/"+ event.url +"\n"
        });
      }
    }
  },
  rsvp: function (eventId, rsvp) {

    check(eventId, String);
    check(rsvp, String);

    if (!this.userId)
      throw new Meteor.Error(403, "Vous devez être connecté pour réserver !");

    if (!_.contains(['yes', 'maybe', 'no'], rsvp))
      throw new Meteor.Error(400, "Réservation invalide");

    let event = Events.findOne(eventId);

     console.log('event',event);

    if (!event)
      throw new Meteor.Error(404, "Evènement introuvable");

    if (!event.public && event.owner !== this.userId &&
      !_.contains(event.invited, this.userId))
      throw new Meteor.Error(403, "Evènement introuvable");

    let rsvpIndex = _.indexOf(_.pluck(event.rsvps, 'user'), this.userId);

    console.log('rsvpIndex', rsvpIndex);

    if (rsvpIndex !== -1) {
      // update existing rsvp entry

      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        Events.update(
          {_id: eventId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});

      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        let modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;

        Events.update(eventId, modifier);
      }

      // Possible improvement: send email to the other people that are
      // coming to the party.
    } else {
      // add new rsvp entry
      Events.update(eventId, {
        $push: {rsvps: {user: this.userId, rsvp: rsvp}}
      }, (error, doc) => {
        console.log('error', error, doc);
      });
    }
  }
});

var contactEmail = function(user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};

Events.before.insert(function(userId, doc) {
  console.log('Events.before.insert', doc);
  doc.added = Date.now();
  doc.owner = userId;
  doc.url = convertToSlug(doc.name);
  doc.name = capitalizeFirstLetter(doc.name);
  console.log('Events.before.insert', userId, doc);
});


Events.before.update(function(userId, doc, fieldNames, modifier, options) {
  modifier.$set.updated = Date.now();
});

function convertToSlug(Text) {
  return Text
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-');
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
