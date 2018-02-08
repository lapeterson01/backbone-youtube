var VideoView = Backbone.View.extend({
  template: Handlebars.compile($('#video-template').html()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  events: {
    'click .video-thumbnail': function() {
      appModel.set({ current_video: this.model.id })
    }
  }
});
