define(['lib/news_special/bootstrap'], function(news) {


    // List constructor
    var ListUi = function(navId, data) {

        this.navData = data.navData;

        // Data should be ordered by most recent first
        this.currentYear = this.navData[0]['year'];

        // Move this into a helper module
        this.breakpoints = [320, 480, 768, 974];

        // An offset to compensate for user agent margin
        this.BREAKPOINT_OFFSET = 16;

        this.renderNav(navId);

        this.addEvents();

        return this;
    }

    ListUi.prototype.addEvents = function() {
        var myList = this;

        news.pubsub.on('select-menu-change', function (ev) {
            // Fix bug on certain Android devices where select menu doesn't show
            // the selected option until the blur event fires
            news.$(ev.currentTarget)[0].blur();
            news.$(ev.currentTarget)[0].focus();
        });
    }

    ListUi.prototype.renderNav = function(selector) {

        var myListUI = this,
            menuMarkup = '<select id="' + selector + '" class="' + selector + '"></select>',
            menuNode = news.$(menuMarkup);

        for (var i = 0; i < myListUI.navData.length; i++) {
            menuNode.append(
                '<option data-year="' + myListUI.navData[i].year + '">' +
                    ' <span class="year">' + myListUI.navData[i].year + '</span>' +
                    ' <span class="data-label">Total deaths</span>' +
                    ' <span class="data-figure">' + myListUI.navData[i].figure + '</span>' +
                '</option>'
            );
        }

        news.$('#' + selector).replaceWith('<fieldset id="' + selector + '--select-wrapper" class="' + selector + '--select-wrapper"></fieldset>');

        news.$('#' + selector + '--select-wrapper').append(menuNode);

        // <fieldset id="sr-destinations-menu-nav" class="sr-destinations-menu-nav">
        //  <select>
        //      <option data-key-event="0">1. March 2011</option>
        //      <option data-key-event="1">2. March 2012</option>
        //      <option data-key-event="2">3. Aug 2012</option>
        //      <option data-key-event="3">4. Dec 2012</option>
        //  </select>
        // </fieldset>

        news.$('#' + selector).on('change', function(ev) {
            ev.preventDefault();
            news.pubsub.emit('select-menu-change', [ev]);
            news.pubsub.emit('istats', ['years-select-menu', 'change']);
            return false;
        });
    }

    return ListUi;

});