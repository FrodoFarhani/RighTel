/*
	Powered by:		Maziar Barzi
	Last Modified:		13:04 Monday, February 29, 2016
	4D617A696172204261727A69
*/

var pagetab = "";
var minitab = "";
var winSize = 0;

$(function(){
	
	if ($.browser.msie && parseInt($.browser.version) < 8) {
		$(".journal-content-article").grabWebContent(2679457, 10180);
	};
	
	pagetab = window.location.hash;
	
	// select first or selected tab
	if ($.trim(pagetab) == "") {
		if ($(".rightel-tabview > li.selected").length > 0) {
			pagetab = $(".rightel-tabview > li.selected").find("a").attr("href");
		}
		else {
			pagetab = $(".rightel-tabview > li").not(".disabled").eq(0).find("a").attr("href");
			$(".rightel-tabview > li").not(".disabled").find("a[href='" + pagetab + "']").parent().addClass("selected");
		}
	}
	else {
		// select URL tab
		$(".rightel-tabview > li").removeClass("selected");
		$(".rightel-tabview > li").not(".disabled").find("a[href='" + pagetab + "']").parent().addClass("selected");
	}
	

	// show content of selected tab
	$(".rightel-tabview-content > section[data-tab='" + pagetab + "']").css('display', 'table');

	// count tabs & assign related class
	tabCounter = $(".rightel-tabview > li").length;
	if (tabCounter > 1) {
		$(".rightel-tabview").addClass("tabs-" + tabCounter);
	}
	else {
		$(".rightel-tabview").hide();
		$(".rightel-tabview-content").css("border-top", "0px");
	}
	
	
	// select mini tab via query string & add line under selected sub tabs
	tabUnderline = "<div class='tabunderline'></div>";
	$(".rightel-tabview-content .minitabs > ul").after(tabUnderline);	
	minitab = $.trim($.QueryString["tab"]);
	if (minitab.length > 0){
		$QueryMiniTab = $(".rightel-tabview-content .minitabs a[rel='" + minitab + "']");
		$QueryMiniTab.addClass("selected");
		$("section[data-tab='" + pagetab + "'] .content").children("section").hide();
		$("section[data-tab='" + pagetab + "'] .content").children("section[data-rel='" + minitab + "']").css('display', 'table');
		underlineWidth = $QueryMiniTab.outerWidth();
		underlineLeft = parseInt($QueryMiniTab.position().left);
		underlinePosition = $(".rightel-tabview-content").width() - (underlineLeft + underlineWidth);
		$QueryMiniTab.closest(".minitabs").find(".tabunderline").css("right", underlinePosition).width(underlineWidth).show();
		tblrowprice();
	}
	else {
		$(".rightel-tabview-content .minitabs a.selected").each(function(){
			underlineWidth = $(this).outerWidth();
			underlineLeft = parseInt($(this).position().left);
			
			if (!$(this).closest("section").is(":visible")) {
				$(this).closest("section").css('display', 'table');
				underlineWidth = $(this).outerWidth();
				underlineLeft = parseInt($(this).position().left);
				underlinePosition = $(".rightel-tabview-content").width() - (underlineLeft + underlineWidth);
				$(this).closest("section").hide();
			}
			else {
				underlinePosition = $(".rightel-tabview-content").width() - (underlineLeft + underlineWidth);
			}
			$(this).closest(".minitabs").find(".tabunderline").css("right", underlinePosition).width(underlineWidth).show();
			tblrowprice();
		});
	}	
	
	
	// assign click to tabs and show related content
	$(".rightel-tabview > li").not(".disabled").find("a").not(".direct").on("click", function(){
		$(".rightel-tabview > li").removeClass("selected");
		$(this).parent().addClass("selected");
		$(".rightel-tabview-content > section").hide();
		$(".rightel-tabview-content > section[data-tab='" + $(this).attr("href") + "']").css('display', 'table');
		pagetab = $(this).attr("href");
		tblrowprice();
	});


	
	// change line position under selected sub tabs
	$(".rightel-tabview-content .minitabs a").not(".direct").on("click", function(){
		$(this).closest(".minitabs").find("a").removeClass("selected");
		$(this).addClass("selected");
		// change underline position
		rightPosition = ($(".rightel-tabview-content").width() - (parseInt($(this).position().left) + $(this).outerWidth()));
		$(this).closest(".minitabs").find(".tabunderline").css("right", rightPosition).width($(this).width()).show();
		// Trige footable
		// $('.tblnormal').footable();
		// show related content
		$("section[data-tab='" + pagetab + "'] .content").children("section").hide();
		$("section[data-tab='" + pagetab + "'] .content").children("section[data-rel='" + $(this).attr("rel") + "']").css('display', 'table');
		tblrowprice();
	});
	
	
	// reorder plan cards
	$(".reorder a i").on("click", function(){
		$("section[data-tab='" + pagetab + "'] .reorder a").removeClass("selected");
		$(this).parent().addClass("selected");
		changePlanCards($(this).attr("class"));
	});
	
	
	// window size detection
	winSize = $(window).outerWidth();
	$(window).on("resize", function(){
		winSize = $(window).outerWidth();
		$("section[data-tab='" + pagetab + "'] .reorder a").removeClass("selected");
		if (winSize <= 720) {
			$(".tabunderline").hide();
			$("section .reorder").hide();
			changePlanCards("icon-th-large");
		}
		else {
			$(".tabunderline").hide();
			$("section .reorder").show();
			$("section .reorder a i.icon-reorder").parent().addClass("selected");
			changePlanCards("icon-reorder");			
		}
	});
	
	// call large tab via internal links	
	$("a.largetab").on("click", function(){
		$(".rightel-tabview > li").removeClass("selected");
		$(".rightel-tabview > li").not(".disabled").find("a[href='" + $(this).attr("href") + "']").parent().addClass("selected");
		$(".rightel-tabview-content > section").hide();
		$(".rightel-tabview-content > section[data-tab='" + $(this).attr("href") + "']").css('display', 'table');
	});
	
});






