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

  return Meteor.users.find(selector, options || defaultOptions);
});
