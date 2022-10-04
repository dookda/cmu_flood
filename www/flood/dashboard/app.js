const url = "https://engrids.soc.cmu.ac.th/p3600";
let latlng = {
    lat: 18.784033,
    lng: 99.004762
};
let map = L.map("map", {
    center: latlng,
    zoom: 14
});
const mapbox = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
        maxZoom: 18,
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/light-v9",
        tileSize: 512,
        zoomOffset: -1
    }
);

const ghyb = L.tileLayer("https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
});

const Zoneflood = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/cm_flood/wms?", {
    layers: "cm_flood:7_zoneall_utm",
    format: "image/png",
    name: "lyr",
    iswms: "wms",
    transparent: true,
    maxZoom: 15,
    opacity: 0.4
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

var radar = L.layerGroup()
const baseMaps = {
    "Mapbox": mapbox,
    "Google Hybrid": ghyb.addTo(map)
};

const overlayMaps = {
    "ขอบเขตระดับพื้นที่เสี่ยงน้ำท่วม": Zoneflood,
    "เรดาห์ฝน": radar.addTo(map)
};

const lyrControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
}).addTo(map);


let d
let getdata = () => {
    axios.get(url + `/api/getdata`, {}).then(async (r) => {
        d = r.data.data;
        // console.log(d)
        let numhelp = 0;
        await d.map(i => {
            i.help == "ต้องการ" ? numhelp += 1 : null
        })

        $("#numhelp").text(numhelp)
        $('#numall').html(d.length)
        // getMap(d)
        getmarker(d)

    })
}

getdata()

