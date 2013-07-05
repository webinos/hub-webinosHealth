
var myBabyCount = 0;
var otherBabyCount = 0;

// tabList is an array of objects including the following attributes:
// -tabId: it's the id of the tab
// -displayName: it's the name of the tab
// -type: 0-home tab; 1-my baby; 2-other baby
// -babyId: index of the babyList array containing info on the baby (-1 if NA) 
var tabList = new Array();

var tabVisible = 0;
var babyList = new Array();


$(document).ready(function() {
    addHomeTab();
    getMyBabies();
    getOtherBabies();
});


function getMyBabies() {
    //TODO Retrieve my babies from db and adds them to tabList array and to babyList
    //The following is only for test
    var babyInfo = {};
    babyInfo.name = 'Frodo';
    babyInfo.birthdate = new Date(2013, 5, 20);
    babyList.push(babyInfo);
    addBabyTab(babyInfo.name, true, babyList.length-1);
}


function getOtherBabies() {
    //TODO Retrieve other babies from db and add them to tabList array and to babyList
    //The following is only for test
    var babyInfo = {};
    babyInfo.name = 'Gollum';
    babyInfo.birthdate = new Date(2013, 3, 7);
    babyList.push(babyInfo);
    addBabyTab(babyInfo.name, false, babyList.length-1);
}


function addHomeTab() {
    var htmlCode = '';
    htmlCode += '<div id=\'homePageTab\' class=\'tabScreen\'>';
    htmlCode += '<input type=\'button\' value=\'Add my baby\' onclick=\'addMyBaby()\'>';
    htmlCode += '<div id=\'addMyBaby\'>';
    htmlCode += '</div>';
    htmlCode += '<br><br>';
    htmlCode += '<input type=\'button\' value=\'Add other baby (midwife)\' onclick=\'addOtherBaby()\'>';
    htmlCode += '<div id=\'addOtherBaby\'>';
    htmlCode += '</div>';
    htmlCode += '</div>';
    $('#target').append(htmlCode);
    var tabElement = {};
    tabElement.tabId = 'homePageTab';
    tabElement.displayName = 'Home Page';
    tabElement.type = 0;
    tabElement.babyId = -1;
    tabList.push(tabElement);
    //Add to tab list
    htmlCode = '<input type=\'button\' value=\'Home page\' id=\'homePageTabLink\'>';
    $('#leftcolumn').append(htmlCode);
    $('#homePageTabLink').click(function() {displayTab('homePageTab')});
}


function addMyBaby() {
    var htmlCode = '';
    htmlCode += '<br><br>Add my new baby<br>';
    htmlCode += 'Name: <input type=\'text\' id=\'myBabyName\'><br>';
    //TODO the input type date is supported by Chrome but not by Firefox
    htmlCode += 'Birthdate: <input type=\'date\' id=\'myBabyDate\'><br>';
    htmlCode += '<input type=\'button\' value=\'Save\' onclick=\'saveMyBaby()\'>';
    $('#addMyBaby').html(htmlCode);
}


function addOtherBaby() {
    //TODO This function should search for a remote context service exporting
    //data for a baby
    var htmlCode = '';
    htmlCode += '<br><br>Add other baby<br>';
    htmlCode += 'Name: <input type=\'text\' id=\'otherBabyName\'><br>';
    //TODO the input type date is supported by Chrome but not by Firefox
    htmlCode += 'Birthdate: <input type=\'date\' id=\'otherBabyDate\'><br>';
    htmlCode += '<input type=\'button\' value=\'Save\' onclick=\'saveOtherBaby()\'>';
    $('#addOtherBaby').html(htmlCode);
}


function saveMyBaby() {
    var babyName = $('#myBabyName').val();
    var babyDate = $('#myBabyDate').val();
    $('#addMyBaby').html('');
    var babyInfo = {};
    babyInfo.name = babyName;
    babyInfo.birthdate = new Date(babyDate);
    babyList.push(babyInfo);
    addBabyTab(babyInfo.name, true, babyList.length-1);
}


function saveOtherBaby() {
    var babyName = $('#otherBabyName').val();
    var babyDate = $('#otherBabyDate').val();
    $('#addOtherBaby').html('');
    var babyInfo = {};
    babyInfo.name = babyName;
    babyInfo.birthdate = new Date(babyDate);
    babyList.push(babyInfo);
    addBabyTab(babyInfo.name, false, babyList.length-1);
}


