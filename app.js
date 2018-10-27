const express = require('express');
const path = require('path');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');
const http = require('http');
const {History} = require('./models');
const port = parseInt(config.PORT, 10)
app.set('port', port);
const server = http.createServer(app);

app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  res.render('index');
});

app.post('/history', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { task, result } = req.body;

  if (task && result) {
    try {
      await History.create({
        ip,
        task,
        result
      });
      res.status(200).json({ok: true});
    } catch (error) {
      console.log(error);
      res.status(500).json({ok: false});
    }
  }
});

app.get('/history', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const histories = await History.findAll({
      where: {
        ip
      }
    });
    res.send(histories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ok: false});
  }
});

app.delete('/history', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    await History.destroy({
      where: {
        ip
      }
    });

    res.status(200).send({
      ok: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false
    });
  }
});

server.listen(config.PORT, () => console.log('Listen port *:' + config.PORT));
