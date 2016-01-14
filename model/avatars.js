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
    setSmall: function(_id, size) {
      var avatar = Avatars.findOne(_id);
      var readStream = image.createReadStream('original');
      var writeStream = avatar.createWriteStream('avatar-small');

      // The following line should be avoided
      writeStream.safeOn('stored', function() {
        avatar.updatedAt(new Date(), {store: 'avatar-small'});
      });

      gm(readStream).crop(size.width, size.height, size.x, size.y).stream().pipe(writeStream);
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
  console.log('after.insert', doc);
  Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'avatar': doc._id }} );
});
