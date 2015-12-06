Meteor.publish("events", function (options, searchString) {
  if (searchString == null)
    searchString = '';

  /*Counts.publish(this, 'numberOfEvents', Events.find({
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or:[
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]},
      {$and:[
        {owner: this.userId},
        {owner: {$exists: true}}
      ]},
      {$and:[
        {invited: this.userId},
        {invited: {$exists: true}}
      ]}
    ]}), { noReady: true });*/
  return Events.find(/*{
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or:[
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]},
      {$and:[
        {owner: this.userId},
        {owner: {$exists: true}}
      ]},
      {$and:[
        {invited: this.userId},
        {invited: {$exists: true}}
      ]}
    ]}, options*/);
});

// Meteor.publish("EventAndImages", function (eventId) {
//   check(eventId, String);
//   return [
//     Parties.find({_id: eventId}, {fields: {secretInfo: 0}}),
//     Images.find({roomId: mainPic})
//   ];
// });
// 
