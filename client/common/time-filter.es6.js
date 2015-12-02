var {SetModule, Filter} = angular2now;

SetModule('mapdiz');

@Filter({name: 'time'})
class timeFilter {
  constructor() {
    return function (items, filter) {
      if(filter.disabled) return items;
      var filtered = [];
      angular.forEach(items, function(item, index) {
        if(item.beginDate) {
          var minDate = moment().add(filter.min, 'days');
          var maxDate = moment().add(filter.max, 'days');
          var eventDate = moment(item.beginDate, 'DD/MM/YYYY');
          var diff;
          if (filter.disabled) {
            filtered.push(item); // tous
          } else if(filter.infinite) {
            diff = eventDate.diff(moment(), 'days');
            item.diff = diff;
            if( diff >= 0) filtered.push(item); // après ajd
          } else {
            diffMin = minDate.diff(eventDate, 'days');
            diffMax = maxDate.diff(eventDate, 'days');
            // console.log('diff date', moment(item.beginDate, 'DD/MM/YYYY').format('DD/MM/YYYY'), newDate.format('DD/MM/YYYY'), diff);
            item.diff = diffMax;
            if(diffMin <= 0 && diffMax >= 0 && eventDate.diff(moment()) > 0) filtered.push(item); // après x jours
          }
        }
      });
      return _.sortBy(filtered, 'diff');
    };
  }
}
