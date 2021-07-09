$( document ).ready(function() {
	$(".panel").each(function() {
		var header = $(this).children(".panelHeader").text();
		if (header == "Project Scope" || header == "Project organizatioon") {
			$(this).children(".panelContent").addClass("vertical-table");
		}
	});
});

function formatDate(date) {
	var d = new Date(date),
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
	var m = str.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	return (m) ? formatDate(new Date(m[3], m[2]-1, m[1])) : null;
}

function onElementInserted(containerSelector, elementSelector, callback) {

	var onMutationsObserved = function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.addedNodes.length) {
				var elements = $(mutation.addedNodes).find(elementSelector);
				for (var i = 0, len = elements.length; i < len; i++) {
					callback(elements[i]);
				}
			}
		});
	};

	var target = $(containerSelector)[0];
	var config = { childList: true, subtree: true };
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	var observer = new MutationObserver(onMutationsObserved);    
	observer.observe(target, config);
}

onElementInserted('body', '.jira-issues', function(element) {
	$(element).find("td").each(function() {
		var newDate = parseDate($(this).text());
		if (newDate !== null) {
			$(this).text(newDate);
		}
	});
	var panel = $(element).closest(".panel");
	if (panel.children(".panelHeader").text() == "Project organization") {
		panel.find(".panelContent a").each(function(){
			if ($(this).text().includes("siemensenergyag.sharepoint.com/sites/fsporderdeliveryteam/Lists/Bemanning")) {
				$(this).text("Staffing in projects (Bemanningsfilen)");
			}
		});
	}
});
