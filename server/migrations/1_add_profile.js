Migrations.add({
  version: 1,
  up () {
    Users.find().forEach(user => {
      let profile = {};
      profile.avatar = user.avatar;

      Users.update(user, {$set: {
        profile: profile
      }})
    })
  }
})
