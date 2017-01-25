var typingTries = 1
function validateTyping() {
	var answer = document.getElementById("answer");
	var check = document.getElementById("typingCheck");
	if (answer.value == "Australia") {
		answer.style.backgroundColor = "#90EE90";
		alert("right");
		answer.disabled = true;
		check.disabled = true;
	}
	else {
		if (typingTries <= 3) {
			answer.style.backgroundColor = "#FA8072";
			alert("wrong, attempt " + typingTries + " of 3");
			typingTries++;
		}
		else {
			answer.disabled = true;
			check.disabled = true;
		}
	}
}

function validateMulti(selection) {
	var choice = document.getElementById(selection);
	alert(selection.innerHTML);
	if(document.getElementById(selection).childNodes[0].nodeValue == "text") {
		selection.style.backgroundColor = "#90EE90";
		alert("right");
	}
	else {
		selection.style.backgroundColor = "#FA8072";
		alert("wrong, the answer was Koala");
	}
	document.getElementById("multi1").disabled = true;
	document.getElementById("multi2").disabled = true;
	document.getElementById("multi3").disabled = true;
	document.getElementById("multi4").disabled = true;
}

function hideMe(ID) {
	var checkButton = document.getElementById(ID);
	checkButton.style.display = "none";
}
