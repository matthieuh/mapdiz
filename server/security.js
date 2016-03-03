Security.defineMethod('ifIsSameUser', {
  fetch: [],
  transform: null,
  deny (type, arg, userId, doc) {
    return doc._id !== userId
  }
});

Security.defineMethod('ifIsPublicEvent', {
  fetch: [],
  transform: null,
  deny (type, arg, userId, doc) {
    let event = Events.findOne(doc.eventId);
    if (!event) {
      return true;
    }
    return event.public == false;
  }
});

Security.defineMethod('ifIsEventOwner', {
  fetch: [],
  transform: null,
  deny (type, arg, userId, doc) {
    let event = Events.findOne(doc.eventId);
    if (!event) {
      return true;
    }
    return userId !== event.owner;
  }
});

Security.defineMethod('ifIsEventGuest', {
  fetch: [],
  transform: null,
  deny (type, arg, userId, doc) {
    let event = Events.findOne(doc.eventId);
    
    if (!event) {
      return true;
    }
    return !_.contains(event.invited, userId);
  }
});


// users can create new updates
Events.permit(['insert']).ifLoggedIn().apply();
//Events.permit(['update']).ifLoggedIn().ifIsSameUser().apply();


/* POSTS */
Posts.permit(['remove']).ifLoggedIn().ifIsEventOwner().apply();

/*
  An user can add a post :
  - on public events
  - on a event if he's the owner 
  - on a private event if he's invited
*/
Posts.permit(['insert']).ifLoggedIn().ifIsPublicEvent().apply();
Posts.permit(['insert']).ifLoggedIn().ifIsEventOwner().apply();
Posts.permit(['insert']).ifLoggedIn().ifIsEventGuest().apply();

// logged in users can only edit THEIR profile
Users.permit(['update']).ifLoggedIn().ifIsSameUser().onlyProps(['profile']).apply();

