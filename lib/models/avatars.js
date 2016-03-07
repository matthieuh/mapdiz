Schema = {}

Avatars = new FS.Collection("avatars", {
  stores: [
    new FS.Store.GridFS("avatar-original"),
    new FS.Store.GridFS("avatar-large", {
      transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name()).resize('200', null, true).stream().pipe(writeStream);
      }
    }),
    new FS.Store.GridFS("avatar-small", {
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
    setSmallAvatar: function(_id, size) {
      var avatar = Avatars.findOne(_id);
      var readStream = avatar.createReadStream('original');
      var writeStream = avatar.createWriteStream('avatar-small');

      // The following line should be avoided
      writeStream.safeOn('stored', function() {
        avatar.updatedAt(new Date(), {store: 'avatar-small'});
      });

      gm(readStream).crop(size.width, size.height, size.x, size.y).stream().pipe(writeStream);
    },
    getSmallAvatar: function(_id) {
      var avatar = Avatars.findOne(_id);
      console.log('getSmallAvatar back', avatar);
      //return avatar;
      var readStream = avatar.createReadStream('avatar-original');
      var writeStream = avatar.createWriteStream('avatar-small');
      return avatar;
      // The following line should be avoided
      writeStream.safeOn('stored', function() {
        avatar.updatedAt(new Date(), {store: 'avatar-small'});
      });

      gm(readStream).resize('50', null, true).stream().pipe(writeStream);
      //return avatar;
    }
  });

  Avatars.allow({
    insert: function (userId, doc) {
      return (userId ? true : false);
    },
    update: function (userId, doc, fields, modifier) {
      return (userId ? true : false);
    },
    remove: function (userId, doc) {
      return (userId ? true : false);
    },
    download: function(userId, doc) {
      return true;
    }
  });
}

Avatars.files.after.insert(function(userId, doc) {
  Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.avatar': doc._id }} );
});
