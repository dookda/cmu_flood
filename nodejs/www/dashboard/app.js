const url = "https://engrids.soc.cmu.ac.th/p3600";
// const url = "http://localhost:3600";
let latlng = {
    lat: 6.493,
    lng: 101.004762
};

let cmLatlng = {
    lat: 18.78,
    lng: 98.98
};

let map = L.map("map", {
    center: cmLatlng,
    zoom: 12
});
const mapbox = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZG9va2RhIiwiYSI6ImNtMWltMmg2YjBuZHAyaXNiYmhveXp5NGUifQ.16lCYAH_WidkhLA6lNEmZQ",
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

const gsat = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
});

const Zoneflood = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/cm_flood/wms?", {
    layers: "cm_flood:zone_floodcm_65",
    format: "image/png",
    name: "lyr",
    iswms: "wms",
    transparent: true,
    maxZoom: 15,
    opacity: 0.5
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const ZonefloodSouth = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:province_4326",
    format: "image/png",
    name: "lyr",
    iswms: "wms",
    transparent: true,
    maxZoom: 15,
    opacity: 0.5,
    CQL_FILTER: 'pro_code=90 OR pro_code=94 OR pro_code=95'
});

var radar = L.layerGroup()
var ms = L.layerGroup()
var watlev = L.layerGroup()
const baseMaps = {
    "Mapbox": mapbox,
    "Google Hybrid": ghyb,
    "แผนที่จากดาวเทียม": gsat.addTo(map)
};

const overlayMaps = {
    "ตำแหน่งน้ำท่วม": ms.addTo(map),
    "ขอบเขตระดับพื้นที่เสี่ยงน้ำท่วม": Zoneflood.addTo(map),
    "ระดับน้ำ": watlev.addTo(map),
    "เรดาห์ฝน": radar.addTo(map)
};

const lyrControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
}).addTo(map);


$(document).ready(function () {
    $.ajax({
        url: '/flood/api/flood-data',
        method: 'GET',
        success: function (data) {
            // DataTable initialization
            const table = $('#floodTable').DataTable({
                data: data,
                columns: [
                    {
                        // Add a delete button
                        data: null,
                        render: function (data) {
                            return `
                                <button class="btn btn-danger btn-sm delete-row" data-id="${data.gid}">
                                    ลบ
                                </button>
                                <button class="btn btn-warning btn-sm edit-row" data-id="${data.gid}">
                                    แก้ไข
                                </button>
                            `;
                        },
                        orderable: false,
                        searchable: false,
                    },
                    // { data: 'usrid' },
                    { data: 'pname' },
                    { data: 'status' },
                    { data: 'wlevel' },
                    { data: "travel" },
                    {
                        data: null,
                        render: function (data, type, row) {
                            // Concatenate the values
                            const help = data.help || "";
                            const helpText = data.help_text || "";
                            return `${help} ${helpText == "" ? "" : "(" + helpText + ")"}`;
                        },
                    }, {
                        data: "ts",
                        render: function (data) {
                            if (!data) return "N/A";
                            const date = new Date(data);

                            // Format as "วัน DD เดือน YYYY เวลา HH:MM น."
                            return new Intl.DateTimeFormat("th-TH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }).format(date) + " น.";
                        },
                    }
                ],
                scrollX: true,
                dom: "Bfrtip",
                buttons: [
                    {
                        extend: "excelHtml5",
                        title: "Flood Data",
                        exportOptions: {
                            columns: ":visible",
                        },
                    },
                ],
                initComplete: function () {
                    getmarker(this.api().data().toArray());
                },
            });

            table.on("draw", function () {
                getmarker(table.rows({ search: "applied" }).data().toArray());
            });

            $("#floodTable").on("click", ".delete-row", function () {
                const row = table.row($(this).parents("tr")); // Get the row
                const rowData = row.data();
                const gid = rowData.gid;

                if (confirm(`Are you sure you want to delete row with GID: ${gid}?`)) {
                    $.ajax({
                        url: `/flood/api/delete-row/${gid}`,
                        type: "DELETE",
                        success: function () {
                            // Remove the row from DataTable
                            row.remove().draw();
                            alert("Row deleted successfully!");
                        },
                        error: function () {
                            alert("Failed to delete the row.");
                        },
                    });
                }
            });
            $("#floodTable").on("click", ".edit-row", function () {
                const row = table.row($(this).parents("tr"));
                const rowData = row.data();

                // Populate modal fields with row data
                $("#editModal").find("#editGid").val(rowData.gid);
                $("#editModal").find("#editUsrid").val(rowData.usrid);
                $("#editModal").find("#editPname").val(rowData.pname);
                $("#editModal").find("#editStatus").val(rowData.status);
                $("#editModal").find("#editWlevel").val(rowData.wlevel);
                $("#editModal").find("#editTravel").val(rowData.travel);
                $("#editModal").find("#editHelp").val(rowData.help);
                $("#editModal").find("#editHelpText").val(rowData.help_text);

                // Show the modal
                $("#editModal").modal("show");

                // Handle form submission
                $("#editForm").off("submit").on("submit", function (e) {
                    e.preventDefault();

                    const updatedData = {
                        gid: rowData.gid,
                        usrid: $("#editUsrid").val(),
                        pname: $("#editPname").val(),
                        status: $("#editStatus").val(),
                        wlevel: $("#editWlevel").val(),
                        travel: $("#editTravel").val(),
                        help: $("#editHelp").val(),
                        help_text: $("#editHelpText").val(),
                    };

                    // Send the updated data to the backend
                    $.ajax({
                        url: `/flood/api/update-row/${updatedData.gid}`,
                        type: "PUT",
                        contentType: "application/json",
                        data: JSON.stringify(updatedData),
                        success: function () {
                            // Update the row in the DataTable
                            row.data(updatedData).draw();
                            alert("แก้ไขสำเร็จ!");
                            $("#editModal").modal("hide");
                        },
                        error: function () {
                            alert("Failed to update the row.");
                        },
                    });
                });
            });
        }
    });
});

// let d
// let getdata = () => {
//     axios.get(`/flood/api/getdata`, {}).then(async (r) => {
//         d = r.data.data;
//         // console.log(d)
//         let numhelp = 0;
//         await d.map(i => {
//             i.help == "ต้องการ" ? numhelp += 1 : null
//         })

//         $("#numhelp").text(numhelp)
//         $('#numall').html(d.length)
//         // getMap(d)
//         getmarker(d)
//     })
// }

let getDirection = (lat, lng) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(i => {
            // location.href = 
            window.open(`https://www.google.com/maps/dir/${i.coords.latitude},${i.coords.longitude}/${lat},${lng}`, '_blank')
        });
    }
}

