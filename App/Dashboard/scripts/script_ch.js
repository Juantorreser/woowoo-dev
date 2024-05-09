window.onload = function() {

    //get elements from html form
    var table = $('#table-results');
    var btnClear = $('#btn-clear');
    var btnEnable = $("#btn-enable");
    var btnDisable = $("#btn-disable");
    var btnRemove =  $("#btn-remove");
    //var selectVisibilityFilter = $("#select-visibility-filter");

    

    //clear checkbox in the table on the left
    btnClear.on('click',function(){
        //find last index of table
        last=table.find('tr:last').index();
        //uncheck box
        for(var i=1;i<=last+1;i++){
            $('#checkbox'+i).prop('checked',false);
        }
    })



    //To enable user
    btnEnable.on('click',function(){
        var hidden = $('#hiddenEnable');
        var checkedIDs = getCheckedIDs();
        var result = "";
        for (var i = 0; i < checkedIDs.length; i++) {
            result += checkedIDs[i];
            if (i != checkedIDs.length - 1) {
                result += ",";
            }
        }
        hidden.val(result);
    })


    //To disable user
    btnDisable.on('click',function(){
        var hidden = $('#hiddenDisable');
        var checkedIDs = getCheckedIDs();
        var result = "";
        for (var i = 0; i < checkedIDs.length; i++) {
            result += checkedIDs[i];
            if (i != checkedIDs.length - 1) {
                result += ",";
            }
        }
        hidden.val(result);
    })




    //To remove a user
    btnRemove.on('click',function(){
        var hidden = $('#hiddenRemove');
        var checkedIDs = getCheckedIDs();
        var result = "";
        for (var i = 0; i < checkedIDs.length; i++) {
            result += checkedIDs[i];
            if (i != checkedIDs.length - 1) {
                result += ",";
            }
        }
        //Confirm with admin if actually want to remove
        if (result != "") {
            var txt;
            var r = confirm("Are you sure you want to remove the rows with the following IDs?\n" + result);
            if (r == true) {
                txt = "true";
                hidden.val(result);
            } else {
                txt = "false";
                hidden.val("");
            }
        } else {
            alert("You must select rows before deletion");
        }
    })



    // Get IDs where the checkbox is checked
    function getCheckedIDs() {
        var checked = [];
        last=table.find('tr:last').index();
        //loop through each row to see if checked
        for(var i=1;i<=last+1;i++){
            if($('#checkbox'+i).is(':checked')){
                checked.push(i);
            }
        }
        return checked;
    }


    //Logic is weird so correct version in client,php
    //still modified and kept this version
    //check which is selected (Show all, Enabled, Disabled)
    // selectVisibilityFilter.change(function(){
    //     //Variable text is the selected option
    //     var text = selectVisibilityFilter.val();
    //     if (text == "Show All") {
    //         for (var i = 1; i<=table.find('tr:last').index()+1; i++) {
    //             $('#row-data'+i).css('display',"''");
    //         }
    //     } else {
    //         for (var i = 0; i<table.find('tr:last').index()+1; i++) {
    //             var status = table.find('tr').find('td:eq(6)')[i];
    //             var rownum=1;
    //             if (status.innerHTML == text) {
    //                 $('#row-data'+rownum).css('display',"''");
    //             } else {
    //                 $('#row-data'+rownum).css('display',"none");
    //             }
    //             rownum++;
    //         }
    //     }
    // })
}