Events = new Mongo.Collection("events");

var EventSchema = new SimpleSchema({
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
    max: 1000
  },
  "beginDate": {
    type: Date,
    label: "Date de début"
  },
  "beginTime": {
    type: Date,
    label: "Heure de début"
  },
  "endDate": {
    type: Date,
    label: "Date de fin"
  },
  "endTime": {
    type: Date,
    label: "Heure de fin"
  },
  "position": {
    type: Object,
    label: "Emplacement"
  },
  "position.lat": {
    type: Number,
    label: "Latitude",
    decimal: true
  },
  "position.lng": {
    type: Number,
    label: "Longitude",
    decimal: true
  },
  "cover": {
    type: FS.File,
    optional: true
  }
});

Events.attachSchema(EventSchema);

Events.allow({
  insert: function (userId, event) {
    console.log('insert event', userId, event);
    //return userId && event.owner === userId;
    return true;
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
  invite: function (partyId, userId) {
  	console.log('invite', partyId, userId);
    check(partyId, String);
    check(userId, String);
    var event = Events.findOne(partyId);
    console.log('event', event);
    if (!event)
      throw new Meteor.Error(404, "No such event");
    if (event.owner !== this.userId)
      throw new Meteor.Error(404, "No such event");
    if (event.public)
      throw new Meteor.Error(400,
        "That event is public. No need to invite people.");

    if (userId !== event.owner && ! _.contains(event.invited, userId)) {
      Events.update(partyId, { $addToSet: { invited: userId } });

      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));

      if (Meteor.isServer && to) {
        // This code only runs on the server. If you didn't want clients
        // to be able to see it, you could move it to a separate file.
        Email.send({
          from: "noreply@secretp.com",
          to: to,
          replyTo: from || undefined,
          subject: "PARTY: " + event.name,
          text:
          "Hey, I just invited you to '" + event.name + "' on SecretP." +
          "\n\nCome check it out: " + Meteor.absoluteUrl() + "/events/" + partyId + "\n"
        });
      }
    }
  },
  rsvp: function (partyId, rsvp) {
    check(partyId, String);
    check(rsvp, String);
    if (! this.userId)
      throw new Meteor.Error(403, "Vous devez être connecté pour réserver !");
    if (! _.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Réservation invalide");
    var event = Events.findOne(partyId);
    if (! event)
      throw new Meteor.Error(404, "Evènement introuvable");
    if (! event.public && event.owner !== this.userId &&
      !_.contains(event.invited, this.userId))
    // private, but let's not tell this to the user
      throw new Meteor.Error(403, "Evènement introuvable");

    var rsvpIndex = _.indexOf(_.pluck(event.rsvps, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      // update existing rsvp entry

      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        Events.update(
          {_id: partyId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
        Events.update(partyId, modifier);
      }

      // Possible improvement: send email to the other people that are
      // coming to the party.
    } else {
      // add new rsvp entry
      Events.update(partyId,
        {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
    }
  }
});

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};


Events.before.insert(function (userId, doc) {
  console.log('Events.before.insert', userId, doc);
  doc.added = Date.now();
  doc.owner = userId;
  doc.url = convertToSlug(doc.name);
});

Events.before.update(function (userId, doc) {
  doc.updated = Date.now();
});

function convertToSlug(Text) {
  return Text
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-')
    ;
};