let getmarker = (d) => {
    // console.log(d)

    var mm, ms
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });

    var MIcon_01 = L.icon({
        iconUrl: './marker/icon-flood1.png',
        iconSize: [50, 50],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    var MIcon_02 = L.icon({
        iconUrl: './marker/icon-flood2.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    var MIcon_03 = L.icon({
        iconUrl: './marker/icon-other.png',
        iconSize: [50, 50],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });

    ms = L.layerGroup()
    d.map(i => {
        let helptext
        if (i.help_text !== null) {
            helptext = i.help_text
        } else {
            helptext = "ไม่ระบุ"
        }
        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
            if (i.help == 'ต้องการ') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_01 });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6><h6><b>สถานะ :</b> ${i.status}</h6><h6><b>การสัญจร :</b> ${i.travel}</h6>
                <h6><b>ความช่วยเหลือ :</b> ${i.help} </h6> <h6> <b>รายละเอียด</b>: ${helptext} <br> </h6> <h6> <b>วันที่และเวลา</b>: ${i.tstxt} <br> </h6> <img src="${i.img !== null && i.img !== "" ? i.img : './marker/noimg.png'}"style="width:100%">`)
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.help == 'ไม่ต้องการ') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_02 });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6><h6><b>สถานะ :</b> ${i.status}</h6><h6><b>การสัญจร :</b> ${i.travel}</h6>
                <h6><b>ความช่วยเหลือ :</b> ${i.help} </h6> <h6> <b>รายละเอียด</b>: ${helptext} <br> </h6> <h6> <b>วันที่และเวลา</b>: ${i.tstxt} <br> </h6> <img src="${i.img !== null && i.img !== "" ? i.img : './marker/noimg.png'}"style="width:100%">`)
                // .addTo(map)
                ms.addLayer(mm);
            } else {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_03 });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6><h6><b>สถานะ :</b> ${i.status}</h6><h6><b>การสัญจร :</b> ${i.travel}</h6>
                <h6><b>ความช่วยเหลือ :</b> ${i.help} </h6> <h6> <b>รายละเอียด</b>: ${helptext} <br> </h6> <h6> <b>วันที่และเวลา</b>: ${i.tstxt} <br> </h6> <img src="${i.img !== null && i.img !== "" ? i.img : './marker/noimg.png'}"style="width:100%">`)
                // .addTo(map)
                ms.addLayer(mm);
            }
        }
    });
    ms.addTo(map)
    // lyrControl.addOverlay(ms, "ตำแหน่งหน่วยงานที่รายงาน...")
}

let refreshPage = () => {
    window.open("./../dashboard/index.html", "_self");
    // console.log("ok");
}


var apiData = {};
var mapFrames = [];
var lastPastFramePosition = -1;
var radarLayers = [];

var optionKind = 'radar'; // can be 'radar' or 'satellite'

var optionTileSize = 256; // can be 256 or 512.
var optionColorScheme = 2; // from 0 to 8. Check the https://rainviewer.com/api/color-schemes.html for additional information
var optionSmoothData = 1; // 0 - not smooth, 1 - smooth
var optionSnowColors = 1; // 0 - do not show snow colors, 1 - show snow colors

var animationPosition = 0;
var animationTimer = false;

var apiRequest = new XMLHttpRequest();
apiRequest.open("GET", "https://api.rainviewer.com/public/weather-maps.json", true);
apiRequest.onload = function (e) {
    // store the API response for re-use purposes in memory
    apiData = JSON.parse(apiRequest.response);
    initialize(apiData, optionKind);
};
apiRequest.send();

function initialize(api, kind) {
    // remove all already added tiled layers
    for (var i in radarLayers) {
        map.removeLayer(radarLayers[i]);
    }


    mapFrames = [];
    radarLayers = [];
    animationPosition = 0;

    if (!api) {
        return;
    }
    if (kind == 'satellite' && api.satellite && api.satellite.infrared) {
        mapFrames = api.satellite.infrared;

        lastPastFramePosition = api.satellite.infrared.length - 1;
        showFrame(lastPastFramePosition);
    }
    else if (api.radar && api.radar.past) {
        mapFrames = api.radar.past;
        if (api.radar.nowcast) {
            mapFrames = mapFrames.concat(api.radar.nowcast);
        }
        lastPastFramePosition = api.radar.past.length - 1;
        showFrame(lastPastFramePosition);
    }
}

function addLayer(frame) {
    // radar = radarLayers[frame.path])
    if (!radarLayers[frame.path]) {
        var colorScheme = optionKind == 'satellite' ? 0 : optionColorScheme;
        var smooth = optionKind == 'satellite' ? 0 : optionSmoothData;
        var snow = optionKind == 'satellite' ? 0 : optionSnowColors;

        radarLayers[frame.path] = new L.TileLayer(apiData.host + frame.path + '/' + optionTileSize + '/{z}/{x}/{y}/' + colorScheme + '/' + smooth + '_' + snow + '.png', {
            tileSize: 256,
            opacity: 0.001,
            zIndex: frame.time,
            name: "aa"
        })

    }

    if (!map.hasLayer(radarLayers[frame.path])) {
        radar.addLayer(radarLayers[frame.path])
    }
}

function changeRadarPosition(position, preloadOnly) {
    while (position >= mapFrames.length) {
        position -= mapFrames.length;
    }
    while (position < 0) {
        position += mapFrames.length;
    }

    var currentFrame = mapFrames[animationPosition];
    var nextFrame = mapFrames[position];

    addLayer(nextFrame);

    if (preloadOnly) {
        return;
    }

    animationPosition = position;

    if (radarLayers[currentFrame.path]) {
        radarLayers[currentFrame.path].setOpacity(0);
    }
    radarLayers[nextFrame.path].setOpacity(100);

}

function showFrame(nextPosition) {
    var preloadingDirection = nextPosition - animationPosition > 0 ? 1 : -1;

    changeRadarPosition(nextPosition);
    changeRadarPosition(nextPosition + preloadingDirection, true);
}

var legend = L.control({ position: "bottomright" });
function showLegend() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += `<div class="mt-2" onClick="hideLegend()">
          <span class="kanit">ซ่อนสัญลักษณ์</span><i class="fa fa-angle-double-down" aria-hidden="true"></i>
        </div>`;
        div.innerHTML += `<img src= \"./../assets/img/radar.png"\" width=\"400px\" height=\"150px\"></i>เรดาห์น้ำฝน</label></div><br>`;
        div.innerHTML += `<i style="background: #b6060c; border-style: solid; border-width: 1.5px;"></i><span>พื้นที่น้ำท่วมลำดับ 1</span><br>`;
        div.innerHTML += `<i style="background: #da0704; border-style: dotted; border-width: 1.5px;"></i><span>พื้นที่น้ำท่วมลำดับ 2</span><br>`;
        div.innerHTML += `<i style="background: #ff3b25; border-radius: 10%; border-width: 1.5px;"></i><span>พื้นที่น้ำท่วมลำดับ 3</span><br>`;
        div.innerHTML += `<i style="background: #ff7919; border-radius: 10%; border-width: 1.5px;"></i><span>พื้นที่น้ำท่วมลำดับ 4</span><br>`;
        div.innerHTML += `<i style="background: #ffcb8b; border-radius: 10%; border-width: 1.5px;"></i><span>พื้นที่น้ำท่วมลำดับ 5</span><br>`;
        div.innerHTML += `<i style="background: #ffc739; border-radius: 10%; border-width: 1.5px;"></i><span>พื้นที่น้ำท่วมลำดับ 6</span><br>`;
        div.innerHTML += `<i style="background: #fff25f; border-radius: 10%; border-width: 1.5px;"></i><span>พื้นที่น้ำท่วมลำดับ 7</span><br>`;
        div.innerHTML += `<img src= \"./marker/icon-flood1.png"\" width=\"400px\" height=\"150px\"></i>ตำแหน่งที่ต้องการความช่วยเหลือ</label></div><br>`;
        div.innerHTML += `<img src= \"./marker/icon-flood2.png"\" width=\"400px\" height=\"150px\"></i>ตำแหน่งที่ยังไม่ต้องการความช่วยเหลือ</label></div><br>`;
        return div;
    };
    legend.addTo(map);
}
function hideLegend() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += `<div class="mt-2" onClick="showLegend()">
        <small class="prompt"><span class="kanit" style="font-size: 14px;" >แสดงสัญลักษณ์</span></small> 
        <i class="fa fa-angle-double-up" aria-hidden="true"></i>
    </div>`;
        return div;
    };
    legend.addTo(map);
}
// showLegend()
hideLegend()