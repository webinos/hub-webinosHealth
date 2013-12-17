
// This function filters results of findService and returns service already bound
// filter.zone = 0 --> local to pzp
// filter.zone = 1 --> local to pzh
// filter.zone = 2 --> remote
// filter.zone = -1 --> no constraint
// filter.name --> match service including this string in displayName

function whhFindServices(serviceType, callbacks, timeout, filter) {
    var timedOut = false;
    var zone = -1;
    var filterName = null;
    if(filter) {
        if(filter.zone) {
            zone = filter.zone;
        }
        if(filter.name) {
            filterName = filter.name;
        }
    }
    //alert('whhFindServices - zone is '+zone+', name is '+filterName);

    function findTimedOut() {
        timedOut = true;
        callbacks.onFinish();
    }

    var timeoutHandle = setTimeout(findTimedOut, timeout);

    webinos.discovery.findServices(serviceType, {
        onFound: function(service) {
            //alert('whhFindServices - found - 01');
            if(zone == 0 && service.serviceAddress.indexOf(webinos.session.getPZPId()) == -1) {
                //alert('whhFindServices - found - 02');
                return;
            }
            if(zone == 1 && service.serviceAddress.indexOf(webinos.session.getPZHId()) == -1) {
                //alert('whhFindServices - found - 03');
                return;
            }
            if(zone == 2 && service.serviceAddress.indexOf(webinos.session.getPZHId()) != -1) {
                //alert('whhFindServices - found - 04');
                return;
            }
            if(filterName) {
                if(service.displayName.indexOf(filterName) == -1) {
                    //alert('whhFindServices - found - 05');
                    return;
                }
            }
            if(!timedOut) {
                //alert('whhFindServices - found - 06');
                service.bindService({
                    onBind: function() {
                        //alert('whhFindServices - found - 08');
                        callbacks.onFound(service);
                    }
                });
            }
            else {
                //alert('service found after timeout');
                console.log('whhFindServices: service found after timeout');
            }
        }
    });
    
}

