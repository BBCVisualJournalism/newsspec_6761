define(['lib/news_special/bootstrap'], function(news) {


    // List constructor
    var ListDataCache = function(navId) {

        this.navData = [];
        this.listData = [];

        this.navData = this.assembleNavData(navId);

        return this;
    }

    ListDataCache.prototype.assembleNavData = function(selector) {

        var myDataArray = [];

        news.$('#' + selector + ' li').each(function() {

            if(news.$(this).find(' .year').length > 0) {
                var object = {
                    "year" : news.$(this).find(" .year").text(),
                    "figure" : news.$(this).find(" .data-figure").text()
                };
                myDataArray.push(object);
            }

        });

        return myDataArray;

    }

    return ListDataCache;

});