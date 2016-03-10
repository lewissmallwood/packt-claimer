var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var urlImported = require('url');

const PORT = 80;
http.createServer(handleRequest).listen(PORT);

function handleRequest(req, response) {
      var loginDetails = {
          email: "",
          password: "",
          op: "Login",
          form_id: "packt_user_login_form",
          form_build_id: ""
      };

      var url = 'https://www.packtpub.com/packt/offers/free-learning';
      var loginError = 'Sorry, you entered an invalid email address and password combination.';
      var getBookUrl;
      var bookTitle;

      // Take the email and password for Packt via a very unsecure GET request and use it.
      var query = urlImported.parse(req.url, true).query;
      loginDetails.email = query.email;
      loginDetails.password = query.password;

      // We need cookies for that, therefore let's turn JAR on
      request = request.defaults({
          jar: true
      });

      console.log('----------- Packt Grab Started -----------');

      request(url, function(err, res, body) {
          if (err) {
              console.error('Request failed');
              console.log('----------- Packt Grab Done --------------');
              return;
          }

          var $ = cheerio.load(body);
          getBookUrl = $("a.twelve-days-claim").attr("href");
          bookTitle = $(".dotd-title").text().trim();
          var newFormId = $("input[type='hidden'][id^=form][value^=form]").val();

          if (newFormId) {
              loginDetails.form_build_id = newFormId;
          }

          request.post({
              uri: url,
              headers: {
                  'content-type': 'application/x-www-form-urlencoded'
              },
              body: require('querystring').stringify(loginDetails)
          }, function(err, res, body) {
              if (err) {
                  console.error('Login failed');
                  console.log('----------- Packt Grab Done --------------');
                  return;
              };
              var $ = cheerio.load(body);
              var loginFailed = $("div.error:contains('"+loginError+"')");
              if (loginFailed.length) {
                  console.error('Login failed, please check your email address and password.');
                  console.log('----------- Packt Grab Done --------------');
                  return;
              }

              request('https://www.packtpub.com' + getBookUrl, function(err, res, body) {
                  if (err) {
                      console.error('Request Error');
                      console.log('----------- Packt Grab Done --------------');
                      return;
                  }

                  var $ = cheerio.load(body);

                  console.log('Book Title: ' + bookTitle);
                  console.log('Claim URL: https://www.packtpub.com' + getBookUrl);
                  console.log('----------- Packt Grab Done --------------');
              });
          });
      });

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('It Works!! Path Hit: ' + req.url + '\n');
}
