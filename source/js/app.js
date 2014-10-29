define(['lib/news_special/bootstrap', 'controller/list_controller'], function (news, controller) {

    return {
        init: function (storyPageUrl) {

            // news.pubsub.emit('istats', ['app-initiated', 'newsspec-nonuser', true]);
            // setTimeout(function () {
            //     news.pubsub.emit('istats', ['panel-clicked', 'newsspec-interaction', 3]);
            // }, 500);
            // setTimeout(function () {
            //     news.pubsub.emit('istats', ['quiz-end', 'newsspec-interaction', true]);
            // }, 2000);

            // shareTools.init('.main', {
            //     storyPageUrl:  storyPageUrl,
            //     header:       'Share this page',
            //     message:      'Custom message',
            //     hashtag:      'BBCNewsGraphics'
            // });

            // news.setStaticIframeHeight(2000);

            // news.hostPageSetup(function () {
            //     window.alert('sending instructions to the host page');
            //     document.body.style.background = 'red';
            // });

            controller.init();
            //news.sendMessageToremoveLoadingImage();
        }
    };

});
