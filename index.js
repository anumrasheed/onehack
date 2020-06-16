const config = require('./config.json')
const Nexmo = require('nexmo');
const Airtable = require('airtable');
const base = new Airtable({ apiKey: config.AIRTABLE_KEY }).base('tbl8VpCGkuS1UatAY');
const app = require('express')();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const nexmo = new Nexmo({
    apiKey: config.NEXMO_KEY,
    apiSecret: config.NEXMO_SECRET,
    applicationId: config.NEXMO_APPLICATION_ID,
    privateKey: './private.key'
})

app.post('/inbound', (req, res) => {

    console.log(JSON.stringify(req.body));

    base('Messages').select({
        filterByFormula: `Number=${msisdn}`
    }).eachPage(records => {
        if (records.length == 0) {
            createUser(text, msisdn)
        } else {
            createMessage(text, records[0].fields.Number[0])
        }
    });

    function createUser(message, msisdn) {
        base('Numbers').create({
            Number: msisdn
        }, (err, record) => {
            if (err) { console.error(err); return; }
            createMessage(message, record.getId())
        })
    }

    function createMessage(message, numberId) {
        base('Messages').create({
            Message: message,
            Number: [numberId]
        }, err => {
            if (err) { console.error(err); return; }
            nexmo.channel.send(
                { "type": "sms", "number": msisdn },
                { "type": "sms", "number": 12024489672 },
                { "content": { "type": "text", "text": "Thank you for getting in touch. We will ring you back as soon as possible." } },
                nexmoErr => {
                    if(nexmoErr) { console.error(err); return; } 
                }
            ), 
            res.status(200).end();
        })
    }
})

app.listen(3000);