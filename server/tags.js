Meteor.publish("tags", function() {

  return Tags.find();
});

Meteor.publish("categories", function (options, searchString) {

  let selector = {
    advisable: true,
  };

  return Tags.find(selector, { sort: { events: -1 } });
});
