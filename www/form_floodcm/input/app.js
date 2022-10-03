const url = "https://engrids.soc.cmu.ac.th/api";
let latlng = {
    lat: 18.774111,
    lng: 99.001912
};
let map = L.map("map", {
    center: latlng,
    zoom: 8
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

const tam = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:tam_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const amp = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:amp_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 14,
    // minZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const pro = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:prov_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});


const baseMaps = {
    "Mapbox": mapbox.addTo(map),
    "Google Hybrid": ghyb
};

const overlayMaps = {
    "ขอบเขตจังหวัด": pro.addTo(map),
    "ขอบเขตอำเภอ": amp,
    "ขอบเขตตำบล": tam,
};

const lyrControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
}).addTo(map);


map.pm.addControls({
    position: 'topleft',
    drawMarker: true,
    drawCircle: false,
    drawPolygon: false,
    drawPolyline: false,
    drawRectangle: false,
    drawCircleMarker: false,
    cutPolygon: false,
    editMode: false,
    removalMode: true,
    dragMode: false,
    rotateMode: false,
});

let datageom
map.on('pm:create', e => {
    lc.stop();
    map.eachLayer(i => {
        if (i.options.name == "Marker") {
            map.removeLayer(i)
        }
    })
    var data = e.layer.toGeoJSON();
    // console.log(data.geometry.type)
    if (data.geometry.type == "Point") {
        // var latlng = data.geometry.coordinates;
        var latlng = data.geometry.coordinates;
        var lat = $('#lat').val();
        var lng = $('#lng').val();

        // if (lat == "" && lng == "") {
        $('#lat').val(latlng[1]);
        $('#lng').val(latlng[0]);
        $('#accuracy').val(0);
        // }
    }
    // console.log(e.layer.toGeoJSON())
    datageom = e.layer.toGeoJSON();
});
map.on('pm:remove', e => {
    // console.log(e)
    $('#lat').val("");
    $('#lng').val("");
    $('#accuracy').val("");
})

$('#imgfile1').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview1').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(1);
});
$('#imgfile2').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview2').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(2);
});
$('#imgfile3').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview3').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(3);
});
$('#imgfile4').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview4').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(4);
});
$('#imgfile5').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview5').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(5);
});
$('#imgfile6').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview6').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(6);
});
let latlnggps
let onLocationFound = (e) => {
    // console.log(e)
    var radius = e.accuracy;
    // if (radius <= 50) {
    latlnggps = e.latlng;
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    $('#lat').val(lat.toFixed(7));
    $('#lng').val(lng.toFixed(7));
    $('#accuracy').val(radius.toFixed(2));

    // }
    // changeLatlng(e.latlng);
}
function changeLatlng(latlng) {
}
map.on("locationfound", onLocationFound);
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: "ตำแหน่ง"
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);
// lc.start();
let markerlocate = () => {
    map.eachLayer(i => {
        if (i.options.pane == "markerPane") {
            map.removeLayer(i)
        }
        // console.log(i.options)
    })
    // lc.start();
    // $('#lat').prop('readonly', true);
    // $('#lng').prop('readonly', true);
    // $('#accuracy').prop('readonly', true);
}
let gps
let stoplocate = () => {
    lc.stop();
    gps = L.marker(latlnggps, {
        draggable: true,
        name: 'Marker'
    });
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
}
let dataimgurl1 = "";
let dataimgurl2 = "";
let dataimgurl3 = "";
let dataimgurl4 = "";
let dataimgurl5 = "";
let dataimgurl6 = "";
let resize = (R_img) => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var filesToUploads = document.getElementById(`imgfile${R_img}`).files;
        var file = filesToUploads[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement("img");
                img.src = e.target.result;
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var MAX_WIDTH = 800;
                var MAX_HEIGHT = 800;
                var width = img.width;
                var height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                if (R_img == 1) { dataimgurl1 = canvas.toDataURL(file.type) }
                else if (R_img == 2) { dataimgurl2 = canvas.toDataURL(file.type) }
                else if (R_img == 3) { dataimgurl3 = canvas.toDataURL(file.type) }
                else if (R_img == 4) { dataimgurl4 = canvas.toDataURL(file.type) }
                else if (R_img == 5) { dataimgurl5 = canvas.toDataURL(file.type) }
                else if (R_img == 6) { dataimgurl6 = canvas.toDataURL(file.type) }

                // document.getElementById('output').src = dataurl;
            }
            reader.readAsDataURL(file);
        }
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

}

