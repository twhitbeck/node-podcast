var et = require('elementtree');

module.exports = function(options) {
  options = options || {};

  this.title = options.title || 'Untitled';
  this.description = options.description || '';
  this.author = options.author;
  this.imageUrl = options.imageUrl;
  this.items = [];
  this.categories = options.categories || [];

  this.item = function(itemOptions) {
    var item = {
      title: itemOptions.title || 'No title',
      content: itemOptions.content || 'No content',
      author: itemOptions.author || this.author,
      audio: itemOptions.audio || {}
    };

    this.items.push(item);

    return this;
  };

  this.xml = function() {
    var root = et.Element('rss');
    root.set('xmlns:itunes', 'http://www.itunes.com/dtds/podcast-1.0.dtd');
    root.set('version', '2.0');

    var channelE = et.SubElement(root, 'channel');
    var titleE = et.SubElement(channelE, 'title');
    titleE.text = this.title;

    var linkE = et.SubElement(channelE, 'link');
    linkE.text = 'http://www.google.com';

    var languageE = et.SubElement(channelE, 'language');
    languageE.text = 'en-us';

    var subtitleE = et.SubElement(channelE, 'itunes:subtitle');
    subtitleE.text = this.description;

    var authorE = et.SubElement(channelE, 'author');
    authorE.text = this.author;

    var summaryE = et.SubElement(channelE, 'itunes:summary');
    summaryE.text = 'A big summary thing here, I guess...';

    var descriptionE = et.SubElement(channelE, 'description');
    descriptionE.text = 'A big summary thing here, I guess...';

    var ownerE = et.SubElement(channelE, 'itunes:owner');
    var ownerNameE = et.SubElement(ownerE, 'itunes:name');
    ownerNameE.text = 'Tim Whitbeck';
    var ownerEmailE = et.SubElement(ownerE, 'itunes:email');
    ownerEmailE.text = 'twhitbeck@gmail.com';

    var imageE = et.SubElement(channelE, 'itunes:image');
    imageE.set('href', this.imageUrl);

    this.categories.forEach(function(category) {
      var categoryE = et.SubElement(channelE, 'itunes:category');
      categoryE.set('text', category);
    });

    this.items.forEach(function(item) {
      var itemE = et.SubElement(channelE, 'item');

      var itemTitleE = et.SubElement(itemE, 'title');
      itemTitleE.text = item.title;

      var itemAuthorE = et.SubElement(itemE, 'itunes:author');
      itemAuthorE.text = item.author;

      var itemSubtitleE = et.SubElement(itemE, 'itunes:subtitle');
      itemSubtitleE.text = item.subtitle;

      var itemSummaryE = et.SubElement(itemE, 'itunes:summary');
      itemSummaryE.text = item.summary;

      var itemImageE = et.SubElement(itemE, 'itunes:image');
      itemImageE.set('href', item.imageUrl);

      var enclosureE = et.SubElement(itemE, 'enclosure');
      enclosureE.set('url', item.audio.url);
      enclosureE.set('length', item.audio.length);
      enclosureE.set('type', item.audio.type);

      var guidE = et.SubElement(itemE, 'guid');
      guidE.text = item.guid || item.audio.url;

      var pubDateE = et.SubElement(itemE, 'pubDate');
      // TODO: rfc1123 format this date
      pubDateE.text = item.pubDate;

      var durationE = et.SubElement(itemE, 'itunes:duration');
      durationE.text = item.audio.duration;
    });

    return et.tostring(root);
  };
};
