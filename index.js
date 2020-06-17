require('dotenv').config({path: __dirname + '/.env'})

const NEXMO_API_KEY = process.env.NEXMO_API_KEY
const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET
const TO_NUMBER = process.env.NEXMO_TO_NUMBER
const NEXMO_FROM_NUMBER = process.env.NEXMO_FROM_NUMBER

const bodyParser = require('body-parser')

const Nexmo = require('nexmo')
const path = require('path')
const express = require('express');
const app = require('express')();
const cors = require('cors');
app.use(cors())

const nexmo = new Nexmo({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET
})
const from = NEXMO_FROM_NUMBER
const to = TO_NUMBER
const text = 'I need blood plasma for a patient. Can you please help? If you want to respond to this chat, please login to www.plasmadonors.com'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname+'/public'));

app
  .route('/onehack')
  .get(handleInboundSms)
  .post(handleInboundSms)

  app
  .route('/sms')
  .post(handleOutboundSms)

  //outbound sms

  function handleOutboundSms(request, response) {
    request.body.text = request.body.text + text;
     nexmo.message.sendSms(447451288842, request.body.phone, request.body.text, (err, responseData) => {
         if (err) {
             console.log(err);
         } else {
             if(responseData.messages[0]['status'] === "0") {
                 console.log("Message sent successfully.");
             } else {
                 console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
             }
         }
       
     })
     response.send('OK');
   }

  function handleInboundSms(request, response) {
   /* const params = Object.assign(request.query, request.body)
    console.log(params)
    response.status(204).send()*/
    nexmo.message.sendSms(447451288842, 447460301777, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
      
    })
    response.send('OK');
  }
  /*app.get('/', function (req, res) {
    res.send('hello world')
  })*/
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
  app.listen(process.env.PORT || 3000)
