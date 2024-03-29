importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const { precacheAndRoute, precache, matchPrecache } = workbox.precaching;
const { registerRoute, setCatchHandler, setDefaultHandler } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate, NetworkFirst } = workbox.strategies;
const { CacheableResponse, CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;
//const googleAnalytics = workbox.googleAnalytics;
//googleAnalytics.initialize(); //"Uses too much storage, not worth it.

async function cacheKeyWillBeUsed({ request }) {
  const url = new URL(request.url);
  return url.origin + url.pathname;
  // Any search params or hash will be left out.
}

const plugExp = [
  { cacheKeyWillBeUsed },
  new CacheableResponsePlugin({
    statuses: [200],
  }),
  new ExpirationPlugin({
    maxEntries: 60,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
  }),
];

const plugStand = [
  { cacheKeyWillBeUsed }, //same as above
  new CacheableResponsePlugin({
    statuses: [200],
  }),
];

function newRoute(inputs) {
  const { str, name, plugs, strat, typ } = inputs;
  const straTegy = strat === "cache"
    ? new CacheFirst({ cacheName: name, plugins: plugs, })
    : strat === "stale"
      ? new StaleWhileRevalidate({ cacheName: name, plugins: plugs, })
      : new NetworkFirst({ networkTimeoutSeconds: 3, cacheName: name, plugins: plugs, });
  const type = typ === "request"
    ? ({ request }) => request.destination === str
    : typ === "url"
      ? ({ url }) => url.pathname.endsWith(str)
      : ({ url }) => url.pathname.includes(str);
  registerRoute(type, straTegy);
}

newRoute({ str: "image", name: "images", plugs: plugExp, strat: "cache", typ: "request" });
newRoute({ str: "style", name: "css", plugs: plugStand, strat: "net", typ: "request" });
newRoute({ str: "document", name: "html", plugs: plugStand, strat: "net", typ: "request" });
newRoute({ str: "font", name: "fonts", plugs: plugExp, strat: "cache", typ: "request" });
newRoute({ str: "js/ext/", name: "exScripts", plugs: plugExp, strat: "cache", typ: "urlInc" });
newRoute({ str: "script", name: "scripts", plugs: plugStand, strat: "net", typ: "request" });
newRoute({ str: "uploads/", name: "csv", plugs: plugExp, strat: "cache", typ: "urlInc" });

// Use the imported Workbox libraries to implement caching,
// routing, and other logic:
precache([{ "revision": "4f8ce79846e8e1584d9abbe106bf43f6", "url": "favicon.ico" }, { "revision": "ab302fd1e7cdfdb8848de7b3eb63f219", "url": "images/1x-cloud.png" }, { "revision": "535573ed768cb20b4f331333c6a075d1", "url": "images/1x-large-obstacle.png" }, { "revision": "d07e3fdbd4c6127a3a2da193a1c07bf6", "url": "images/1x-restart.png" }, { "revision": "0803e0b0d16ffdb63cd635c1ed9ba1c2", "url": "images/1x-small-obstacle.png" }, { "revision": "97e2ebb243c6a214291c81484d0b3e6b", "url": "images/1x-text.png" }, { "revision": "6f9e36bf97d419251042e10557c660a6", "url": "images/1x-trex.png" }, { "revision": "6ea435a667ac8100ddbb4d0477f9d2f3", "url": "images/2x-cloud.png" }, { "revision": "eafa7c6505347c92b6062c4421cb72ce", "url": "images/2x-large-obstacle.png" }, { "revision": "e131f0bfe00d65dabbe3e8b903a6537f", "url": "images/2x-restart.png" }, { "revision": "9834d7f1df7a91d69bf515ae754b036c", "url": "images/2x-small-obstacle.png" }, { "revision": "ed6f2587d2f82b692fa06a14ac2a30e4", "url": "images/2x-text.png" }, { "revision": "a5033679b9d216c69b49042eb794514c", "url": "images/2x-trex.png" }, { "revision": "011d051fae615ee02f0f6555f0a67b69", "url": "images/apple-icon-180.png" }, { "revision": "0481d9495c7263bc6fd050607ba98de9", "url": "images/Backup/1x-large-obstacle.png" }, { "revision": "ab243f6fcfcedd75378cbd9d14f101ef", "url": "images/Backup/1x-small-obstacle.png" }, { "revision": "a8e0131b2cdb48e780cb940b8e45857e", "url": "images/Backup/1x-trex.png" }, { "revision": "40b04c11fc47fbac5d5b068ee605de1d", "url": "images/Backup/2x-large-obstacle.png" }, { "revision": "7e6a2692732f56e5a67d945f7392c61d", "url": "images/Backup/2x-small-obstacle.png" }, { "revision": "b51816d311d4bd8092a3e213880398cb", "url": "images/Backup/2x-trex.png" }, { "revision": "0097e36162264157b510a19a04ed2af0", "url": "images/Dobble/1F32D.png" }, { "revision": "fd5163371de5f676b0e1776c68c05935", "url": "images/Dobble/1F32E.png" }, { "revision": "f967568512bebf62191e5f264ac32890", "url": "images/Dobble/1F33D.png" }, { "revision": "4ace92ce541c56ed6ec9b60eeb7db893", "url": "images/Dobble/1F344.png" }, { "revision": "6acfaae3b2c73dd2c310f6f08ddcfea0", "url": "images/Dobble/1F345.png" }, { "revision": "b274c073cba1aef4ccdccb37404d10e3", "url": "images/Dobble/1F346.png" }, { "revision": "c6a34cee2e85351724a829bbffd9176d", "url": "images/Dobble/1F347.png" }, { "revision": "b96822cf13972923278038fc8c09427d", "url": "images/Dobble/1F348.png" }, { "revision": "b36ef69437e52c284f0a3fec9fbef483", "url": "images/Dobble/1F349.png" }, { "revision": "b84e6c008f04c67b20fc145fce3ac24c", "url": "images/Dobble/1F34A.png" }, { "revision": "255256c6bf037601563974e559eb818a", "url": "images/Dobble/1F34B.png" }, { "revision": "da2c0c3ecef0007d553bb6c9c87aaa98", "url": "images/Dobble/1F34C.png" }, { "revision": "c301192b256f6f57b27a8be9ab4286fb", "url": "images/Dobble/1F34E.png" }, { "revision": "aade527fcd77b05c07db95cc572af01d", "url": "images/Dobble/1F34F.png" }, { "revision": "52bedb7d7e069d8a7d5ac6bfcbd6f79b", "url": "images/Dobble/1F350.png" }, { "revision": "063a7a614108e311660e42b9d29386ba", "url": "images/Dobble/1F351.png" }, { "revision": "73a1b55c38aaec037e4fbed39297d7eb", "url": "images/Dobble/1F352.png" }, { "revision": "a2f3b06f71d9d1cbc1d1843b23572918", "url": "images/Dobble/1F353.png" }, { "revision": "df1cc570fd00c6d0a6f3139b991b11cd", "url": "images/Dobble/1F354.png" }, { "revision": "359c81528ba52199126a209c6aa0bedc", "url": "images/Dobble/1F355.png" }, { "revision": "4704e79534c117cd81f9dd945af9d88e", "url": "images/Dobble/1F356.png" }, { "revision": "f6d52d9df87f550403c1060120120a9d", "url": "images/Dobble/1F357.png" }, { "revision": "91ede22e21f9267b912f85c6450d4467", "url": "images/Dobble/1F35E.png" }, { "revision": "c7535759538c31d2f53fa03047d0748b", "url": "images/Dobble/1F35F.png" }, { "revision": "6f21180e462242a5f862a05c9773accc", "url": "images/Dobble/1F366.png" }, { "revision": "1565da4d876b0af97da43289a391fd0c", "url": "images/Dobble/1F367.png" }, { "revision": "6f2eb5ffb5585f9e8af8094dc7c712d7", "url": "images/Dobble/1F368.png" }, { "revision": "20d92ac7543f4d4e16016ac27f82798a", "url": "images/Dobble/1F369.png" }, { "revision": "56f1923fe76cd6007d2ac079295a5303", "url": "images/Dobble/1F36E.png" }, { "revision": "6ab1468989ec93299099eb954b35301c", "url": "images/Dobble/1F370.png" }, { "revision": "61f4b11b88fc6c4284c551db4822e3b7", "url": "images/Dobble/1F401.png" }, { "revision": "358e6a2320f7b9dd515137fbf89cb802", "url": "images/Dobble/1F402.png" }, { "revision": "731dbd468c17cfed7ffcd564193ce334", "url": "images/Dobble/1F403.png" }, { "revision": "3b3f81dd29db1944b8361a4f0b5fd57e", "url": "images/Dobble/1F404.png" }, { "revision": "a41da178fae6b649abb869b406eaf8a3", "url": "images/Dobble/1F405.png" }, { "revision": "2311ba508fd3c2a8d9365b343b5c2411", "url": "images/Dobble/1F406.png" }, { "revision": "10dc56fe7a102b483a719ec99a88ebcf", "url": "images/Dobble/1F407.png" }, { "revision": "47054b4c14c7503533df5b4efa1709d5", "url": "images/Dobble/1F408.png" }, { "revision": "d213440a59e3d9830ff7943093e2ce4d", "url": "images/Dobble/1F411.png" }, { "revision": "7be372dea0620f07111ff8ffb8c4a9a5", "url": "images/Dobble/1F412.png" }, { "revision": "cd854306f4fc42072c9ef3012d9a8956", "url": "images/Dobble/1F413.png" }, { "revision": "4637c9e0a46a3e450eaddb33fab3c886", "url": "images/Dobble/1F414.png" }, { "revision": "04653b20de9ecb08ec38c856d92180b7", "url": "images/Dobble/1F415-200D-1F9BA.png" }, { "revision": "880523e9dde85bca0482ef93214a1c1d", "url": "images/Dobble/1F415.png" }, { "revision": "4690f724638ed29045e5557ec1e8b41c", "url": "images/Dobble/1F416.png" }, { "revision": "dda9b7f30d4546d99bb6871b1076727b", "url": "images/Dobble/1F417.png" }, { "revision": "5130f17c291584a0e857b49b6cc8ae93", "url": "images/Dobble/1F418.png" }, { "revision": "ad9ffe66f24425dc2e7dd1c6363c906f", "url": "images/Dobble/1F419.png" }, { "revision": "0632120deeb6ef26da0ba096a261a974", "url": "images/Dobble/1F420.png" }, { "revision": "b0e7c601760d26230cdf1ad29a2e38bc", "url": "images/Dobble/1F421.png" }, { "revision": "e777ac2fecfe4818f80679f70a3855b2", "url": "images/Dobble/1F422.png" }, { "revision": "24ca8f3ddc2db1d63f8a37354ef95bd8", "url": "images/Dobble/1F423.png" }, { "revision": "b061d9f226c1175460fa79dc5c7dba6d", "url": "images/Dobble/1F433.png" }, { "revision": "737981f6beca8a4363d2718bc52cc7b3", "url": "images/Dobble/1F434.png" }, { "revision": "8d37de60d3266e36783928c47ec4ce6d", "url": "images/Dobble/1F435.png" }, { "revision": "96ad7f3c08e4470efe2306169324b0db", "url": "images/Dobble/1F436.png" }, { "revision": "83274f0d21399004d72edab0b00c659e", "url": "images/Dobble/1F437.png" }, { "revision": "5d20db81898e581c02352b29e12e6632", "url": "images/fall-of-potential.svg" }, { "revision": "74fd66b627fe993291954292787494ad", "url": "images/manifest-icon-192.png" }, { "revision": "a8964f8fc06a7c7754fc0921266bf342", "url": "images/manifest-icon-512.png" }, { "revision": "1f2edd4d34c78ba80dbb62042351319c", "url": "images/Mole/dirt.svg" }, { "revision": "8a398f3e965adc20a40a6862213a5377", "url": "images/Mole/imp.png" }, { "revision": "685ec8ebf5b9556dd78cb27af1162d2e", "url": "images/Mole/mole.png" }, { "revision": "ebbc2b30c0fd0d2e68512135fa8be31a", "url": "images/soil-resistivity.svg" }], {
  // Ignore all URL parameters.
  ignoreURLParametersMatching: [/.*/u] //taking this out for now since I want to use ?beta
});

// Catch routing errors, like if the user is offline
setCatchHandler(async ({ event }) => {
  // Return the precached offline page if a document is being requested
  if (event.request.destination === 'document') {
    return matchPrecache('/help.html');
  }
  return Response.error();
});