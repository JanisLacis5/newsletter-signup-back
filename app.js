const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
 
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");
});
client.setConfig({
    apiKey: "18f5bbf542101bb7f444729c88d00db4-us17",
    server: "us17",
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fisrtName;
    const lastName = req.body.lastName;
    const email = req.body.email;


    const run = async () => {
        try {
            const response = await client.lists.addListMember("b7e13880a0", {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            });
            console.log(response);;
            res.sendFile(__dirname + "/success.html");
        } catch(e) {
            console.log("====== ERROR ======");
            console.log(JSON.parse(e.response.error.text).detail);
            res.sendFile(__dirname + "/failiure.html");
        }
    }
    run();
}); 