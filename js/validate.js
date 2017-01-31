var typingTries = 0
function validateTyping() {
	var answer = document.getElementById("answer");
	var check = document.getElementById("typingCheck");
	var tries = 0;
	if (answer.value == "Australia") {
		answer.style.backgroundColor = "green";
		alert("right");
		answer.disabled = true;
		check.disabled = true;
	}
	else {
		if (typingTries < 3) {
			answer.style.backgroundColor = "red";
			typingTries++;
			alert("wrong, tries left: " + typingTries);
		}
		else {
			answer.disabled = true;
			check.disabled = true;
		}
	}
}

function validateMulti() {

}
