const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();

// Allows you to use static resources relative to public folder.
// For example see signup.html where we use images/lego.jpeg for our signup logo
app.use(express.static("public"));
// Use the urlencoded option to access values sent in forms,
// extended true means you can post nested objects??
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  // console.log(firstName, lastName, email);
  // send params to mail chimp

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  var jsonData = JSON.stringify(data);

  var options = {
    url : "https://us4.api.mailchimp.com/3.0/lists/77ef7d8ce3",
    method: "POST",
    headers: {
      "Authorization" : process.env.USERNAME + " " + process.env.API_KEY
    },
    body: jsonData
  };

  request(options, function(error, response, body){
    if(error){
      res.sendFile(__dirname + "/failure.html");

    }else{
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }else{
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure", function(req, res){
  // Redirect to home route after clicking on 'Try Again' button
  // It will trigger the app.get("/") and send signup page.
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on 3000");
});
