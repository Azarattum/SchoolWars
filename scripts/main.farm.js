/*
**
**  This script file is for points earning.
**
*/

var Points = 0;


function initializeFarm()
{
	$(".test-btn").click(function() {
		getPoints(5);

		$(".points").text(Points+"/"+PointsToCapture);
	});
}

//For test
function getPoints(num)
{
	Points += num;
}

function createEquation()
{
	//рандомное число (0 - 1)
	//0 - сумма; 1 - разность

	//сумма: генерируются 2 числа (от 0 до 49)
	//разность: генерируются 2 числа (от 49 до 99; от 0 до 49)

	//генерируюся 4 варианта ответа (3 с небольшим отклонением от правильного)

	//создаются нужные элементы с нужными эвентами по клику
}