define([
  'jquery',
  'underscore',
  'backbone',
  'helper/dialogs',
  'views/home/View',
  'views/appointment/View',
  'views/appointments/View',
  'views/user/View',
  'views/users/View',
  'views/story/View',
  'views/stories/View',
  'views/stories_user/View',
  'views/config/View',
  'views/login/View',
  'views/sidebar/View',
  'jquery_depend'], function($, _, Backbone, Dialogs, HomeView, AppointmentView, AppointmentsView, UserView, UsersView, StoryView, StoriesView, UserStoriesView, ConfigView, LoginView, SidebarView) {

  var AppRouter = Backbone.Router.extend({
    routes: {
      // Custom routes ----------
      'login': 'loginView',
      'logout': 'logout',

      'appointment': 'appointmentView',
      'appointment=*id': 'appointmentView',

      'appointments': 'appointmentsView',

      'user': 'userView',
      'user=*id': 'userView',

      'users': 'usersView',

      'story=*id': 'storyView',

      'config': 'configView',

      'stories': 'storiesView',
      'stories=*uid': 'userstoriesView',

      // End of Custom routes ---

      // Default: all the others
      '*actions': 'defaultAction'
    }
  });

  var initialize = function() {

    Dialogs.init();

    var app_router = new AppRouter;

    var sidebar = new SidebarView();

    // Global var for router
    window.router = app_router;

    window.user = function() {
      if (localStorage.getItem('user') == null || localStorage.getItem('user') == undefined) {
        return undefined;
      } else {
        return JSON.parse(localStorage.getItem('user'));
      }
    }

    window.isAuth = function() {
      if (window.user().type == 'admin') {
        return true;
      }

      return false;
    }

    var checkPanel = function() {
      if (window.user() == undefined) {
        $("#menu").hide();
        $("#panel").replaceWith('<div id="sidebar"></div>');

        window.router.navigate('#login', {
          trigger: true
        });

        return false;
      } else {
        if ($("#sidebar").length >= 1) {
          sidebar.render();
        }

        $("#app-page").trigger('create');

        if ($.platform.pc || $.platform.tablet) {
          if ($.mobile.activePage.jqmData("panel") !== "open") {
            $("#panel").panel("open");
          }
        } else {
          $("#panel").panel("close");
        }

        return true;
      }
    };

    app_router.on('route:defaultAction', function(actions) {
      if (checkPanel()) {
        (new HomeView()).render();
      }
    });

    app_router.on('route:loginView', function(actions) {
      var view = new LoginView();
      view.render();
    });

    app_router.on('route:logout', function(actions) {
      localStorage.clear();

      checkPanel();
    });

    app_router.on('route:appointmentView', function(id) {
      if (checkPanel()) {
        var view = new AppointmentView({
          aid: id
        });
        view.render();
      }
    });

    app_router.on('route:appointmentsView', function(id) {
      if (checkPanel()) {
        (new AppointmentsView()).render();
      }
    });

    app_router.on('route:usersView', function(id) {
      if (checkPanel()) {
        (new UsersView()).render();
      }
    });

    app_router.on('route:userView', function(id) {
      if (checkPanel()) {
        (new UserView({
          uid: id
        })).render();
      }
    });

    app_router.on('route:storyView', function(id) {
      if (checkPanel()) {
        if (!window.isAuth()) {
          window.router.navigate("#", {
            trigger: true
          });
          return;
        }

        var view = new StoryView({
          uid: id
        });
        view.render();
      }
    });

    app_router.on('route:storiesView', function(id) {
      if (checkPanel()) {
        if (!window.isAuth()) {
          window.router.navigate("#", {
            trigger: true
          });
          return;
        }

        (new StoriesView()).render();
      }
    });

    app_router.on('route:userstoriesView', function(uid) {
      if (checkPanel()) {
        if (!window.isAuth()) {
          window.router.navigate("#", {
            trigger: true
          });
          return;
        }

        var view = new UserStoriesView({
          uid: uid
        });
        view.render();
      }
    });

    app_router.on('route:configView', function(id) {
      if (checkPanel()) {
        if (!window.isAuth()) {
          window.router.navigate("#", {
            trigger: true
          });
          return;
        }

        (new ConfigView()).render();
      }
    });

    Backbone.history.start({
      pushState: false
    });
  };

  return {
    initialize: initialize
  };
});