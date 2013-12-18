
var serviceList;
var sensorData = new Array();
var remoteSensorData = new Array();
var dbEngine = null;

var dbRootDir = '__whh_';
var dbListDb = null;
var dbListColl = null;
var dbList = null;
var dbListMid = null;
var dbListMom = null;
var dbListIndex;
var babyList = null;
var babyDb = null;
var babyColl = null;
var momDb = null;
var momColl = null;
var remoteBabyDb = null;
var remoteBabyColl = null;

var queryMyBabyInfoCbk = null;
var storeMyBabyInfoCbk = null;
var storeMyBabyInfoData = null;

var queryMomInfoCbk = null;
var storeMomInfoCbk = null;
var storeMomInfoData = null;

var retrieveDataCbk = null;
var retrieveDataIndex = null;
var retrieveDataType = null;
var retrieveDataRef = null;
var retrieveDataIsMom = null;

var storeDataCbk = null;
var storeDataIndex = null;
var storeDataType = null;

var queryBabyInfoCbk = null;
var dbListMidIndex;
var babyListMid = null;

var mainDbService = null;
var mainDbColl = null;

var momDbService = null;
var momDbColl = null;

var mybabyDbService = new Array();
var mybabyDbColl = new Array();

var remotebabyDbService = null;
var remotebabyDbColl = null;


dbInit();

function createDbService(dbName, cbk) {
    var pars =  [{
        'params': {
            'db': dbName,
            'server': { 'engine': 'tingodb' }
        }
    }];

    webinos.dashboard
        .open({
            module: 'serviceSharing',
            data: {
                apiURI: 'http://webinos.org/api/db',
                params: { instances: pars }
            }
            }, function(){
                //alert('done');
            }
        )
        .onAction(function (data) {
            //alert('action done: '+JSON.stringify(data));
            cbk();
        });
}


function dbInit() {

    //alert('dbInit');
    if(dbList == null) {
        dbList = new Array();
    }
    whhFindServices(
        new ServiceType('http://webinos.org/api/db'),
        {
            onFound: function(service) {
                service.open(function(_db){
                    mainDbService = _db;
                    mainDbService.collection('list', function(_coll) {
                        mainDbColl = _coll;
                        mainDbColl.find({}, function(data) {
                            //alert('data: '+JSON.stringify(data));
                            for(var j=0; j<data.length; j++) {
                                if(data[j]['mother'] == 0) {
                                    dbListMom = data[j]['dbName'];
                                }
                                else if(data[j]['mother'] == 1) {
                                    dbList.push(data[j]['dbName']);
                                }
                            }
                        });
                    });
                });
            },
            onFinish: function() {
                if(mainDbService == null) {
                    //alert('db search finished: not found');
                    createDbService('__whh__list__', function() {
                        //alert('dbInit: main db created');
                    });

                }
            }
        },
        1000,
        {zone: 1, name: '__whh__list__'}
    );
}


function queryBabyInfo(cbk) {
    searchRemoteServices(function(){queryBabyInfo2(cbk)});
    //TODO queryBabyInfo2 should be called when searchRemoteServices is finished,
    // but there's no way to know it
    //setTimeout(function(){queryBabyInfo2(cbk)}, 5000);
}


function queryBabyInfo2(cbk) {
    //alert('queryBabyInfo - 01');
    if(queryBabyInfoCbk != null) {
        console.log('queryBabyInfo ERROR!!! - already called');
        cbk(null);
        return;
    }

    if(dbListMid) {
        //alert('queryBabyInfo - 03');
        //TODO Should check also mom db to retrieve mom info
/*
        remoteBabyDb = new Array();
        remoteBabyColl = new Array();
        queryBabyInfoCbk = cbk;
        dbListMidIndex = -1;
        babyListMid = new Array();
        queryBabyInfoFindCbk(null, null);
*/
        queryBabyInfoCbk = cbk;
        dbListMidIndex = -1;
        babyListMid = new Array();
        queryBabyInfoGetCollection();
    }
    else {
        cbk(null);
    }
}


