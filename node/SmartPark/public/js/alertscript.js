var table_data = {};

$( document ).ready(function() {
    console.log( "ready!" );

    formatResult(frontResult);
    google.charts.load('current', {packages: ['corechart','table']});
	google.charts.setOnLoadCallback(LetsDraw);
    
});

function formatResult(frontResult) {
	for(var i=0;i<frontResult.length;i++) {
		for(var j=0;j<frontResult[i].data.length;j++) {
	    	if(frontResult[i].data[j].hasOwnProperty('val')) frontResult[i].data[j].val = parseFloat(frontResult[i].data[j].val);
	    	if(frontResult[i].data[i].hasOwnProperty('val_x')) frontResult[i].data[j].val_x = parseFloat(frontResult[i].data[j].val_x);
	    	if(frontResult[i].data[i].hasOwnProperty('val_y')) frontResult[i].data[j].val_y = parseFloat(frontResult[i].data[j].val_y);
	    	if(frontResult[i].data[i].hasOwnProperty('val_z')) frontResult[i].data[j].val_z = parseFloat(frontResult[i].data[j].val_z);
	    	if(frontResult[i].data[i].hasOwnProperty('date')) frontResult[i].data[j].date = new Date(frontResult[i].data[j].date);
	    }
	    //if(frontResult[i].data[i].hasOwnProperty('date')) frontResult[i].sort((a, b) => a.date - b.date);
    }
}

function LetsDraw() {
	for(var i=0;i<frontResult.length;i++) {
  		createTable(i,frontResult[i]);
  	}
}
function createTable(id,dispData) {

	var data = new google.visualization.DataTable();
	var dateFormatter = new google.visualization.DateFormat({pattern: 'dd/MM/yyyy HH:mm'});

	/*
		var dispData = {
			        sensor: 'posts',
			        teamID: 25,
			        keys: ['userId','id','title'],
			        data: JSON.parse(results[i])
			     };
	*/
	for(var i=0;i<dispData.keys.length;i++) {
		var type = '';
		if(dispData.keys[i].startsWith('val'))
			type = 'number';
		else if(dispData.keys[i]=='date')
			type = 'datetime';
		else 
			type = 'string';
		data.addColumn(type,dispData.keys[i]);
	}
    
    //var today = new Date();
    //sensors = sensors.filter(a => a.value >= $("#tres-slider").slider("values", 0 ) && a.value <= $("#tres-slider").slider("values", 1 ));
    //sensors = sensors.filter(a => dayDiff(a.datetime,today) >= $("#day-slider").slider("values", 0 ) && dayDiff(a.datetime,today) <= $("#day-slider").slider("values", 1 ));
    console.log(dispData.data);
    for (var i=0;i<dispData.data.length;i++) {
    	
    	var rowData = [];
    	 for(var j=0;j<dispData.keys.length;j++) {
    	 	rowData.push(dispData.data[i][dispData.keys[j]]);
    	 }
    	data.addRow(rowData);
    }

	table_data[id] = data;
	dateFormatter.format(table_data[id], 0);

	drawTable(id);
}
function drawTable(id) {
	var cssClassNames = {
        'headerRow': 'cssHeaderRow',
        'tableRow': 'cssTableRow',
        'oddTableRow': 'cssOddTableRow',
        'selectedTableRow': 'cssSelectedTableRow',
        'hoverTableRow': 'cssHoverTableRow',
        'headerCell': 'cssHeaderCell',
        'tableCell': 'cssTableCell',
        'rowNumberCell': 'cssRowNumberCell'
    };

	var options =  {
		showRowNumber: true, 
		allowHtml: true,
		cssClassNames: cssClassNames,
		width: '100%', 
		height: '200px'
	};
	var table = new google.visualization.Table(document.getElementById('table'+id));
	table.draw(table_data[id],options);
}
