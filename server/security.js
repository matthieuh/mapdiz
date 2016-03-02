Security.defineMethod('ifIsSameUser', {
  fetch: [],
  transform: null,
  deny (type, arg, userId, doc) {
    return doc._id !== userId
  }
});

Security.defineMethod('ifIsEventOwner', {
  fetch: [],
  transform: null,
  deny (type, arg, userId, doc) {
    let event = Events.findOne(doc.eventId);
    console.log('ifIsEventOwner', event, userId)
    if (!event) {
      return true;
    }
    return userId !== event.owner;
  }
});

// users can create new updates
Events.permit(['insert']).ifLoggedIn().apply();
//Events.permit(['update']).ifLoggedIn().ifIsSameUser().apply();

Posts.permit(['insert']).ifLoggedIn().ifIsEventOwner().apply();

// logged in users can only edit THEIR profile
Users.permit(['update']).ifLoggedIn().ifIsSameUser().onlyProps(['profile']).apply();

