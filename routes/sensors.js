var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')
const Sensor = require("../models/sensor")
const Reading = require("../models/reading")

router.get('/', function(req, res, next) {
  
  Sensor.find({}, (err, sensors) => {

    if (err) {
      res.status(500)
      res.send("There was an error getting all the sensors from the db")
      console.log(err)
      return
    }

    res.json(sensors)
    
  })
});

//db.sensors.aggregate([{$lookup: { from: "readings", as: "most_recent", let : { id: "$_id"}, pipeline: [{ $match: { $expr: { $eq: ["$sensorId", "$$id"]}}},{ $limit: 1}]}}])
router.get("/status", (req, res) => {
  
  Sensor.aggregate()
  .lookup({
    from: Reading.collection.name,
    as: "most_recent",
    let: {sId: "$_id"},
    pipeline: [
      { $match: {
        $expr: {
          $eq: ["$sensorId", "$$sId"]
        }}
      },
      { $sort: { "timestamp": -1}},
      { $limit: 1}
    ]
  })
  .exec((err, docs) => {

    if (err) {
      console.log("There was an ERROR!")
      console.log(err)
      return
    }

    res.json(docs)
    
  })

})

router.put('/:id', (req, res) => {

  Sensor.updateOne({"_id": req.params.id}, { $set: req.body}, (err, sensor) => {

    if (err) {
      res.status(500)
      res.send("There was an error updating the sensor")
      return
    }

    res.json(sensor)

  })

})

router.delete('/:id', (req, res) => {

  Sensor.remove({"_id": req.params.id}, (err) => {

    if (err) {
      res.status(500)
      res.send("There was an error removing that sensor from the DB")
      return
    }

    res.send("Sensor successfully removed")

  })

})

router.get('/:id', (req, res) => {

  Sensor.findOne({"_id": req.params.id}, (err, sensor) => {

    if (err) {
      res.status(500)
      res.json({
        err: err,
        errMsg: `There was an error get data for sensor with id: ${req.params.id} from the db`
      })
      return
    }

    res.json(sensor)
    
  })
})

router.get("/all", (req, res) => {

  Sensor.find({}, (err, sensors) => {

    if (err) {

      console.log(err)
      res.send("There was an error getting all the sensors from the DB")
      return
    }

    res.json(sensors)

  })
})


router.post("/new", (req, res) => {

  console.log(req.body)

  let newSensor = new Sensor(req.body)

  console.log(newSensor)
  newSensor.save(err => {

    if (err) {
      res.status(500)
      console.log(err)
      res.send(`There was an error adding the sensor to the DB. ERR: ${err}`)
      return
    }

    res.json(newSensor)
    
  })
  // res.send("TEST")

})


module.exports = router;