let getmarker = (data) => {
    try {
        map.eachLayer(i => {
            i.options.name == "marker" ? map.removeLayer(i) : null;
        });

        var MIcon_01 = L.icon({
            iconUrl: './marker/icon-flood1.png',
            iconSize: [50, 50],
            iconAnchor: [30, 50],
            popupAnchor: [-5, -40]
        });
        var MIcon_02 = L.icon({
            iconUrl: './marker/icon-flood2.png',
            iconSize: [50, 50],
            iconAnchor: [30, 50],
            popupAnchor: [-5, -40]
        });
        var MIcon_03 = L.icon({
            iconUrl: './marker/icon-flood3.png',
            iconSize: [50, 50],
            iconAnchor: [30, 50],
            popupAnchor: [-5, -40]
        });


        let numhelp = 0;
        data.map(i => {
            i.help == "ต้องการ" ? numhelp += 1 : null
        })

        $("#numhelp").text(numhelp)
        $('#numall').html(data.length)

        data.map(i => {
            let helptext
            if (i.help_text !== null) {
                helptext = i.help_text
            } else {
                helptext = "-"
            }
            // console.log(i)
            if (i.geojson) {
                let json = JSON.parse(i.geojson);
                if (i.stat == ">48hr") {
                    if (i.help == 'ต้องการ') {
                        let mm = L.geoJson(json, {
                            pointToLayer: function (feature, latlng) {
                                return L.marker(latlng, { name: "marker", icon: MIcon_01 });
                            }
                        }).bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6>
                    <h6><b>สถานะ :</b> ${i.status}</h6>
                    <h6><b>การสัญจร :</b> ${i.travel}</h6>
                    <h6><b>ความช่วยเหลือ :</b> ${i.help} </h6> 
                    <h6><b>รายละเอียด</b>: ${helptext} </h6> 
                    <h6><b>วันที่และเวลา</b>: ${i.tstxt} น.</h6> 
                    <img src="${i.img !== null && i.img !== "" ? i.img : './marker/noimg.png'}"style="width:100%">
                    <hr>
                    <button class="btn btn-success kanit" onclick="getDirection(${i.lat},${i.lng})">นำทาง</button>`)
                        // .addTo(map)
                        ms.addLayer(mm);
                    } else if (i.help == 'ไม่ต้องการ') {
                        let mm = L.geoJson(json, {
                            pointToLayer: function (feature, latlng) {
                                return L.marker(latlng, { name: "marker", icon: MIcon_02 });
                            }
                        }).bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6>
                    <h6><b>สถานะ :</b> ${i.status}</h6>
                    <h6><b>การสัญจร :</b> ${i.travel}</h6>
                    <h6><b>ความช่วยเหลือ :</b> ${i.help} </h6> 
                    <h6><b>รายละเอียด</b>: ${helptext} </h6> 
                    <h6><b>วันที่และเวลา</b>: ${i.tstxt} น.</h6> 
                    <img src="${i.img !== null && i.img !== "" ? i.img : './marker/noimg.png'}"style="width:100%">
                    <hr>
                    <button class="btn btn-success kanit" onclick="getDirection(${i.lat},${i.lng})">นำทาง</button>`)
                        // .addTo(map)
                        ms.addLayer(mm);
                    }
                } else {
                    mm = L.geoJson(json, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, { name: "marker", icon: MIcon_03 });
                        }
                    }).bindPopup(`<h6><b>สถานที่ที่ได้รับผลกระทบ :</b> ${i.pname}</h6>
                <h6><b>สถานะ :</b> ${i.status}</h6>
                <h6><b>การสัญจร :</b> ${i.travel}</h6>
                <h6><b>ความช่วยเหลือ :</b> ${i.help} </h6> 
                <h6> <b>รายละเอียด</b>: ${helptext} </h6> 
                <h6> <b>วันที่และเวลา</b>: ${i.tstxt} น.</h6> 
                <img src="${i.img !== null && i.img !== "" ? i.img : './marker/noimg.png'}"style="width:100%">
                <hr>
                <button class="btn btn-success kanit" onclick="getDirection(${i.lat},${i.lng})">นำทาง</button>`)
                    // .addTo(map)
                    ms.addLayer(mm);
                }
            }
        });
        ms.addTo(map)
    } catch (error) {
        console.error("An error occurred in getmarker:", error);
        alert("An error occurred while loading markers. Please try again later.");
    }
}

