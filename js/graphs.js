

function graphHandler(isMom) {

    this.isMom = isMom;
    this.mainDiv = null;
    this.index;
    this.type;
    this.sensorType = -1;
    this.availableSensors = null;
    this.sensors4Choice = null;
    this.serviceUri = null;
    var ref = this;
    this.sensorSelected;
    this.description = null;
    this.historicData = null;
    this.acquisitionInProgress = false;
    this.acquisitionMode = -1;
    this.acquisitionRate = 10;
    this.showingData = false;

    /* type is the type of data to be shown in graph:
       -0 = mom blood pressure
       -1 = mom blood sugar
       -2 = mom heartrate
       -3 = mom temperature
       -10 = baby weight
       -11 = baby temperature
       index is the index of the baby in mybabyList array; -1 is for the mother
    */
 
    graphHandler.prototype.displayGraph = function (divName, type, index, showAcquire) {
        //alert('displayGraph - div is '+divName+', type is '+type+', index is '+index);

        this.mainDiv = divName;
        this.index = index;
        this.type = type;
        this.sensorType = type;
        this.availableSensors = new Array();
        var htmlCode = '<br><table><tr>';
        if(type == 0) {
            //htmlCode += '<tr><td>Div for showing graph with mom blood pressure</td></tr>';
            this.description = 'mom blood pressure';
            this.serviceUri = 'http://webinos.org/api/sensors/bloodpressure';
        }
        else if(type == 1) {
            //htmlCode += '<tr><td>Div for showing graph with mom blood sugar</td></tr>';
            this.description = 'mom blood sugar';
            this.serviceUri = 'http://webinos.org/api/sensors/bloodsugar';
        }
        else if(type == 2) {
            //htmlCode += '<tr><td>Div for showing graph with mom heartrate</td></tr>';
            this.description = 'mom heartrate';
            this.serviceUri = 'http://webinos.org/api/sensors/heartratemonitor';
        }
        else if(type == 3) {
            //htmlCode += '<tr><td>Div for showing graph with mom temperature</td></tr>';
            this.description = 'mom temperature';
            this.serviceUri = 'http://webinos.org/api/sensors/temperature';
        }
        else if(type == 10) {
            //htmlCode += '<tr><td>Div for showing graph with baby weight</td></tr>';
            this.description = 'baby weight';
            this.serviceUri = 'http://webinos.org/api/sensors/weightscale';
        }
        else if(type == 11) {
            //htmlCode += '<tr><td>Div for showing graph with baby temperature</td></tr>';
            this.description = 'baby temperature';
            this.serviceUri = 'http://webinos.org/api/sensors/temperature';
        }
        else if(type == 12) {
            this.description = 'baby o2 saturation';
            this.serviceUri = 'http://webinos.org/api/sensors/oximeter';
        }
        htmlCode += '<td><input type=\'button\' value=\'Show data\' class=\'buttonGeneric\' id=\''+this.mainDiv+'ShowButton\'></td>';
        if(showAcquire) {
            htmlCode += '<td><input type=\'button\' value=\'Acquire data\' class=\'buttonGeneric\' id=\''+this.mainDiv+'AcquireButton\'></td>';
        }
        htmlCode += '</tr></table>';
        $('#'+this.mainDiv).html(htmlCode);
        (function(mDiv, rf) {
            $('#'+mDiv+'ShowButton').click(function() {
                rf.selectGraph();
            });
        })(this.mainDiv, this);
        if(showAcquire) {
/*
            (function(mDiv, rf) {
                $('#'+mDiv+'AcquireButton').click(function() {
                    //rf.selectSensor();
                    rf.dataAcquisition();
                });
            })(this.mainDiv, this);
*/
            if(this.acquisitionInProgress) {
                this.stopButtonOn();
            }
            else {
                this.stopButtonOff();
            }
        }

/*
        if(this.serviceUri) {
            //alert('findService for index '+index+' and uri '+this.serviceUri);
            webinos.discovery.findServices(
                new ServiceType(this.serviceUri),
                { onFound : function (serv) {
                    //alert('service found for index '+ref.index);
                    ref.availableSensors.push(serv);
                }
            });
        }
//*/
    }


    graphHandler.prototype.dataAcquisition = function () {
        this.showingData = false;
        if(this.acquisitionInProgress) {
/*
            var htmlCode = '';
            htmlCode += 'Acquisition in progress...<br>';
            htmlCode += '<input type=\'button\' value=\'Stop acquisition\' class=\'buttonGeneric\' id=\''+this.mainDiv+'SA\'>';
            $('#dialog-content').html(htmlCode);
            $('#dialog-container').fadeIn(1000);
            (function(mDiv, rf) {
                $('#'+mDiv+'SA').click(function() {
                    stopDataAcquisition(rf);
                    $('#dialog-content').html('');
                    $('#dialog-container').fadeOut(300);
                });
            })(this.mainDiv, this);
*/
        }
        else {
            var htmlCode = '';
            htmlCode += 'Select sensor from explorer...';
            $('#dialog-content').html(htmlCode);
            $('#dialog-container').fadeIn(1000);
            this.sensors4Choice = null;
            this.sensorSelected = -1;
            retrieveData(this.index, this.type, this.isMom, function(result, ref) {}, this);
            (function(rf) {
            var serviceList = [ rf.serviceUri ];
            webinos.dashboard
                .open({
                        module: 'explorer',
                        data: { service: serviceList }
                    }, function(){
                        if(rf.sensorSelected == -1) {
                            $('#dialog-content').html('No sensor selected...');
                        }
                })
                .onAction(function (data) {
                    if(data.result.length > 0) {
                        selectServiceStatic(data.result[0], rf);
                    }
                    else {
                        var htmlCode = '';
                        htmlCode += 'No sensor selected...';
                        $('#dialog-content').html(htmlCode);
                    }
                });
            })(this);
        }
    }


    graphHandler.prototype.selectService = function (data) {
        //alert('selectService: '+JSON.stringify(data));
        $('#dialog-content').html('preparing for data acquisition...');
        (function(dt, rf) {
        webinos.discovery.findServices(
            new ServiceType(dt.api),
            { onFound: function(service){
                if ((service.id === dt.id) && (service.serviceAddress === dt.address)) {
                    rf.sensors4Choice = new Array();
                    rf.sensors4Choice[0] = service;
                    rf.sensorSelected = 0;

                    service.bind({
                        onBind: function(){
                            //alert('bind ok');
                            //getNewSensorData(rf);
                            rf.selectAcquisitionMode();
                        }
                    });

                }
            }
        });
        })(data, this);
 
    }


    graphHandler.prototype.selectAcquisitionMode = function () {
        var htmlCode = '';
        htmlCode += '<table>';
        htmlCode += '<tr><td>Sensor: '+this.sensors4Choice[this.sensorSelected].description+'</td></tr>';
        htmlCode += '<tr><td>Select acquisition mode:</td></tr>';
        htmlCode += '<tr><td><select id=\''+this.mainDiv+'SelectAM\'>';
//        htmlCode += '<option value=\'-1\'>Choose mode</option>';
        htmlCode += '<option value=\'0\'>Single data</option>';
        htmlCode += '<option value=\'1\'>Continuous</option>';
        htmlCode += '</select></td></tr>';
        htmlCode += '<tr><td>Select acquisition rate:</td></tr>';
        htmlCode += '<tr><td><select id=\''+this.mainDiv+'SelectAR\'>';
        htmlCode += '<option value=\'10\'>10 s</option>';
        htmlCode += '<option value=\'20\'>20 s</option>';
        htmlCode += '<option value=\'30\'>30 s</option>';
        htmlCode += '<option value=\'60\'>60 s</option>';
        htmlCode += '<option value=\'120\'>120 s</option>';
        htmlCode += '</select></td></tr>';
        htmlCode += '<tr><td><input type=\'button\' value=\'Go\' class=\'buttonGeneric\' id=\''+this.mainDiv+'StartAcquisition\'></td></tr>';
        htmlCode += '</table>';
        $('#dialog-content').html(htmlCode);
        (function(mDiv, rf) {
            $('#'+mDiv+'StartAcquisition').click(function() {
                rf.acquisitionMode = +($('#'+rf.mainDiv+'SelectAM').val());
                rf.acquisitionRate = +($('#'+rf.mainDiv+'SelectAR').val());
                //alert('Acquisition rate is '+rf.acquisitionRate);
                $('#dialog-content').html('');
                if(rf.acquisitionMode == 1) {
                    $('#dialog-container').fadeOut(300);
                }
                getNewSensorData(rf);
            });
        })(this.mainDiv, this);
    }


/*
    graphHandler.prototype.selectSensor = function () {
        //alert('selectSensor for index '+this.index+', type '+this.sensorType);
        var htmlCode = '';
        this.sensors4Choice = this.availableSensors;
        if(this.sensors4Choice.length == 0) {
            htmlCode += 'Sorry, no sensors available...';
            $('#dialog-content').html(htmlCode);
        }
        else {
            this.sensorSelected = -1;
            htmlCode += '<select id=\''+this.mainDiv+'Select\'>';
            htmlCode += '<option value=\'-1\'>Choose sensor</option>';
            for(var i=0; i<this.sensors4Choice.length; i++) {
                htmlCode += '<option value=\''+i+'\'>'+this.sensors4Choice[i].displayName+'</option>';
            }
            htmlCode += '</select>';
            $('#dialog-content').html(htmlCode);
            (function(mDiv, rf) {
                $('#'+mDiv+'Select').change(function() {
                    rf.sensorSelected = +($('#'+rf.mainDiv+'Select').val());
                    //alert('sensor selected: '+rf.sensors4Choice[rf.sensorSelected].description);
                    alert('sensor selected: '+JSON.stringify(rf.sensors4Choice[rf.sensorSelected]));
                    rf.sensors4Choice[rf.sensorSelected].bind({
                        onBind: function(){
                            //rf.getNewData();
                            getNewSensorData(rf);
                        }
                    });
                });
            })(this.mainDiv, this);
        }
        $('#dialog-container').fadeIn(1000);
    }
*/

    graphHandler.prototype.saveData = function(event) {
        //alert('saveData - '+this.sensors4Choice[this.sensorSelected].description);
        //alert(JSON.stringify(event));
        var time=new Date(event.timestamp);
        if(this.acquisitionMode == 0) {
            var htmlCode = '';
            htmlCode += 'Timestamp: '+time.toDateString()+'<br>';
            for(var i=0; i<event.sensorValues.length; i++) {
                htmlCode += 'Value '+i+': '+event.sensorValues[i]+'<br>';
            }
            $('#dialog-content').html(htmlCode);
        }
        //storeData(this.index, this.type, time, event.sensorValues, dataStoredStatic);
        //if(this.showingData) {
        //    //alert(JSON.stringify(this.historicData));
        //    //this.historicData.timestamp.push(time);
        //    //this.historicData.values.push(event.sensorValues[0]);
        //    this.showGraph();
        //}
        (function(ev, rf) {
            storeData(rf.index, rf.type, time, ev.sensorValues, function(){
                if(rf.showingData) {
                    rf.showGraph();
                }
            });
        })(event, this);
    }


    graphHandler.prototype.selectGraph = function() {
        //this.historicData = retrieveData(this.index, this.type, this.isMom);
        retrieveData(this.index, this.type, this.isMom, selectGraphStatic, this);
    }


    graphHandler.prototype.selectGraph2 = function(result) {
        //alert('selectGraph2 - index is '+this.index+', type: '+this.type+', len is '+result.timestamp.length);
        //alert('index: '+this.index+', type: '+this.type);
        //this.historicData = retrieveData(this.index, this.type, this.isMom);
        this.historicData = result;
        this.showingData = true;
        //TODO At the moment a table is displayed; add more options for showing data
        // (ie type of graphs, time period selection, ...)
        var htmlCode = '';
        htmlCode += 'Showing data for '+this.description+'<br><br>';
        htmlCode += 'Start date: <input type=\'date\' id=\'graphStartDate\'><br>';
        htmlCode += 'End date: <input type=\'date\' id=\'graphEndDate\'><br>';
        htmlCode += 'View type: <select id=\'graphViewType\'>';
        if(googleAvailable) {
            htmlCode += '<option value=\'1\'>Graph</option>';
        }
        htmlCode += '<option value=\'0\'>Table</option>';
        htmlCode += '</select><br>';
        htmlCode += '<div id=\'dialog-content-graph\'></div>';
        $('#dialog-content').html(htmlCode);
        $('#dialog-container').fadeIn(1000);
        this.showGraph();
        (function(rf) {
            $('#graphStartDate').change(function() {
                rf.showGraph();
            });
        })(this);
        (function(rf) {
            $('#graphEndDate').change(function() {
                rf.showGraph();
            });
        })(this);
        (function(rf) {
            $('#graphViewType').change(function() {
                rf.showGraph();
            });
        })(this);
    }


    graphHandler.prototype.showGraph = function() {
        //alert('showGraph - 01');
        var startDate = new Date($('#graphStartDate').val());
        var endDate = new Date($('#graphEndDate').val());
        var viewType = $('#graphViewType').val();
        var data = graphFilter(this.historicData, startDate, endDate);
        //alert('showGraph - 01 - filter data len is '+data.timestamp.length);
        var htmlCode = '';
        if(viewType == 0) {
            //alert('showGraph - 03');
            htmlCode += '<table><tr><td>Date</td><td>Value</td></tr>';
            for(var i=0; i<data.timestamp.length; i++) {
                //htmlCode += '<tr><td>'+data.timestamp[i].toDateString()+'</td><td>'+data.values[i]+'</td></tr>';
                htmlCode += '<tr><td>'+data.timestamp[i].toString()+'</td><td>'+data.values[i]+'</td></tr>';
            }
            htmlCode += '</table>';
            $('#dialog-content-graph').html(htmlCode);
        }
        else if(viewType == 1) {
            var cdiv = $('#dialog-content-graph').get(0);
            var chart = new google.visualization.LineChart(cdiv);
            var go = {};
            var gd = new google.visualization.DataTable();
            gd.addColumn('date', 'Date');
            gd.addColumn('number', 'Value');
            for(var i=0; i<data.timestamp.length; i++) {
                gd.addRow([data.timestamp[i], data.values[i]]);
            }
            chart.draw(gd, go);
        }
        else {
            htmlCode += '<br>Sorry, not supported';
            $('#dialog-content-graph').html(htmlCode);
        }
    }


    graphHandler.prototype.stopButtonOn = function() {
        $('#'+this.mainDiv+'AcquireButton').val('Stop data acquisition');
        (function(mDiv, rf) {
            $('#'+mDiv+'AcquireButton').click(function() {
                stopDataAcquisition(rf);
            });
        })(this.mainDiv, this);
    }


    graphHandler.prototype.stopButtonOff = function() {
        $('#'+this.mainDiv+'AcquireButton').val('Acquire data');
        (function(mDiv, rf) {
            $('#'+mDiv+'AcquireButton').click(function() {
                rf.dataAcquisition();
            });
        })(this.mainDiv, this);
    }

}


