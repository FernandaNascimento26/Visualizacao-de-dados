import { scenes } from "./scenes/scenes.js";
import { renderScene } from "./controller/sceneController.js";



function setup() {
    const textSide = document.getElementById("text-side");

    // 1. Gera o HTML do texto baseado no scenes.js
    scenes.forEach((scene, i) => {
        const div = document.createElement("div");
        div.className = `step ${scene.class || ''}`; // Adiciona classe 'danger' ou 'normal'
        div.dataset.index = i;
        
        div.innerHTML = `
            <div class="step-content">
                <h2>${scene.title}</h2>
                <p>${scene.text}</p>
            </div>
        `;
        textSide.appendChild(div);
    });


    // 2. Configura o ScrollSpy (IntersectionObserver)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove classe ativa dos outros
                document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
                
                // Ativa o atual
                entry.target.classList.add("active");

                // Renderiza o gráfico
                const index = entry.target.dataset.index;
                console.log("Cena ativa:", index, scenes[index].title); // Log para debug
                renderScene(scenes[index], "#viz-container");
            }
        });
    }, {
        threshold: 0.5 // Ativa quando 50% do texto aparece
    });

    // Observa todos os passos criados
    document.querySelectorAll(".step").forEach(step => observer.observe(step));
}

setup();