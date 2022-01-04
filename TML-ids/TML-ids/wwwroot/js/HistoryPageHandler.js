function DeleteRecordEvent()
{
    $(".fa-trash-alt").on("click", function (){
        let id= $(this).attr("data-id");
        $("#deleted-record").val(id);
        
    })
}
document.addEventListener("DOMContentLoaded", function () {
    DeleteRecordEvent();
});