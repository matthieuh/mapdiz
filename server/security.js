Security.defineMethod('ifIsSameUser', {
  fetch: [],
  transform: null,
  deny (type, arg, userId, doc) {
    return doc._id !== userId
  }
});

// users can create new updates
Events.permit(['insert']).ifLoggedIn().ifIsSameUser().apply();

// logged in users can only edit THEIR profile
Users.permit(['update']).ifLoggedIn().ifIsSameUser().onlyProps(['profile']).apply();
