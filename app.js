require('dotenv').config();


const express =require('express');
const got =require('got');
const https= require('https');




const app=express();

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});



app.post("/", function(req, res){
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email= req.body.emailId;
    const data= {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                  FNAME:firstName,
                  LNAME:lastName
                }
            }
        ]
    }

    const jsondata = JSON.stringify(data);

    const apiKey=process.env.API_KEY;
    const listId=process.env.LIST_ID;


    const url ="https://us10.api.mailchimp.com/3.0/lists/"+listId;
    const options={
        method: "POST",
        auth: apiKey
    }



   const request= https.request(url, options, function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });


    request.write(jsondata);
    request.end();
});


app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(3000, function(req, res){
    console.log("server started on port 3000");
});
