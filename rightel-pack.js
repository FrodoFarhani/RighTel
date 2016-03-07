/*
	Last Modified:	10:29 Tuesday, February 9, 2016
	4D617A696172204261727A69
*/

$(function(){
	filteringHandller();
	$.fn.RighTelPack().call();
});


function filteringHandller() {
	var n = null;
	header = $("#dynamicFilter .header");
	options = $("#dynamicFilter .options li");
	viewall = $("#dynamicFilter .viewall");
	header.hover(function() {
		var t = $(this);
		n = window.setTimeout(function() {
			t.parent().addClass("hover").find(".hitarea").removeClass("hidden");
			t.addClass("expanded").find("div.options").slideDown()
		}, 300)
		}, function() {
		window.clearTimeout(n);
		$(this).parent().removeClass("hover").find(".hitarea").addClass("hidden");
		$(this).removeClass("expanded").find("div.options").hide()
	});
	options.mouseover(function() {
		$(this).addClass("hover")
	});
	options.mouseout(function() {
		$(this).removeClass("hover")
	});
	options.bind("click", function() {
		optionsClick($(this))
	});
	viewall.mouseover(function() {
		$(this).hasClass("selected") || $(this).addClass("hover")
	});
	viewall.mouseout(function() {
		$(this).removeClass("hover")
	});
	viewall.bind("click", function() {
		viewallClick($(this))
	})
}


// view all action
function viewallClick(n, t) {
	n.addClass("selected");
	var i = n.closest(".filter");
	i.find(".scroller ul li").each(function() {
		$(this).removeClass("selected");
		$.fn.RighTelHash().remove($(this).data("value"));
	});
	i.removeClass("has-selections");
	t || (temp = "", i.find("ul.chosen li").map(function() {
		temp += $(this).data("value") + "/"
	}), location.hash = location.hash.replace(temp, ""));
	i.find("ul.chosen").hide().html("");
	
	if ($.fn.RighTelHash().all() == "/") {
		$.fn.RighTelHash().remove("/")
	}
	$.fn.RighTelPack().router("box");
}


function bindAttributeEvents(n) {
	$("#dynamicFilter a.delete").hover(function() {
		$(this).addClass("hover")
		}, function() {
		$(this).removeClass("hover")
	});
	$("#dynamicFilter a.delete").bind({
		click: function() {
			if (temp = $(this).parent().data("value").replace("_chosen", "") + "/") {
				var t = [];
				t.push(temp);
				$.fn.RighTelHash().remove(t)
				} else {
				$.fn.RighTelHash().remove(temp);
			}
			$(this).parent().remove();
			
			n.find(".scroller li[data-value=" + $(this).parent().data("value").replace("_chosen", "") + "]").removeClass("selected");
			n.find("ul.chosen").children().length || (n.find("div.viewall").addClass("selected"), n.removeClass("has-selections"), n.find("ul.chosen").hide())
			if ($.fn.RighTelHash().all() == "/") {
				$.fn.RighTelHash().remove("/")
			}
			$.fn.RighTelPack().router("box");
		}
	})
}


// add selected option to the related list
function optionsClick(n) {
	var t = n.closest(".filter");
	n.toggleClass("selected");
	// if option has selected
	if (n.hasClass("selected")) {
		t.find("ul.chosen").append("<li data-value='" + n.data("value") + "_chosen' ><span class='label'>" + n.text() + "<\/span><a class='delete' alt='حذف'><\/a><\/li>").show();
		bindAttributeEvents(t);
		// Set filtering
		temp = n.data("value") + "/";
		if (!n.hasClass("selected")) {
			$.fn.RighTelHash().remove(temp);
		}
		else  {
			if (!$.fn.RighTelHash().has(temp)) {
				$.fn.RighTelHash().set(temp);
			}
		}		
	}
	else {
		t.find("ul.chosen li[data-value='" + n.data("value") + "_chosen']").remove();
		temp = n.data("value") + "/";
		location.hash = location.hash.replace(temp, "");
	}
	
	t.find("ul.chosen").children().length ? (t.find("div.viewall").removeClass("selected"), t.addClass("has-selections")) : (t.removeClass("has-selections"), t.find("div.viewall").addClass("selected"), t.find("ul.chosen").hide())
	
	if ($.fn.RighTelHash().all() == "/") {
		$.fn.RighTelHash().remove("/")
	}
	$.fn.RighTelPack().router("box");
}


