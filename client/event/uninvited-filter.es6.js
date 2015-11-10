var {Filter} = angular2now;

angular.module('secretp');

@Filter({ name: 'uninvited' })
class uninvited {
  constructor() {
    return function (users, event) {
      if (!event)
        return false;

      return _.filter(users, function (user) {

        if (user._id == event.owner || _.contains(event.invited, user._id))
          return false;
        else
          return true;
      });
    }
  }
}
