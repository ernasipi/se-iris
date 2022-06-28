var EpicHeadings = [];
var EpicData = [];
var loadedJiraData = false;

$( document ).ready(function() {
	$(".panel").each(function() {
		let header = $(this).children(".panelHeader").text();
		if (header == "Project Scope" || header == "Project organizatioon") {
			$(this).children(".panelContent").addClass("vertical-table");
		} else if (header == "Technical information") {
			$(this).children(".panelContent").addClass("tech-info-table");
		}

		let headerAlt = $(this).children(".panelContent").children("h1").text();
		if (headerAlt == "Deliveries") {
			$(this).addClass("delivery-table");
		}
	});
});

function findEpicData(key) {
	let result = null;
	for (let index of EpicData) {
		if (index["key"] == key) {
			result = index;
			break;
		}
	}
	return result;
}

function updateEpicData() {
	$(".panel .aui td").each(function() {
		var content = $(this).text().trim();
		if (content.substring(0,3) == "TI-") {			
			let data = findEpicData(content);
			if (data != null) {
				let epicName = data["epic name"];
				let epicSplit = epicName.split(" - ");
				if (epicSplit.length == 2) {
					let isBDBF = false;
					let isNr = false;
					let re = new RegExp("^([0-9]{6,})$");
					if (epicSplit[0].substring(0,2).toLowerCase() == "bd" || epicSplit[0].substring(0,2).toLowerCase() == "bf") {
						isBDBF = true;
					}
					if (re.test(epicSplit[0].substring(2,8))) {
						isNr = true;
					}
					if (isBDBF && isNr) {
						epicName = epicSplit[1];
					}
					console.log(isBDBF & isNr);
				}
				$(this).html(epicName);
			}
			
		}
	});
}

function formatDate(date) {
	let d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) 
		month = '0' + month;
	if (day.length < 2) 
		day = '0' + day;

	return [year, month, day].join('-');
}

function parseDate(str) {
	let m = str.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	return (m) ? formatDate(new Date(m[3], m[2]-1, m[1])) : null;
}

function onElementInserted(containerSelector, elementSelector, callback) {

	let onMutationsObserved = function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.addedNodes.length) {
				let elements = $(mutation.addedNodes).find(elementSelector);
				for (let i = 0, len = elements.length; i < len; i++) {
					callback(elements[i]);
				}
			}
		});
	};

	let target = $(containerSelector)[0];
	let config = { childList: true, subtree: true };
	let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	let observer = new MutationObserver(onMutationsObserved);    
	observer.observe(target, config);
}

onElementInserted('body', '.jira-issues', function(element) {
	$(element).find("td").each(function() {
		let newDate = parseDate($(this).text());
		if (newDate !== null) {
			$(this).text(newDate);
		}

		var content = $(this).text().trim();
		content = content.replace("As Designed", "AsD");
		content = content.replace("As Built", "AsB");
		content = content.replace("As Maintained", "AsM");
		$(this).html(content);
	});
	let panel = $(element).closest(".panel");
	let header = panel.children(".panelHeader").text();
	if (header == "Project organization") {
		panel.find(".panelContent a").each(function(){
			if ($(this).text().includes("siemensenergyag.sharepoint.com/sites/fsporderdeliveryteam/Lists/Bemanning")) {
				$(this).text("Staffing in projects (Bemanningsfilen)");
			}
		});
	} else if (header == "Technical information") {
		let dataTable = panel.find("table.aui tbody tr");
		$(dataTable).each(function() {
			if ($(this).hasClass("rowNormal") || $(this).hasClass("rowAlternate")) {
				let index = 0;
				let dataRow = [];
				$(this).children("td").each(function () {
					if (EpicHeadings[index] !== undefined) {
						dataRow[EpicHeadings[index]] = $(this).text().trim();
					}
					
					index++;
				});
				EpicData.push(dataRow);
			} else if ($(this).text() != "") {
				let index = 0;
				$(this).children("th").each(function () {
					let title = $(this).text().toLowerCase();
					
					if (title == "key") { 
						EpicHeadings[index] = "key"; 
					} else if (title == "summary") { 
						EpicHeadings[index] = "summary"; 
					} else if (title == "assignee") { 
						EpicHeadings[index] = "assignee"; 
					} else if (title == "reporter") { 
						EpicHeadings[index] = "reporter"; 
					} else if (title == "status") { 
						EpicHeadings[index] = "status"; 
					} else if (title == "epic name") { 
						EpicHeadings[index] = "epic name"; 
					} else if (title == "b-nummer") {
						EpicHeadings[index] = "b-nummer"; 
					}
					
					index++;
				});
				
			}
		});
		
		loadedJiraData = true;
	}
	if (loadedJiraData) {
		updateEpicData();
	}
});