function queryBabyInfoGetCollection() {
    dbListMidIndex++;
    if(dbListMidIndex < dbListMid.length) {
        remotebabyDbService[dbListMidIndex].open(function(_db){
            _db.collection('list', function(_coll) {
                remotebabyDbColl[dbListMidIndex] = _coll;
                queryBabyInfoFind();
            });
        });
    }
    else {
        var tmp = queryBabyInfoCbk;
        queryBabyInfoCbk = null;
        tmp(babyListMid);
    }
}


function queryBabyInfoFind() {
    remotebabyDbColl[dbListMidIndex].find({name:{$exists: true}}, function(data) {
        //alert('queryBabyInfoFind - data: '+JSON.stringify(data));
        var babyInfo = {};
        if(data.length > 0) {
            babyInfo.name = data[data.length-1]['name'];
            babyInfo.surname = data[data.length-1]['surname'];
            babyInfo.birthdate = new Date(data[data.length-1]['birthdate']);
        }
        babyListMid.push(babyInfo);
        queryBabyInfoGetCollection();
    });
}


/*
function queryBabyInfoFindCbk(err, result) {
    //alert('queryBabyInfoFindCbk - 01');
    dbListMidIndex++;
    if(err == null && result != null) {
        //alert('queryBabyInfoFindCbk - 02');
        var babyInfo = {};
        babyInfo.name = result[0]['name'];
        babyInfo.surname = result[0]['surname'];
        babyInfo.birthdate = result[0]['birthdate'];
        //babyInfo.index = result[0]['index'];
        babyListMid.push(babyInfo);
    };
    if(dbListMidIndex < dbListMid.length) {
        //alert('queryBabyInfoFindCbk - 05');
        //TODO Connect to remote db and handle error in case it is unavailable
        //var babyDb = new dbEngine.Db(dbRootDir+dbListMid[dbListMidIndex], {});
        //var babyColl = babyDb.collection('data');
        //babyColl.find({name:{$exists: true}}).toArray(queryBabyInfoFindCbk);
        //remoteBabyDb[dbListMidIndex] = new DbEmul(dbRootDir+dbListMid[dbListMidIndex], {});
        remoteBabyDb[dbListMidIndex] = new DbEmul(dbListMid[dbListMidIndex].description, dbListMid[dbListMidIndex].serviceAddress, {});
        remoteBabyDb[dbListMidIndex].connect(queryBabyInfoFindCbk2);

    }
    else {
        //alert('queryBabyInfoFindCbk - 08 - len is '+babyListMid.length);
        var tmp = queryBabyInfoCbk;
        queryBabyInfoCbk = null;
        tmp(babyListMid);
    }
}


function queryBabyInfoFindCbk2(err) {
    if(err == null) {
        remoteBabyColl[dbListMidIndex] = remoteBabyDb[dbListMidIndex].collection('data');
        remoteBabyColl[dbListMidIndex].find({field:'name'}, queryBabyInfoFindCbk);
    }
    else {
        queryBabyInfoFindCbk(null, null);
    }
}
*/

function queryMyBabyInfo(cbk) {
    //alert('queryMyBabyInfo');
    if(queryMyBabyInfoCbk != null) {
        console.log('queryMyBabyInfo ERROR!!! - already called');
        cbk(null);
        return;
    }

    if(dbList) {
        //cbk(null);
        //return;
        //alert('queryMyBabyInfo - 03');
        queryMyBabyInfoCbk = cbk;
        dbListIndex = -1;
        babyList = new Array();
        queryMyBabyInfoGetService();
        //queryMyBabyInfoFindCbk(null, null);
        //alert('queryMyBabyInfo - 05');
    }
    else {
        cbk(null);
        //return result;
    }

}


