/*Meteor.startup(function() {

  process.env.MAIL_URL = 'smtp://mat38140%40gmail.com:Halfway38@smtp.gmail.com:587';

});*/

Meteor.startup(function() {

  // 1. Set up stmp
  smtp = {
    username: 'mapdiz@sandboxc132c738a8f74767b437c93cd7c948e2.mailgun.org',
    password: '25zuzwtd0dd8',
    server:   'smtp.mailgun.org',
    port: 587
 };

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
  console.log('process.env.MAIL_URL', process.env.MAIL_URL);
  // 2. Format the email
  //-- Set the from address
  Accounts.emailTemplates.from = 'postmaster@mapdiz.com ';

  //-- Application name
  Accounts.emailTemplates.siteName = 'Mapdiz';

  //-- Subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirmez votre adrese mail Mapdiz';
  };

  //-- Email text
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Merci de inscription.  S\'il vous plait, veuillez cliquer sur le lien suivant pour confirmer votre adresse e-mail : \r\n' + url;
  };

  // 3.  Send email when account is created
  Accounts.config({
    sendVerificationEmail: true
  });
});
