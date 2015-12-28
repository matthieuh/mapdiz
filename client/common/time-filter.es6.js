var {SetModule, Filter} = angular2now;

SetModule('mapdiz');

@Filter({name: 'time'})
class timeFilter {
  constructor() {
    return function (items, filter) {
      if (filter && filter.options && filter.options.disabled) return items;
      var filtered = [];
      angular.forEach(items, function(item, index) {

        if (item.beginDate) {
          var minDate = moment().add(filter.min, 'days');
          var maxDate = moment().add(filter.max, 'days');
          var eventDate = moment(item.beginDate);
          var diff;

          if (filter.options && filter.options.disabled) {
            filtered.push(item); // tous
          } else if (filter.options && filter.options.infinite) {
            diff = eventDate.diff(moment(), 'days');
            item.diff = diff;
            if( diff >= 0) filtered.push(item); // après ajd
          } else {
            diffMin = minDate.diff(eventDate, 'days');
            diffMax = maxDate.diff(eventDate, 'days');
            item.diff = diffMax;
            if (diffMin <= 0 && diffMax >= 0 && eventDate.diff(moment()) > 0) filtered.push(item); // après x jours
          }

        }
      });
      return _.sortBy(filtered, 'diff');
    };
  }
}
