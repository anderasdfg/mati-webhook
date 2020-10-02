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


app.post('/', (req, res) => {
    console.log("Response:" + req.body.data)
    res.send(req.body)
})


app.post('/webhook', (req, res) => {
    var data = req.body
    console.log(JSON.stringify(data))
    res.send(JSON.stringify(data))
})


app.listen(app.get('port'), () => console.log(`Mati Webhook app listening on port ${app.get('port')}!`))