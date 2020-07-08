function verificarRota(){
    console.log(PATH);
    switch(PATH){
        case "/":
        case "":
        case "/login":
            renderLogin();
            break;
        case "/menu":
            renderMenu();
            break;
        default:
            get("/entidadesistema",function(resposta){
                ENTIDADES = JSON.parse(resposta);
                console.log(ENTIDADES);
                if(PATH!="" && PATH!="/" && PATH!="/login"){
                    renderMenu();
                    setTimeout(function(){
                        redirecionar(PATH.substring(1,PATH.length));
                    },2000);
                }
            });
    }
}
verificarRota();