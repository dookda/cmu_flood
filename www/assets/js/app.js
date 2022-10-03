let latlng = {
    lat: 13.305567,
    lng: 101.383101
};
let map = L.map("map", {
    center: latlng,
    zoom: 8,
    // zoomControl: false
});

var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
});

const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

const tam = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:tam_eac",
    format: "image/png",
    transparent: true,
    // maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const amp = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:amp_eac",
    format: "image/png",
    transparent: true,
    // maxZoom: 14,
    // minZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const pro = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:prov_eac",
    format: "image/png",
    transparent: true,
    // maxZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

var baseMap = {
    "Mapbox": mapbox.addTo(map),
    "google Hybrid": ghyb
}
var overlayMap = {
    "ขอบเขตจังหวัด": pro.addTo(map),
    "ขอบเขตอำเภอ": amp,
    "ขอบเขตตำบล": tam,
}
L.control.layers(baseMap, overlayMap).addTo(map);

$('#card3').on("click", function () {
    $('#card3').addClass('active')
    console.log("ok")
})

let showA = async (code) => {

    await $(`#A${code}`).slideUp("slow", function () {
        // $("#img1").fadeOut().hide()
        $(`#B${code}`).fadeIn(300)
    })
}

async function showB(code) {
    await $(`#B${code}`).fadeOut("slow", function () {
        $(`#A${code}`).slideDown(500)
    })
}
const url = "https://engrids.soc.cmu.ac.th/api";

$(document).ready(function () {
    axios.get(url + '/org-api/getdata').then((r) => {
        let selDat = r.data.data
        // console.log(selDat)
        loadBypro(selDat)
        getMarker(selDat)

    })
});
let loadBypro = async (d) => {
    let chan = 0;
    let csao = 0;
    let chon = 0;
    let trad = 0;
    let nyok = 0;
    let pchin = 0;
    let ryong = 0;
    let skeaw = 0;
    await d.map(i => {
        i.pro_name == "จันทบุรี" ? chan += 1 : null;
        i.pro_name == "ฉะเชิงเทรา" ? csao += 1 : null;
        i.pro_name == "ชลบุรี" ? chon += 1 : null;
        i.pro_name == "ตราด" ? trad += 1 : null;
        i.pro_name == "นครนายก" ? nyok += 1 : null;
        i.pro_name == "ปราจีนบุรี" ? pchin += 1 : null;
        i.pro_name == "ระยอง" ? ryong += 1 : null;
        i.pro_name == "สระแก้ว" ? skeaw += 1 : null;
    })
    // console.log(d.length)
    $('#prov0').text(d.length)
    $('#prov1').text(chon)
    $('#prov2').text(csao)
    $('#prov3').text(ryong)
    $('#prov4').text(chan)
    $('#prov5').text(trad)
    $('#prov6').text(nyok)
    $('#prov7').text(pchin)
    $('#prov8').text(skeaw)
    let data = [
        { pro: "จันทบุรี", value: chan },
        { pro: "ฉะเชิงเทรา", value: csao },
        { pro: "ชลบุรี", value: chon },
        { pro: "ตราด", value: trad },
        { pro: "นครนายก", value: nyok },
        { pro: "ปราจีนบุรี", value: pchin },
        { pro: "ระยอง", value: ryong },
        { pro: "สระแก้ว", value: skeaw },
    ]
}

