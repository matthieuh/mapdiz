Accounts.onCreateUser((opts, user) => {;
  user.profile = opts.profile;
  user.roles = [];
  return user;
});
