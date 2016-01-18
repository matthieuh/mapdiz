Meteor.startup(function () {
  if (Tags.find().count() === 0) {
    var tags = [
      {
        label: "Fête",
        advisable: true,
        symbol: '#'
      },
      {
        label: "Anniversaire",
        advisable: true,
        symbol: '#'
      },
      {
        label: "Voyage",
        advisable: true,
        symbol: '#'
      },
      {
        label: "nofilter",
        advisable: false,
        symbol: '#'
      }
    ];
    for (var i = 0; i < tags.length; i++)
      Tags.insert( tags[i] );
  }
});
