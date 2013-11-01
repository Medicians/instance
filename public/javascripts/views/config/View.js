/**
 * Agregar motivo de modificación
 */
define([
  'underscore',
  'backbone',
  'collections/config/collection',
  'helper/dialogs',
  'text!./template.html',
  'ashe',
  'jquery'], function(_, Backbone, collection, dialogs, templateData, Ashe, $) {

  var View = Backbone.View.extend({
    el: $("#app-container"),

    data: undefined,

    render: function() {
      var self = this;

      collection.fetch({
        success: function() {
          self.data = collection.at(0);

          self.$el.html(Ashe.parse(templateData, self.data.attributes));

          self.$el.trigger('create');
        },
        error: function() {

        }
      });

      this.joinEvents();

      return this;
    },

    joinEvents: function() {
      var self = this;

      $(document).on('click tap', ".save_config", function(e) {
        e.stopPropagation();

        self.data.set('email', $("#email").val());
        self.data.set('title', $("#title").val());
        self.data.set('phone', $("#phone").val());

        self.data.save({}, {
          success: function() {
            dialogs.toast('Guardado con éxito.');
          }
        });

        return false;
      });
    },

  });

  return View;

});