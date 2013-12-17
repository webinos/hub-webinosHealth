
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


//dbListDb = new DbEmul('__whh_list', webinos.session.getPZHId(), {});
//dbListDb.connect(connCbk);

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
                        alert('dbInit: main db created');
                    });

                }
            }
        },
        1000,
        {zone: 1, name: '__whh__list__'}
    );
}


/*
function connCbk(err) {
    //alert('connCbk - err is '+null);
    dbListColl = dbListDb.collection('list');
//    dbListColl.find({}).toArray(dbListFound);
    dbListColl.find(null, dbListFound);
}


function dbListFound(err, result) {
    //alert('dbListFound: '+result);
    if(err == null) {
        //alert('retrieved lists: '+result.length);
        if(result.length > 0) {
            //for(var j=0; j<result.length; j++) {
            //    alert('baby db found: '+JSON.stringify(result[j]));
            //}
            dbList = new Array();
            //dbListMid = new Array();
            dbListMom = new Array();
            babyDb = new Array();
            babyColl = new Array();
            for(var i=0; i< result.length; i++) {
                if(result[i]['mother'] == 1) {
                    //alert('mother baby: '+result[i]['dbname']);
                    dbList.push(result[i]['dbname']);
                }
                else if(result[i]['mother'] == 2) {
                    //alert('midwife baby: '+result[i]['dbname']);
                    //Handle midwife db list
                    //dbListMid.push(result[i]['dbname']);
                }
                else {
                    dbListMom.push(result[i]['dbname']);
                    //alert('mom db');
                }
            }
            //for(var j=0; j<dbList.length; j++) {
            //    alert('baby db found: '+dbList[j]);
            //}
        }
    }
    else {
        alert('retrieve lists error: '+err);
    }
}
*/

function queryBabyInfo(cbk) {
    searchRemoteServices();
    //TODO queryBabyInfo2 should be called when searchRemoteServices is finished,
    // but there's no way to know it
    setTimeout(function(){queryBabyInfo2(cbk)}, 1000);
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
        remoteBabyDb = new Array();
        remoteBabyColl = new Array();
        queryBabyInfoCbk = cbk;
        dbListMidIndex = -1;
        babyListMid = new Array();
        queryBabyInfoFindCbk(null, null);
    }
    else {
/*
        var result = new Array();

        //TODO remove this part - it's temporary while baby list is not saved somewhere...
        var babyInfo = {};
        babyInfo.name = 'Gollum';
        babyInfo.surname = 'Gollum';
        babyInfo.birthdate = new Date(2013, 2, 12);
        babyInfo.motherName = 'Elizabeth';
        babyInfo.motherSurname = 'Fuller';
        babyInfo.motherBirthdate = new Date(1952, 3, 5);
        result.push(babyInfo);

        babyInfo = {};
        babyInfo.name = 'Sam';
        babyInfo.surname = 'Gamgee';
        babyInfo.birthdate = new Date(2012, 11, 7);
        babyInfo.motherName = 'Vilma';
        babyInfo.motherSurname = 'Truman';
        babyInfo.motherBirthdate = new Date(1973, 8, 26);
        result.push(babyInfo);

        babyInfo = {};
        babyInfo.name = 'Pippin';
        babyInfo.surname = 'Took';
        babyInfo.birthdate = new Date(2012, 4, 28);
        babyInfo.motherName = 'Ada';
        babyInfo.motherSurname = 'Berthod';
        babyInfo.motherBirthdate = new Date(1986, 1, 9);
        result.push(babyInfo);
        cbk(result);
*/
        cbk(null);
    }
}


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
                        service.open(function(_db){
                            mybabyDbService[dbListIndex] = _db;
                            mybabyDbService[dbListIndex].collection('list', function(_coll) {
                                mybabyDbColl[dbListIndex] = _coll;
                                queryMyBabyInfoFind();
                            });
                        });
                    },
                    onFinish: function() {
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
        var babyInfo = {};
        babyInfo.name = data[0]['name'];
        babyInfo.surname = data[0]['surname'];
        babyInfo.birthdate = new Date(data[0]['birthdate']);
        babyInfo.index = data[0]['index'];
        babyList[babyInfo.index] = babyInfo;
        queryMyBabyInfoGetService();
    });
}


