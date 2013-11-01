define([
  'underscore',
  'backbone',
  'collections/users/collection',
  'collections/users/model',
  'helper/dialogs',
  'text!./template.html',
  'ashe',
  'jquery'], function(_, Backbone, collection, model, dialogs, templateData, Ashe, $) {

  var View = Backbone.View.extend({
    el: $("#app-container"),

    isNew: true,

    render: function() {
      var self = this;

      var data = {
        firstname: '',
        lastname: '',
        pid: '',
        id: '',
        type: '',
        email: '',
        phone: '',
        address: '',
        whatsapp: false
      };

      if (_.isUndefined(collection) || collection.length == 0) {
        window.router.navigate("#users", {
          trigger: true
        });
        return;
      }

      console.info(this.options.uid);

      if (!_.isUndefined(this.options.uid)) {
        var user = collection.findWhere({
          _id: this.options.uid
        });

        console.info(user.get('whatsapp'));

        data = {
          firstname: user.get('firstname'),
          lastname: user.get('lastname'),
          pid: user.get('pid'),
          id: user.get('_id'),
          type: user.get('type'),
          email: user.get('email'),
          phone: user.get('phone'),
          address: user.get('address'),
          whatsapp: user.get('whatsapp')
        };

        this.isNew = false;
      }

      this.$el.html(Ashe.parse(templateData, _.extend(data, {
        create: this.isNew,
        isAdmin: (window.user().type == 'admin')
      })));

      // Change the select
      if (!_.isUndefined(this.options.uid)) {
        $("#type").val(data.type);
      }

      this.$el.trigger('create');

      this.joinEvents();

      return this;
    },

    joinEvents: function() {
      var self = this;

      $("#save_user").on('click, tap', function(e) {
        e.stopPropagation();

        if (_.isEmpty($("#firstname").val()) || _.isEmpty($("#lastname").val()) || _.isEmpty($("#email").val()) || _.isEmpty($("#pid").val())) {
          dialogs.toast("Debe completar todos los campos.");

          return;
        }

        var nu = {};
        nu.firstname = $("#firstname").val();
        nu.lastname = $("#lastname").val();
        nu.pid = $("#pid").val();
        nu.email = $("#email").val();
        nu.phone = $("#phone").val();
        nu.whatsapp = ($("#whatsapp").is(":checked"));
        nu.address = $("#address").val();
        nu.type = $("#type").val();
        if (!self.isNew) {
          nu._id = $("#_id").val();
        }

        var ms = new model(nu);
        ms.save({}, {
          success: function() {
            window.router.navigate('#users', {
              trigger: true
            });
          }
        });

        return false;
      });
    },

  });

  return View;

});