function addBabyTab(tabName, isMine, babyId) {
    //alert('addBabyTab - name: '+tabName+', babyId: '+babyId);
    var tabId;
    if(isMine) {
        tabId = 'myBaby'+myBabyCount+'Tab';
        myBabyCount ++;
    }
    else {
        tabId = 'otherBaby'+otherBabyCount+'Tab';
        otherBabyCount ++;
    }
    var tabLinkName = tabId+'Link';
    //Prepare tab content
    var tabAWB = tabId+'AWB';
    var tabATB = tabId+'ATB';
    var tabSWB = tabId+'SWB';
    var tabSTB = tabId+'STB';
    var tabRB = tabId+'RB';
    var htmlCode = '';
    htmlCode += '<div id=\''+tabId+'\'>';
    htmlCode += '<br><br>';
    htmlCode += 'Name: '+babyList[babyId].name+'<br>';
    htmlCode += 'Birthdate: '+babyList[babyId].birthdate.toDateString()+'<br>';
    var today = new Date();
    var age_ms = today - babyList[babyId].birthdate;
    var age_totdays = Math.floor(age_ms/(1000*3600*24));
    var age_days = today.getDate() - babyList[babyId].birthdate.getDate();
    var age_months = today.getMonth() - babyList[babyId].birthdate.getMonth();
    var age_years = today.getFullYear() - babyList[babyId].birthdate.getFullYear();
    if(age_days<0) {
        age_months --;
    }
    if(age_months<0) {
        age_months += 12;
        age_years--;
    }
    htmlCode += 'Age (total days): '+age_totdays+'<br>';
    htmlCode += 'Age : '+age_years+' years, '+age_months+' months<br>';
    htmlCode += '<br><br>';
    if(isMine) {
        htmlCode += '<input type=\'button\' value=\'Acquire weight\' id=\''+tabAWB+'\'><br>';
        htmlCode += '<input type=\'button\' value=\'Acquire temperature\' id=\''+tabATB+'\'><br>';
        htmlCode += '<br><br>';
    }
    htmlCode += '<input type=\'button\' value=\'Show weight\' id=\''+tabSWB+'\'><br>';
    htmlCode += '<input type=\'button\' value=\'Show temperature\' id=\''+tabSTB+'\'><br>';
    htmlCode += '<br><br>';
    htmlCode += '<input type=\'button\' value=\'Remove\' id=\''+tabRB+'\'><br>';
    htmlCode += '</div>';
    //Add div to main div and hide it
    $('#target').append(htmlCode);
    //Add listeners for buttons
    if(isMine) {
        (function(ln, tn) {
            $('#'+ln).click(function() {acquireWeight(tn)});
        })(tabAWB, tabId);
        (function(ln, tn) {
            $('#'+ln).click(function() {acquireTemp(tn)});
        })(tabATB, tabId);
    }
    (function(ln, tn) {
        $('#'+ln).click(function() {showWeight(tn)});
    })(tabSWB, tabId);
    (function(ln, tn) {
        $('#'+ln).click(function() {showTemp(tn)});
    })(tabSTB, tabId);
    (function(ln, tn) {
        $('#'+ln).click(function() {removeTab(tn)});
    })(tabRB, tabId);
    $('#'+tabId).hide();
    //Add to tab list
    var tabElement = {};
    tabElement.tabId = tabId;
    tabElement.displayName = tabName;
    if(isMine) {
        tabElement.type = 1;
    }
    else {
        tabElement.type = 2;
    }
    //Insert my baby before other babies
    if(isMine) {
        var i=0;
        while(i<tabList.length && tabList[i].type != 2) {
            i++;
        }
        tabList.splice(i, 0, tabElement);
    }
    else {
        tabList.push(tabElement);
    }
    refreshTabLinks();
}


function refreshTabLinks() {
    $('#leftcolumn').html('');
    for(var i=0; i<tabList.length; i++) {
        var tabId = tabList[i].tabId;
        var link = tabId+'Link';
        var htmlCode = '<input type=\'button\' value=\''+tabList[i].displayName+'\' id=\''+link+'\'><br>';
        $('#leftcolumn').append(htmlCode);
        (function(ln, tn) {
            $('#'+ln).click(function() {displayTab(tn)});
        })(link, tabId);
    }
}


function displayTab(tabId) {
    //alert(tabId);
    for (i in tabList) {
        $('#'+tabList[i].tabId).hide();
    }
    $('#'+tabId).show();
}


function acquireWeight(tabId) {
    //TODO This function should get the available local weight sensor and acquire
    //new data from it saving them in context db
    alert('acquire new weight for '+tabId);
}


function acquireTemp(tabId) {
    //TODO This function should get the available local temp sensor and acquire
    //new data from it saving them in context db
    alert('acquire new temp for '+tabId);
}


function showWeight(tabId) {
    //TODO This function should connect to context api (local for my baby, remote
    //for other baby) and retrieve historical data for weight
    alert('show weight for '+tabId);
}


function showTemp(tabId) {
    //TODO This function should connect to context api (local for my baby, remote
    //for other baby) and retrieve historical data for temp
    alert('show temp for '+tabId);
}


function removeTab(tabId) {
    $('#'+tabId).remove();
    for(var i=0; i<tabList.length; i++) {
        if(tabList[i].tabId == tabId) {
            tabList.splice(i, 1);
        }
    }
    refreshTabLinks();
    displayTab(tabList[0].tabId);
}


