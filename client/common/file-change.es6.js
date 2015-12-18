@Directive({
  selector: 'fileChange',
  bind: {fileChange: '&'}
})
@Inject(['$element', '$scope'])

class fileChange {
  constructor($element, $scope) {
    var that = this;

    $element.on('change', evt => {
      if (that.fileChange && typeof that.fileChange === 'function') {
        $scope.$apply(() => {
          that.fileChange({'$event': evt});
        })
      }
    })
  }
}