// Convert english numbers to persian
String.prototype.toPersianDigits = function(){
	var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
	return this.replace(/[0-9]/g, function(w){
		return id[+w]
	});
}


$.fn.extend({
	RighTelHash: function() {
		return {
			set: function(n, t) {
				var i = location.hash,
				r;
				t != undefined && t != "" && $.fn.RighTelHash().has(t) && (r = $.fn.RighTelHash().get(t, !0), i = $.fn.RighTelHash().edit(t));
				i += (i.charAt(i.length - 1) == "/" ? "" : "/") + n.replace(/\//g, "") + "/";
				location.hash = (location.hash == "" ? "!" : "") + $.fn.sort(i)
			},
			get: function(n, t) {
				var r = "",
				i, f, u, e;
				return $.fn.RighTelHash().has(n) && (i = location.hash, f = i.charAt(i.length - 1), f != "/" && (i += "/"), u = i.indexOf(n) + n.length, e = i.indexOf("/", u), r = i.substring(e, u).replace(/-|\//g, ""), t && (r = n + "-" + r)), r
			},
			has: function(n) {
				return location.hash.indexOf(n) == -1 ? !1 : !0
			},
			edit: function(n) {
				var t = location.hash;
				if (Array.isArray(n))
				for (i = 0; i < n.length; i++) t = t.indexOf(n[i] + "/") != -1 ? t.replace(n[i] + "/", "") : t.replace(n[i], "");
				else t = t.indexOf(n + "/") != -1 ? t.replace(n + "/", "") : t.replace(n, "");
				return t
			},
			update: function(n) {
				location.hash = n
			},
			remove: function(n) {
				location.hash = $.fn.RighTelHash().edit(n)
			},
			all: function() {
				return location.hash.replace(/#!/g, "")
			},
			list: function(n, t) {
				var u = [],
				i, e, o, s, r, f;
				if ($.fn.RighTelHash().has(n))
				for (i = location.hash, e = i.charAt(i.length - 1), e != "/" && (i += "/"), s = new RegExp(n, "g"); o = s.exec(i);) r = o.index + n.length, f = i.indexOf("/", r), t ? u.push(n + i.substring(f, r).replace(/\//g, "")) : u.push(i.substring(f, r).replace(/-|\//g, ""));
				return u
			}			
		}
	},
	sort: function(n) {
		var i = [],
		r, t;
		for (i = n.split("/").sort(), r = "", t = 0; t < i.length; t++) i[t] != "" && (r += i[t] + "/");
		return r
	},
	RighTelPack: function(){
		return {
			// get data packages from reg web service
			call: function() {
				var errorEvent = false;
				var $tfooter = $("#content-pack table tfoot td");
				$.ajax({
					type: "get",
					cache: true,
					crossDomain: true,
					async: false,
					url: "http://reg.rightel.ir/services/Services/PackageInfo/GetListOfPackageInfo?PackageGroupId=4670d0f8-3234-4abf-9e43-fdb61b190364;4670d0f8-3234-4abf-9e41-fdb64b190364;4670d0f8-3234-4abf-9e43-fdb64b590364",
					dataType: "json",
					beforeSend: function(){
						$tfooter.html("لطفا منتظر باشید ...").show();
					},
					success: function(data){
						$(data).each(function(i, n){
							// Check SimType - Data SIM
							if (n.STR_SimTypeName == "Data") {
								strProp = "";
								
								// 3G Modem
								(n.INT_TypeOfModem == "0") ? ((n.BLN_IsWithRaighFi) ? strProp += "/3g-modem-rifi" : "") : "";
								(n.INT_TypeOfModem == "0") ? ((n.BLN_IsWithModem) ? strProp += "/3g-modem-dongle" : "") : "";
								
								// 4G Modem
								(n.INT_TypeOfModem == "1") ? ((n.BLN_IsWithRaighFi) ? strProp += "/4g-modem-rifi" : "") : "";
								(n.INT_TypeOfModem == "1") ? ((n.BLN_IsWithModem) ? strProp += "/4g-modem-dongle" : "") : "";
								
								// Without Modem
								(!n.BLN_IsWithModem && !n.BLN_IsWithRaighFi) ?  strProp += "/without-modem" : "";
								
								// Period
								(n.INT_Limitation < 29) ? strProp += "/period-0" : "";
								(n.INT_Limitation == 30) ? strProp += "/period-30" : "";
								(n.INT_Limitation == 90) ? strProp += "/period-90" : "";
								(n.INT_Limitation == 180) ? strProp += "/period-180" : "";
								(n.INT_Limitation == 270) ? strProp += "/period-270" : "";
								(n.INT_Limitation >= 365) ? strProp += "/period-365" : "";
								
								// Speed
								(n.INT_Speed == 128) ? (strProp += "/speed-base", Speed = "پایه") : "";
								(n.INT_Speed == 1024) ? (strProp += "/speed-professional", Speed = "حرفه ای") : "";
								
								// Daily qouta
								(n.INT_BuyVolume > 0 && n.INT_BuyVolume < 2048) ? strProp += "/qouta-00" : "";
								(n.INT_BuyVolume >= 2048 && n.INT_BuyVolume < 4096) ? strProp += "/qouta-02-04" : "";
								(n.INT_BuyVolume >= 4096 && n.INT_BuyVolume < 6144) ? strProp += "/qouta-04-06" : "";
								(n.INT_BuyVolume >= 6144 && n.INT_BuyVolume < 10240) ? strProp += "/qouta-06-10" : "";
								(n.INT_BuyVolume >= 10240 && n.INT_BuyVolume < 20480) ? strProp += "/qouta-10-20" : "";
								(n.INT_BuyVolume >= 20480 && n.INT_BuyVolume < 40960) ? strProp += "/qouta-20-40" : "";
								(n.INT_BuyVolume >= 40960 && n.INT_BuyVolume < 61440) ? strProp += "/qouta-40-60" : "";
								(n.INT_BuyVolume >= 61440 && n.INT_BuyVolume < 81920) ? strProp += "/qouta-60-80" : "";
								(n.INT_BuyVolume >= 81920) ? strProp += "/qouta-80" : "";
								
								// Night qouta
								strProp += (n.INT_NightInternetBenefit > 0 && n.INT_NightInternetBenefit < 1024) ? "/nightqouta-00" : "";
								strProp += (n.INT_NightInternetBenefit >= 2048 && n.INT_NightInternetBenefit < 4096) ? "/nightqouta-02-04" : "";
								strProp += (n.INT_NightInternetBenefit >= 4096 && n.INT_NightInternetBenefit < 6144) ? "/nightqouta-04-06" : "";
								strProp += (n.INT_NightInternetBenefit >= 6144 && n.INT_NightInternetBenefit < 10240) ? "/nightqouta-06-10" : "";
								strProp += (n.INT_NightInternetBenefit >= 10240 && n.INT_NightInternetBenefit < 20480) ? "/nightqouta-10-20" : "";
								strProp += (n.INT_NightInternetBenefit >= 20480 && n.INT_NightInternetBenefit < 40960) ? "/nightqouta-20-40" : "";
								strProp += (n.INT_NightInternetBenefit >= 40960 && n.INT_NightInternetBenefit < 61440) ? "/nightqouta-40-60" : "";
								strProp += (n.INT_NightInternetBenefit >= 61440 && n.INT_NightInternetBenefit < 81920) ? "/nightqouta-60-80" : "";
								strProp += (n.INT_NightInternetBenefit >= 81920) ? "/nightqouta-80" : "";

								// Table records
								specialPackageContent = "";
								specialPackageClass = "";
								if (n.GUD_PackageGroupId == "7d4e1d70-1c57-4d01-9d05-bed12969c351") {
									specialPackageContent = "<div class='specialpackage'><span>ویژه آپارات</span></div>";
									specialPackageClass = "aparat";
								}
								if (n.GUD_PackageGroupId == "4670d0f8-3234-4abf-9e41-fdb64b190364") {
									specialPackageContent = "<div class='specialpackage'><span>ویژه فجر</span></div>";
									specialPackageClass = "fajr";
								}
								
								strHTML = "<tr class='dis " + specialPackageClass + "' data-rtl='" + n.STR_ProductCode + "' data-prop='" + strProp + "'>";

								strHTML += "<td>" + specialPackageContent + "<span>" + n.STR_PackageName + "</span></td>";
								strHTML += "<td>" + n.INT_Limitation + "</td>";
								
								BuyVolume =   parseFloat((n.INT_BuyVolume / 1024).toFixed(2)) + " GB";
								(BuyVolume == "0 GB") ? BuyVolume = "-" : '';
								strHTML += "<td><span dir='ltr'>" + BuyVolume + "</span></td>";
								
								NightInternetBenefit =  (n.INT_NightInternetBenefit / 1024) + " GB";
								(NightInternetBenefit == "0 GB") ? NightInternetBenefit = "-" : '';
								strHTML += "<td><span dir='ltr'>" + NightInternetBenefit + "</span></td>";

								SpecialTraffic =  (n.STR_VolumeOfTraffic / 1024) + " GB";
								(SpecialTraffic == "0 GB") ? SpecialTraffic = "-" : '';
								strHTML += "<td><span dir='ltr'>" + SpecialTraffic + "</span></td>";								
								
								strHTML += "<td><a target='_blank' href='http://reg.rightel.ir/OnlineRegistration/CountryOfCustomer/CountryOfCustomer?gud_packageinfo=" + n.GUD_PackageInfo + "'><span title='" + $.fn.makeCurrency(n.INT_Price) + "'>" + $.fn.commaDigits(n.INT_Price/10).toPersianDigits() + "</span><i class='rightel-iconset-32 basket'></i></a></td>";
								strHTML += "</tr>";
								
								$("#content-pack table tbody").append(strHTML);
								
							}
						})
					},
					error: function (request, status, error) {
						errorEvent = true;
						$tfooter.html("رویداد خطا").css("color", "red");
						$tfooter.html("ارتباط با وب سرویس فهرست بسته ها برقرار نمی باشد. لطفا دقایقی بعد مجددا امتحان کنید.").css("color", "red");
					},
					complete: function(){
						if (!errorEvent){
							$tfooter.hide()
							$.fn.RighTelPack().router("");
						}
					}
				});				
				
			},
			// detect query string and active selected parameters
			router: function(mode) {
				//p = $.fn.sort($.fn.RighTelHash().all());
				p = $.fn.RighTelHash().all();
				u = p.split("/");
				// remove empty cell
				u = u.filter(Boolean)
				// if query string already exist in URL
				if (u.length > 0 && mode != "box") {
					$(u).each(function(i, n) {
						$("#dynamicFilter .options li[data-value='" + n+ "']").each(function(){
							$(this).toggleClass("selected");
							t = $(this).closest(".filter");
							t.find("ul.chosen").append("<li data-value='" + n + "_chosen' ><span class='label'>" + $(this).text() + "<\/span><a class='delete' alt='حذف'><\/a><\/li>").show();
							bindAttributeEvents(t);
						})
						t.find("ul.chosen").children().length ? (t.find("div.viewall").removeClass("selected"), t.addClass("has-selections")) : (t.removeClass("has-selections"), t.find("div.viewall").addClass("selected"), t.find("ul.chosen").hide());
					})
					
				}
				$.fn.RighTelPack().filtering(u);
			},
			// set filtering to records
			filtering: function(u) {
				
				//setTimeout(function(){
				$("#content-pack table tbody tr").switchClass("dis", "act");
				
				if (u.length > 0){
					var classTemp = [];
					
					$("#content-pack table tbody tr").each(function(){
						$("#dynamicFilter .container .scroller li").each(function(i){
							classTemp[i] = "dis";
						})
						$trObj = $(this);
						
						$(u).each(function(i, n) {
							LIIndex = $("#dynamicFilter .container .scroller li[data-value='" + n + "']").closest(".filter").parent().index();
							// if this property exist in table row
							if(classTemp[LIIndex] == "dis") {
								if ($trObj.data("prop").indexOf(n) > -1){
									classTemp[LIIndex] = "act";
								}
							}
						})
						
						$("#dynamicFilter .container li div.filter").each(function(i){
							if ($(this).hasClass("has-selections")) {
								if(classTemp[$(this).parent().index()] == "dis") {
									$trObj.switchClass("act", "dis");
								}
							}
						})
					})
				}
				
				if ($("#content-pack table tbody tr.act").length == 0) {
					$("#CategorySuggest").html("");
					$("#content-pack table tfoot td").html("در حال حاضر بسته ای با مشخصات درخواستی شما وجود ندارد.").show();
				}
				else {
					$("#content-pack table tfoot td").html("").hide();
					$("#CategorySuggest").html("تعداد نتایج: " + $("#content-pack table tbody tr.act").length);
				}
				
				
				
				
			//}, 300)
		}
	}
},
// Add and remove the specified class
switchClass: function(removeClassName, addClassName){
	$(this).removeClass(removeClassName);
	$(this).addClass(addClassName);
},
// Add comma to numbers every three digits
commaDigits: function(num){
	return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
},
// Change number to string in Rial currency
makeCurrency: function (m) {
	var g = ["", "يک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"],
	o = ["ده", "يازده", "دوازده", "سيزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"],
	h = ["", "", "بيست", "سي", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"],
	i = ["", "يکصد", "دويست", "سيصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"],
	l = 1e3 * 1e3 * 1e3 * 1e3,
	d = 1e3 * 1e3 * 1e3,
	f = 1e3 * 1e3,
	k = 999999999,
	e = 999999,
	a = "",
	b = function (g) {
		if (g > k && g < l) {
			var h = g % d,
			m = parseInt(g / d);
			c(m);
			a += " ميليارد";
			if (h != 0) {
				a += " و ";
				b(h);
			}
			} else if (g > e && g < d) {
			var j = g % f,
			o = parseInt(g / f);
			c(o);
			a += " ميليون";
			if (j != 0) {
				a += " و ";
				b(j);
			}
			} else if (g > 999 && g <= e) {
			var i = g % 1e3,
			n = parseInt(g / 1e3);
			c(n);
			a += " هزار";
			if (i != 0) {
				a += " و ";
				b(i);
			}
		} else if (g <= 999) c(g);
		else a = "Error";
	},
	c = function (c) {
		var b = c % 100,
		d = parseInt(c / 100);
		if (b == 0) a += i[d];
		else {
			if (c > 100) a += i[d] + " و ";
			if (b < 10) a += g[b];
			else if (b < 20) {
				bgh2 = b % 10;
				a += o[bgh2];
				} else {
				bgh2 = b % 10;
				dah = parseInt(b / 10);
				if (bgh2 == 0) a += h[dah];
				else a += h[dah] + " و " + g[bgh2];
			}
		}
	},
	j = function (e, c) {
		a = "";
		var d = "";
		c != 0 && b(c);
		if (a == "Error") d = "خطا در ورودي";
		else if (c != 0) d = a + " ريال ";
		a = "";
		c = Math.floor(parseInt(c / 10));
		c != 0 && b(c);
		if (a == "Error") d = "خطا در ورودي";
		//else if (c != 0) d = d //" معادل " + a + " تومان ";
		else if (c != 0) d = a + " تومان ";
		return d;
	},
	n = function (b) { 
		var c = ",",
		a = b;
		a = (a + "").replace(/[^0-9]/g, "");
		return j(m, a);
	};
	return n(m);
}
})

