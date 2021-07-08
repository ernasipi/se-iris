$( document ).ready(function() {
    $(".panel").each(function( index ) {
		if ($(this).children(".panelHeader").text() == "Project Scope") {
			$(this).children(".panelContent").addClass("vertical-table");
		}
    });
});
