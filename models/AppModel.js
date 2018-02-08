let AppModel = Backbone.Model.extend({
  defaults: function () {
    return {
      current_video: new ResultModel(),
      query: '',
      results: new ResultsCollection()
    }
  },

  initialize: function () {
    // If query has changed, update the results collection's URL in order to fetch results for the given search.
    this.on( 'change:query', this.updateResultsCollectionURL);
  },

  // Once a new search has been submitted, the results collection needs an updated url to use when fetching the search results.
  updateResultsCollectionURL: function () {
    console.log('Query was changed');
    let baseURL = this.get('results').baseURL;
    // Prevent malicious searches by removing non-alphanumeric characters. Spaces are converted to the escaped %20 expected in URLs
    this.get('results').url = baseURL + '&q=' + this.get('query').replace(/\W+/, '').replace(/\s+/g, '%20');

    // Provide a means of testing whether the the url was changed before fetching search results from the YouTube API.
    // current_video will only be null if the user initiated a new search or loaded the page with the default search setup in main.js
    this.set('current_video', null);
    console.log('Results Collection URL was updated to ' + this.get('results').url);
    this.getNewSearchResultsAndUpdateCurrentVideo();
  },

  // Fetch new results if the user has searched for a new query to show a top result video and then a list of results.
  getNewSearchResultsAndUpdateCurrentVideo: function () {
    // Results collection url was not updated; this is not a new search.
    if (this.get('current_video') !== null) {
      return false;
    } else {
      console.log('Fetching results based on a new query or loading the page!');
      this.get('results').fetch();
    }
  }
});