/*
function queryMyBabyInfoFindCbk(err, result) {
    //alert('queryMyBabyInfoFindCbk - err is '+err);
    //alert('queryMyBabyInfoFindCbk - err is '+err+' - result is '+result);
    //alert('queryMyBabyInfoFindCbk - index is '+dbListIndex+' - res length so far is '+babyList.length);
    //if(result) {
    //for(var j=0; j<result.length; j++) {
    //    alert(JSON.stringify(result[j]));
    //}
    //}
    dbListIndex++;
    if(err == null && result != null) {
        //alert('queryMyBabyInfoFindCbk - 03');
        var babyInfo = {};
        babyInfo.name = result[0]['name'];
        babyInfo.surname = result[0]['surname'];
        babyInfo.birthdate = result[0]['birthdate'];
        babyInfo.index = result[0]['index'];
        //babyList.push(babyInfo);
        babyList[babyInfo.index] = babyInfo;
    };
    if(dbListIndex < dbList.length) {
        //var babyDb = new dbEngine.Db(dbRootDir+dbList[dbListIndex], {});
        //var babyColl = babyDb.collection('data');
        //babyColl.find({name:{$exists: true}}).toArray(queryMyBabyInfoFindCbk);
        //alert('queryMyBabyInfoFindCbk, dbListIndex='+dbListIndex+', name='+dbList[dbListIndex]);
        babyDb[dbListIndex] = new DbEmul(dbRootDir+dbList[dbListIndex], webinos.session.getPZHId(), {});
        babyDb[dbListIndex].connect(queryMyBabyInfoFindCbk2);
        //var babyColl = babyDb.collection('data');
        //babyColl.find({name:{$exists: true}}).toArray(queryMyBabyInfoFindCbk);
    }
    else {
        //alert('queryMyBabyInfoFindCbk - 09 - len is '+babyList.length);
        var tmp = queryMyBabyInfoCbk;
        queryMyBabyInfoCbk = null;
        tmp(babyList);
    }
}


function queryMyBabyInfoFindCbk2(err) {
    //alert('queryMyBabyInfoFindCbk2');
    babyColl[dbListIndex] = babyDb[dbListIndex].collection('data');
    babyColl[dbListIndex].find({field:'name'}, queryMyBabyInfoFindCbk);
    //babyColl.find(null, queryMyBabyInfoFindCbk);
    //babyColl.find({name:{$exists: true}}).toArray(queryMyBabyInfoFindCbk);
}
*/


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
                service.open(function(_db){
                    mybabyDbService[storeMyBabyInfoData.index] = _db;
                    mybabyDbService[storeMyBabyInfoData.index].collection('list', function(_coll) {
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

/*
function storeMyBabyInfoAdd1Cbk(err, result) {
    //alert('storeMyBabyInfoAdd1Cbk - index is '+storeMyBabyInfoData.index);
    //TODO Here should create a new db service for the new baby
    babyColl[storeMyBabyInfoData.index].insert([{name: storeMyBabyInfoData.name, surname: storeMyBabyInfoData.surname, birthdate: storeMyBabyInfoData.birthdate, index: storeMyBabyInfoData.index}], {}, storeMyBabyInfoAdd2Cbk);
}


function storeMyBabyInfoAdd2Cbk(err, result) {
    alert('storeMyBabyInfoAdd2Cbk');
    var tmp = storeMyBabyInfoCbk;
    storeMyBabyInfoCbk = null;
    tmp();
    //TODO: is this ok? Or should call callback on return of dbListColl.find????
    //dbListColl.find({}).toArray(dbListFound);
}
*/

function queryMomInfo(cbk) {
    //alert('queryMomInfo');
    if(queryMomInfoCbk != null) {
        alert('queryMomInfo ERROR!!! - already called');
        cbk(null);
        return;
    }

    queryMomInfoCbk = cbk;
/*
    momDb = new DbEmul(dbRootDir+'mom', webinos.session.getPZHId(), {});
    momDb.connect(queryMomInfoFindCbk);
    //var momDb = new dbEngine.Db(dbRootDir+'mom', {});
    //var momColl = momDb.collection('data');
    //momColl.find({name:{$exists: true}}).toArray(queryMomInfoFindCbk);
//*/
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
    //momDbColl.find({}, function(data) {
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


/*
function queryMomInfoFindCbk(err, result) {
    //alert('queryMomInfoFindCbk');
    if(err == null) {
        momColl = momDb.collection('data');
        //momColl.find({name:{$exists: true}}).toArray(queryMomInfoFindCbk);
        momColl.find({field:'name'}, queryMomInfoFindCbk2);
    }
    else {
        alert('queryMomInfoFindCbk - error');
    }
}


function queryMomInfoFindCbk2(err, result) {
    //alert('queryMomInfoFindCbk2');
    //alert('queryMomInfoFindCbk2 - err is '+err+' - res is '+JSON.stringify(result)+' - res len is '+result.length);
    //alert('queryMomInfoFindCbk2: '+JSON.stringify(result));
    var momData = null;

    if(err == null && result != null && result.length > 0) {
        //alert('queryMomInfoFindCbk - res found');
        momData = {};
        momData.name = result[0]['name'];
        momData.surname = result[0]['surname'];
        momData.birthdate = result[0]['birthdate'];
    }
    else {
        //alert('queryMomInfoFindCbk - res not found');
        //momData.name = 'Nicole';
        //momData.surname = 'Letterman';
        //momData.birthdate = new Date(77, 11, 19);
    }
    var tmp = queryMomInfoCbk;
    queryMomInfoCbk = null;
    tmp(momData);
}
*/


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
/*
    //alert('dbListMom len is '+dbListMom.length+' - '+dbListMom[0]);
    if(dbListMom.length == 0) {
        //TODO verify if this branch works ok
        dbListMom[0] = 'mom';
        var newDbName = 'mom';
        dbListColl.insert([{mother: 0, dbname:newDbName}], {}, storeMomInfoAdd1Cbk);
    }
    else {
        storeMomInfoAdd1Cbk(null, null);
    };
*/
}

/*
function storeMomInfoAdd1Cbk(err, result) {
    //alert('storeMomInfoAdd1Cbk');
    //TODO Here should create a new db service for the new baby
    //var momDb = new dbEngine.Db(dbRootDir+'mom', {});
    //var momColl = momDb.collection('data');
    //momColl.insert([{name: storeMomInfoData.name, surname: storeMomInfoData.surname, birthdate: storeMomInfoData.birthdate}], {}, storeMomInfoAdd2Cbk);
    momColl.insert([{name: storeMomInfoData.name, surname: storeMomInfoData.surname, birthdate: storeMomInfoData.birthdate}], {}, storeMomInfoAdd2Cbk);
}


function storeMomInfoAdd2Cbk(err, result) {
    //alert('storeMomInfoAdd2Cbk');
    var tmp = storeMomInfoCbk;
    storeMomInfoCbk = null;
    tmp();
    //dbListColl.find({}).toArray(dbListFound);
}
*/


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

/*
function storeDataAddCbk(err, result) {
    //alert('storeDataAddCbk - end');
    var tmp = storeDataCbk;
    storeDataCbk = null;
    tmp();
}
*/

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

/*
function retrieveDataFindCbk(err, result) {
    //alert('retrieveDataFindCbk - err is '+err);
    //for(var j=0; j<result.length; j++) {
    //    alert(j+': '+JSON.stringify(result[j]));
    //}
    if(err == null && result.length > 0) {
        //alert('retrieveDataFindCbk - 05');
        var tmp = {};
        tmp.timestamp = new Array();
        tmp.values = new Array();
        //alert('retrieveDataFindCbk - 06');
        for(var j=0; j<result.length; j++) {
            tmp.timestamp[j] = result[j].ts;
            tmp.values[j] = result[j].val;
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
    else if(err != null) {
        alert('retrieveDataFindCbk - error: '+err);
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
*/
/*
function generateRndData() {
    var result = {};
    result.timestamp = new Array();
    result.values = new Array();

    //TODO Should query db to retrieve data
    //Generating some random values for test
    var now = new Date();
    var rndYear = now.getFullYear();
    var rndMonth = now.getMonth();
    var rndDay = now.getDate();
    var rndH = now.getHours();
    var rndm = now.getMinutes();
    //alert('start date: year '+rndYear+', month '+rndMonth+', day '+rndDay);
    var rndVal = Math.floor(Math.random()*20)+20;
    var incm, incVal;
    for(var i=0; i<80; i++) {
        incm = Math.floor(Math.random()*1000)+1;
        incVal = Math.floor(Math.random()*5)-2;
        rndm -= incm;
        while(rndm < 0) {
            rndm += 60;
            rndH--;
        }
        if(rndH < 0) {
            rndH += 24;
            rndDay--;
            if(rndDay < 1) {
                rndDay = 28;
                rndMonth -= 1;
                if(rndMonth < 0) {
                    rndMonth = 11;
                    rndYear -= 1;
                }
            }
        }
        rndVal += incVal;
        result.timestamp.unshift(new Date(rndYear, rndMonth, rndDay, rndH, rndm, 0));
        result.values.push(rndVal);
    }
    return result;
}
*/

function getServiceId(babyId) {
    //TODO returns the service id connected to this baby
    return(babyDb[babyId].getServiceId());
}


function searchRemoteServices() {
    //alert('searchRemoteServices');
    //alert(webinos.session.getSessionId());
    //alert(webinos.session.getPZPId());
    //alert(webinos.session.getPZHId());
    //alert(webinos.session.getConnectedPzh());
    //alert(webinos.session.getConnectedPzp());
    dbListMid = new Array();

/*
    webinos.discovery.findServices(
        new ServiceType('http://webinos.org/api/file'),
        {
            onFound: function(service) {
                //alert(service.api);
                //alert(service.id);
                //alert(service.displayName);
                //alert(service.description);
                //alert(service.serviceAddress);
                if(service.description.indexOf('__whh_') != -1 && service.description.indexOf('__whh_list') == -1 && service.description.indexOf('__whh_mom') == -1) {
                    if(service.serviceAddress.indexOf(webinos.session.getPZHId()) == -1) {
                        //alert('matched: '+service.serviceAddress);
                        //alert('matched: '+service.description);
                        //alert('matched: '+service.id);
                        var tmp = {};
                        tmp.serviceAddress = service.serviceAddress;
                        tmp.description = service.description;
                        dbListMid.push(tmp);
                        //service.bindService({
                        //    onBind: function() {
                        //    },
                        //    onError: function() {
                        //        cbk('Cannot bind');
                        //    }
                        //});
                    }
                }
                else {
                    //alert('not matched');
                }
            }
        }
    );
*/
    whhFindServices(
        new ServiceType('http://webinos.org/api/file'),
        {
            onFound: function(service) {
                if(service.description.indexOf('__whh_') != -1 && service.description.indexOf('__whh_list') == -1 && service.description.indexOf('__whh_mom') == -1) {
                    if(service.serviceAddress.indexOf(webinos.session.getPZHId()) == -1) {
                        //alert('matched: '+service.serviceAddress);
                        //alert('matched: '+service.description);
                        //alert('matched: '+service.id);
                        var tmp = {};
                        tmp.serviceAddress = service.serviceAddress;
                        tmp.description = service.description;
                        dbListMid.push(tmp);
                    }
                }
                else {
                    //alert('not matched');
                }
            },
            onFinish: function() {
                alert('search finished');
            }
        },
        10000,
        {zone: 1, name: dbListMom}
    );

}


