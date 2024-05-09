window.onload = function() {

    //get elements from html form
    var table = $('#table-results');
    var btnClear = $('#btn-clear');
    var btnRemove = $("#btn-remove");

    
    //handleFooter(); //change footer depending on number of outputted rows

    //clear checkbox in the table on the left
    btnClear.on('click',function(){
        //find last index of table
        last=table.find('tr:last').index();
        //uncheck box
        for(var i=1;i<=last+1;i++){
            $('#checkbox'+i).prop('checked',false);
        }
    });


    //To remove a selected row
    btnRemove.on('click',function(){
        var hidden =$('#hiddenRemove');
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



    //
    //cant find footer so commented out
    //
    // function handleFooter() {
    //     var footer = $("#footer");
    //     // get num of rows
    //     if ($('#table-results tr').length == 101) {
    //         footer.css('display',"''");
    //     } else {
    //         footer.css('display',"none");
    //     }
    // }
}