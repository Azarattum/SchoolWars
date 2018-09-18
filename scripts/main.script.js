/*
**
**  Main page initialize script file.
**
*/

/*On page loaded*/
function main()
{
	intializeTabs();
	initializeMap();
	
	console.log(UserData);
}

function intializeTabs()
{
	var swiper = new Swiper(".swiper-container");
	$(".map-screen-item").bind("touchstart click", function() {swiper.slideTo(0)});
	$(".profile-screen-item").bind("touchstart click", function() {swiper.slideTo(1)});
	$(".swiper-container").css("opacity", "1");
}