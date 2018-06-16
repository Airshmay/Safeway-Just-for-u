var coupons = angular.element("#lt-coupon-area").scope().sharedValues.unfilteredItems.slice();
var token = localStorage.getItem("oktathenticateAccessToken");

if (token && coupons) {

coupons.filter(function(x){return x.clipStatus==="U";}).forEach(function(item){
  var data = {"items":[]};
  var clip = {}; clip.clipType="C";clip.itemId=item.offerId;clip.itemType=item.offerPgm;clip.vndrBannerCd="";
  var list = {}; list.clipType="L";list.itemId=item.offerId;list.itemType=item.offerPgm;
  data.items.push(clip);data.items.push(list);

  var request = new Request('https://nimbus.safeway.com/Clipping1/services/clip/items', {
    method: 'POST',
    mode: 'cors',
    redirect: 'error',
    headers: new Headers({
      'X-SWY_VERSION': '1.0',
      'X-SWY_BANNER': 'safeway',
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json;charset=UTF-8',
      'X-SWY_API_KEY': 'emjou',
      'X-swyConsumerDirectoryPro': token
    }),
    body: JSON.stringify(data)
  });

  fetch(request).then(function(){
    document.querySelector("#headerMyListCount").textContent =
      parseInt(document.querySelector("#headerMyListCount").textContent,10)+1;
  });
});

alert('clipping ' + coupons.filter(function(x){return x.clipStatus==="U"}).length + ' J4U coupons');

}

if (!token) {

alert('not logged in or a website change broke this again');

}
