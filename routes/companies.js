
module.exports = function(app){

  var rp = require('request-promise').defaults({simple: false})
  var consultaCnpj = require('consulta-cnpj')
  var data = require('../data/data.js')
  var mongoInstance = require('../libs/connectdb.js')()
  var ObjectId = require('mongodb').ObjectID;

  app.get('/get_cnpj/:cnpj', (req, res) => {

    var cnpj = req.params.cnpj

    var url = 'https://www.receitaws.com.br/v1/cnpj/'+cnpj

    var requestOptions = {
      uri: url,
      resolveWithFullResponse: true
    }

    rp(requestOptions).then((response) => {

      // Recupera a natureza juridica da empresa
      var jsonData = JSON.parse(response.body)

      // var codigoNatureza = jsonData.natureza_juridica.split(' ')[0].trim()

      var nome = jsonData.nome
      var codigoNatureza = jsonData.natureza_juridica
      var porte = ''

      data.forEach((value, index) => {

        // Tenta descobrir o porte da empresa pelo nome
        value.texto.split(';').forEach((value2, item2) => {

          if(nome.split(' ').indexOf(value2) != -1){

            // console.log(nome)
            // console.log(value2)
            // console.log(value.porte)
            // console.log('+++++++++++++++++++')

            if(porte.length == 0){
              porte = value.porte
            }

            return

          }

        })

        // Tenta descobrir o porte da empresa pela natureza juridica
        if(porte == ''){

          // Tenta descobrir o porte da empresa pelo nome
          value.codigo.split(';').forEach((value2, item2) => {

            if(codigoNatureza.split(' ').indexOf(value2) != -1){

              // console.log(codigoNatureza)
              // console.log(value2)
              // console.log(value.porte)
              // console.log('+++++++++++++++++++')

              if(porte.length == 0){
                porte = value.porte
              }

              return

            }

          })
        }

        console.log('*********************')

      })

      var newData = {
        nome,
        codigoNatureza,
        porte
      }

      res.send(newData)

    })

  })

  app.post('/save_cnpj', (req, res) => {

    var cnpj = req.body.cnpj
    var name_company = req.body.name_company
    var type_company = req.body.type_company
    var tags = req.body.tags

    var tags = eval(req.body.tags)
    
    // Envia Tag List para EndPoint do Watson

    var _tagList = ''

    tags.forEach((value, index) => {
      _tagList += value.description + ','
    })

    console.log(_tagList)

    var requestOptions = {
      uri : 'http://offer-box.mybluemix.net/api/offer-box/match-tags?textTag='+_tagList,
      resolveWithFullResponse: true
    }

    rp(requestOptions).then((result) => {

      var body = JSON.parse(result.body)

      var tagId = body.output.text[0]

      // Salva o registro
      var reg = {cnpj, name_company, type_company, tags, tagId}

      mongoInstance.then(function(db){

        const collection = db.collection('companies')

        collection.insertOne(reg, function(err, result){
          
          if(err) throw err
          console.log('1 document inserted')

          res.send('1')

        })

      })

    })

  })


}