
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

// TODO apply arbitrary todomvc rendering framework to collection, to get updated at change
// TODO possibly also on manual change to XML

var toCollection = function(xmlRawString) {
  // TODO spec this for authoring collection: collection.reset();
  return serializer.deserialize(xmlRawString, collection);
};

var toXmlRaw = function(authoringCollection) {
  return serializer.serialize(authoringCollection);
};

var receiveXmlRaw = function(err, res) {
  console.log('prepare received', err, res);
  if (res.status != 200 && res.status != 204) {
    return warn('prepare failed');
  }
  var xml = res.text;
  $('#currentXml').val(xml);
  toCollection(xml);
};

var prepare = function() {
  var query = {
    item: $('#item').val()
  };
  request
    .get('/cms/rest/author/collection/prepare')
    .query(query)
    .set('Accept', 'text/xml')
    .end(receiveXmlRaw);
};

var render = function() {
  $('#currentCollection').text(
    JSON.stringify(
      collection.toJSON(),
      null, '\t'));
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

var reconcile = function() {
  // using the collection is more interesting, but we might want to listen to xml text changes
  var xml = toXmlRaw(collection);
  console.log('to persist', xml);
  request
    .post('/cms/rest/author/collection/reconcile')
    .set('Content-Type', 'text/xml')
    .send(xml)
    .end(persistCallback);
};

var cmslab = function() {
  verifyCmsConnect();
  render();
  collection.on('add remove change', render);

  $('#prepare').click(prepare);
  $('#reconcile').click(reconcile);
};

$(document).ready(cmslab);
