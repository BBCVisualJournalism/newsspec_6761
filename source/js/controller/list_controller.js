define(['lib/news_special/bootstrap', 'model/list_data_cache', 'view/nav', 'view/list'],
    function (news, ListDataCache, Nav, List) {
    //function (news, Model, GraphOverall, GraphDestinations) {

        function init() {

            var dataCache = new ListDataCache('nav-section__years'),
                nav = new Nav('nav-section__years', dataCache),
                list = new List('main-data-block', 'nav-section__years', dataCache);

                list.addEvents();

            addEventEmitters();

        }

        function addEventEmitters() {
                
            function resizeCompleted(){
                // Haven't resized for ...
                news.pubsub.emit('resize-completed');
            }

            var timeoutId;
            window.addEventListener('resize', function (e) {
                news.pubsub.emit('resize');

                clearTimeout(timeoutId);
                timeoutId = setTimeout(resizeCompleted, 100);

            }, false);

        }

        return {
            init: init
        };
    });