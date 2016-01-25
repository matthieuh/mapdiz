Meteor.startup(function () {
  //if (Tags.find().count() === 0) {
    var tags = [
      {
        label: "Fête",
        slug: "party",
        advisable: true,
        symbol: '#',
        image: {
          path: "assets/images/category/alcohol-bar-party-cocktail-large.jpg"
        }
      },
      {
        label: "Anniversaire",
        slug: "birthday",
        advisable: true,
        symbol: '#',
        image: {
          path: "assets/images/category/christmas-xmas-gifts-presents.jpg"
        }
      },
      {
        label: "Voyage",
        slug: "trip",
        advisable: true,
        symbol: '#',
        image: {
          path: "assets/images/category/jetty-landing-stage-sea-holiday.jpg"
        }
      }
    ];
    for (var i = 0; i < tags.length; i++) {
      Tags.upsert({
        label: tags[i].label,
        advisable: tags[i].advisable,
        symbol: '#'
      },
      {
        $set: {
          slug: tags[i].slug,
          image: tags[i].image
        }
      });
    }
  //}
});
