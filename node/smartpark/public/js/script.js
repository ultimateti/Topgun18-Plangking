var table_data;
var line1_data;
var line2_data;
var line3_data;

$( document ).ready(function() {
    console.log( "ready!" );

    formatResult(result);
    google.charts.load('current', {packages: ['corechart', 'line','table']});
	google.charts.setOnLoadCallback(LetsDraw);
    
});

function formatResult(result) {
	for(var i=0;i<result.data.length;i++) {
    	if(result.data[i].hasOwnProperty('val')) result.data[i].val = parseFloat(result.data[i].val);
    	if(result.data[i].hasOwnProperty('val_x')) result.data[i].val_x = parseFloat(result.data[i].val_x);
    	if(result.data[i].hasOwnProperty('val_y')) result.data[i].val_y = parseFloat(result.data[i].val_y);
    	if(result.data[i].hasOwnProperty('val_z')) result.data[i].val_z = parseFloat(result.data[i].val_z);
    	if(result.data[i].hasOwnProperty('date')) result.data[i].date = new Date(result.data[i].date);
    }
}

$( "#timeForm" ).submit(function(event) {
	event.preventDefault();
	var query = {
		'sensor':result.sensor,
		'daytime': $("#daytime").val()
	};
	$.get("../sensor_get", query, function(data) {
  		console.log(data);
  		formatResult(data.result[0]);
		createTable(data.result[0]);
		createLine(data.result[0]);
	});
});

$("#day-slider").slider({
      range: true,
      min: -10,
      max: 10,
      values: [-5,5],
      slide: function( event, ui ) {
        $("#day-amount-min").val(ui.values[ 0 ]);
        $("#day-amount-max").val(ui.values[ 1 ]);
        //createAllAgain();
      }
    });
$("#tres-slider").slider({
      range: true,
      min: 0,
      max: 255,
      step: 0.01,
      values: [ 0, 2 ],
      slide: function( event, ui ) {
        $("#tres-amount-min").val(ui.values[ 0 ]);
        $("#tres-amount-max").val(ui.values[ 1 ]);
        //createAllAgain();
      }
    });
$("#daytime").val('2018-01-09T08:19');
$("#day-amount-min").val($("#day-slider").slider("values", 0 ));//.focusout(typeDay);
$("#day-amount-max").val($("#day-slider").slider("values", 1 ));//.focusout(typeDay);
$("#tres-amount-min").val($("#tres-slider").slider("values", 0 ));//.focusout(typeTres);
$("#tres-amount-max").val($("#tres-slider").slider("values", 1 ));//.focusout(typeTres);
$("#slidersetBtn").click(typeAll);
function typeAll(e) {
	typeDay(e); typeTres(e);
}
function typeDay(e) {
	if($("#day-amount-min").val() <= $("#day-amount-max").val()) {
    	$("#day-slider").slider("option", "values", [$("#day-amount-min").val(),$("#day-amount-max").val()]);
    	createAllAgain();
	}
}
function typeTres(e) {
	if($("#tres-amount-min").val() <= $("#tres-amount-max").val()) {
    	$("#tres-slider").slider("option", "values", [$("#tres-amount-min").val(),$("#tres-amount-max").val()]);
    	createAllAgain();
	}
}

function LetsDraw() {
	createTable(result);
	createLine(result);
}
function createTable(dispData) {

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

	table_data = data;
	dateFormatter.format(table_data, 0);

	drawTable();
}
function drawTable() {
	var options =  {
		showRowNumber: true, 
		width: '100%', 
		height: '200px'
	};
	var table = new google.visualization.Table(document.getElementById('table'));
	table.draw(table_data,options);
}

function createLine(dispData) {
	//var today = new Date();
    //sensors = sensors.filter(a => a.value >= $("#tres-slider").slider("values", 0 ) && a.value <= $("#tres-slider").slider("values", 1 ));
    //sensors = sensors.filter(a => dayDiff(a.datetime,today) >= $("#day-slider").slider("values", 0 ) && dayDiff(a.datetime,today) <= $("#day-slider").slider("values", 1 ));
	var dateFormatter = new google.visualization.DateFormat({pattern: 'dd/MM/yyyy HH:mm'});	

    if(dispData.keys.indexOf('val')>-1) {
    	line1_data = new google.visualization.DataTable();
		line1_data.addColumn('datetime', 'Time');
		line1_data.addColumn('number', dispData.sensor);
		for (var i=0;i<dispData.data.length;i++) 
			line1_data.addRow([new Date(dispData.data[i].date), parseFloat(dispData.data[i].val)]);
	}
	else {
		line1_data = new google.visualization.DataTable();
		line1_data.addColumn('datetime', 'Time');
		line1_data.addColumn('number', dispData.sensor + ' (x)');
		for (var i=0;i<dispData.data.length;i++) 
			line1_data.addRow([new Date(dispData.data[i].date), parseFloat(dispData.data[i].val_x)]);

		line2_data = new google.visualization.DataTable();
		line2_data.addColumn('datetime', 'Time');
		line2_data.addColumn('number', dispData.sensor + ' (y)');
		for (var i=0;i<dispData.data.length;i++) 
			line2_data.addRow([new Date(dispData.data[i].date), parseFloat(dispData.data[i].val_y)]);

		line3_data = new google.visualization.DataTable();
		line3_data.addColumn('datetime', 'Time');
		line3_data.addColumn('number', dispData.sensor + ' (z)');
		for (var i=0;i<dispData.data.length;i++) 
			line3_data.addRow([new Date(dispData.data[i].date), parseFloat(dispData.data[i].val_z)]);
	}

	
	
	drawLine();
	
}
function drawLine() {
	var options = {
		width: '100%', 
		height: '100%',
		hAxis: {
		  title: 'Time',
		  format: 'dd/MM/yyyy HH:mm' 
		},
		vAxis: {
		  title: 'Value'
		},
		explorer: {
			axis: 'horizontal',
			maxZoomIn:16
		},
		colors: [
			'#FF00FF'
		]
	};
	var chart = new google.visualization.LineChart(document.getElementById('line1'));   
	chart.draw(line1_data, options);
	if(line2_data) {
		var chart = new google.visualization.LineChart(document.getElementById('line2'));   
		chart.draw(line2_data, options);
	}
	if(line3_data) {
		var chart = new google.visualization.LineChart(document.getElementById('line3'));   
		chart.draw(line3_data, options);
	}
      
}