function graphFilter(data, startDate, endDate) {
    //alert('graphFilter - data len is '+data.timestamp.length);
    var sd = startDate;
    var ed = endDate;
    if(!isValidDate(startDate)) {
        sd = new Date(1000, 0, 1);
    }
    if(!isValidDate(endDate)) {
        ed = new Date(4000, 11, 31);
    }
    var result = {};
    result.timestamp = new Array();
    result.values = new Array();
    for(var i=0; i<data.timestamp.length; i++) {
        //alert('graphFilter - check data '+i+', sd is '+sd+', ed is '+ed+', ts is '+data.timestamp[i]);
        if(data.timestamp[i] >= sd && data.timestamp[i] <= ed) {
            //alert('graphFilter - add data '+i);
            result.timestamp.push(data.timestamp[i]);
            result.values.push(data.values[i]);
        }
    }
    //alert('graphFilter - result len is '+result.timestamp.length);
    return result;
}


function isValidDate(d) {
    if(Object.prototype.toString.call(d) !== '[object Date]') {
        return false;
    }
    return (!isNaN(d.getTime()));
}


function selectServiceStatic(data, ref) {
    ref.selectService(data);
}


function selectGraphStatic(result, ref) {
    //alert('selectGraphStatic');
    ref.selectGraph2(result);
}


//function dataStoredStatic() {
//    //alert('dataStoredStatic');
//}


