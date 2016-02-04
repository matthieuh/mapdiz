/*Meteor.startup(function() {
  if (Meteor.isServer) {
    var loginAttemptVerifier = function(parameters) {
      console.log('loginAttemptVerifier', parameters);

      if (parameters.user && parameters.user.emails && (parameters.user.emails.length > 0)) {
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
      }
    }
    Accounts.validateLoginAttempt(loginAttemptVerifier);
  }
});
*/
