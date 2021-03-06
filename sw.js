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
precache([{"revision":"0db46859d74dc43ef8f615e95cb12855","url":"css/dobble.css"},{"revision":"5acbaa7e15b06c9316442bffa9f10e79","url":"css/main-style.css"},{"revision":"30285411940a8432346796cb906a07f4","url":"css/memory.css"},{"revision":"197e5905c14e03d3de31b89fd154bbe4","url":"css/molestyle.css"},{"revision":"6ac282e90ad27d8cdb98ae7d891e6923","url":"css/piano.css"},{"revision":"98ca1c54bdb2e620973fcd219401bc2e","url":"css/tictactoe.css"},{"revision":"84473425c5cd47606ca5309c352477db","url":"csv.html"},{"revision":"3a4ddb241c32a372d7746ef0d2ba0882","url":"dobble.html"},{"revision":"462f5af9b977db1297cedeeea32cc267","url":"earth.html"},{"revision":"e014e7c29e0c85404c199e6813faa8df","url":"emc.html"},{"revision":"9a37547ad2caa9c947ed3021111e5399","url":"fault.html"},{"revision":"634f2d3572e0e6459bb9ae939e921541","url":"favicon.ico"},{"revision":"b2b96690270c52499240b06873dc9090","url":"fullscores.php"},{"revision":"f8953e2be8887b3ab85fe6da08606b00","url":"help.html"},{"revision":"ab302fd1e7cdfdb8848de7b3eb63f219","url":"images/1x-cloud.png"},{"revision":"4c877a0e746d516701822909acafe1f7","url":"images/1x-large-obstacle.png"},{"revision":"d07e3fdbd4c6127a3a2da193a1c07bf6","url":"images/1x-restart.png"},{"revision":"0803e0b0d16ffdb63cd635c1ed9ba1c2","url":"images/1x-small-obstacle.png"},{"revision":"62e9f046dd6a2bdc9bc67d41089889bb","url":"images/1x-text.png"},{"revision":"3821598e8cc05f1be190b70debb9be20","url":"images/1x-trex.png"},{"revision":"6ea435a667ac8100ddbb4d0477f9d2f3","url":"images/2x-cloud.png"},{"revision":"4ec190238496701c24728115070002fb","url":"images/2x-large-obstacle.png"},{"revision":"e131f0bfe00d65dabbe3e8b903a6537f","url":"images/2x-restart.png"},{"revision":"9834d7f1df7a91d69bf515ae754b036c","url":"images/2x-small-obstacle.png"},{"revision":"554ead4049a3e0412c54310fa287f0cc","url":"images/2x-text.png"},{"revision":"66e03818ed8fa94d66fd80d5eb1468df","url":"images/2x-trex.png"},{"revision":"0200bfa4f1809c93e257458d848b248f","url":"images/apple-icon-180.png"},{"revision":"ab302fd1e7cdfdb8848de7b3eb63f219","url":"images/Backup/1x-cloud.png"},{"revision":"b8d9453bd6b716988dae130eb3c545f4","url":"images/Backup/1x-large-obstacle.png"},{"revision":"d07e3fdbd4c6127a3a2da193a1c07bf6","url":"images/Backup/1x-restart.png"},{"revision":"3df95d99ab944269098a2dbcb06219b1","url":"images/Backup/1x-small-obstacle.png"},{"revision":"a7bb119b374f04846a92efd6a9cd4ae6","url":"images/Backup/1x-text.png"},{"revision":"c3a483148f907c3aacc085b02f887e4f","url":"images/Backup/1x-trex.png"},{"revision":"6ea435a667ac8100ddbb4d0477f9d2f3","url":"images/Backup/2x-cloud.png"},{"revision":"edca823143fe8979b110d8174e4f21b9","url":"images/Backup/2x-large-obstacle.png"},{"revision":"e131f0bfe00d65dabbe3e8b903a6537f","url":"images/Backup/2x-restart.png"},{"revision":"f202ee6c5527b5521c2a41dcf626db2c","url":"images/Backup/2x-small-obstacle.png"},{"revision":"ee4f2e8c2bd5de74ae36db5ac5038644","url":"images/Backup/2x-text.png"},{"revision":"a1a8edcc7b269922d9d27dfe5d896ec3","url":"images/Backup/2x-trex.png"},{"revision":"0097e36162264157b510a19a04ed2af0","url":"images/Dobble/1F32D.png"},{"revision":"fd5163371de5f676b0e1776c68c05935","url":"images/Dobble/1F32E.png"},{"revision":"f967568512bebf62191e5f264ac32890","url":"images/Dobble/1F33D.png"},{"revision":"4ace92ce541c56ed6ec9b60eeb7db893","url":"images/Dobble/1F344.png"},{"revision":"6acfaae3b2c73dd2c310f6f08ddcfea0","url":"images/Dobble/1F345.png"},{"revision":"b274c073cba1aef4ccdccb37404d10e3","url":"images/Dobble/1F346.png"},{"revision":"c6a34cee2e85351724a829bbffd9176d","url":"images/Dobble/1F347.png"},{"revision":"b96822cf13972923278038fc8c09427d","url":"images/Dobble/1F348.png"},{"revision":"b36ef69437e52c284f0a3fec9fbef483","url":"images/Dobble/1F349.png"},{"revision":"b84e6c008f04c67b20fc145fce3ac24c","url":"images/Dobble/1F34A.png"},{"revision":"255256c6bf037601563974e559eb818a","url":"images/Dobble/1F34B.png"},{"revision":"da2c0c3ecef0007d553bb6c9c87aaa98","url":"images/Dobble/1F34C.png"},{"revision":"c301192b256f6f57b27a8be9ab4286fb","url":"images/Dobble/1F34E.png"},{"revision":"aade527fcd77b05c07db95cc572af01d","url":"images/Dobble/1F34F.png"},{"revision":"52bedb7d7e069d8a7d5ac6bfcbd6f79b","url":"images/Dobble/1F350.png"},{"revision":"063a7a614108e311660e42b9d29386ba","url":"images/Dobble/1F351.png"},{"revision":"73a1b55c38aaec037e4fbed39297d7eb","url":"images/Dobble/1F352.png"},{"revision":"a2f3b06f71d9d1cbc1d1843b23572918","url":"images/Dobble/1F353.png"},{"revision":"df1cc570fd00c6d0a6f3139b991b11cd","url":"images/Dobble/1F354.png"},{"revision":"359c81528ba52199126a209c6aa0bedc","url":"images/Dobble/1F355.png"},{"revision":"4704e79534c117cd81f9dd945af9d88e","url":"images/Dobble/1F356.png"},{"revision":"f6d52d9df87f550403c1060120120a9d","url":"images/Dobble/1F357.png"},{"revision":"91ede22e21f9267b912f85c6450d4467","url":"images/Dobble/1F35E.png"},{"revision":"c7535759538c31d2f53fa03047d0748b","url":"images/Dobble/1F35F.png"},{"revision":"6f21180e462242a5f862a05c9773accc","url":"images/Dobble/1F366.png"},{"revision":"1565da4d876b0af97da43289a391fd0c","url":"images/Dobble/1F367.png"},{"revision":"6f2eb5ffb5585f9e8af8094dc7c712d7","url":"images/Dobble/1F368.png"},{"revision":"20d92ac7543f4d4e16016ac27f82798a","url":"images/Dobble/1F369.png"},{"revision":"56f1923fe76cd6007d2ac079295a5303","url":"images/Dobble/1F36E.png"},{"revision":"6ab1468989ec93299099eb954b35301c","url":"images/Dobble/1F370.png"},{"revision":"61f4b11b88fc6c4284c551db4822e3b7","url":"images/Dobble/1F401.png"},{"revision":"358e6a2320f7b9dd515137fbf89cb802","url":"images/Dobble/1F402.png"},{"revision":"731dbd468c17cfed7ffcd564193ce334","url":"images/Dobble/1F403.png"},{"revision":"3b3f81dd29db1944b8361a4f0b5fd57e","url":"images/Dobble/1F404.png"},{"revision":"a41da178fae6b649abb869b406eaf8a3","url":"images/Dobble/1F405.png"},{"revision":"2311ba508fd3c2a8d9365b343b5c2411","url":"images/Dobble/1F406.png"},{"revision":"10dc56fe7a102b483a719ec99a88ebcf","url":"images/Dobble/1F407.png"},{"revision":"47054b4c14c7503533df5b4efa1709d5","url":"images/Dobble/1F408.png"},{"revision":"d213440a59e3d9830ff7943093e2ce4d","url":"images/Dobble/1F411.png"},{"revision":"7be372dea0620f07111ff8ffb8c4a9a5","url":"images/Dobble/1F412.png"},{"revision":"cd854306f4fc42072c9ef3012d9a8956","url":"images/Dobble/1F413.png"},{"revision":"4637c9e0a46a3e450eaddb33fab3c886","url":"images/Dobble/1F414.png"},{"revision":"04653b20de9ecb08ec38c856d92180b7","url":"images/Dobble/1F415-200D-1F9BA.png"},{"revision":"880523e9dde85bca0482ef93214a1c1d","url":"images/Dobble/1F415.png"},{"revision":"4690f724638ed29045e5557ec1e8b41c","url":"images/Dobble/1F416.png"},{"revision":"dda9b7f30d4546d99bb6871b1076727b","url":"images/Dobble/1F417.png"},{"revision":"5130f17c291584a0e857b49b6cc8ae93","url":"images/Dobble/1F418.png"},{"revision":"ad9ffe66f24425dc2e7dd1c6363c906f","url":"images/Dobble/1F419.png"},{"revision":"0632120deeb6ef26da0ba096a261a974","url":"images/Dobble/1F420.png"},{"revision":"b0e7c601760d26230cdf1ad29a2e38bc","url":"images/Dobble/1F421.png"},{"revision":"e777ac2fecfe4818f80679f70a3855b2","url":"images/Dobble/1F422.png"},{"revision":"24ca8f3ddc2db1d63f8a37354ef95bd8","url":"images/Dobble/1F423.png"},{"revision":"b061d9f226c1175460fa79dc5c7dba6d","url":"images/Dobble/1F433.png"},{"revision":"737981f6beca8a4363d2718bc52cc7b3","url":"images/Dobble/1F434.png"},{"revision":"8d37de60d3266e36783928c47ec4ce6d","url":"images/Dobble/1F435.png"},{"revision":"96ad7f3c08e4470efe2306169324b0db","url":"images/Dobble/1F436.png"},{"revision":"83274f0d21399004d72edab0b00c659e","url":"images/Dobble/1F437.png"},{"revision":"941eb76fa681faa7ee39661b1d3d3678","url":"images/manifest-icon-192.png"},{"revision":"d60307528db40e8c6a32cbc9d2818c7e","url":"images/manifest-icon-512.png"},{"revision":"9e880a3b57aa48bb7d7a6aa1e28a4223","url":"index.html"},{"revision":"4508dcc523d768c3f97fc31473bd7ff2","url":"js/csv.js"},{"revision":"606da553557f429cd00f7bd04eb10e2d","url":"js/dobble.js"},{"revision":"b4f3ec4f75c8b41f625ff8be545edf6d","url":"js/earthing.js"},{"revision":"70116142c1da69d916e84f844b0109d1","url":"js/electools.js"},{"revision":"6e4a1347d0203e20423c7f7ce9b039c6","url":"js/emc.js"},{"revision":"f70a3848d2146b2a806e35919a8beab5","url":"js/ext/csv2array.js"},{"revision":"f7a66c0736c0d081a31256655b02c246","url":"js/ext/dygraph.min.js"},{"revision":"2f680be65f869317062e8bda1df4aec4","url":"js/ext/html2canvas.min.js"},{"revision":"5b80ef8ec1ba656aa127ea7ad4e89078","url":"js/ext/papaparse.js"},{"revision":"0a5355aee7f1d37df181e9fbdfefe27f","url":"js/ext/xlsx.core.min.js"},{"revision":"ca06afcba960f025f6c9c6953b77b9c1","url":"js/fault.js"},{"revision":"2f8b85063cb016641850630b6b575798","url":"js/index.js"},{"revision":"82a475e5b01edf465021b92eb33b8613","url":"js/init.js"},{"revision":"74d22466698f82f6f5d10a49904f4fd5","url":"js/memory.js"},{"revision":"1c30e2c5735f3cd8f6d2c1d4ed3676be","url":"js/mole.js"},{"revision":"b30b3b59f938ee426a18595bab566967","url":"js/mortgage.js"},{"revision":"a75be07e5cffcb838ab5bdb15b4f6292","url":"js/mortgage2.js"},{"revision":"ef2beed14373a4b96f42d2fac45b3e0c","url":"js/op.js"},{"revision":"a4a2924d397d9078016ef6b3ff22d8b6","url":"js/piano.js"},{"revision":"5fbaee2d4456d45984c3a4190718a917","url":"js/relay.js"},{"revision":"c32b635d15e7fdfd3a6e21a165d2434b","url":"js/scores.js"},{"revision":"b694de13a20299c6c705adb297a58e59","url":"js/soil.js"},{"revision":"235b2e6bca8a899a7ea8f0e425470fd8","url":"js/tictactoe.js"},{"revision":"5eb427f660934752e0e2c1e1bcce1fe7","url":"js/trex.js"},{"revision":"083620190ca03e2a37fb9de42e21166a","url":"js/worker.js"},{"revision":"78fca0df75b5801339c2a392711f68df","url":"manifest.json"},{"revision":"8e3d44c6ca6ed2df30a1d122adc1d044","url":"memory.html"},{"revision":"d5531b2a0c9f2100ce58751b3dfb840d","url":"mole.html"},{"revision":"60bc1ce08f797079235bd5f956202c62","url":"mortgage.html"},{"revision":"31c63a9702902046510658c0476cf782","url":"mortgage2.html"},{"revision":"875e6acd6a72bf80d015add781864505","url":"op.html"},{"revision":"4c7a5472637d6e9d1ba4cfd5f8acca36","url":"Orion Park/ExcelConverter.js"},{"revision":"9bcf71423ab65c909d63a0c3dfbd8efe","url":"Orion Park/op-Delivery.csv"},{"revision":"b643c769d78c3442f5a4c7810675bcdd","url":"Orion Park/op-Project Stock.csv"},{"revision":"592a4ebce4ccb38f05f92fe09a9f99ab","url":"Orion Park/op-Warehouse Stock .csv"},{"revision":"c806a27a2fb8e86ca1ffa3be351c89d0","url":"piano.html"},{"revision":"b0858631af5f201acae32708cd712dc3","url":"relay.html"},{"revision":"d8285d00279cf228a669ff8f9ba2f0d8","url":"savesettings.php"},{"revision":"517206cf5e94eec3c7c37c7cf957841d","url":"saveSoil.php"},{"revision":"43ab5f972f262773232dbc200aa4d567","url":"soil.html"},{"revision":"39cd418598ec280efac62ab3286fce67","url":"soildb.php"},{"revision":"22ff20fe92b207f305ab878d8df5fd8f","url":"tictactoe.html"},{"revision":"9ed8ca225f905af1899b818d9fee3797","url":"tools.html"},{"revision":"98205456949eff378cce1d6e34734a28","url":"uploads/dobblescores.json"},{"revision":"27d9c94305319af1969e6d2f9aebf0cb","url":"uploads/fault.csv"},{"revision":"41d8f065513b22402b3be4a4880e0adc","url":"uploads/fop.json"},{"revision":"3aa377891e76b18953b5f14dee0edd1c","url":"uploads/graph.csv"},{"revision":"20693f6174dde24acf354df0b484f467","url":"uploads/molescores.json"},{"revision":"34788a3d806089acde74e374d0327b40","url":"uploads/relay.csv"},{"revision":"dc9ee24d4b5f1d1b57899ab8099acc89","url":"uploads/rexscores.json"},{"revision":"d751713988987e9331980363e24189ce","url":"uploads/scores.json"},{"revision":"044bc36203b60b2dca433347fd21dd77","url":"uploads/simonscores.json"},{"revision":"85133bbf149cbf33ee8e7ede79aefa35","url":"uploads/soil.json"}],{
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