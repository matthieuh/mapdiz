Meteor.methods({
  sendVerificationEmail: function (login) {
    let user;

    if (login && login.indexOf('@') > -1) {
      user = Accounts.findUserByEmail(login);
    } else {
      user = Accounts.findUserByUsername(login);
    }

    if (user && user._id) {
      Accounts.sendVerificationEmail(user._id);
    } else {
      throw new Meteor.Error(400, "Email/identifiant introuvable : "+ login);
    }
  }
});
