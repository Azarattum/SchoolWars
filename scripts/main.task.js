/*
**
**  This script file is for points earning.
**
*/

var Points = 0;
var Answers = [];


function initializeFarm()
{
	createTask();
}

function createTask()
{
	let rnd = Math.round(Math.random());
	let num1 = null;
	let num2 = null;
	let sign = "";

	let rightAnswer = null;
	let answers = [];
	//let rightAnswerPos = randomInt(0, 4);

	/*TEMP!!!*/

	//0 - sum; 1 - diff
	if (rnd === 0) {
		sign = "+";
		num1 = randomInt(0, 50);
		num2 = randomInt(0, 49);

		rightAnswer = num1 + num2;

		answers[0] = rightAnswer;

		/*for (let i = 0; i < 5; i++) {
			if (i === rightAnswerPos) {
				answers[i] = num1 + num2;
				continue;
			}

			let error = randomInt(-10, 10);

			while (error === 0)
				error = randomInt(-10, 10);

			let answer = num1 + num2 + error;

			while (answer < 0 || answer > 99) {
				while (jQuery.inArray(answer, answers) !== -1) {
					error = randomInt(-10, 10);
				
					while (error === 0)
						error = randomInt(-10, 10);

					answer = num1 + num2 + error;
				}
			}

			answers[i] = answer;
		}*/
	} else {
		sign = "-";
		num1 = randomInt(49, 99);
		num2 = randomInt(0, 49);

		rightAnswer = num1 - num2;

		answers[0] = rightAnswer;

		/*for (let i = 0; i < 5; i++) {
			if (i === rightAnswerPos) {
				answers[i] = num1 - num2;
				continue;
			}

			let error = randomInt(-10, 10);

			while (error === 0)
				error = randomInt(-10, 10);

			let answer = num1 - num2 + error;

			while (answer < 0 || answer > 99) {
				while (jQuery.inArray(answer, answers) !== -1) {
					error = randomInt(-10, 10);
				
					while (error === 0)
						error = randomInt(-10, 10);

					answer = num1 - num2 + error;
				}
			}

			answers[i] = answer;
		}*/
	}

	if (rightAnswer + 10 < 100)
		answers.push(rightAnswer + 10);
	else if (rightAnswer + 5 < 100)
		answers.push(rightAnswer + 5);

	if (rightAnswer - 10 >= 0)
		answers.push(rightAnswer - 10);
	else if (rightAnswer - 5 >= 0)
		answers.push(rightAnswer - 5);

	if (rightAnswer + 2 < 100)
		answers.push(rightAnswer + 2);
	else if (rightAnswer + 4 < 100)
		answers.push(rightAnswer + 4);

	if (rightAnswer - 2 >= 0)
		answers.push(rightAnswer - 2);
	else if (rightAnswer - 4 >= 0)
		answers.push(rightAnswer - 4);

	answers = shuffle(answers);

	/*TEMP!!!*/

	let taskId = 1;
	let zIndex = 3;

	if ( $(".task").last()[0] ) {
		let lastTaskId = +$(".task").last()[0].id.replace("task-", "");

		taskId = lastTaskId + 1;
		zIndex = +$("#task-"+lastTaskId).css("z-index") - 1;
	}

	Answers[taskId] = rightAnswer;

	let script = "<div class=\"task\" id=\"task-"+taskId+"\">"
	script += "<span class=\"task-title\">"+num1+" "+sign+" "+num2+" = ?</span>";
	script += "<hr width=\"80%\" size=\"3\" color=\"rgb(13,13,13)\" noshade>";
	script += "<div class=\"answers\">";

	for (var i = 0; i < 5; i++) {
		script += "<div class=\"answer\" id=\"answer-"+i+"\">"+answers[i]+"</div>";
	}

	script += "</div></div>";

	$(".task-holder").append(script);
	$("#task-"+taskId).css("z-index", zIndex);

	$(".answer").click(function() {
		let taskId = +$(this).parent().parent()[0].id.replace("task-", "");
		let answerText = +$(this).text();

		checkAnswer(taskId, answerText);
	});
}

function checkAnswer(taskId, answer)
{
	if (answer === Answers[taskId]) {
		Points += 5;
		$(".points").text(Points+"/"+PointsToCapture);
	} else {
		Points -= 2;

		if (Points < 0)
			Points = 0;

		$(".points").text(Points+"/"+PointsToCapture);
	}

	showCapturePossibility();

	//НАДО ПЕРЕМЕЩАТЬ ВПРАВО
	$("#task-"+taskId).remove();

	//всем другим .task z-index++

	createTask();
}