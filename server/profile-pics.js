Meteor.publish('avatars', function () {
  return Avatars.find();
});
