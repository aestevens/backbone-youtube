let AppView = Backbone.View.extend({
  el: $('body'),

  events: {
    'click .search-submit': 'updateQuery',
  },

  initialize: function () {
    this.$searchQuery = this.$('.search-query');
    this.$videoContainer = this.$('.video-container');
    this.$searchResultsList = this.$('.search-results-list');

    let searchResultsList = document.querySelector('.search-results-list');

    // The scroll event is silly and doesn't bubble up the document on elements like a click event,
    // so this allows us to actually listen for a scroll.
    searchResultsList.addEventListener('scroll', this.getAdditionalSearchResults);

    this.listenTo(this.model.get('results'), 'add', this.renderResult);

    this.listenTo(this.model.get('results'), 'reset', this.clearVideoContainerAndResults)

    this.listenTo(this.model, 'change:current_video', this.renderVideoContainer);
  },

  // Show a video result in the results list pane
  renderResult: function (searchResult) {
    if (this.model.get('current_video') === null) {

      // Update the current video so that the user will see the 'top result' as the embedded video
      let firstSearchResult = this.model.get('results').at(0);
      console.log('First search result is ' + firstSearchResult.get('title') + '');
      this.model.set('current_video', firstSearchResult);
    }

    console.log('Rendering a new result to the results list!');
    let resultView = new ResultView({model: searchResult});
    this.$searchResultsList.append(resultView.render().el);
  },

  // A new search has been entered, so the user shouldn't see the old video and results list.
  clearVideoContainerAndResults: function () {
    this.$videoContainer.empty();
    this.$searchResultsList.empty();
  },

  renderVideoContainer: function () {
    // If this is a new search, don't render until fetch has been executed.
    if (this.model.get('current_video') === null) {
      return false;
    }
    // If the current video was previously defined, clear the container so the user doesn't see an old result.
    if (this.model.previous('current_video') !== null) {
      this.$videoContainer.empty();
    }
    let videoContainerView = new VideoContainerView();
    this.$videoContainer.append(videoContainerView.render().el);
    console.log('Rendering the video container view ');
  },

  updateQuery: function () {
    let trimmedQuery = this.$searchQuery.val().trim();
    if ( trimmedQuery === '' || trimmedQuery.length > 80) {
      console.log('Invalid search query. A search should be 1-80 characters long.');
      // A popover alerts the user that their query was either too short or too long to make sure they enter a correct query.
      $('.search-submit').popover('enable');
      $('.search-submit').popover('show');
      return false;
    }

    // Check for a new search and clear the old results so a user doesn't see old results.
    if (this.model.get('query') !== this.$searchQuery.val()) {
      this.model.get('results').reset();
      let newQuery = this.$searchQuery.val();
      this.model.set('query', newQuery);
      console.log('The updated query is ' + this.model.get('query') + '');
    }
  },

  // The user should be able to see more results when they scroll to the bottom of the results panel.
  getAdditionalSearchResults: function () {
    let searchResultsList = document.querySelector('.search-results-list');
    if (searchResultsList.scrollTop + searchResultsList.clientHeight == searchResultsList.scrollHeight) {
      console.log('Fetching more results because you scrolled to the bottom of the panel!');

      let currentURL = appModel.get('results').url.replace(/&pageToken=\w+/, '');
      console.log('Current url minus the nextToken is ' + currentURL + '');

      // The URL for our API call needs the nextPageToken in order to display more unique search results.
      appModel.get('results').url = currentURL + appModel.get('results').nextPageToken;
      appModel.get('results').fetch();
    }
  }
});
