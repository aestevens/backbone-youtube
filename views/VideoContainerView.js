let VideoContainerView = Backbone.View.extend({
  model: new ResultModel(),

  template: Handlebars.compile($('#video-container-template').html()),

  render: function () {
    this.$el.html(this.template(appModel.get('current_video').toJSON()));

    return this;
  }
});
