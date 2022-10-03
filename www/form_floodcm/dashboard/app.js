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
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});


const baseMaps = {
    "Mapbox": mapbox,
    "Google Hybrid": ghyb.addTo(map)
};

const overlayMaps = {
    "ขอบเขตระดับพื้นที่เสี่ยงน้ำท่วม": Zoneflood
};

const lyrControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
}).addTo(map);


// let table
// $(document).ready(function () {
//     $.extend(true, $.fn.dataTable.defaults, {
//         "language": {
//             "sProcessing": "กำลังดำเนินการ...",
//             "sLengthMenu": "แสดง_MENU_ แถว",
//             "sZeroRecords": "ไม่พบข้อมูล",
//             "sInfo": "แสดง _START_ ถึง _END_ จาก _TOTAL_ แถว",
//             "sInfoEmpty": "แสดง 0 ถึง 0 จาก 0 แถว",
//             "sInfoFiltered": "(กรองข้อมูล _MAX_ ทุกแถว)",
//             "sInfoPostFix": "",
//             "sSearch": "ค้นหา:",
//             "sUrl": "",
//             "oPaginate": {
//                 "sFirst": "เริ่มต้น",
//                 "sPrevious": "ก่อนหน้า",
//                 "sNext": "ถัดไป",
//                 "sLast": "สุดท้าย"
//             },
//             "emptyTable": "ไม่พบข้อมูล..."
//         }
//     });
//     table = $('#myTable').DataTable({
//         ajax: {
//             type: "get",
//             url: "https://engrids.soc.cmu.ac.th/p3600" + `/api/getdata`,
//             dataSrc: 'data',
//         },
//         columns: [
//             {
//                 data: null,
//                 render: (data, type, row, meta) => {
//                     // console.log(meta)
//                     return `${meta.row + 1}`
//                 }
//             },
//             { data: 'pname' },
//             { data: 'status' },
//             { data: 'travel' },
//             { data: 'help' },
//             { data: 'help_text' },
//             {
//                 data: null,
//                 render: function (data, type, row, meta) {
//                     // console.log(row);
//                     // return `<button class= "btn m btn-loaction" id = "getzoomMap" ><i class="fas fa-map-marker-alt"></i>&nbsp;ตำแหน่ง</button>
//                     //         <button type="button" class="btn btn-warning" onclick="editdata(${row.id_date})"><i class="bi bi-pencil-square"></i>&nbsp;แก้ไขข้อมูล</button>
//                     //         <button class="btn m btn-danger" onclick="confirmDelete(${row.id_date},'${row.noticenaturdis}','${row.status}','${row.record}')"><i class="bi bi-trash"></i>&nbsp;ลบข้อมูล</button>`
//                 },
//                 // width: "30%"
//             }

//         ],
//         searching: true,
//         scrollX: true,
//         columnDefs: [
//             { className: 'text-center', targets: [0, 1, 2, 3, 4, 5, 6, 7] },

//         ],
//         dom: 'Bfrtip',
//         buttons: [
//             'print', 'excel'
//         ],
//         pageLength: 6
//     });

//     table.on('search.dt', function () {
//         let data = table.rows({ search: 'applied' }).data()
//         // data.map(i => { console.log(i.outputtype) })
//         $("#siteCnt").text(data.length)
//         getMap(data)
//         // setarea(data)
//         getmarker(data)
//         // console.log();
//         loadnoticenaturdis(data); zoomMap(data)
//     });

//     $('#myTable tbody').on('click', '#getzoomMap', function () {
//         var data = table.row($(this).parents('tr')).data();
//         // console.log(data)
//         zoomMap(data)
//     });


// })
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
        getMap(d)
        getmarker(d)

    })
}

getdata()


let getMap = (d) => {
    console.log(d)
    // $('#num_list').html(x.length)
    map.eachLayer((lyr) => {
        if (lyr.options.name == 'st_asgeojson') {
            map.removeLayer(lyr);
        }
    });
    var style = {
        "color": "#ff7800",
        "weight": 2,
        "opacity": 0.65
    };

    d.map(i => {
        console.log(i)
        console.log(i.geojson)
        if (i.geojson) {
            let geojson = L.geoJSON(JSON.parse(i.geojson), {
                style: style,
                name: "st_asgeojson",
                onEachFeature: function (feature, layer) {
                    // drawnItems.addLayer(layer);
                }
            })
            geojson
                .bindPopup(`<h6 class= "text-center"><b>สถานที่ที่ได้รับผลกระทบ</b> ${i.pname} <br><b>สถานะ</b>: ${i.status} <br><b>การสัญจร</b> ${i.travel} <br>
                        <b>ความช่วยเหลือ</b>: ${i.help} <br> <b>รายละเอียด</b>: ${i.help_text} <br> <img src="${i.img !== null && i.img == "" ? i.img : './marker/noimg.png'}"style="width:100%"></h6>`)
                .addTo(map);
        }
    })
}

