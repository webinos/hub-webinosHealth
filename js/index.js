
var myBabyCount = 0;
var otherBabyCount = 0;
var momInfo = null;

var googleAvailable;
var profileVal = 'Profile';

var leftMenuButtonPressed = false;
var rightMenuButtonPressed = false;

// tabList is an array of objects including the following attributes:
// -tabId: it's the id of the tab
// -displayName: it's the name of the tab
// -type: 0-mom home; 1-my baby; 2-midwife home; 3-other baby   
// -babyId: index of the babyList array containing info on the baby (-1 if NA)
// -momId: Index of the momList array containing info on the mom (-1 if NA)

var tabList = new Array();
var momInnerTabList = new Array();
var babyInnerTabList = new Array();

var tabVisible = 0;
var babyList = new Array();    //Midwife
var mybabyList = new Array();    //Mom


try {
    googleAvailable = false;
    setTimeout('gl()', 100);
    google.load('visualization', '1', {'packages': ['corechart'], 'callback': googleLoaded});
}
catch(e) {
    alert('google load error: '+e.message);
    //gl();
}


function googleLoaded() {
    googleAvailable = true;
}


function gl() {
    if(window.localStorage) {
        if(localStorage['__healthHub_profile']) {
            profileVal = localStorage['__healthHub_profile'];
        }
    }

    loadingGoogle = false;
    init();
    addProfileTab();
    addListener();


    $('#close').click(function() {
        $('#dialog-container').fadeOut();
    });
}


function init() {
    momInnerTabList[0] = {
        'tabId': 'momIT0',
        'displayName': 'Blood pressure',
        'type': 0
    };
    momInnerTabList[1] = {
        'tabId': 'momIT1',
        'displayName': 'Blood sugar',
        'type': 1
    };
    momInnerTabList[2] = {
        'tabId': 'momIT2',
        'displayName': 'Heartrate',
        'type': 2
    };
    momInnerTabList[3] = {
        'tabId': 'momIT3',
        'displayName': 'Temperature',
        'type': 3
    };

    babyInnerTabList[0] = {
        'tabId': 'babyIT0',
        'displayName': 'Weight',
        'type': 10
    };
    babyInnerTabList[1] = {
        'tabId': 'babyIT1',
        'displayName': 'Temperature',
        'type': 11
    };
    babyInnerTabList[2] = {
        'tabId': 'babyIT2',
        'displayName': 'O2 saturation',
        'type': 12
    };
    windowResize();
    $(window).on('resize', function() {
        windowResize();
    });
        $('#leftMenuButton').click(function() {
            if(leftMenuButtonPressed) {
                $('#leftcolumnwrap').hide();
                $('#leftMenuButton').attr('src', 'assets/menu0.png');
            }
            else {
                $('#leftcolumnwrap').show();
                $('#leftMenuButton').attr('src', 'assets/menu1.png');
            }
            leftMenuButtonPressed = !leftMenuButtonPressed;
        });
        $('#rightMenuButton').click(function() {
            if(rightMenuButtonPressed) {
                $('#rightcolumnwrap').hide();
                $('#rightMenuButton').attr('src', 'assets/menu0.png');
            }
            else {
                $('#rightcolumnwrap').show();
                $('#rightMenuButton').attr('src', 'assets/menu1.png');
            }
            rightMenuButtonPressed = !rightMenuButtonPressed;
        });
}


function getMyBabies(cbk) {
    setTimeout(function(){queryMyBabyInfo(cbk)}, 500);
}


function getOtherBabies(cbk) {
    setTimeout(function(){queryBabyInfo(cbk)}, 500);
}


function addMyBabyInfo(index) {
    var defName = '';
    var defSurname = '';
    var defBirthdate = '';
    //alert('addMyBabyInfo - index is '+index);
    if(index != -1 && mybabyList[index]) {
        if(mybabyList[index].name) {
            defName = mybabyList[index].name;
        }
        if(mybabyList[index].surname) {
            defSurname = mybabyList[index].surname;
        }
        if(mybabyList[index].birthdate) {
            var bDay = mybabyList[index].birthdate.getDate();
            var bMonth = mybabyList[index].birthdate.getMonth()+1;
            var bYear = mybabyList[index].birthdate.getFullYear();
            if(bDay < 10) {
                bDay = '0'+bDay;
            }
            if(bMonth < 10) {
                bMonth = '0'+bMonth;
            }
            defBirthdate = bYear+'-'+bMonth+'-'+bDay;
        }
    }
    var htmlCode = '';
    htmlCode += '<br><br>My baby info<br>';
    htmlCode += 'Name: <input type=\'text\' id=\'myBabyName\' value=\''+defName+'\'><br>';
    htmlCode += 'Surname: <input type=\'text\' id=\'myBabySurname\' value=\''+defSurname+'\'><br>';
    //TODO the input type date is supported by Chrome but not by Firefox
    htmlCode += 'Birthdate: <input type=\'date\' id=\'myBabyDate\' value=\''+defBirthdate+'\'><br>';
    htmlCode += '<input type=\'button\' value=\'Save\' onclick=\'saveMyBaby('+index+')\'>';
    $('#dialog-content').html(htmlCode);
    $('#dialog-container').fadeIn(1000);
}


