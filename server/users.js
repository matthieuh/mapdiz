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

  return Meteor.users.find(selector, {fields: {emails: 1, profile: 1}});
});
