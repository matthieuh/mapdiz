var {SetModule, Filter} = angular2now;

SetModule('mapdiz');

@Filter({name: 'displayName'})
class displayName {
  constructor() {
    return (user) => {
      if (!user)
        return 'deleted user';
      if (user.username)
        return user.username;
      else if (user.services && user.services.facebook && user.services.facebook.name)
        return user.services.facebook.name;
    }
  }
}
