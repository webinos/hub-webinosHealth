var myBabyCount = 0;
var otherBabyCount = 0;
var momCount = 0;

// tabList is an array of objects including the following attributes:
// -tabId: it's the id of the tab
// -displayName: it's the name of the tab
// -type: 0-home tab; 1-my baby; 2-other baby   
// -babyId: index of the babyList array containing info on the baby (-1 if NA)
// -momId: Index of the momList array containing info on the mom (-1 if NA)

var tabList = new Array(3);
for(var i = 0; i < 3; i++ ) tabList[i] = new Array();  // 0 -mom; 1-my baby; 2 - midwife

var tabVisible = 0;
var babyList = new Array();	//Midwife
var momList = new Array();	//Midwife 
var mybabyList = new Array();	//Mom

$(document).ready(function() {
/*
 * Request user to choose profile category in the option list:   0-mom; 1-mybaby; 2-midwife
 * Once profile is selected, left column updated as per profile
 */
    addProfileTab();
    addListener();
});

/*  Hierarchy babyList table structure for mybabyList, babyList, momList. e.g. 
 *  
 *   BabyList Table _
 *                   |    
 *                   |__baby1________________________
 *                   |		   | 	                 |
 *                   |         |                     |
 *                   |     weight_table        temperature_table 
 *                   |  _______|_________     _______|______________
 *                   | |Weight|TimeStamp|     |Temperature|TimeStamp|
 *                   |    
 *                   |
 *                   |
 *                   |__baby2______________________ 
 *                   |......
 */ 
 
//DB functions

function queryBabyInfo() {
	return babyList; //with names and DOB
}

function queryMyBabyInfo() {
		
	return mybabyList; //with names and DOB
}

function queryMomInfo() {
	return momList; //with names and DOB
}

function queryBabyWeight(baby_name) {
}

function queryBabyWeighthistory(baby_name, starting_time, end_time) {
}


function queryMyBabyWeight(baby_name) {
}

function queryMyBabyWeighthistory(baby_name, starting_time, end_time) {
}


function queryMomHR(mom_name) {
}