function queryMyBabyInfoGetService() {
    dbListIndex++;
    if(dbListIndex < dbList.length) {
        if(mybabyDbService[dbListIndex] == null) {
            whhFindServices(
                new ServiceType('http://webinos.org/api/db'),
                {
                    onFound: function(service) {
                        mybabyDbService[dbListIndex] = service;
                        service.open(function(_db){
                            _db.collection('list', function(_coll) {
                                mybabyDbColl[dbListIndex] = _coll;
                                queryMyBabyInfoFind();
                            });
                        });
                    },
                    onFinish: function() {
/*
                        if(mybabyDbService[dbListIndex] == null) {
                            //baby db service non found - this should not happen
                            //add empty data to result and move to next
                            var babyInfo = {};
                            babyInfo.name = 'Noname';
                            babyInfo.surname = 'Nosurname';
                            babyInfo.birthdate = new Date();
                            babyInfo.index = dbListIndex;
                            babyList[babyInfo.index] = babyInfo;
                            queryMyBabyInfoGetService();
                        }
*/
                    }
                },
                1000,
                {zone: 1, name: dbList[dbListIndex]}
            );
        }
        else {
            queryMyBabyInfoFind();
        }
    }
    else {
        //Finished - return result
        var tmp = queryMyBabyInfoCbk;
        queryMyBabyInfoCbk = null;
        tmp(babyList);
    }
}


function queryMyBabyInfoFind() {
    mybabyDbColl[dbListIndex].find({name:{$exists: true}}, function(data) {
        //alert('queryMyBabyInfoFind - data: '+JSON.stringify(data));
        var babyInfo = {};
        if(data.length > 0) {
            babyInfo.name = data[data.length-1]['name'];
            babyInfo.surname = data[data.length-1]['surname'];
            babyInfo.birthdate = new Date(data[data.length-1]['birthdate']);
            babyInfo.index = data[data.length-1]['index'];
        }
        babyList[babyInfo.index] = babyInfo;
        queryMyBabyInfoGetService();
    });
}


function storeMyBabyInfo(index, bi, cbk) {
    //alert('storeMyBabyInfo - index is '+index);
    if(storeMyBabyInfoCbk != null) {
        alert('storeMyBabyInfo ERROR: in progress');
        cbk();
        return;
    }

    storeMyBabyInfoCbk = cbk;
    storeMyBabyInfoData = {};
    storeMyBabyInfoData.name = bi.name;
    storeMyBabyInfoData.surname = bi.surname;
    storeMyBabyInfoData.birthdate = bi.birthdate;
    storeMyBabyInfoData.index = index;

    if(index == -1) {
        //TODO is creating a new baby: should add a service for it...
        //var newDbName = name+index;
        //dbListColl.insert([{mother: 1, dbname:newDbName}], {}, storeMyBabyInfoAdd1Cbk);
        storeMyBabyInfoData.index = mybabyDbService.length;
        var newDbName = '__whh__'+storeMyBabyInfoData.name+storeMyBabyInfoData.index;
        mainDbColl.insert({dbName: newDbName, mother: 1});
        createDbService(newDbName, function() {
            //TODO: cbk should be called here...
            //storeMyBabyInfoGetService();
        });
        dbList[storeMyBabyInfoData.index] = newDbName;
        setTimeout(storeMyBabyInfoGetService, 5000);
    }
    else {
        //Updating baby info
        storeMyBabyInfoInsert();
    }
}


function storeMyBabyInfoGetService() {

    whhFindServices(
        new ServiceType('http://webinos.org/api/db'),
        {
            onFound: function(service) {
                mybabyDbService[storeMyBabyInfoData.index] = service;
                service.open(function(_db){
                    _db.collection('list', function(_coll) {
                        mybabyDbColl[storeMyBabyInfoData.index] = _coll;
                        storeMyBabyInfoInsert();
                    });
                });
            },
            onFinish: function() {
            }
        },
        1000,
        {zone: 1, name: dbList[storeMyBabyInfoData.index]}
    );

}


function storeMyBabyInfoInsert() {
    mybabyDbColl[storeMyBabyInfoData.index].insert({name: storeMyBabyInfoData.name, surname: storeMyBabyInfoData.surname, birthdate: storeMyBabyInfoData.birthdate, index: storeMyBabyInfoData.index});
}


