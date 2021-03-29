importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js');

const {precacheAndRoute, precache, matchPrecache} = workbox.precaching;
const {registerRoute, setCatchHandler, setDefaultHandler} = workbox.routing;
const {CacheFirst, StaleWhileRevalidate, NetworkFirst} = workbox.strategies;
const {CacheableResponse, CacheableResponsePlugin} = workbox.cacheableResponse;
const {ExpirationPlugin} = workbox.expiration;
//const googleAnalytics = workbox.googleAnalytics;
//googleAnalytics.initialize(); //"Uses too much storage, not worth it.

async function cacheKeyWillBeUsed({request, mode}) {
  const url = new URL(request.url);
  return url.origin + url.pathname;
  // Any search params or hash will be left out.
}

const plugExp = [
  {cacheKeyWillBeUsed},
  new CacheableResponsePlugin({
    statuses: [200],
  }),
  new ExpirationPlugin({
    maxEntries: 60,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
  }),
];

const plugStand = [
  {cacheKeyWillBeUsed}, //same as above
  new CacheableResponsePlugin({
    statuses: [200],
  }),
];

function newRoute(inputs) {
  let {str,name,plugs,strat,typ} = inputs;
  let straTegy = strat === `cache`
    ? new CacheFirst({cacheName: name,plugins: plugs,})
    : strat === `stale`
    ? new StaleWhileRevalidate({cacheName: name,plugins: plugs,})
    : new NetworkFirst({networkTimeoutSeconds: 3,cacheName: name,plugins: plugs,});
  let type = typ === `request`
    ? ({request}) => request.destination === str
    : typ === `url`
    ? ({url}) => url.pathname.endsWith(str)
    : typ === `urlStart`
    ? ({url}) => url.pathname.startsWith(str)
    : ({url}) => url.pathname.endsWith(str[0]) || url.pathname.endsWith(str[1])
  registerRoute(type, straTegy);
}

newRoute({str: `image`, name: `images`, plugs: plugExp, strat: `cache`, typ: `request`});
newRoute({str: `style`, name: `css`, plugs: plugStand, strat: `net`, typ: `request`});
newRoute({str: `/js/ext/`, name: `exScripts`, plugs: plugExp, strat: `cache`, typ: `urlStart`});
newRoute({str: `script`, name: `scripts`, plugs: plugStand, strat: `net`, typ: `request`});
newRoute({str: [`.html`,`.php`], name: `html`, plugs: plugStand, strat: `net`, typ: `url2`});
newRoute({str: [`.csv`,`.xlsx`], name: `spreadsheets`, plugs: plugStand, strat: `stale`, typ: `url2`});
newRoute({str: `.json`, name: `json`, plugs: plugStand, strat: `net`, typ: `url`});

