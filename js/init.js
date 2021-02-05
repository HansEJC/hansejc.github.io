/*
	Escape Velocity by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.init({
		reset: 'full',
		breakpoints: {
			'global':	{ range: '*', href: 'css/style.css?v=1.3' },
			'desktop':	{ range: '765-', href: 'css/style-desktop.css', containers: 1200, grid: { gutters: 50 } },
			'1000px':	{ range: '765-1200', href: 'css/style-1000px.css', containers: '100%!', grid: { gutters: 35 } },
			'mobile':	{ range: '-764', href: 'css/style-mobile.css?v=1.1', containers: '100%!', grid: { gutters: 20 }, viewport: { scalable: false } }
		},
		plugins: {
			layers: {
				config: {
					mode: 'transform'
				},
				navPanel: {
					hidden: true,
					breakpoints: 'mobile',
					position: 'top-left',
					side: 'left',
					animation: 'pushX',
					width: '80%',
					height: '100%',
					clickToHide: true,
					html: '<div data-action="navList" data-args="nav"></div>',
					orientation: 'vertical'
				},
				titleBar: {
					breakpoints: 'mobile',
					position: 'top-left',
					side: 'top',
					height: 44,
					width: '100%',
					html: '<span class="toggle" data-action="toggleLayer" data-args="navPanel"></span><span class="title" data-action="copyHTML" data-args="logo"></span>'
				}
			}
		}
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// Forms (IE<10).
			var $form = $('form');
			if ($form.length > 0) {

				$form.find('.form-button-submit')
					.on('click', function() {
						$(this).parents('form').submit();
						return false;
					});

				if (skel.vars.IEVersion < 10) {
					$.fn.n33_formerize=function(){var _fakes=new Array(),_form = $(this);_form.find('input[type=text],textarea').each(function() { var e = $(this); if (e.val() == '' || e.val() == e.attr('placeholder')) { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).blur(function() { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).focus(function() { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); _form.find('input[type=password]').each(function() { var e = $(this); var x = $($('<div>').append(e.clone()).remove().html().replace(/type="password"/i, 'type="text"').replace(/type=password/i, 'type=text')); if (e.attr('id') != '') x.attr('id', e.attr('id') + '_fakeformerizefield'); if (e.attr('name') != '') x.attr('name', e.attr('name') + '_fakeformerizefield'); x.addClass('formerize-placeholder').val(x.attr('placeholder')).insertAfter(e); if (e.val() == '') e.hide(); else x.hide(); e.blur(function(event) { event.preventDefault(); var e = $(this); var x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } }); x.focus(function(event) { event.preventDefault(); var x = $(this); var e = x.parent().find('input[name=' + x.attr('name').replace('_fakeformerizefield', '') + ']'); x.hide(); e.show().focus(); }); x.keypress(function(event) { event.preventDefault(); x.val(''); }); });  _form.submit(function() { $(this).find('input[type=text],input[type=password],textarea').each(function(event) { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) e.attr('name', ''); if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); }).bind("reset", function(event) { event.preventDefault(); $(this).find('select').val($('option:first').val()); $(this).find('input,textarea').each(function() { var e = $(this); var x; e.removeClass('formerize-placeholder'); switch (this.type) { case 'submit': case 'reset': break; case 'password': e.val(e.attr('defaultValue')); x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } else { e.show(); x.hide(); } break; case 'checkbox': case 'radio': e.attr('checked', e.attr('defaultValue')); break; case 'text': case 'textarea': e.val(e.attr('defaultValue')); if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } break; default: e.val(e.attr('defaultValue')); break; } }); window.setTimeout(function() { for (x in _fakes) _fakes[x].trigger('formerize_sync'); }, 10); }); return _form; };
					$form.n33_formerize();
				}

			}

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Dropdowns.
			$('#nav > ul').dropotron({
				mode: 'fade',
				noOpenerFade: true,
				alignment: 'center',
				detach: false
			});

	});

})(jQuery);

//fix for IE
if (! Object.getOwnPropertyDescriptor(NodeList.prototype, 'forEach')) {
    Object.defineProperty(NodeList.prototype, 'forEach', Object.getOwnPropertyDescriptor(Array.prototype, 'forEach'));
}
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';

    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    }
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
  };
}

function navBar(){
	const navbar = document.getElementById('nav');
	navbar.innerHTML = 
		"<ul>"+
			"<li class='current heh'>"+
				"<a href='#'>Home</a>"+
				"<ul>"+		
					"<li><a href='memory.html'>Simon</a></li>"+	
					"<li><a href='index.html'>TRex</a></li>"+			
					"<li><a href='mole.html'>Whack a Mole</a></li>"+						
				"</ul>"+
			"</li>"+
			"<li class='heh'>"+
				"<a href='#'>Tools</a>"+
				"<ul>"+
					"<li><a href='csv.html'>CSV Plotter</a></li>"+
					"<li><a href='relay.html'>Distance Protection Fault Plotter</a></li>"+	
					"<li><a href='earth.html'>Earthing Calculation Tools</a></li>"+	
					"<li><a href='soil.html'>Earthing Surveys</a></li>		"+
					"<li><a href='tools.html'>Electrical Engineering Tools</a></li>"+		
					"<li><a href='emc.html'>EMC Calculations</a></li>"+
					"<li><a href='mortgage.html'>Mortgage Calculator</a></li>	"+	
					"<li><a href='fault.html'>Railway Faults</a></li>"+				
				"</ul>"+
			"</li>"+
			"<li><a href='op.html'>Orion Park</a></li>"+
			"<li><a href='help.html'>Help</a></li>"+
		"</ul>";
	document.querySelectorAll('.heh').forEach(function(item) {return item.addEventListener('click',randomPage)});
}
let test;
const navs = ['Home','Tools'];
const randomChild = function(len) {return Math.floor(Math.random()*len)};
function randomPage(e) {
	test = e;
	if (navs.some(function(nav) {return e.target.innerHTML.includes(nav)})){
		let nodeLen = randomChild(e.target.parentElement.children[1].querySelectorAll('li').length)
		//e.target.parentElement.children[1].childNodes[0].firstElementChild.click();
		e.target.parentElement.children[1].querySelectorAll('li')[nodeLen].firstElementChild.click();
	}
	else return;
}

//function to resize plot and copy to clipboard
function clippy (x,y) { 
	let offset = document.querySelector('#graphdiv3').offsetTop;
	document.querySelector('#graphdiv3').setAttribute('style', 'height:'+y+'px !important; width:'+x+'px !important; margin: 0px 0px 10px 10px;');
	window.dispatchEvent(new Event('resize'));
	//window.scrollTo(0,document.querySelector('#graphdiv3').offsetTop);
	//setTimeout(function(){
	for (var j = 0; j < 3; j++) {	//weird way to make it actually work
		html2canvas(document.querySelector("#graphdiv3"), {
			y: offset, 
			//scrollY: -window.scrollY,
			scrollX:0,
			scrollY:0,
			height: y+30,
			//width: x+30,
		}).then(canvas => {
			//document.body.appendChild(canvas);
			//setTimeout(function(){    	//timeout only needed for debugging
				//document.querySelectorAll('canvas')[document.querySelectorAll('canvas').length-1].toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]));
				if (typeof(navigator.clipboard)!='undefined'){
					canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]));
				}
				else{
					document.querySelector("#graphdiv3").innerHTML='';
					document.querySelector("#graphdiv3").appendChild(canvas);
				}
				//document.body.removeChild(document.body.lastChild);				
				//document.querySelector('#graphdiv3').removeAttribute('style');
				//window.dispatchEvent(new Event('resize'));
			//},2000)
		});
	//},200)
	}
	if (typeof(navigator.clipboard)=='undefined') {
		let htmltext = (navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes("Edg")) ? "<br><br><a href=chrome://flags/#unsafely-treat-insecure-origin-as-secure>Auto copy to clipboard not supported in http. Copy this link and open in new tab to add this site as trusted to enable.</a>" : "<br><br><a>Auto copy to clipboard not supported. Right click plot and copy as image.</a>";
		let article = document.querySelector('article');
		if (article.lastChild.nodeName != "A") article.innerHTML+=htmltext;
	}
}

//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e){
	var id = e.id;  // get the sender's id to save it . 
	var val = e.value; // get the value. 
	localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
	
	let url ='';
	let params = {};
	document.querySelectorAll('input').forEach((element) => {
		if (element.value.length > 0) params[element.id] = element.value;
	});
	let esc = encodeURIComponent;
	let query = Object.keys(params)
		.map(k => esc(k) + '=' + esc(params[k]))
		.join('&');
	url += '?' + query;
		
	let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + url;
	window.history.pushState({ path: newurl }, '', newurl);
}

//Save the value function - save it to localStorage as (ID, VALUE)
function saveRadio(e){
	var id = e.id;  // get the sender's id to save it . 
	var val = e.checked; // get the value. 
	localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

//get the saved value function - return the value of "v" from localStorage. 
function getSavedValue  (v){
	if (!localStorage.getItem(v)) {
		return "";// You can change this to your defualt value. 
	}
	return localStorage.getItem(v);
}

function change(el) {
	g3.setVisibility(el.id, el.checked);
}