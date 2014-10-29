define(['lib/news_special/bootstrap'], function(news) {


    // List constructor
    var List = function(listContainerId, navId, dataObj) {

        this.dataCache = dataObj;
        this.currentYear = this.dataCache.navData[0].year;

        this.listId = listContainerId;

        // Move this into a helper module
        this.breakpoints = [320, 480, 768, 974];

        // An offset to compensate for user agent margin
        this.BREAKPOINT_OFFSET = 16;

        // Keep track of the current layout
        this.currentView = 'default';  // 'default' or 'table'

        this.listHeadersClass = 'all-years-list-headers';

        this.listHeadersCtaMarkup = '<h3 class="all-years-list-cta">' +
                '<span class="em">British fatalities</span> ' +
                'The table can be re-ordered by clicking on any of the column headings' +
        '</h3>';

        this.listHeadersMarkup = '<ul class="' + this.listHeadersClass + '">' +
            '<li class="tl-name-column-block tl-column-block"><a href="#" data-col="name" data-sort-dir="asc">Name</a></li>' +
            '<li class="tl-rank-column-block tl-column-block"><a href="#" data-col="rank" data-sort-dir="asc">Rank</a></li>' +
            '<li class="tl-age-column-block tl-column-block"><a href="#" data-col="age" data-sort-dir="asc">Age</a></li>' +
            '<li class="tl-from-column-block tl-column-block"><a href="#" data-col="from" data-sort-dir="asc">From</a></li>' +
            '<li class="tl-service-column-block tl-column-block"><a href="#" data-col="service" data-sort-dir="asc">Served with</a></li>' +
            '<li class="tl-cause-column-block tl-column-block"><a href="#" data-col="cause" data-sort-dir="asc">Incident</a></li>' +
            '<li class="tl-place-column-block tl-column-block"><a href="#" data-col="place" data-sort-dir="asc">Place</a></li>' +
            '<li class="tl-date-column-block tl-column-block"><a href="#" data-col="date" data-sort-dir="asc">Date</a></li>' +
        '</ul>';

        this.tableViewListClass = 'all-years-list';

        // Create a container to hold the list and add it to the DOM
        //news.$('#' + navId + '--select-wrapper').after('<div id="' + this.listId + '" class="' + this.listId + '"></div>');

        this.loadView();

        return this;
    }

    List.prototype.addEvents = function() {
        var myList = this;

        news.pubsub.on('resize-completed', function (ev) {
            if ((myList.isTableView() && myList.currentView !== 'table') ||
            (! myList.isTableView() && myList.currentView !== 'default')) {
                myList.loadView();
            } else {
                // No action required
            }
        });

        news.pubsub.on('select-menu-change', function (ev) {
            var selectMenu = news.$(ev.currentTarget),
                myIndex = selectMenu[0].selectedIndex || 0,
                year = news.$(selectMenu[0].options[myIndex]).attr('data-year');
            myList.setYearView(myList.listId, year);
        });
    }

    List.prototype.enablePortraits = function() {
        var myList = this,
            enabledClass = 'casualty-record--portrait--enabled';

        // Make a copy of the list so that we can make our changes and then
        // do a single DOM insertion, for performance reasons
        var newListNode = news.$('#' + myList.listId).clone();

        news.$(newListNode).find('.casualty-record--portrait').each(function () {
            if(!news.$(this).hasClass(enabledClass)) {
                var myImgSrc = news.$(this).attr('data-imgsrc');
                if (myImgSrc) {
                    news.$(this).css('background-image', 'url(' + myImgSrc + ')');
                    news.$(this).addClass(enabledClass);
                }
            }
        });

        // Insert changes into the DOM
        news.$('#' + myList.listId).html(newListNode.html());
    }

    List.prototype.addDetailEvents = function() {
        var myList = this;

        news.$('.detail-link').on('click', function (ev) {
            ev.preventDefault();
            news.pubsub.emit('detail-link-click', [ev]);
            news.pubsub.emit('istats', ['detail-link-open', 'click']);
            return false;
        });

        news.$('.detail-panel-container').on('click', function (ev) {
            ev.preventDefault();
            news.pubsub.emit('detail-panel-container-click', [ev]);
            news.pubsub.emit('istats', ['detail-panel-close', 'click']);
            return false;
        });

        if (!news.$('#' + myList.listId + ' .cta').length > 0) {
            news.$('#' + myList.listId).prepend('<h2 class="cta">Tap image for details</h2>');   
        }
    }

    List.prototype.addDetailLinks = function() {
        var myList = this,
            detailsPanelMarkup = 
                '<div id="detail-panel-container" class="detail-panel-container">' +
                    '<div id="detail-panel" class="detail-panel">' +
                        '<a class="close-link" href="">Close</a>' + 
                        '<div class="detail-content"></div>' +
                    '</div>' + 
                '</div>';

        // Make a copy of the list so that we can make our changes and then
        // do a single DOM insertion, for performance reasons
        var newListNode = news.$('#' + myList.listId).clone();

        news.$(newListNode).find('.casualty-record').each(function () {
            var myDetailLink = news.$('<a href="#" class="detail-link"></a>');
            myDetailLink.append(news.$(this).find('.casualty-record--portrait'));
            news.$(this).prepend(myDetailLink);
        });

        // Insert changes into the DOM
        news.$('#' + myList.listId).html(newListNode.html());
        news.$('#' + myList.listId).append(detailsPanelMarkup);

        myList.addDetailEvents();
    }

    List.prototype.loadView = function() {
        var myList = this; 

        // Tablet and desktop get the table layout
        if (myList.isTableView()) {
            // Load the data for all the years
            myList.loadTableData(myList.listId, myList.currentYear);

            if(!news.$('.' + myList.listHeadersClass).length > 0) {
                news.$('#' + myList.listId).prepend(myList.listHeadersCtaMarkup + myList.listHeadersMarkup);
            }
            if(!news.$('#bbc-news-visual-journalism-loading-spinner').length > 0) {
                news.$('.all-years-list').addClass('loading');
                myList.addCustomSpinner('.' + myList.listHeadersClass);
            }

            news.$('.' + this.listHeadersClass + ' a').on('click', function (e) {
                news.pubsub.emit('detail-column-header-click', [e]);
                news.pubsub.emit('istats', ['sort-by-column-header', 'click']);
            });
            news.pubsub.on('detail-column-header-click', function (e) {
                e.preventDefault();
                myList.sortListByColumn(
                    news.$(e.currentTarget).attr('data-col'),
                    news.$(e.currentTarget).attr('data-sort-dir')
                );

                // Set the direction on this column for next time
                myList.setSortDirection(news.$(e.currentTarget).attr('data-col'));
            });
            myList.currentView = 'table';
        } else { // smartphone
            if(!news.$('#bbc-news-visual-journalism-loading-spinner').length > 0) {
                news.$('.main-data-block').addClass('loading');
                myList.addCustomSpinner('#nav-section__years--select-wrapper');
            }

            // Load one year's worth of data !!!
            myList.loadListData(myList.listId, myList.currentYear);
            myList.currentView = 'default';
        }
    }

    List.prototype.loadListData = function(containerId, year) {
        var myList = this,
            dataUrls = [];

        // Clear any existing data from our list container element
        news.$('#' + containerId).html('');

        news.$('#' + containerId).load('all_years_list.inc .year__list', function () {
            myList.enablePortraits();
            if (!myList.isTableView()) {
                myList.addDetailLinks();

                news.pubsub.on('detail-link-click', function (ev) {
                    myList.displayRecordDetail(ev);
                });

                news.pubsub.on('detail-panel-container-click', function (ev) {
                    myList.hideRecordDetail(ev);
                });

                myList.setYearView(containerId, year);

                news.$('.bbc-news-visual-journalism-loading-spinner').remove();
                news.$('.main-data-block').removeClass('loading');
            }
        });

    }

    List.prototype.loadTableData = function(containerId, year) {
        var myList = this,
            dataUrls = [];

        // Clear the smartphone-only events
        news.pubsub.off('detail-link-click');
        news.pubsub.off('detail-panel-container-click');
        news.pubsub.off('detail-column-header-click');

        // Clear any existing data from our list container element
        news.$('#' + containerId).html('<ul class="' + myList.tableViewListClass + '"></ul>');

        news.$('.' + myList.tableViewListClass).load('all_years.inc .year__list li', function () {
            news.$('.bbc-news-visual-journalism-loading-spinner').remove();
            news.$('.main-data-block').removeClass('loading');
        });

    }

    List.prototype.addCustomSpinner = function(afterElt) {
        var myList = this,
            spinnerImgNode = news.$('<div class="bbc-news-visual-journalism-loading-spinner__img"></div>'),
            spinnerHolderNode = news.$('<div class="bbc-news-visual-journalism-loading-spinner"></div>');

        spinnerHolderNode.append('<img class="bbc-news-visual-journalism-loading-spinner__text">Loading</div>');
        spinnerHolderNode.append(spinnerImgNode);
    
        news.$(afterElt).after(spinnerHolderNode);
    }

    List.prototype.setYearView = function(containerId, year) {
        var myList = this;

        // hide all lists
        news.$('.year__list__header').css('display', 'none');
        news.$('.year__list').css('display', 'none');
        news.$('.link__back').css('display', 'none');

        // show selected year list
        news.$('#year__list__' + year).css('display', 'block');

        myList.currentYear = year;
    }

    List.prototype.sortListByColumn = function(column, dir) {

        if (column === 'date') {
            // Sort by date
            this.sortList('date', column, '.em', dir);
        } else if (column === 'age') {
            // Sort numerically, by age
            this.sortList('num', column, '.em', dir);

        } else {
            // Sort alphabetically, by whichever column was selected
            this.sortList('az', column, '.em', dir);
        }
    }

    List.prototype.setSortDirection = function(column) {
        if (news.$('.tl-' + column + '-column-block a').attr('data-sort-dir') === 'asc') {
            news.$('.tl-' + column + '-column-block a').attr('data-sort-dir', 'desc');
        } else {
            news.$('.tl-' + column + '-column-block a').attr('data-sort-dir', 'asc');
        }
    }

    List.prototype.sortList = function(sortType, column, selector, dir) {
        var myList = this,
            myListNode = news.$('.' + this.tableViewListClass),
            listItems = myListNode.children('li').get(),
            sortedContentNode = news.$('<div></div>');

        listItems = myList.sortDomElements(listItems, column, selector, dir, sortType);

        news.$.each(listItems, function(i, item) {
            sortedContentNode.append(item);
        });

        myListNode.html(sortedContentNode.html());
    }

    List.prototype.sortDomElements = function(items, column, selector, dir, sortType) {
        var myList = this,
            map = [],
            sorted = [];

        // Map the exact values we want to sort on, for efficiency
        for (var i = 0, length = items.length; i < length; i++) {

            var myValue;
            if (sortType === 'az') {
                myValue = news.$(items[i]).find('.tl-' + column + '-column-block ' + selector).text().toUpperCase();
            } else if (sortType === 'num') {
                myValue = news.$(items[i]).find('.tl-' + column + '-column-block ' + selector).text();
            } else if (sortType === 'date') {
                myValue = news.$(items[i]).find('.tl-' + column + '-column-block ' + selector).attr('data-timestamp') || '';
            } else {
                // not a valid sort type
                return false;
            }

            map.push({
                index: i, // original index
                value: myValue
            });
        }

        map.sort(function(a, b) {

            // Account for the sort direction
            if (dir === 'desc') {
                var myFlippedVars = myList.flipVars(a, b);
                a = myFlippedVars[0];
                b = myFlippedVars[1];
            }

            var result = (sortType === 'az') ?
                a.value.localeCompare(b.value) :
                ((parseInt(a.value, 10) < parseInt(b.value, 10)) ? -1 : (parseInt(a.value, 10) > parseInt(b.value, 10)) ? 1 : 0);

            return result;
        });

        // Populate the sorted array with the new order of values,
        // by looking up the mapped indexes and retrieving their values
        // from the original array
        for (var i = 0, length = map.length; i < length; i++) {
            sorted.push(items[map[i].index]);
        }

        return sorted;
    }

    List.prototype.displayRecordDetail = function(ev) {
        var myList = this,
            vPos = news.$(ev.currentTarget).offset().top - news.$('#' + myList.listId).offset().top - 40,
            myRecordMarkup = news.$(ev.currentTarget).parent().html(),
            myContainerHeight = news.$('#year__list__' + myList.currentYear)[0].clientHeight,
            myContainerWidth = news.$('#year__list__' + myList.currentYear)[0].clientWidth,
            myContentNode;

        myDetailMarkup = this.assembleDetailContent(myRecordMarkup);

        news.$('#detail-panel .detail-content').html(myDetailMarkup);

        news.$('#detail-panel').css('margin-top', vPos + 'px');
        news.$('#detail-panel-container').css('top', (news.$('#year__list__' + myList.currentYear).offset().top - news.$('#' + myList.listId).offset().top) + 'px');
        news.$('#detail-panel-container').css('height', myContainerHeight + 'px');
        news.$('#detail-panel-container').css('display', 'block');

        if (myContainerHeight < (vPos + news.$('#detail-panel')[0].clientHeight)) {
            news.$('#detail-panel').css('margin-top', (myContainerHeight - news.$('#detail-panel')[0].clientHeight - 16) + 'px');
        }
        if (myContainerHeight < (news.$('#detail-panel')[0].clientHeight + 16)) {

            news.$('#detail-panel-container').css('height', (news.$('#detail-panel')[0].clientHeight + 40) + 'px');
            news.$('#detail-panel-container').css('top', -(news.$('#detail-panel')[0].clientHeight - news.$(ev.currentTarget).parent()[0].clientHeight) + 8 + 'px');
            news.$('#detail-panel').css('margin-top', 16 + 'px');
        }
    }

    List.prototype.convertToTableLayout = function(listMarkup) {
        var myList = this,
            listNode = news.$('<ul>' + listMarkup + '</ul>'),
            myTableLayoutNode = news.$('<ul class="fake-table"></ul>');

            listNode.find('li').each(function (i) {
                var oddOrNot = i % 2 ? '' : 'odd-row';
                myTableLayoutNode.append(myList.assembleTableRow(news.$(this), oddOrNot));
            });

            return myTableLayoutNode.html();
    }

    List.prototype.getNameFieldText = function (itemNode) {
        var myNameFieldText = '';
        if (itemNode.find('.casualty-record--secondname').text() !== 'Not released') {
            myNameFieldText = itemNode.find('.casualty-record--secondname').text() +
                ', ' +
                itemNode.find('.casualty-record--firstname').text();
        } else {
            myNameFieldText = itemNode.find('.casualty-record--secondname').text();
        }
        return myNameFieldText;
    }

    List.prototype.assembleTableRow = function(itemNode, oddOrNot) {
        var myList = this,
            myNameField = myList.getNameFieldText(itemNode),
            myTableRowMarkup = '<li class="casualty-record ' + oddOrNot + '">' +
                '<div class="tl-name-column-block tl-column-block">' +
                    '<span class="em">' +
                        myNameField +
                    '</span>',
            singleDataFields = ['rank', 'age', 'date'];

        if (itemNode.find('.casualty-record--portrait').attr('data-imgsrc')) {
            myTableRowMarkup += '<img class="no-replace" src="' +
                itemNode.find('.casualty-record--portrait').attr('data-imgsrc') +
                '" alt="" />' +
            '</div>';
        } else {
            myTableRowMarkup += '</div>';   
        }

        myTableRowMarkup += myList.assembleSimpleColumnItem('rank', itemNode);
        myTableRowMarkup += myList.assembleSimpleColumnItem('age', itemNode);


        myTableRowMarkup += myList.assembleComplexColumnItem({
            "label": "from",
            "fields": ["county", "hometown"]
        }, itemNode);

        myTableRowMarkup += myList.assembleComplexColumnItem({
            "label": "service",
            "fields": ["service", "unit", "service-detail"]
        }, itemNode);

        myTableRowMarkup += myList.assembleComplexColumnItem({
            "label": "cause",
            "fields": ["cause", "cause-detail", "cause-description"],
            "storyLink": "story-link"
        }, itemNode);

        myTableRowMarkup += myList.assembleComplexColumnItem({
            "label": "place",
            "fields": ["incident-region", "incident-area"]
        }, itemNode);

        myTableRowMarkup += myList.assembleSimpleColumnItem('date', itemNode);      
        myTableRowMarkup += '</li>';

        return myTableRowMarkup;
    }

    List.prototype.assembleSimpleColumnItem = function(dataField, itemNode) {
        var itemMarkup = '<div class="tl-' + dataField + '-column-block tl-column-block">',
            // Make sure we get the timestamp, if any, for efficient sorting by date
            timestampAttr = itemNode.find('.casualty-record--' + dataField).attr('data-timestamp') ?
                'data-timestamp="' + itemNode.find('.casualty-record--' + dataField).attr('data-timestamp') + '"' :
                '';

        itemMarkup += '<span class="em" ' +
            timestampAttr +
            '>' +
                itemNode.find('.casualty-record--' + dataField).text() +
            '</span>' +
        '</div>';

        return itemMarkup;

    }

    List.prototype.assembleComplexColumnItem = function(dataObj, node) {
        var myContainerString = '',
            firstItemAdded = false,
            myInnerString = '',
            label = dataObj.label ?
                dataObj.label :
                node.find('.casualty-record--' + dataObj.category).text().toLowerCase();

        // Fix for special cases
        if (label === 'royal marines') {
            label = 'marines';
        }

        myContainerString += '<div class="tl-' + label + '-column-block tl-column-block">';

        for (var i = 0; i < dataObj.fields.length; i++) {

            // Business rules: 
            // The first item we find will always be added in a span with class 'em'
            // The rest of the content (innerString) will be a comma-separated list
            if (!firstItemAdded) {

                if (node.find('.casualty-record--' + dataObj.fields[i]).text().length > 0) {
                    myContainerString += '<span class="em">' + node.find('.casualty-record--' + dataObj.fields[i]).text();

                    // 'Cause' is a special case. We concatenate 'cause' and 'cause-detail' using a colon
                    if (label === 'cause') {
                        // Deal with 'cause-detail'
                        if (node.find('.casualty-record--' + dataObj.fields[i + 1]).text().length > 0) {
                            myContainerString += ': ' + node.find('.casualty-record--' + dataObj.fields[i + 1]).text();

                            // We just used the second data field so increment
                            i++;
                        }

                    }

                    myContainerString += '</span>';
                    firstItemAdded = true;
                }
            } else if (myInnerString === '') {
                if (node.find('.casualty-record--' + dataObj.fields[i]).text().length > 0) {
                    myInnerString += node.find('.casualty-record--' + dataObj.fields[i]).text();
                }   
            } else {
                if (node.find('.casualty-record--' + dataObj.fields[i]).text().length > 0) {
                    myInnerString += ', ';
                    myInnerString += node.find('.casualty-record--' + dataObj.fields[i]).text();
                }
            }

        }

        myContainerString += myInnerString;

        if (dataObj.storyLink) {
            if (node.find('.casualty-record--' + dataObj.storyLink).attr('href') !== undefined) {
                myContainerString += '<a href="' + node.find('.casualty-record--' + dataObj.storyLink).attr('href') + '" target="_parent">Full story</a>';   
            }
        }

        myContainerString += '</div>';

        return myContainerString;
    }

    List.prototype.assembleDetailContent = function(markup) {
        var myList = this,
            myOriginalNode = news.$('<div>' + markup + '</div>'),
            myDetailMarkup = '<h3>' +
                myOriginalNode.find('.casualty-record--firstname').text() +
                ' ' +
                myOriginalNode.find('.casualty-record--secondname').text() +
            '</h3>',
            singleDataFields = ['rank', 'age'];

            if (myOriginalNode.find('.casualty-record--portrait').attr('data-imgsrc-large')) {
                myDetailMarkup += '<img src="' +
                    myOriginalNode.find('.casualty-record--portrait').attr('data-imgsrc-large') +
                    '" alt="" />';
            }

            for (var i = 0; i < singleDataFields.length; i++) {
                if (myOriginalNode.find('.casualty-record--' + singleDataFields[i]).text().length > 0) {
                    myDetailMarkup += '<div class="detail-item--' + singleDataFields[i] + '">' +
                        myOriginalNode.find('.casualty-record--' + singleDataFields[i]).text() +
                    '</div>';
                }
            }

            myDetailMarkup += myList.assembleCombinedDataString({
                "label": "from",
                "fields": ["county", "hometown"]
            },
            myOriginalNode);

            myDetailMarkup += myList.assembleCombinedDataString({
                "category": "cause",
                "fields": ["cause-detail", "cause-description"]
            },
            myOriginalNode);

            myDetailMarkup += myList.assembleCombinedDataString({
                "label": "place",
                "fields": ["incident-region", "incident-area"]
            },
            myOriginalNode);

            myDetailMarkup += myList.assembleCombinedDataString({
                "category": "service",
                "fields": ["unit", "service-detail"]
            },
            myOriginalNode);


        return myDetailMarkup;
    }

    List.prototype.assembleCombinedDataString = function(dataObj, node) {
        var myString = '',
            label = dataObj.label ?
                dataObj.label :
                node.find('.casualty-record--' + dataObj.category).text().toLowerCase();

        // Fix for special cases
        if (label === 'royal marines') {
            label = 'marines';
        }

        if (node.find('.casualty-record--' + dataObj.fields[0]).text().length > 0 ||
            node.find('.casualty-record--' + dataObj.fields[1]).text().length > 0) {

            myString += '<div class="detail-item--' + label + '">';

                if (node.find('.casualty-record--' + dataObj.fields[0]).text().length > 0 &&
                    node.find('.casualty-record--' + dataObj.fields[1]).text().length > 0) {

                    myString += node.find('.casualty-record--' + dataObj.fields[0]).text() +
                        ', ' +
                        node.find('.casualty-record--' + dataObj.fields[1]).text();

                } else if (node.find('.casualty-record--' + dataObj.fields[0]).text().length > 0) {

                    myString += node.find('.casualty-record--' + dataObj.fields[0]).text();

                } else {

                    myString += node.find('.casualty-record--' + dataObj.fields[1]).text();

                }
            myString += '</div>';
        }

        return myString;
    }

    List.prototype.hideRecordDetail = function(ev) {
        news.$('#detail-panel-container').css('display', 'none');
    }

    // Move this into a helper module
    List.prototype.getViewportWidth = function() {
        return document.body.clientWidth;
    }

    List.prototype.isTableView = function() {
        return this.getViewportWidth() >= (this.breakpoints[2] - this.BREAKPOINT_OFFSET);
    }

    List.prototype.flipVars = function(a, b) {
        return [b, a];
    }

    return List;

});