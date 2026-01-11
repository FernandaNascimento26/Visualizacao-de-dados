export const scenes = [
    {
        title: "DOSSIÊ: A RUPTURA",
        text: "Iniciando análise forense de metadados interceptados entre Agosto/2022 e Fevereiro/2023.<br><br>Role para baixo para iniciar a investigação.",
        chartType: "intro",
        data: [
            { label: "MENSAGENS", value: 272891 },
            { label: "GRUPOS", value: 301 },
            { label: "LÍDERES", value: 49 }
        ],
        class: "normal"
    },
    {
        title: "Ato 1: O Vocabulário",
        text: "<b>CAMPANHA (Azul):</b> O foco era eleitoral. Falava-se de 'Pesquisas' e 'Debates'.<br><br><b>PÓS-ELEIÇÃO (Vermelho):</b> A ruptura foi total. Termos como 'Selva', 'Quartel' e 'Invasão' dominaram. A política deu lugar à tática de guerrilha.",
        chartType: "butterfly",
        dataLeft: [
            { label: "Pesquisa", value: 890 },
            { label: "Datafolha", value: 760 },
            { label: "Debate", value: 650 },
            { label: "Voto", value: 540 },
            { label: "Mito", value: 430 }
        ],
        dataRight: [
            { label: "SELVA", value: 980 },
            { label: "QUARTEL", value: 920 },
            { label: "INTERVENÇÃO", value: 850 },
            { label: "LADRÃO", value: 780 },
            { label: "INVASÃO", value: 600 }
        ],
        title: "De Eleitores a Soldados",
        colorLeft: "#00f3ff",
        colorRight: "#ff2a6d",
        class: "danger"
    },
    {
        title: "Ato 2: A Rede Dispersa (Pré)",
        text: "Antes da derrota, a rede operava em clusters separados (Comunidades). Havia coordenação, mas ela era descentralizada. Passe o mouse sobre os nós para ver os IDs e grupos.",
        chartType: "network",
        period: "p1", // <--- Chama dados da PRÉ-ELEIÇÃO
        title: "Rede Pré-Eleição (Agosto-Outubro)",
        class: "normal" // Cor azul/normal
    },
    {
        title: "Ato 3: A Radicalização (Pós)",
        text: "O cenário muda drasticamente. Os líderes (nós maiores) aglutinam a rede. Diferentes comunidades se fundem em um 'Super-Cluster' para maximizar o dano. A rede virou uma arma única.",
        chartType: "network",
        period: "p2", // <--- Chama dados da PÓS-ELEIÇÃO
        title: "Rede Pós-Eleição (Novembro-Fevereiro)",
        class: "danger" // Cor vermelha/perigo
    },
    {
        title: "Ato 2: Os Arquitetos (Líderes)",
        text: "Quem está por trás do caos? No Pós-Eleição, 5 perfis concentraram 40% de toda a coordenação. O líder 'ef49' (Tocantins) emergiu do nada para se tornar o general da rede.",
        chartType: "leader",
        title: "Top 5 Líderes - Pós Eleição",
        color: "#ff2a6d",
        data: [
            { label: "Agente TO (ef49...)", value: 764 },
            { label: "Agente TO (4ea1...)", value: 652 },
            { label: "Agente PB (b624...)", value: 261 },
            { label: "Agente DF (36de...)", value: 247 },
            { label: "Agente RJ (cebd...)", value: 133 }
        ],
        class: "danger"
    },
    {
        title: "Ato 3: O Laboratório de Mentiras",
        text: "Não é apenas volume, é toxicidade. Analisamos o 'Score de Desinformação' das comunidades. As bolhas verdes brilham onde a desinformação foi mais intensa. Note como grupos menores foram os mais tóxicos.",
        chartType: "bubble",
        title: "Intensidade de Desinformação por Grupo",
        // Dados simulados baseados na estrutura dos seus CSVs
        data: [
            { id: "Grupo 25", volume: 5000, score: 95 }, // Muito tóxico
            { id: "Grupo 13", volume: 3000, score: 80 },
            { id: "Grupo 2", volume: 2500, score: 40 },
            { id: "Grupo 41", volume: 1000, score: 90 },
            { id: "Grupo 9", volume: 4000, score: 20 },  // Menos tóxico
            { id: "Grupo 60", volume: 800, score: 85 },
            { id: "Grupo 6", volume: 1200, score: 30 },
            { id: "Grupo 5", volume: 1500, score: 50 }
        ],
        class: "danger"
    },
    {
        title: "Ato 4: A Força Centrípeta (Core/Periferia)",
        text: "A estrutura mudou. No pré-eleição, a maioria era 'Periferia' (Cinza). No Pós, eles foram sugados para o 'Core' (Vermelho). O centro do alvo ficou superpovoado, indicando centralização de comando.",
        chartType: "target",
        title: "Estrutura Topológica: Pós-Eleição",
        // Gerando 50 pontos aleatórios para visualizar a massa
        data: Array.from({length: 80}, (_, i) => ({
            id: i,
            // 40% Core, 60% Periferia (Simulação da sua métrica k-core)
            role: i < 35 ? "Core" : "Periphery" 
        })),
        class: "danger"
    },
    {
        title: "Ato 4: O QG Oculto",
        text: "Todos olhavam para Brasília ou SP. Errado. O comando operacional (Core) migrou para bunkers regionais. A <b>Paraíba</b> tornou-se o epicentro ideológico.",
        chartType: "map",
        title: "Líderes Ativos por Estado",
        activeStates: [
            { sigla: "SP", value: 9, type: "old" },
            { sigla: "PB", value: 17, type: "new" },
            { sigla: "TO", value: 8, type: "new" },
            { sigla: "DF", value: 4, type: "new" }
        ],
        class: "danger"
    }
];