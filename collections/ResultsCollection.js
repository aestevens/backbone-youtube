let ResultsCollection = Backbone.Collection.extend({
  
  // safeSearch=strict - filters out *some* questionable content
  // videoEmbeddable and videoSyndicated filter out results that cannot be played/are unavailable outside of youtube.com
  // baseURL allows for easy appending when a new search occurs
  baseURL: 'https://www.googleapis.com/youtube/v3/search?maxResults=20&part=snippet&safeSearch=strict&type=video&videoEmbeddable=true&videoSyndicated=true&key=AIzaSyCOOX_TNkQrMbmtIDV8dtT2HPh9TACn5Wg',
  url: '',
  model: ResultModel,
  nextPageToken: '',

  parse: function (searchResultsResponse, options) {
    let searchResultsModels = searchResultsResponse.items;

    // We need the next page token to fetch more results if the user scrolls to the bottom of the results panel.
    this.nextPageToken = '&pageToken=' + searchResultsResponse.nextPageToken;
    console.log('The nextPageToken for grabbing more results is ' + this.nextPageToken);

    // Filter out the API response to collect the data needed for rendering the list of results and update the embedded video.
    return _.map(searchResultsModels, function (searchResult) {
      return {
        title: searchResult.snippet.title,
        description: searchResult.snippet.description,
        thumbnailImageURL: searchResult.snippet.thumbnails.default.url,
        videoYouTubeID: searchResult.id.videoId,
        channelTitle: searchResult.snippet.channelTitle
      }
    });
  }
});
