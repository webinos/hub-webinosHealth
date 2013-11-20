
function DbEmul(path, options) {

    //alert('DbEmul constructor: '+path);

    this.dirName = path;

    this.serviceHandle = null;
    this.dirHandle = null;

    //alert('DbEmul constructor - 05');
    this.connect = function(cbk) {
        //alert('DbEmul connect');
        (function(rf, cb) {
        webinos.discovery.findServices(
            new ServiceType('http://webinos.org/api/file'),
            {
                onFound: function(service) {
                    //alert(service.api);
                    //alert(service.id);
                    //alert(service.displayName);
                    //alert(service.description);
                    //alert(service.serviceAddress);
                    if(service.description.indexOf(rf.dirName) != -1) {
                        //alert('matched');
                        rf.serviceHandle = service;
                        //cbk(null);
                        service.bindService({
                            onBind: function() {
                                service.requestFileSystem(
                                    1, 1024,
                                    function (fs) {
                                        //loadDirectory(filesystem.root, side);
                                        //alert(JSON.stringify(fs.root));
                                        rf.dirHandle = fs;
                                        cbk(null);
                                    },
                                    function (error) {
                                        alert('Error requesting filesystem (#' + error.code + ')');
                                        cbk("No filesystem");
                                    }
                                );
                                //cbk(null);
                            },
                            onError: function() {
                                cbk("Cannot bind");
                            }
                        });
                    }
                    else {
                        //alert('not matched');
                    }
                }
            }
        );
        })(this, cbk);
    }

    this.collection = function(cName) {
        var tmp = new CollEmul(cName, this.dirHandle);
        return tmp;
    }

}


function CollEmul(cName, fs) {
    //alert('collection constructor - '+cName);

    this.fileName = cName;
    this.root = fs.root;
    this.fileHandle = null;

    this.find = function(options, cbk) {
        (function(rf, op, cb) {
            //alert(rf.fileName);
            rf.root.getFile(rf.fileName, null, function(f) {
                f.file(function(data) {
                        //alert('getFile ok');
                        //alert(JSON.stringify(data));
                        var myreader = new FileReader();
                        myreader.onload = function(e) {
                            //var tmp = new String(e.target.result);
                            //var res = JSON.parse(tmp);
                            if(e.target.result == null) {
                                //alert('res null');
                                cb('no data error', null);
                            }
                            if(e.target.result.length == 0) {
                                //alert('res 0');
                                cb('no data error', null);
                            }
                            var tmp = JSON.parse(e.target.result);
                            var res = null;
                            if(op == null) {
                                res = tmp;
                            }
                            else if(op.field == 'name') {
                                res = new Array();
                                res[0] = tmp[0];
                                res[0]['birthdate'] = new Date(tmp[0]['birthdate']);
                            }
                            else if(op.field == 'type') {
                                res = new Array();
                                var index = 0;
                                for(var j=1; j<tmp.length; j++) {
                                    if(tmp[j]['type'] == op.val) {
                                        res[index] = tmp[j];
                                        res[index]['ts'] = new Date(tmp[j]['ts']);
                                        index++;
                                    }
                                }
                            }
                            cb(null, res);
                        }
                        myreader.onerror = function(e) {
                            alert('read error!!!');
                            cb('error', null);
                        }
                        myreader.readAsText(data);
                    },
                    function(err){
                        alert(err);
                    }
                );
            });
        })(this, options, cbk);
    }


    this.insert = function(data, options, cbk) {
        //alert('coll insert');
        (function(rf, da, op, cb) {
            //alert(rf.fileName);
            rf.root.getFile(rf.fileName, null, function(f) {
                rf.fileHandle = f;
                f.file(function(data) {
                        //alert(JSON.stringify(data));
                        var myreader = new FileReader();
                        myreader.onload = function(e) {
                            var res;
                            if(e.target.result == null || e.target.result.length == 0) {
                                res = da;
                            }
                            else {
                                res = JSON.parse(e.target.result);
                                for(var j=0; j<da.length; j++) {
                                    if(da[j]['name'] != null) {
                                        res[0] = da[j];
                                    }
                                    else {
                                        res.push(da[j]);
                                    }
                                }
                            }
                            //for(var j=0; j<res.length; j++) {
                            //    alert('res '+j+': '+JSON.stringify(res[j]));
                            //}
                            rf.fileHandle.createWriter(function (writer){
                                    var bb = new Blob([JSON.stringify(res)]);
                                    writer.onwriteend = function(e) {
                                        //alert('file written!');
                                        cb(null, null);
                                    };
                                    writer.write(bb);
                                },
                                function(err) {
                                    alert('writer error');
                                }
                            );
                        }
                        myreader.onerror = function(e) {
                            //alert('read error!!!');
                            cb('error', null);
                        }
                        myreader.readAsText(data);
                    },
                    function(err){
                        alert(err);
                    }
                );
            });
        })(this, data, options, cbk);
    }

}


