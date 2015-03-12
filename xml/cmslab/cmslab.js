
var authormodel = require('../../');
var AuthoringCollectionSerializer = require('../AuthoringCollectionSerializerXml');

var $ = require('jquery');
var request = require('superagent');

var warn = function() {
  alert('' + arguments[0] + ' ' + arguments[1]);
};

var verifyCmsConnect = function() {
  request
    .get('/cms/rest/user3/repositorynames')
    .end(function(err, res) {
      if (res.status == 200) {
        console.log('CMS responds as expected', res);
      } else {
        alert('CMS not found');
      }
    });
};

var collection = window.authoringCollection = new authormodel.AuthoringCollection();
var AuthoringUnit = window.AuthoringUnit = authormodel.AuthoringUnit;
var serializer = new AuthoringCollectionSerializer();

// some sample content
collection.add(new AuthoringUnit({
  id: '1',
  type: 'p',
  content: 'Text with <emph>inline</emph> &gt;0.'
}));
collection.add(new AuthoringUnit({
  id: '2',
  type: 'graphic',
  fileref: 'x-svn://...'
}));
collection.add(new AuthoringUnit({
  id: '3',
  type: 'p',
  indent: 1,
  class: 'li',
  content: 'Bullet'
}));

var toXmlRaw = function(authoringCollection) {
  return serializer.serialize(authoringCollection);
}

var render = function() {
  $('#currentCollection').text(
    JSON.stringify(
      collection.toJSON(),
      null, '\t'));
  $('#currentXml').text(
    toXmlRaw(collection)
  );
};

var persistCallback = function(err, res) {
  console.log('persisted?', err, res);
  if (res.status != 200 && res.status != 204) {
    warn('failed');
  } else {
    console.log('persist ok', res.body);
    if (typeof res.body.unitCount != 'undefined') {
      alert('' + res.body.unitCount + ' units sent for pesistence');
    }
  }
};

var persist = function() {
  var xml = toXmlRaw(collection);
  console.log('to persist', xml);
  request
    .post('/cms/rest/authoring/persist')
    .set('Content-Type', 'text/xml')
    .send(xml)
    .end(persistCallback);
};

var cmslab = function() {
  verifyCmsConnect();
  render();
  collection.on('add remove change', render);

  $('#echo').click(persist);
};

$(document).ready(cmslab);
