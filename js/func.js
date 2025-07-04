document.addEventListener('DOMContentLoaded', function() {
    const tarefaInput = document.getElementById('tarefaInput');
    const adicionarBtn = document.getElementById('adicionarBtn');
    const listaTarefas = document.getElementById('listaTarefas');
    const todasBtn = document.getElementById('todasBtn');
    const ativasBtn = document.getElementById('ativasBtn');
    const completasBtn = document.getElementById('completasBtn');
    const contador = document.getElementById('contador');
    const limparCompletasBtn = document.getElementById('limparCompletasBtn');
    
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    let filtroAtual = 'todas';
    
    // Carrega as tarefas ao iniciar
    renderizarTarefas();
    
    // Adicionar nova tarefa
    adicionarBtn.addEventListener('click', adicionarTarefa);
    tarefaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adicionarTarefa();
        }
    });
    
    // Filtros
    todasBtn.addEventListener('click', () => atualizarFiltro('todas'));
    ativasBtn.addEventListener('click', () => atualizarFiltro('ativas'));
    completasBtn.addEventListener('click', () => atualizarFiltro('completas'));
    
    // Limpar tarefas completas
    limparCompletasBtn.addEventListener('click', limparCompletas);
    
    function adicionarTarefa() {
        const texto = tarefaInput.value.trim();
        if (texto) {
            const novaTarefa = {
                id: Date.now(),
                texto,
                completa: false
            };
            
            tarefas.push(novaTarefa);
            salvarTarefas();
            renderizarTarefas();
            tarefaInput.value = '';
        }
    }
    
    function renderizarTarefas() {
        listaTarefas.innerHTML = '';
        
        const tarefasFiltradas = tarefas.filter(tarefa => {
            if (filtroAtual === 'ativas') return !tarefa.completa;
            if (filtroAtual === 'completas') return tarefa.completa;
            return true;
        });
        
        if (tarefasFiltradas.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Nenhuma tarefa encontrada';
            li.style.justifyContent = 'center';
            li.style.color = '#888';
            listaTarefas.appendChild(li);
        } else {
            tarefasFiltradas.forEach(tarefa => {
                const li = document.createElement('li');
                if (tarefa.completa) li.classList.add('completa');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = tarefa.completa;
                checkbox.addEventListener('change', () => toggleCompleta(tarefa.id));
                
                const span = document.createElement('span');
                span.textContent = tarefa.texto;
                
                const button = document.createElement('button');
                button.innerHTML = '&times;';
                button.addEventListener('click', () => removerTarefa(tarefa.id));
                
                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(button);
                listaTarefas.appendChild(li);
            });
        }
        
        atualizarContador();
    }
    
    function toggleCompleta(id) {
        tarefas = tarefas.map(tarefa => 
            tarefa.id === id ? {...tarefa, completa: !tarefa.completa} : tarefa
        );
        salvarTarefas();
        renderizarTarefas();
    }
    
    function removerTarefa(id) {
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);
        salvarTarefas();
        renderizarTarefas();
    }
    
    function limparCompletas() {
        tarefas = tarefas.filter(tarefa => !tarefa.completa);
        salvarTarefas();
        renderizarTarefas();
    }
    
    function atualizarFiltro(filtro) {
        filtroAtual = filtro;
        
        todasBtn.classList.remove('ativo');
        ativasBtn.classList.remove('ativo');
        completasBtn.classList.remove('ativo');
        
        if (filtro === 'todas') todasBtn.classList.add('ativo');
        if (filtro === 'ativas') ativasBtn.classList.add('ativo');
        if (filtro === 'completas') completasBtn.classList.add('ativo');
        
        renderizarTarefas();
    }
    
    function atualizarContador() {
        const contagem = tarefas.filter(tarefa => !tarefa.completa).length;
        contador.textContent = `${contagem} ${contagem === 1 ? 'item' : 'itens'} restantes`;
    }
    
    function salvarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
});