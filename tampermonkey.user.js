// ==UserScript==
// @name         n0x - QLDT-DKTC
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Auto đăng ký tín chỉ PTIT
// @author       n0xgg04 - Luong Tuan Anh
// @updateURL https://raw.githubusercontent.com/n0xgg04/PTIT_Auto_DangKyTin/main/tampermonkey.user.js
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
            "key": "22",
            "ntt": "  "
        },
        {
            "name": "Kinh tế chính trị",
            "tableId": "BAS1151",
            "key": "04",
            "ntt": "  "
        },
        {
            "name": "Tin học cơ sở 2",
            "tableId": "INT1155",
            "key": "15",
            "ntt":"  "
        }
    ]
 </textarea>
  <label>Tự động lưu: </label>
 <input type="checkbox" name="autosave" value="1" id="autosave">
  <input style="margin-top:20px;" type="button" name="jsonShowHide" id="jsonShowHide" value="Hiện JSON">
  <input style="margin-top:20px;" type="button" name="refresh" id="refresh" value="Nhập từ JSON">
<div class="tableSubject" style="margin-top:20px;border: 1px solid">
<table id="monHoc">
<thead style=" background-color: #3f87a6;
    color: #fff;">
<td>STT</td>
<td>Môn học</td>
<td>Mã môn</td>
<td>NMH</td>
<td>NTT</td>
<td>Hành động</td>
</thead>
<tbody>
<tbody>
</table>
</div>
 <div style="margin-left: 10px;display:inline" >
 </div>
 </hr><br>
  <input style="margin-top:20px;" type="button" name="autopick" id="autopick" value="Đăng ký tín">
   <input type="button" id="addMon" name="addMon" value="Thêm môn">
  <div id="n0x_result">
    <h5>Kết quả :</h5>
  </div>
 </div>

                       `);
    $('#jsonShowHide').click(()=>{
        if(document.getElementById("dataR").style.display=="none") $('#dataR').show(); else  $('#dataR').hide();
    });

    var Danhsach = [
        {
            "name": "Giáo dục thể chất",
            "tableId": "BAS1107",
            "key": "22",
            "ntt": "  "
        },
        {
            "name": "Kinh tế chính trị",
            "tableId": "BAS1151",
            "key": "04",
            "ntt": "  "
        },
        {
            "name": "Tin học cơ sở 2",
            "tableId": "INT1155",
            "key": "15",
            "ntt":"  "
        }
    ]
    const save = localStorage.getItem('dangkyMon');

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



    const lamMoi = (mode = false) => {
        var save = localStorage.getItem('dangkyMon');
        var arr;
        if(save==null||save==" "){
         arr = JSON.parse($('#dataR').val())

        console.log(arr)
        }else{
         arr = JSON.parse(save);
         $('#dataR').html(save)
        }
        if(mode) arr=JSON.parse($('#dataR').val())
        let i = 1;
        $("#monHoc > tbody").html("");
        arr.forEach((item) => {
            $('#monHoc').append(`<tr><td>${i}</td><td>${item.name}</td><td>${item.tableId}</td><td>${item.key}</td><td>${item.ntt}</td><td></td></tr>`);
            i++;
        })
         $('#monHoc').append(`<tr><td>Thêm</td><td><input type="text" name="addName" id="addName" placeholder="Tên môn ( tuỳ chọn )" required></td><td><input type="text" name="addtableId" id="addtableId" placeholder="Mã môn" required></td><td><input type="text" name="addNMH" id="addNMH" placeholder="NMH" required></td><td><input type="text" name="addNTT" id="addNTT" placeholder="NTT" required></td><td></td></tr>`);
    }


    $('#refresh').click(() => {
        lamMoi(true)
        localStorage.setItem('dangkyMon',$('#dataR').val());
    });

   $('#addMon').click( () => {
        var arr = JSON.parse($('#dataR').val());
        var ntt="  ";
        if($('#addNTT').val()==""||$('#addNTT').val()==null) ntt="  "; else ntt=$('#addNTT').val();
         arr.push({
            "name": $('#addName').val(),
            "tableId": $('#addtableId').val(),
            "key": $('#addNMH').val(),
            "ntt": ntt
        });

        let i = 1;
        $('#dataR').html(JSON.stringify(arr))
        $("#monHoc > tbody").html("");
        arr.forEach((item) => {
            $('#monHoc').append(`<tr><td>${i}</td><td>${item.name}</td><td>${item.tableId}</td><td>${item.key}</td><td>${item.ntt}</td><td></td></tr>`);
            i++;
        })
         localStorage.setItem('dangkyMon',JSON.stringify(arr));
         $('#monHoc').append(`<tr><td>Thêm</td><td><input type="text" name="addName" id="addName" placeholder="Tên môn ( tuỳ chọn )" required></td><td><input type="text" name="addtableId" id="addtableId" placeholder="Mã môn" required></td><td><input type="text" name="addNMH" id="addNMH" placeholder="NMH" required></td><td><input type="text" name="addNTT" id="addNTT" placeholder="NTT" required></td><td></td></tr>`);
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

    const getKey = (tableId,key) => {
        var data =  $('#divTDK > table > tbody > tr > td > input').val();
        var arr = data.split('|')[0].split('  ') ;
        if(arr.length>2) return `chk_${tableId}${key}    `;
        return `chk_${tableId}${key}    `;
    }

    async function Dangkymon(thongtin) {
        await switchTo(thongtin.tableId);
        await DelayTime(2000)
        var failedCount = 0
        setTimeout(() => {
            while (Dangky(`chk_${thongtin.tableId}${thongtin.key}  ${thongtin.ntt}`, thongtin.name) == 0 && failedCount < 10) {
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
    $('#dataR').hide();

})();