$("#noticenaturdis").on("change", function () {
    var n = $("#noticenaturdis").val()
    // console.log(a)
    if (n == "พายุฝนฟ้าคะนอง") {
        $("#detail_storm").show();
        $("#detail_seawaves").hide();
        $("#detail_flood").hide();
        $("#detail_drought").hide();
        $("#detail_othernaturdis").hide();
    } else if (n == "คลื่นพายุซัดฝั่ง") {
        $("#detail_storm").hide();
        $("#detail_seawaves").show();
        $("#detail_flood").hide();
        $("#detail_drought").hide();
        $("#detail_othernaturdis").hide();
    } else if (n == "น้ำท่วม") {
        $("#detail_storm").hide();
        $("#detail_seawaves").hide();
        $("#detail_flood").show();
        $("#detail_drought").hide();
        $("#detail_othernaturdis").hide();
    } else if (n == "ภัยแล้ง") {
        $("#detail_storm").hide();
        $("#detail_seawaves").hide();
        $("#detail_flood").hide();
        $("#detail_drought").show();
        $("#detail_othernaturdis").hide();
    } else if (n == "อื่นๆ") {
        $("#detail_storm").hide();
        $("#detail_seawaves").hide();
        $("#detail_flood").hide();
        $("#detail_drought").hide();
        $("#detail_othernaturdis").show();
    } else {
        (n == "")
        $("#detail_storm").hide();
        $("#detail_seawaves").hide();
        $("#detail_flood").hide();
        $("#detail_drought").hide();
        $("#detail_othernaturdis").hide();
    }
})
if ($("#noticenaturdis").val() == "พายุฝนฟ้าคะนอง") {
    $("#detail_storm").show();
    $("#detail_seawaves").hide();
    $("#detail_flood").hide();
    $("#detail_drought").hide();
    $("#detail_othernaturdis").hide();
}
else if ($("#noticenaturdis").val() == "คลื่นพายุซัดฝั่ง") {
    $("#detail_storm").hide();
    $("#detail_seawaves").show();
    $("#detail_flood").hide();
    $("#detail_drought").hide();
    $("#detail_othernaturdis").hide();
}
else if ($("#noticenaturdis").val() == "น้ำท่วม") {
    $("#detail_storm").hide();
    $("#detail_seawaves").hide();
    $("#detail_flood").show();
    $("#detail_drought").hide();
    $("#detail_othernaturdis").hide();
}
else if ($("#noticenaturdis").val() == "ภัยแล้ง") {
    $("#detail_storm").hide();
    $("#detail_seawaves").hide();
    $("#detail_flood").hide();
    $("#detail_drought").show();
    $("#detail_othernaturdis").hide();
}
else if ($("#noticenaturdis").val() == "อื่นๆ") {
    $("#detail_storm").hide();
    $("#detail_seawaves").hide();
    $("#detail_flood").hide();
    $("#detail_drought").hide();
    $("#detail_othernaturdis").show();
}
else {
    ($("#noticenaturdis").val() == "")
    $("#detail_storm").hide();
    $("#detail_seawaves").hide();
    $("#detail_flood").hide();
    $("#detail_drought").hide();
    $("#detail_othernaturdis").hide();
}

let getpro = () => {
    // var url = "http://localhost:3000";
    axios.get(url + `/th/province`).then(async (r) => {
        var d = r.data.data;
        // console.log(d)
        d.map(i => {
            $('#pro').append(`<option value="${i.pv_code}">${i.pv_tn}</option>`)
        })
    })
}
getpro()
let prov_n = "", prov_c = "", amp_n = "", amp_c = "", tam_n = "", tam_c = "";
$('#pro').on('change', function () {
    var code = $('#pro').val()
    $("#amp").empty();
    $("#tam").empty();
    // var url = "http://localhost:3000";
    axios.post(url + `/th/amphoe`, { pv_code: code }).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#amp').append(`<option value="${i.ap_idn}">${i.ap_tn}</option>`)
        })
        amp_n = d[0].ap_tn
        amp_c = d[0].ap_idn
    })
    prov_n = $('#pro').children("option:selected").text()
    prov_c = $('#pro').children("option:selected").val()
    console.log(prov_n)
})

$('#amp').on('change', function () {
    var code = $('#amp').val()
    $("#tam").empty();
    // var url = "http://localhost:3000";
    axios.post(url + `/th/tambon`, { ap_idn: code }).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#tam').append(`<option value="${i.tb_idn}">${i.tb_tn}</option>`)
        })
        tam_n = d[0].tb_tn
        tam_c = d[0].tb_idn
    })
    amp_n = $('#amp').children("option:selected").text()
    amp_c = $('#amp').children("option:selected").val()
    // console.log(amp_c)
})

$('#tam').on('change', function () {
    tam_n = $('#tam').children("option:selected").text()
    tam_c = $('#tam').children("option:selected").val()
    // console.log(tam_c)
})

var sts
$('#status input').on('change', function () {
    sts = $('input[name=radioName]:checked', '#status').val()
    // console.log($('input[name=gridRadios]:checked', '#status').val());
});

