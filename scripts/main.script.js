
/*On page loaded*/
function main()
{
	var swiper = new Swiper(".swiper-container");
	$(".map-screen-item").bind("touchstart click", function(){swiper.slideTo(0)});
	$(".profile-screen-item").bind("touchstart click", function(){swiper.slideTo(1)});
	$(".swiper-container").css("opacity", "1");
}