function saveMyBaby(index) {
    //alert('saveMyBaby: index is '+index+' - mbll is '+mybabyList.length);
    var babyName = $('#myBabyName').val();
    var babySurname = $('#myBabySurname').val();
    var babyDate = $('#myBabyDate').val();
    var babyInfo = {};
    babyInfo.name = babyName;
    babyInfo.surname = babySurname;
    babyInfo.birthdate = new Date(babyDate);
    //alert('saveMyBaby - 03');
    if(mybabyList == null) {
        mybabyList = new Array();
    }
    if(index == -1) {
        //alert('saveMyBaby - 05');
        mybabyList.push(babyInfo);
        $('#dialog-container').fadeOut();
        addBabyTab(babyInfo.name, true, mybabyList.length-1);
        //TODO should call storeMyBabyInfo
        storeMyBabyInfo(index, babyInfo, babySaved);
        refreshTabLinks();
        displayTab(tabList[0].tabId, tabList, 'buttonTabSelected', 'buttonTab');
    }
    else {
        //alert('saveMyBaby - 07');
        if(!mybabyList[index]) {
            mybabyList[index] = {};
        }
        mybabyList[index].name = babyInfo.name;
        mybabyList[index].surname = babyInfo.surname;
        mybabyList[index].birthdate = babyInfo.birthdate;
        //removeTab(tabList[index+1].tabId);
        //alert('saveMyBaby - 075');
        $('#dialog-container').fadeOut();
        if(!tabList[index+1]) {
            tabList[index+1] = {};
            tabList[index+1].type = 1;
            tabList[index+1].tabId = 'myBaby'+index+'Tab';
        }
        tabList[index+1].displayName = babyInfo.name;
        //alert('saveMyBaby - 076');
        storeMyBabyInfo(index, babyInfo, babySaved);
        //alert('saveMyBaby - 077');
        updateBabyTab(babyInfo.name, true, index);
        //alert('saveMyBaby - 0773');
        refreshTabLinks();
        //alert('saveMyBaby - 0776');
        displayTab(tabList[index+1].tabId, tabList, 'buttonTabSelected', 'buttonTab');
        //alert('saveMyBaby - 079');
    }
    //alert('saveMyBaby - 09 - mbll is '+mybabyList.length);
}


function babySaved() {
    //alert('baby info saved');
}


