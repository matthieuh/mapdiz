Meteor.startup(function() {
  if (Meteor.isServer) {
    var loginAttemptVerifier = function(parameters) {

      if (parameters.user && parameters.user.services && parameters.user.services.facebook) {
        Users.update(parameters.user._id, {$set: { "emails.0.verified" : true }});
        if (parameters.user.services.facebook.email) {
          Users.update(parameters.user._id, {$set: { "emails.0.address" : parameters.user.services.facebook.email }});
        }
      }

      return true;

      /*if (parameters.user && parameters.user.emails && (parameters.user.emails.length > 0)) {
        // return true if verified email, false otherwise.
        var found = _.find(
          parameters.user.emails,
          function(thisEmail) { return thisEmail.verified }
        );

        if (!found) {
          throw new Meteor.Error(500, 'UNVERIFIED_EMAIL');
        }
        return true;
      } else {
        console.log("user has no registered emails.");
        return true;
      }*/
    }
    Accounts.validateLoginAttempt(loginAttemptVerifier);
  }
});

