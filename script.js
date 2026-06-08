const stores = [
  {
      name: "맥도날드 강남점",
      address: "서울 강남구 테헤란로 152",
      lat: 37.5007,
      lng: 127.0365
  },
  {
      name: "맥도날드 홍대점",
      address: "서울 마포구 양화로 160",
      lat: 37.5572,
      lng: 126.9245
  },
  {
      name: "맥도날드 잠실점",
      address: "서울 송파구 올림픽로 240",
      lat: 37.5130,
      lng: 127.1027
  },
  {
      name: "맥도날드 명동점",
      address: "서울 중구 명동길 14",
      lat: 37.5636,
      lng: 126.9834
  },
  {
      name: "맥도날드 여의도점",
      address: "서울 영등포구 국제금융로 10",
      lat: 37.5251,
      lng: 126.9253
  }
];

const map = new naver.maps.Map("map", {
  center: new naver.maps.LatLng(37.5665, 126.9780),
  zoom: 11
});

const storeList = document.getElementById("storeList");

let currentInfoWindow = null;
let searchCircle = null;

stores.forEach(store => {

  const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(store.lat, store.lng),
      map: map
  });

  const infoWindow = new naver.maps.InfoWindow({
      content: `
          <div style="padding:12px;min-width:180px;">
              <strong>${store.name}</strong><br>
              ${store.address}
          </div>
      `
  });

  marker.addListener("click", () => {

      if(currentInfoWindow){
          currentInfoWindow.close();
      }

      infoWindow.open(map, marker);
      currentInfoWindow = infoWindow;

      map.panTo(marker.getPosition());
  });

  const li = document.createElement("li");
  li.className = "store-item";

  li.innerHTML = `
      <div class="store-name">${store.name}</div>
      <div class="store-address">${store.address}</div>
  `;

  li.addEventListener("click", () => {

      map.setCenter(
          new naver.maps.LatLng(store.lat, store.lng)
      );

      map.setZoom(15);

      if(currentInfoWindow){
          currentInfoWindow.close();
      }

      infoWindow.open(map, marker);
      currentInfoWindow = infoWindow;
  });

  storeList.appendChild(li);
});

document
.getElementById("searchBtn")
.addEventListener("click", searchAddress);

function searchAddress(){

  const address =
  document.getElementById("address").value;

  if(!address){
      alert("주소를 입력하세요.");
      return;
  }

  naver.maps.Service.geocode({
      query: address
  }, function(status, response){

      if(status !== naver.maps.Service.Status.OK){
          alert("검색 결과가 없습니다.");
          return;
      }

      const item = response.v2.addresses[0];

      const point =
      new naver.maps.LatLng(
          item.y,
          item.x
      );

      map.setCenter(point);
      map.setZoom(15);

      new naver.maps.Marker({
          position: point,
          map: map
      });

      if(searchCircle){
          searchCircle.setMap(null);
      }

      searchCircle = new naver.maps.Circle({
          map: map,
          center: point,
          radius: 1000,
          strokeColor: "#DA291C",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#DA291C",
          fillOpacity: 0.15
      });
  });
}

const normalBtn =
document.getElementById("normalBtn");

const satelliteBtn =
document.getElementById("satelliteBtn");

normalBtn.addEventListener("click", () => {

  map.setMapTypeId(naver.maps.MapTypeId.NORMAL);

  normalBtn.classList.add("active");
  satelliteBtn.classList.remove("active");
});

satelliteBtn.addEventListener("click", () => {

  map.setMapTypeId(naver.maps.MapTypeId.SATELLITE);

  satelliteBtn.classList.add("active");
  normalBtn.classList.remove("active");
});