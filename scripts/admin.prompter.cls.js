class AdminPromter
{
	constructor()
	{
		this.phrases = Phrases;
		this.phraseNumber = 0;

		this.showPhrase();
	}

	showNextPhrase()
	{
		this.phraseNumber += 1;
		
		if (this.phraseNumber > this.phrases.length - 1) {
			if (this.phraseNumber > this.phrases.length) {
				this.phraseNumber = this.phrases.length;
				return false;
			}

			this.showEndButton();
			return true;
		}

		this.showPhrase();
		return true;
	}

	showPreviousPhrase()
	{
		this.phraseNumber -= 1;

		if (this.phraseNumber < 0) {
			this.phraseNumber = 0;
			return false;
		}

		this.showPhrase();
		return true;
	}
	
	showPhrase()
	{
		let phrases = this.phrases[this.phraseNumber];
		console.log(phrases);

		let htmlScript = "";

		for (let i in phrases) {
			let phrase = phrases[i];
			htmlScript += "<div class=\"pharse\">"+phrase+"</div>";
		}

		$(".phrases").html(htmlScript);
	}

	showEndButton()
	{
		console.log("The END");

		let htmlScript = "<div class=\"end-button\">START THE END</div>";
		$(".phrases").html(htmlScript);

		$(".end-button").click(function() {
			let check = authorize();

			if (!check)
				return false;

			request("start_end", ["lalka"], function(data) {
				if (data)
					alert("End starting...");
				else
					alert("Fail");
			});
		});
	}
}