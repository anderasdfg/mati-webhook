const rp = require('request-promise')

const express = require('express')
const { response } = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('trust proxy', true);


//se configura el puerto 
app.set('port', process.env.PORT || 5000)

app.get('/', (req, res) => res.send(req.body))


app.listen(app.get('port'), () => console.log(`Mati Webhook app listening on port ${app.get('port')}!`))