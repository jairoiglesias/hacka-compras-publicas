
module.exports = function(app){

  var rp = require('request-promise').defaults({simple: false})
  var consultaCnpj = require('consulta-cnpj')
  var data = require('../data/data.js')
  var mongoInstance = require('../libs/connectdb.js')()
  var ObjectId = require('mongodb').ObjectID;

  app.post('/save_bidding', (req, res) => {

    mongoInstance.then(function(db){

      var product = req.body.product
      var qtd = req.body.qtd
      var lat = req.body.lat
      var lng = req.body.lng
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
        var reg = {product, qtd, lat, lng, tags, tagId}

        const collection = db.collection('biddings')

        collection.insertOne(reg, function(err, result){
          
          if(err) throw err
          console.log('1 document inserted')

          res.send('1')

        })

      })

    })

  })

  app.get('/list_bidding_by_product/:product', (req, res) => {

    var product = req.params.product

    mongoInstance.then(function(db){

      const collection = db.collection('biddings')

      if(product == 'all'){
        collection.find({}).toArray(function(err, result){
          if(err) throw err
          console.log(result)
          res.send(result)
        })
      }
      else{
        collection.find({product : product}).toArray(function(err, result){
          if(err) throw err
          console.log(result)
          res.send(result)
        })
      }

    })

  })

  app.get('/list_bidding_by_cnpj/:cnpj', (req, res) => {

    var cnpj = req.params.cnpj

    mongoInstance.then(function(db){

      var collection = db.collection('companies')

      // Efetua a pesquisa de empresa para regurar o TagId

      collection.findOne({cnpj:cnpj}, function(err, result){

        var tagId = result.tagId

        collection = db.collection('biddings')

        collection.find({tagId:tagId}).toArray(function(err, result){

          res.send(result)

        })

      })

    })

  })

 }