let getmarker = (d) => {
    console.log(d)
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
        iconSize: [50, 50],
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
        console.log(i)
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
                <h6><b>ความช่วยเหลือ :</b> ${i.help} <b>รายละเอียด</b>: ${i.help_text} <br> </h6>`)
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.noticenaturdis == 'ไม่ต้องการ') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_02 });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6><h6><b>สถานะ :</b> ${i.status}</h6><h6><b>การสัญจร :</b> ${i.travel}</h6>
                <h6><b>ความช่วยเหลือ :</b> ${i.help} <b>รายละเอียด</b>: ${i.help_text} <br> </h6>`)
                // .addTo(map)
                ms.addLayer(mm);
            } else {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_03 });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6><h6><b>สถานะ :</b> ${i.status}</h6><h6><b>การสัญจร :</b> ${i.travel}</h6>
                <h6><b>ความช่วยเหลือ :</b> ${i.help} <b>รายละเอียด</b>: ${i.help_text} <br> </h6>`)
                // .addTo(map)
                ms.addLayer(mm);
            }
            // } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
            //     console.log(i.lat, i.lng)
            //     if (i.help == 'ต้องการ') {
            //         mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_01 })
            //             .bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6><h6><b>สถานะ :</b> ${i.status}</h6><h6><b>การสัญจร :</b> ${i.travel}</h6>
            //         <h6><b>ความช่วยเหลือ :</b> ${i.help} <b>รายละเอียด</b>: ${i.help_text} <br> </h6>`)
            //         ms.addLayer(mm);// 
            //     } else if (i.help == 'ไม่ต้องการ') {
            //         mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_02 })
            //             .bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6><h6><b>สถานะ :</b> ${i.status}</h6><h6><b>การสัญจร :</b> ${i.travel}</h6>
            //         <h6><b>ความช่วยเหลือ :</b> ${i.help} <b>รายละเอียด</b>: ${i.help_text} <br> </h6>`)
            //     } else {
            //         mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_03 })
            //             .bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6><h6><b>สถานะ :</b> ${i.status}</h6><h6><b>การสัญจร :</b> ${i.travel}</h6>
            //         <h6><b>ความช่วยเหลือ :</b> ${i.help} <b>รายละเอียด</b>: ${i.help_text} <br> </h6>`)
            //         ms.addLayer(mm);// 
            //     }
        }
    });
    ms.addTo(map)
    // lyrControl.addOverlay(ms, "ตำแหน่งหน่วยงานที่รายงาน...")
}
// let confirmDelete = (id_data, noticenaturdis,) => {
//     $("#projId").val(id_data)
//     $("#noticenaturdis").html(`${noticenaturdis !== 'null' ? 'เรื่อง' + noticenaturdis : ''} `)
//     $('#deleteModal').modal('show');
// }
// let deleteValue = () => {
//     let id_data = $("#projId").val();
//     // $('#deleteModal').modal('hide');
//     // console.log(id_data)
//     $('#myTable').DataTable().ajax.reload();
//     axios.post(url + "/disaster-eac/delete", { proj_id: id_data }).then(r => {
//         r.data.data == "success" ? $('#deleteModal').modal('hide') && refreshPage() : null
//         // refreshPage()
//     })
// }
let refreshPage = () => {
    window.open("./../dashboard/index.html", "_self");
    // console.log("ok");
}
// let editdata = (e) => {
//     sessionStorage.setItem('id_data', e);
//     // sessionStorage.setItem('w_from_admin', 'yes');
//     location.href = "./../edit/index.html";
// }
// let editdata2 = () => {
//     let e = $("#projId").val();
//     // console.log(e)
//     sessionStorage.setItem('id_data', e);
//     location.href = "./../edit/index.html";
// }

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
            name: "lyr"
        });
    }

    if (!map.hasLayer(radarLayers[frame.path])) {
        map.addLayer(radarLayers[frame.path]);
    }
    lyrControl.addOverlay(radarLayers[frame.path], "เรดาห์น้ำฝน")
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

$("input[type=checkbox]").change(async () => {
    await map.eachLayer(i => {
        // console.log(i);
        if (i.options.name == "lyr") {
            map.removeLayer(i)
        }
    })
    let chk = [];
    await $('input[type=checkbox]:checked').each(function () {
        chk.push($(this).val());
    });

    chk.map(i => {
        // console.log(i);
        if (lyr[`${i}`]) {
            lyr[`${i}`].addTo(map);
        }

        if (i == "radar") {
            initialize(apiData, optionKind);
        }
    })

    getLayer()

})