function addBabyTab(tabName, isMine, babyId) {
    //alert('addBabyTab');
    //alert('addBabyTab - name: '+tabName+', babyId: '+babyId);
    var tabId;
    if(isMine) {
        //tabId = 'myBaby'+myBabyCount+'Tab';
        tabId = 'myBaby'+babyId+'Tab';
        myBabyCount ++;
        //console.log('myBabyCount:', myBabyCount);
    }
    else {
        tabId = 'otherBaby'+otherBabyCount+'Tab';
        otherBabyCount ++;
        //console.log('otherBabyCount:', otherBabyCount);
        
    }
    var tabLinkName = tabId+'Link';
    //Prepare tab content
    var tabInnerTabs = tabId+'InnerTabs';
    var tabInnerGraphs = tabId+'InnerGraphs';
    var tabRB = tabId+'RB';
    var tabCI = tabId+'CI';
    var tabSD = tabId+'SD';
    var htmlCode = '';
    var age = 0;
    htmlCode += '<div id=\''+tabId+'\'>';
    htmlCode += '<br><table>';
    //alert('addBabyTab - 03');
    if(isMine && mybabyList[babyId]) {
        if(mybabyList[babyId].name) {
            htmlCode += '<tr><td>Name</td><td>'+mybabyList[babyId].name+'</td></tr>';
        }
        if(mybabyList[babyId].surname) {
        htmlCode += '<tr><td>Surname</td><td>'+mybabyList[babyId].surname+'</td></tr>';
        }
        if(mybabyList[babyId].birthdate) {
        htmlCode += '<tr><td>Birthdate</td><td>'+mybabyList[babyId].birthdate.toDateString()+'</td></tr>';
        age = getAge(mybabyList[babyId].birthdate);
        }
    }
    else if (babyList[babyId]) {
        htmlCode += '<tr><td>Name</td><td>'+babyList[babyId].name+'</td></tr>';
        htmlCode += '<tr><td>Surname</td><td>'+babyList[babyId].surname+'</td></tr>';
        htmlCode += '<tr><td>Birthdate</td><td>'+babyList[babyId].birthdate.toDateString()+'</td></tr>';
        age = getAge(babyList[babyId].birthdate);
    }
    //alert('addBabyTab - 06');
    htmlCode += '<tr><td>Age (total days)</td><td>'+age.totdays+'</td></tr>';
    htmlCode += '<tr><td>Age</td><td>'+age.years+' years, '+age.months+' months</td></tr>';
    //if(!isMine) {
    //    htmlCode += '<tr><td><br></td></tr>';
    //    htmlCode += '<tr><td>Mother name</td><td>'+babyList[babyId].motherName+'</td></tr>';
    //    htmlCode += '<tr><td>Mother surname</td><td>'+babyList[babyId].motherSurname+'</td></tr>';
    //    age = getAge(babyList[babyId].motherBirthdate);
    //    htmlCode += '<tr><td>Mother age</td><td>'+age.years+' years, '+age.months+' months</td></tr>';
    //}
    htmlCode += '</table>';
    htmlCode += '<br><br>';
    htmlCode += '<table><tr>';
    if(isMine) {
        htmlCode += '<td><input type=\'button\' value=\'Change baby info\' class=\'buttonGeneric\' id=\''+tabCI+'\'></td>';
        htmlCode += '<td><input type=\'button\' value=\'Share data\' class=\'buttonGeneric\' id=\''+tabSD+'\'></td>';
    }
    htmlCode += '<td><input type=\'button\' value=\'Remove\' class=\'buttonGeneric\' id=\''+tabRB+'\'></td>';
    htmlCode += '</tr></table>';
    htmlCode += '<br><br>';
    htmlCode += '<div id=\''+tabInnerTabs+'\'></div>';
    htmlCode += '<div id=\''+tabInnerGraphs+'\'></div>';
    htmlCode += '</div>';
    $('#target').append(htmlCode);
    $('#'+tabId).hide();
    (function(ln, tn) {
        $('#'+ln).click(function() {removeTab(tn)});
    })(tabRB, tabId);
    if(isMine) {
        (function(ln, bi) {
            $('#'+ln).click(function() {addMyBabyInfo(bi)});
        })(tabCI, babyId);
        (function(ln, bi) {
            $('#'+ln).click(function() {shareBabyData(bi)});
        })(tabSD, babyId);
    }

    //Baby page inner tab links
    var babyTabIds = new Array();
    for(var i=0; i<babyInnerTabList.length; i++) {
        var BITtabId = tabInnerTabs+babyInnerTabList[i].tabId;
        babyTabIds[i] = {};
        babyTabIds[i].tabId = BITtabId;
    }
    htmlCode = '';
    htmlCode += '<div class=\'centerDiv\'><table class=\'tabTable\'><tr>';
    $('#'+tabInnerTabs).html(htmlCode);
    var colWidPer = 100/babyInnerTabList.length;
    var colWidPx = 540/babyInnerTabList.length;
    for(var i=0; i<babyInnerTabList.length; i++) {
        var BITlink = babyTabIds[i].tabId+'Link';
        htmlCode = '';
        //htmlCode += '<td width='+colWidPer+'% class=\'tabTableTd\'>';
        htmlCode += '<td width='+colWidPx+'px class=\'tabTableTd babyTabTableTd\'>';
        //htmlCode += '<input type=\'button\' value=\''+babyInnerTabList[i].displayName+'\' id=\''+BITlink+'\' class=\'buttonInnerTab\'><br>';
        htmlCode += '<div id=\''+BITlink+'\' class=\'buttonInnerTab\'>'+babyInnerTabList[i].displayName+'</div>';
        htmlCode += '</td>';
        $('#'+tabInnerTabs).append(htmlCode);
        (function(ln, tn, tabList) {
            $('#'+ln).click(function() {displayTab(tn, tabList, 'buttonInnerTabSelected', 'buttonInnerTab')});
        })(BITlink, babyTabIds[i].tabId, babyTabIds);
    }
    htmlCode = '</tr></table></div>';
    $('#'+tabInnerTabs).append(htmlCode);

    //Baby page inner tabs
    for(var i=0; i<babyInnerTabList.length; i++) {
        htmlCode = '';
        htmlCode += '<div id=\''+babyTabIds[i].tabId+'\'>';
        htmlCode += '<div id=\''+babyTabIds[i].tabId+'Graph\'>';
        htmlCode += '</div>';
        htmlCode += '</div>';
        $('#'+tabInnerGraphs).append(htmlCode);
        $('#'+babyTabIds[i].tabId).hide();
        var gh = new graphHandler(isMine);
        gh.displayGraph(babyTabIds[i].tabId+'Graph', babyInnerTabList[i].type, babyId, isMine);
    }

    //Add to tab list
    var tabElement = {};
    tabElement.tabId = tabId;
    tabElement.displayName = tabName;
    if(isMine) {
        tabElement.type = 1;
    }
    else {
        tabElement.type = 3;
    }
    
    //alert('addBabyTab - 05');
    if(isMine) {
        //tabList.push(tabElement);
        tabList[babyId+1] = tabElement;
        refreshTabLinks();
    }
    else {
        // push before 'about mom' tab
        tabList.splice(1, 0, tabElement);
        refreshTabLinks();
    } 
}


