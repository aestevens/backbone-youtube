let ResultView = Backbone.View.extend({

  tagName: 'li',

  className: 'search-result mb-2',

  model: ResultModel,

  events: {
    'click .search-result-link': 'swapCurrentVideoWithClickedResult'
  },

  initialize: function () {

    this.listenTo(this.model, 'change', this.render);

  },

  template: Handlebars.compile($('#search-result-template').html()),

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  // The user should be able to play other videos from the results list in the embedded video frame.
  swapCurrentVideoWithClickedResult: function () {
    console.log('Successful click on a result view');
    let clickedResultModel = this.model;
    appModel.set('current_video', clickedResultModel);
  }
});
