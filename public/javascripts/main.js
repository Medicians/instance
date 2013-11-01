require.config({
  //urlArgs: "bust=" + (new Date()).getTime(), // Just for Development
  paths: {

    jquery: 'libs/jquery/jquery',
    jquery_depend: 'libs/jquery/jquery.depend',
    jquery_transit: 'libs/jquery/jquery.transit.min',
    jquery_unveil: 'libs/jquery/jquery.unveil.min',
    jquery_mobile: 'libs/jquery/jquery.mobile.min',

    jquery_impromptu: 'libs/jquery/jquery.impromptu',

    stringjs: 'libs/stringjs/string.min',

    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    backbone_modal: 'libs/backbone/backbone.modal.min',
    text: 'libs/require/text',

    fullcalendar: 'libs/fullcalendar/fullcalendar.min',

    ashe: 'libs/ashe/ashe',

    sifter: 'libs/sifter/sifter.min',

    pubsub: 'libs/pubsub/pubsub',

    baucis: 'helpers/baucis',

    moment: 'libs/moment/moment.min.spa',

    collections: 'collections',

    helper: 'helpers',

    urls: 'urls'
  },
  shim: {
    'underscore': {
      exports: '_'
    },
    'jquery': {
      exports: '$'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'backbone_modal': {
      deps: ['backbone']
    },
    'jquery_depend': {
      deps: ['jquery']
    },
    'jquery_unveil': {
      deps: ['jquery']
    },
    'jquery_mobile': {
      deps: ['jquery']
    },
    'jquery_impromptu': {
      deps: ['jquery']
    },
    'ashe': {
      exports: 'Ashe'
    },
    'fullcalendar': {
      deps: ['jquery']
    },
    'sifter': {
      exports: 'Sifter'
    },
    'moment': {
      exports: 'moment'
    }
  }
});

require(['app', 'underscore', 'stringjs', 'pubsub', 'jquery', 'jquery_mobile', 'jquery_depend'], function(App, _, S, PubSub, $) {

  $.mobile.ajaxEnabled = false;
  $.mobile.linkBindingEnabled = false;
  $.mobile.hashListeningEnabled = false;
  $.mobile.pushStateEnabled = false;

  S.extendPrototype();

  // App Cache
  // Activate at the end
  if (!_.isUndefined(window.applicationCache)) {
    window.applicationCache.addEventListener('updateready', function(e) {
      if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        window.applicationCache.swapCache();
        if (confirm('Hay una nueva versión de la aplicación disponible. Desea actualizarla ahora?')) {
          window.location.reload();
        }
      }
    }, false);
  }

  App.initialize();

  setInterval(function() {
    PubSub.publish('connection', {
      online: navigator.onLine
    })
  }, 250);

  // If ESC is pressed open the panel again
  $(document).on('keydown, keypress, keyup', function(e) {
    if (e.keyCode == 27) {
      e.stopPropagation();

      $("#panel").panel("open");

      return false;
    }
  });

});