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
        console.log(options.body)
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


app.post('/responsevisa/:purchasenumber/:codigoComercio/:token/:monto/:env', async(req, res) => {
    var success = false
    var purchaseNumber = req.params.purchaseNumber
    var codigoComercio = req.params.codigoComercio
    var tokenSeguridad = req.params.token
    var monto = req.params.monto
    var env = req.params.env
    var content = ''
    var options = {
            method: 'POST',
            uri: config[env].APIEcommerce + codigoComercio,
            headers: {
                'Authorization': tokenSeguridad,
                'Content-Type': 'application/json',
            },
            body: {
                antifraud: null,
                captureType: 'manual',
                channel: 'web',
                countable: true,
                order: {
                    amount: monto,
                    currency: 'PEN',
                    purchaseNumber: purchaseNumber,
                    tokenId: req.body.transactionToken,
                },
                terminalId: '1',
                terminalUnattended: false,
            },
            json: true,
        }
        //Use request-promise module's .then() method to make request calls.
    await rp(options)
        .then(async function(response) {
            success = true
            responseJSON = JSON.stringify(response)
        })
        .catch(function(err) {
            success = false
            responseJSON = JSON.stringify(err)
        })
    let transaction = JSON.parse(responseJSON)
    var style = `<style>*{box-sizing:border-box;margin:0;padding:0}html{background-color:#f6f9fc;font-size:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}main{box-sizing:border-box;display:grid;place-items:center;margin:5vh auto 17vh auto;height:60vh}.container{padding:5rem;border-radius:.6rem;border:#2ca2eb .1rem solid}.title{border-radius:.6rem;padding:.6rem;background-color:#2ca2eb;text-align:center;font-weight:700;margin-bottom:2rem;font-size:2rem}P{padding:.3rem;font-weight:400;font-size:1.4rem}.btnBlue{padding:1rem 3rem 1rem 3rem;}.small{padding-top:1rem;text-align:center;font-size:1rem}.colums{column-count:2}.right{text-align:right}.left{text-align:left}.btnBlue{text-decoration:none;align-self:center;text-align:center;background-color:#2ca2eb;border-radius:.6rem;border:0 solid;padding:.6rem;color:#000;cursor:pointer}.btnBlue:hover{background-color:#e1ecf4;color:#2ca2eb}.instruction{margin-bottom:0;padding-bottom:0}</style>`
    if (success) {
        content = `<div class="colums">
                        <div class="right">
                            <p><b>Orden: </b></p>
                            <p><b>Nombre del cliente: </b></p>
                            <p><b>Tarjeta: </b></p>
                            <p><b>Medio de pago: </b></p>
                            <p><b>Monto (S/.): </b></p>
                            <p><b>Fecha y hora: </b></p>
                            <p><b>Descripción: </b></p>
                        </div>
                        <div class="left">
                            <p>${transaction.order.purchaseNumber}</p>
                            <p>${client}</p>
                            <p>${transaction.dataMap.CARD}</p>
                            <p>${transaction.dataMap.BRAND.toUpperCase()}</p>
                            <p>${transaction.dataMap.AMOUNT} </p>
                            <p>${transaction.dataMap.TRANSACTION_DATE}</p>
                            <p>Aprobado</p>
                        </div>
                    </div>`
        var responseHTML = `<main>
                            <div class="container">
                                <div>
                                    <p class="title">Pago satisfactorio 👍</p>
                                </div>
                                ${content}
                                <div class="small">                                
                                    <a href="${config[env].return}" class="btnBlue" >Finalizar</a>
                                    <p class="small">
                                        <p class="small"><b class="instruction">IMPORTANTE: Presione finalizar para concretar la transacción.</b></p> Esta tienda está autorizada por Visa para realizar transacciones electrónicas.
                                        </br>Copyright 2020 © <a target="_blank" href="https://www.lolimsa.com.pe/">LOLIMSA</a></p>
                                </div>
                            </div>
                        </main> ${style}`
    } else {
        content = `<div class="colums">
                        <div class="right">
                            <p><b>Orden: </b></p>
                            <p><b>Nombre del cliente: </b></p>
                            <p><b>Tarjeta: </b></p>
                            <p><b>Medio de pago: </b></p>
                            <p><b>Monto (S/.): </b></p>
                            <p><b>Descripción: </b></p>
                        </div>
                        <div class="left">
                            <p>${transaction.options.body.order.purchaseNumber}</p>
                            <p>${client}</p>
                            <p>${transaction.response.body.data.CARD}</p>
                            <p>${transaction.response.body.data.BRAND.toUpperCase()}</p>
                            <p>${transaction.response.body.data.AMOUNT} </p>
                            <p>${transaction.response.body.data.ACTION_DESCRIPTION}</p>
                        </div>
                    </div>`
        var responseHTML = `<main>
                            <div class="container">
                                <div>
                                    <p class="title">Pago rechazado 👎</p>
                                </div>
                                ${content}
                                <div class="small">
                                <a href="${config[env].return}" class="btnBlue" >Finalizar</a>
                                    <p class="small">
                                        <p class="small"><b class="instruction">IMPORTANTE: Presione finalizar para intentar nuevamente.</b></p> Esta tienda está autorizada por Visa para realizar transacciones electrónicas.
                                        </br>Copyright 2020 © LOLIMSA </p>
                                </div>
                            </div>
                        </main> ${style}`
    }
    var body = success + '|' + JSON.stringify(transaction)
        //await 
    sendResponse(body)
    res.send(responseHTML)
})


function sendResponse(body) {
    var responseJSON = ''
    var options = {
        method: 'POST',
        uri: 'http://200.121.128.122:8010/LOLIMSASER/rest/recepcion',
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            Request: body
        },
        json: true,
    }

    //await 
    rp(options)
        .then(async function(response) {
            responseJSON = JSON.stringify(response)
        })
        .catch(function(err) {
            success = false
            responseJSON = JSON.stringify(err)
        })
}


app.listen(app.get('port'), () => console.log(`Webhook app listening on port ${app.get('port')}!`))