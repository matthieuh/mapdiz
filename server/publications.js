Meteor.publish('avatars', function() {
  return Avatars.find();
});

Meteor.publish("userAvatar", function(avatarId) {
  if (avatarId)
    return Avatars.find({_id: avatarId});
});


Meteor.publish('cities', function() {
  return Cities.find();
});


Meteor.publish('highlighted-cities', function() {

  let selector = {
    highlighted: true,
  };

  return Cities.find(selector);
});


Meteor.publish("events", function (options, searchString, categoryId) {
  if (searchString == null)
    searchString = '';
  /*Counts.publish(this, 'numberOfEvents', Events.find({
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },*/
  let selector = {
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or:[
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]},
      {$and:[
        {owner: this.userId},
        {owner: {$exists: true}}
      ]},
      {$and:[
        {invited: this.userId},
        {invited: {$exists: true}}
      ]}
    ]
  };

  if (categoryId)
    selector.category = categoryId;

  return Events.find(selector);
});

Meteor.publish('eventPosts', function (eventId) {
  return Posts.find({eventId: eventId});
});


Meteor.publish('images', function () {
  return Images.find();
});


Meteor.publish('eventCover', function (coverId) {
  return Images.findOne(coverId);
});


Meteor.publish("tags", function() {

  let selector = {
    advisable: false,
  };

  return Tags.find(selector);
});


Meteor.publish("categories", function (options, searchString) {

  let selector = {
    advisable: true,
  };

  return Tags.find(selector, { sort: { events: -1 } });
});


Meteor.publish("users", function() {
  return Meteor.users.find();
});

Meteor.publish("usersData", function (options, searchString) {
  if (!searchString || searchString == null) {
    searchString = '';
  }

  let selector = {
    username: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
  };

  let defaultOptions = {fields: {emails: 1, profile: 1}};

  console.log('options, searchString', options, searchString);

  return Users.find(selector, options || defaultOptions);
});
