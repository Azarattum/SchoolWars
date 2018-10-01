/*
**
**  This script file is for points earning.
**
*/

var Points = 0;
var Answers = [];

var TaskCount = 2;

var Cooldown = false;
var CooldownTime = 500; //msec


function initializeFarm()
{
	for (let i = 1; i <= TaskCount; i++) {
		createTask();
	}
}

function createTask()
{
	let rnd = Math.round(Math.random());
	let num1 = null;
	let num2 = null;
	let sign = "";

	let rightAnswer = null;
	let answers = [];

	let errors = [2, 4, 10, 12, 14];

	//0 - sum; 1 - diff
	if (rnd === 0) {
		sign = "+";
		num1 = randomInt(0, 50);
		num2 = randomInt(0, 49);

		rightAnswer = num1 + num2;
	} else {
		sign = "-";
		num1 = randomInt(49, 99);
		num2 = randomInt(0, 49);

		rightAnswer = num1 - num2;
	}

	//Genereting incorrect answers
	for (let key in errors) {
		let error = errors[key];

		if (rightAnswer + error < 100)
			answers.push(rightAnswer + error);

		if (rightAnswer - error >= 0)
			answers.push(rightAnswer - error);
	}

	answers = shuffle(answers);

	let rightAnswerPos = randomInt(0, 4);
	answers[rightAnswerPos] = rightAnswer;

	let zIndex = TaskCount; //analog id

	if ( $(".task").last()[0] ) {
		zIndex = +$(".task").last().css("z-index") - 1;
	}

	Answers[zIndex] = rightAnswer;

	let script = "<div class=\"task\" style=\"z-index: "+zIndex+"\">"
	script += "<span class=\"task-title\">"+num1+" "+sign+" "+num2+" = ?</span>";
	script += "<hr width=\"80%\" size=\"3\" color=\"rgb(13,13,13)\" noshade>";
	script += "<div class=\"answers\">";

	for (var i = 0; i < 5; i++) {
		script += "<div class=\"answer\" id=\"answer-"+i+"\">"+answers[i]+"</div>";
	}

	script += "</div></div>";

	$(".task-holder").append(script);

	$(".answer").click(function() {
		if (Cooldown)
			return false;

		checkAnswer(this);

		//Set cooldown
		Cooldown = true;

		window.setTimeout(function() {
			Cooldown = false;
		}, CooldownTime);
	});
}

function checkAnswer(answerElem)
{
	let taskElem = $(answerElem).parent().parent();

	if ( $(taskElem).hasClass("answered") )
		return false;

	$(taskElem).addClass("answered");

	let taskId = +$(taskElem).css("z-index").replace("px", "");
	let answer = +$(answerElem).text();

	if (answer === Answers[taskId]) {
		Points += 5;
		$(".points").text(Points+"/"+PointsToCapture);
		$(answerElem).css("background-color", "rgb(100, 255, 100)");
	} else {
		Points -= 2;

		if (Points < 0)
			Points = 0;

		$(".points").text(Points+"/"+PointsToCapture);
		$(answerElem).css("background-color", "rgb(255, 100, 100)");
	}

	writeCapturePossibility();

	createTask();

	window.setTimeout(function() {
		$(answerElem).parent().parent().animate({
			left: +$(".task-holder").css("width").replace("px", "") + 64,
		}, CooldownTime, function() {
			$(answerElem).parent().parent().remove();

			let lastIndex = +$(".task").last().css("z-index");

			$(".task").each(function() {
				$(this).css("z-index", "+=1");
			});

			for (let i = TaskCount - 1; i >= lastIndex; i--)
				Answers[i + 1] = Answers[i];
		});
	}, 100);
}