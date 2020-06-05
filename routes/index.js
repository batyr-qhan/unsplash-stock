const express = require('express');

const fetch = require('node-fetch');
const { toJson } = require('unsplash-js');
const Unsplash = require('unsplash-js').default;

const Photo = require('../models/photoSchema');
const Url = require('../models/urlSchema');

global.fetch = fetch;

const unsplash = new Unsplash({
  accessKey: 'QqpHhb7OaoMiq91Yz3_TPX6G7_y11KgjrT4rG6tkqfQ',
});

const router = express.Router();

/* GET home page. */
unsplash.photos
  .listPhotos(2, 15, 'latest')
  .then(toJson)
  .then((json) => {
    router.get('/', (req, res, next) => {
      // console.log(json);
      res.render('index', { title: 'Express', data: json });
    });
  });

router.post('/:id', (req, res, next) => {
  const photo = new Photo({
    id: req.body.photoId,
    photoURL: req.body.photoURL,
    author: req.body.photoAuthor,
  });
  photo
    .save()
    .then((item) => {
      res.redirect(`/${req.params.id}`);
    })
    .catch((err) => {
      res.status(400).send('unable to save to database');
    });
});

router.get('/search', (req, res, next) => {
  // console.log(req.body.photo);
  unsplash.search
    .photos(req.query.photo, 1, 10, { orientation: 'portrait' })
    .then(toJson)
    .then((json) => {
      Url.findOne({ keyWord: req.query.photo }).then((item) => {
        if (item === null) {
          const url = new Url({
            url: `http://localhost:3000/search?photo=${req.query.photo}`,
            keyWord: req.query.photo,
          });
          url.save();
        } else {
          console.log('found');
        }
      });
      res.render('search', { data: json });
    });
});

router.get('/favorite', async (req, res, next) => {
  const allPhotos = await Photo.find({});
  // res.send(allData)
  // console.log(allPhotos);
  res.render('favorite', { title: 'Express', data: allPhotos });
});

router.delete('/favorite', async (req, res) => {
  await Photo.deleteOne({ _id: req.body.photoToDelete }, (err, result) => {
    if (err) return console.log(err);
    res.redirect('/favorite');
  });
});

router.get('/history', async (req, res, next) => {
  const allUrls = await Url.find({});
  // res.send(allData)
  console.log(allUrls);
  res.render('history', { title: 'Express', data: allUrls });
});

router.delete('/history', async (req, res) => {
  await Url.remove({}, (err, result) => {
    if (err) return console.log(err);
    res.redirect('/history');
  });
});

router.get('/:id', (req, res) => {
  unsplash.photos
    .getPhoto(req.params.id)
    .then(toJson)
    .then((json) => {
      res.render('photo', { data: json });
    });
});

router.get('/history', async (req, res, next) => {
  const allUrls = await Url.find({});
  // res.send(allData)
  console.log(allUrls);
  res.render('history', { title: 'Express', data: allUrls });
});

module.exports = router;
