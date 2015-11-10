Meteor.startup(function () {

  if (Events.find().count() === 0) {
    var events = [
      {
        'name': 'Dubstep-Free Zone',
        'description': 'Fast just got faster with Nexus S.',
        'position': {
          'lat': 15,
          'lng': 34
        }
      },
      {
        'name': 'Fiesta Banana',
        'description': 'Whouhouuu !',
        'position': {
          'lat': 54,
          'lng': 22
        }
      }
    ];
    // for (var i = 0; i < events.length; i++)
    //   Events.insert({
    //     name: events[i].name,
    //     description: events[i].description,
    //     position: events[i].position,
    //     public: true
    //   });
  }
});
