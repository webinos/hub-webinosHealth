
var graphRef = null;

getNewSensorData = function(ref) {
    graphRef = ref;
    //alert('getNewSensorData for '+graphRef.sensors4Choice[graphRef.sensorSelected].description+', index is '+graphRef.index);
    //TODO How to correctly configure sensors? Does it depend on sensor type
    // (that is an heartrate will need different configuration than the baby scale)?
    graphRef.sensors4Choice[graphRef.sensorSelected].configureSensor(
        {rate: 5000, time: 5000, eventFireMode: "fixedinterval"},
        function(){
            //alert('config ok');
            var htmlCode = '';
            htmlCode += 'Data acquisition...';
            $('#dialog-content').html(htmlCode);
            graphRef.sensors4Choice[graphRef.sensorSelected].addEventListener('sensor', dataAcquired, false);
        },
        function (){
            var htmlCode = '';
            htmlCode += 'Sorry, error in data acquisition...';
            $('#dialog-content').html(htmlCode);
        }
    );
}


dataAcquired = function (event) {
    //alert('Data acquired - '+graphRef.serviceUri);
    graphRef.sensors4Choice[graphRef.sensorSelected].removeEventListener('sensor', dataAcquired, false);
    graphRef.saveData(event);
    //graphRef = null;
}


