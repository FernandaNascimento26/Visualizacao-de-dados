export const scenes = [
    {
        title: "Ato 1: O Fim da Festa",
        text: "Na campanha (Pré), o discurso era de torcida. As palavras mais usadas eram insultos simples e risadas ('kkkkk'). Era um ambiente de entretenimento político.",
        chartType: "bar",
        data: [
            { label: "Vagabundo", value: 535 },
            { label: "Inútil", value: 535 },
            { label: "Kkkkk", value: 535 },
            { label: "Youtube", value: 300 }
        ],
        color: "#2196f3", // Azul (Campanha)
        yLabel: "Frequência de Uso"
    },
    {
        title: "Ato 1: A Ordem Unida",
        text: "No Pós-Eleição, o humor morreu. Termos imperativos explodiram. 'Repasse' e 'Ouçam' indicam que os grupos viraram canais de comando militarizado.",
        chartType: "bar",
        data: [
            { label: "Repasse", value: 887 },
            { label: "Merda", value: 848 },
            { label: "Ouçam", value: 832 },
            { label: "Urnas", value: 468 }
        ],
        color: "#f44336", // Vermelho (Alerta/Golpe)
        yLabel: "Frequência de Uso"
    },
    {
        title: "Ato 2: A Ascensão dos Generais",
        text: "A liderança mudou. Usuários que tinham influência média na campanha (ex: ef4961...) triplicaram seu poder no pós-eleição, assumindo o comando do caos.",
        chartType: "slope",
        data: [
            { label: "Líder TO (ef49...)", start: 247, end: 764 },
            { label: "Líder TO (4ea1...)", start: 260, end: 652 },
            { label: "Líder PB (b624...)", start: 72, end: 94 },
            { label: "Líder PA (c5ff...)", start: 14, end: 37 }
        ],
        color: "#ff9800", // Laranja
        yLabel: "Peso de Influência"
    },
    {
        title: "Ato 3: O QG da Paraíba",
        text: "O comando saiu do eixo Rio-SP. A Paraíba (PB) explodiu como o novo centro de comando ideológico, triplicando o número de líderes ativos.",
        chartType: "bar",
        data: [
            { label: "SP (Pré)", value: 9 },
            { label: "PB (Pré)", value: 5 },
            { label: "SP (Pós)", value: 8 },
            { label: "PB (Pós)", value: 17 } // O Destaque
        ],
        color: "#9c27b0", // Roxo
        yLabel: "Qtd. Líderes (Generais)"
    }
];