"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let expelledStudents = [];
let allFamilies = [];

const Student = {
	firstname: "",
	middlename: "",
	lastname: "",
	house: "",
	image: new Image(),
	prefect: false,
	status: false,
	blood: "",
	squad: false,
};

const settings = {
	filterBy: "all",
	sortBy: "firstname",
	sortDir: "asc",
};

function start() {
	console.log("ready");

	//listen for click on filter buttons
	document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

	//listen for click on sort buttons
	document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));

	//listen for changed input in search field
	document.querySelector("#search_inputfield").addEventListener("keyup", searchInList);

	loadJSON();
}

//-----GET JSON OBJECTS AND PREPARE-----
async function loadJSON() {
	const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
	const jsonData = await response.json();

	const responseBlood = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
	const jsonDataBlood = await responseBlood.json();

	prepareStudents(jsonData, jsonDataBlood);
}

function prepareStudents(jsonData, jsonDataBlood) {
	console.log(jsonData);
	console.log(jsonDataBlood);

	allStudents = jsonData.map((x) => preapareStudent(x, jsonDataBlood));

	console.log(allStudents);

	buildList();
}

function preapareStudent(jsonObject, jsonDataBlood) {
	const student = Object.create(Student);

	student.firstname = getFirstName(jsonObject.fullname);
	student.middlename = getMiddleName(jsonObject.fullname);
	student.lastname = getLastName(jsonObject.fullname);
	student.house = getHouse(jsonObject.house);
	student.image = getImage(jsonObject.fullname);
	student.blood = getBloodType(student.lastname, jsonDataBlood);

	return student;
}

function getBloodType(lastname, blood) {
	if (blood.half.includes(lastname)) {
		return "Half";
	}
	return "Pure";
}

//---GET CORRECT NAMES AND RETURN----
function getFirstName(fullname) {
	const trimmedName = fullname.trim();
	//const firstName = trimmedName.substring(0, trimmedName.indexOf(" "));
	const firstName = trimmedName.split(" ")[0];
	const firstLetter = firstName.substring(0, 1);
	const restOfName = firstName.substring(1);
	const nameInUppercase = firstLetter.toUpperCase() + restOfName.toLowerCase();

	return nameInUppercase;
}

function getMiddleName(fullname) {
	const trimmedName = fullname.trim();
	const middleNameList = trimmedName.split(" ");

	if (middleNameList.length <= 2) {
		return "";
	}

	const middleName = middleNameList[1];

	if (middleName === '"Ernie"') {
		return "";
	}

	return middleName;
}

function getLastName(fullname) {
	const trimmedName = fullname.trim();
	//const lastName = trimmedName.substring(trimmedName.lastIndexOf(" "));
	const lastNameList = trimmedName.split(" ");

	if (lastNameList.length == 1) {
		return "";
	}

	const lastName = lastNameList[lastNameList.length - 1];
	const trimStart = lastName.trimStart();
	const firstLetter = trimStart.substring(0, 1);
	const restOfName = trimStart.substring(1);
	const nameInUppercase = firstLetter.toUpperCase() + restOfName.toLowerCase();

	if (fullname.includes("-")) {
		const lastName2 = "Finch-Fletchley";

		return lastName2;
	}

	return nameInUppercase;
}

function getHouse(house) {
	const houseTrimmed = house.trim();
	const firstLetter = houseTrimmed.substring(0, 1).toUpperCase();
	const retsOfName = houseTrimmed.substring(1);
	const correctHouse = firstLetter + retsOfName.toLowerCase();

	return correctHouse;
}

