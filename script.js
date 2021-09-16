"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

const Student = {
	firstname: "",
	middlename: "",
	lastname: "",
	house: "",
	image: new Image(),
};

const settings = {
	filterBy: "all",
	sortBy: "firstname",
	sortDir: "asc",
};

function start() {
	console.log("ready");

	document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

	document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));

	document.querySelector("#search_inputfield").addEventListener("keyup", searchInList);

	loadJSON();
}

//-----GET JSON OBJECTS AND PREPARE-----
async function loadJSON() {
	const response = await fetch("students.json");
	const jsonData = await response.json();

	prepareStudents(jsonData);
}

function prepareStudents(jsonData) {
	console.log(jsonData);

	allStudents = jsonData.map(preapareStudent);

	displayList(allStudents);
}

function preapareStudent(jsonObject) {
	const student = Object.create(Student);

	student.firstname = getFirstName(jsonObject.fullname);
	student.middlename = getMiddleName(jsonObject.fullname);
	student.lastname = getLastName(jsonObject.fullname);
	student.house = getHouse(jsonObject.house);
	student.image = getImage(jsonObject.fullname);

	return student;
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
	/* if (fullname.includes("jean") || fullname.includes("James") || fullname.includes("Bilius") || fullname.includes("lucius")) {
		const middleName = fullname.substring(fullname.indexOf(" "), fullname.lastIndexOf(" "));
		const firstLetter = middleName.substring(1, 2);
		const restOfName = middleName.substring(2);

		const correctMiddleName = firstLetter.toUpperCase() + restOfName.toLowerCase();

		return correctMiddleName;
	} */

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
	const correctHouse = houseTrimmed.toLowerCase();

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

function filterStudents(filteredList) {
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
		filteredList = allStudents.filter(isExpelled);
	} else if (settings.filterBy === "prefect") {
		filteredList = allStudents.filter(isPrefect);
	}

	return filteredList;
}

function isGryffindor(student) {
	return student.house === "gryffindor";
}

function isHufflepuff(student) {
	return student.house === "hufflepuff";
}

function isSlytherin(student) {
	return student.house === "slytherin";
}

function isRavenclaw(student) {
	return student.house === "ravenclaw";
}

function isNotExpelled(student) {
	return student.status === "not expelled";
}

function isExpelled(student) {
	return student.status === "expelled";
}

function isPrefect(student) {
	return student.status === "prefect";
}

//------SORT STUDENTS---------

function selectSort(event) {
	const sortBy = event.target.dataset.sort;
	const sortDir = event.target.dataset.sortDirection;

	//toggle direction
	if (sortDir === "asc") {
		event.target.dataset.sortDirection = "desc";
	} else {
		event.target.dataset.sortDirection = "asc";
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
	console.log("yep");
	// Declare variables
	let input, filter, ul, li, a, i, txtValue;
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

		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}

//------BUILD THE LIST-------
function buildList() {
	const currentList = filterStudents(allStudents);
	const sortedList = sortList(currentList);

	displayList(sortedList);
}

//---DISPLAY THE LIST OF STUDENTS
function displayList(students) {
	// clear the list
	document.querySelector("#studentList").innerHTML = "";

	// build a new list
	students.forEach(displayStudent);
}

function displayStudent(student) {
	// create clone
	const clone = document.querySelector("template.student").content.cloneNode(true);

	// set clone data
	clone.querySelector("[data-field=firstname]").textContent = student.firstname;
	clone.querySelector("[data-field=middlename]").textContent = student.middlename;
	clone.querySelector("[data-field=lastname]").textContent = student.lastname;

	clone.querySelector("#name").addEventListener("click", () => showPopup(student));

	// append clone to list
	document.querySelector("#studentList").appendChild(clone);
}

//----POP UP------
function showPopup(student) {
	//styling
	document.querySelector("#modal").classList.remove("zindex");
	document.querySelector("#modal").classList.add("backdrop");
	document.querySelector("#popup").classList.remove("hidden");

	console.log("ID:", student.firstname);

	//content
	document.querySelector("#pop_name").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
	document.querySelector("#student_photo").src = student.image;

	document.querySelector("button#closebutton").addEventListener("click", closePopup);
}

function closePopup() {
	document.querySelector("#modal").classList.remove("backdrop");
	document.querySelector("#popup").classList.add("hidden");
	document.querySelector("#modal").classList.add("zindex");
}
