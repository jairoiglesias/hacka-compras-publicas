
module.exports = function(app){

  var rp = require('request-promise').defaults({simple: false})
  var consultaCnpj = require('consulta-cnpj')
  var data = require('../data/data.js')

  app.get('/', (req, res) => {
    res.send('teste')
  })

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

            console.log(nome)
            console.log(value2)
            console.log(value.porte)
            console.log('+++++++++++++++++++')

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

              console.log(codigoNatureza)
              console.log(value2)
              console.log(value.porte)
              console.log('+++++++++++++++++++')

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

}