function getImage(fullname) {
	const trimmedName = fullname.trim();
	const lastName = trimmedName.substring(trimmedName.lastIndexOf(" ") + 1);
	const lastNameCase = lastName.toLowerCase();

	const firstLetter = trimmedName.substring(0, 1);
	const firstLetterCase = firstLetter.toLowerCase();
	const imagePath = "images/" + lastNameCase + "_" + firstLetterCase + ".png";

	if (fullname.includes("-")) {
		const secondLastname = fullname.substring(fullname.indexOf("-") + 1);
		const secondLastnameCase = secondLastname.toLowerCase();

		const firstLetter = trimmedName.substring(0, 1);
		const firstLetterCase = firstLetter.toLowerCase();
		const secondImagePath = "images/" + secondLastnameCase + "_" + firstLetterCase + ".png";

		return secondImagePath;
	} else if (fullname.includes("Patil")) {
		const firstname = fullname.substring(0, fullname.indexOf(" "));
		const firstnameCase = firstname.toLowerCase();

		const thirdImagePath = "images/patil_" + firstnameCase + ".png";

		return thirdImagePath;
	} else if (fullname.includes("Leanne")) {
		const fourthImage = "images/placeholder.png";

		return fourthImage;
	}

	return imagePath;
}

//---FILTER STUDENTS---
function selectFilter(event) {
	const filter = event.target.dataset.filter;
	console.log(filter);

	setFilter(filter);
}

function setFilter(filter) {
	settings.filterBy = filter;
	buildList();
}

function filterStudents(filteredList, expelledStudents) {
	//let filterAnimals = allAnimals;
	if (settings.filterBy === "gryffindor") {
		filteredList = allStudents.filter(isGryffindor);
	} else if (settings.filterBy === "hufflepuff") {
		filteredList = allStudents.filter(isHufflepuff);
	} else if (settings.filterBy === "slytherin") {
		filteredList = allStudents.filter(isSlytherin);
	} else if (settings.filterBy === "ravenclaw") {
		filteredList = allStudents.filter(isRavenclaw);
	} else if (settings.filterBy === "non-expelled") {
		filteredList = allStudents.filter(isNotExpelled);
	} else if (settings.filterBy === "expelled") {
		filteredList = expelledStudents.filter(isExpelled);
	} else if (settings.filterBy === "prefect") {
		filteredList = allStudents.filter(isPrefect);
	}

	return filteredList;
}

function isGryffindor(student) {
	return student.house === "Gryffindor";
}

function isHufflepuff(student) {
	return student.house === "Hufflepuff";
}

function isSlytherin(student) {
	return student.house === "Slytherin";
}

function isRavenclaw(student) {
	return student.house === "Ravenclaw";
}

function isNotExpelled(student) {
	return student.status === false;
}

function isExpelled(student) {
	return student.status === true;
}

function isPrefect(student) {
	return student.prefect === true;
}

//------SORT STUDENTS---------

function selectSort(event) {
	const sortBy = event.target.dataset.sort;
	const sortDir = event.target.dataset.sortDirection;

	//toggle direction
	if (sortDir === "asc") {
		event.target.dataset.sortDirection = "desc";
		document.querySelector("#sort1").textContent = "Firstname Z-A";
	} else {
		event.target.dataset.sortDirection = "asc";
		document.querySelector("#sort1").textContent = "Firstname A-Z";
	}

	setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
	settings.sortBy = sortBy;
	settings.sortDir = sortDir;

	buildList();
}

function sortList(sortedList) {
	let direction = 1;
	if (settings.sortDir === "desc") {
		direction = -1;
	} else {
		direction = 1;
	}
	sortedList = sortedList.sort(sortByProperty);

	function sortByProperty(a, b) {
		if (a[settings.sortBy] < b[settings.sortBy]) {
			return -1 * direction;
		}
		return 1 * direction;
	}

	return sortedList;
}

//------SEARCH IN THE LIST-------

