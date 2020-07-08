function requestLogin(ev){
    ev.preventDefault();
    console.log("entrou!");
    var usuario = document.getElementById("inputEmail").value;
    var senha = document.getElementById("inputPassword").value;
    get("login?username="+usuario+"&password="+senha,function(resposta){
        get("/entidadesistema",function(resposta){
            ENTIDADES = JSON.parse(resposta);
        });
        renderMenu();
    });
}

function requestLogout(ev){
    ev.preventDefault();
    console.log("Saiu!");
    get("logout",function(resposta){
        renderLogin();
    });
}

function requestExcluir(el,idt,tabela){
    del(formatarNomeEntidade(tabela)+"/"+idt,function(resposta){
        el = parentRecursao(el,2);
        el.parentElement.removeChild(el);
    });
}

function requestForm(event,item,idt){
    event.preventDefault();
    var files = event.target.querySelectorAll("input[type=file]");
    var multi = false;
    var form = new FormData(event.target);
    if(files.length>0){
        multi = true;
    }else{
        var json = {};
        for(var data of form){
            json[data[0]] = data[1];
        }
        form = JSON.stringify(json);
    }
    
    if(idt==undefined){
        post(item,form,()=>{
            redirecionar(item);
        },(error)=>{
            console.log(error);
            document.getElementById("error").innerText = "Ocorreu um erro ao salvar o formulário!";
        },false,multi);
    }else{
        put(item+"/"+idt,form,()=>{
            redirecionar(item);
        },(error)=>{
            console.log(error);
            document.getElementById("error").innerText = "Ocorreu um erro ao salvar o formulário!";
        },false,multi);
    }
}