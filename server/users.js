Meteor.publish("users", function (options, searchString) {
  if (!searchString || searchString == null) {
    searchString = '';
  }

  let selector = {
    username: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
  };

  return Meteor.users.find(selector, options);
});
