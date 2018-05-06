
module.exports = function(app){

  var rp = require('request-promise').defaults({simple: false})
  var consultaCnpj = require('consulta-cnpj')
  var data = require('../data/data.js')
  var mongoInstance = require('../libs/connectdb.js')()
  var ObjectId = require('mongodb').ObjectID;

  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //:::                                                                         :::
  //:::  This routine calculates the distance between two points (given the     :::
  //:::  latitude/longitude of those points). It is being used to calculate     :::
  //:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
  //:::                                                                         :::
  //:::  Definitions:                                                           :::
  //:::    South latitudes are negative, east longitudes are positive           :::
  //:::                                                                         :::
  //:::  Passed to function:                                                    :::
  //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
  //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
  //:::    unit = the unit you desire for results                               :::
  //:::           where: 'M' is statute miles (default)                         :::
  //:::                  'K' is kilometers                                      :::
  //:::                  'N' is nautical miles                                  :::
  //:::                                                                         :::
  //:::  Worldwide cities and other features databases with latitude longitude  :::
  //:::  are available at https://www.geodatasource.com                          :::
  //:::                                                                         :::
  //:::  For enquiries, please contact sales@geodatasource.com                  :::
  //:::                                                                         :::
  //:::  Official Web site: https://www.geodatasource.com                        :::
  //:::                                                                         :::
  //:::               GeoDataSource.com (C) All Rights Reserved 2017            :::
  //:::                                                                         :::
  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  var getDistanceV2 = function (lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }

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

  app.post('/get_distance_offer', (req, res) => {

    var lat = req.body.lat
    var lng = req.body.lng
    var id_bidding = req.body.id_bidding

    mongoInstance.then(function(db){

      var collection = db.collection('biddings')

      collection.findOne({_id: ObjectId(id_bidding)}, function(err, result){

        res.send(result)

      })

    })

    // var distance = getDistanceV2(lat1, lng1, lat2, lng2, 'K')

  })

  app.post('/save_offer', (req, res) => {

    var price_unit = req.body.price_unit
    var id_company = req.body.id_company
    var id_bidding = req.body.id_bidding
    var lat = req.body.lat
    var lng = req.body.lng

    var collection = ''

    mongoInstance.then(function(db){

      // Recupera dados de empresa
      collection = db.collection('companies')

      collection.findOne({cnpj: id_company}, function(err, resultCompany){

        var name_company = resultCompany.name_company
        var type_company = resultCompany.type_company

        // Recupera dados de licitação

        collection = db.collection('biddings')

        collection.findOne({_id: ObjectId(id_bidding)}, function(err, resultBidding){

          var product = resultBidding.product
          var lat2 = resultBidding.lat
          var lng2 = resultBidding.lng

          // Calcula a diferenca de Lat/Lng

          var distance = getDistanceV2(lat, lng, lat2, lng2, 'K')

          var reg = {price_unit, id_company, id_bidding, lat, lng, name_company, type_company, product, distance}

          collection = db.collection('offers')

          collection.insertOne(reg, function(err, result){

            console.log(result)
            res.send('1')

          })

        })

      })

    })



  })



}
