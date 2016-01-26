Meteor.startup(function () {

  var cities = [
    {
      label: "Lyon",
      slug: "lyon",
      highlighted: true,
      image: {
        path: "assets/images/city/lyon.jpg"
      },
      center: {
        lat: 45.764043,
        lng: 4.835658
      }
    },
    {
      label: "Grenoble",
      slug: "grenoble",
      highlighted: true,
      image: {
        path: "assets/images/city/grenoble.jpg"
      },
      center: {
        lat: 45.188529,
        lng: 5.724523
      }
    },
    {
      label: "villeurbanne",
      slug: "villeurbanne",
      highlighted: false,
      image: {
        path: "assets/images/category/jetty-landing-stage-sea-holiday.jpg"
      },
      center: {
        lat: 45.771944,
        lng: 4.890171
      }
    }
  ];

  for (var i = 0; i < cities.length; i++) {
    Cities.upsert({
      slug: cities[i].slug
    },
    {
      $set: {
        label: cities[i].label,
        image: cities[i].image,
        highlighted: cities[i].highlighted,
        center: cities[i].center
      }
    });
  }

});
