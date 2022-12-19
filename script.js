// ==UserScript==
// @name         n0x - QLDT-DKTC
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Auto đăng ký tín chỉ PTIT
// @author       n0xgg04 - Luong Tuan Anh
// @updateURL https://raw.githubusercontent.com/n0xgg04/PTIT_Auto_DangKyTin/main/script.js
// @match        https://qldt.ptit.edu.vn/Default.aspx?page=dkmonhoc
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("Injection by @n0xgg04")
    $('div#divfilters').after(`</hr>
<div class="n0xgg04" style="
margin-left: 20px;
margin-bottom: 30px;
">
<h5>Để sử dụng script vui lòng tắt script hiện bảng biểu để tránh lỗi...</h5>
 <label>Delay (milisecond) :</label>
 <input type="number" name="delayTime" id="delayTime" value="5000">
 <br>
 <label>Danh sách môn (Json) :</label>
 <textarea rows="10" cols="50" style="margin-top:10px;margin-bottom" name="dataR" id="dataR">
 [
	{
		"name": "Giáo dục thể chất",
		"tableId": "BAS1107",
		"key": "22"
	},
	{
		"name": "Kinh tế chính trị",
		"tableId": "BAS1151",
		"key": "04"
	},
	{
		"name": "Tin học cơ sở 2",
		"tableId": "INT1155",
		"key": "15"
	},
{
		"name": "Giải tích 2",
		"tableId": "BAS1204",
		"key": "17"
	}
]
 </textarea>
  <label>Tự động lưu: </label>
 <input type="checkbox" name="autosave" value="1" id="autosave">
<div class="tableSubject" style="margin-top:20px;border: 1px solid">
<table id="monHoc">
<thead style=" background-color: #3f87a6;
    color: #fff;">
<td>STT</td>
<td>Môn học</td>
<td>Mã môn</td>
<td>NMH</td>
</thead>
<tbody>
<tbody>
</table>
</div>
 <div style="margin-left: 10px;display:inline" >
 </div>
 </hr><br>
  <input style="margin-top:20px;" type="button" name="autopick" id="autopick" value="Đăng ký tín">
   <input style="margin-top:20px;" type="button" name="refresh" id="refresh" value="Làm mới">
  <div id="n0x_result">
    <h5>Kết quả :</h5>
  </div>
 </div>

                       `);

    var Danhsach = [
        {
            "name": "Giáo dục thể chất",
            "tableId": "BAS1107",
            "key": "22",
        },
        {
            "name": "Kinh tế chính trị",
            "tableId": "BAS1151",
            "key": "04",
        },
        {
            "name": "Tin học cơ sở 2",
            "tableId": "INT1155",
            "key": "15"
        }
    ]

    $('#n0x_result').hide()

    $('#autopick').click(() => {
        $('#n0x_result').show()
        var dss = JSON.parse($('#dataR').val())
        console.log(dss)
        RunAuto(dss);
        $("#autopick").val("Đang đăng ký...")
    });

    const removeNth = (arr, n) => {
        for (let i = n - 1; i < arr.length; i += n) {
            arr.splice(i, 1);
        };
    };


    const lamMoi = () => {
        var arr = JSON.parse($('#dataR').val())
        console.log(arr)
        let i = 1;
        $("#monHoc > tbody").html("");
        arr.forEach((item) => {
            $('#monHoc').append(`<tr><td>${i}</td><td>${item.name}</td><td>${item.tableId}</td><td>${item.key}</td></tr>`);
            i++;
        })
    }




    $('#refresh').click(() => {
        lamMoi()
    });


    let delayTime = $("#delayTime").val()

    const switchTo = (maMonHoc) => {
        var selector = document.getElementById("selectMonHoc").value = maMonHoc
        selectMonHoc_changed()
        return;
    }

    const writeLog = (content) => {
        var old = $('#n0x_result').html()
        $('#n0x_result').html(`${old}${content}`);
    }

    const Dangky = (idMon, tenMon = "") => {
        //   var selector = document.getElementById(idMon)
        if (document.getElementById(idMon) == null) return 0;
        if (document.getElementById(idMon).disabled) {
            console.log(`%cĐăng ký môn ${tenMon} (${idMon}) thất bại do hết slot!\n`, 'color: red;');
            writeLog(`<p style="color:red;margin-top:0;margin-bottom:0;">Đăng ký môn ${tenMon} (${idMon}) thất bại do hết slot!</p>`);
            return 1;
        }

        if (document.getElementById(idMon).checked) {
            console.log(`%cBạn đã đăng ký ${tenMon} (${idMon}) trước đó!\n`, 'color: red;');
            writeLog(`<p style="color:red;margin-top:0;margin-bottom:0;">Bạn đã đăng ký ${tenMon} (${idMon}) trước đó!</p>`);
            return 1;
        }

        document.getElementById(idMon).checked = true
        toDKSelectedChange(document.getElementById(idMon))
        console.log(`%cĐã đăng ký ${tenMon} (${idMon}) thành công`, 'color: green;');
        writeLog(`<p style="color:green;margin-top:0;margin-bottom:0;">Bạn đã đăng ký ${tenMon} (${idMon}) thành công!</p>`);
        return 1;
    }

    async function Dangkymon(thongtin) {
        await switchTo(thongtin.tableId);
        await DelayTime(2000)
        var failedCount = 0
        setTimeout(() => {
            while (Dangky(`chk_${thongtin.tableId}${thongtin.key}    `, thongtin.name) == 0 && failedCount < 10) {
                // DelayTime()
                failedCount++;
                console.error('%cFailed! \n', 'color: black;');
            }
        }, 1000)
    }






    const DelayTime = (sec) => {
        return new Promise((res) => {
            setTimeout(() => {
                res();
            }, sec)
        })
    }

    async function RunAuto(dss) {
        for (let i = 0; i < dss.length; i++) {
            await DelayTime(1000)
            Dangkymon(dss[i])
            await DelayTime(delayTime)
        }
        $("#autopick").val("Đã xong!")
        if (document.getElementById("autosave").checked) {
            LuuDanhSachDangKy()
            console.log("Tu dong luu thanh cong")
        }
    }

    lamMoi()

})();
