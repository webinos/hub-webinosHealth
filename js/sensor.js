
var graphRef = new Array();

getNewSensorData = function(ref) {
    //alert('ref index is '+ref.sensors4Choice[ref.sensorSelected].id);
    graphRef[ref.sensors4Choice[ref.sensorSelected].id] = ref;
    //alert('getNewSensorData for '+graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensors4Choice[graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensorSelected].description+', index is '+graphRef[ref.sensors4Choice[ref.sensorSelected].id].index);

    //TODO How to correctly configure sensors? Does it depend on sensor type
    // (that is an heartrate will need different configuration than the baby scale)?
    try {

/*
    graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensors4Choice[graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensorSelected].configureSensor(
        {rate: 5000, time: 5000, eventFireMode: "fixedinterval"},
        configureSuccess,
        configureError
    );
*/

    var sensRate = 1000*graphRef[ref.sensors4Choice[ref.sensorSelected].id].acquisitionRate;
    graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensors4Choice[graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensorSelected].configureSensor(
        {rate: sensRate, time: 500000, eventFireMode: "fixedinterval"},
        function(){
            //alert('configure sensor ok');
            var htmlCode = '';
            htmlCode += 'Data acquisition...';
            $('#dialog-content').html(htmlCode);
            graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensors4Choice[graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensorSelected].addEventListener('sensor', dataAcquired, false);
            graphRef[ref.sensors4Choice[ref.sensorSelected].id].acquisitionInProgress = true;
            graphRef[ref.sensors4Choice[ref.sensorSelected].id].stopButtonOn();
        },
        function (){
            //alert('configure sensor not ok');
            var htmlCode = '';
            htmlCode += 'Sorry, error in data acquisition...';
            $('#dialog-content').html(htmlCode);
        }
    );

    }
    catch(e) {
        alert(e.message);
    }
}


configureSuccess = function() {
    //alert('configure success');
    var htmlCode = '';
    htmlCode += 'Data acquisition...';
    $('#dialog-content').html(htmlCode);
    graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensors4Choice[graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensorSelected].addEventListener('sensor', dataAcquired, false);
    //alert('configure success - 07');
    graphRef[ref.sensors4Choice[ref.sensorSelected].id].acquisitionInProgress = true;
    graphRef[ref.sensors4Choice[ref.sensorSelected].id].stopButtonOn();
    //alert('configure success - END');
}


configureError = function() {
    alert('configure error');
    var htmlCode = '';
    htmlCode += 'Sorry, error in data acquisition...';
    $('#dialog-content').html(htmlCode);
}


dataAcquired = function (event) {
    //alert('Data acquired for '+event.sensorId);
    graphRef[event.sensorId].saveData(event);
    if(graphRef[event.sensorId].acquisitionMode == 0) {
        graphRef[event.sensorId].acquisitionInProgress = false;
        graphRef[event.sensorId].stopButtonOff();
        graphRef[event.sensorId].sensors4Choice[graphRef[event.sensorId].sensorSelected].removeEventListener('sensor', dataAcquired, false);
    }
}


stopDataAcquisition = function(ref) {
    //alert('stop data acquisition');
    graphRef[ref.sensors4Choice[ref.sensorSelected].id].acquisitionInProgress = false;
    graphRef[ref.sensors4Choice[ref.sensorSelected].id].stopButtonOff();
    graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensors4Choice[graphRef[ref.sensors4Choice[ref.sensorSelected].id].sensorSelected].removeEventListener('sensor', dataAcquired, false);
}