// get plans from XML file - simtype
$.fn.RighTelCards = function(options){

	var defaults = {
		type: "plans-postpaid",
        info: true // or false
    };
	
	var settings = $.extend( {}, defaults, options );
	
	return this.each(function() {

		var $obj = $(this);
		
		// load plans from XML
		$.ajax({
			type: "get",
			cache: true,
			async: false,
			url: "/documents/10180/13384/rightel-cards.xml",
			dataType: "xml",
			beforeSend: function(){
				$obj.html("لطفا منتظر باشید ...");
			},
			success: function(data){
				$obj.html("");
				planHTML = "";
				
				$(data).find("card[data-type='" + settings.type + "']").each(function() {
					if ($(this).attr("status") != 0){
						
						salesType = "";
						if ($(this).attr("card-type") == "mini") {
							salesType = " card-type-sales";
						}
						
						// price & register link
						planLinks = "<div>";
						if ($(this).attr("card-type") != "mini") {
							$(this).find("price").each(function() {
								planLinks = planLinks + "<a href='" + $(this).attr("link") + "'><strong>" + $(this).text() + "</strong>" ;

								linkName = $(this).attr("name");
								linkRial = $(this).attr("rial");
								if (typeof linkName !== typeof undefined && linkName !== false) {
									if (typeof linkRial !== typeof undefined && linkRial !== false) {
										if (linkName != "") {
											planLinks = planLinks + "<span>" + linkName + " - " + linkRial + "</span>";
										}
										else {
											
											planLinks = planLinks + "<span>" + linkRial + "</span>";
										}
									}
									else {
										planLinks = planLinks + "<span>" + linkName + "</span>";
									}
								}								

								planLinks = planLinks + "<i class='rightel-iconset-32 " + $(this).attr("icon") + "'></i></a>";
							});
						} 
						else {
							if ($(this).find("price").length > 0) {
								planLinks = planLinks + "<a href='" + $(this).find("price").attr("link") + "'><strong>" + $(this).find("price").text() + "</strong>" ;
								planLinks = planLinks + "<i class='rightel-iconset-32 " + $(this).find("price").attr("icon") + "'></i></a>";
							}
						}
						planLinks = planLinks + "</div>";
						
						
						// info box
						planInfo = "";  
						boxInfoCounter = $(this).find("box").length;
						scaleratio = "";
						if ($(this).find("infobox").attr("scale-ratio") == "1:1" && boxInfoCounter == 2) {
							boxInfoCounter = "16";
						}
						if (boxInfoCounter > 0) {
							$(this).find("box").each(function() {
								planInfo = planInfo + "<div>";
								planInfo = planInfo + "<p><i class='rightel-iconset-48 " + $(this).find("icon-name").text() + "'></i>";
								planInfo = planInfo + "<strong>" + $(this).find("title").text() + "</strong>";
								planInfo = planInfo + "<span class='peroid'> " + $(this).find("period").text() + " </span>";
								planInfo = planInfo + "<span>" + $(this).find("description").html() + "</span></p>";
								planInfo = planInfo + "</div>";
							});
							planInfo = "<div class='plan-info infobox-" + boxInfoCounter + "'>" + planInfo + "</div>";
						}
						else {
							planInfo = "";
						} 
						
						planNoImage = "";
						if ($.trim($(this).children("banner-url").text()).length == 0) {
							planNoImage = "<span>" + $(this).children("description").html() + "</span>";
						}
						singleCard = "";
						if (!settings.info) {
							singleCard = " card-type-singleton";
						}
						smallScreen = "";
						winSize = $(window).outerWidth();
						if (winSize <= 720) {
							smallScreen = " card-type-tile";
							$("section .reorder").hide();
						}
						planHTML = planHTML + "<section class='card-type-full" + salesType + singleCard + smallScreen + "'>";
						if (settings.info) {
							planHTML = planHTML + "<h2><a href='" + $(this).attr("page-link") + "'>" + $(this).attr("name") + "</a></h2>";
							planHTML = planHTML + "<p><strong>" + $(this).children("slogan").text() + "</strong><span>" + $(this).children("description").html() + "</span></p>";
						}
						planHTML = planHTML + "<div class='plan-card " + $(this).attr("data-type") + "'>"; 
						planHTML = planHTML + "<div class='plan-price'>" + planLinks + "</div>";
						if (settings.info) {
							planHTML = planHTML + "<a class='plan-hover' href='" + $(this).attr("page-link") + "'><span>اطلاعات بیشتر</span><i>i</i></a>";
						}
						planHTML = planHTML + planInfo;
						if (settings.info) {
							planHTML = planHTML + "<div class='plan-image' style='background-image:url(" + $(this).children("banner-url").text() + ");'>" + planNoImage + "</div>";
						} 
						else {
							planHTML = planHTML + "<div class='plan-image info'>" + planNoImage + "</div>";
						}
						planHTML = planHTML + "</div>";
						planHTML = planHTML + "</section>";
						
					};
				});
				if ($(data).find("card[data-type='" + settings.type + "']").length == 0) {
					planHTML = "<section><div class='card-notfound'>موردی یافت نشد.</div></section>";
				}
				
				$obj.append(planHTML);
			},
			error: function (request, status, error) {
				$obj.html("رویداد خطا").css("color", "red");
				$obj.append(request.responseText);
			},
			statusCode: {
				404: function() {
					$obj.html("فایل XML مرتبط با کارت ها یافت نشد.").css("color", "red");
				}
			},
			complete: function(){
				winSize = $(window).outerWidth();
				if (winSize > 720) {
					$(".plan-hover").on("mouseenter", function(){
						$(this).parent().find(".plan-info, .plan-image").addClass("plan-hover-blur");
					}).on("mouseleave", function(){
						$(this).parent().find(".plan-info, .plan-image").removeClass("plan-hover-blur");
					});
				}
			}
		});
		
		
    });
};