let getProv_group = (prov) => {
    $('#MP_group').modal('show')
    $('#M_head').text(`รายชื่อกลุ่ม เครือข่าย องค์กรในจังหวัด${prov}`)
    $('#myTable').DataTable().destroy();

    $.extend(true, $.fn.dataTable.defaults, {
        "language": {
            "sProcessing": "กำลังดำเนินการ...",
            "sLengthMenu": "แสดง_MENU_ แถว",
            "sZeroRecords": "ไม่พบข้อมูล",
            "sInfo": "แสดง _START_ ถึง _END_ จาก _TOTAL_ แถว",
            "sInfoEmpty": "แสดง 0 ถึง 0 จาก 0 แถว",
            "sInfoFiltered": "(กรองข้อมูล _MAX_ ทุกแถว)",
            "sInfoPostFix": "",
            "sSearch": "ค้นหา:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "เริ่มต้น",
                "sPrevious": "ก่อนหน้า",
                "sNext": "ถัดไป",
                "sLast": "สุดท้าย"
            },
            "emptyTable": "ไม่พบข้อมูล..."
        }
    });
    let dtable = $('#myTable').DataTable({
        scrollX: true,
        ajax: {
            async: true,
            type: "POST",
            url: url + '/org-api/getdata',
            data: { prov: prov },
            dataSrc: 'data'
        },
        columns: [
            { data: null },
            { data: 'orgname' },
            { data: 'headname' },
            { data: 'orgstatus' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `<button class="btn btn-margin btn btn-primary" onclick="zoomLocation('${row.lat}','${row.lon}','${row.orgname}')">ตำแหน่งที่ตั้ง</button>`
                },
            },
        ],
        // "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        // dom: 'Bfrtip',
        // buttons: [
        //     'excel', 'print'
        // ],
        searching: false
    });

    dtable.on('order.dt search.dt', function () {
        dtable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    axios.get(url + `/th/province`).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            if (i.pv_tn == prov) { zoomSec("pro", i.pv_code) }
        })
    })

    // $('#myTable tbody').on('click', '#getvalue', function () {
    //     var data = table.row($(this).parents('tr')).data();
    //     zoomExtent(data)
    // });
}
let closeModal = () => {
    $('#myTable').DataTable().ajax.reload();
}

let zoomLocation = (lat, lon, name) => {
    $('#MP_group').modal('hide')
    // var a = [data];
    // console.log(data)
    // a.map(i => {
    var pop = L.popup({ minWidth: 200 });
    let content = `<h6 class="text-center"><b>${name}</b></h6>`;
    let setlocation = [];
    setlocation.push({
        "lat": lat,
        "lng": lon,
    })
    pop.setContent(content);
    pop.setLatLng(setlocation[0]);
    pop.openOn(map);
    var zoom = 18
    map.flyTo([lat, lon], zoom)
    // })
}

let onEachFeature = (feature, layer) => {
    // console.log(feature);
    if (feature.properties) {
        layer.bindPopup(`<h6 class"kanit"><b>${feature.properties.orgname}</b></h6>
            <span>${feature.properties.orgstatus}</span>
            <br><img src="${feature.properties.img !== null ? feature.properties.img : './assets/img/noimg.png'}" width="240px">`,
            { maxWidth: 240 });
    }
}
var markers = L.markerClusterGroup();
let getMarker = (d) => {
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });

    if (markers) {
        markers.eachLayer(i => {
            i.options.name == "marker" ? markers.removeLayer(i) : null;
        })
    }

    d.map(i => {
        // console.log(i);
        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            json.properties = { orgname: i.orgname, orgstatus: i.orgstatus, img: i.img };

            let mm = L.geoJson(json, {
                onEachFeature: onEachFeature,
                name: "marker"
            })
            markers.addLayer(mm);
            // .addTo(map)
        }
    });
    map.addLayer(markers);
}
var boundStyle = {
    "color": "#ff7800",
    "fillColor": "#fffcf5",
    "weight": 5,
    "opacity": 0.45,
    "fillOpacity": 0.25
};
let remove_Lbng = () => {
    map.eachLayer(i => {
        // console.log(i);
        i.options.name == "bnd" ? map.removeLayer(i) : null;
    })
}
let zoomSec = (lyr, code) => {
    // axios.get(url + `/eec-api/get-extent/${lyr}/${code}`).then(r => {
    //     let geom = JSON.parse(r.data.data[0].geom)
    //     // console.log(geom);
    //     map.fitBounds([
    //         geom.coordinates[0][0],
    //         geom.coordinates[0][2],
    //     ]);
    // })
    remove_Lbng()
    axios.get(`${url}/eec-api/get-bound/${lyr}/${code}`).then(async (r) => {
        let geojson = await JSON.parse(r.data.data[0].geom);
        // console.log(geojson);
        let a = L.geoJSON(geojson, {
            style: boundStyle,
            name: "bnd"
        }).addTo(map);
        map.fitBounds(a.getBounds());
    })
}


