/**
* @fileOverview Military Casualties
* @author Marine Rebuffel-Amselek &lt;marine.rebuffel (at) bbc.co.uk&gt;
* @version 1.1.0-rls
*/ 
(function () {

var _glow;
var openedPanel = false;
var restyledPanel;

gloader.load(['glow', '1', 'glow.dom','glow.events','glow.widgets','glow.widgets.Panel','glow.net','glow.anim'], {
        async: true,
        onLoad: function(glow) {
			_glow = glow;		
			_glow.ready(init);				
		}
});


function init(){
	var ld = _glow.dom.get("#loading");
	var page = _glow.dom.get("#latest_casualties");
	
	ld.hide(); page.show();

	var countrySelectors = _glow.dom.get("#mil_cas_selector input");
	_glow.events.addListener(countrySelectors,"click",selectorListener);	
	
	var casualties = _glow.dom.get(".facewall li");
	_glow.events.addListener(casualties,"click",casualtiesListener);
	
	getTotalDeaths("loc_afghanistan");
	
	var navbarEnclosureForScroll = _glow.dom.get("#navBar");
	
	if(_glow.env.ie) {
		_glow.dom.get("#navBar").css("margin-left", "20px");
	}
	
	new scrollFollow("#navBar", {});
	
	//if (queryString != '(none)' && queryString != '') {
		var choice = 'afghanistan';
		countrySelectors.each(function() {
			_glow.dom.get(this)[0].checked = false;
		});
		switch (choice) {
			case "afghanistan":
				_glow.dom.get('#loc_afghanistan')[0].checked = true;
				_glow.events.fire('#loc_afghanistan', 'click');
				break;
			case "iraq":
				_glow.dom.get('#loc_iraq')[0].checked = true;
				_glow.events.fire('#loc_iraq', 'click');
				break;
			default:
				_glow.dom.get('#loc_afghanistan')[0].checked = true;
				_glow.events.fire('#loc_afghanistan', 'click');
				//_glow.dom.get('#loc_combined')[0].checked = true;
				//_glow.events.fire('#loc_combined', 'click');
				break;
		}
	//}
}

function casualtiesListener(event){
	if(openedPanel == true) {
		restyledPanel.hide();
	}
	
	var element = _glow.dom.get(event.attachedTo);
	var name = element.get("img").attr("title");
	var data = element.get("dl").clone();	
	data.attr("class","panel_details");
	var url = element.get("a").clone();
	var panelDiv = _glow.dom.create('<div id="simplePanel">');
	var header = _glow.dom.create('<h2 class="hd">' + name + '</h2>');
	var thumbnailSrc = element.get("img").attr("src");
	//Derive 170px image url.
	
	var largerImageUrl = thumbnailSrc.replace("/59","/170").replace("_59","_170");
	
	var image = _glow.dom.create('<img>').attr("src",largerImageUrl);
	var body = _glow.dom.create('<div class="bd">');
	
	body.append(image);
	body.append(data);
	
	var footer = _glow.dom.create('<div class="ft">');
	footer.append(url);
	
	panelDiv.append(header).append(body).append(footer);
	restyledPanel = new _glow.widgets.Panel(panelDiv,{theme:"light",width:450,modal:false});
	restyledPanel.show(); 
	openedPanel = true;
}

/*
Display pictures per slice
==================================
step: starting point
list: list of elements to loop on
step_len: pictures by block
*/
function doShow (step, list, step_len, id) { 
	var start = step * step_len;
	var end = start + step_len;

	if (end >= _glow.dom.get(list).length) {
		list.slice(start).show();
		getTotalDeaths(id);
	} else {
		list.slice(start, end).show();
		/* first argument : references the current function
		* second argument : the timeout
		* all other arguments are parameters given to this function
		*/
		setTimeout(function() {doShow(++step, list, step_len, id)}, 70);
	}
}

/*
Hide pictures per slice
==================================
step: starting point
list: list of elements to loop on
step_len: pictures by block
*/
function doHide (step, list, step_len, id) {
	var start = step * step_len;
	var end = start + step_len;        
	if (end >= _glow.dom.get(list).length) {
		list.slice(start).hide();
		getTotalDeaths(id);
	} else {
		list.slice(start, end).hide();
		setTimeout(function() {doHide(++step, list, step_len, id)}, 70);
	}
}

/*
Display/hide pictures, functions of the selected location
*/
function selectorListener(event){

	var id = _glow.dom.get(event.attachedTo).attr("id");	
	
	if(id == "loc_afghanistan"){
		doHide (0, _glow.dom.get(".iraq"), 100, id);
		doShow (0, _glow.dom.get(".afghanistan"), 100, id);
	}else if(id == "loc_iraq"){
		doHide (0, _glow.dom.get(".afghanistan"), 100, id);
		doShow (0, _glow.dom.get(".iraq"), 100, id);
	}else{	
		doShow (0, _glow.dom.get(".afghanistan"), 100, id);
		doShow (0, _glow.dom.get(".iraq"), 100, id);
	}
}

/* 
Set total deaths for each year
Generate widget on the right hand, based on the number of deaths per year
*/
function getTotalDeaths(loc) {	
	var location = loc.substring(4);
	_glow.dom.get("#navBar").html("<h3>Fatalities by year</h3>");
	var block = "<li class='ukcas-navbar-"+location+"' style='display:block;'></li>";
	
	_glow.dom.get(".year").each(function(i){
		var counter = 0;
		var year_html = "";
		var year = _glow.dom.get(this).get(".yearSpan").html();

		_glow.dom.get("#navBar").append("<div class='ukcas-nav-collection' id='block"+i+"'></div>");
		_glow.dom.get("#navBar").get("#block"+i).append("<a href='#y"+year+"'>"+year+"</a>").append("<ul></ul>");
		
		_glow.dom.get(this).get("li").each(function(el) {
			if(_glow.dom.get(this).css("display") != 'none'){					
				year_html += block;
				counter++;
			}
		});
		
		_glow.dom.get("#navBar").get("#block"+i).get("ul").append(year_html);
		
		_glow.dom.get(this).get("h2").get(".deathCount").html(counter+"");
	});
	
	_glow.dom.get("#navBar").append("<h5>Go to top</h5>")
	_glow.events.addListener(_glow.dom.get("#navBar").get("h5"),"click",evnt_goToTopClick);
}

/*
Event: Go to top
*/
function evnt_goToTopClick() {
	window.scrollTo(0, 0);
}

/*
Event: Widget scroll follow
*/
function scrollFollow ( box, options )
{
	// Convert box into a Glow object
	var box = _glow.dom.get( box );

	// 'box' is the object to be animated
	var position = box.css( 'position' );

	function ani()
	{
		// A bunch of values we need to determine where to animate to
		var viewportHeight = parseInt( _glow.dom.get(window).height() );
		var pageScroll =  parseInt( _glow.dom.get(window).scrollTop() );
		var parentTop =  parseInt( box.cont.offset().top );
		var parentHeight = parseInt( box.cont.item(0).offsetHeight );
		var boxHeight = parseInt( box.item(0).offsetHeight + ( parseInt( box.css( 'margin-top' ) ) || 0 ) + ( parseInt( box.css( 'margin-bottom' ) ) || 0 ) );
		var aniTop;	

		options.offset = 0;
		
		// Don't animate until the top of the window is close enough to the top of the box
		if ( parseInt(box.initialOffsetTop) >= ( pageScroll + options.offset ) )
		{
			aniTop = parseInt(box.initialTop);
		}
		else
		{
			aniTop = Math.min( ( Math.max( ( -parentTop ), ( pageScroll - parseInt(box.initialOffsetTop) + parseInt(box.initialTop) ) ) + options.offset ), ( parentHeight - boxHeight - box.paddingAdjustment) ); 
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
	
	// Finds the default positioning of the box.
	box.initialTop = parseInt( box.css( 'top' ) ) || 0;
	box.initialOffsetTop = parseInt( box.offset().top );
	
	// Hack to fix different treatment of boxes positioned 'absolute' and 'relative'
	if ( box.css( 'position' ) == 'relative' )
	{
		box.paddingAdjustment = parseInt( box.cont.css( 'paddingTop' ) ) + parseInt( box.cont.css( 'paddingBottom' ) );
	}
	else
	{
		box.paddingAdjustment = 0;
	}
	
	// Animate the box when the page is scrolled
	window.onscroll = function ()
	{
		// Sets up the delay of the animation
		//fnscrollFollow.interval = setTimeout( function(){ ani();} , options.delay );
		fnscrollFollow.interval = setTimeout( function(){ ani();} , 0 );
		
		// To check against right before setting the animation
		box.lastScroll = new Date().getTime();
	}
	
	// Animate the box when the page is resized
	window.onresize = function ()
	{
		// Sets up the delay of the animation
		fnscrollFollow.interval = setTimeout( function(){ ani();} , options.delay );
		
		// To check against right before setting the animation
		box.lastScroll = new Date().getTime();
	}

	// Run an initial animation on page load
	box.lastScroll = 0;
	
	ani();
};

var fnscrollFollow = function ( options )
{
	options = options || {};
	options.speed = options.speed || 500;
	options.offset = options.offset || 0;
	options.delay = options.delay || 0;
	
	this.each( function() 
		{
			new scrollFollow( this, options );
		}
	);
	
	return this;
};
})();