function queryMomHRHistory(mom_name, starting_time, end_time) {
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

function heartRate(){

	alert("Reading heart Rate");
	//TODO: re-write following function
	
	var htmlMom = '';
    htmlMom += '<br><br>Heart Reading<br>';
    htmlMom += 'Name: <input type=\'text\' id=\'myBabyName\'><br>';
    //TODO the input type date is supported by Chrome but not by Firefox
    htmlMom += 'Birthdate: <input type=\'date\' id=\'myBabyDate\'><br>';
    //htmlMom += '<input type=\'button\' value=\'Save\' onclick=\'saveMyBaby()\'>';
    $('#heartRate').html(htmlMom);
}

function momWeight() {
	alert("Reading Mom Weight");
}

function momTemp() {
	alert("Reading Mom temperature");
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


//more on other sensors
//end of DB functions
 
  
function getMyBabies() {
    //TODO Retrieve my babies from db and adds them to tabList array and to mybabyList
    //The following is only for test
    /*var babyInfo = {};
    babyInfo.name = 'Frodo';
    babyInfo.birthdate = new Date(2013, 5, 20);
    mybabyList.push(babyInfo);
    alert('mybabyList.length '+mybabyList.length); */
    
    mybabyList = queryMyBabyInfo();
    
    if(mybabyList.length > 0)
    {
    	console.log("mybabyList.length", mybabyList.length); 
		//get baby information
		for (var i = 0; i <  mybabyList.length; i++)
		{
			console.log("baby name:", mybabyList[i].name);
    		//addBabyTab(mybabyList[i].name, true, mybabyList.length-1);
    		addBabyTab(mybabyList[i].name, true, i);
    	}
    }	
}

function getOtherBabies() {
    //TODO Retrieve other babies from db and add them to tabList array and to babyList
    //The following is only for test
/*    var babyInfo = {};
    babyInfo.name = 'Gollum';
    babyInfo.birthdate = new Date(2013, 3, 7);
    babyList.push(babyInfo); */
    
    babyList = queryBabyInfo(); 
    
    if(babyList.length > 0)
    {
    	console.log("babyList.length", babyList.length); 
		//get baby information
		for (var i = 0; i <  babyList.length; i++)
		{
			console.log("baby name:", babyList[i].name);
    		addBabyTab(babyList[i].name, false, i);
    	}
    }
}

function getMoms() {
    //TODO Retrieve moms from db and add them to tabList array and to momList
    //The following is only for test
    momList = queryMomInfo();
    //TODO
    
}


function addNewMom() {

    console.log("addNewMom is called");
    var htmlCode = '';
    htmlCode += '<br><br>Add new mom<br>';
    htmlCode += 'Name: <input type=\'text\' id=\'<momName\'><br>';
    //TODO the input type date is supported by Chrome but not by Firefox
    htmlCode += 'Birthdate: <input type=\'date\' id=\'momDate\'><br>';
    htmlCode += '<input type=\'button\' value=\'Save\' onclick=\'saveMom()\'>';
    $('#addNewMom').html(htmlCode);
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

function addNewBaby() {
    //TODO This function should search for a remote context service exporting
    //data for a baby
    console.log("addNewBaby is called");
    var htmlCode = '';
    htmlCode += '<br><br>Add new baby<br>';
    htmlCode += 'Name: <input type=\'text\' id=\'newBabyName\'><br>';
    //TODO the input type date is supported by Chrome but not by Firefox
    htmlCode += 'Birthdate: <input type=\'date\' id=\'newBabyDate\'><br>';
    htmlCode += '<input type=\'button\' value=\'Save\' onclick=\'saveNewBaby()\'>';
    $('#addNewBaby').html(htmlCode);
}


function saveMyBaby() {
    console.log("saveMyBaby");
    var babyName = $('#myBabyName').val();
    console.log("babyName", babyName );
    var babyDate = $('#myBabyDate').val();
    $('#addMyBaby').html('');
    var babyInfo = {};
    babyInfo.name = babyName;
    babyInfo.birthdate = new Date(babyDate);
    mybabyList.push(babyInfo);
    console.log(babyInfo);
    addBabyTab(babyInfo.name, true, mybabyList.length-1);
    refreshTabLinks(1);
}


function saveNewBaby() {
    var babyName = $('#newBabyName').val();
    var babyDate = $('#newBabyDate').val();
    $('#addNewBaby').html('');
    var babyInfo = {};
    babyInfo.name = babyName;
    babyInfo.birthdate = new Date(babyDate);
    babyList.push(babyInfo);
    console.log(babyInfo);
    addBabyTab(babyInfo.name, false, babyList.length-1);
    refreshTabLinks(2);
}

function saveMom() {
	
    var momName = $('#momName').val();
    var babyDate = $('#momDate').val();
    $('#addNewMom').html('');
    var momInfo = {};
    momInfo.name = momName;
    momInfo.birthdate = new Date(momDate);
    momList.push(momInfo);
    addMomTab(momInfo.name, momList.length-1);
    refreshTabLinks(2);
}

function addBabyTab(tabName, isMine, babyId) {
    alert('addBabyTab - name: '+tabName+', babyId: '+babyId);
    var tabId;
    if(isMine) {
        tabId = 'myBaby'+myBabyCount+'Tab';
        myBabyCount ++;
        console.log("myBabyCount:", myBabyCount);
    }
    else {
        tabId = 'otherBaby'+otherBabyCount+'Tab';
        otherBabyCount ++;
        console.log("otherBabyCount:", otherBabyCount);
        
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
    if(isMine) {
        console.log("isMine:", mybabyList[babyId].name);
    	htmlCode += 'Name: '+mybabyList[babyId].name+'<br>';
    	
    	htmlCode += 'Birthdate: '+mybabyList[babyId].birthdate.toDateString()+'<br>';
    }
    else
    {
    	htmlCode += 'Name: '+babyList[babyId].name+'<br>';
    	htmlCode += 'Birthdate: '+babyList[babyId].birthdate.toDateString()+'<br>';
    }	
    var today = new Date();
    if(isMine) {    
    	var age_ms = today - mybabyList[babyId].birthdate;
    }
    else
    	var age_ms = today - babyList[babyId].birthdate;
    var age_totdays = Math.floor(age_ms/(1000*3600*24));
    if(isMine) {
    	var age_days = today.getDate() - mybabyList[babyId].birthdate.getDate();
    	var age_months = today.getMonth() - mybabyList[babyId].birthdate.getMonth();
    	var age_years = today.getFullYear() - mybabyList[babyId].birthdate.getFullYear();
    }
    else
    {
    	var age_days = today.getDate() - babyList[babyId].birthdate.getDate();
    	var age_months = today.getMonth() - babyList[babyId].birthdate.getMonth();
    	var age_years = today.getFullYear() - babyList[babyId].birthdate.getFullYear();
    }	
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
    
    if(isMine) {
 
        tabList[1].push(tabElement);
        refreshTabLinks(1);
    }
    else {
    
    	// push before "about mom" tab
        tabList[2].splice(1, 0, tabElement);
    	refreshTabLinks(2);
    } 
}

function addMomTab(tabName, momId) {
	var tabId;
	tabId = 'mom'+momCount+'Tab';
	momCount++;
	console.log("momCount:", momCount); 
}
function refreshTabLinks(cat) {
    $('#leftcolumn').html('');
    console.log("tab list length:", tabList[cat].length);
    if(cat !== 2)
    {
	    for(var i=0; i<tabList[cat].length; i++) {
	        console.log("tab length: ", tabList[cat].length);
	        var tabId = tabList[cat][i].tabId;
	        var link = tabId+'Link';
	        var htmlCode = '<input type=\'button\' value=\''+tabList[cat][i].displayName+'\' id=\''+link+'\'><br>';
	        $('#leftcolumn').append(htmlCode);
	        (function(ln, tn) {
	            console.log("ln", ln);
	            console.log("tn", tn);
	            $('#'+ln).click(function() {displayTab(tn)});
	        })(link, tabId);
	    }
    }
    else
    {
    	for(var i=0; i<tabList[cat].length; i++) {
	        var tabId = tabList[cat][i].tabId;
	        var link = tabId+'Link';
	        var htmlCode = '<input type=\'button\' value=\''+tabList[cat][i].displayName+'\' id=\''+link+'\'><br>';
	        $('#leftcolumn').append(htmlCode);
	        (function(ln, tn) {
	            console.log("ln", ln);
	            console.log("tn", tn);
	            $('#'+ln).click(function() {displayTab(tn)});
	        })(link, tabId);
    	}
    }
}

function displayTab(tabId) {
    //alert(tabId);
    for (i in tabList) {
        $('#'+tabList[i].tabId).hide();
    }
    $('#'+tabId).show();
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

function addProfileTab() {
	var htmlCode = '';
	htmlCode += '<table id=\'configuration_table\' border=0>';
	htmlCode += '<tr>'
	htmlCode += '<td>Profile</td>';
	htmlCode += '</tr>';
	htmlCode += '<tr>';
	htmlCode += '<td>';
	htmlCode += '<select id=\'profile\'>';
	htmlCode += '<option value=\'Profile\'>';
	htmlCode += 'Choose Your Profile';
	htmlCode += '</option>';
	htmlCode += '<option value=\'Mom\'>';
	htmlCode += 'Mom';
	htmlCode += '</option>';
	htmlCode += '<option value=\'My Baby\'>';
	htmlCode += 'My Baby';
	htmlCode += '</option>';
	htmlCode += '<option value=\'Midwife\'>';
	htmlCode += 'Midwife';
	htmlCode += '</option>';
	htmlCode += '</select>';
	htmlCode += '</td>';
	htmlCode += '</tr>';
	
	//add enrol button - to enroll with health Hub
	
	$('#rightcolumn').append(htmlCode);
}

function addListener() {

	var profile = document.getElementById("profile");
 
	if (profile.addEventListener) 
	{
    	// DOM2 standard
    	profile.addEventListener("change", changeHandler, false);
	}
	else if (profile.attachEvent) 
	{
    	// IE fallback
    	profile.attachEvent("onchange", changeHandler);
	}
	else 
	{
    	// DOM0 fallback
    	profile.onchange = changeHandler;
	} 
}

function changeHandler(event){
	launchPage();
}

function launchPage(){
	var profile = document.getElementById('profile').value;
	console.log("profile is:", profile);
	
	if(profile ==="Mom")
	{
		//tabList[0] = [];
		var htmlMom = '';
	    htmlMom += '<div id=\'momPageTab\' class=\'tabScreen\'>';
	    htmlMom += '<input type=\'button\' value=\'Heart Rate\' onclick=\'heartRate()\'>';
	    htmlMom += '<div id=\'heartRate\'>';
	    htmlMom += '</div>';
	    htmlMom += '<br><br>';
	    
	    htmlMom += '<input type=\'button\' value=\'Weight\' onclick=\'momWeight()\'>';
	    htmlMom += '<div id=\'momWeight\'>';
	    htmlMom += '</div>';
	    htmlMom += '<br><br>';
	    
	    htmlMom += '<input type=\'button\' value=\'Temperature\' onclick=\'momTemp()\'>';
	    htmlMom += '<div id=\'momTemp\'>';
	    htmlMom += '</div>';
	    htmlMom += '<br><br>'; 
	    
	    htmlMom += '</div>';
	    $('#target').html('');
	    $('#target').append(htmlMom);
	    var tabElement = {};
	    tabElement.tabId = 'momPageTab';
	    tabElement.displayName = 'My Health';
	    tabElement.type = 0;
	    tabElement.babyId = -1;
	    tabList.push(tabElement);
	    //Add to tab list
	    htmlMom = '<input type=\'button\' value=\'My Health\' id=\'momPageTabLink\'>';
	    $('#leftcolumn').html('');
	    $('#leftcolumn').append(htmlMom);  
	    $('#momPageTabLink').click(function() {displayTab('momPageTab')});
	   
	   //add history page
	    var htmlHistory = '';
		
	    htmlHistory += '<div id=\'historyPageTab\' class=\'tabScreen\'>';
	    
	    htmlHistory += '<input type=\'button\' value=\'Weight\' onclick=\'momWeight()\'>';
	    htmlHistory += '<div id=\'momWeight\'>';
	    htmlHistory += '</div>';
	    htmlHistory += '<br><br>';
	    
	    htmlHistory += '<input type=\'button\' value=\'Temperature\' onclick=\'momTemp()\'>';
	    htmlHistory += '<div id=\'momTemp\'>';
	    htmlHistory += '</div>';
	    htmlHistory += '<br><br>';
	    
	    htmlHistory += '</div>';
	    //$('#target').html('');
	    $('#target').append(htmlHistory);
	    var tabElement = {};
	    tabElement.tabId = 'historyPageTab';
	    tabElement.displayName = 'My History';
	    tabElement.type = 0;
	    tabElement.babyId = -1;
	    tabList.push(tabElement);
	    //Add to tab list
	    htmlHistory = '<br><input type=\'button\' value=\'My History\' id=\'historyPageTabLink\'></br>';
	    $('#historyPageTab').hide();
	    
	    $('#leftcolumn').append(htmlHistory);  
	    $('#historyPageTabLink').click(function() {displayTab('historyPageTab')});
	   //end history page
	    
	}
	else if (profile ==="My Baby")
	{
	  //loading Child page
	  
	  	tabList[1] = [];
	  	myBabyCount = 0;
	  
		var htmlMybaby = '';
		htmlMybaby += '<div id=\'mybabyDetailsTab\' class=\'tabScreen\'>';
		htmlMybaby += '<input type=\'button\' value=\'Add my baby\' onclick=\'addMyBaby()\'>';
        htmlMybaby += '<div id=\'addMyBaby\'>';
        htmlMybaby += '</div>';
        htmlMybaby += '<br><br>';
        htmlMybaby += '<input type=\'button\' value=\'Get my baby\' onclick=\'getMyBaby()\'>';
        htmlMybaby += '<div id=\'getMyBaby\'>';
        htmlMybaby += '</div>';
        htmlMybaby += '<br><br>';
		htmlMybaby += '</div>';
		
		$('#target').html('');
	    $('#target').append(htmlMybaby);
	    var tabElement = {};
	    tabElement.tabId = 'mybabyDetailsTab';
	    tabElement.displayName = 'About my baby';
	    tabElement.type = 0;
	    tabElement.babyId = -1;
	    tabList[1][0] = tabElement;  // keep as first Tab
	    
	    //Add to tab list
	    htmlMybaby = '<input type=\'button\' value=\'About my baby\' id=\'mybabyDetailsTabLink\'>';
	    $('#leftcolumn').html('');
	    $('#leftcolumn').append(htmlMybaby);  
	    $('#mybabyDetailsTabLink').click(function() {displayTab('mybabyDetailsTab')});
		
		getMyBabies();
		refreshTabLinks(1); 
	}
	else if (profile === "Midwife")
	{
		tabList[0] = [];
		var htmlBabies = '';
	    htmlBabies += '<div id=\'babiesPageTab\' class=\'tabScreen\'>';
	    htmlBabies += '<input type=\'button\' value=\'Add New Baby\' onclick=\'addNewBaby()\'>';
	    htmlBabies += '<div id=\'addNewBaby\'>';
	    htmlBabies += '</div>';
	    htmlBabies += '<br><br>';
	    
	    htmlBabies += '</div>';
	    $('#target').html('');
	    $('#target').append(htmlBabies);
	    var tabElement = {};
	    tabElement.tabId = 'babiesPageTab';
	    tabElement.displayName = 'About Babies';
	    tabElement.type = 0;
	    tabElement.babyId = -1;
	    //tabList.push(tabElement);
	    tabList[2][0] = tabElement; //keep as first Tab
	    
	    //Add to tab list
	    htmlBabies = '<input type=\'button\' value=\'About Babies\' id=\'babiesPageTabLink\'>';
	    $('#leftcolumn').html('');
	    $('#leftcolumn').append(htmlBabies);  
	    $('#babiesPageTabLink').click(function() {displayTab('babiesPageTab')});
	    getOtherBabies();
	    refreshTabLinks(2);
	   
	  
	   //add mom tab
	    var htmlMoms = '';
		
	    htmlMoms += '<div id=\'momPageTab\' class=\'tabScreen\'>';
	    
	    htmlMoms += '<input type=\'button\' value=\'Add New Mom\' onclick=\'addNewMom()\'>';
	    htmlMoms += '<div id=\'addNewMom\'>';
	    htmlMoms += '</div>';
	    htmlMoms += '<br><br>';
	    
	    htmlMoms += '</div>';
	    //$('#target').html('');
	    $('#target').append(htmlMoms);
	    var tabElement = {};
	    tabElement.tabId = 'momPageTab';
	    tabElement.displayName = 'About Mom';
	    tabElement.type = 0;
	    tabElement.babyId = -1;
	    tabList[2].push(tabElement);
	    //Add to tab list
	    htmlMoms = '<br><input type=\'button\' value=\'About Mom\' id=\'momPageTabLink\'></br>';
	    $('#momPageTab').hide();
	    
	    $('#leftcolumn').append(htmlMoms);  
	    $('#momPageTabLink').click(function() {displayTab('momPageTab')});
	    
	}
}


//login page - enrol to healthhub page

function login()
{
}

//share data with other party - this is a PZH to PZH connection page

function share(){

	alert("Share with others");
}
 
