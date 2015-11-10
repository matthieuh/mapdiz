ProfilePics = new FS.Collection("profilePics", {
  stores: [
    new FS.Store.GridFS("profilePic-large", {
      transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name()).resize('200', null, true).stream().pipe(writeStream);
      }
    }),
    new FS.Store.GridFS("profilePic-small", {
      transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name()).resize('50', null, true).stream().pipe(writeStream);
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

if (Meteor.isServer) {
  Meteor.methods({
    setSmall: function(_id, size) {
      var profilePic = ProfilePics.findOne(_id);
      var readStream = image.createReadStream('original');
      var writeStream = profilePic.createWriteStream('profilePic-small');

      //The following line should be avoided
      writeStream.safeOn('stored', function() {
        profilePic.updatedAt(new Date(), {store: 'profilePic-small'});
      });

      gm(readStream).crop(size.width, size.height, size.x, size.y).stream().pipe(writeStream);
    }
  });
}

ProfilePics.allow({
  insert: function (userId, profilePic) {
    return userId;
  },
  update: function (userId, profilePic, fields, modifier) {
    console.log('update profilePic', userId);
    return true;
  },
  remove: function (userId, profilePic) {
    return userId;
  },
  download: function(userId, profilePic) {
    return true;
  }
});

ProfilePics.files.before.insert(function (userId, doc) {
  doc.user = userId;
  // Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profilePicture': doc._id }} );
});

// ProfilePics.files.before.insert(function (userId, doc) {
//   Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profilePicture': doc._id }} );
// });