function updateBabyTab(tabName, isMine, babyId) {
    if(isMine == false) {
        //Info about other babies cannot be updated by the midwife
        return;
    }

    var tabId = tabList[babyId+1].tabId;
    //Remove old div
    $('#'+tabId).remove();

    var tabLinkName = tabId+'Link';
    //Prepare tab content
    var tabInnerTabs = tabId+'InnerTabs';
    var tabInnerGraphs = tabId+'InnerGraphs';
    var tabRB = tabId+'RB';
    var tabCI = tabId+'CI';
    var htmlCode = '';
    var age;
    htmlCode += '<div id=\''+tabId+'\'>';
    htmlCode += '<br><table>';
    htmlCode += '<tr><td>Name</td><td>'+mybabyList[babyId].name+'</td></tr>';
    htmlCode += '<tr><td>Surname</td><td>'+mybabyList[babyId].surname+'</td></tr>';
    htmlCode += '<tr><td>Birthdate</td><td>'+mybabyList[babyId].birthdate.toDateString()+'</td></tr>';
    age = getAge(mybabyList[babyId].birthdate);
    htmlCode += '<tr><td>Age (total days)</td><td>'+age.totdays+'</td></tr>';
    htmlCode += '<tr><td>Age</td><td>'+age.years+' years, '+age.months+' months</td></tr>';
    htmlCode += '</table>';
    htmlCode += '<br><br>';
    htmlCode += '<div id=\''+tabInnerTabs+'\'></div>';
    htmlCode += '<div id=\''+tabInnerGraphs+'\'></div>';
    htmlCode += '<br><br>';
    htmlCode += '<table>';
    htmlCode += '<tr><td><input type=\'button\' value=\'Change baby info\' class=\'buttonGeneric\' id=\''+tabCI+'\'></td></tr>';
    htmlCode += '<tr><td><input type=\'button\' value=\'Remove\' class=\'buttonGeneric\' id=\''+tabRB+'\'></td></tr>';
    htmlCode += '</table>';
    htmlCode += '</div>';
    $('#target').append(htmlCode);
    $('#'+tabId).hide();
    (function(ln, tn) {
        $('#'+ln).click(function() {removeTab(tn)});
    })(tabRB, tabId);
    (function(ln, bi) {
        $('#'+ln).click(function() {addMyBabyInfo(bi)});
    })(tabCI, babyId);

    //Baby page inner tab links
    var babyTabIds = new Array();
    for(var i=0; i<babyInnerTabList.length; i++) {
        var BITtabId = tabInnerTabs+babyInnerTabList[i].tabId;
        babyTabIds[i] = {};
        babyTabIds[i].tabId = BITtabId;
    }
    htmlCode = '';
    htmlCode += '<table><tr>';
    $('#'+tabInnerTabs).html(htmlCode);
    var colWidPer = 100/babyInnerTabList.length;
    for(var i=0; i<babyInnerTabList.length; i++) {
        var BITlink = babyTabIds[i].tabId+'Link';
        htmlCode = '';
        htmlCode += '<td width='+colWidPer+'%>';
        //htmlCode += '<input type=\'button\' value=\''+babyInnerTabList[i].displayName+'\' id=\''+BITlink+'\' class=\'buttonInnerTab\'><br>';
        htmlCode += '<div id=\''+BITlink+'\' class=\'buttonInnerTab\'>'+babyInnerTabList[i].displayName+'</div>';
        htmlCode += '</td>';
        $('#'+tabInnerTabs).append(htmlCode);
        (function(ln, tn, tabList) {
            $('#'+ln).click(function() {displayTab(tn, tabList, 'buttonInnerTabSelected', 'buttonInnerTab')});
        })(BITlink, babyTabIds[i].tabId, babyTabIds);
    }
    htmlCode = '</tr></table>';
    $('#'+tabInnerTabs).append(htmlCode);

    //Baby page inner tabs
    for(var i=0; i<babyInnerTabList.length; i++) {
        htmlCode = '';
        htmlCode += '<div id=\''+babyTabIds[i].tabId+'\'>';
        htmlCode += '<div id=\''+babyTabIds[i].tabId+'Graph\'>';
        htmlCode += '</div>';
        htmlCode += '</div>';
        $('#'+tabInnerGraphs).append(htmlCode);
        $('#'+babyTabIds[i].tabId).hide();
        var gh = new graphHandler(isMine);
        gh.displayGraph(babyTabIds[i].tabId+'Graph', babyInnerTabList[i].type, babyId, isMine);
    }
}


