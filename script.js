const serverURL = 'https://advertising-drozd.herokuapp.com'

const getData = () => {
  const pbjsConfig = window.pbjs.adUnits.map((item) => ({
    adUnitCode: item.code,
    sizes: Object.keys(item.mediaTypes).reduce(
      (prev, key) => ({ ...prev, [key]: item.mediaTypes[key].sizes }),
      {}
    ),
    bidders: [...new Set(item.bids.map(({ bidder }) => bidder))],
  }));

  const googletagConfig = window.googletag
    ?.pubads()
    .getSlots()
    .map((i) => ({
      slotElementId: i.getSlotElementId(),
      adUnitPath: i.getAdUnitPath(),
    }));

  const joinedConfig = pbjsConfig.map((item) => ({
    ...item,
    adUnitPath: googletagConfig?.find((g) => g.slotElementId === item.adUnitCode)?.adUnitPath ?? 'Not Found'
      .adUnitPath,
  }));

  const activeBidders = Object.values(window.pbjs.getBidResponses())
    .map(({ bids }) =>
      bids.map((bid) => ({
        bidderName: bid.bidder,
        size: bid.size,
        cpm: bid.cpm,
        currency: bid.currency,
        adUnitCode: bid.adUnitCode,
      }))
    )
    .flat(1);

  return { dataConfiguration: joinedConfig, dataActiveBidders: activeBidders };
};

// Find <body>
const bodyTag = document.getElementsByTagName("body").item(0);

// Create button
const button = document.createElement("button");
button.textContent = "Show Bidding Data";
button.style.position = "fixed";
button.style.right = "20px";
button.style.top = "20px";
button.style.zIndex = "15000";
button.style.backgroundColor = 'orange';
button.style.border = '1px solid orange';
button.style.padding = '0.5rem';
button.style.borderRadius = '0.25rem';

bodyTag.appendChild(button);

// Create iframe wrapper
const iframeWrapperId = "bid-data-iframe-wrapper"
const iframeWrapper = document.createElement("div");
iframeWrapper.id = iframeWrapperId;
iframeWrapper.style.position = "fixed";
iframeWrapper.style.left = "0";
iframeWrapper.style.zIndex = "100000";
iframeWrapper.style.top = "0";
iframeWrapper.style.width = "100%";
iframeWrapper.style.height = "100%";
iframeWrapper.style.display = "flex";
iframeWrapper.style.flexDirection = "column";
iframeWrapper.style.display = "none";

bodyTag.appendChild(iframeWrapper);

// Create <iframe>
const iframeId = "bid-data-frame";
const iframe = document.createElement("iframe");
iframe.src = serverURL;
iframe.id = "bid-data-frame";
iframe.style.margin = "1rem";
iframe.style.flexGrow = "1";
iframe.style.background = "rgba(255,255,255,0.9)";

iframeWrapper.appendChild(iframe);

// Add onClick listener to button
button.addEventListener("click", () => {
  if (!window.pbjs) {
    return alert('No Prebid.js on thie site!')
  }

  iframe.contentWindow.postMessage(getData(), "*");
  document.getElementById(iframeWrapperId).style.display = "flex";
});

// Add listener to close iframe
window.addEventListener('message', (e) => {
  if (e.data === 'close') {
    document.getElementById(iframeWrapperId).style.display = "none";
  }
})

// Get real "open" function from XMLHttpRequest prototype
const realXMLHttpOpen = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'open')

// Change it with mock function that send URL to the server
// and call the real function not to break the functionality of the site
Object.defineProperty(XMLHttpRequest.prototype, 'open', {
  value: function () {
    try {
      const url = arguments[1]
      if (url === serverURL) {
        return;
      }
      setTimeout(() => fetch(serverURL + '/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      }), 10)
    } catch (err) { }
    return realXMLHttpOpen.value
  },
  writable: false
});
