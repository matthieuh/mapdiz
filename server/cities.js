Meteor.publish('cities', function() {
  return Cities.find();
});

Meteor.publish('highlighted-cities', function() {

  let selector = {
    highlighted: true,
  };

  return Cities.find(selector);
});