function refreshTabLinks() {
    //alert('refreshTabLinks - 01');
    $('#leftcolumn').html('<br><table>');
    var colWid = '240px';
    var prevType = tabList[0].type;
    //alert('refreshTabLinks - 02 - '+tabList.length);
    for(var i=0; i<tabList.length; i++) {
        if(tabList[i]) {
        //alert('refreshTabLinks - 03 - loop '+i);
        var tabId = tabList[i].tabId;
        var link = tabId+'Link';
        var htmlCode = '';
        if(prevType != tabList[i].type) {
            if(prevType == 0) {
                htmlCode += '<tr><td width='+colWid+'>My babies</td></tr>';
            }
            else if(prevType == 2) {
                htmlCode += '<tr><td width='+colWid+'>Babies</td></tr>';
            }
            else {
                htmlCode += '<tr><td width='+colWid+'></td></tr>';
            }
            prevType = tabList[i].type;
        }
        //htmlCode += '<tr><td><input type=\'button\' value=\''+tabList[i].displayName+'\' id=\''+link+'\' class=\'buttonTab\'></td></tr>';
        htmlCode += '<tr><td width='+colWid+' id=\''+link+'\' class=\'buttonTab\'>'+tabList[i].displayName+'</td></tr>';
        $('#leftcolumn').append(htmlCode);
        (function(ln, tn) {
            //alert('refreshTabLinks - 07: '+ln+', '+tn);
            $('#'+ln).click(function() {displayTab(tn, tabList, 'buttonTabSelected', 'buttonTab')});
        })(link, tabId);
        }
    }
    //alert('refreshTabLinks - 09');
    $('#leftcolumn').append('</table><br>');
}


function removeTab(tabId) {
    alert('currently disabled');
    return;
    //TODO in case of mother baby it should remove the associated db
    $('#'+tabId).remove();
    for(var i=0; i<tabList.length; i++) {
        if(tabList[i].tabId == tabId) {
            tabList.splice(i, 1);
        }
    }
    refreshTabLinks();
    //displayTab(tabList[0].tabId);
    displayTab(tabList[0].tabId, tabList, 'buttonTabSelected', 'buttonTab');
}


function addProfileTab() {
    var htmlCode = '';
    htmlCode += '<table id=\'configuration_table\' border=0>';
    htmlCode += '<tr>'
    htmlCode += '<td>Profile</td>';
    htmlCode += '</tr>';
    htmlCode += '<tr>';
    htmlCode += '<td>';
    htmlCode += '<select id=\'profile\' class=\'selectClass\'>';
    htmlCode += '<option value=\'Profile\'>';
    htmlCode += 'Choose Profile';
    htmlCode += '</option>';
    htmlCode += '<option value=\'Mom\'>';
    htmlCode += 'Mom';
    htmlCode += '</option>';
    htmlCode += '<option value=\'Midwife\'>';
    htmlCode += 'Midwife';
    htmlCode += '</option>';
    htmlCode += '</select>';
    htmlCode += '</td>';
    htmlCode += '</tr>';
 
    $('#rightcolumn').html(htmlCode);
    $('select#profile').val(profileVal).attr('selected', true);
    launchPage();
}


function addListener() {

    var profile = document.getElementById('profile');
    if (profile.addEventListener) {
        // DOM2 standard
        profile.addEventListener('change', changeHandler, false);
    }
    else if (profile.attachEvent) {
        // IE fallback
        profile.attachEvent('onchange', changeHandler);
    }
    else {
        // DOM0 fallback
        profile.onchange = changeHandler;
    } 
}


function changeHandler(event){
    launchPage();
}


function initMomInfo() {
    if(momInfo == null) {
        //momInfo = queryMomInfo();
        queryMomInfo(function(res) {
            momInfo = res;
            checkMomInfo();
        });
    }
    else {
        checkMomInfo();
    }
}


function checkMomInfo() {
    //alert('checkMomInfo');
    if(momInfo == null) {
        //If momInfo not stored, then ask for it...
        askMomInfo();
    }
    else {
        addMomTabs();
    }
}


function askMomInfo() {
    //alert('askMomInfo - mbll is '+mybabyList.length);
    var defName = '';
    var defSurname = '';
    var defBirthdate = '';
    if(momInfo) {
        if(momInfo.name) {
            defName = momInfo.name;
        }
        if(momInfo.surname) {
            defSurname = momInfo.surname;
        }
        if(momInfo.birthdate) {
            var bDay = momInfo.birthdate.getDate();
            var bMonth = momInfo.birthdate.getMonth()+1;
            var bYear = momInfo.birthdate.getFullYear();
            if(bDay < 10) {
                bDay = '0'+bDay;
            }
            if(bMonth < 10) {
                bMonth = '0'+bMonth;
            }
            defBirthdate = bYear+'-'+bMonth+'-'+bDay;
        }
    }
    var htmlCode = '';
    htmlCode += 'Please, insert your informations<br><br>';
    htmlCode += 'Mother name: <input type=\'text\' id=\'momMotherName\' value=\''+defName+'\'><br>';
    htmlCode += 'Mother surname: <input type=\'text\' id=\'momMotherSurname\' value=\''+defSurname+'\'><br>';
    htmlCode += 'Mother birthdate: <input type=\'date\' id=\'momMotherDate\' value=\''+defBirthdate+'\'><br>';
    htmlCode += '<input type=\'button\' value=\'Save\' onclick=\'saveMomInfo()\'>';
    $('#dialog-content').html(htmlCode);
    $('#dialog-container').fadeIn(1000);
}


