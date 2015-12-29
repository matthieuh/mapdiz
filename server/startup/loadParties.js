Meteor.startup(function () {

  if (Events.find().count() === 0) {
    var events = [
      {
        "name" : "Jour de l'an !",
        "description" : "Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an !",
        "position" : {
            "lat" : 35.7631071000000134,
            "lng" : 6.8493260999999848
        },
        "public" : false,
        "beginDate" : "2015-12-25T23:00:00.000Z",
        "endDate" : "2015-12-25T23:00:00.000Z",
        "beginTime" : "2015-12-25T23:00:00.000Z",
        "endTime" : "2015-12-25T23:00:00.000Z",
        "added" : 1450875770123.0000000000000000,
        "owner" : "Yme5qdtndZQxKoRZi",
        "url" : "jour-de-lan-",
        "cover" : "FwmxPN2LPX9NXd8G4"
      },
      {
        "name" : "Jour de l'an !",
        "description" : "Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an !",
        "position" : {
            "lat" : 49.7631071000000134,
            "lng" : 4.8493260999999848
        },
        "public" : false,
        "beginDate" : "2015-12-25T23:00:00.000Z",
        "endDate" : "2015-12-25T23:00:00.000Z",
        "beginTime" : "2015-12-25T23:00:00.000Z",
        "endTime" : "2015-12-25T23:00:00.000Z",
        "added" : 1450875770123.0000000000000000,
        "owner" : "Yme5qdtndZQxKoRZi",
        "url" : "jour-de-lan-",
        "cover" : "FwmxPN2LPX9NXd8G4"
      },
      {
        "name" : "Jour de l'an !",
        "description" : "Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an !",
        "position" : {
            "lat" : 42.7631071000000134,
            "lng" : 8.8493260999999848
        },
        "public" : false,
        "beginDate" : "2015-12-25T23:00:00.000Z",
        "endDate" : "2015-12-25T23:00:00.000Z",
        "beginTime" : "2015-12-25T23:00:00.000Z",
        "endTime" : "2015-12-25T23:00:00.000Z",
        "added" : 1450875770123.0000000000000000,
        "owner" : "Yme5qdtndZQxKoRZi",
        "url" : "jour-de-lan-",
        "cover" : "FwmxPN2LPX9NXd8G4"
      },
      {
        "name" : "Jour de l'an !",
        "description" : "Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an !",
        "position" : {
            "lat" : 44.7631071000000134,
            "lng" : 3.8493260999999848
        },
        "public" : false,
        "beginDate" : "2015-12-25T23:00:00.000Z",
        "endDate" : "2015-12-25T23:00:00.000Z",
        "beginTime" : "2015-12-25T23:00:00.000Z",
        "endTime" : "2015-12-25T23:00:00.000Z",
        "added" : 1450875770123.0000000000000000,
        "owner" : "Yme5qdtndZQxKoRZi",
        "url" : "jour-de-lan-",
        "cover" : "FwmxPN2LPX9NXd8G4"
      },
      {
        "name" : "Jour de l'an !",
        "description" : "Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an !",
        "position" : {
            "lat" : 12.7631071000000134,
            "lng" : 57.8493260999999848
        },
        "public" : false,
        "beginDate" : "2015-12-25T23:00:00.000Z",
        "endDate" : "2015-12-25T23:00:00.000Z",
        "beginTime" : "2015-12-25T23:00:00.000Z",
        "endTime" : "2015-12-25T23:00:00.000Z",
        "added" : 1450875770123.0000000000000000,
        "owner" : "Yme5qdtndZQxKoRZi",
        "url" : "jour-de-lan-",
        "cover" : "FwmxPN2LPX9NXd8G4"
      },
      {
        "name" : "Jour de l'an !",
        "description" : "Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an !",
        "position" : {
            "lat" : 35.7631071000000134,
            "lng" : 8.8493260999999848
        },
        "public" : false,
        "beginDate" : "2015-12-25T23:00:00.000Z",
        "endDate" : "2015-12-25T23:00:00.000Z",
        "beginTime" : "2015-12-25T23:00:00.000Z",
        "endTime" : "2015-12-25T23:00:00.000Z",
        "added" : 1450875770123.0000000000000000,
        "owner" : "Yme5qdtndZQxKoRZi",
        "url" : "jour-de-lan-",
        "cover" : "FwmxPN2LPX9NXd8G4"
      },
      {
        "name" : "Jour de l'an !",
        "description" : "Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an ! Jour de l'an !",
        "position" : {
            "lat" : 43.7631071000000134,
            "lng" : 5.8493260999999848
        },
        "public" : false,
        "beginDate" : "2015-12-25T23:00:00.000Z",
        "endDate" : "2015-12-25T23:00:00.000Z",
        "beginTime" : "2015-12-25T23:00:00.000Z",
        "endTime" : "2015-12-25T23:00:00.000Z",
        "added" : 1450875770123.0000000000000000,
        "owner" : "Yme5qdtndZQxKoRZi",
        "url" : "jour-de-lan-",
        "cover" : "FwmxPN2LPX9NXd8G4"
      }
    ];
    /*for (var i = 0; i < events.length; i++)
      Events.insert( events[i] );*/
  }
});