//FOUND ON W3 SCHOOLS
function searchInList() {
	// Declare variables
	let input, filter, ul, li, i, txtValue, button, house;
	button = document.querySelectorAll("#admin_buttons");
	house = document.querySelectorAll("#student_house");
	input = document.querySelector("#search_inputfield");
	filter = input.value.toUpperCase();
	ul = document.querySelector("#studentList");
	li = ul.querySelectorAll("#name");
	console.log(li);

	// Loop through all list items, and hide those who don't match the search query
	for (i = 0; i < li.length; i++) {
		const firstname = li[i].querySelector("#firstname");
		const middlename = li[i].querySelector("#middlename");
		const lastname = li[i].querySelector("#lastname");

		const firstnameTxt = firstname.textContent || firstname.innerText;
		const middlenameTxt = middlename.textContent || middlename.innerText;
		const lastnameTxt = lastname.textContent || lastname.innerText;

		txtValue = firstnameTxt + " " + middlenameTxt + " " + lastnameTxt;

		//if the searched letter match the letter in name
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
			button[i].style.display = "";
			house[i].style.display = "";
		} else {
			li[i].style.display = "none";
			button[i].style.display = "none";
			house[i].style.display = "none";
		}
	}
}

//------BUILD THE LIST-------
function buildList() {
	const currentList = filterStudents(allStudents, expelledStudents);
	const sortedList = sortList(currentList);

	displayList(sortedList);
}

//---DISPLAY THE LIST OF STUDENTS
function displayList(students) {
	// clear the list
	document.querySelector("#studentList").innerHTML = "";

	//call displayCounter
	displayCounter(students);

	// build a new list
	students.forEach(displayStudent);
}

function displayStudent(student) {
	// create clone
	const clone = document.querySelector("template.student").content.cloneNode(true);

	// set clone data
	clone.querySelector("#student_house").textContent = student.house;
	clone.querySelector("[data-field=firstname]").textContent = student.firstname;
	clone.querySelector("[data-field=middlename]").textContent = student.middlename;
	clone.querySelector("[data-field=lastname]").textContent = student.lastname;

	clone.querySelector("#name").addEventListener("click", () => displayPopup(student));

	// make student prefect
	if (student.prefect === true) {
		clone.querySelector("[data-field=prefect]").dataset.prefect = true;
	} else {
		clone.querySelector("[data-field=prefect]").dataset.prefect = false;
	}

	clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

	function clickPrefect() {
		if (student.prefect === true) {
			student.prefect = false;
		} else {
			tryToMakeStudentPrefect(student);
		}

		buildList();
	}

	clone.querySelector("[data-field=squad]").addEventListener("click", clickSquad);

	function clickSquad() {}

	//DANGER: EXPEL STUDENT
	//listen for click on expel button
	clone.querySelector("[data-field=expel]").addEventListener("click", expelStudent);

	function expelStudent() {
		expelTheStudent(student);
	}

	// append clone to list
	document.querySelector("#studentList").appendChild(clone);
}

function expelTheStudent(expelledStudent) {
	expelledStudent.status = true;

	const indexOfExpelledStudent = allStudents.findIndex((student) => student.firstname === expelledStudent.firstname);

	const removeStudent = allStudents.splice(indexOfExpelledStudent, 1);

	expelledStudents.push(removeStudent[0]);
	console.log(expelledStudents);
	console.log(allStudents);

	buildList();
}

function tryToMakeStudentPrefect(selectedStudent) {
	const prefects = allStudents.filter((student) => student.prefect);
	const numberOfPrefects = prefects.length;
	const prefectFromHouse = prefects.filter((student) => student.house === selectedStudent.house);

	if (prefectFromHouse.length >= 2) {
		console.log("There can only be two prefects in each house");
		removeAOrB(prefectFromHouse[0], prefectFromHouse[1]);
	} else {
		makePrefect(selectedStudent);
	}

	/* console.log("Only one girl can become prefect from each house");
	console.log("Only one boy can become prefect from each house"); */

	function removeAOrB(prefectA, prefectB) {
		//ask the user to ignore or remove A or B
		document.querySelector("#removeaorb").classList.remove("hidden");
		document.querySelector("#removeaorb .closebutton").addEventListener("click", closeDialog);
		document.querySelector("#removeaorb #removea").addEventListener("click", clickRemoveA);
		document.querySelector("#removeaorb #removeb").addEventListener("click", clickRemoveB);

		//show names on buttons
		document.querySelector("#removeaorb [data-field=winnerA]").textContent = prefectA.firstname;
		document.querySelector("#removeaorb [data-field=winnerB]").textContent = prefectB.firstname;

		//if ignore -- do nothing..
		function closeDialog() {
			document.querySelector("#removeaorb").classList.add("hidden");
			document.querySelector("#removeaorb .closebutton").removeEventListener("click", closeDialog);
			document.querySelector("#removeaorb #removea").removeEventListener("click", clickRemoveA);
			document.querySelector("#removeaorb #removeb").removeEventListener("click", clickRemoveB);
		}
		//if removeA :
		function clickRemoveA() {
			removePrefect(prefectA);
			makePrefect(selectedStudent);
			buildList();
			closeDialog();
		}
		//else if removeB:
		function clickRemoveB() {
			removePrefect(prefectB);
			makePrefect(selectedStudent);
			buildList();
			closeDialog();
		}
	}

	function removePrefect(prefectStudents) {
		prefectStudents.prefect = false;
	}

	function makePrefect(student) {
		student.prefect = true;
	}
}

