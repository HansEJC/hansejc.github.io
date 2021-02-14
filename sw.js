const HansTools = "hans-tools";
const assets = [
	"/",
	"/index.html",
	"/manifest.json",
	"/css/style.css",
	"/memory.html",
	"/mole.html",
	"/csv.html",
	"/relay.html",
	"/earth.html",
	"/soil.html",
	"/tools.html",
	"/emc.html",
	"/mortgage.html",
	"/fault.html",
	"/op.html",
	"/help.html",
	"/favicon.ico",
	
	"/css/style-desktop.css",
	"/css/style-1000px.css",
	"/css/font-awesome.min.css",
	"https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400italic,700,900",
	"/css/images/overlay.png",
	"https://fonts.gstatic.com/s/sourcesanspro/v14/6xKydSBYKcSV-LCoeQqfX1RYOo3ig4vwlxdu.woff2",
	"https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7l.woff2",
	"https://fonts.gstatic.com/s/sourcesanspro/v14/6xK1dSBYKcSV-LCoeQqfX1RYOo3qPZ7nsDI.woff2",
	"https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3qO67lqDY.woff2",
		
	//"/sw.js",	
	"/js/script.js ",
	"/js/dygraph.min.js",
	"/js/trex.js",
	"/js/jquery.min.js",
	"/js/tex-mml-chtml.js",
	"/js/html2canvas.min.js",
	"/js/skel-layers.min.js",
	"/js/xlsx.core.min.js",
	"/js/papaparse.js",
	"/js/csv2array.js",
	"/js/moment.js",
	"/js/skel.min.js",
	"/js/jquery.dropotron.min.js",	
	"/js/worker.js",
	
	"/js/init.js",
	"/js/csv.js",
	"/js/emc.js",
	"/js/electools.js",
	"/js/earthing.js",
	"/js/relayIE.js",
	"/js/op.js",
	"/js/soil.js",
	"/js/fault.js",
	"/js/csvIE.js",
	"/js/mortgage.js",
	"/js/mortgage2.js",
	"/js/relay.js",
	"/js/tictactoe.js",
	"/js/scores.js",
	"/js/memory.js",
	"/js/mole.js",	
];

self.addEventListener("install", installEvent => {
	installEvent.waitUntil(
		caches.open(HansTools).then(cache => {
			cache.addAll(assets)
		})
	);
});

self.addEventListener("fetch", fetchEvent => {
	fetchEvent.respondWith(
		caches.match(fetchEvent.request, {ignoreSearch: true}).then(res => {
			return res || fetch(fetchEvent.request);
			//return fetch(fetchEvent.request) || res;
		})
	);
});