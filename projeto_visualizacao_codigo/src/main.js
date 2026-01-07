import { scenes } from "./scenes/scenes.js";
import { renderScene } from "./controller/sceneController.js";

let currentIndex = -1;
const lengthScenes = scenes.length;

function setup() {
    const textSide = document.getElementById("text-side");

    scenes.forEach((scene, i) => {
        const div = document.createElement("div");
        div.className = "step";
        div.id = `step-${i}`;
        div.innerHTML = `<h2>${scene.title}</h2><p>${scene.text}</p>`;
        textSide.appendChild(div);
    });

    renderScene(scenes[0], "#viz-container");

    // Exemplo simples de navegação
    window.addEventListener("scroll", () => {
        const index = Math.min(
            scenes.length - 1,
            Math.floor(window.scrollY / 700)
            
        );
        

        if (index !== currentIndex ) {
            currentIndex = index;
            renderScene(scenes[index], "#viz-container");
        }
        console.log(lengthScenes);
    });

}

setup();
