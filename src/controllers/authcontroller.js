var exports = module.exports = {}

exports.signup = function(req, res, ) {
  //console.log("asdasdsd");
  res.render('signup');

}

exports.signin = function(req, res) {
  // tslint:disable-next-line:no-console
  console.log("signin");
  res.render('signin');

}

exports.dashboard = function(req, res) {

  res.render('dashboard');

}

exports.logout = function(req, res) {
  // remove token
  const TOKEN = req.query.token;
  // tslint:disable-next-line:no-console
  // console.log(TOKEN);
  req.session.destroy(function(err) {
    // remove token
    res.redirect('/');

  });

}
