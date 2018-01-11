var table_data = {};
var line_chart = {};
var liney_chart = {};
var linez_chart = {};

$( document ).ready(function() {
    console.log( "ready!" );
    console.log(frontResult);

    formatResult(frontResult);
    LetsDraw();
    $("body").fadeIn(1000);
});


function formatResult(result) {
	for(var i=0;i<result.length;i++) {
		for(var j=0;j<result[i].data.length;j++) {
	    	if(result[i].data[j].hasOwnProperty('val')) result[i].data[j].val = parseFloat(result[i].data[j].val);
	    	if(result[i].data[j].hasOwnProperty('val_x')) result[i].data[j].val_x = parseFloat(result[i].data[j].val_x);
	    	if(result[i].data[j].hasOwnProperty('val_y')) result[i].data[j].val_y = parseFloat(result[i].data[j].val_y);
	    	if(result[i].data[j].hasOwnProperty('val_z')) result[i].data[j].val_z = parseFloat(result[i].data[j].val_z);
	    	if(result[i].data[j].hasOwnProperty('date')) result[i].data[j].date = new Date(result[i].data[j].date);
	    }
	    if(result[i].data[0].hasOwnProperty('date')) result[i].data.sort((a, b) => a.date - b.date);
	    $('#dataTable'+i).DataTable();
    }
}

$( "#timeForm" ).submit(function(event) {
	event.preventDefault();
	var query = {
		'sensor':frontResult[0].sensor,
		'starttime': $("#starttime").val(),
		'stoptime': $("#stoptime").val()
	};
	
	$.get("../sensor_get", query, function(data) {
  		formatResult(data.result);
  		console.log(data.result);
  		for(var i=0;i<data.result.length;i++) {
  			updateLine(data.result[i].teamID,data.result[i]);
  		}
		
	});
});

//$("#starttime").val('2018-01-11T20:05');
//$("#stoptime").val('2018-01-11T20:38');

$('.graphBtn').click(function(event) {
	event.preventDefault();
	$('.graph').collapse("hide");
	$(this).next().collapse("toggle");
});


function LetsDraw() {
	for(var i=0;i<frontResult.length;i++) {
  		createLine(frontResult[i].teamID,frontResult[i]);
  	}
  	$('.graph:not(:first)').collapse("hide");
}

function createLine(id,dispData) {
	var data = [];
	var config = {
	    type: 'bar',
		data: {
				datasets: []
			},
		    options: {
				scales: {
					xAxes: [{
						type: 'time'
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
	};

	if(dispData.keys.indexOf('val')>-1) {
		for (var i=0;i<dispData.data.length;i++) {
			data.push({x:new Date(dispData.data[i].date),y:parseFloat(dispData.data[i].val)});
		}
		
		config.data.datasets.push({
			label: 'value',
			backgroundColor: '#FF0000',
			data: data,
			type: 'line',
			pointRadius: 3,
			fill: false,
			lineTension: 0,
			borderWidth: 3,
			borderDash: [3,3]
		});

	}
	else {
		data = [];
		for (var i=0;i<dispData.data.length;i++) {
			data.push({x:new Date(dispData.data[i].date),y:parseFloat(dispData.data[i].val_x)});
		}
		config.data.datasets.push({
			label: '(x)',
			backgroundColor: '#FF0000',
			data: data,
			type: 'line',
			pointRadius: 3,
			fill: false,
			lineTension: 0,
			borderWidth: 3,
			borderDash: [3,3]
		});

		data = [];
		for (var i=0;i<dispData.data.length;i++) {
			data.push({x:new Date(dispData.data[i].date),y:parseFloat(dispData.data[i].val_y)});
		}
		
		config.data.datasets.push({
			label: '(y)',
			backgroundColor: '#FFFF00',
			data: data,
			type: 'line',
			pointRadius: 3,
			fill: false,
			lineTension: 0,
			borderWidth: 3,
			borderDash: [3,3]
		});

		data = [];
		for (var i=0;i<dispData.data.length;i++) {
			data.push({x:new Date(dispData.data[i].date),y:parseFloat(dispData.data[i].val_z)});
		}
		config.data.datasets.push({
			label: '(z)',
			backgroundColor: '#00FF00',
			data: data,
			type: 'line',
			pointRadius: 3,
			fill: false,
			lineTension: 0,
			borderWidth: 3,
			borderDash: [3,3]
		});


		
	}
	line_chart[id] = new Chart($('#line'+id),config);
	
}

function updateLine(id,dispData) {
	var data = [];

	if(dispData.keys.indexOf('val')>-1) {
		for (var i=0;i<dispData.data.length;i++) {
			data.push({x:new Date(dispData.data[i].date),y:parseFloat(dispData.data[i].val)});
		}
		line_chart[id].config.data.datasets[0].data = data;

	}
	else {
		data = [];
		for (var i=0;i<dispData.data.length;i++) {
			data.push({x:new Date(dispData.data[i].date),y:parseFloat(dispData.data[i].val_x)});
		}
		line_chart[id].config.data.datasets[0].data = data;

		data = [];
		for (var i=0;i<dispData.data.length;i++) {
			data.push({x:new Date(dispData.data[i].date),y:parseFloat(dispData.data[i].val_y)});
		}
		line_chart[id].config.data.datasets[1].data = data;

		data = [];
		for (var i=0;i<dispData.data.length;i++) {
			data.push({x:new Date(dispData.data[i].date),y:parseFloat(dispData.data[i].val_z)});
		}
		line_chart[id].config.data.datasets[2].data = data;


		
	}

	line_chart[id].update();
      
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
	
	
	//$('#chart_row').css({'height': $(document).innerHeight()/2 + 'px'});
}