let savedata = async () => {

    let ST1, ST2, ST3, ST4
    var STn1 = document.getElementById('destorm1');
    if (STn1.checked == true) {
        ST1 = $('#destorm1').val()
    } else { ST1 = "" }
    var STn2 = document.getElementById('destorm2');
    if (STn2.checked == true) {
        ST2 = $('#destorm2').val()
    } else { ST2 = "" }

    var STn3 = document.getElementById('destorm3');
    if (STn3.checked == true) {
        ST3 = $('#destorm3').val()
    } else { ST3 = "" }

    var STn4 = document.getElementById('destorm4');
    if (STn4.checked == true) {
        ST4 = $('#destorm4').val()
    } else { ST4 = "" }


    let SW1, SW2, SW3, SW4
    var SWn1 = document.getElementById('deseawaves1');
    if (SWn1.checked == true) {
        SW1 = $('#deseawaves1').val()
    } else { SW1 = "" }
    var SWn2 = document.getElementById('deseawaves2');
    if (SWn2.checked == true) {
        SW2 = $('#deseawaves2').val()
    } else { SW2 = "" }

    var SWn3 = document.getElementById('deseawaves3');
    if (SWn3.checked == true) {
        SW3 = $('#deseawaves3').val()
    } else { SW3 = "" }

    var SWn4 = document.getElementById('deseawaves4');
    if (SWn4.checked == true) {
        SW4 = $('#deseawaves4').val()
    } else { SW4 = "" }

    let F1, F2, F3, F4
    var Fn1 = document.getElementById('deflood1');
    if (Fn1.checked == true) {
        F1 = $('#deflood1').val()
    } else { F1 = "" }
    var Fn2 = document.getElementById('deflood2');
    if (Fn2.checked == true) {
        F2 = $('#deflood2').val()
    } else { F2 = "" }

    var Fn3 = document.getElementById('deflood3');
    if (Fn3.checked == true) {
        F3 = $('#deflood3').val()
    } else { F3 = "" }

    var Fn4 = document.getElementById('deflood4');
    if (Fn4.checked == true) {
        F4 = $('#deflood4').val()
    } else { F4 = "" }

    let D1, D2
    var Dn1 = document.getElementById('dedrought1');
    if (Dn1.checked == true) {
        D1 = $('#dedrought1').val()
    } else { D1 = "" }
    var Dn2 = document.getElementById('dedrought2');
    if (Dn2.checked == true) {
        D2 = $('#dedrought2').val()
    } else { D2 = "" }

    let data = [{
        lat: $('#lat').val(),
        lng: $('#lng').val(),
        accuracy: $('#accuracy').val(),
        no: $('#no').val(),
        moo: $('#moo').val(),
        vill: $('#vill').val(),
        noticenaturdis: $('#noticenaturdis').val(),
        destorm1: ST1,
        destorm2: ST2,
        destorm3: ST3,
        destorm4: ST4,
        destorm5: $('#destorm5').val(),
        deseawaves1: SW1,
        deseawaves2: SW2,
        deseawaves3: SW3,
        deseawaves4: SW4,
        deseawaves5: $('#deseawaves5').val(),
        deflood1: F1,
        deflood2: F2,
        deflood3: F3,
        deflood4: F4,
        deflood5: $('#deflood5').val(),
        dedrought1: D1,
        dedrought2: D2,
        dedrought3: $('#dedrought3').val(),
        othernaturdis: $('#othernaturdis').val(),
        status: sts,
        prov_tn: prov_n,
        amp_tn: amp_n,
        tam_tn: tam_n,
        prov_code: prov_c,
        amp_code: amp_c,
        tam_code: tam_c,
        id_date: Date.now(),
        proj_id: $('#proj_id').val(),
        datetimes: $('#datetimes').val(),
        record: $('#record').val(),
        imgfile1: dataimgurl1,
        imgfile2: dataimgurl2,
        imgfile3: dataimgurl3,
        imgfile4: dataimgurl4,
        imgfile5: dataimgurl5,
        imgfile6: dataimgurl6,
        id_user: $('#record').val(),
        geom: datageom ? datageom : { type: 'Point', coordinateslng: [$('#lng').val(),], coordinateslat: [$('#lat').val(),] },

    }]
    // console.log(data)
    sendData(data)
}

let sendData = async (data) => {
    const obj = {
        data: data
    }
    // console.log(obj)
    await axios.post(url + "/disaster-eac/save", obj).then((r) => {
        r.data.data == "success" ? $('#Modalconfirm').modal('show') : null
    })

    return false;
}
// sendData()

// let Modalconfirm = (geom) => {
//     if (geom !== 'null') {
//         $('#Modalconfirm').modal('show');
//     } else {
//         $('#Modalconfirm').modal('hide');
//     }
// }

// Modalconfirm()


let closeModal = () => {
    $('#Modalconfirm').modal('hide')
}


// sendData()
