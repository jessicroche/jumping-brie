function montarBrie(scene) {
    character = new THREE.Object3D();
    
    var matRosa = new THREE.MeshLambertMaterial({ color: 0xffaadd }); 
    var matRosaEscuro = new THREE.MeshLambertMaterial({ color: 0xff5599 }); 
    var matBranco = new THREE.MeshLambertMaterial({ color: 0xffffff }); 
    var matAzul = new THREE.MeshLambertMaterial({ color: 0x3399ff }); 

    corpo = new THREE.Mesh(new THREE.CubeGeometry(16, 10, 20), matRosa);
    corpo.position.set(0, -1, 0); character.add(corpo);
    
    cabeca = new THREE.Mesh(new THREE.CubeGeometry(12, 10, 12), matRosa);
    cabeca.position.set(0, 6, 12); character.add(cabeca);
    
    orelhaEsq = new THREE.Mesh(new THREE.CubeGeometry(4, 14, 4), matRosa);
    orelhaEsq.position.set(-3, 16, 10); character.add(orelhaEsq);
    orelhaDir = new THREE.Mesh(new THREE.CubeGeometry(4, 14, 4), matRosa);
    orelhaDir.position.set(3, 16, 10); character.add(orelhaDir);
    
    rabo = new THREE.Mesh(new THREE.CubeGeometry(6, 6, 6), matBranco);
    rabo.position.set(0, -1, -11); character.add(rabo);
    
    var pataGeom = new THREE.CubeGeometry(4, 6, 4);
    var pata1 = new THREE.Mesh(pataGeom, matRosa); pata1.position.set(-5, -7, 7); character.add(pata1);
    var pata2 = new THREE.Mesh(pataGeom, matRosa); pata2.position.set(5, -7, 7); character.add(pata2);
    var pata3 = new THREE.Mesh(pataGeom, matRosa); pata3.position.set(-5, -7, -7); character.add(pata3);
    var pata4 = new THREE.Mesh(pataGeom, matRosa); pata4.position.set(5, -7, -7); character.add(pata4);

    focinho = new THREE.Mesh(new THREE.CubeGeometry(4, 2, 2), matRosaEscuro);
    focinho.position.set(0, 4, 18.5); character.add(focinho);
    
    olhoEsq = new THREE.Mesh(new THREE.CubeGeometry(2, 4, 2), matAzul);
    olhoEsq.position.set(-3, 8, 18); character.add(olhoEsq);
    olhoDir = new THREE.Mesh(new THREE.CubeGeometry(2, 4, 2), matAzul);
    olhoDir.position.set(3, 8, 18); character.add(olhoDir);

    character.position.set(-50, 10, 0);
    character.rotation.y = Math.PI / 2; 
    scene.add(character);
}


function atualizarFisicaBrie(tempo) {
    character.position.y += velocidadeY;
    if (character.position.y > 10 || velocidadeY !== 0) {
        velocidadeY -= 0.5;
    }
    if (character.position.y <= 10) {
        character.position.y = 10;
        velocidadeY = 0;
        character.rotation.z = Math.sin(tempo * 12) * 0.15;
    }
    aplicarAnimacaoAbaixar();
}

function rodarIA(itens) {
    for (var i = 0; i < itens.length; i++) {
        var item = itens[i];
        var dist = item.position.x - character.position.x;

        if (item.visible && dist > 0 && dist < 55) {
            if (item.acao === 'pular' || item.acao === 'pegar') {
                pular();
            } else if (item.acao === 'abaixar') {
                abaixada = true;
                return;
            }
        }
    }
    abaixada = false;
}


function atualizarFisicaBrie(tempo) {
    character.position.y += velocidadeY;
    if (character.position.y > 10 || velocidadeY !== 0) {
        velocidadeY -= 0.5;
    }
    if (character.position.y <= 10) {
        character.position.y = 10;
        velocidadeY = 0;
        character.rotation.z = Math.sin(tempo * 12) * 0.15;
    }
}


function aplicarAnimacaoAbaixar() {
    if (abaixada) {
        corpo.scale.y = 0.5;
        corpo.position.y = -3.5; 
        cabeca.position.y = 1;
        focinho.position.y = -1;
        olhoEsq.position.y = 3;
        olhoDir.position.y = 3;
        orelhaEsq.rotation.x = -Math.PI / 2;
        orelhaDir.rotation.x = -Math.PI / 2;
        orelhaEsq.position.set(-3, 5, 2);
        orelhaDir.position.set(3, 5, 2);
    } else {
        corpo.scale.y = 1;
        corpo.position.y = -1;
        cabeca.position.y = 6;
        focinho.position.y = 4;
        olhoEsq.position.y = 8;
        olhoDir.position.y = 8;
        orelhaEsq.rotation.x = 0;
        orelhaDir.rotation.x = 0;
        orelhaEsq.position.set(-3, 16, 10);
        orelhaDir.position.set(3, 16, 10);
    }
}

function pular() {
    if (character.position.y === 10 && !abaixada) {
        velocidadeY = 7;
    }
}