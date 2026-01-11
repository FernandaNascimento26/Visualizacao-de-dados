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