// Use the imported Workbox libraries to implement caching,
// routing, and other logic:
precache([{"revision":"c7cef26d0d15d3d2e90fa66b06c5cc9c","url":"css/dobble.css"},{"revision":"18770cc22d8b67dafde9c6ceb41329e2","url":"css/dygraph.css"},{"revision":"062bfb1401aa1ec65d9ad6c62c541e4d","url":"css/main-style.css"},{"revision":"1dcfc940903ca206101a799d17554192","url":"css/memory.css"},{"revision":"93583dde4274f4bcbab43b14589c16aa","url":"css/molestyle.css"},{"revision":"6ac282e90ad27d8cdb98ae7d891e6923","url":"css/piano.css"},{"revision":"ceb527c80b7ef9d5fa03154e971cfcf0","url":"css/tictactoe.css"},{"revision":"641497a49c7ff36491a2f80afa0d9b1a","url":"css/trekt.css"},{"revision":"3c0047bfb63e8ee4dbf3ab96b804ea57","url":"csv.html"},{"revision":"21a7068a87ef08656ac7e137cfe2eca3","url":"dobble.html"},{"revision":"7f8fdecf44801b80cae51092399da03b","url":"downloads/Polar Addition.xlsx"},{"revision":"f6c77677fde881c02b6c64ad0d4ea59c","url":"earth.html"},{"revision":"20e010c0ee5d796ac64809ba636c2bf1","url":"emc.html"},{"revision":"44414338dd282b1618bcf6b9d2def058","url":"fault.html"},{"revision":"634f2d3572e0e6459bb9ae939e921541","url":"favicon.ico"},{"revision":"962ca8288eafbb53093eea11db621ffa","url":"fullscores.html"},{"revision":"cf59638fc1215181f60dc1d2d29f5a2c","url":"help.html"},{"revision":"ab302fd1e7cdfdb8848de7b3eb63f219","url":"images/1x-cloud.png"},{"revision":"4c877a0e746d516701822909acafe1f7","url":"images/1x-large-obstacle.png"},{"revision":"d07e3fdbd4c6127a3a2da193a1c07bf6","url":"images/1x-restart.png"},{"revision":"0803e0b0d16ffdb63cd635c1ed9ba1c2","url":"images/1x-small-obstacle.png"},{"revision":"62e9f046dd6a2bdc9bc67d41089889bb","url":"images/1x-text.png"},{"revision":"3821598e8cc05f1be190b70debb9be20","url":"images/1x-trex.png"},{"revision":"6ea435a667ac8100ddbb4d0477f9d2f3","url":"images/2x-cloud.png"},{"revision":"4ec190238496701c24728115070002fb","url":"images/2x-large-obstacle.png"},{"revision":"e131f0bfe00d65dabbe3e8b903a6537f","url":"images/2x-restart.png"},{"revision":"9834d7f1df7a91d69bf515ae754b036c","url":"images/2x-small-obstacle.png"},{"revision":"554ead4049a3e0412c54310fa287f0cc","url":"images/2x-text.png"},{"revision":"66e03818ed8fa94d66fd80d5eb1468df","url":"images/2x-trex.png"},{"revision":"0200bfa4f1809c93e257458d848b248f","url":"images/apple-icon-180.png"},{"revision":"ab302fd1e7cdfdb8848de7b3eb63f219","url":"images/Backup/1x-cloud.png"},{"revision":"b8d9453bd6b716988dae130eb3c545f4","url":"images/Backup/1x-large-obstacle.png"},{"revision":"d07e3fdbd4c6127a3a2da193a1c07bf6","url":"images/Backup/1x-restart.png"},{"revision":"3df95d99ab944269098a2dbcb06219b1","url":"images/Backup/1x-small-obstacle.png"},{"revision":"a7bb119b374f04846a92efd6a9cd4ae6","url":"images/Backup/1x-text.png"},{"revision":"c3a483148f907c3aacc085b02f887e4f","url":"images/Backup/1x-trex.png"},{"revision":"6ea435a667ac8100ddbb4d0477f9d2f3","url":"images/Backup/2x-cloud.png"},{"revision":"edca823143fe8979b110d8174e4f21b9","url":"images/Backup/2x-large-obstacle.png"},{"revision":"e131f0bfe00d65dabbe3e8b903a6537f","url":"images/Backup/2x-restart.png"},{"revision":"f202ee6c5527b5521c2a41dcf626db2c","url":"images/Backup/2x-small-obstacle.png"},{"revision":"ee4f2e8c2bd5de74ae36db5ac5038644","url":"images/Backup/2x-text.png"},{"revision":"a1a8edcc7b269922d9d27dfe5d896ec3","url":"images/Backup/2x-trex.png"},{"revision":"0097e36162264157b510a19a04ed2af0","url":"images/Dobble/1F32D.png"},{"revision":"fd5163371de5f676b0e1776c68c05935","url":"images/Dobble/1F32E.png"},{"revision":"f967568512bebf62191e5f264ac32890","url":"images/Dobble/1F33D.png"},{"revision":"4ace92ce541c56ed6ec9b60eeb7db893","url":"images/Dobble/1F344.png"},{"revision":"6acfaae3b2c73dd2c310f6f08ddcfea0","url":"images/Dobble/1F345.png"},{"revision":"b274c073cba1aef4ccdccb37404d10e3","url":"images/Dobble/1F346.png"},{"revision":"c6a34cee2e85351724a829bbffd9176d","url":"images/Dobble/1F347.png"},{"revision":"b96822cf13972923278038fc8c09427d","url":"images/Dobble/1F348.png"},{"revision":"b36ef69437e52c284f0a3fec9fbef483","url":"images/Dobble/1F349.png"},{"revision":"b84e6c008f04c67b20fc145fce3ac24c","url":"images/Dobble/1F34A.png"},{"revision":"255256c6bf037601563974e559eb818a","url":"images/Dobble/1F34B.png"},{"revision":"da2c0c3ecef0007d553bb6c9c87aaa98","url":"images/Dobble/1F34C.png"},{"revision":"c301192b256f6f57b27a8be9ab4286fb","url":"images/Dobble/1F34E.png"},{"revision":"aade527fcd77b05c07db95cc572af01d","url":"images/Dobble/1F34F.png"},{"revision":"52bedb7d7e069d8a7d5ac6bfcbd6f79b","url":"images/Dobble/1F350.png"},{"revision":"063a7a614108e311660e42b9d29386ba","url":"images/Dobble/1F351.png"},{"revision":"73a1b55c38aaec037e4fbed39297d7eb","url":"images/Dobble/1F352.png"},{"revision":"a2f3b06f71d9d1cbc1d1843b23572918","url":"images/Dobble/1F353.png"},{"revision":"df1cc570fd00c6d0a6f3139b991b11cd","url":"images/Dobble/1F354.png"},{"revision":"359c81528ba52199126a209c6aa0bedc","url":"images/Dobble/1F355.png"},{"revision":"4704e79534c117cd81f9dd945af9d88e","url":"images/Dobble/1F356.png"},{"revision":"f6d52d9df87f550403c1060120120a9d","url":"images/Dobble/1F357.png"},{"revision":"91ede22e21f9267b912f85c6450d4467","url":"images/Dobble/1F35E.png"},{"revision":"c7535759538c31d2f53fa03047d0748b","url":"images/Dobble/1F35F.png"},{"revision":"6f21180e462242a5f862a05c9773accc","url":"images/Dobble/1F366.png"},{"revision":"1565da4d876b0af97da43289a391fd0c","url":"images/Dobble/1F367.png"},{"revision":"6f2eb5ffb5585f9e8af8094dc7c712d7","url":"images/Dobble/1F368.png"},{"revision":"20d92ac7543f4d4e16016ac27f82798a","url":"images/Dobble/1F369.png"},{"revision":"56f1923fe76cd6007d2ac079295a5303","url":"images/Dobble/1F36E.png"},{"revision":"6ab1468989ec93299099eb954b35301c","url":"images/Dobble/1F370.png"},{"revision":"61f4b11b88fc6c4284c551db4822e3b7","url":"images/Dobble/1F401.png"},{"revision":"358e6a2320f7b9dd515137fbf89cb802","url":"images/Dobble/1F402.png"},{"revision":"731dbd468c17cfed7ffcd564193ce334","url":"images/Dobble/1F403.png"},{"revision":"3b3f81dd29db1944b8361a4f0b5fd57e","url":"images/Dobble/1F404.png"},{"revision":"a41da178fae6b649abb869b406eaf8a3","url":"images/Dobble/1F405.png"},{"revision":"2311ba508fd3c2a8d9365b343b5c2411","url":"images/Dobble/1F406.png"},{"revision":"10dc56fe7a102b483a719ec99a88ebcf","url":"images/Dobble/1F407.png"},{"revision":"47054b4c14c7503533df5b4efa1709d5","url":"images/Dobble/1F408.png"},{"revision":"d213440a59e3d9830ff7943093e2ce4d","url":"images/Dobble/1F411.png"},{"revision":"7be372dea0620f07111ff8ffb8c4a9a5","url":"images/Dobble/1F412.png"},{"revision":"cd854306f4fc42072c9ef3012d9a8956","url":"images/Dobble/1F413.png"},{"revision":"4637c9e0a46a3e450eaddb33fab3c886","url":"images/Dobble/1F414.png"},{"revision":"04653b20de9ecb08ec38c856d92180b7","url":"images/Dobble/1F415-200D-1F9BA.png"},{"revision":"880523e9dde85bca0482ef93214a1c1d","url":"images/Dobble/1F415.png"},{"revision":"4690f724638ed29045e5557ec1e8b41c","url":"images/Dobble/1F416.png"},{"revision":"dda9b7f30d4546d99bb6871b1076727b","url":"images/Dobble/1F417.png"},{"revision":"5130f17c291584a0e857b49b6cc8ae93","url":"images/Dobble/1F418.png"},{"revision":"ad9ffe66f24425dc2e7dd1c6363c906f","url":"images/Dobble/1F419.png"},{"revision":"0632120deeb6ef26da0ba096a261a974","url":"images/Dobble/1F420.png"},{"revision":"b0e7c601760d26230cdf1ad29a2e38bc","url":"images/Dobble/1F421.png"},{"revision":"e777ac2fecfe4818f80679f70a3855b2","url":"images/Dobble/1F422.png"},{"revision":"24ca8f3ddc2db1d63f8a37354ef95bd8","url":"images/Dobble/1F423.png"},{"revision":"b061d9f226c1175460fa79dc5c7dba6d","url":"images/Dobble/1F433.png"},{"revision":"737981f6beca8a4363d2718bc52cc7b3","url":"images/Dobble/1F434.png"},{"revision":"8d37de60d3266e36783928c47ec4ce6d","url":"images/Dobble/1F435.png"},{"revision":"96ad7f3c08e4470efe2306169324b0db","url":"images/Dobble/1F436.png"},{"revision":"83274f0d21399004d72edab0b00c659e","url":"images/Dobble/1F437.png"},{"revision":"b6661a3b9b464dacdcac88ce0e00c03c","url":"images/fall-of-potential.svg"},{"revision":"941eb76fa681faa7ee39661b1d3d3678","url":"images/manifest-icon-192.png"},{"revision":"d60307528db40e8c6a32cbc9d2818c7e","url":"images/manifest-icon-512.png"},{"revision":"e2b046e2d45c46bdaaa33eb054017d04","url":"images/soil-resistivity.svg"},{"revision":"26c6379b9c4e368a9291394bdbbcb72b","url":"index.html"},{"revision":"5c43fbcdd3813cb6e00e86ac9f4b12c1","url":"js/csv.js"},{"revision":"ddd6fa7f80edf6eb2cc1f32214762da8","url":"js/dobble.js"},{"revision":"c28b87f8a4494e4b914636a7459b2b7c","url":"js/earthing.js"},{"revision":"0ce6ac5763375fa499f1836d79648316","url":"js/electools.js"},{"revision":"7f859659a6785a3671c75f101ebd0c82","url":"js/emc.js"},{"revision":"eeca827406a41f88e5159f00b8267dc8","url":"js/ext/config/TeX-MML-AM_CHTML.js"},{"revision":"f7a66c0736c0d081a31256655b02c246","url":"js/ext/dygraph.min.js"},{"revision":"2f680be65f869317062e8bda1df4aec4","url":"js/ext/html2canvas.min.js"},{"revision":"ac1453d42e7816bbe08e88d38cca957d","url":"js/ext/jax/element/mml/optable/GreekAndCoptic.js"},{"revision":"7193c88024ed47b6cecf0e4498aa9046","url":"js/ext/jax/output/CommonHTML/autoload/multiline.js"},{"revision":"565fc77735b52684eae2818b1ead1247","url":"js/ext/jax/output/CommonHTML/fonts/TeX/fontdata.js"},{"revision":"3c26008a16608fa3f3897c578ad4de9a","url":"js/ext/jax/output/CommonHTML/jax.js"},{"revision":"7a3737a82ea79217ebe20f896bceb623","url":"js/ext/MathJax.js"},{"revision":"5b80ef8ec1ba656aa127ea7ad4e89078","url":"js/ext/papaparse.js"},{"revision":"efc4b0df64cc7fcdaf2d2eb6b2c10ca3","url":"js/fault.js"},{"revision":"b45c54933f8b528208b03de1a9632168","url":"js/index.js"},{"revision":"4911c333124411a3deb98d957eca321c","url":"js/init.js"},{"revision":"952d8ce9a9eb716b9e3e967a8ca4d92c","url":"js/memory.js"},{"revision":"f2f7e4bff53747a0f6792f13ce147f70","url":"js/mole.js"},{"revision":"85ebe0e9f58c9594f5ac4a1a4fbae3c8","url":"js/mortgage.js"},{"revision":"ba367b340759f13670d1d002eb060f18","url":"js/mortgage2.js"},{"revision":"3873779eaaf76b07d73a9fbce07385a8","url":"js/op.js"},{"revision":"aa49f51d9a6cb143bc41640209a88cb4","url":"js/piano.js"},{"revision":"e561f859ea2561d833c71670f780d778","url":"js/railcommon.js"},{"revision":"8cadae8eab06e25f094853b314083a92","url":"js/railvolts.js"},{"revision":"c43c0bd68618ff36bb6eb444d5d75f4f","url":"js/relay.js"},{"revision":"7d01b26990e9a252abc6ebb66d9a36c5","url":"js/scores.js"},{"revision":"08babdca4047fbbae0cda193a9ac4db7","url":"js/soil.js"},{"revision":"bbd4e713a031d59e0218b55d4d52d9de","url":"js/tictactoe.js"},{"revision":"07e791762d4ba91c7af079bea0652e92","url":"js/trex.js"},{"revision":"083620190ca03e2a37fb9de42e21166a","url":"js/worker.js"},{"revision":"374093bd9aeedb018832eaf6a65a25f2","url":"manifest.json"},{"revision":"4b85d973fb819d60cab11ef64f2bf7ed","url":"memory.html"},{"revision":"f619cc8fec3708360209a04d0ae3e739","url":"mole.html"},{"revision":"1c747bb88dc89c3216035aeb16c29cfb","url":"mortgage.html"},{"revision":"31f66177a9e47cdb559e6860914ad036","url":"mortgage2.html"},{"revision":"7c5f63be7aaec4c066621bb3220e4597","url":"op.html"},{"revision":"4c7a5472637d6e9d1ba4cfd5f8acca36","url":"Orion Park/ExcelConverter.js"},{"revision":"c995a50e591213044291684e4a255bfb","url":"Orion Park/op-Delivery.csv"},{"revision":"b643c769d78c3442f5a4c7810675bcdd","url":"Orion Park/op-Project Stock.csv"},{"revision":"f14b21042626283154f63c239f46a40a","url":"Orion Park/op-Warehouse Stock .csv"},{"revision":"d5f41b90c797c2c817283c41d6d6d224","url":"Orion Park/op.xlsx"},{"revision":"8e4d52e6176d93535425ee65d2097e7f","url":"package.json"},{"revision":"ca727b7da1feff3fc0b7e99ba4eff2fb","url":"piano.html"},{"revision":"2286a43797983adc3261f89c9878eb09","url":"railvolts.html"},{"revision":"8269b03212145107c14f5a5c1b8941e2","url":"relay.html"},{"revision":"df77e83872fe24a71e2911feb6e8d595","url":"robots.txt"},{"revision":"b44a45bcbf78a5db4952604775b8b332","url":"savesettings.php"},{"revision":"f7ca956ae38043e1691ddd0911404478","url":"saveSoil.php"},{"revision":"e091091962f79b29191d174c78dd3977","url":"soil.html"},{"revision":"88a0582e1805567793c1731281d64cc7","url":"soildb.php"},{"revision":"e11f4e6f4e2520e401399ab22099d764","url":"tictactoe.html"},{"revision":"a9b36e23cd1912804b46986f8a303b59","url":"tools.html"},{"revision":"1aab8bdd9bdd75d0b65870aa0443e29c","url":"uploads/dobblescores.json"},{"revision":"27d9c94305319af1969e6d2f9aebf0cb","url":"uploads/fault.csv"},{"revision":"41d8f065513b22402b3be4a4880e0adc","url":"uploads/fop.json"},{"revision":"3aa377891e76b18953b5f14dee0edd1c","url":"uploads/graph.csv"},{"revision":"6085cf711ba54326d7f2713f6590aae2","url":"uploads/molescores.json"},{"revision":"34788a3d806089acde74e374d0327b40","url":"uploads/relay.csv"},{"revision":"19c09341549b017565f2e8b60d77c7d8","url":"uploads/rexscores.json"},{"revision":"f3f2601e248e88e2eb8bc27f022a2d97","url":"uploads/scores.json"},{"revision":"4d701e7db1377cf690a6464d5564e497","url":"uploads/simonscores.json"},{"revision":"85133bbf149cbf33ee8e7ede79aefa35","url":"uploads/soil.json"}],{
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
      try {
        return defaultStrategy.handle(args); // use default strategy
      }catch(e) {console.log(e);}
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