function sendRequest(){
    let title = $('#title').val();
    let phoneNumber = $('#phoneNumber').val();
    let message = $('#message').val();
    console.log(title);console.log(phoneNumber);console.log(message);

    $.ajax({  
        url:"/postMessage/fake",  
        method:"POST",  
        data:{title:title, phoneNumber:phoneNumber, message:message, category:'covid'},  
        success:function(data){  
           location.href = data.url;
        }  
   });
}

function approve(uuid){
    $.ajax({  
        url:"/dashboard/approve",  
        method:"POST",  
        data:{messageId:uuid},  
        success:function(data){  
           
        }  
   });
   location.reload();
}

function reject(uuid){
    $.ajax({  
        url:"/dashboard/delete",  
        method:"POST",  
        data:{messageId:uuid},  
        success:function(data){  
         
        }  
   });
   location.reload();
}