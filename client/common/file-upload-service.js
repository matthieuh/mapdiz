var {SetModule, Service, Inject} = angular2now;

SetModule('mapdiz');

@Service('FileUpload')
@Inject('$meteor', '$log', '$q')
class fileUpload {
  constructor($meteor, $log, $q) {
    return {
      images:    $meteor.collection(Images),
      url:       url,
      uploadImg: uploadImg
    };

    function url(image) {
      return Images.findOne(image._id).url();
    }

    function uploadImg(el) {
      if (el instanceof HTMLElement)
        var data = el.files[0];
      else if (el instanceof jQuery.Event)
        data = el.target.files[0];
      else
        data = el;

      var d = $q.defer();

      Images.insert(data, function (err, fileObj) {
        if (err)
          d.reject(err);
        else
          d.resolve();
      });

      return d.promise;
    }
  }
}
