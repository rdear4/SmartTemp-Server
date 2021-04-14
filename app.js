var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var mongoose = require('mongoose')
var dbConn = require('./dbConnection')

const Reading = require('./models/reading')
const Sensor = require('./models/sensor')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sensorsRouter = require('./routes/sensors')
var readingsRouter = require("./routes/readings")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/sensors', sensorsRouter)
app.use('/api/readings', readingsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Update the status of the sensors every 10 seconds
const sensorsUpdateTimer = setInterval(() => {

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
      console.log("There was an error updating the status of the sensors")
      console.log(err)
      return
    }

    for (let sensor of docs) {

      let status = (new Date().getTime() - new Date(sensor.most_recent[0].timestamp).getTime() > (3 * 60 * 1000)) ? "Offline" : "Online"

      if (status === "Offline" && sensor.status !== "Offline") {

        console.log(`Updating ${sensor._id} to show as offline`)

        Sensor.updateOne({"_id": sensor._id}, { $set: { "status": "Offline"}}, (err) => {

          if (err) {
            console.log("There was an error updating the status")
          } else {
            console.log(`Sensor ${sensor._id} set to offline`)
          }
        })

      } if (sensor.status === "Offline" && status === "Online") {

        Sensor.updateOne({"_id": sensor._id}, { $set: { "status": "Online"}}, (err) => {

          if (err) {
            console.log("There was an error updating the status")
          } else {
            console.log(`Sensor ${sensor._id} set to offline`)
          }
        })

      }
      

    }
    
  })

}, 5000)

module.exports = app;
