let latlng = {
    lat: 18.795596138999183,
    lng: 98.99357810528674
}
let map = L.map('map', {
    center: latlng,
    zoom: 9
});

let marker, gps;
const url = "https://engrids.soc.cmu.ac.th/p3600";

function loadMap() {
    var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1,
        lyrname: "bmap"
    });

    const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        lyrname: "bmap"
    });
    const pro = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eec/wms?", {
        layers: "eec:a__01_prov_eec",
        format: "image/png",
        transparent: true,
        // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
    });
    var baseMap = {
        "Mapbox": mapbox,
        "google Hybrid": ghyb.addTo(map)
    }
    var overlayMap = {
        // "ขอบเขตจังหวัด": pro.addTo(map),
    }
    L.control.layers(baseMap, overlayMap).addTo(map);
}

let rmlayer = () => {
    map.eachLayer(i => {
        i.options.mk ? map.removeLayer(i) : null;
    })
}

let onLocationFound = async (e) => {
    // console.log(e.latlng)
}

map.on('locationfound', onLocationFound);
map.locate({ setView: true, maxZoom: 16 });

var geom = "";
var dataurl = "";

var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: ""
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);

lc.start();

map.on("click", (e) => {
    console.log(e.latlng);
    geom = [e.latlng.lng, e.latlng.lat]
    rmlayer()
    L.marker(e.latlng, { mk: "mk" }).addTo(map)
})

$("#imgfile").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file);
        document.getElementById('preview').src = imageOriginal;
    }
    reader.readAsDataURL(file);
});

let resizeImage = (file) => {
    var maxW = 600;
    var maxH = 600;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = document.createElement('img');
    var result = '';
    img.onload = function () {
        var iw = img.width;
        var ih = img.height;
        var scale = Math.min((maxW / iw), (maxH / ih));
        var iwScaled = iw * scale;
        var ihScaled = ih * scale;
        canvas.width = iwScaled;
        canvas.height = ihScaled;
        context.drawImage(img, 0, 0, iwScaled, ihScaled);
        result += canvas.toDataURL('image/jpeg', 0.5);
        dataurl = result;
        // document.getElementById('rez').src = that.imageResize;
    }
    img.src = URL.createObjectURL(file);
}


let postData = async () => {
    let pname = document.getElementById("pname").value
    let status = document.querySelector('input[name="status"]:checked').value;
    let travel = document.querySelector('input[name="travel"]:checked').value;
    let help = document.querySelector('input[name="help"]:checked').value;
    let help_text = document.getElementById("help_text").value
    let datObj = {
        data: {
            pname,
            status,
            travel,
            help,
            help_text,
            geom: geom,
            img: dataurl
        }
    }
    console.log(datObj);
    await axios.post("/flood/api/insertdata", datObj).then(() => {
        $('#Modalconfirm').modal('show')
    });
}

$(document).ready(() => {
    loadMap();
});

$("#help1").on("click", function () {
    var n = $("#help1").val()
    // console.log(a)
    if (n == "ต้องการ") {
        $("#detailhelp1").show();
    } else {
        (n == "")
        $("#detailhelp1").hide();
    }
})
$("#help2").on("click", function () {
    var n = $("#help2").val()
    // console.log(a)
    if (n == "ไม่ต้องการ") {
        $("#detailhelp1").hide();
    } else {
        (n == "")
        $("#detailhelp1").hide();
    }
})

$("#detailhelp1").hide()