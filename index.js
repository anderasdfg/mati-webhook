const rp = require('request-promise')
const bodyParser = require('body-parser')
const express = require('express')
const { response } = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('trust proxy', true);


//se configura el puerto 
app.set('port', process.env.PORT || 5000)

app.get('/', (req, res) => res.send(req.body))

app.post('/webhook', (req, res) => {
    var responseJSON = ''
    var data = req.body
    var eventName = req.body.eventName
    if (eventName == 'verification_completed') {
        var options = {
            method: 'POST',
            uri: 'http://200.121.128.122:8010/LOLIMSASERx/rest/webhook',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                Request: JSON.stringify(data)
            },
            json: true,
        }

        rp(options)
            .then(function(response) {
                responseJSON = JSON.stringify(response)
                console.log(responseJSON)
            })
            .catch(function(err) {
                success = false
                responseJSON = JSON.stringify(err)
            })
    }
    console.log("HEY: " + responseJSON)
    res.send(JSON.stringify(data))
})


app.listen(app.get('port'), () => console.log(`Mati Webhook app listening on port ${app.get('port')}!`))