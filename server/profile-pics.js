Meteor.publish('profilePics', function () {
  return ProfilePics.find();
});