//----POP UP------
function displayPopup(student) {
	//display popup - removing hidden
	document.querySelector("#modal").classList.remove("zindex");
	document.querySelector("#modal").classList.add("backdrop");
	document.querySelector("#popup").classList.remove("hidden");

	//content
	document.querySelector("#pop_name").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
	document.querySelector("#student_photo").src = student.image;
	document.querySelector("#house").textContent = student.house;
	document.querySelector("#bloodstatus").textContent = student.blood;

	//if student is not a prefect, set text to "no"
	if (student.prefect === false) {
		document.querySelector("#prefect").textContent = "No";
	} else {
		document.querySelector("#prefect").textContent = "Yes";
	}

	//student status and add styling
	if (student.status === false) {
		document.querySelector("#status").textContent = "Not Expelled";
		document.querySelector("#status").style.color = "green";
	} else {
		document.querySelector("#status").textContent = "Expelled";
		document.querySelector("#status").style.color = "red";
	}

	//add nickname to Ernest
	if (student.firstname === "Ernest") {
		document.querySelector("#nickname").textContent = `"Ernie"`;
	} else {
		document.querySelector("#nickname").textContent = "";
	}

	document.querySelector("button#closebutton").addEventListener("click", closePopup);
}

function closePopup() {
	document.querySelector("#modal").classList.remove("backdrop");
	document.querySelector("#popup").classList.add("hidden");
	document.querySelector("#modal").classList.add("zindex");
}

function displayCounter(students) {
	//display counters
	const numberOfStudents = allStudents.length;
	document.querySelector("#number_all").innerHTML = `(${numberOfStudents})`;

	const numberOfAllStudents = students.length;
	document.querySelector("#number_showing").innerHTML = `${numberOfAllStudents} students`;

	const numberOfPrefects = allStudents.filter((student) => student.prefect).length;
	document.querySelector("#number_prefect").innerHTML = `(${numberOfPrefects})`;

	const numberOfSlytherin = allStudents.filter((student) => student.house === "Slytherin").length;
	document.querySelector("#number_slytherin").innerHTML = `(${numberOfSlytherin})`;

	const numberOfHufflepuff = allStudents.filter((student) => student.house === "Hufflepuff").length;
	document.querySelector("#number_hufflepuff").innerHTML = `(${numberOfHufflepuff})`;

	const numberOfGryffindor = allStudents.filter((student) => student.house === "Gryffindor").length;
	document.querySelector("#number_gryffindor").innerHTML = `(${numberOfGryffindor})`;

	const numberOfRavenclaw = allStudents.filter((student) => student.house === "Ravenclaw").length;
	document.querySelector("#number_Rawenclaw").innerHTML = `(${numberOfRavenclaw})`;

	const numberOfExpelled = expelledStudents.length;
	document.querySelector("#number_expelled").innerHTML = `(${numberOfExpelled})`;

	const numberOfNotExpelled = allStudents.length - expelledStudents.length;
	document.querySelector("#number_not_expelled").innerHTML = `(${numberOfNotExpelled})`;
}
