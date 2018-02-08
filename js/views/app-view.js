var AppView = Backbone.View.extend({
  el: $('body'),

  events: {
    'click .search': 'fetch',
    'keypress #search-content': function (e) {
      if (e.keyCode === 13) {
        if (this.$searchContent.val()) {
          $('.search').click();
        }
      }
    }
  },

  initialize: function() {
    this.$searchContent = this.$('#search-content');
    this.$currentVideoContainer = this.$('.current-video-container');
    this.$videosContainer = this.$('.videos-container');
    this.listenTo(appModel, 'change:current_video', this.renderCurrentVideo);
    this.listenTo(appModel.get('videos'), 'add', this.renderVideos);
  },

  fetch: function () {
    $.ajax({
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyDGCjl1iFvXTBRSCkdNpND6pNTcnuQi6Ow&type=video&q=" + this.$searchContent.val(),
      dataType: "json",
      success: (data) => {
        this.$videosContainer.empty();
        for (let i = 0; i < data.items.length; i++) {
          appModel.get('videos').add({
            name: data.items[i].snippet.title,
            description: data.items[i].snippet.description,
            videoId: data.items[i].id.videoId,
            thumbnail: data.items[i].snippet.thumbnails.default.url
          });
        };
        appModel.set('current_video', data.items[0].id.videoId);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  },

  renderCurrentVideo: function () {
    this.$currentVideoContainer.empty();

    let currentVideoModel = appModel.get('videos').get(appModel.get('current_video'));
    var currentVideoView = new CurrentVideoView({ model: currentVideoModel });

    this.$currentVideoContainer.append(currentVideoView.render().el);
  },

  renderVideos: function (video) {
    var videoView = new VideoView({ model: video });

    this.$videosContainer.append(videoView.render().el);
  }
});
