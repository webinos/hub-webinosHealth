# hub-webinosHealth

A webinos hub application targeting real-time remote healthcare. It provides a solution to allow sharing personal health data between different users in a secure and reliable way. This solution is based on functionalities provided by [webinos](http://www.weinos.org/) platform. 

## Dependencies

* [webinos-pzp](https://github.com/webinos/webinos-pzp) 
* [quarqd-ext](https://github.com/ziransun/quarqd-ext)
* [webinos-driver-ant](https://github.com/ziransun/webinos-driver-ant)

## Setup & build Instruction

    git clone https://github.com/webinos/webinos-pzp
    cd webinos-pzp

open package.json in an editor, append the following lines in "dependencies" -
    
    "webinos-api-iot"           : "git://github.com/webinos/webinos-api-iot.git",
    "webinos-api-db"          : "git://github.com/webinos/webinos-api-db.git",

Now install all the npm modules in PZP -
  
    npm install

To have webinos-driver-ant installed -
  
    git clone https://github.com/ziransun/webinos-driver-ant/
    mv webinos-driver-ant ./node_modules/webinos-api-iot/node_modules/
    
To have quarqd-ext daemon built and run to support ant+ connectivity. README file has given instructions on daemon setup at 
  
    https://github.com/ziransun/quarqd-ext
    
Finally, add healthhub in  

    cd webinos_pzp/web_root
    git clone https://github.com/webinos/hub-webinosHealth
    

## Run HealthHub

#### Start quarqd-ext daemon

Please follow the README instruction in quarqd-ext

#### Start healthhub

    cd webinos_pzp
    node ./webinos_pzp

Load Chromium/Firefox Browser, open page

    http://localhost:8080/hub-webinosHealth/index.html
    
Select your profile. You are on your way.

    
    

