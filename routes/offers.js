
module.exports = function(app){

  var rp = require('request-promise').defaults({simple: false})
  var consultaCnpj = require('consulta-cnpj')
  var data = require('../data/data.js')
  var mongoInstance = require('../libs/connectdb.js')()
  var ObjectId = require('mongodb').ObjectID;

  app.get('/', (req, res) => {
    res.send('teste')
  })

  app.get('/list_offers_by_product/:product', (req, res) => {

    var product = req.params.product

    mongoInstance.then(function(db){

      const collection = db.collection('offers')

      if(product == 'all'){
        collection.find({}).toArray(function(err, result){
          if(err) throw err
          console.log(result)
          res.send(result)
        })

      }
      else{
        collection.find({product: product}).toArray(function(err, result){
          if(err) throw err
          console.log(result)
          res.send(result)
        })

      }

    })

  })

  app.get('/list_offers_by_id/:id', (req, res)=>{

    var id = req.params.id

    mongoInstance.then(function(db){

      const collection = db.collection('offers')
      
      collection.find({_id: ObjectId(id)}).toArray(function(err, result){
        if(err) throw err
        console.log(result)
        res.send(result[0])
      })

    })

  })

  app.post('/update_interested_offer', (req, res) => {

    var id = req.body.id
    var interested = req.body.interested

    mongoInstance.then(function(db){

      const collection = db.collection('offers')
      
      collection.update({"_id": ObjectId(id)}, {$set: {interested: interested}}, function(err, result){
        if(err) throw err
        console.log(result)
        res.send('1')
      })

    })

  })



}
