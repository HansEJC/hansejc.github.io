importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js');

const {precacheAndRoute, precache, matchPrecache} = workbox.precaching;
const {registerRoute, setCatchHandler, setDefaultHandler} = workbox.routing;
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
		{cacheKeyWillBeUsed}, //just while I update
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
		{cacheKeyWillBeUsed}, //same as above
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

registerRoute(
  ({url}) => url.pathname.endsWith('.html') || url.pathname.endsWith('.php'),
  new NetworkFirst({
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
precache([{"revision":"0db46859d74dc43ef8f615e95cb12855","url":"css/dobble.css"},{"revision":"30285411940a8432346796cb906a07f4","url":"css/memory.css"},{"revision":"197e5905c14e03d3de31b89fd154bbe4","url":"css/molestyle.css"},{"revision":"6ac282e90ad27d8cdb98ae7d891e6923","url":"css/piano.css"},{"revision":"18d0d2e27cb3d86252cdd42b56af071b","url":"css/skel.css"},{"revision":"e01ddfc5d61269f20b64718b2634c300","url":"css/style-1000px.css"},{"revision":"a38f988b007e55e072edd5d9f3c974e5","url":"css/style-desktop.css"},{"revision":"1a9730d0e42a95d927f7c2efd4108fe0","url":"css/style-mobile.css"},{"revision":"0403c3ab97c5bfc58c3bae5436af5ece","url":"css/style.css"},{"revision":"98ca1c54bdb2e620973fcd219401bc2e","url":"css/tictactoe.css"},{"revision":"b743cf5ed620dde40b800cefe299031b","url":"csv.html"},{"revision":"397e77b8460a00cd87faf03402b87d78","url":"dobble.html"},{"revision":"a72e42b848006b1863df9764a0897bc5","url":"earth.html"},{"revision":"fec629f23b9c9c767869ddce70c4a547","url":"emc.html"},{"revision":"8f896add75b1e7262e3a2ede0e681879","url":"fault.html"},{"revision":"634f2d3572e0e6459bb9ae939e921541","url":"favicon.ico"},{"revision":"9214a1f8c620f26cb679ce7f6cdabb83","url":"fullscores.php"},{"revision":"4154a6d504e716d51bb1d38e6b975ae6","url":"help.html"},{"revision":"ab302fd1e7cdfdb8848de7b3eb63f219","url":"images/1x-cloud.png"},{"revision":"6fba690776abe480e131417725bdab7d","url":"images/1x-large-obstacle.png"},{"revision":"d07e3fdbd4c6127a3a2da193a1c07bf6","url":"images/1x-restart.png"},{"revision":"48766f17de2a1988c385b7b5a738a5c1","url":"images/1x-small-obstacle.png"},{"revision":"72c0d92df73a85b4ce2753ce2ffb08bb","url":"images/1x-text.png"},{"revision":"dfe1e61c7ac5d222b8543390bf505168","url":"images/1x-trex.png"},{"revision":"6ea435a667ac8100ddbb4d0477f9d2f3","url":"images/2x-cloud.png"},{"revision":"a9cf0cd7ff3c5a651b803cbf570d9e2f","url":"images/2x-large-obstacle.png"},{"revision":"e131f0bfe00d65dabbe3e8b903a6537f","url":"images/2x-restart.png"},{"revision":"7ffbccd1f67fe7433c92a62fefb26c2f","url":"images/2x-small-obstacle.png"},{"revision":"21a3755ddae76df50103df00d1bed437","url":"images/2x-text.png"},{"revision":"4eec8dc2c7273c07c948f14c7ab0fce9","url":"images/2x-trex.png"},{"revision":"5b3cccc2ca98bc5df5396a5f7ca46dd5","url":"images/apple-icon-180.png"},{"revision":"ab302fd1e7cdfdb8848de7b3eb63f219","url":"images/Backup/1x-cloud.png"},{"revision":"bd89ea7eb08d787ff0150dbc94122b70","url":"images/Backup/1x-large-obstacle.png"},{"revision":"d07e3fdbd4c6127a3a2da193a1c07bf6","url":"images/Backup/1x-restart.png"},{"revision":"26dea54ff9822b12b7588e06cf520c10","url":"images/Backup/1x-small-obstacle.png"},{"revision":"72c0d92df73a85b4ce2753ce2ffb08bb","url":"images/Backup/1x-text.png"},{"revision":"4107ede8f3fb66c51dac320693440546","url":"images/Backup/1x-trex.png"},{"revision":"6ea435a667ac8100ddbb4d0477f9d2f3","url":"images/Backup/2x-cloud.png"},{"revision":"8736ee591163988134175bd4f9f546bd","url":"images/Backup/2x-large-obstacle.png"},{"revision":"e131f0bfe00d65dabbe3e8b903a6537f","url":"images/Backup/2x-restart.png"},{"revision":"0c871389055a0aecedc07bf2f0630c44","url":"images/Backup/2x-small-obstacle.png"},{"revision":"21a3755ddae76df50103df00d1bed437","url":"images/Backup/2x-text.png"},{"revision":"969995bff0f0f6288f12fb5255bd430a","url":"images/Backup/2x-trex.png"},{"revision":"0097e36162264157b510a19a04ed2af0","url":"images/Dobble/1F32D.png"},{"revision":"fd5163371de5f676b0e1776c68c05935","url":"images/Dobble/1F32E.png"},{"revision":"f967568512bebf62191e5f264ac32890","url":"images/Dobble/1F33D.png"},{"revision":"4ace92ce541c56ed6ec9b60eeb7db893","url":"images/Dobble/1F344.png"},{"revision":"6acfaae3b2c73dd2c310f6f08ddcfea0","url":"images/Dobble/1F345.png"},{"revision":"b274c073cba1aef4ccdccb37404d10e3","url":"images/Dobble/1F346.png"},{"revision":"c6a34cee2e85351724a829bbffd9176d","url":"images/Dobble/1F347.png"},{"revision":"b96822cf13972923278038fc8c09427d","url":"images/Dobble/1F348.png"},{"revision":"b36ef69437e52c284f0a3fec9fbef483","url":"images/Dobble/1F349.png"},{"revision":"b84e6c008f04c67b20fc145fce3ac24c","url":"images/Dobble/1F34A.png"},{"revision":"255256c6bf037601563974e559eb818a","url":"images/Dobble/1F34B.png"},{"revision":"da2c0c3ecef0007d553bb6c9c87aaa98","url":"images/Dobble/1F34C.png"},{"revision":"c301192b256f6f57b27a8be9ab4286fb","url":"images/Dobble/1F34E.png"},{"revision":"aade527fcd77b05c07db95cc572af01d","url":"images/Dobble/1F34F.png"},{"revision":"52bedb7d7e069d8a7d5ac6bfcbd6f79b","url":"images/Dobble/1F350.png"},{"revision":"063a7a614108e311660e42b9d29386ba","url":"images/Dobble/1F351.png"},{"revision":"73a1b55c38aaec037e4fbed39297d7eb","url":"images/Dobble/1F352.png"},{"revision":"a2f3b06f71d9d1cbc1d1843b23572918","url":"images/Dobble/1F353.png"},{"revision":"df1cc570fd00c6d0a6f3139b991b11cd","url":"images/Dobble/1F354.png"},{"revision":"359c81528ba52199126a209c6aa0bedc","url":"images/Dobble/1F355.png"},{"revision":"4704e79534c117cd81f9dd945af9d88e","url":"images/Dobble/1F356.png"},{"revision":"f6d52d9df87f550403c1060120120a9d","url":"images/Dobble/1F357.png"},{"revision":"91ede22e21f9267b912f85c6450d4467","url":"images/Dobble/1F35E.png"},{"revision":"c7535759538c31d2f53fa03047d0748b","url":"images/Dobble/1F35F.png"},{"revision":"6f21180e462242a5f862a05c9773accc","url":"images/Dobble/1F366.png"},{"revision":"1565da4d876b0af97da43289a391fd0c","url":"images/Dobble/1F367.png"},{"revision":"6f2eb5ffb5585f9e8af8094dc7c712d7","url":"images/Dobble/1F368.png"},{"revision":"20d92ac7543f4d4e16016ac27f82798a","url":"images/Dobble/1F369.png"},{"revision":"56f1923fe76cd6007d2ac079295a5303","url":"images/Dobble/1F36E.png"},{"revision":"6ab1468989ec93299099eb954b35301c","url":"images/Dobble/1F370.png"},{"revision":"61f4b11b88fc6c4284c551db4822e3b7","url":"images/Dobble/1F401.png"},{"revision":"358e6a2320f7b9dd515137fbf89cb802","url":"images/Dobble/1F402.png"},{"revision":"731dbd468c17cfed7ffcd564193ce334","url":"images/Dobble/1F403.png"},{"revision":"3b3f81dd29db1944b8361a4f0b5fd57e","url":"images/Dobble/1F404.png"},{"revision":"a41da178fae6b649abb869b406eaf8a3","url":"images/Dobble/1F405.png"},{"revision":"2311ba508fd3c2a8d9365b343b5c2411","url":"images/Dobble/1F406.png"},{"revision":"10dc56fe7a102b483a719ec99a88ebcf","url":"images/Dobble/1F407.png"},{"revision":"47054b4c14c7503533df5b4efa1709d5","url":"images/Dobble/1F408.png"},{"revision":"d213440a59e3d9830ff7943093e2ce4d","url":"images/Dobble/1F411.png"},{"revision":"7be372dea0620f07111ff8ffb8c4a9a5","url":"images/Dobble/1F412.png"},{"revision":"cd854306f4fc42072c9ef3012d9a8956","url":"images/Dobble/1F413.png"},{"revision":"4637c9e0a46a3e450eaddb33fab3c886","url":"images/Dobble/1F414.png"},{"revision":"04653b20de9ecb08ec38c856d92180b7","url":"images/Dobble/1F415-200D-1F9BA.png"},{"revision":"880523e9dde85bca0482ef93214a1c1d","url":"images/Dobble/1F415.png"},{"revision":"4690f724638ed29045e5557ec1e8b41c","url":"images/Dobble/1F416.png"},{"revision":"dda9b7f30d4546d99bb6871b1076727b","url":"images/Dobble/1F417.png"},{"revision":"5130f17c291584a0e857b49b6cc8ae93","url":"images/Dobble/1F418.png"},{"revision":"ad9ffe66f24425dc2e7dd1c6363c906f","url":"images/Dobble/1F419.png"},{"revision":"0632120deeb6ef26da0ba096a261a974","url":"images/Dobble/1F420.png"},{"revision":"b0e7c601760d26230cdf1ad29a2e38bc","url":"images/Dobble/1F421.png"},{"revision":"e777ac2fecfe4818f80679f70a3855b2","url":"images/Dobble/1F422.png"},{"revision":"24ca8f3ddc2db1d63f8a37354ef95bd8","url":"images/Dobble/1F423.png"},{"revision":"b061d9f226c1175460fa79dc5c7dba6d","url":"images/Dobble/1F433.png"},{"revision":"737981f6beca8a4363d2718bc52cc7b3","url":"images/Dobble/1F434.png"},{"revision":"8d37de60d3266e36783928c47ec4ce6d","url":"images/Dobble/1F435.png"},{"revision":"96ad7f3c08e4470efe2306169324b0db","url":"images/Dobble/1F436.png"},{"revision":"83274f0d21399004d72edab0b00c659e","url":"images/Dobble/1F437.png"},{"revision":"1ff00b34944114ef8b35a39f4ac6c76d","url":"images/manifest-icon-192.png"},{"revision":"d1fa0c5d419310dc22ab5732e7f0b5e9","url":"images/manifest-icon-512.png"},{"revision":"288e85a2ea9bebb16221bff33a556793","url":"index.html"},{"revision":"16409e2dbc857b2f677971e35e6ff279","url":"js/csv.js"},{"revision":"f70a3848d2146b2a806e35919a8beab5","url":"js/csv2array.js"},{"revision":"125fc921b20963cf96182bba3751307e","url":"js/dobble.js"},{"revision":"f7a66c0736c0d081a31256655b02c246","url":"js/dygraph.min.js"},{"revision":"1b53f318b98a18b6e65df7d5ead1378c","url":"js/earthing.js"},{"revision":"70116142c1da69d916e84f844b0109d1","url":"js/electools.js"},{"revision":"787e391f10f53e40ce1fe4bd46fc7ad2","url":"js/emc.js"},{"revision":"0b2124db8f49aff3c421389d81260ec0","url":"js/fault.js"},{"revision":"2f680be65f869317062e8bda1df4aec4","url":"js/html2canvas.min.js"},{"revision":"956aaeb005bc381768cc5ac4c50d22f1","url":"js/index.js"},{"revision":"99af5f204329d0ceb7fc99fc7633bb29","url":"js/init.js"},{"revision":"3fe0200eeb7ef8a80e31834069e37bd4","url":"js/jquery.dropotron.min.js"},{"revision":"b61aa6e2d68d21b3546b5b418bf0e9c3","url":"js/jquery.min.js"},{"revision":"b67be8326fe4a2cfafb9399555daae31","url":"js/memory.js"},{"revision":"898c8a23a78326f33f5eacd01c09f890","url":"js/mole.js"},{"revision":"6ada0eefe18b573a809be667b7969ecd","url":"js/moment.js"},{"revision":"6b380bfd76af7b78e115ffdc0ba31e27","url":"js/mortgage.js"},{"revision":"33eb8762f4141345a9ed0b5ea9358c24","url":"js/mortgage2.js"},{"revision":"4e725f923dc0bb79991173dca2ef0fbc","url":"js/op.js"},{"revision":"31337ffc03d0b718660f6df0bbb0d1ee","url":"js/papaparse.js"},{"revision":"a4a2924d397d9078016ef6b3ff22d8b6","url":"js/piano.js"},{"revision":"86aa674857f5a2779b6a09824cbe147d","url":"js/relay.js"},{"revision":"7fca779a6ce163fdadfac6ba7381b9d8","url":"js/scores.js"},{"revision":"20d5f2a41f81bc497603e8d65539ec53","url":"js/skel-layers.min.js"},{"revision":"f775551e032f17e0c7044f45f4b8fe9c","url":"js/skel.min.js"},{"revision":"708f41730cbc02d6b4351b54bb266abd","url":"js/soil.js"},{"revision":"ae9bebb6c0a7f3d7268acbf64aeec05e","url":"js/tictactoe.js"},{"revision":"132b3bd81f66608424db997f8b4c05e1","url":"js/trex.js"},{"revision":"083620190ca03e2a37fb9de42e21166a","url":"js/worker.js"},{"revision":"0a5355aee7f1d37df181e9fbdfefe27f","url":"js/xlsx.core.min.js"},{"revision":"78fca0df75b5801339c2a392711f68df","url":"manifest.json"},{"revision":"30822525e6565fac998abd8c0dc8c082","url":"memory.html"},{"revision":"e2b32aea5dfaa8abaa2e93a552cbac67","url":"mole.html"},{"revision":"a1e23929104e885572f674c461d266e3","url":"mortgage.html"},{"revision":"5830835857ea56fb4dbbddeb864487f2","url":"mortgage2.html"},{"revision":"39c350c83c66225cf81f7f76a0720f8a","url":"op.html"},{"revision":"4c7a5472637d6e9d1ba4cfd5f8acca36","url":"Orion Park/ExcelConverter.js"},{"revision":"7a1caebfa0d40dc65049aa07e19e1e1d","url":"Orion Park/op-Delivery.csv"},{"revision":"b643c769d78c3442f5a4c7810675bcdd","url":"Orion Park/op-Project Stock.csv"},{"revision":"592a4ebce4ccb38f05f92fe09a9f99ab","url":"Orion Park/op-Warehouse Stock .csv"},{"revision":"17a46584070fb5ef1eace64dd73c945f","url":"piano.html"},{"revision":"5d9075c1d85a27e0520ac8a1d88e991b","url":"relay.html"},{"revision":"6cf49543cad9e47a8f08099838331853","url":"savesettings.php"},{"revision":"ebd2c8dd31bc5f9a14936fb543fdf18f","url":"saveSoil.php"},{"revision":"d92f08bb881cedbe3f1528b30de4fc86","url":"soil.html"},{"revision":"3b366e5fec571884a8fac361637be271","url":"soildb.php"},{"revision":"d442695f2b91a99c447eedbff11eea24","url":"tictactoe.html"},{"revision":"69d52d83aaea261d07464abec7200ed1","url":"tools.html"},{"revision":"200248b745bc6fd70f17f5feb2bafc20","url":"uploads/dobblescores.json"},{"revision":"27d9c94305319af1969e6d2f9aebf0cb","url":"uploads/fault.csv"},{"revision":"41d8f065513b22402b3be4a4880e0adc","url":"uploads/fop.json"},{"revision":"3aa377891e76b18953b5f14dee0edd1c","url":"uploads/graph.csv"},{"revision":"00bd1e0148449f4e4fbfb712485da7f3","url":"uploads/molescores.json"},{"revision":"34788a3d806089acde74e374d0327b40","url":"uploads/relay.csv"},{"revision":"8709eb8aace4a6deee7e3923ad192d7a","url":"uploads/scores.json"},{"revision":"d954687b5f704066f05c0b55e6345c17","url":"uploads/simonscores.json"},{"revision":"85133bbf149cbf33ee8e7ede79aefa35","url":"uploads/soil.json"}],{
  // Ignore all URL parameters.
  ignoreURLParametersMatching: [/.*/] //taking this out for now since I want to use ?beta
});

// Register 'default'
var defaultStrategy = new CacheFirst({
    cacheName: workbox.core.cacheNames.precache,//'workbox-precache-v2',//
    plugins: [
		{cacheKeyWillBeUsed},
        new ExpirationPlugin({
            maxEntries: 128,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
            purgeOnQuotaError: true, // Opt-in to automatic cleanup
        }),
        new CacheableResponsePlugin({
            statuses: [0, 200] // for opague requests
        }),
    ],
});
setDefaultHandler(
    (args) => {
        if (args.event.request.method === 'GET') {
            return defaultStrategy.handle(args); // use default strategy
        }
        return fetch(args.event.request);
    }
);

// Catch routing errors, like if the user is offline
setCatchHandler(async ({ event }) => {
  // Return the precached offline page if a document is being requested
  if (event.request.destination === 'document') {
    return matchPrecache('/help.html');
  }

  return Response.error();
});