function saveMomInfo() {
    //alert('saveMomInfo - 01');
    momInfo = {};
    momInfo.name = $('#momMotherName').val();
    momInfo.surname = $('#momMotherSurname').val();
    momInfo.birthdate = new Date($('#momMotherDate').val());
    //TODO check that input values are valid
    storeMomInfo(momInfo, momInfoSaved);
    $('#dialog-container').fadeOut();
    addMomTabs();
}


function momInfoSaved() {
    //alert('momInfoSaved');
}


function addMomTabs() {
    //Retrieves tab list for mom: mom home tab and her babies
    tabList = new Array();

    $('#target').html('');

    //alert('addMomTabs - 01 - mbll is '+mybabyList.length);
    var age = getAge(momInfo.birthdate);
    var htmlCode = '';
    htmlCode += '<div id=\'momTab\'>';
    htmlCode += '<br>';
    htmlCode += '<table>';
    htmlCode += '<tr><td>My name</td><td>'+momInfo.name+'</td></tr>';
    htmlCode += '<tr><td>My surname</td><td>'+momInfo.surname+'</td></tr>';
    htmlCode += '<tr><td>My birthdate</td><td>'+momInfo.birthdate.toDateString()+'</td></tr>';
    htmlCode += '<tr><td>My age</td><td>'+age.years+' years, '+age.months+' months</td></tr>';
    htmlCode += '</table>';
    htmlCode += '<br><br>';
    htmlCode += '<table>';
    htmlCode += '<tr><td><input type=\'button\' value=\'Add my baby\' class=\'buttonGeneric\' onclick=\'addMyBabyInfo(-1)\'></td>';
    htmlCode += '<td><input type=\'button\' value=\'Change my info\' class=\'buttonGeneric\' onclick=\'askMomInfo()\'></td></tr>';
    htmlCode += '<td><input type=\'button\' value=\'Check connection requests\' class=\'buttonGeneric\' onclick=\'checkConnReq()\'></td></tr>';
    //htmlCode += '<td><input type=\'button\' value=\'My health\' class=\'buttonGeneric\' onclick=\'momHealth()\'></td></tr>';
    htmlCode += '</table>';
    htmlCode += '<br><br>';
    htmlCode += '<div id=\'momInnerTabs\'>';
    htmlCode += '</div>';
    htmlCode += '<div id=\'momInnerGraphs\'>';
    htmlCode += '</div>';
    htmlCode += '</div>';
    $('#target').append(htmlCode);

    //alert('addMomTabs - 03');
    //Mom page inner tab links
    htmlCode = '';
    htmlCode += '<table class=\'tabTable\'><tr class=\'tabTableTr\'>';
    $('#momInnerTabs').html(htmlCode);
    var colWidPer = 100/momInnerTabList.length;
    var colWidPx = 540/momInnerTabList.length;
    for(var i=0; i<momInnerTabList.length; i++) {
        var tabId = momInnerTabList[i].tabId;
        var link = tabId+'Link';
        htmlCode = '';
        //htmlCode += '<td width='+colWidPer+'% class=\'tabTableTd\'>';
        htmlCode += '<td width='+colWidPx+'px class=\'tabTableTd momTabTableTd\'>';
        //htmlCode += '<input type=\'button\' value=\''+momInnerTabList[i].displayName+'\' id=\''+link+'\' class=\'buttonInnerTab\'><br>';
        htmlCode += '<div value=\''+momInnerTabList[i].displayName+'\' id=\''+link+'\' class=\'buttonInnerTab\'>'+momInnerTabList[i].displayName+'</div>';
        htmlCode += '</td>';
        $('#momInnerTabs').append(htmlCode);
        (function(ln, tn, tabList) {
            $('#'+ln).click(function() {displayTab(tn, tabList, 'buttonInnerTabSelected', 'buttonInnerTab')});
        })(link, tabId, momInnerTabList);
    }
    htmlCode = '</tr></table>';
    $('#momInnerTabs').append(htmlCode);

    //alert('addMomTabs - 05');
    //Mom page inner tabs
    for(var i=0; i<momInnerTabList.length; i++) {
        var tabId = momInnerTabList[i].tabId;
        htmlCode = '';
        htmlCode += '<div id=\''+momInnerTabList[i].tabId+'\'>';
        htmlCode += '<div id=\''+momInnerTabList[i].tabId+'Graph\'>';
        htmlCode += '</div>';
        htmlCode += '</div>';
        $('#momInnerGraphs').append(htmlCode);
        $('#'+momInnerTabList[i].tabId).hide();
        var gh = new graphHandler(true);
        gh.displayGraph(momInnerTabList[i].tabId+'Graph', momInnerTabList[i].type, -1, true);
    }

    var tabElement = {};
    tabElement.tabId = 'momTab';
    tabElement.displayName = 'About me';
    tabElement.type = 0;
    tabElement.babyId = -1;
    tabList.push(tabElement);

    //alert('addMomTabs - 07 - mbll is '+mybabyList.length);
    if(mybabyList) {
        for(var i=0; i<mybabyList.length; i++) {
            //alert('addMomTabs - 071');
            if(mybabyList[i]) {
                //alert('addMomTabs - 072');
                if(mybabyList[i].name) {
                    //alert('addMomTabs - 073');
                    addBabyTab(mybabyList[i].name, true, i);
                }
                else {
                    //alert('addMomTabs - 074');
                    //TODO Ask for baby info
                    addMyBabyInfo(i);
                }
            }
            else {
                //alert('addMomTabs - 075');
                //TODO Ask for baby info
                addMyBabyInfo(i);
            }
            //alert('addMomTabs - 073');
        }
    }

    refreshTabLinks();
    displayTab(tabList[0].tabId, tabList, 'buttonTabSelected', 'buttonTab');
    //alert('addMomTabs - 09 - mbll is '+mybabyList.length);
}


