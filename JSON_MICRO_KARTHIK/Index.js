var jpdbBaseURL="http://api.login2xplore.com:5577";
var jpdbIRL="/api/irl";
var jpdbIML="/api/iml";
var stuDBName="SCHOOL-DB";
var stuRelationName="STUDENT-TABLE";
var connToken="90932643|-31949276020862206|90948730";

$("#roll").focus();

function saveRecNo2LS(jsonObj){
    var lvData=JSON.parse(jsonObj.data);
    localStorage.set("recno",lvData.rec_no);
}

function getrollAsJsonObj(){
    var roll= $("#roll").val();
    var jsonStr={id:roll};
    return JSON.stringify(jsonStr);

}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record=JSON.parse(jsonObj.data).record;
    $("#name").val(record.name);
    $("#class").val(record.class);
    $("#bday").val(record.bday);
    $("#addr").val(record.addr);
    $("#edate").val(record.edate);
}


function validateData() {
    var rollVar = $("#roll").val();
    if (rollVar === "") {
    alert("Roll-No is Required Value");
    $("#roll").focus();
    return "";
    }
    var nameVar = $("#name").val();
    if (nameVar === "") {
    alert("Full-Name is Required Value");
    $("#name").focus();
    return "";
    }
    var classVar = $("#class").val();
    if (classVar === "") {
    alert("Class is Required Value");
    $("#class").focus();
    return "";
    }
    var bdayVar = $("#bday").val();
    if (bdayVar === "") {
    alert("Birth-Day is Required Value");
    $("#bday").focus();
    return "";
    }
    var addrVar = $("#addr").val();
    if (addrVar === "") {
    alert("Address is Required Value");
    $("#addr").focus();
    return "";
    }
    var edateVar = $("#edate").val();
    if (edateVar === "") {
    alert("Enrollment-Date is Required Value");
    $("#edate").focus();
    return "";
    }
    var jsonStrObj = {
    stuid: rollVar,
    stuname: nameameVar,
    stuclass: classVar,
    stubday: bdayVar,
    stuaddr: addrVar,
    stuedate: edateVar,
};
return JSON.stringify(jsonStrObj);
}
// This method is used to create PUT Json request.
function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
    + "\"token\" : \""
    + connToken
    + "\","
    + "\"dbName\": \""
    + dbName
    + "\",\n" + "\"cmd\" : \"PUT\",\n"
    + "\"rel\" : \""
    + relName + "\","
    + "\"jsonStr\": \n"
    + jsonObj
    + "\n"
    + "}";
    return putRequest;
}
function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
    jsonObj = JSON.parse(result);
    }).fail(function (result) {
    var dataJsonObj = result.responseText;
    jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}
function resetForm() {
    $("#roll").val("")
    $("#name").val("");
    $("#class").val("");
    $("#bday").val("");
    $("#addr").val("");
    $("#edate").val("");
    $("#roll").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#roll").focus();
}



function getstu(){
    var stuIdJsonObj=getrollAsJsonObj();
    var getRequest=createGET_BY_KEYRequest(connToken,stuDBName,stuRelationName,stuIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status === 400){
        $("#save").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#name").focus();
    }else if(resJsonObj.status === 200){
        $("#roll").prop("disabled",true);
        fillData(resJsonObj);
        $("#change").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#name").focus();
    }

}

function saveData() {
    var jsonStr = validateData();
    if (jsonStr === "") {
    return;
    }
    var putReqStr = createPUTRequest(connToken,jsonStr, stuDBName, stuRelationName);
    alert(putReqStr);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,jpdbBaseURL, jpdbIML);
    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({async: true});
    resetForm();
}

function changeData(){
    $("#change").prop("disabled",true);
    jsonChg=validateData();
    var updateRequest=createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $("#roll").focus();
}