
function recursaoFormatacao(nome){
    var index = nome.indexOf('_');
    if(index>=0){
        nome = nome.split("");
        nome[index+1] = nome[index+1].toUpperCase();
        nome.splice(index,1);
        nome = nome.join("");
        nome = recursaoFormatacao(nome);
    }

    return nome;
}

function formatarNomeEntidade(nome){
    if(nome.includes("ta_") || nome.includes("td_") || nome.includes("tb_")){
        nome = nome.substring(nome.indexOf('_')+1,nome.length);
    }
    nome = recursaoFormatacao(nome);
    return nome;
}

function parentRecursao(el,numero){

    if(numero==0){
        return el;
    }else{
        el = el.parentElement;
        return parentRecursao(el,--numero);
    }
}
function mudarNomeFile(el){
    el.parentElement.querySelector(".lblFile").innerText = el.files[0].name;
}

function abrirModal(ev,coluna){
    ev.preventDefault();
    var colunaName = coluna;
    var colunaSub = coluna.replace("cod_","");
    var entidade = formatarNomeEntidade(colunaSub);
    console.log(entidade);
    console.log(TITULOMODAL);
    TITULOMODAL.innerText = "Pesquisa de "+MENU[entidade];
    if(ULTIMAENTIDADEMODAL!=entidade){
        CONTEUDOMODAL.innerHTML = `<input type="text" class="form-control filtroModal" placeholder="Filtrar registros de ${MENU[entidade]}" oninput="filtrarModal(this)">`;
        CONTEUDOMODAL.innerHTML += renderTabelaModal(ENTIDADES["/"+entidade]);
        get(entidade,function(resposta){
            DADOS = JSON.parse(resposta);
            CONTEUDOMODAL.querySelector(".tabelaModal").outerHTML = renderTabelaModal(ENTIDADES["/"+entidade],DADOS,colunaName);
            ULTIMAENTIDADEMODAL = entidade;
        },undefined,false);
    }
    $('#modal').modal('show');
}

function selecionar(ev,campo,idt){
    ev.preventDefault();
    document.getElementById(campo).value = idt;
    $('#modal').modal('hide');
}

function filtrar(el){
    let valor = el.value;
    let encontrado = false;
    let trs = document.querySelectorAll(".tabela tbody tr");
    for(let tr of trs){
        encontrado = false;
        for(let i = 0;i<tr.children.length-1;i++){
            let td = tr.children[i];
            if(td.innerText!="null" && td.innerText.toLowerCase().includes(valor.toLowerCase())){
                encontrado = true;
            }
        }
        if(encontrado){
            tr.style.display = "table-row";
        }else{
            tr.style.display = "none";
        }
    }
}


function filtrarModal(el){
    let valor = el.value;
    let encontrado = false;
    let trs = document.querySelectorAll(".tabelaModal tbody tr");
    for(let tr of trs){
        encontrado = false;
        for(let i = 0;i<tr.children.length-1;i++){
            let td = tr.children[i];
            if(td.innerText!="null" && td.innerText.toLowerCase().includes(valor.toLowerCase())){
                encontrado = true;
            }
        }
        if(encontrado){
            tr.style.display = "table-row";
        }else{
            tr.style.display = "none";
        }
    }
}
