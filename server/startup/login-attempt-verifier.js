Meteor.startup(function() {
  if (Meteor.isServer) {
    var loginAttemptVerifier = function(parameters) {
      if (parameters.user && parameters.user.emails && (parameters.user.emails.length > 0)) {
        // return true if verified email, false otherwise.
        var found = _.find(
          parameters.user.emails,
          function(thisEmail) { return thisEmail.verified }
        );

        if (!found) {
          throw new Meteor.Error(500, 'We sent you an email.');
        }
        return found && parameters.allowed;
      } else {
        console.log("user has no registered emails.");
        return false;
      }
    }
    Accounts.validateLoginAttempt(loginAttemptVerifier);
  }
});
