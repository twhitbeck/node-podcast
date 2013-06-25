var express = require('express');
var rss = require('./rss');
var winston = require('winston');

var app = express();

app.get('/audio/:book/:chapters', function(req, res) {
  var book = req.params.book;
  var chapters = req.params.chapters.split('-');

  if (chapters.length == 1) {
  } else if (chapters.length == 2) {
    var first = parseInt(chapters[0]);
    var second = parseInt(chapters[1]);

    if (isNaN(first) || isNaN(second)) {
      winston.error('One of the chapter numbers was not a number :(');
      res.writeHead(400, 'Bad request: Nonnumber chapter number');
      res.end();

      return;
    }

    if (first >= second) {
      winston.error('The second chapter number was lower than the first');
      res.writeHead(400, 'Bad request: Chapter numbers not in increasing order');
      res.end();

      return;
    }
  } else {
    winston.error('More than 2 chapter numbers specified');
    res.writeHead(400, 'Bad request: Wrong number of chapter numbers');
    return;
  }

  res.send('Here is ' + book + ' ' + req.params.chapters);
});

app.get('/feed.xml', function(req, res) {
  res.setHeader('Content-Type', 'application/rss+xml');
  res.send(getFeedXml());
});

app.listen(80);

function getFeedXml() {
  var feed = new rss({
    title: 'Hello RSS',
    description: 'RSS Feed Thing',
    author: 'Tim Whitbeck'
  });

  feed.item({
    title: 'First post!',
    content: 'This is the first of my RSS items...',
  });

  return feed.xml();
}
