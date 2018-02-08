let appModel = new AppModel();

let appView = new AppView({model: appModel});

// Set our default query, per User Story
appModel.set('query', 'oot hyrule field');

// Handles hiding our popover so that the user doesn't have to.
$(document).ready( function () {
  $('.search-submit').on('shown.bs.popover', function() {
    setTimeout(function() {
        $('.search-submit').popover('hide');
        $('.search-submit').popover('disable');
    }, 2000);
  });
});
