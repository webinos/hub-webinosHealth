
function connectToBaby(babyName, motherName) {
    //TODO Connect to the pzh of mother and ask service sharing of baby db
    // Likely this func is async and can take long time to end - how to handle this???
    //alert('Connect to baby '+babyName+' and mom '+motherName);

    webinos.dashboard
        .open({
                module: 'people'
            }, function(){
                //alert('done');
                }
        )
        .onAction(function (data) {
            alert('action done: '+JSON.stringify(data));
        });

    //TODO This should also add to the main db an entry with the new connected baby
}


function shareBabyData(babyId) {
    //TODO should open policy editor to grant permission to midwifie
    var sid = getServiceId(babyId);
    //alert('service id to share is '+sid);

    webinos.dashboard
        .open({
                module: 'simplifiedpolicyeditor',
                data: {
                    apiURI: 'http://webinos.org/api/db',
                    serviceId: sid
                }
            }, function(){
                //alert('done');
                }
        )
        .onAction(function (data) {
            alert('action done: '+JSON.stringify(data));
        });

}


function checkConnReq() {

    webinos.dashboard
        .open({
                module: 'people'
            }, function(){
                //alert('done');
                }
        )
        .onAction(function (data) {
            alert('action done: '+JSON.stringify(data));
        });

}


function shareSensors() {
    webinos.dashboard
        .open({
                module: 'simplifiedpolicyeditor',
                data: {
                    apiURI: 'http://webinos.org/api/sensors/*'
                }
            }, function(){
                //alert('done');
                }
        )
        .onAction(function (data) {
            //alert('action done: '+JSON.stringify(data));
        });

}

