function renderLogin(){
    TITLE.innerHTML = "Página de Login";
    window.history.pushState("", "Página de Login", "/login");
    BODY.innerHTML=`<form onsubmit="requestLogin(event)" class="form-signin">
        <img class="mb-4" src="Logo.png" alt="" width="72" height="72">
        
        <label for="inputEmail" class="sr-only">Usuário</label>
        <input type="text" id="inputEmail" class="form-control" placeholder="Usuário" required="" autofocus="">
        
        <label for="inputPassword" class="sr-only">Senha</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Senha" required=""><br/>

        <button class="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>

        <p class="mt-5 mb-3 text-muted">© 2020</p>
  </form>`;
}

function renderMenu(){
    BODY.innerHTML=`
        <div id="scrollMenu">
            <ul id="menu">
                <li><a><div class='spinner-border'></div></a></li>
            </ul>
        </div>
        <div id="conteudo"></div>
    `;
    get("menu",function(resultado){
        resultado = JSON.parse(resultado);
        document.getElementById("scrollMenu").innerHTML=`
            <ul id="menu">
                <li id="informUser"></li>
            ${resultado.map(item=>`<li onclick="redirecionar('${item}')"><a>${MENU[item]==undefined?item:MENU[item]}</a></li>`).join("")}
            </ul>
        `;
        document.getElementById("informUser").innerHTML = "<div class='spinner-border'>";
        get("user",function(resultado){
            resultado = JSON.parse(resultado);
            document.getElementById("informUser").innerHTML = "Bem-vindo "+resultado.nme_usuario_interno+"<br/>"+resultado.eml_usuario_interno;
        },undefined,false);
    },undefined,false);
    
}

function redirecionar(item){
    TITLE.innerHTML = MENU[item];
    console.log(item);
    if(MENU[item]==undefined){
        renderLogin();
    }
    window.history.pushState("", "Página de "+MENU[item], item);
    CONTEUDO = document.getElementById("conteudo");
    CONTEUDO.innerHTML = `
        <button onclick="requestLogout(event)" class="btnSair btn btn-dark">Sair</button>    
        <br/>
        <h1 style="text-align:center">${MENU[item]}</h1>
        <button onclick="renderForm('${item}')" class="btnCreate btn btn-dark">Criar ${MENU[item]}</button>
    `;
    CONTEUDO.innerHTML += `<input type="text" class="form-control filtro" placeholder="Filtrar registros de ${MENU[item]}" oninput="filtrar(this)">`;
    CONTEUDO.innerHTML += renderTabela(ENTIDADES["/"+item]);
    get(item,function(resposta){
        DADOS = JSON.parse(resposta);
        CONTEUDO.querySelector(".tabela").outerHTML = renderTabela(ENTIDADES["/"+item],DADOS);
    },undefined,false);
}



function renderTabela(tabela,dados){
    var colunas = "";
    var linhas = "";
    for(let i = 0;i<tabela.length;i++){
        colunas += '<th scope="col">'+(DICIONARIO[tabela[i].COLUMN_NAME]!=undefined?DICIONARIO[tabela[i].COLUMN_NAME]:tabela[i].COLUMN_NAME)+'</th>';
    }
    colunas += '<th scope="col"  style="text-align:center">Operações</th>';
    if(dados!=undefined){
        if(dados.length==0){
            linhas = "<tr><td colspan='1000' style='text-align:center'>Nenhum registro encontrado</td><tr>";
        }
        for(let j = 0;j<dados.length;j++){
            linhas += "<tr>";
            var colunaIDT = "";
            var tabelaName = "";
            for(let i = 0;i<tabela.length;i++){
                if(tabela[i].COLUMN_KEY=="PRI"){
                    colunaIDT = tabela[i].COLUMN_NAME;
                    tabelaName = tabela[i].TABLE_NAME;
                }
                if(tabela[i].COLUMN_NAME.startsWith("img")){
                    let url = HOSTAPI+"/imagem?file="+dados[j][tabela[i].COLUMN_NAME];
                    linhas += "<td><img style='width:100px;height:100px' src='"+url+"'></td>";
                }else{
                    linhas += "<td>"+dados[j][tabela[i].COLUMN_NAME]+"</td>";
                }
            }
            linhas += "<td style='text-align:center'>"
            +"<button class='btn btn-light' onclick=\"renderForm('"+formatarNomeEntidade(tabelaName)+"',"+dados[j][colunaIDT]+","+j+")\" style='margin-right: 5px;'>Editar</button>"
            +"<button class='btn btn-light' onclick='requestExcluir(this,"+dados[j][colunaIDT]+",\""+tabelaName+"\")'>Excluir</button></td></tr>";
        }
    }else{
        linhas = "<tr><td colspan='1000' style='text-align:center'><div class='spinner-border'></div></td><tr>";
    }
    return `<table class="tabela table table-striped table-dark">
                <thead>
                    <tr>
                        ${colunas}
                    </tr>
                </thead>
                <tbody>
                    ${linhas}
                </tbody>
            </table>`
}

