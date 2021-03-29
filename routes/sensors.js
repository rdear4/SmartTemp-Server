var express = require('express')
var router = express.Router()
const Sensor = require("../models/sensor")

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
