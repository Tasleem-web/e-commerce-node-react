require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const app = express();
const config = require("./config/key");
const PORT = process.env.PORT || 5000;
mongoose
  .set('strictQuery', true)
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connected..."))
  .catch((err) => console.error(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(fileUpload({ useTempFiles: true }))

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/api', require('./routes/category'));
app.use('/api', require('./routes/uploads'));
app.use('/api', require('./routes/product'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log('Server is running on this port ' + PORT);
})

module.exports = app;
