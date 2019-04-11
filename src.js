"use strict";
var promises = [];
var allcoupons = Object.values(JSON.parse(localStorage.getItem("abCoupons"))["offers"]);
var coupons = allcoupons.filter(function(x){return x.status==="U";}).filter(function(y){return y.deleted!==0;});
if (coupons.length > 0) {

  window.alert("clipping " + coupons.length + " of " + allcoupons.length + " coupons");

  coupons.forEach(function(item){
    var data = {"items":[]}, clip = {}, list = {};
    clip.clipType="C";clip.itemId=item.offerId;clip.itemType=item.offerPgm;
    list.clipType="L";list.itemId=item.offerId;list.itemType=item.offerPgm;
    data.items.push(clip);data.items.push(list);
    var request = new Request(window.AB.couponClipPath + "?storeId\x3d" + window.AB.userInfo.j4u.storeId, {
      method: 'POST',
      mode: 'cors',
      redirect: 'error',
      headers: new Headers(window.AB.j4uHttpOptions),
      body: JSON.stringify(data)
    });
     var promise = fetch(request).then(function(response) {
        return response.json();
      })
      .then(function(itemjson) {
        if (itemjson.items[0]["status"] === 1) {
          var wtf = JSON.parse(localStorage.getItem("abCoupons"));
          wtf.offers[item.offerId].status = "C";
          localStorage.setItem("abCoupons", JSON.stringify(wtf));
        }
      });
      promises.push(promise);
  });

  Promise.all(promises).then(function(){
  if (Object.values(JSON.parse(localStorage.getItem("abCoupons"))["offers"]).filter(function(x){return x.status==="U";}).filter(function(y){return y.deleted!==0;}).length > 0) {
    window.alert("there are still some unclipped coupons - something probably broke this script");
  } else {
    window.alert("all coupons clipped - reloading page");
  }
  localStorage.removeItem("abCoupons");
  localStorage.removeItem("abJ4uCoupons");
  location.reload();
  });

} else {
  if (allcoupons.length > 0) {
    window.alert("no clippable coupons");
  } else {
    window.alert("no coupons detected");
  }
}
