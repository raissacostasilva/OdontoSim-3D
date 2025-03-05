import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.140.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.140.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.140.0/examples/jsm/loaders/OBJLoader.js';

// Criação da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Adicionar iluminação
const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiente
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Carregar modelos OBJ
const objLoader = new OBJLoader();
const fileInput = document.getElementById('file-input');

// Manipulador de eventos para carregar arquivos
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target.result;
            const object = objLoader.parse(contents);

            // Verifica se o objeto foi carregado corretamente
            if (object) {
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Define uma cor para o material
                    }
                });

                object.scale.set(0.1, 0.1, 0.1); // Ajusta a escala do objeto
                object.position.set(0, 0, 0); // Centraliza o objeto
                scene.add(object);
                console.log("Objeto carregado com sucesso!");
            } else {
                console.error("Erro ao carregar o objeto.");
            }
        };
        reader.readAsText(file);
    }
});

// Controle de movimento da câmera
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);
controls.update();

// Renderização da cena
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Atualiza os controles a cada frame
    renderer.render(scene, camera);
}
animate();

// Redimensiona a cena ao mudar o tamanho da janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
