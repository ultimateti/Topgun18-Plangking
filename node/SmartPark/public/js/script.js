var table_data = {};
var line_chart = {};
var liney_chart = {};
var linez_chart = {};

$( document ).ready(function() {
    console.log( "ready!" );
    console.log(frontResult);

    formatResult(frontResult);
    $('#dataTable').DataTable();
    LetsDraw();
    
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
	    if(frontResult[i].data[i].hasOwnProperty('date')) frontResult[i].data.sort((a, b) => a.date - b.date);
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
  		formatResult(data);
  		for(var i=0;i<data.result.length;i++) {
  			updateLine(i,data.result[i]);
  		}
		
	});
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
    	//updateLine(id,dispData);
	}
}
function typeTres(e) {
	if($("#tres-amount-min").val() <= $("#tres-amount-max").val()) {
    	$("#tres-slider").slider("option", "values", [$("#tres-amount-min").val(),$("#tres-amount-max").val()]);
    	//updateLine(id,dispData);
	}
}

function LetsDraw() {
	for(var i=0;i<frontResult.length;i++) {
  		createLine(i,frontResult[i]);
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
			label: dispData.sensor,
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
			label: dispData.sensor + '(x)',
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
			label: dispData.sensor + '(y)',
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
			label: dispData.sensor + '(z)',
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