function queryMomInfo(cbk) {
    //alert('queryMomInfo');
    if(queryMomInfoCbk != null) {
        alert('queryMomInfo ERROR!!! - already called');
        cbk(null);
        return;
    }

    queryMomInfoCbk = cbk;
    if(dbListMom == null) {
        //create mom db and return null
        mainDbColl.insert({dbName: '__whh__mom__', mother: 0});
        dbListMom = '__whh__mom__';
    }
    if(momDbService == null) {
        whhFindServices(
            new ServiceType('http://webinos.org/api/db'),
            {
                onFound: function(service) {
                    service.open(function(_db){
                        momDbService = _db;
                        momDbService.collection('list', function(_coll) {
                            momDbColl = _coll;
                            queryMomInfoFind();
                        });
                    });
                },
                onFinish: function() {
                    if(momDbService == null) {
                        //mom db service non found...
                        createDbService('__whh__mom__', function() {
                            alert('mom db created');
                            //TODO: cbk should be called here...
                            //cbk(null);
                        });
                        cbk(null);
                    }
                }
            },
            1000,
            {zone: 1, name: dbListMom}
        );
    }
    else {
        //alert('mom db: '+dbListMom);
        queryMomInfoFind();
    };
}


function queryMomInfoFind() {
    //alert('queryMomInfoFind');
    momDbColl.find({name:{$exists: true}}, function(data) {
        var momData = null;
        //alert('queryMomInfoFind - data: '+JSON.stringify(data));
        if(data.length > 0) {
            momData = {};
            momData.name = data[data.length-1]['name'];
            momData.surname = data[data.length-1]['surname'];
            momData.birthdate = new Date(data[data.length-1]['birthdate']);
        }
        //alert('queryMomInfoFind - data is '+JSON.stringify(momData));
        var tmp = queryMomInfoCbk;
        queryMomInfoCbk = null;
        tmp(momData);
    });
}


function storeMomInfo(mi, cbk) {
    //alert('storeMomInfo - 01: '+JSON.stringify(mi));
    if(storeMomInfoCbk != null) {
        alert('storeMomInfo ERROR: in progress');
        cbk();
        return;
    }

    //storeMomInfoCbk = cbk;
    storeMomInfoData = {};
    storeMomInfoData.name = mi.name;
    storeMomInfoData.surname = mi.surname;
    storeMomInfoData.birthdate = mi.birthdate;

    //momDbColl.insert({dbName: '__whh__mom__', mother: 0});
    momDbColl.insert({name: storeMomInfoData.name, surname: storeMomInfoData.surname, birthdate: storeMomInfoData.birthdate});
    cbk();
}


function storeData(index, type, timestamp, sensorValues, cbk) {
    //TODO Store acquired data in the correct db
    //alert('Storing data for baby '+index);
    //alert('Storing data for baby '+index+' and sensor '+sensorType+': '+timestamp.toDateString()+' - '+sensorValues[0]);

    if(storeDataCbk) {
        //A store data is in progress - return
        alert('error - store in progress');
        cbk(null);
        return;
    }

    if(sensorData[index] == null) {
        sensorData[index] = new Array();
    }
    if(sensorData[index][type] == null) {
        sensorData[index][type] = {};
        sensorData[index][type].timestamp = new Array();
        sensorData[index][type].values = new Array();
    }
    sensorData[index][type].timestamp.push(timestamp);
    sensorData[index][type].values.push(sensorValues[0]);

    if(index == -1) {
        //storeDataCbk = cbk;
        momDbColl.insert({ts: timestamp, val: sensorValues[0], type: type});
    }
    else if (babyList[index]) {
/*
        var babyDb = new dbEngine.Db(dbRootDir+babyList[index].name+index, {});
        var babyColl = babyDb.collection('data');
        storeDataCbk = cbk;
        storeDataIndex = index;
        storeDataType = type;
*/
        mybabyDbColl[index].insert({ts: timestamp, val: sensorValues[0], type: type});
    }
    //alert('Storing data end');

}


