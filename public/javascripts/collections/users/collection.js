define([
  'baucis',
  'urls',
  './model'], function(Baucis, urls, Model) {

  var singleton = function() {
    var Collection = Baucis.Collection.extend({
      model: Model,

      url: urls.users
    });

    return new Collection();
  };


  return (new singleton());
});