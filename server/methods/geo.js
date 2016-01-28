Meteor.methods({
  'geoip': function() {
    var ip = this.connection.clientAddress;
    console.log('ip', ip);
    GeoIP = Meteor.npmRequire('geoip-lite');
    console.log('GeoIP.lookup(ip)', GeoIP.lookup(ip));
    return GeoIP.lookup(ip);
  }
});
