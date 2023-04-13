const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// allows to get data from the main html file
app.get("/", function(req ,res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const FirstName = req.body.FName;
    const LastName = req.body.LName;
    const Email = req.body.email;

    const data = {
        members: [
            {
                email_address: Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: FirstName,
                    LNAME: LastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data); //convert data into json string format

    const url = "https://us9.api.mailchimp.com/3.0/lists/cbea2534c0"; //url for accessing mailchimp platform service
    
    const options = {
        method: "POST",
        auth: process.env.API_KEY
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data)); //convert data into json format
        })
    })

    request.write(jsonData);
    request.end();
});

// will redirect to home page if sing up fails
app.post("/failure", function(req, res) {
    res.redirect("/");
})

// testing statement
app.listen(3000, function() {
    console.log("Server is running on port 3000");
});

// API Key
// 5049899fffec0f3c1ed55dfd6031e6db-us9 

// List Id
// cbea2534c0