// ==UserScript==
// @name        safeway-justforu
// @namespace   safeway-justforu
// @description safeway, vons, dominicks, genuardis, pavilions, randalls, tomthumb J4U coupons automatically added to your card.
// @include     http://www.safeway.com/ShopStores/Justforu*
// @include     http://www.vons.com/ShopStores/Justforu*
// @include     http://www.dominicks.com/ShopStores/Justforu*
// @include     http://www.genuardis.com/ShopStores/Justforu*
// @include     http://www.pavilions.com/ShopStores/Justforu*
// @include     http://www.randalls.com/ShopStores/Justforu*
// @include     http://www.tomthumb.com/ShopStores/Justforu*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       none
// ==/UserScript==

function OfferProcessor(url, callback) {
    var _url = url;
    var _offersAdded = 0;
    var _callback = callback;
    var _clippingUrl = "/Clipping1/services/clip/offers";

    return {
        processOffers: function (data) {
            var offers = data.offers;
            var count = 0;
            for (var i = 0; i < offers.length; i++) {
                var offer = offers[i];
                if (offer.clipStatus === "U") {
                    count++;
                    var clips = [];
                    var clip = {};
                    clip.itemId = offer.offerId;
                    clip.itemType = offer.offerPgm;
                    clip.vndrBannerCd = ""; // ??
                    clips.push(clip);
                    var postRequest = {};
                    postRequest.items = clips;
                    var jsonStr = JSON.stringify(postRequest);
                    $.ajax({
                        type: 'POST',
                        url: _clippingUrl,
                        contentType: 'application/json',
                        data: jsonStr,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('SWY_API_KEY', 'emjou');
                xhr.setRequestHeader('SWY_BANNER', 'safeway');
                xhr.setRequestHeader('SWY_VERSION', '1.0');
                xhr.setRequestHeader('X-SWY_API_KEY', 'emjou');
                xhr.setRequestHeader('X-SWY_BANNER', 'safeway');
                xhr.setRequestHeader('X-SWY_VERSION', '1.0');
            }
                    });
                }
            }
            _offersAdded = count;
            _callback();
        },

        process: function () {
            var scope = this;
            $.ajax(_url).done(function (data) {
                scope.processOffers(data);
            });
        },

        getOffersAdded: function () {
            return _offersAdded;
        }
    }
}

function Counter(maxCnt) {

    var _maxCount = maxCnt;
    var _callback = "";
    var _count = 0;
    return {
        incrementCount: function () {
            _count++;
            if (_count == _maxCount)
                _callback();
        },

        setCallback: function (cb) {
            _callback = cb;
        }

    }
}


$(document).ready(function () {
    var counter = Counter(1);
    var cdOfferProcessor = OfferProcessor("/J4UProgram1/services/program/CD/offer/allocations", counter.incrementCount);

    var printData = function () {
        var cdCount = cdOfferProcessor.getOffersAdded();
        if (cdCount > 0) {
            alert("J4U - Added " + cdCount + " coupons.");
        }
    }

    counter.setCallback(printData);
    cdOfferProcessor.process();

});
