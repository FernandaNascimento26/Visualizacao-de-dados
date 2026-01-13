export const scenes = [
    {
        title: "DOSSIÊ: Engrenagens da Desinformação",
        text: "Uma análise de metadados oriundos de mensagens compartilahdas na plataforma WhatsApp, referente ao período de agosto de 2022 a fevereiro de 2023 (Período Eleitoral), indicando alterações nos padrões de conexão entre grupos de extrema-direita no Brasil, com sinais de uma possível coordenação na disseminação de desinformação no período pós-eleição.",
        chartType: "intro",
        data: [
            { label: "MENSAGENS ANALISADAS", value: 272891 },
            { label: "GRUPOS MAPEADOS", value: 301 },
            { label: "PERFIS IDENTIFICADOS", value: 49 }
        ],
        class: "normal"
        
    },
    {
        title: "TERMOS MAIS FREQUENTES NO CONTEXTO POLÍTICO",
        text: "<b>PRÉ-ELEIÇÃO:</b> Os termos utilizados nos grupos analisados apresentavam foco predominantemente eleitoral, com destaque para temas como “pesquisas” e “debates”.<br><br><b>PÓS-ELEIÇÃO:</b> Observa-se uma mudança significativa no vocabulário e na dinâmica das interações, com maior recorrência de termos como “selva”, “quartel” e “invasão”. O debate político passa a incorporar referências a estratégias de organização e mobilização.",
        chartType: "butterfly",
        dataLeft: [
            { label: "Pesquisa", value: 890 },
            { label: "Datafolha", value: 760 },
            { label: "Debate", value: 650 },
            { label: "Voto", value: 540 },
            { label: "Mito", value: 430 }
        ],
        dataRight: [
            { label: "Selva", value: 980 },
            { label: "Quartel", value: 920 },
            { label: "Intervenção", value: 850 },
            { label: "Ladrão", value: 780 },
            { label: "Invasão", value: 600 }
        ],
        colorLeft: "#00f3ff",
        colorRight: "#7C7CFF",
        class: "normal"
    },
    {
        title: "Rede Pré-Eleição (Agosto-Outubro)",
        text: "Antes do resultado eleitoral, os grupos de WhatsApp encontravam-se distribuídos em clusters dispersos (comunidades), o que indica uma baixa interconexão direta entre as comunidades mapeadas, sem a presença de um núcleo dominante de articulação.<br><br> <b>Interagindo:</b> utilize o zoom e arraste a visualização para os lados para explorar melhor a estrutura. Ao posicionar o cursor do mouse sobre um nó, são exibidas métricas associadas a ele.",
        chartType: "network",
        period: "p1", //  dados da PRÉ-ELEIÇÃO
        class: "normal" // Cor azul(normal)
    },
    {
        title: "Rede Pós-Eleição (Novembro-Fevereiro)",
        text: "Observa-se uma mudança significativa no cenário. Perfis com maior capacidade de influência passam a concentrar as interações, promovendo a aproximação entre diferentes comunidades. Esse movimento sugere a existência de coordenação, ao resultar na convergência de múltiplas comunidades em uma grande estrutura integrada, o que amplia a capacidade de articulação e atuação conjunta.<br><br> <b>Interagindo:</b> utilize o zoom e arraste a visualização para os lados para explorar melhor a estrutura.",
        chartType: "network",
        period: "p2", // dados da PÓS-ELEIÇÃO
        class: "normal" // Cor vermelha(perigo)
    },
    {
        title: "Top 5 Perfis",
        text: "Quem assume maior protagonismo na dinâmica observada? No período pós-eleição, cinco perfis passaram a concentrar cerca de 40% da coordenação das interações. Entre eles, o perfil identificado como “ef49...” (UF: Tocantins) destacou-se ao ocupar uma posição de liderança relevante na articulação da rede.",
        chartType: "leader",
        colorLeft: "#00f3ff",
        colorRight: "#7C7CFF",
        dataLeft: [
            { label: "Perfil: ef49... UF:TO", value: 764 },
            { label: "Perfil: 4ea1... UF:TO", value: 652 },
            { label: "Perfil: b624... UF:PB", value: 261 },
            { label: "Perfil: 36de... UF:DF", value: 247 },
            { label: "Perfil: cebd... UF:RJ", value: 133 }
        ],
        dataRight: [
            { label: "Perfil: ef49... UF:TO", value: 764 },
            { label: "Perfil: 4ea1... UF:TO", value: 652 },
            { label: "Perfil: b624... UF:PB", value: 261 },
            { label: "Perfil: 36de... UF:DF", value: 247 },
            { label: "Perfil: cebd... UF:RJ", value: 133 }
        ],
        class: "normal"
    },
    {
        title: "O que é Desinformação?",
        text: "<b>Desinformação</b> é <br></br> <b>Para mais informações:</b>.",
        chartType: "intro",
        data: [
            { label: "Exemplo", value: 272891 },
            { label: "Exemplo", value: 301 },
            { label: "Exemplo", value: 49 }
        ],
        class: "normal"
    },
    {
        title: "Intensidade de Desinformação por Grupo",
        text: "A análise evidencia que a desinformação não depende apenas do volume de mensagens, mas da intensidade da disseminação de conteúdo abusivo. O tamanho das bolhas representa o volume de mensagens e a coloração verde indica o score de desinformação. Como exemplo, enquanto o Grupo 25 apresenta alto volume (5.000 mensagens) e score elevado (95%), o Grupo 41, mesmo com volume significativamente menor (1.000 mensagens), registra score semelhante (90%), demonstrando que a toxicidade do conteúdo pode se concentrar em grupos menores, independentemente da quantidade de mensagens.<br></br> <b>Interagindo:</b> Posicione o cursor do mouse sobre as bolhas para exibir as métricas associadas a elas.",
        chartType: "bubble",
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
        class: "normal"
    },
    {
        text: "A estrutura da rede mudou ao longo do tempo, antes da eleição, a maior parte dos grupos estava na periferia (cinza). Após a eleição, muitos migraram para o núcleo central (vermelho), formando um centro muito mais concentrado. Tal movimento indica que as interações e a coordenação se tornaram mais centralizadas.",
        chartType: "target",
        title: "Estrutura Topológica: Pós-Eleição",
        // Gerando 50 pontos aleatórios para visualizar a massa
        data: Array.from({length: 80}, (_, i) => ({
            id: i,
            // 40% Core, 60% Periferia (Simulação da sua métrica k-core)
            role: i < 35 ? "Core" : "Periphery" 
        })),
        class: "normal"
    },
    {   
        title: "Perfis Ativos por Estado",
        text: "A atenção inicial concentrava-se em polos tradicionais, como Brasília e São Paulo. No entanto, a análise indica uma redistribuição do núcleo operacional para estruturas regionais. Nesse contexto, a Paraíba passou a assumir um papel de destaque na articulação ideológica observada.",
        chartType: "map",
        dataLeft: [
            { sigla: "SP", value: 9, type: "old" },
            { sigla: "PB", value: 17, type: "new" },
            { sigla: "TO", value: 8, type: "new" },
            { sigla: "DF", value: 4, type: "new" }
        ],
        dataRight: [
            { sigla: "SP", value: 9, type: "old" },
            { sigla: "PB", value: 17, type: "new" },
            { sigla: "TO", value: 8, type: "new" },
            { sigla: "DF", value: 4, type: "new" }
        ],
        class: "normal"
    }, 
    {
        title: "Indícios de Coordenação no Compartilhamento de Desinformação via WhatsApp",
        chartType: "end",
        text: "A partir dos dados analisados, há indícios de uma possível coordenação na disseminação de desinformação, com as comunidades passando a interagir e se conectar de forma mais concentrada, o que fortaleceu a circulação de conteúdos abusivos. Dessa forma, o WhatsApp funcionou como um canal de compartilhamento intencional de informações enganosas.<br></br> <b>Para mais informações:</b> xxxxxxxxxxxxxxxxxxxx",
        class: "normal"
    }
];