//function momHealth() {
//    window.open('http://localhost:8080/health-data/index.html');
//}


function addMidwifeTabs() {
    //alert('addMidwifeTabs - 01');
    //Retrieves tab list for midwife: midwife home tab and her babies
    tabList = new Array();

    $('#target').html('');

    var htmlCode = '';
    htmlCode += '<div id=\'midwifeTab\'>';
    htmlCode += '<br>';
    htmlCode += '<table>';
    htmlCode += '<tr><td><input type=\'button\' value=\'Connect new baby\' class=\'buttonGeneric\' onclick=\'connectToBaby(null, null)\'></td></tr>';
    htmlCode += '<tr><td><input type=\'button\' value=\'Refresh baby list\' class=\'buttonGeneric\' onclick=\'refreshBabyList()\'></td></tr>';
    htmlCode += '</table>';
    htmlCode += '</div>';
    $('#target').append(htmlCode);

    var tabElement = {};
    tabElement.tabId = 'midwifeTab';
    tabElement.displayName = 'Midwife home';
    tabElement.type = 2;
    tabElement.babyId = -1;
    tabList.push(tabElement);

    //alert('addMidwifeTabs - 08');
    if(babyList) {
        for(var i=0; i<babyList.length; i++) {
            addBabyTab(babyList[i].name+' '+babyList[i].surname, false, i);
        }
    }
    //alert('addMidwifeTabs - 09');
}


function refreshBabyList() {
    getOtherBabies(function(res) {
        babyList = res;
        otherBabyCount = 0;
        //Constructs tabList for midwife profile
        addMidwifeTabs();
        refreshTabLinks();
        displayTab(tabList[0].tabId, tabList, 'buttonTabSelected', 'buttonTab');
    });
}


function launchPage(){
    profileVal = $('#profile').val();
    if(window.localStorage) {
        localStorage['__healthHub_profile'] = profileVal;
    }
    //alert('profile is:'+ profileVal);
    $('#target').html('');
    $('#leftcolumn').html('');
    if(profileVal === 'Mom') {
        //Retrieve my baby list
        getMyBabies(function(res) {
            //alert('got babies! - '+res.length);
            //for(var j=0; j<res.length; j++) {
            //    alert(JSON.stringify(res[j]));
            //}
            mybabyList = res;
            myBabyCount = 0;
            //Constructs tabList for mom profile
            initMomInfo();
        });
    }
    else if (profileVal === 'Midwife') {
        //Retrieve midwife's baby list
        refreshBabyList();
/*
        getOtherBabies(function(res) {
            babyList = res;
            otherBabyCount = 0;
            //Constructs tabList for midwife profile
            addMidwifeTabs();

            refreshTabLinks();
            displayTab(tabList[0].tabId, tabList, 'buttonTabSelected', 'buttonTab');
        });
*/
    }
    else if (profileVal === 'Profile') {
        //$('#target').html('');
        //$('#leftcolumn').html('');
    }
}


function connectNewBaby() {
    //TODO This should connect to a remote db
    var htmlCode = '';
    htmlCode += '<br><br>Connect to a new baby<br>';
    htmlCode += 'Baby name: <input type=\'text\' id=\'midwifeBabyName\'><br>';
    htmlCode += 'Mother name: <input type=\'text\' id=\'midwifeMotherName\'><br>';
    htmlCode += '<input type=\'button\' value=\'Connect\' onclick=\'newBabyConnection()\'>';
    $('#dialog-content').html(htmlCode);
    $('#dialog-container').fadeIn(1000);
}


function newBabyConnection() {
    var babyName = $('#midwifeBabyName').val();
    var motherName = $('#midwifeMotherName').val();
    $('#dialog-container').fadeOut();
    connectToBaby(babyName, motherName);
}


// General functions for tab handling