function renderTabelaModal(tabela,dados,coluna){
    var colunas = "";
    var linhas = "";
    for(let i = 0;i<tabela.length;i++){
        colunas += '<th scope="col">'+(DICIONARIO[tabela[i].COLUMN_NAME]!=undefined?DICIONARIO[tabela[i].COLUMN_NAME]:tabela[i].COLUMN_NAME)+'</th>';
    }
    colunas += '<th scope="col"  style="text-align:center">Operações</th>';
    if(dados!=undefined){
        if(dados.length==0){
            linhas = "<tr><td colspan='1000' style='text-align:center'>Nenhum registro encontrado</td><tr>";
        }
        for(let j = 0;j<dados.length;j++){
            linhas += "<tr>";
            var colunaIDT = "";
            var tabelaName = "";
            for(let i = 0;i<tabela.length;i++){
                if(tabela[i].COLUMN_KEY=="PRI"){
                    colunaIDT = tabela[i].COLUMN_NAME;
                    tabelaName = tabela[i].TABLE_NAME;
                }
                if(tabela[i].COLUMN_NAME.startsWith("img")){
                    let url = HOSTAPI+"/imagem?file="+dados[j][tabela[i].COLUMN_NAME];
                    linhas += "<td><img style='width:100px;height:100px' src='"+url+"'></td>";
                }else{
                    linhas += "<td>"+dados[j][tabela[i].COLUMN_NAME]+"</td>";
                }
            }
            linhas += "<td style='text-align:center'>"
            +"<button class='btn btn-light' onclick=\"selecionar(event,'"+coluna+"',"+dados[j][colunaIDT]+")\" style='margin-right: 5px;'>Selecionar</button>";
        }
    }else{
        linhas = "<tr><td colspan='1000' style='text-align:center'><div class='spinner-border'></div></td><tr>";
    }
    return `<table class="tabelaModal table table-striped table-dark">
                <thead>
                    <tr>
                        ${colunas}
                    </tr>
                </thead>
                <tbody>
                    ${linhas}
                </tbody>
            </table>`
}

function renderForm(item,idt,index){
    var entidade = index==undefined?undefined: DADOS[index];
    var entidades = ENTIDADES["/"+item];
    CONTEUDO.innerHTML = `
        <h1 style="text-align:center">${MENU[item]}</h1>
        <form onsubmit="${entidade==undefined?`requestForm(event,'${item}')`:`requestForm(event,'${item}',${idt})`}">
            ${entidades.map(item=>{
                if(item.COLUMN_KEY!="PRI"){
                    var texto = `<div class="col-sm-6 input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">${DICIONARIO[item.COLUMN_NAME]!=undefined?DICIONARIO[item.COLUMN_NAME]:item.COLUMN_NAME}</span>
                                    </div>
                                    `;
                    switch(item.DATA_TYPE){
                        case "varchar":
                            texto+= `<input ${entidade==undefined?'':`value='${entidade[item.COLUMN_NAME]}'`} ${item.IS_NULLABLE=="NO"?"required":""} type="text" name="${item.COLUMN_NAME}" class="form-control">`
                            break;
                        case "text":
                            if(item.COLUMN_NAME.startsWith("img")){
                                texto+=`<label class="lblFile form-control" for="${item.COLUMN_NAME}">CLICK AQUI</label>
                                <input style="display:none" onchange="mudarNomeFile(this)" ${entidade==undefined?'':`value='${entidade[item.COLUMN_NAME]}'`} ${item.IS_NULLABLE=="NO"?"required":""} type="file" name="${item.COLUMN_NAME}" id="${item.COLUMN_NAME}" class="form-control">`;
                            }else{
                                texto+= `<textarea ${item.IS_NULLABLE=="NO"?"required":""} name="${item.COLUMN_NAME}" class="form-control">${entidade==undefined?'':`${entidade[item.COLUMN_NAME]}`}</textarea>`
                            }
                            break;
                        case "int":
                            if(item.COLUMN_KEY=="MUL"){
                                texto+=`<input id="${item.COLUMN_NAME}" readonly ${entidade==undefined?'':`value='${entidade[item.COLUMN_NAME]}'`} ${item.IS_NULLABLE=="NO"?"required":""} type="number" name="${item.COLUMN_NAME}" class="form-control">
                                <button class="btn btn-dark" onclick="abrirModal(event,'${item.COLUMN_NAME}')">Procurar</button>`;
                                break;
                            }
                        case "decimal":
                        case "double":
                            texto+= `<input step="any" ${entidade==undefined?'':`value='${entidade[item.COLUMN_NAME]}'`} ${item.IS_NULLABLE=="NO"?"required":""} type="number" name="${item.COLUMN_NAME}" class="form-control">`;
                            break;
                        case "datetime":
                            texto+=`<input ${entidade==undefined?'':`value='${entidade[item.COLUMN_NAME]}'`} ${item.IS_NULLABLE=="NO"?"required":""} type="datetime-local" name="${item.COLUMN_NAME}" class="form-control">`;
                            break;
                    }
                    texto+= `</div>`;
                    return texto;
                }
            }).join('')}
            <div style="clear:both" class="group-salvar">
                <button class="btn btn-dark">Salvar ${MENU[item]}</button>
                <button class="btn btn-dark" onclick="redirecionar('${item}')">Voltar</button>
            </div>
            <div style="clear:both" class="group-salvar">
                <div id="error" style="color:darkred"></div>
            </div>
        </form>`;
}