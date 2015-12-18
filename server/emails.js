/*Meteor.startup(function() {

  process.env.MAIL_URL = 'smtp://mat38140%40gmail.com:Halfway38@smtp.gmail.com:587';

});*/

Meteor.startup(function() {

  // 1. Set up stmp
  smtp = {
    username: 'mat38140@gmail.com',
    password: 'Halfway38',
    server:   'smtp.gmail.com',
    port: 587
 };

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

  // 2. Format the email
  //-- Set the from address
  Accounts.emailTemplates.from = 'My_Name ';

  //-- Application name
  Accounts.emailTemplates.siteName = 'My_App';

  //-- Subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirm Your Email Address for My_App';
  };

  //-- Email text
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Thank you for registering.  Please click on the following link to verify your email address: \r\n' + url;
  };

  // 3.  Send email when account is created
  Accounts.config({
    sendVerificationEmail: true
  });
});
