angular.module('hashtagify', []);

angular.module('hashtagify')

.directive('hashtagify', ['$timeout', '$compile',
  function($timeout, $compile) {
    return {
      restrict: 'A',
      scope: {
        uClick: '&userClick',
        tClick: '&termClick'
      },
      link: function(scope, element, attrs) {

        _initWatcher();

        ///////////////////////

        function _initWatcher() {
          unbindWatcher = scope.$watch(function() {
            if (element && element[0] && element[0].innerHTML) {
              return element[0].innerHTML;
            }
          }, _replaceContent, true);
        }


        function _replaceContent(val) {
          $timeout(function() {

            var html = element.html();

            if (html === '') {
              return false;
            }

            if (attrs.userClick) {
              html = html.replace(/ (@[a-z0-9][a-z0-9\-_êéàûùµ]*)/ig, ' <a ng-click="uClick({$event: $event})" class="hashtag">$1</a>');
            }

            if (attrs.termClick) {
              html = html.replace(/ (#[a-z0-9][a-z0-9\-_êéàûùµ]*)/ig, ' <a ng-click="tClick({$event: $event})" class="hashtag">$1</a>');
            }

            unbindWatcher();
            element.html(html);

            $compile(element.contents())(scope);
          }, 0);
        }
      }
    };
  }
]);
