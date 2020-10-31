const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const { bookmarks } = require('../store');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, rating, description } = req.body;

    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send('Title is required');
    }

    if (!url) {
      logger.error(`URL is required`);
      return res.status(400).send('URL is required');
    }

    if (!rating) {
      logger.error(`Rating is required`);
      return res.status(400).send('Rating is required');
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      description,
      rating,
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((b) => b.id == id);

    // make sure we found a bookmark
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send('Bookmark Not Found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex((b) => b.id === id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send('Bookmark Not Found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);

    res.status(204).end();
  });

module.exports = bookmarksRouter;
