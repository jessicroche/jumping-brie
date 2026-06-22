/**
 * PROXIMAS MELHORIAS:
 * - adicionar um dark mode, meus olhos doem
 * - trocar a colisao para utilizar raycast
 * - adicionar mais itens do cenario
 * - adicionar contagem de cenouras coletadas
 * - possivelmente adicionar animacoes diferentes pra brie???
 * - adicionar tela de inicio ao minigame, atualmente ta comecando direto
 */
var container, scene, camera, renderer;
var clock = new THREE.Clock();
var character;
var cenarioItens = []; 
var velocidadeY = 0;
var modoJogo = window.location.pathname.includes('brie.html'); //modo de jogo
var bateu = false;
var animationId;
var pontos=0;
// evita erros no resto do site
if (document.getElementById('ThreeJS')) {
    init();
    animate();
}
function init() 
{
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xffe4e1, 0.002 );
    
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 20000);
    scene.add(camera);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.set(0, 50, 250); 
    camera.lookAt(new THREE.Vector3(0, 30, 0));  
    
    if ( Detector.webgl )
        renderer = new THREE.WebGLRenderer( {antialias:true, alpha:true} );
    else
        renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    
    container = document.getElementById( 'ThreeJS' );
    container.appendChild( renderer.domElement );
    
    // LUZ
    var light = new THREE.DirectionalLight(0xffeedd, 1.2);
    light.position.set(100, 200, 100);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x887766));
    
    // CHÃO
    var floorGeom = new THREE.CubeGeometry(1000, 20, 100);
    var floorMat = new THREE.MeshLambertMaterial( { color: 0xc1e1c1 } ); 
    var floor = new THREE.Mesh(floorGeom, floorMat);
    floor.position.y = -10;
    scene.add(floor);

    //redimensionamento da tela
    window.addEventListener('resize', function() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }, false);

    //construcao da brie//
    character = new THREE.Object3D();
    
    var matRosa = new THREE.MeshLambertMaterial({ color: 0xffaadd }); 
    var matRosaEscuro = new THREE.MeshLambertMaterial({ color: 0xff5599 }); 
    var matBranco = new THREE.MeshLambertMaterial({ color: 0xffffff }); 
    var matAzul = new THREE.MeshLambertMaterial({ color: 0x3399ff }); 

{
    var corpo = new THREE.Mesh(new THREE.CubeGeometry(16, 10, 20), matRosa);
    corpo.position.set(0, -1, 0); character.add(corpo);
    
    var cabeca = new THREE.Mesh(new THREE.CubeGeometry(12, 10, 12), matRosa);
    cabeca.position.set(0, 6, 12); character.add(cabeca);
    
    var orelhaEsq = new THREE.Mesh(new THREE.CubeGeometry(4, 14, 4), matRosa);
    orelhaEsq.position.set(-3, 16, 10); character.add(orelhaEsq);
    var orelhaDir = new THREE.Mesh(new THREE.CubeGeometry(4, 14, 4), matRosa);
    orelhaDir.position.set(3, 16, 10); character.add(orelhaDir);
    
    var rabo = new THREE.Mesh(new THREE.CubeGeometry(6, 6, 6), matBranco);
    rabo.position.set(0, -1, -11); character.add(rabo);
    
    var pataGeom = new THREE.CubeGeometry(4, 6, 4);
    var pata1 = new THREE.Mesh(pataGeom, matRosa); pata1.position.set(-5, -7, 7); character.add(pata1);
    var pata2 = new THREE.Mesh(pataGeom, matRosa); pata2.position.set(5, -7, 7); character.add(pata2);
    var pata3 = new THREE.Mesh(pataGeom, matRosa); pata3.position.set(-5, -7, -7); character.add(pata3);
    var pata4 = new THREE.Mesh(pataGeom, matRosa); pata4.position.set(5, -7, -7); character.add(pata4);

    var focinho = new THREE.Mesh(new THREE.CubeGeometry(4, 2, 2), matRosaEscuro);
    focinho.position.set(0, 4, 18.5); character.add(focinho);
    
    var olhoEsq = new THREE.Mesh(new THREE.CubeGeometry(2, 4, 2), matAzul);
    olhoEsq.position.set(-3, 8, 18); character.add(olhoEsq);
    var olhoDir = new THREE.Mesh(new THREE.CubeGeometry(2, 4, 2), matAzul);
    olhoDir.position.set(3, 8, 18); character.add(olhoDir);
}
    character.position.set(-50, 10, 0);
    character.rotation.y = Math.PI / 2; // vira a brie de lado
    scene.add(character);
