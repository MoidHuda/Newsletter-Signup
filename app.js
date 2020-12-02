const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require('dotenv').config();

const app = express();

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: true}));

app.post("/", function(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var options = {
        url: 'https://us17.api.mailchimp.com/3.0/lists/' + process.env.MAILCHIMP_LIST_ID,
        method: "POST",
        headers: {
            "Authorization": "MoidHuda " + process.env.MAILCHIMP_API_KEY
        },
        body: JSON.stringify(data)
    }
    request(options, function(error, response, body){
        if (error) {
            res.sendFile(__dirname + "/failure.html")
        }
        else{
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html")
            }
            else {
                res.sendFile(__dirname + "/failure.html")
            }
        }
    })
})

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000"); 
});