function retrieveData(index, type, isMom, cbk, rf) {
    //alert('retrieveData - 01 - index is '+index+', isMom is '+isMom);
    //TODO if isMom == false data should be retrieved from remote db
    //for(var j=0; j<babyList.length; j++) {
    //    alert('baby '+j+', name: '+babyList[j].name);
    //}

    //alert('retrieveData');
    if(retrieveDataCbk) {
        //A retrieve data is in progress - return
        alert('error - retrieve in progress');
        cbk(null);
        return;
    }

    if(!isMom) {
        //alert('retrieveData - 03');
        if(remoteSensorData[index] == null) {
            remoteSensorData[index] = new Array();
        }
        //if(remoteSensorData[index][type] == null) {
            //TODO in case of midwife retrieve data from remote db...
            //alert('midwife call');
            //cbk(null);
            //return;
            retrieveDataCbk = cbk;
            retrieveDataIndex = index;
            retrieveDataType = type;
            retrieveDataRef = rf;
            retrieveDataIsMom = isMom;
            remoteBabyColl[index].find({field:'type',val:type}, retrieveDataFindCbk);
            return;
        //}
    }

    //alert('retrieveData - 03');

    if(sensorData[index] == null) {
        sensorData[index] = new Array();
    }
    if(sensorData[index][type] == null) {
        //alert('retrieveData - 04');
        if(index == -1) {
            //TODO retrieve data from mom db
            //alert('retrieveData - 05');
            //var momDb = new dbEngine.Db(dbRootDir+'mom', {});
            //var momColl = momDb.collection('data');
            retrieveDataCbk = cbk;
            retrieveDataIndex = index;
            retrieveDataType = type;
            retrieveDataRef = rf;
            retrieveDataIsMom = isMom;
            //momColl.find({type:type}).toArray(retrieveDataFindCbk);
            momDbColl.find({type:type}, retrieveDataFindCbk);
            return;
        }
        else if (babyList[index]) {
            //alert('retrieveData - 06');
            //var babyDb = new dbEngine.Db(dbRootDir+babyList[index].name+index, {});
            //var babyColl = babyDb.collection('data');
            retrieveDataCbk = cbk;
            retrieveDataIndex = index;
            retrieveDataType = type;
            retrieveDataRef = rf;
            retrieveDataIsMom = isMom;
            mybabyDbColl[index].find({type:type}, retrieveDataFindCbk);
            return;
        }
        else {
            alert('Error!');
            //sensorData[index][type] = generateRndData();
        }
    }
    //alert('retrieveData - 08');
    cbk(sensorData[index][type], rf);
}


function retrieveDataFindCbk(data) {
    //alert('retrieveDataFindCbk - data len is '+data.length);
    if(data.length > 0) {
        //alert('retrieveDataFindCbk - 05');
        var tmp = {};
        tmp.timestamp = new Array();
        tmp.values = new Array();
        //alert('retrieveDataFindCbk - 06');
        for(var j=0; j<data.length; j++) {
            tmp.timestamp[j] = new Date(data[j].ts);
            tmp.values[j] = data[j].val;
        }
        //alert('retrieveDataFindCbk - 07');
        if(retrieveDataIsMom) {
            //alert('retrieveDataFindCbk - 071');
            sensorData[retrieveDataIndex][retrieveDataType] = tmp;
        }
        else {
            //alert('retrieveDataFindCbk - 072');
            remoteSensorData[retrieveDataIndex][retrieveDataType] = tmp;
        }
        //alert('retrieveDataFindCbk - 075');
    }
    //alert('retrieveDataFindCbk - 08');
    var tmp = retrieveDataCbk;
    retrieveDataCbk = null;
    if(retrieveDataIsMom) {
        tmp(sensorData[retrieveDataIndex][retrieveDataType], retrieveDataRef);
    }
    else {
        tmp(remoteSensorData[retrieveDataIndex][retrieveDataType], retrieveDataRef);
    }
    //alert('retrieveDataFindCbk - 09');
}


function getServiceId(babyId) {
    //TODO returns the service id connected to this baby
    //return(babyDb[babyId].getServiceId());
    return(mybabyDbService[babyId].id);
}


function searchRemoteServices(cbk) {
    //alert('searchRemoteServices');
    dbListMid = new Array();
    remotebabyDbService = new Array();
    remotebabyDbColl = new Array();

    whhFindServices(
        new ServiceType('http://webinos.org/api/db'),
        {
            onFound: function(service) {
                if(service.description.indexOf('__whh__list__') == -1 && service.description.indexOf('__whh__mom__') == -1) {
                    //alert('matched: '+service.id);
                    var tmp = {};
                    tmp.serviceAddress = service.serviceAddress;
                    tmp.description = service.description;
                    dbListMid.push(tmp);
                    remotebabyDbService.push(service);
                }
                else {
                    //alert('not matched');
                }
            },
            onFinish: function() {
                //alert('search finished');
                cbk();
            }
        },
        4000,
        {zone: 2, name: '__whh__'}
    );

}


