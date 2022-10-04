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
const url = "https://eec-onep.online:3700";

$(document).ready(function () {
    axios.post(url + '/org-api/getdata').then((r) => {
        let selDat = r.data.data
        console.log(selDat)
        loadBypro(selDat)

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
    console.log(d.length)
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