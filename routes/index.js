const express = require('express');

const fetch = require('node-fetch');
const { toJson } = require('unsplash-js');
const Unsplash = require('unsplash-js').default;

const Photo = require('../models/photoSchema');
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
    .photos(req.body.photo, 1, 10, { orientation: 'portrait' })
    .then(toJson)
    .then((json) => {
      // console.log(json);
      res.render('search', { data: json });
    });
});

router.get('/favorite', async (req, res, next) => {
  const allPhotos = await Photo.find({});
  // res.send(allData)
  // console.log(allPhotos);
  res.render('favorite', { title: 'Express', data: allPhotos });
});

router.get('/:id', (req, res) => {
  unsplash.photos
    .getPhoto(req.params.id)
    .then(toJson)
    .then((json) => {
      res.render('photo', { data: json });
    });
});

module.exports = router;
