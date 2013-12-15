
function whhFindServices(serviceType, callbacks, timeout) {
    var timedOut = false;

    function findTimedOut() {
        timedOut = true;
        callbacks.onFinish();
    }

    var timeoutHandle = setTimeout(findTimedOut, timeout);

    webinos.discovery.findServices(serviceType, {
        onFound: function(service) {
            if(!timedOut) {
                callbacks.onFound(service);
            }
            else {
                //alert('service found after timeout');
                console.log('whhFindServices: service found after timeout');
            }
        }
    });
    
}