/*
 * This function displays the tab selected identified by tabId and changes the class
 * of corresponding links. The id of links id tabId+'Link'.
 * tabId: selected tab
 * allTabs: array with all tabs
 * tabSelectedClass: class of of the link corresponding to a tab selected
 * tabUnselectedClass: class of of the link corresponding to a tab not selected
 *
 */
function displayTab(tabId, allTabs, tabSelectedClass, tabUnselectedClass) {
    //alert(tabId);
    for (i=0; i<allTabs.length; i++) {
        $('#'+allTabs[i].tabId).hide();
        $('#'+allTabs[i].tabId+'Link').removeClass(tabSelectedClass).addClass(tabUnselectedClass);
    }
    $('#'+tabId).show();
    $('#'+tabId+'Link').removeClass(tabUnselectedClass).addClass(tabSelectedClass);
}


function getAge(birthdate) {
    var today = new Date();
    var result = {};
    var age_ms = today - birthdate;
    result.totdays = Math.floor(age_ms/(1000*3600*24));
    var age_days = today.getDate() - birthdate.getDate();
    var age_months = today.getMonth() - birthdate.getMonth();
    var age_years = today.getFullYear() - birthdate.getFullYear();
    if(age_days<0) {
        age_months --;
    }
    if(age_months<0) {
        age_months += 12;
        age_years--;
    }
    result.months = age_months;
    result.years = age_years;
    return result;
}


function windowResize() {
    var headerWidth = $(window).width()-10;
    var colWidth = 230;
    var contentWidth = headerWidth - (colWidth<<1);
    var showCols = true;
    if(headerWidth < 700) {
        colWidth = 170;
        contentWidth = headerWidth;
        showCols = false;
    }
    else if(headerWidth < 880) {
        colWidth = 170;
        contentWidth = headerWidth - (colWidth<<1);
    }
    else if(headerWidth < 1000) {
        contentWidth = 540;
        colWidth = (headerWidth - contentWidth) >> 1;
    }
    var targetWidth = contentWidth - 12;
    var targetHeight = $(window).height()-136;
    var popupWidth = $(window).width() - 150;
    var popupHeight = $(window).height() - 110;
    var mainTitleWidth = $(window).width() - 150;
    var babyColWidPx;
    var momColWidPx;
    if(showCols) {
        babyColWidPx = ($(window).width()-(colWidth<<1))/babyInnerTabList.length;
        momColWidPx = ($(window).width()-(colWidth<<1))/momInnerTabList.length;
    }
    else {
        babyColWidPx = ($(window).width())/babyInnerTabList.length;
        momColWidPx = ($(window).width())/momInnerTabList.length;
    }

    $('#wrapper').css({
        'width':headerWidth+'px'
    });
    $('#headerwrap').css({
        'width':headerWidth+'px'
    });
    $('#footerwrap').css({
        'width':headerWidth+'px'
    });
    $('#leftcolumnwrap').css({
        'width':colWidth+'px'
    });
    $('#leftcolumn').css({
        'height':targetHeight+'px'
    });
    $('#rightcolumnwrap').css({
        'width':colWidth+'px',
    });
    $('#rightcolumn').css({
        'height':targetHeight+'px'
    });
    $('#contentwrap').css({
        'width':contentWidth+'px'
    });
    $('#target').css({
        'width':targetWidth+'px',
        'height':targetHeight+'px'
    });
    $('#popup').css({
        'width':popupWidth+'px',
        'height':popupHeight+'px',
        'margin-left':'-'+((popupWidth>>1) + 32)+'px',
        'margin-top':'-'+((popupHeight>>1) + 20)+'px'
    });
    $('#mainTitle').css({
        'width':mainTitleWidth+'px'
    });
    $('.babyTabTableTd').css({
        'width':babyColWidPx+'px'
    });
    $('.momTabTableTd').css({
        'width':momColWidPx+'px'
    });
    if(!showCols) {
        $('#leftcolumnwrap').hide();
        $('#rightcolumnwrap').hide();
        $('.menuButton').show();
        $('#leftcolumnwrap').css({
            'position':'absolute',
            'top':'67px',
            'left':'0',
            'z-index':'10'
        });
        $('#rightcolumnwrap').css({
            'position':'absolute',
            'top':'67px',
            'right':'0',
            'z-index':'10'
        });
        $('#mainTitle').css({
            'font-size':'32px'
        });
    }
    else {
        $('#leftcolumnwrap').show();
        $('#rightcolumnwrap').show();
        $('.menuButton').hide();
        leftMenuButtonPressed = false;
        rightMenuButtonPressed = false;
        $('#leftMenuButton').attr('src', 'assets/menu0.png');
        $('#rightMenuButton').attr('src', 'assets/menu0.png');
        $('#leftcolumnwrap').css({
            'position':'static'
        });
        $('#rightcolumnwrap').css({
            'position':'static'
        });
        $('#mainTitle').css({
            'font-size':'45px'
        });
    }
}


