var express = require('express')
var router = express.Router()
const moment = require('moment')

const Reading = require("../models/reading")


router.get('/', (req, res) => {

    Reading.find({}, (err, readings) => {

        if (err) {
            res.status(500)
            res.send("There was an error retrieving all the readings from the db")
            console.log(err);
            return
        }

        res.json(readings)
    })
})

router.post("/", (req, res) => {

  // console.log(req.body)
  let readingData = {...req.body}
  delete readingData.test

  let newReading = new Reading(readingData)
    // console.log(newReading)
  newReading.save(err => {

    if (err) {
      res.status(500)
      res.send(`There was an error adding the reading to the DB. ERR: ${err}`)
      return
    }

    res.send("Reading logged")
    
  })

})

//db.readings.aggregate([{ $match: { timestamp : { $gt: new Date(new Date().getTime() - 1000 * 80) } } }, { $group: { _id: null, temp: { $avg: "$temperature"}, humidity: { $avg: "$humidity" }, sensors: { $sum: 1 }}} ])

router.get('/current', (req, res) => {

  try {
    Reading.aggregate()
    .match({
      timestamp: { $gt: new Date(new Date().getTime() - 1000 * 70)}
    })
    .group({
      _id: null,
      temperature: { $avg: "$temperature" },
      humidity: { $avg: "$humidity" },
      sensors: { $sum: 1}
    })
    .exec((err, docs) => {
  
      res.json(docs)

    })
  } catch (err) {
    res.status(500)
    res.json({
      err: err,
      errMsg: `There was an error finding the most recent readings`
    })
  }
  
})

// router.get('/current', (req, res) => {

//   try {
//     Reading.aggregate().group({
//       _id: "$sensorId",
//       temperature: { $last: "$temperature" },
//       humidity: { $last: "$humidity" }
//     })
//     .exec((err, docs) => {
  
//       res.json(docs)

//     })
//   } catch (err) {
//     res.status(500)
//     res.json({
//       err: err,
//       errMsg: `There was an error finding the most recent readings`
//     })
//   }
  
// })

router.get('/sensor/:id', (req, res) => {

  let startTime = (req.query.hours !== undefined) ? moment().subtract(parseInt(req.query.hours), 'hours').toString() : moment("2010-1-1").toString()

  // console.log(`Start Time: ${startTime}`);


  Reading.find({ $and: [{"sensorId": req.params.id}, { "timestamp": { $gte: startTime}}]}, (err, readings) => {

    if (err) {
      res.status(500);
      res.json({
        error: err,
        errMsg: `There was an error getting the readings for sensor with id: ${req.params.id}`
      })
      return
    }

    
    let returnReadings = readings.map((r, i) => {

      let reading = r.toJSON()
      reading.timestamp = moment(reading.timestamp)
      return reading

    })

    // console.log(returnReadings.length)
    
    res.json(returnReadings)

  })

})


module.exports = router;
