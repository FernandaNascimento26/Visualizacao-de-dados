# Data Viz Storytelling: Desinformação e Eleições 2022

Este projeto é uma plataforma de **Storytelling de Dados** interativa desenvolvida para a disciplina de **Visualização de Dados**. O foco da narrativa é analisar a disseminação de **fake news e discursos de ódio** via WhatsApp durante o  cenário das eleições presidenciais brasileiras de 2022.

A aplicação utiliza um layout de "scrollytelling" (painel duplo), onde a narrativa textual do lado esquerdo guia visualizações gráficas no lado oposto, ilustrando o volume e os formatos das campanhas de desinformação.



## 🚀 Funcionalidades

* **Visualização Dinâmica:** Gráficos e cores atualizam-se em tempo real conforme a cena narrativa visível.
* **Foco em Dados de 2022:** Baseado em métricas de monitoramento de redes sociais.


## 🛠️ Tecnologias e Requisitos

* **Linguagem:** JavaScript (ES6+)
* **Ambiente:** Node.js (necessário para o servidor de desenvolvimento).

---

## 🔧 Como Rodar o Projeto

Para visualizar a plataforma em seu navegador, siga os passos abaixo:

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** instalado. Você pode verificar a versão com:
```bash
node -v 

```

### 2. Passo a Passo para Execução
1- Acesse a pasta do projeto: Abra o seu terminal (ou prompt de comando) e navegue até a pasta raiz onde os arquivos foram baixados.

2- Inicie o servidor local: Como o projeto utiliza módulos do JavaScript (ES6 Modules), é necessário rodar um servidor para que o navegador carregue os arquivos corretamente. Execute o comando abaixo:

```bash
npx http-server .

```

### 3. Acesso ao Sistema

1- Acesse no Navegador: Após o comando iniciar o servidor, abra o seu navegador de preferência e acesse o endereço:
``` 
http://127.0.0.1:8080/

```

## 🕹️ Interatividade e Navegação

A plataforma foi desenvolvida para oferecer uma experiência de **storytelling imersivo**. A transição entre os dados, gráficos e textos é feita de forma fluida através da interação do usuário:

* **Rolagem (Scroll):** Utilize a roda do mouse ou a barra de rolagem para avançar ou retornar na narrativa. Cada seção textual aciona uma mudança correspondente no gráfico lateral.

