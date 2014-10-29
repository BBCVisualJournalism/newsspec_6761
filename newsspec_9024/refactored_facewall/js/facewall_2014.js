(function() {

    function init() {
        
		var ld = _glow.dom.get("#loading");
		var page = _glow.dom.get("#latest_casualties");
		
		ld.hide();
		page.show();

		// var countrySelectors = _glow.dom.get("#mil_cas_selector input");
		// _glow.events.addListener(countrySelectors,"click",selectorListener);	
		
		var casualties = _glow.dom.get(".facewall li");
		_glow.events.addListener(casualties,"click",casualtiesListener);
		
		getTotalDeaths("loc_afghanistan");
		
		var navbarEnclosureForScroll = _glow.dom.get("#navBar");
		
		if(_glow.env.ie) {
			_glow.dom.get("#navBar").css("margin-left", "20px");
		}
		
		new scrollFollow("#navBar", {});
    }

    function casualtiesListener(d) {
        if (b === true) {
            c.hide()
        }
        var e = _glow.dom.get(d.attachedTo);
        var f = e.get("img").attr("title");
        if (f.match(/Not\sreleased/)) {
            f = "Not released"
        }
        var g = e.get("dl").clone();
        g.attr("class", "panel_details");
        var h = e.get("a").clone();
        var i = _glow.dom.create('<div id="simplePanel">');
        var j = _glow.dom.create('<h2 class="hd">' + f + "</h2>");
        var k = e.get("input.ukmc-img-170-url").val();
        var l = _glow.dom.create("<img>").attr("src", k);
        var m = _glow.dom.create('<div class="bd">');
        m.append(l);
        m.append(g);
        var n = _glow.dom.create('<div class="ft">');
        n.append(h);
        i.append(j).append(m).append(n);
        c = new _glow.widgets.Panel(i, {
            theme: "light",
            width: 450,
            modal: false
        });
        c.show();
        b = true
    }

    function f(b, c, d, e) {
        var g = b * d;
        var h = g + d;
        if (h >= _glow.dom.get(c).length) {
            c.slice(g).show();
            i(e)
        } else {
            c.slice(g, h).show();
            setTimeout(function() {
                f(++b, c, d, e)
            }, 70)
        }
    }

    function g(b, c, d, e) {
        var f = b * d;
        var h = f + d;
        if (h >= _glow.dom.get(c).length) {
            c.slice(f).hide();
            i(e)
        } else {
            c.slice(f, h).hide();
            setTimeout(function() {
                g(++b, c, d, e)
            }, 70)
        }
    }

    function selectorListener(b) {
        var c = _glow.dom.get(b.attachedTo).attr("id");
        if (c === "loc_afghanistan") {
            g(0, _glow.dom.get(".iraq"), 100, c);
            f(0, _glow.dom.get(".afghanistan"), 100, c)
        } else if (c === "loc_iraq") {
            g(0, _glow.dom.get(".afghanistan"), 100, c);
            f(0, _glow.dom.get(".iraq"), 100, c)
        } else {
            f(0, _glow.dom.get(".afghanistan"), 100, c);
            f(0, _glow.dom.get(".iraq"), 100, c)
        }
    }

    function getTotalDeaths(b) {
        var c = b.substring(4);
        _glow.dom.get("#navBar").html("<h3>Fatalities by year</h3>");
        var d = "<li class='ukcas-navbar-" + c + "' style='display:block;'></li>";
        _glow.dom.get(".year").each(function(b) {
            var c = 0;
            var e = "";
            var f = _glow.dom.get(this).get(".yearSpan").html();
            _glow.dom.get("#navBar").append("<div class='ukcas-nav-collection' id='block" + b + "'></div>");
            _glow.dom.get("#navBar").get("#block" + b).append("<a href='#y" + f + "'>" + f + "</a>").append("<ul></ul>");
            _glow.dom.get(this).get("li").each(function(b) {
                if (_glow.dom.get(this).css("display") != "none") {
                    e += d;
                    c++
                }
            });
            _glow.dom.get("#navBar").get("#block" + b).get("ul").append(e);
            _glow.dom.get(this).get("h2").get(".deathCount").html(c + "")
        });
        _glow.dom.get("#navBar").append("<h5>Go to top</h5>");
        _glow.events.addListener(_glow.dom.get("#navBar").get("h5"), "click", j)
    }

    function j() {
        window.scrollTo(0, 0)
    }

    function scrollFollow(box, options) {
		// Convert box into a Glow object
		var box = _glow.dom.get( box );

		// We may be in fallback mode, meaning the Facewall box is not currently displayed.
		// In this case we'll need the position of the alternative content
		// var altBox = _glow.dom.get( "#responsive-list" );

        function ani() {
			// A bunch of values we need to determine where to animate to
			//var viewportHeight = parseInt( _glow.dom.get(window).height() );
			var pageScroll =  parseInt( _glow.dom.get(window).scrollTop() );
			var parentTop =  parseInt( box.cont.offset().top );
			var parentHeight = parseInt( box.cont.item(0).offsetHeight );
			var boxHeight = parseInt( box.item(0).offsetHeight + ( parseInt( box.css( 'margin-top' ) ) || 0 ) + ( parseInt( box.css( 'margin-bottom' ) ) || 0 ) );
			var aniTop;

			options.offset = 0;

			
			// Don't animate until the top of the window is close enough to the top of the box
			if ( parseInt(parentTop) >= ( pageScroll + options.offset ) )
			{
				aniTop = parseInt(box.initialTop);
			}
			else
			{
				aniTop = Math.min( ( Math.max( ( -parentTop ), ( pageScroll - parentTop + parseInt(box.initialTop) ) ) + options.offset ), ( parentHeight - boxHeight - box.paddingAdjustment) ); 
			}
			
			// Checks to see if the relevant scroll was the last one
			// "-20" is to account for inaccuracy in the timeout
			options.delay = 0;
			if ( ( new Date().getTime() - box.lastScroll ) >= ( options.delay - 20 ) )
			{
				_glow.anim.css(box,0.2, {
					"top": aniTop
				}).start();
			}
		};
		
		// We set the parent element
		box.cont = _glow.dom.get( '#latest_casualties' );
		
		// Hack to fix different treatment of boxes positioned 'absolute' and 'relative'
		if ( box.css( 'position' ) === 'relative' ) {
			box.paddingAdjustment = parseInt( box.cont.css( 'paddingTop' ) ) + parseInt( box.cont.css( 'paddingBottom' ) );
		} else {
			box.paddingAdjustment = 0;
		}
		
		// Finds the default positioning of the box.
		box.initialTop = parseInt( box.css( 'top' ) ) || 0;
		// box.initialOffsetTop = parseInt( box.offset().top );
		
		// Animate the box when the page is scrolled
		window.onscroll = function () {
			// Sets up the delay of the animation
			//fnscrollFollow.interval = setTimeout( function(){ ani();} , options.delay );
			fnscrollFollow.interval = setTimeout( function(){ ani();} , 0 );
			
			// To check against right before setting the animation
			box.lastScroll = new Date().getTime();
		}
		
		// Animate the box when the page is resized
		window.onresize = function () {
			// Sets up the delay of the animation
			fnscrollFollow.interval = setTimeout( function(){ ani();} , options.delay );
			
			// To check against right before setting the animation
			box.lastScroll = new Date().getTime();
		}

		// Run an initial animation on page load
		box.lastScroll = 0;
		
		ani();
    }

    var a;
    var b = false;
    var c;
    gloader.load(['glow', '1', 'glow.dom','glow.events','glow.widgets','glow.widgets.Panel','glow.net','glow.anim'], {
        async: true,
        onLoad: function(glow) {
			_glow = glow;		
			_glow.ready(init);				
		}
	});

    var fnscrollFollow = function(a) {
        a = a || {};
        a.speed = a.speed || 500;
        a.offset = a.offset || 0;
        a.delay = a.delay || 0;
        this.each(function() {
            new scrollFollow(this, a)
        });
        return this;
    }

})()