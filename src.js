var coupons = angular.element("#lt-coupon-area").scope().sharedValues.unfilteredItems.slice();

coupons.filter(function(x){return x.clipStatus==="U";}).forEach(function(item){

  var c1 = document.cookie.match(new RegExp('swyConsumerlbcookie=([^;]+)'))[1];
  var c2 = document.cookie.match(new RegExp('swyConsumerDirectoryPro=([^;]+)'))[1];
  var data = {"items":[]};
  var clip = {}; clip.clipType="C";clip.itemId=item.offerId;clip.itemType=item.offerPgm;clip.vndrBannerCd="";
  var list = {}; list.clipType="L";list.itemId=item.offerId;list.itemType=item.offerPgm;
  data.items.push(clip);data.items.push(list);

  var request = new Request('https://nimbus.safeway.com/Clipping1/services/clip/items', {
    method: 'POST',
    mode: 'cors',
    redirect: 'error',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-SWY_VERSION': '1.0',
      'X-SWY_API_KEY': 'emjou',
      'X-SWY_BANNER': 'safeway',
      'SWY_ISREMEMBERED': 'false',
      'X-swyConsumerlbcookie': c1,
      'X-swyConsumerDirectoryPro': c2
    }),
    body: JSON.stringify(data)
  });

  fetch(request);
});

alert('clipping ' + coupons.filter(function(x){return x.clipStatus==="U"}).length + ' J4U coupons');