//itens do cenario
    var matCerca = new THREE.MeshLambertMaterial({ color: 0xba8759 });
    var matCenoura = new THREE.MeshLambertMaterial({ color: 0xffaa00 }); 
    var matFolha = new THREE.MeshLambertMaterial({ color: 0x55cc55 }); 

    for(var i = 0; i < 4; i++) {
        var item = new THREE.Object3D();
        
        if (i % 2 === 0) {
            var cerca = new THREE.Mesh(new THREE.CubeGeometry(5, 20, 25), matCerca);
            cerca.position.y = 10;
            item.add(cerca);
            item.tipo = 'cerca';
        } else {
            var base = new THREE.Mesh(new THREE.CylinderGeometry(4, 0, 12, 8), matCenoura);
            var topo = new THREE.Mesh(new THREE.CubeGeometry(3, 4, 3), matFolha);
            topo.position.y = 7;
            item.add(base); item.add(topo);
            item.tipo = 'cenoura';
        }

        item.position.set(100 + (i * 200), 0, 0); 
        scene.add(item);
        cenarioItens.push(item); 
    }
}

function animate()
{
    animationId = requestAnimationFrame( animate );
    render();      
    update();
}

function update()
{
var tempo = clock.getElapsedTime();
    
    character.position.y += velocidadeY;
    if (character.position.y > 10 || velocidadeY !== 0) {
        velocidadeY -= 0.5; 
        character.rotation.z = 0; 
    }
    if (character.position.y <= 10) {
        character.position.y = 10;
        velocidadeY = 0;
        character.rotation.z = Math.sin(tempo * 12) * 0.15;
    }

    // gera os itens do cenario
    for(var i = 0; i < cenarioItens.length; i++) {
        var item = cenarioItens[i];
        item.position.x -= 2.5; 
        var dist = item.position.x - character.position.x;

        // colisao
        if (modoJogo && item.tipo === 'cerca') {
            if (dist > -5 && dist < 5 && character.position.y <= 12 && !bateu) {
                bateu = true;
                gameOver();
            }
        }

        // pulo
        if (!modoJogo && item.visible && dist > 0 && dist < 40 && character.position.y === 10) {
            velocidadeY = 7;
        }

        // cenourinha
        if (item.tipo === 'cenoura' && item.visible) {
            item.position.y = 45 + Math.sin(tempo * 2 + i) * 5; 
            if (dist > -20 && dist < 20 && Math.abs(character.position.y - item.position.y) < 30) {
                item.visible = false; 
                item.scale.set(0.001, 0.001, 0.001);
                pontos++;
                atualizarPontos();
            }
        }

        // tira o item da tela e reseta ele
        if (item.position.x < -150) {
            item.position.x += 800;
            item.visible = true; 
            item.scale.set(1, 1, 1);
        }
    }
}
function gameOver() {
    bateu = true;
    velocidadeY = 0;
    /*
    tive que colocar essa desgraça senão a brie continua pulando
    pos game over, atravessando as cercas sem tomar "dano"
    */
    cancelAnimationFrame(animationId);
    document.getElementById('gameOverCard').style.display = 'block';
}

function resetarJogo() {
    // esconde o cartaozinho de game over
    document.getElementById('gameOverCard').style.display = 'none';
    pontos=0; // reseta a pontuacao
    atualizarPontos();
    // poe a brie no ponto inicial e reseta os itens do cenario
    character.position.set(-50, 10, 0);
    for(var i = 0; i < cenarioItens.length; i++) {
        cenarioItens[i].position.set(100 + (i * 200), 0, 0);
        cenarioItens[i].visible = true;
        cenarioItens[i].scale.set(1, 1, 1);
    }
    
    bateu = false; // reseta a flag da colisao
    animate(); // anima tudo de novo
}

function atualizarPontos() {
    var display = document.getElementById('pontosDisplay');
    if (display) {
        display.innerText = pontos;
    }
}

function render() 
{
    renderer.render( scene, camera );
}