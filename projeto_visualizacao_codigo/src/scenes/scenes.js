export const scenes = [
    {
        title: "DOSSIÊ: Engrenagens da Desinformação",
        text: "Uma análise de metadados oriundos de mensagens compartilahdas na plataforma WhatsApp, referente ao período de agosto de 2022 a fevereiro de 2023 (Período Eleitoral), indicando alterações nos padrões de conexão entre grupos de extrema-direita no Brasil, com sinais de uma possível coordenação na disseminação de desinformação no período pós-eleição.",
        chartType: "intro",
        data: [
            { label: "MENSAGENS ANALISADAS", value: 272891 },
            { label: "GRUPOS MAPEADOS", value: 301 },
            { label: "PERFIS IDENTIFICADOS", value: 371 }
        ],
        class: "normal"
        
    },
    {
        title: "TERMOS MAIS FREQUENTES NO CONTEXTO POLÍTICO",
        text: "<b>PRÉ-ELEIÇÃO:</b> Os termos utilizados nos grupos analisados apresentavam foco predominantemente eleitoral, com destaque para temas como “pesquisas” e “debates”.<br><br><b>PÓS-ELEIÇÃO:</b> Observa-se uma mudança significativa no vocabulário e na dinâmica das interações, com maior recorrência de termos como “selva”, “quartel” e “invasão”. O debate político passa a incorporar referências a estratégias de organização e mobilização.",
        chartType: "butterfly",
        dataLeft: [
            { label: "Pesquisa", value: 3547 },
            { label: "Voto", value: 3198 },
            { label: "Debate", value: 2293 },
            { label: "Datafolha", value: 550 },
            { label: "Mito", value: 499 }
        ],
        dataRight: [
            { label: "Brasília", value: 3766 },
            { label: "Intervenção", value: 2502  },
            { label: "Ladrão", value: 2360  },
            { label: "Fraude", value: 1327 },
            { label: "Invasão", value: 446 },
        ],
        colorLeft: "#00f3ff",
        colorRight: "#7C7CFF",
        class: "normal"
    },
    {
        title: "Rede Pré-Eleição (Agosto-Outubro)",
        text: "Antes do resultado eleitoral, os grupos de WhatsApp encontravam-se distribuídos em clusters dispersos (comunidades), o que indica uma baixa interconexão direta entre as comunidades mapeadas, sem a presença de um núcleo dominante de articulação.<br><br> <b>Interagindo:</b> utilize o zoom e arraste a visualização para os lados para explorar melhor a estrutura. Ao posicionar o cursor do mouse sobre um nó, são exibidas métricas associadas a ele.",
        chartType: "morphing",
        period: "p1", //  dados da PRÉ-ELEIÇÃO
        class: "normal"
    },
    {
        title: "Rede Pós-Eleição (Novembro-Fevereiro)",
        text: "Observa-se uma mudança significativa no cenário. Perfis com maior capacidade de influência passam a concentrar as interações, promovendo a aproximação entre diferentes comunidades. Esse movimento sugere a existência de coordenação, ao resultar na convergência de múltiplas comunidades em uma grande estrutura integrada, o que amplia a capacidade de articulação e atuação conjunta.<br><br> <b>Interagindo:</b> utilize o zoom e arraste a visualização para os lados para explorar melhor a estrutura.",
        chartType: "morphing",
        period: "p2", // dados da PÓS-ELEIÇÃO
        class: "danger" 
    },
    {
        title: "Top 5 Perfis",
        text: "Quem assume maior protagonismo na dinâmica observada? No período pós-eleição, cinco perfis passaram a concentrar cerca de 40% da coordenação das interações. Entre eles, o perfil identificado como “ef49...” (UF: Tocantins) destacou-se ao ocupar uma posição de liderança relevante na articulação da rede.",
        chartType: "leader",
        periodLeft: "p1",       
        colorLeft: "#00f3ff",   
        periodRight: "p2",      
        colorRight: "#ff2a6d",  
        class: "normal"
    },
    {
        title: "O que é Desinformação?",
        text: "Desinformação não é apenas um erro. É uma <b>arma tática</b>. <br><br>Diferente do boato inocente, ela é fabricada com uma 'assinatura' específica para manipular emoções: excesso de alarmismo, termos de urgência (<i>'Urgente! Veja! Compartilhem agora!'</i>). <br><br> Passe o mouse sobre os nós da rede ao lado. As nuvens de palavras revelam não apenas o que eles dizem, mas <b>como</b> eles manipulam o discurso em cada comunidade. <br> Para mais informações sobre as técnicas de desinformação, visite: <a href='https://www.faroldigital.info' target='_blank' style='color: #FFD700; text-decoration: underline;'>Plataforma Farol Digital</a>.",
        chartType: "network", 
        period: "p2",
        class: "danger"
    },
   {
        title: "Intensidade de Desinformação por Comunidade",
        text: "A análise evidencia que a desinformação não depende apenas do volume, mas da intensidade do conteúdo abusivo. <br><br><b>Entenda o Gráfico:</b><br><span style='color:#00f3ff'>● Azul (Pré-Eleição)</span>: Comunidades operando com níveis menores de risco.<br><span style='color:#ff2a6d'>● Vermelho (Pós-Eleição)</span>: Explosão de toxicidade. Note como bolhas pequenas podem ter a cor vermelha intensa (Score > 0.7), provando que grupos menores podem ser altamente radicais.<br><br><b>Interagindo:</b> Posicione o cursor sobre as bolhas para ver quem são os <b>Agentes Principais</b> de cada comunidade.",
        chartType: "bubble",
        class: "danger" 
    },
    {
        text: "A estrutura da rede mudou ao longo do tempo, antes da eleição, a maior parte dos grupos estava na periferia (cinza). Após a eleição, muitos migraram para o núcleo central (vermelho), formando um centro muito mais concentrado. Tal movimento indica que as interações e a coordenação se tornaram mais centralizadas. <br><br><b>Interatividade:</b> Passe o cursor sobre os pontos para rastrear o <b>ID do Usuário (Hash)</b> e visualizar sua trajetória individual (ex: se ele migrou da Periferia para o Centro).",
        chartType: "target",
        title: "Estrutura Topológica: Pós-Eleição",
        periodStart: "p1",
        periodEnd: "p2",
        class: "normal"
    },

    {   
        title: "Perfis Ativos por Estado",
        text: "O mapeamento geográfico revela uma mudança estrutural crítica na rede. Enquanto o período pré-eleitoral (Azul) dependia fortemente de eixos tradicionais como <b>São Paulo</b> e <b>Brasília</b>, o pós-eleição (Vermelho) demonstra uma agressiva capilarização para o Norte e Nordeste.<br><br>O destaque é a <b>Paraíba (PB)</b>, que deixa de ser periférica para assumir protagonismo na articulação ideológica, sugerindo uma estratégia de descentralização do comando.<br><br><b>Interação:</b> Passe o cursor sobre os estados para visualizar o volume exato de usuários ativos em cada período.",
        chartType: "map",
        dataLeft: [
            { "sigla": "SP", "value": 30, "type": "old" },
            { "sigla": "RJ", "value": 24, "type": "old" },
            { "sigla": "RN", "value": 12, "type": "new" },
            { "sigla": "MG", "value": 11, "type": "old" },
            { "sigla": "PB", "value": 11, "type": "new" },
            { "sigla": "PA", "value": 9, "type": "new" },
            { "sigla": "BA", "value": 8, "type": "new" },
            { "sigla": "CE", "value": 7, "type": "new" },
            { "sigla": "DF", "value": 7, "type": "old" },
            { "sigla": "SC", "value": 7, "type": "new" },
            { "sigla": "RS", "value": 6, "type": "new" },
            { "sigla": "PE", "value": 5, "type": "new" },
            { "sigla": "ES", "value": 3, "type": "new" },
            { "sigla": "GO", "value": 3, "type": "new" },
            { "sigla": "MA", "value": 3, "type": "new" },
            { "sigla": "MT", "value": 3, "type": "new" },
            { "sigla": "TO", "value": 3, "type": "new" },
            { "sigla": "MS", "value": 2, "type": "new" },
            { "sigla": "PI", "value": 2, "type": "new" },
            { "sigla": "SE", "value": 2, "type": "new" },
            { "sigla": "PR", "value": 1, "type": "new" }
        ],
        dataRight: [
            { "sigla": "SP", "value": 75, "type": "old" },
            { "sigla": "RJ", "value": 52, "type": "old" },
            { "sigla": "PB", "value": 46, "type": "new" },
            { "sigla": "MG", "value": 31, "type": "old" },
            { "sigla": "TO", "value": 22, "type": "new" },
            { "sigla": "RN", "value": 21, "type": "new" },
            { "sigla": "RS", "value": 20, "type": "new" },
            { "sigla": "BA", "value": 18, "type": "new" },
            { "sigla": "PA", "value": 14, "type": "new" },
            { "sigla": "CE", "value": 13, "type": "new" },
            { "sigla": "SC", "value": 13, "type": "new" },
            { "sigla": "DF", "value": 11, "type": "old" },
            { "sigla": "PI", "value": 7, "type": "new" },
            { "sigla": "PR", "value": 7, "type": "new" },
            { "sigla": "GO", "value": 6, "type": "new" },
            { "sigla": "MS", "value": 5, "type": "new" },
            { "sigla": "PE", "value": 5, "type": "new" },
            { "sigla": "SE", "value": 5, "type": "new" },
            { "sigla": "MA", "value": 4, "type": "new" },
            { "sigla": "MT", "value": 3, "type": "new" },
            { "sigla": "RO", "value": 3, "type": "new" },
            { "sigla": "AL", "value": 2, "type": "new" },
            { "sigla": "ES", "value": 2, "type": "new" },
            { "sigla": "AC", "value": 1, "type": "new" },
            { "sigla": "AM", "value": 1, "type": "new" }
        ],
        class: "normal"
    }, 
    {
        title: "Indícios de Coordenação no Compartilhamento de Desinformação via WhatsApp",
        chartType: "end",
        text: "A partir dos dados analisados, há indícios de uma possível coordenação na disseminação de desinformação, com as comunidades passando a interagir e se conectar de forma mais concentrada, o que fortaleceu a circulação de conteúdos abusivos. Dessa forma, o WhatsApp funcionou como um canal de compartilhamento intencional de informações enganosas.<br></br> <b>Para mais informações:</b> consulte os exprimentos completos, disponíveis no <a href='https://github.com/jmmfilho/complexnetworks-whatsapp-2022elections' target='_blank' style='color: #FFD700; text-decoration: underline;'>Github</a>.",
        class: "normal"
    }
];