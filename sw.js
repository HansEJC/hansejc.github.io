importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.0/workbox-sw.js');

const {precacheAndRoute} = workbox.precaching;
const {registerRoute} = workbox.routing;
const {CacheFirst, StaleWhileRevalidate, NetworkFirst} = workbox.strategies;
const {CacheableResponse, CacheableResponsePlugin} = workbox.cacheableResponse;
const {ExpirationPlugin} = workbox.expiration;
const googleAnalytics = workbox.googleAnalytics;

//googleAnalytics.initialize(); //"Uses too much storage, not worth it.

async function cacheKeyWillBeUsed({request, mode}) {
  const url = new URL(request.url);
  return url.origin + url.pathname;
  // Any search params or hash will be left out.
}

registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
		{cacheKeyWillBeUsed},
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

registerRoute(
  ({request}) => request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'css',
    plugins: [
		{cacheKeyWillBeUsed},
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

registerRoute(
  ({request}) => request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'scripts',
    plugins: [
		{cacheKeyWillBeUsed},
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

registerRoute(
  ({url}) => url.pathname.endsWith('.html'),
  new StaleWhileRevalidate({
    cacheName: 'html',
    plugins: [
		{cacheKeyWillBeUsed},
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

registerRoute(
  ({url}) => url.pathname.endsWith('.csv') || url.pathname.endsWith('.xlsx'),
  new StaleWhileRevalidate({
    cacheName: 'spreadsheets',
    plugins: [
		{cacheKeyWillBeUsed},
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

registerRoute(
  ({url}) => url.pathname.endsWith('.json'),
  new NetworkFirst({
    cacheName: 'json',
    plugins: [
		{cacheKeyWillBeUsed},
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// Use the imported Workbox libraries to implement caching,
// routing, and other logic:
precacheAndRoute([{"revision":"7da28de37dfc59f13b0838f12f2d6acf","url":"js/index.js"},{"revision":"5ead4a385fb2ab5534de8e55899071d9","url":"css/images/overlay.png"},{"revision":"5581701399968a1f3e6ffa297e62db27","url":"css/images/shadow.png"},{"revision":"8458201d45620491e3d9fd19b2713801","url":"css/memory.css"},{"revision":"0750871cf9e585c5b1dc8a1ede1109d0","url":"css/molestyle.css"},{"revision":"6ac282e90ad27d8cdb98ae7d891e6923","url":"css/piano.css"},{"revision":"2612a5dcf96f188e895e47994a8ee772","url":"css/skel.css"},{"revision":"8e24d873c921379c664acef1187cd839","url":"css/style-1000px.css"},{"revision":"3cd8f2838dd571e209eb5246eb6ccd18","url":"css/style-desktop.css"},{"revision":"0e23ae7d87cc15f5b9a4c7c0ce8b9994","url":"css/style-mobile.css"},{"revision":"f86740dfb79a62b7c98749571796adfe","url":"css/style.css"},{"revision":"98ca1c54bdb2e620973fcd219401bc2e","url":"css/tictactoe.css"},{"revision":"e5ddef5351268d787fad60725ff1db90","url":"csv.html"},{"revision":"7f8fdecf44801b80cae51092399da03b","url":"downloads/Polar Addition.xlsx"},{"revision":"e4afb951edf9d6c63bdd2c423b807352","url":"earth.html"},{"revision":"3046c6c6570c4e0fc70e74f9414a022a","url":"emc.html"},{"revision":"0ff20cb2b3901fae7a8f3334323deb70","url":"fault.html"},{"revision":"634f2d3572e0e6459bb9ae939e921541","url":"favicon.ico"},{"revision":"a7ea8fabd58fd1621112fb346d92e2e5","url":"fullscores.php"},{"revision":"6b0b033db9e8d854d8b3093549e6548f","url":"help.html"},{"revision":"ab302fd1e7cdfdb8848de7b3eb63f219","url":"images/1x-cloud.png"},{"revision":"6fba690776abe480e131417725bdab7d","url":"images/1x-large-obstacle.png"},{"revision":"d07e3fdbd4c6127a3a2da193a1c07bf6","url":"images/1x-restart.png"},{"revision":"48766f17de2a1988c385b7b5a738a5c1","url":"images/1x-small-obstacle.png"},{"revision":"72c0d92df73a85b4ce2753ce2ffb08bb","url":"images/1x-text.png"},{"revision":"dfe1e61c7ac5d222b8543390bf505168","url":"images/1x-trex.png"},{"revision":"6ea435a667ac8100ddbb4d0477f9d2f3","url":"images/2x-cloud.png"},{"revision":"a9cf0cd7ff3c5a651b803cbf570d9e2f","url":"images/2x-large-obstacle.png"},{"revision":"e131f0bfe00d65dabbe3e8b903a6537f","url":"images/2x-restart.png"},{"revision":"7ffbccd1f67fe7433c92a62fefb26c2f","url":"images/2x-small-obstacle.png"},{"revision":"21a3755ddae76df50103df00d1bed437","url":"images/2x-text.png"},{"revision":"4eec8dc2c7273c07c948f14c7ab0fce9","url":"images/2x-trex.png"},{"revision":"f789d564ed2c6b7452ee4b55e52a61a0","url":"images/background.png"},{"revision":"98a7aeec3552b4ead9e72f76cd52ee66","url":"images/banner.jpg"},{"revision":"1ff00b34944114ef8b35a39f4ac6c76d","url":"images/manifest-icon-192.png"},{"revision":"d1fa0c5d419310dc22ab5732e7f0b5e9","url":"images/manifest-icon-512.png"},{"revision":"c37f8c96439d0528700040364ae7db9f","url":"index.html"},{"revision":"c8c759ab389140d4ec9bd67d1b3c9510","url":"js/csv.js"},{"revision":"190b377c59bfc7da78ad1cf8c12a591c","url":"js/csv2array.js"},{"revision":"f019a1446bcb9b8187e0f352486b9a12","url":"js/csvIE.js"},{"revision":"d6fbb66c124f7d00027ecc351e3cbadb","url":"js/csvold.js"},{"revision":"df2fc17f6f97c22c204a94eb08c6c78d","url":"js/dygraph.min.js"},{"revision":"be1c25d14c2ca8edbdc21af3e80a5a53","url":"js/earthing.js"},{"revision":"7da28de37dfc59f13b0838f12f2d6acf","url":"js/electools.js"},{"revision":"8334b8b33011a1a14b9e62d0004cf669","url":"js/emc.js"},{"revision":"3c946085c5e6223df5950bb7613959ed","url":"js/fault.js"},{"revision":"1c0a0d33851d2573b9a4e430091ba334","url":"js/html2canvas.min.js"},{"revision":"d49c602d967f39c933aef649d2ede43d","url":"js/init.js"},{"revision":"3fe0200eeb7ef8a80e31834069e37bd4","url":"js/jquery.dropotron.min.js"},{"revision":"8101d596b2b8fa35fe3a634ea342d7c3","url":"js/jquery.min.js"},{"revision":"4e1c0fe43eb1512af0b295a14ba34e3f","url":"js/memory.js"},{"revision":"f1379c46fc6277c1924161a24afc8cf7","url":"js/mole.js"},{"revision":"6ada0eefe18b573a809be667b7969ecd","url":"js/moment.js"},{"revision":"42f47eebfa7cfbd924bd98d046786bd2","url":"js/mortgage.js"},{"revision":"de1e6a56e4e60823710aaa936316d6ee","url":"js/mortgage2.js"},{"revision":"14dabd842ef3f0c7b96bc4a5b0227d84","url":"js/op.js"},{"revision":"f6dcff2491567e2ef992f7d09961b0eb","url":"js/papaparse.js"},{"revision":"e50b81248acc280bbaa591ff6ea2690b","url":"js/piano.js"},{"revision":"967f95a6621f0aaa35be372ae30ecbef","url":"js/relay.js"},{"revision":"a0ecec7f2c55eee4e4e81b308fbe0aa4","url":"js/relayIE.js"},{"revision":"7ecffc705c482bc78ea29383267ef604","url":"js/scores.js"},{"revision":"20d5f2a41f81bc497603e8d65539ec53","url":"js/skel-layers.min.js"},{"revision":"b41e646e2868752bfb47743f65f9d127","url":"js/skel.min.js"},{"revision":"3f1ffc58c551355682ba23fbc2a772f1","url":"js/soil.js"},{"revision":"73f15901f34738c7f69ece024a90fbb7","url":"js/tictactoe.js"},{"revision":"7a5828564de97747ab8a611a697d946b","url":"js/trex.js"},{"revision":"083620190ca03e2a37fb9de42e21166a","url":"js/worker.js"},{"revision":"170b1a54ed73cf982c6611ddb5f7e05c","url":"js/xlsx.core.min.js"},{"revision":"f0b8a67fd767fb583d67f2b47b59e616","url":"manifest.json"},{"revision":"13aef65d238cb191218a9e943a2d58a1","url":"memory.html"},{"revision":"12bb14c1fadc0c74f4ce5702f88cd489","url":"mole.html"},{"revision":"89be2379e21dad971ea505aae3a8b59d","url":"mortgage.html"},{"revision":"ae081ab7a1a357c860869bda51e5cbe5","url":"mortgage2.html"},{"revision":"3fc316766b7d9f45a52bceb5b26b5b48","url":"op.html"},{"revision":"4c7a5472637d6e9d1ba4cfd5f8acca36","url":"Orion Park/ExcelConverter.js"},{"revision":"11935140a3f2bac75ae4e951950c4e4d","url":"Orion Park/op-Delivery.csv"},{"revision":"b643c769d78c3442f5a4c7810675bcdd","url":"Orion Park/op-Project Stock.csv"},{"revision":"116828adbed2ea81351e82200d35730a","url":"Orion Park/op-Warehouse Stock .csv"},{"revision":"99e72452fd67e47aa80aeecb18b47524","url":"Orion Park/op.xlsx"},{"revision":"69ea7dfa60c6283a370386205a059053","url":"piano.html"},{"revision":"b692711c84265d54e8c518c7b9349dc6","url":"relay.html"},{"revision":"31de15f8aa8d83babd75a44c52bce278","url":"savesettings.php"},{"revision":"369a471550094b973292feaa3c1cc3c4","url":"soil.html"},{"revision":"46f45a4c406ebca2024904b348464845","url":"soildb.php"},{"revision":"b737782188352db9064ef57faff134e8","url":"tictactoe.html"},{"revision":"64c6ce4c401f3a4945117339c1cf201a","url":"tools.html"},{"revision":"b7482438c8bab5c64caa18edf80b534f","url":"uploads/190101 Fault.csv"},{"revision":"27d9c94305319af1969e6d2f9aebf0cb","url":"uploads/fault.csv"},{"revision":"3aa377891e76b18953b5f14dee0edd1c","url":"uploads/graph.csv"},{"revision":"4edbd87b1d404f2c29c9d2a525c26725","url":"uploads/molescores.json"},{"revision":"34788a3d806089acde74e374d0327b40","url":"uploads/relay.csv"},{"revision":"dbd6564f1501181cf05f1cc49acda419","url":"uploads/scores.json"},{"revision":"f6b7072ecbe7e470bbec4c3bb7fffc84","url":"uploads/simonscores.json"}],{
  // Ignore all URL parameters.
  ignoreURLParametersMatching: [/.*/]
});