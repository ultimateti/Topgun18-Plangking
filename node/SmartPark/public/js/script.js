var table_data = {};
var linex_data = {};
var liney_data = {};
var linez_data = {};

$( document ).ready(function() {
    console.log( "ready!" );

    formatResult(frontResult);
    google.charts.load('current', {packages: ['corechart', 'line','table']});
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
    }
}

$( "#timeForm" ).submit(function(event) {
	event.preventDefault();
	var query = {
		'sensor':frontResult[0].sensor,
		'daytime': $("#daytime").val()
	};
	$.get("../sensor_get", query, function(data) {
  		console.log(data);
  		formatResult(data.frontResult);
  		for(var i=0;i<data.frontResult.length;i++) {
  			createTable(data.frontResult[i]);
			createLine(data.frontResult[i]);
  		}
		
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



$('.graphBtn').click(function(event) {
	event.preventDefault();
	$('.graph').collapse("hide");
	$(this).next().collapse("toggle");

});


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
	}
}

function LetsDraw() {
	for(var i=0;i<frontResult.length;i++) {
  		createTable(i,frontResult[i]);
  		createLine(i,frontResult[i]);
  	}
  	$('.graph:not(:first)').collapse("hide");
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

function createLine(id,dispData) {
	//var today = new Date();
    //sensors = sensors.filter(a => a.value >= $("#tres-slider").slider("values", 0 ) && a.value <= $("#tres-slider").slider("values", 1 ));
    //sensors = sensors.filter(a => dayDiff(a.datetime,today) >= $("#day-slider").slider("values", 0 ) && dayDiff(a.datetime,today) <= $("#day-slider").slider("values", 1 ));
	var dateFormatter = new google.visualization.DateFormat({pattern: 'dd/MM/yyyy HH:mm'});	

    if(dispData.keys.indexOf('val')>-1) {
    	linex_data[id] = new google.visualization.DataTable();
		linex_data[id].addColumn('datetime', 'Time');
		linex_data[id].addColumn('number', dispData.sensor);
		for (var i=0;i<dispData.data.length;i++) 
			linex_data[id].addRow([new Date(dispData.data[i].date), parseFloat(dispData.data[i].val)]);
	}
	else {
		linex_data[id] = new google.visualization.DataTable();
		linex_data[id].addColumn('datetime', 'Time');
		linex_data[id].addColumn('number', dispData.sensor + ' (x)');
		for (var i=0;i<dispData.data.length;i++) 
			linex_data[id].addRow([new Date(dispData.data[i].date), parseFloat(dispData.data[i].val_x)]);

		liney_data[id] = new google.visualization.DataTable();
		liney_data[id].addColumn('datetime', 'Time');
		liney_data[id].addColumn('number', dispData.sensor + ' (y)');
		for (var i=0;i<dispData.data.length;i++) 
			liney_data[id].addRow([new Date(dispData.data[i].date), parseFloat(dispData.data[i].val_y)]);

		linez_data[id] = new google.visualization.DataTable();
		linez_data[id].addColumn('datetime', 'Time');
		linez_data[id].addColumn('number', dispData.sensor + ' (z)');
		for (var i=0;i<dispData.data.length;i++) 
			linez_data[id].addRow([new Date(dispData.data[i].date), parseFloat(dispData.data[i].val_z)]);
	}

	
	
	drawLine(id);
	
}
function drawLine(id) {
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

	if(linex_data[id]) {
		var chart = new google.visualization.LineChart(document.getElementById('linex'+id));   
	chart.draw(linex_data[id], options);
	}
	
	if(liney_data[id]) {
		var chart = new google.visualization.LineChart(document.getElementById('liney'+id));   
		chart.draw(liney_data[id], options);
	}
	if(linez_data[id]) {
		var chart = new google.visualization.LineChart(document.getElementById('linez'+id));   
		chart.draw(linez_data[id], options);
	}
      
}

// RESIZE
$(document).ready(function(){
	resizeDiv();
});

var timeoutHandle = window.setTimeout(resizeDiv);
window.onresize = function(event) {
	window.clearTimeout(timeoutHandle);
	timeoutHandle = window.setTimeout(resizeDiv,500);
}

function resizeDiv() {
	
	$('.graph').addClass("in");
	for(var i=0;i<frontResult.length;i++) {	
  		drawLine(i);
  	}
  	$('.graph:not(:first)').removeClass("in");
	//$('#chart_row').css({'height': $(document).innerHeight()/2 + 'px'});
}