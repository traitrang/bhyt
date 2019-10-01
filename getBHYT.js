var taikhoan="";
var matkhau="";
var tinhtrangravien = Array();
tinhtrangravien[1] = 'Ra viện';
tinhtrangravien[2] = 'Chuyển viện';
tinhtrangravien[3] = 'Trốn viện';
tinhtrangravien[4] = 'Xin ra viện';
var ketquadieutri = Array();
ketquadieutri[1] = 'Khỏi';
ketquadieutri[2] = 'Đỡ';
ketquadieutri[3] = 'Không thay đổi';
ketquadieutri[4] = 'Nặng hơn';
ketquadieutri[5] = 'Tử vong';

function LayThongBHYT_LichSuKham() {
    var tendangnhap = '';
	$.get(window.location.origin+"/web_his/Cau_Hinh_Tham_So_XuatXMLBHYT",
			function(t)
			{
				tendangnhap=$(t).find("#motathamso123").val();
				matkhau=$(t).find("#motathamso124").val();
				
				matkhau = MD5(matkhau);
				console.log(tendangnhap +'  '+ matkhau);
					
				if (tendangnhap || matkhau) {
					$.ajax({
						url : "https://egw.baohiemxahoi.gov.vn/api/token/take",
						type : "post",
						contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
						dataType:"json",
						data : {
							 username : tendangnhap,
							 password : matkhau
						},
						success : function (result){
							var dataAuth = result;
							console.log(result);
							if (result.APIKey) {
								var ngaysinh = '';
								var ten = '';
								var mathe = '';
								var gioitinh = '';
								var noidangky = '';
								var ngayBD = '';
								var ngayKT = '';
								if (document.URL.indexOf('vnptsoftware.vn/vnpthis') != -1) {
									if (document.URL.indexOf('_tiepnhan_') != -1) {
										ngaysinh = $('#txtNGAYSINH').val() ? $('#txtNGAYSINH').val() : $('#txtNAMSINH').val();
										ten = $('#txtTENBENHNHAN').val();
										mathe = $('#txtMA_BHYT').val();
										gioitinh = $('#txtTKGIOITINHID').val();
										noidangky = $('#txtMA_KCBBD').val();
										ngayBD = $('#txtBHYT_BD').val();
										ngayKT = $('#txtBHYT_KT').val();
									} else if (document.URL.indexOf('_ChuyenDoiTuong') != -1) {
										ngaysinh = $('#txtNGAYSINH').val();
										ten = $('#txtTENBENHNHAN').val();
										mathe = $('#txtMABHYT').val();
										gioitinh = $('#cboGIOITINHID').val();
										noidangky = $('#txtTKDKKBBD').val();
										ngayBD = $('#txtBHYT_BD').val();
										ngayKT = $('#txtBHYT_KT').val();
									}
								}

								if (document.URL.indexOf('vnpthis.vn/web_his') != -1) {
									if (document.URL.indexOf('tiepnhan') != -1) {
										var ten = $('#hoten').val();
										var mathe = $('#sobhyt').val();
										var ngaysinh = $('#namsinh').val();
										var isChiNamsinh = $('#chinamsinh').is(":checked");
										var ngayBD = $('#tungay').val();
										var ngayKT = $('#denngay').val();
										var noidangky = $('#noidangky').val();
										var gioitinh = $('#gioitinh').val() == 1 ? 1 : 2;
										
										if (isChiNamsinh) {
											y = new Date(ngaysinh);
											ngaysinh = y.getFullYear();
										}
										
										kiemtrathongtinthebaohiem(dataAuth, tendangnhap, matkhau, ten, mathe, ngaysinh, ngayBD, ngayKT, noidangky, gioitinh);
									} else if (document.URL.indexOf('kiemtrabangke') != -1 ) {
										var ten = $('#hoten').val();
										var mathe = $('#sobhyt').val();
										var ngaysinh = $('#namsinh').val();
										var isChiNamsinh = $('#chinamsinh').is(":checked");
										var ngayBD = $('#gttungay').val();
										var ngayKT = $('#gtdenngay').val();
										var noidangky = $('#noidk').val();
										var gioitinh = $('#gioitinh').val() == 'true' ? 1 : 2;
										var mayte = $('#mayte').val() ? $('#mayte').val() : $('#mabn').val();
										$.ajax({
											url : window.location.origin + '/web_his/thongtinhanhchinh_nhapvien_theomabenhnhan?mabenhnhan=' + mayte,
											type : "GET",
											contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
											data : {
											},
											success : function (result){
												var dateNs = new Date(result[0].NGAY_SINH);
												if (result[0].HIEN_NAMSINH) {
													ngaysinh = dateNs.getFullYear();
												} else {
													var dd = dateNs.getDate();
													var mm = dateNs.getMonth() + 1; //January is 0!

													var yyyy = dateNs.getFullYear();
													if(dd < 10){
														dd= '0' + dd;
													}
													if(mm < 10){
														mm= '0' + mm;
													}
													ngaysinh = dd+'/'+mm+'/'+yyyy;
												}

												kiemtrathongtinthebaohiem(dataAuth, tendangnhap, matkhau, ten, mathe, ngaysinh, ngayBD, ngayKT, noidangky, gioitinh);
											}
										});

										return;
									} else if (document.URL.indexOf('khambenhnoitru') != -1) {
										var id = $("#list_benhnhan").jqGrid('getGridParam', 'selrow');
										var ret = $("#list_benhnhan").jqGrid('getRowData', id);
										var ten = $('#hoten').val();
										var mathe = $('#bhyt').val();
										var dt = new Date();
										var ngaysinh = '';
										var gioitinh = $('#gioitinh').val() == 'true' ? 1 : 2;
										var noidangky = '';//$('#noidangkybandau').val().substring(0,5);
										var isChiNamsinh = false;
										var ngayBD = '';
										var ngayKT = '';
										var stt_benhan='';
										var stt_dotdieutri='';
										
										var id = $("#list_benhnhan").jqGrid('getGridParam', 'selrow');
										var ret = $("#list_benhnhan").jqGrid('getRowData', id);
										if(mathe !=''||mathe!=null){
												$.ajax({
												url : window.location.origin + '/web_his/noitru_ttbenhnhan?mabenhnhan=' + ret.MA_BENH_NHAN,
												type : "GET",
												contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
												success:function(resuft){
													ngaysinh=resuft.NGAY_SINH;
													$.ajax({
														url : window.location.origin + '/web_his/noitru_chitiet_dotdieutri?stt_benhan='+ret.stt_benhan+'&stt_dotdieutri='+ret.stt_dotdieutri+'&dvtt='+tendangnhap.substring(0,5),
														type : "GET",
														contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
														success:function(res){
															kiemtrathongtinthebaohiem(dataAuth, tendangnhap, matkhau, ten, mathe, ngaysinh, res.ngaybatdau_theBHYT, res.ngayhethan_theBHYT, res.noidangkybandau, gioitinh);
														}
													});
												}
											});
										}
										
										$.ajax({
											url : window.location.origin + '/web_his/thongtinhanhchinh_nhapvien_theomabenhnhan?mabenhnhan=' + $('#mabenhnhan').val(),
											type : "GET",
											contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
											data : {
											},
											success : function (result){
												var dateNs = new Date(result[0].NGAY_SINH);
												if (result[0].HIEN_NAMSINH) {
													ngaysinh = dateNs.getFullYear();
												} else {
													var dd = dateNs.getDate();
													var mm = dateNs.getMonth() + 1; //January is 0!

													var yyyy = dateNs.getFullYear();
													if(dd < 10){
														dd= '0' + dd;
													}
													if(mm < 10){
														mm= '0' + mm;
													}
													ngaysinh = dd+'/'+mm+'/'+yyyy;
												}

												DVTT = result[0].DVTT;
												STT_BENHAN = result[0].STT_BENHAN;
												$.ajax({
													url : window.location.origin + '/web_his/noitru_chitiet_dotdieutri',
													type : "post",
													contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
													data : {
														 dvtt : DVTT,
														 stt_benhan : STT_BENHAN,
														 stt_dotdieutri : $('#txt_dotdieutri').val()
													},
													success : function (data){
														ngayBD = data.NGAYBATDAU_THEBHYT;
														ngayKT = data.NGAYHETHAN_THEBHYT;
														noidangky = data.NOIDANGKYBANDAU;
														kiemtrathongtinthebaohiem(dataAuth, tendangnhap, matkhau, ten, mathe, ngaysinh, ngayBD, ngayKT, noidangky, gioitinh);
													}
												});
											}
										});

										//return;
									}else if(document.URL.indexOf('khambenhngoaitru') != -1){
										
										$.ajax({
											url : window.location.origin +'/web_his/timkiembntheobhyt?bhyt=0&mabn=' + $('#mayte').val(),
											type : "GET",
											contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
											data : {
											},
											success : function (result){
												var dateNs = new Date(result[0].NGAY_SINH);
												var ten = $('#hoten').val();
												var mathe = $('#bhyt').val();
												var gioitinh = $('#gioitinh').val() == 'true' ? 1 : 2;
												if (result[0].HIEN_NAMSINH) {
													ngaysinh = dateNs.getFullYear();
												} else {
													var dd = dateNs.getDate();
													var mm = dateNs.getMonth() + 1; //January is 0!

													var yyyy = dateNs.getFullYear();
													if(dd < 10){
														dd= '0' + dd;
													}
													if(mm < 10){
														mm= '0' + mm;
													}
													ngaysinh = dd+'/'+mm+'/'+yyyy;
												}
						
												DVTT = result[0].DVTT;
												ngayBD = result[0].NGAY_BATDAUHIEULUC.substring(8,10)+'/'+result[0].NGAY_BATDAUHIEULUC.substring(5,7)+'/'+result[0].NGAY_BATDAUHIEULUC.substring(0,4);
												ngayKT = result[0].NGAY_KETTHUC.substring(8,10)+'/'+result[0].NGAY_KETTHUC.substring(5,7)+'/'+result[0].NGAY_KETTHUC.substring(0,4);
												noidangky = result[0].MA_NOITIEPNHAN;
												kiemtrathongtinthebaohiem(dataAuth, tendangnhap, matkhau, ten, mathe, ngaysinh, ngayBD, ngayKT, noidangky, gioitinh);
											}
										});
										return;
									}



								}
								
							} else {
								swal( 'Tên đăng nhập hoặc mật khẩu không đúng!');
							}
						}
					});
				} //else {
					//return 'Cần thiết lập tên đăng nhập và mật khẩu';
				//}
			});
	//console.log("Khởi tạo thành công");
    //chrome.storage.sync.get(['tendangnhap', 'matkhau'], function(items) {
        
    //});
}
function kiemtrathongtinthebaohiem(dataAuth, tendangnhap, matkhau, ten, mathe, ngaysinh, ngayBD, ngayKT, noidangky, gioitinh) {
    var url = "https://egw.baohiemxahoi.gov.vn/api/egw/NhanLichSuKCB2018?token=" + dataAuth.APIKey.access_token + '&id_token=' + dataAuth.APIKey.id_token + '&username=' + tendangnhap + '&password=' + matkhau;
	if(document.URL.indexOf('tiepnhanbenhnhan') != -1){
	document.getElementById("tungay").disabled = true;
	document.getElementById("denngay").disabled = true;
	}
	
    $.ajax({
        url : url,
        type : "post",
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data : {
             hoTen : ten,
             maThe : mathe,
             ngaySinh : ngaysinh
        },
        success : function (result){
            var maketqua = ['000', '001', '002', '003', '004'];
            if (result.maKetQua === '000' || result.maKetQua === '001' || result.maKetQua === '002'||result.maKetQua === '003'||result.maKetQua === '003') {
				if(document.URL.indexOf('tiepnhanbenhnhan') != -1)
				Check_Get_BHYT(result);
				text = '';
                var dulieubaohiem = result;
                if (result.dsLichSuKCB2018) {
                            text = '<span style="font-size:16px">';
                            var stringNgayra = dulieubaohiem.dsLichSuKCB2018[0].ngayRa;
                            var stringNgayvao = dulieubaohiem.dsLichSuKCB2018[0].ngayVao;
							
                            stringNgayra = stringNgayra.substring(6,8) + '-' + stringNgayra.substring(4,6) + '-' + stringNgayra.substring(0,4) + '   ' + stringNgayra.substring(8,10) + ' : ' + stringNgayra.substring(10,12);
                            stringNgayvao = stringNgayvao.substring(6,8) + '-' + stringNgayvao.substring(4,6) + '-' + stringNgayvao.substring(0,4) + '   ' + stringNgayvao.substring(8,10) + ' : ' + stringNgayvao.substring(10,12);
                            
                            text += '<br/>Thời gian vào viện gần nhất: <span style="color:#006600">' + stringNgayvao + '</span>';
                            text += '<br/>Thời gian xuất viện gần nhất: <span style="color:#006600">' + stringNgayra + '</span>';
                            if (dulieubaohiem.gtTheTu != ngayBD || dulieubaohiem.gtTheDen != ngayKT) {
                                text += '<br/><span style="color:red">Sai thời hạn sử dụng thẻ. Thời hạn đúng: ' + dulieubaohiem.gtTheTu + ' - ' + dulieubaohiem.gtTheDen + '</span>';
                            }

                            if (dulieubaohiem.ngaySinh != ngaysinh) {
                                text += '<br/><span style="color:red">Sai ngày sinh. Ngày sinh đúng: ' + dulieubaohiem.ngaySinh + '</span>';
                            }

                            if (document.URL.indexOf('khambenhnoitru') != -1) {
                                text = '';
                                if (dulieubaohiem.gtTheTu != ngayBD || dulieubaohiem.gtTheDen != ngayKT) {
                                    text = '<br/><span style="color:red">Thời hạn thẻ: ' + dulieubaohiem.gtTheTu + ' - ' + dulieubaohiem.gtTheDen + '</span>';
                                }
                                if (dulieubaohiem.ngaySinh != ngaysinh) {
                                    text += '<br/><span style="color:red">Ngày sinh đúng: ' + dulieubaohiem.ngaySinh + '</span>';
                                }
                            }

                            if (dulieubaohiem.maDKBD != noidangky) {
                                text += '<br/><span style="color:red">Sai nơi đăng ký. Nơi đăng ký đúng: ' + dulieubaohiem.maDKBD + '</span>';
                            }

                            var convertGt = dulieubaohiem.gioiTinh == 'Nam' ? 1 : 2;
                            if (convertGt != gioitinh) {
                                text += '<br/><span style="color:red">Sai giới tính. Giới tính đúng: ' + dulieubaohiem.gioiTinh + '</span>';
                            }

                            text += '<br/> <span style="color:#006600;font-size: 14pt;font-weight: bold;">' + dulieubaohiem.ghiChu;
                            text += '</span>';
                            if (dulieubaohiem.dsLichSuKCB2018) {
                                var today = new Date();
                                var dd = today.getDate();
                                var mm = today.getMonth() + 1; //January is 0!

                                var yyyy = today.getFullYear();
                                if(dd < 10){
                                    dd= '0' + dd;
                                }
                                if(mm < 10){
                                    mm= '0' + mm;
                                }
                                var today = dd+'-'+mm+'-'+yyyy;
                                var lastDay = stringNgayra.substring(0,10);
                                //var d = '';
                                if (today == lastDay) {
                                    text += '<br/><span style="color: red;">Bệnh nhân đã khám một lần trong ngày!</span>';
                                }

                                text += '<br/><table border="1" style="font-size: 10px"><tbody style="display: inline-block;overflow-y: scroll;max-height:200px;">';
                                var headerTAble = [
                                    'STT',  
                                    'Mã thẻ BHYT',
                                    'Họ và tên',   
                                    'Ngày vào viện',
                                    'Ngày ra viện',
                                    'Chẩn đoán',
                                    'Cơ sở KCB',
                                    'Kết quả điều trị',
                                    'Tình trạng ra viện',
                                ];
                                text += '<tr>';
                                    for (var a = 0; a <= headerTAble.length - 1; a++) {
                                        text += '<td>' + headerTAble[a] + '</td>';
                                    }
                                text += '</tr>';
                                for (var i = 0; i <= dulieubaohiem.dsLichSuKCB2018.length - 1; i ++) {
									
									stringNgayvao = dulieubaohiem.dsLichSuKCB2018[i].ngayVao;
									stringNgayra = dulieubaohiem.dsLichSuKCB2018[i].ngayRa;
							
									stringNgayra = stringNgayra.substring(6,8) + '-' + stringNgayra.substring(4,6) + '-' + stringNgayra.substring(0,4);
									stringNgayvao = stringNgayvao.substring(6,8) + '-' + stringNgayvao.substring(4,6) + '-' + stringNgayvao.substring(0,4);
									
                                    text += '<tr>';
                                        text += '<td>' + (i + 1) + '</td>';
                                        text += '<td>' + mathe + '</td>';
                                        text += '<td>' + ten + '</td>';
                                        text += '<td>' + stringNgayvao + '</td>';
                                        text += '<td>' + stringNgayra + '</td>';
                                        text += '<td>' + dulieubaohiem.dsLichSuKCB2018[i].tenBenh + '</td>';
                                        text += '<td>' + dulieubaohiem.dsLichSuKCB2018[i].maCSKCB + '</td>';
                                        text += '<td>' + ketquadieutri[dulieubaohiem.dsLichSuKCB2018[i].kqDieuTri] + '</td>';
                                        text += '<td>' + tinhtrangravien[dulieubaohiem.dsLichSuKCB2018[i].tinhTrang] + '</td>';
                                    text += '</tr>';
                                }
                                text + '</tbody></table>';
                            }
                            swal( text);
                } else {
					swal( '<span style="color:#006600">' + result.ghiChu + '</span>');
                }
            } else {
                swal( '<span style="color:red">' + result.ghiChu + '</span>');
            }
        }
    });
}
function SetValueThongTinBHYT(hoten,namsinh,bool_namsinh,gt_tungay,gt_denngay,noidangky,cbnoidangky,bool_gioitinh,gioitinh,bool_dungtuyen,diachi){
	 hoten = hoten.toUpperCase();
	$('#hoten').val(hoten);
	$('#namsinh').val(namsinh);
	$('#chinamsinh').prop('checked',bool_namsinh);
	$("#tungay").val(gt_tungay);
	$('#denngay').val(gt_denngay);
	$('#noidangky').val(noidangky);
	$('#cbnoidangky').val(cbnoidangky);
	$('#cbgioitinh').val(bool_gioitinh);
	$('#gioitinh').val(gioitinh);
	$('#dungtuyen').prop('checked', bool_dungtuyen);
	$('#diachi').val(diachi);
	console.log(bool_namsinh);
}
function Check_Get_BHYT(ReSult_BHYT)
{
	if(ReSult_BHYT.maKetQua==='000'){
								var bool_namsinh = false;
								var bool_gioitinh = 'false';
								var value_gioitinh = 0;
								var today = new Date();
								var Yearnow = today.getFullYear();
								var Month = today.getMonth();
								var Day = today.getDay();
								var tuoi, thang, ngay;

								if(ReSult_BHYT.ngaySinh.length == 4){
									 bool_namsinh = true;
									 ReSult_BHYT.ngaySinh = '01/01/'+ReSult_BHYT.ngaySinh;
									 
								}else{
									tuoi = Yearnow - parseInt(ReSult_BHYT.ngaySinh.substring(6,10));
									if(tuoi>6)
									{
										$('#tuoi').val(tuoi);
									}else{
										if(tuoi>0){
											thang = tuoi * 12 + parseInt(Month) -  parseInt(ReSult_BHYT.ngaySinh.substring(3,5));
											if(thang>0)
											{
												$('#thang').val(thang);
											}else{
												ngay = parseInt(Day) - parseInt(ReSult_BHYT.ngaySinh.substring(0,2));
												if(ngay<1)
													ngay = 1;
												$('#ngay').val(ngay);
											}
										}
									}
								}
									
								if(ReSult_BHYT.gioiTinh=='Nam'){
									bool_Gioitinh = 'true';
                                    Value_Gioitinh = 1;
								}
								else
								{
									bool_Gioitinh = 'false';
                                    Value_Gioitinh = 0;
								}
								
								SetValueThongTinBHYT(ReSult_BHYT.hoTen,ReSult_BHYT.ngaySinh,bool_namsinh,ReSult_BHYT.gtTheTu,ReSult_BHYT.gtTheDen,ReSult_BHYT.maDKBD,ReSult_BHYT.maDKBD,bool_Gioitinh,Value_Gioitinh,true,ReSult_BHYT.diaChi);
							}
};
LayThongBHYT_LichSuKham();
function MD5(d){
	result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_};