let getThaiwaterApi = () => {
    axios.get("https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_load").then(r => {
        r.data.waterlevel_data.data.map(i => {

            var WIcon_01 = L.icon({
                iconUrl: './marker/icon-wtl1.png',
                iconSize: [30, 30],
                iconAnchor: [30, 50],
                popupAnchor: [-13, -40]
            });
            var WIcon_02 = L.icon({
                iconUrl: './marker/icon-wtl2.png',
                iconSize: [30, 30],
                iconAnchor: [30, 50],
                popupAnchor: [-13, -40]
            });
            var WIcon_03 = L.icon({
                iconUrl: './marker/icon-wtl3.png',
                iconSize: [30, 30],
                iconAnchor: [30, 50],
                popupAnchor: [-13, -40]
            });
            var WIcon_04 = L.icon({
                iconUrl: './marker/icon-wtl4.png',
                iconSize: [30, 30],
                iconAnchor: [30, 50],
                popupAnchor: [-13, -40]
            });
            var WIcon_05 = L.icon({
                iconUrl: './marker/icon-wtl5.png',
                iconSize: [30, 30],
                iconAnchor: [30, 50],
                popupAnchor: [-13, -40]
            });

            if (i.station.tele_station_lat && i.storage_percent) {
                // console.log(i);
                if (Number(i.storage_percent) <= 10) {
                    let mk = L.marker([i.station.tele_station_lat, i.station.tele_station_long], {
                        name: "marker", icon: WIcon_01
                    }).bindPopup(`<h4>น้ำน้อยวิกฤต</h4>
                    สถานี${i.station.tele_station_name.th} ต.${i.geocode.tumbon_name.th} อ.${i.geocode.amphoe_name.th} จ.${i.geocode.province_name.th}</br>
                    ระดับน้ำ: ${i.waterlevel_msl} ม.รทก</br>
                    ระดับตลิ่ง: ${i.station.min_bank} ม.รทก</br>
                    ความจุลำน้ำ: <span class="badge rounded-pill text-bg-1">${i.storage_percent} % </span>`)
                    watlev.addLayer(mk)
                } else if (Number(i.storage_percent) <= 30) {
                    let mk = L.marker([i.station.tele_station_lat, i.station.tele_station_long], {
                        name: "marker", icon: WIcon_02
                    }).bindPopup(`<h4>น้ำน้อย</h4>
                    สถานี${i.station.tele_station_name.th} ต.${i.geocode.tumbon_name.th} อ.${i.geocode.amphoe_name.th} จ.${i.geocode.province_name.th}</br>
                    ระดับน้ำ: ${i.waterlevel_msl} ม.รทก</br>
                    ระดับตลิ่ง: ${i.station.min_bank} ม.รทก</br>
                    ความจุลำน้ำ: <span class="badge rounded-pill text-bg-2">${i.storage_percent} % </span>`)
                    watlev.addLayer(mk)
                } else if (Number(i.storage_percent) <= 70) {
                    let mk = L.marker([i.station.tele_station_lat, i.station.tele_station_long], {
                        name: "marker", icon: WIcon_03
                    }).bindPopup(`<h4>น้ำปกติ</h4>
                    สถานี${i.station.tele_station_name.th} ต.${i.geocode.tumbon_name.th} อ.${i.geocode.amphoe_name.th} จ.${i.geocode.province_name.th}</br>
                    ระดับน้ำ: ${i.waterlevel_msl} ม.รทก</br>
                    ระดับตลิ่ง: ${i.station.min_bank} ม.รทก</br>
                    ความจุลำน้ำ: <span class="badge rounded-pill text-bg-3">${i.storage_percent} % </span>`)
                    watlev.addLayer(mk)
                } else if (Number(i.storage_percent) <= 100) {
                    let mk = L.marker([i.station.tele_station_lat, i.station.tele_station_long], {
                        name: "marker", icon: WIcon_04
                    }).bindPopup(`<h4>น้ำมาก</h4>
                    สถานี${i.station.tele_station_name.th} ต.${i.geocode.tumbon_name.th} อ.${i.geocode.amphoe_name.th} จ.${i.geocode.province_name.th}</br>
                    ระดับน้ำ: ${i.waterlevel_msl} ม.รทก</br>
                    ระดับตลิ่ง: ${i.station.min_bank} ม.รทก</br>
                    ความจุลำน้ำ: <span class="badge rounded-pill text-bg-4">${i.storage_percent} % </span>`)
                    watlev.addLayer(mk)
                } else {
                    let mk = L.marker([i.station.tele_station_lat, i.station.tele_station_long], {
                        name: "marker", icon: WIcon_05
                    }).bindPopup(`<h4>น้ำล้นตลิ่ง</h4>
                    สถานี${i.station.tele_station_name.th} ต.${i.geocode.tumbon_name.th} อ.${i.geocode.amphoe_name.th} จ.${i.geocode.province_name.th}</br>
                    ระดับน้ำ: ${i.waterlevel_msl} ม.รทก</br>
                    ระดับตลิ่ง: ${i.station.min_bank} ม.รทก</br>
                    ความจุลำน้ำ: <span class="badge rounded-pill text-bg-5">${i.storage_percent} % </span>`)
                    watlev.addLayer(mk)
                }
            }
        })
    })
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
        div.innerHTML += `ระดับน้ำในแม่น้ำ<br>`;
        div.innerHTML += `<img src= \"./marker/icon-wtl1.png"\" width=\"400px\" height=\"150px\"></i>ระดับน้ำ >= 10 เมตร (น้ำน้อยวิกฤต)</label></div><br>`;
        div.innerHTML += `<img src= \"./marker/icon-wtl2.png"\" width=\"400px\" height=\"150px\"></i>ระดับน้ำ > 10-30 เมตร (น้ำน้อย)</label></div><br>`;
        div.innerHTML += `<img src= \"./marker/icon-wtl3.png"\" width=\"400px\" height=\"150px\"></i>ระดับน้ำ > 30-70 เมตร (น้ำปกติ)</label></div><br>`;
        div.innerHTML += `<img src= \"./marker/icon-wtl4.png"\" width=\"400px\" height=\"150px\"></i>ระดับน้ำ > 70-100 เมตร (น้ำมาก)</label></div><br>`;
        div.innerHTML += `<img src= \"./marker/icon-wtl5.png"\" width=\"400px\" height=\"150px\"></i>ระดับน้ำ > 100 เมตร (น้ำล้นตลิ่ง)</label></div><br>`;
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
// getdata();
getThaiwaterApi();
hideLegend();

$("#detail").click(function () {
    $("#Modaldetail").modal('show')


})

// $("#Modaldetail").modal('show')

