// CONSTANTES USADOS EM REQUISIÇÕES
var LOADING = document.getElementById("loading");
LOADING.style.display = "none";


function get(url,confirm,error,load){
    request("GET",url,confirm,error,undefined,load);
}

function post(url,body,confirm,error,load,multi){
    request("POST",url,confirm,error,body,load,multi);
}

function del(url,confirm,error,load){
    request("DELETE",url,confirm,error,undefined,load);
}

function put(url,body,confirm,error,load,multi){
    request("PUT",url,confirm,error,body,load,multi);
}

function request(metodo,url,confirm, error,body,load,multi){
    
    LOADING.style.display = load==undefined&&!load?"block":"none";
    console.log(load);
    url = url[0]!='/'?'/'+url:url;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState==4){
            switch(this.status){
                case 200:
                    confirm(this.responseText,this.status);
                    break;
                case 401:
                    renderLogin();
                    break;
                default:
                    if(error!=null&&error!=undefined){
                        error(this.responseText,this.status);
                    }
            }
            LOADING.style.display = "none";
        }
    }
    xhttp.open(metodo,HOSTAPI+url);
    if(multi==undefined || !multi){
        xhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    }
    xhttp.withCredentials = true;
    if(body==undefined || body==null){
        xhttp.send();
    }else{
        xhttp.send(body);
    }
}