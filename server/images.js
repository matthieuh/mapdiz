Meteor.publish('images', function () {
  return Images.find();
});

Meteor.publish('eventCover', function (coverId) {
  return Images.findOne(coverId);
});
