Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("original"),
    new FS.Store.GridFS("cropped", {
      transformWrite: function(fileObj, readStream, writeStream) {
        var cropInfos = fileObj.metadata.cropInfos;
        gm(readStream, fileObj.name())
          .crop(cropInfos.w, cropInfos.h, cropInfos.x, cropInfos.y)
          .resize('500', null)
          .stream()
          .pipe(writeStream);
      }
    }),
    new FS.Store.GridFS("thumbnail", {
      transformWrite: function(fileObj, readStream, writeStream) {
        console.log('thumbnail gen', fileObj);
        gm(readStream, fileObj.name())
          .resize(350, 250)
          .stream()
          .pipe(writeStream);
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
    setThumbnail: function(image) {
      var image = Images.findOne(image.id);
      var readStream = image.createReadStream('original');
      var writeStream = image.createWriteStream('thumbnail');

      //The following line should be avoided
      writeStream.safeOn('stored', function() {
        image.updatedAt(new Date(), {store: 'thumbnail'});
      });

      gm(readStream).crop(size.width, size.height, size.x, size.y).stream().pipe(writeStream);
    }
  });
}

Images.allow({
  insert: function (userId, image) {
    return userId;
  },
  update: function (userId, image, fields, modifier) {
    return userId;
  },
  remove: function (userId, image) {
    return userId;
  },
  download: function(userId, image) {
    var linkedEvent = Events.findOne({mainPic: image._id});
    if (linkedEvent && linkedEvent.public) {
      return true;
    } else {
      return userId;
    }
  }
});
