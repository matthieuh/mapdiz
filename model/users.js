Users = Meteor.users


const userProfileSchema = new SimpleSchema({
  firstName: {
    type: String,
    regEx: /^[a-zA-Z-]{2,25}$/,
    optional: true
  },
  lastName: {
    type: String,
    regEx: /^[a-zA-Z]{2,25}$/,
    optional: true
  },
  birthday: {
    type: Date,
    optional: true
  },
  gender: {
    type: String,
    allowedValues: ['Male', 'Female'],
    optional: true
  },
  organization : {
    type: String,
    regEx: /^[a-z0-9A-z .]{3,30}$/,
    optional: true
  },
  avatar: {
    label: "Photo de profil",
    type: String,
    optional: true
  },
  bio: {
    type: String,
    max: 141,
    min: 1,
    optional: true
  }
})

Schema.User = new SimpleSchema({
  username: {
    type: String,
    optional: true,
    regEx: /^[a-z0-9A-Z_]{3,20}$/,
    index: true,
    unique: true
  },
  emails: {
    optional: true,
    type: [Object]
  },
  "emails.$.address": {
    optional: true,
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    optional: true,
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: [String],
    optional: true
  },
  profile: {
    type: userProfileSchema,
    optional: true
  }
});

Users.attachSchema(Schema.User);

if (Meteor.isServer) {
  Meteor.methods({
    sendVerificationEmail: function (login) {
      let user;

      if (login.indexOf('@') > -1) {
        user = Accounts.findUserByEmail(login)
      } else {
        user = Accounts.findUserByUsername(login)
      }

      if (user && user._id) {
        Accounts.sendVerificationEmail(user._id);
      } else {
        throw new Meteor.Error(400, "Email/identifiant introuvable : "+ login);
      }
    }
  });
}
