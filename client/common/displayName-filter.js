var {SetModule, Filter} = angular2now;

SetModule('mapdiz');

@Filter({name: 'displayName'})
class displayName {
  constructor() {
    return function (user) {
      if (!user)
        return;
      if (user.username)
        return user.username;
      else if (user.emails)
        return user.emails[0].address;
      else if (user.services && user.services.facebook && user.services.facebook.name)
        return user.services.facebook.name;
      else
        return user
    }
  }
}