// change card type & model
function changePlanCards(cardType){
	$obj = $("section[data-tab='" + pagetab + "'] .card-type-full");
	switch(cardType) {
		case "icon-reorder":
			$obj.find(".plan-image").unbind("mouseenter");
			$obj.find(".plan-info").unbind("mouseleave");
			$obj.removeClass("card-type-bar card-type-tile");
			$obj.find(".plan-info").show();
			break;
			
		case "icon-align-justify":
			$obj.find(".plan-image").unbind("mouseenter");
			$obj.find(".plan-info").unbind("mouseleave");
			$obj.removeClass("card-type-tile");
			$obj.addClass("card-type-bar");
			$obj.find(".plan-info").show();
			break;
			
		case "icon-th-large":
			$obj.removeClass("card-type-bar");
			$obj.addClass("card-type-tile");
			$obj.find(".plan-info").hide();
			$obj.find(".plan-image").on("mouseenter", function(){
				$(this).parent().find(".plan-info").show();
				$(this).parent().find(".plan-info").on("mouseleave", function(){
					$(this).hide();
				});
			});
			break;		
	}
};


// liferay web content graber
$.fn.grabWebContent = function(articleID, groupID){
	$obj = this;
	$.ajax({
		cache: false,
	    url: "/c/journal/view_article_content?groupId=" + groupID + "&articleId=" + articleID + "&p_p_state=exclusive",
	    success: function(response) {
	    	$obj.html(response);
	    }
	});
};


//Query String
$.QueryString = (function (a) {
	if (a == "") return {};
	var b = {};
	for (var i = 0; i < a.length; ++i) {
		var p = a[i].split('=');
		if (p.length != 2) continue;
		b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return b;
})(window.location.search.substr(1).split('&'));


// show tab section for - internal link
function miniTab(_nodename) {
	if (_nodename != "") {
		$("html, body").animate({scrollTop: 0}, 500, function() {
			$(".rightel-tabview-content .minitabs a[rel='" + _nodename + "']").trigger('click');
		});
	}
};


