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
