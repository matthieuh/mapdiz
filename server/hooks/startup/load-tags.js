Meteor.startup(function () {
  //if (Tags.find().count() === 0) {
    var tags = [
      {
        label: "Vie Nocturne",
        slug: "nightlife",
        advisable: true,
        symbol: '#',
        image: {
          path: "assets/images/category/alcohol-bar-party-cocktail-large.jpg"
        },
        marker: {
          path: "assets/images/markers/nightlife_reverse.png"
        }
      },
      {
        label: "Anniversaire",
        slug: "birthday",
        advisable: true,
        symbol: '#',
        image: {
          path: "assets/images/category/christmas-xmas-gifts-presents.jpg"
        },
        marker: {
          path: "assets/images/markers/birthday_reverse.png"
        }
      },
      {
        label: "Voyage",
        slug: "trip",
        advisable: true,
        symbol: '#',
        image: {
          path: "assets/images/category/jetty-landing-stage-sea-holiday.jpg"
        },
        marker: {
          path: "assets/images/markers/trip_reverse.png"
        }
      },
      {
        label: "Sport",
        slug: "sport",
        advisable: true,
        symbol: '#',
        image: {
          path: "assets/images/category/people-men-grass-sport-large.jpg"
        },
        marker: {
          path: "assets/images/markers/sport_reverse.png"
        }
      },
      {
        label: "Art",
        slug: "art",
        advisable: true,
        symbol: '#',
        image: {
          path: "assets/images/category/city-love-rainbow-nyc-large.jpg"
        },
        marker: {
          path: "assets/images/markers/art_reverse.png"
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
          image: tags[i].image,
          marker: tags[i].marker
        }
      });
    }
  //}
});
