var EpicHeadings = [];
var EpicData = [];

$( document ).ready(function() {
	$(".panel").each(function() {
		let header = $(this).children(".panelHeader").text();
		if (header == "Project Scope" || header == "Project organizatioon") {
			$(this).children(".panelContent").addClass("vertical-table");
		}
	});
});



function updateEpicData() {
	$(".panel .aui td").each(function() {
		var content = $(this).text().trim();
		if (content.substring(0,3) == "TI-") {
			
			let epicData = findEpicData(content);
			console.log(epicData);
		}
	});
}

function findEpicData(key) {
	EpicData.forEach(function (index) {
		if (index["key"] == key) {
			
		}
		return index;
	});
	return null;
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
		updateEpicData();
	}
});
