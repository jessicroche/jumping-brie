var container, scene, camera, renderer;
var clock = new THREE.Clock();
var character;
var cenarioItens = []; 
var velocidadeY = 0;
var modoJogo = window.location.pathname.includes('brie.html'); 
var bateu = false;
var animationId;
var pontos = 0;
var orelhaEsq, orelhaDir, cabeca, focinho, olhoEsq, olhoDir, corpo, rabo;
var abaixada = false;
var velocidadePista = 2.5;
var dificuldadeMultiplicador = 1.0;
var tempoManual = 0;


function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xffe4e1, 0.002 );
    
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 20000);
    scene.add(camera);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.set(0, 50, 250); 
    camera.lookAt(new THREE.Vector3(0, 30, 0));  
    
    if ( Detector.webgl ) renderer = new THREE.WebGLRenderer( {antialias:true, alpha:true} );
    else renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    
    container = document.getElementById( 'ThreeJS' );
    container.appendChild( renderer.domElement );
    
    var light = new THREE.DirectionalLight(0xffeedd, 1.2);
    light.position.set(100, 200, 100);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x887766));
    
    var floorGeom = new THREE.CubeGeometry(1000, 20, 100);
    var floorMat = new THREE.MeshLambertMaterial( { color: 0xc1e1c1 } ); 
    var floor = new THREE.Mesh(floorGeom, floorMat);
    floor.position.y = -10;
    scene.add(floor);

    window.addEventListener('resize', function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }, false);
    montarBrie(scene);
    gerarCenario(scene);
}
function animate() {
    if (animationId) { 
        cancelAnimationFrame(animationId); 
    }
    animationId = requestAnimationFrame( animate );
    render();      
    update();
}

function update() {
    var tempo = clock.getElapsedTime();
    if (!modoJogo) {
        rodarIA(cenarioItens);
    } else if(!bateu) {
        tempoManual += 1/60;
    }
    var novaDificuldade = 1.0 + (Math.floor(tempoManual / 10) * 0.2);
    if (novaDificuldade > 1.8) {
    dificuldadeMultiplicador = 1.8;
    } else {
    dificuldadeMultiplicador = novaDificuldade;
    }
    atualizarFisicaBrie(tempo);
    aplicarAnimacaoAbaixar();
    movimentarCenario(tempo);
}

function gameOver() {
    bateu = true;
    velocidadeY = 0;
    cancelAnimationFrame(animationId);
    document.getElementById('gameOverCard').style.display = 'block';
}

function resetarJogo() {
    cancelAnimationFrame(animationId);
    document.getElementById('gameOverCard').style.display = 'none';
    pontos = 0; 
    atualizarPontos();
    dificuldadeMultiplicador = 1.0;
    tempoManual = 0;
    
    character.position.set(-50, 10, 0);
    for(var i = 0; i < cenarioItens.length; i++) {
        cenarioItens[i].position.set(100 + (i * 200), 0, 0);
        cenarioItens[i].visible = true;
        cenarioItens[i].scale.set(1, 1, 1);
    }
    
    bateu = false; 
    animate(); 
}

function atualizarPontos() {
    var display = document.getElementById('pontosDisplay');
    if (display) display.innerText = pontos;
}

function render() {
    renderer.render( scene, camera );
}

if (document.getElementById('ThreeJS')) {
    init();
    animate();
}