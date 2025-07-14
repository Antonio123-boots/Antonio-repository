// Aguarda o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o campo de texto da tarefa
    const tarefaInput = document.getElementById('tarefaInput');
    // Seleciona o botão de adicionar
    const adicionarBtn = document.getElementById('adicionarBtn');
    // Seleciona a lista de tarefas
    const listaTarefas = document.getElementById('listaTarefas');
    // Seleciona o botão de filtro "todas"
    const todasBtn = document.getElementById('todasBtn');
    // Seleciona o botão de filtro "ativas"
    const ativasBtn = document.getElementById('ativasBtn');
    // Seleciona o botão de filtro "completas"
    const completasBtn = document.getElementById('completasBtn');
    // Seleciona o contador de tarefas
    const contador = document.getElementById('contador');
    // Seleciona o botão de limpar completas
    const limparCompletasBtn = document.getElementById('limparCompletasBtn');
    
    // Recupera as tarefas do localStorage ou inicia vazio
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    // Define o filtro atual
    let filtroAtual = 'todas';
    
    // Carrega as tarefas ao iniciar
    renderizarTarefas();

    // Seleciona o botão de tema
    const temabtn = document.getElementById('temabtn');

    // Define o tema atual, padrão é 'dark'
    const temaatual = localStorage.getItem('modo') || 'dark';

    //Aplica o tema salvo ao carregar a página
    if (temaatual === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        temabtn.style.background = '#111'; // preto
        temabtn.textContent = '🌙'; //mostra a lua quando for o modo claro
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        temabtn.style.background = '#111'; // preto
        temabtn.textContent = '🌓'; //mostra o sol quando for o modo escuro
    }

    //função para alternar o tema
    function alternarTema() {
        let temaatual = localStorage.getItem('modo') || 'dark';
        if (temaatual === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            temabtn.style.background = '#111'; // preto
            temabtn.textContent = '🌙';
            localStorage.setItem('modo', 'light'); //salva o tema claro
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            temabtn.style.background = '#111'; // preto
            temabtn.textContent = '🌓';
            localStorage.setItem('modo', 'dark'); //salva o tema escuro
        }
    }

    

    //Adiciona o evento ao clique do botão tema
    temabtn.addEventListener('click', alternarTema);

    // Se o usuário preferir tema claro, aplica o tema claro apenas se não houver tema salvo
    if (!localStorage.getItem('modo') && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.setAttribute('data-theme', 'light');
        temabtn.textContent = '🌙';
        localStorage.setItem('modo', 'light');
    }

    // Evento para adicionar nova tarefa ao clicar no botão
    adicionarBtn.addEventListener('click', adicionarTarefa);
    // Evento para adicionar nova tarefa ao pressionar Enter
    tarefaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adicionarTarefa();
        }
    });
    
    // Eventos dos filtros
    todasBtn.addEventListener('click', () => atualizarFiltro('todas'));
    ativasBtn.addEventListener('click', () => atualizarFiltro('ativas'));
    completasBtn.addEventListener('click', () => atualizarFiltro('completas'));
    // Garante que apenas um botão de filtro fique ativo ao iniciar
    atualizarFiltro(filtroAtual);
    
    // Evento para limpar tarefas completas
    limparCompletasBtn.addEventListener('click', limparCompletas);
    
    // Função para adicionar uma nova tarefa
    function adicionarTarefa() {
        // Pega o texto do input e remove espaços
        const texto = tarefaInput.value.trim();
        if (texto) {
            // Cria objeto da nova tarefa
            const novaTarefa = {
                id: Date.now(), // ID único
                texto, // Texto da tarefa
                completa: false // Status inicial
            };
            
            // Adiciona a tarefa ao array
            tarefas.push(novaTarefa);
            // Salva no localStorage
            salvarTarefas();
            // Atualiza a lista na tela
            renderizarTarefas();
            // Limpa o campo de texto
            tarefaInput.value = '';
        }
    }
    
    // Função para renderizar as tarefas na tela
    function renderizarTarefas() {
        // Limpa a lista
        listaTarefas.innerHTML = '';
        
        // Filtra as tarefas conforme o filtro atual
        const tarefasFiltradas = tarefas.filter(tarefa => {
            if (filtroAtual === 'ativas') return !tarefa.completa;
            if (filtroAtual === 'completas') return tarefa.completa;
            return true;
        });
        
        // Se não houver tarefas, mostra mensagem
        if (tarefasFiltradas.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Nenhuma tarefa encontrada';
            li.style.justifyContent = 'center';
            li.style.color = '#888';
            listaTarefas.appendChild(li);
        } else {
            // Para cada tarefa filtrada, cria o elemento na lista
            tarefasFiltradas.forEach(tarefa => {
                const li = document.createElement('li');
                if (tarefa.completa) li.classList.add('completa');
                
                // Cria o checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = tarefa.completa;
                // Evento para marcar/desmarcar tarefa
                checkbox.addEventListener('change', () => toggleCompleta(tarefa.id));
                
                // Cria o texto da tarefa
                const span = document.createElement('span');
                span.textContent = tarefa.texto;
                
                // Cria o botão de remover
                const button = document.createElement('button');
                button.innerHTML = '&times;';
                // Evento para remover tarefa
                button.addEventListener('click', () => removerTarefa(tarefa.id));
                
                // Adiciona os elementos ao item da lista
                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(button);
                listaTarefas.appendChild(li);
            });
        }
        
        // Atualiza o contador de tarefas
        atualizarContador();
    }
    
    // Função para alternar o status de completa
    function toggleCompleta(id) {
        tarefas = tarefas.map(tarefa => 
            tarefa.id === id ? {...tarefa, completa: !tarefa.completa} : tarefa
        );
        salvarTarefas();
        renderizarTarefas();
    }
    
    // Função para remover uma tarefa
    function removerTarefa(id) {
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);
        salvarTarefas();
        renderizarTarefas();
    }
    
    // Função para limpar todas as tarefas completas
    function limparCompletas() {
        tarefas = tarefas.filter(tarefa => !tarefa.completa);
        salvarTarefas();
        renderizarTarefas();
    }
    
    // Função para atualizar o filtro
    function atualizarFiltro(filtro) {
        filtroAtual = filtro;
        // Remove classe ativo de todos os botões
        todasBtn.classList.remove('ativo');
        ativasBtn.classList.remove('ativo');
        completasBtn.classList.remove('ativo');
        // Adiciona classe ativo ao botão selecionado
        if (filtro === 'todas') {
            todasBtn.classList.add('ativo');
            todasBtn.style.background = '#111';
            todasBtn.style.color = '#fff';
            ativasBtn.style.background = '';
            ativasBtn.style.color = '';
            completasBtn.style.background = '';
            completasBtn.style.color = '';
        } else if (filtro === 'ativas') {
            ativasBtn.classList.add('ativo');
            ativasBtn.style.background = '#111';
            ativasBtn.style.color = '#fff';
            todasBtn.style.background = '';
            todasBtn.style.color = '';
            completasBtn.style.background = '';
            completasBtn.style.color = '';
        } else if (filtro === 'completas') {
            completasBtn.classList.add('ativo');
            completasBtn.style.background = '#111';
            completasBtn.style.color = '#fff';
            todasBtn.style.background = '';
            todasBtn.style.color = '';
            ativasBtn.style.background = '';
            ativasBtn.style.color = '';
        }
        // Atualiza a lista
        renderizarTarefas();
    }
    
    // Função para atualizar o contador de tarefas
    function atualizarContador() {
        const contagem = tarefas.filter(tarefa => !tarefa.completa).length;
        contador.textContent = `${contagem} ${contagem === 1 ? 'item' : 'itens'} restantes`;
    }
    

    // Seleciona o botão de cor azul
    const mudarCor = document.getElementById('mudarCor');
    // Aplica o tema azul se estiver salvo
    const temaAzul = localStorage.getItem('tema') === 'azul';
    if (temaAzul) {
        document.documentElement.classList.add('tema-azul');
        mudarCor.textContent = 'Padrão';
    } else {
        document.documentElement.classList.remove('tema-azul');
        mudarCor.textContent = 'Azul';
    }

    function alternarAzul() {
        const temaAzul = localStorage.getItem('tema') === 'azul';
        if (temaAzul) {
            document.documentElement.classList.remove('tema-azul');
            localStorage.setItem('tema', 'padrao');
            mudarCor.textContent = 'Azul';
        } else {
            document.documentElement.classList.add('tema-azul');
            localStorage.setItem('tema', 'azul');
            mudarCor.textContent = 'Padrão';
        }
    }
    mudarCor.addEventListener('click', alternarAzul);


    
    // Função para salvar as tarefas no localStorage
    function salvarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
});