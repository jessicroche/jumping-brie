var texturaMushroom = THREE.ImageUtils.loadTexture('textures/mushroom.jpg');
var texturaWood = THREE.ImageUtils.loadTexture('textures/wood.jpg');
var matCerca = new THREE.MeshLambertMaterial({ map: texturaWood });
var matCenoura = new THREE.MeshLambertMaterial({ color: 0xff7700 }); 
var matVerdeCenoura = new THREE.MeshLambertMaterial({ color: 0x44aa44 }); 
var matTerra = new THREE.MeshLambertMaterial({ color: 0x5c4033 }); 
var matRegadorAzul = new THREE.MeshLambertMaterial({ color: 0x8cbce6 }); 
var matMetal = new THREE.MeshLambertMaterial({ color: 0xdddddd }); 
var matCogumeloCaule = new THREE.MeshLambertMaterial({ color: 0xffffff }); 
var matCogumeloChapeu = new THREE.MeshLambertMaterial({ map: texturaMushroom }); 
var matFlorCaule = new THREE.MeshLambertMaterial({ color: 0x8fbc8f }); 
var matFlorMiolo = new THREE.MeshLambertMaterial({ color: 0xffd700 }); 
var matFlorPetala = new THREE.MeshLambertMaterial({ color: 0xffb6c1 }); 
var matMacaVermelha = new THREE.MeshLambertMaterial({ color: 0xcc0000 }); 
var matMacaTalo = new THREE.MeshLambertMaterial({ color: 0x5c4033 }); 
var matMacaFolha = new THREE.MeshLambertMaterial({ color: 0x32cd32 }); 
var matBotaoPastel = new THREE.MeshLambertMaterial({ color: 0xf4a261 });
var matBotaoFuro = new THREE.MeshLambertMaterial({ color: 0x264653 });

function gerarCenario(scene) {
    for(var i = 0; i < 4; i++) {
        var item = new THREE.Object3D();
        var tipoSorteio = i % 3; 
        
        if (tipoSorteio === 0) {
            var cerca = new THREE.Mesh(new THREE.CubeGeometry(5, 20, 25), matCerca);
            cerca.position.y = 10;
            item.add(cerca);
            item.tipo = 'cerca';
            item.acao = 'pular';
            
        } else if (tipoSorteio === 1) {
            var pernaEsq = new THREE.Mesh(new THREE.CubeGeometry(5, 50, 5), matCerca);
            pernaEsq.position.set(0, 25, 12); 
            var pernaDir = new THREE.Mesh(new THREE.CubeGeometry(5, 50, 5), matCerca);
            pernaDir.position.set(0, 25, -12); 
            var traveTop = new THREE.Mesh(new THREE.CubeGeometry(5, 40, 30), matCerca);
            traveTop.position.set(0, 40, 0); 
            
            item.add(pernaEsq); 
            item.add(pernaDir); 
            item.add(traveTop);
            
            item.tipo = 'cercaAlta';
            item.acao = 'abaixar';
            
        } else {
            var cenoura = criarCenoura();
            cenoura.position.y = 7;
        
            item.add(cenoura);
            item.tipo = 'cenoura';
            item.acao = 'pegar';
        }

        item.position.set(100 + (i * 200), 0, 0); 
        scene.add(item);
        cenarioItens.push(item); 
    }
}

function movimentarCenario(tempo) {
    if (!modoJogo) abaixada = false;

    for(var i = 0; i < cenarioItens.length; i++) {
        var item = cenarioItens[i];
        item.position.x -= (velocidadePista * dificuldadeMultiplicador);
        var dist = item.position.x - character.position.x;

        if (!modoJogo && item.visible) {
            if (item.acao === 'pular' && dist > 0 && dist < 40 && character.position.y === 10) {
                velocidadeY = 7;
            } else if (item.acao === 'abaixar' && dist > -20 && dist < 55) {
                abaixada = true; 
            }
        }
        
        if (item.tipo === 'cenoura' && item.visible) {
            item.position.y = 45 + Math.sin(tempo * 2 + i) * 5; 
            if (dist > -20 && dist < 20 && Math.abs(character.position.y - item.position.y) < 30) {
                item.visible = false; 
                item.scale.set(0.001, 0.001, 0.001);
                if (modoJogo) {
                    pontos++;
                    atualizarPontos();
                }
            }
        } 
        
        if (item.tipo === 'cerca') {
            if (modoJogo && !bateu) {
                var colidiuNoX = dist > -15 && dist < 15; 
                var colidiuNoY = character.position.y < 22; 
                if (colidiuNoX && colidiuNoY) { bateu = true; gameOver(); }
            }
        }
        
        if (item.tipo === 'cercaAlta') {
            if (modoJogo && !bateu) {
                var colidiuNoX = dist > -15 && dist < 15; 
                var colidiuNoY = character.position.y > 10 || !abaixada; 
                if (colidiuNoX && colidiuNoY) { bateu = true; gameOver(); }
            }
        }

        // posisiona na pista
        if (item.position.x < -250) {
            item.position.x += 800;
            item.visible = true; 
            item.scale.set(1, 1, 1);
        }
    }
    
    // posiciona as decorações
    for (var j = 0; j < decoracoes.length; j++) {
        var deco = decoracoes[j];
        
        deco.position.x -= (velocidadePista * dificuldadeMultiplicador) * 0.7; 

        if (deco.position.x < -500) { 
            deco.position.x += 2250;  
            deco.position.z = -30 - (Math.random() * 40); 
        }
    }
}

function gerarDecoracoes(scene) {
    var listaDeFabricas = [
        criarRegador, 
        criarCogumelo, 
        criarFlor, 
        criarCanteiro, 
        criarMaca, 
        criarBotao
    ];

    for (var i = 0; i < 15; i++) {
        var sorteio = Math.floor(Math.random() * listaDeFabricas.length);
        var deco = listaDeFabricas[sorteio]();

        var profundidadeZ = -30 - (Math.random() * 40); 
        var espacamentoX = (i * 150) + (Math.random() * 30); 
        
        deco.position.set(espacamentoX, 0, profundidadeZ);
        
        scene.add(deco);
        decoracoes.push(deco);
    }
}

function criarCenoura() {
    var cenoura = new THREE.Object3D();
    var grupoCenoura = new THREE.Object3D();

    // principal
    var topo = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), matCenoura);
    topo.position.y = 3;

    var corpo = new THREE.Mesh(new THREE.CylinderGeometry(2, 0.5, 6, 16), matCenoura);
    corpo.position.y = 0; 

    var ponta = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), matCenoura);
    ponta.position.y = -3;

    // folhas
    var folhagem = new THREE.Object3D();
    
    var f1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), matVerdeCenoura);
    f1.position.set(0, 4.5, 0); 
    
    var f2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), matVerdeCenoura);
    f2.position.set(-1, 4, 0.5); 
    
    var f3 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), matVerdeCenoura);
    f3.position.set(1, 4, -0.5);

    folhagem.add(f1);
    folhagem.add(f2);
    folhagem.add(f3);
    folhagem.scale.set(1, 1.5, 1);

    grupoCenoura.add(topo);
    grupoCenoura.add(corpo);
    grupoCenoura.add(ponta);
    grupoCenoura.add(folhagem);

    grupoCenoura.rotation.z = -0.3;

    cenoura.add(grupoCenoura);
    cenoura.scale.set(1.2, 1.2, 1.2); 
    
    return cenoura;
}

function criarRegador() {
    var regador = new THREE.Object3D();
    var grupoRegador = new THREE.Object3D();

    var corpo = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 12, 16), matRegadorAzul);
    corpo.position.y = 6;

    var bico = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 10, 16), matRegadorAzul);
    bico.position.set(6, 6, 0); 
    bico.rotation.z = -Math.PI / 3.5; 

    var chuveirinho = new THREE.Mesh(new THREE.CylinderGeometry(2, 0.8, 1.5, 16), matMetal);
    chuveirinho.position.set(9.5, 8.5, 0);
    chuveirinho.rotation.z = -Math.PI / 3.5;

    var alcaCostasGeom = new THREE.TorusGeometry(4, 0.8, 8, 16, Math.PI);
    var alcaCostas = new THREE.Mesh(alcaCostasGeom, matRegadorAzul);
    alcaCostas.position.set(-5, 6, 0); 
    alcaCostas.rotation.z = Math.PI / 2; 

    var alcaTopo = new THREE.Mesh(new THREE.TorusGeometry(3, 0.8, 8, 16, Math.PI), matRegadorAzul);
    alcaTopo.position.set(0, 12, 0);

    grupoRegador.add(corpo);
    grupoRegador.add(bico);
    grupoRegador.add(chuveirinho);
    grupoRegador.add(alcaCostas);
    grupoRegador.add(alcaTopo);

    grupoRegador.rotation.y = -0.4;
    grupoRegador.rotation.z = 0.1;

    regador.add(grupoRegador);
    regador.scale.set(7, 7, 7);
    
    return regador;
}

function criarCogumelo() {
    var cogumelo = new THREE.Object3D();
    
    var cauleGeom = new THREE.CylinderGeometry(1.5, 2, 8, 16);
    var caule = new THREE.Mesh(cauleGeom, matCogumeloCaule);
    caule.position.y = 4;
    
    var chapeuGeom = new THREE.SphereGeometry(6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    var chapeu = new THREE.Mesh(chapeuGeom, matCogumeloChapeu);
    chapeu.position.y = 8; 
    
    cogumelo.add(caule);
    cogumelo.add(chapeu);
    cogumelo.scale.set(2, 2, 2);

    return cogumelo;
}

function criarFlor() {
    var flor = new THREE.Object3D();
    
    var caule = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 14, 8), matFlorCaule);
    caule.position.y = 7;
    
    var miolo = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16), matFlorMiolo);
    miolo.position.set(0, 14, 1.5); 
    miolo.scale.set(1, 1, 0.4);

    flor.add(caule); 
    flor.add(miolo);

    var petalaGeom = new THREE.SphereGeometry(2, 16, 16); 
    for (var i = 0; i < 6; i++) {
        var petala = new THREE.Mesh(petalaGeom, matFlorPetala);
        var angulo = (i / 6) * Math.PI * 2; 
        
        var px = Math.cos(angulo) * 3.5;
        var py = Math.sin(angulo) * 3.5 + 14; 
        
        petala.position.set(px, py, 0.8);
        petala.rotation.z = angulo; 
        petala.scale.set(1.8, 1.2, 0.2); 
        
        flor.add(petala);
    }

    flor.scale.set(4, 4, 4);
    return flor;
}

function criarCanteiro() {
    var canteiro = new THREE.Object3D();
    
    var terra = new THREE.Mesh(new THREE.CubeGeometry(24, 3, 16), matTerra);
    terra.position.y = 1.5;

    function criarBroto() {
        var broto = new THREE.Object3D();
        var folhaGeom = new THREE.SphereGeometry(0.8, 8, 8);
        
        var f1 = new THREE.Mesh(folhaGeom, matVerdeCenoura);
        f1.position.set(0, 1.5, 0);
        f1.scale.set(1, 2, 1); 
        
        var f2 = new THREE.Mesh(folhaGeom, matVerdeCenoura);
        f2.position.set(-0.8, 1, 0);
        f2.scale.set(1, 1.5, 1);
        f2.rotation.z = 0.5; 
        
        var f3 = new THREE.Mesh(folhaGeom, matVerdeCenoura);
        f3.position.set(0.8, 1, 0);
        f3.scale.set(1, 1.5, 1);
        f3.rotation.z = -0.5;
        
        broto.add(f1); broto.add(f2); broto.add(f3);
        return broto;
    }

    var brotoEsq = criarBroto();
    brotoEsq.position.set(-6, 3, 0);

    var cenouraMeio = new THREE.Object3D();
    var topoLaranja = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), matCenoura);
    topoLaranja.scale.set(1, 1.3, 1);
    topoLaranja.position.y = 3.5; 
    
    var brotoMeio = criarBroto();
    brotoMeio.position.y = 5.5; 
    
    cenouraMeio.add(topoLaranja);
    cenouraMeio.add(brotoMeio);
    cenouraMeio.position.set(0, 0, 3); 

    var brotoDir = criarBroto();
    brotoDir.position.set(7, 3, -2); 

    canteiro.add(terra);
    canteiro.add(brotoEsq);
    canteiro.add(cenouraMeio);
    canteiro.add(brotoDir);
    
    canteiro.scale.set(2, 2, 2);
    return canteiro;
}

function criarMaca() {
    var maca = new THREE.Object3D();
    
    var corpo = new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 16), matMacaVermelha);
    corpo.scale.set(1, 0.85, 1); 
    corpo.position.y = 3;

    var talo = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8), matMacaTalo);
    talo.position.set(0, 6, 0);
    talo.rotation.z = 0.2; 

    var folha = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), matMacaFolha);
    folha.position.set(1.2, 6, 0);
    folha.scale.set(1, 0.2, 0.5); 
    folha.rotation.z = 0.5;

    maca.add(corpo);
    maca.add(talo);
    maca.add(folha);
    
    maca.rotation.z = -0.1;
    maca.scale.set(12, 12, 12); 
    
    return maca;
}

function criarBotao() {
    var botao = new THREE.Object3D();
    var grupoBotao = new THREE.Object3D();

    var corpo = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 0.8, 16), matBotaoPastel);
    corpo.rotation.x = Math.PI / 2;

    var furoGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
    var posicoesX = [1.2, -1.2, 1.2, -1.2];
    var posicoesY = [1.2, 1.2, -1.2, -1.2];

    for (var i = 0; i < 4; i++) {
        var furo = new THREE.Mesh(furoGeom, matBotaoFuro);
        furo.rotation.x = Math.PI / 2;
        furo.position.set(posicoesX[i], posicoesY[i], 0);
        grupoBotao.add(furo);
    }

    grupoBotao.add(corpo);
    
    grupoBotao.position.y = 4;
    grupoBotao.rotation.y = Math.PI / 4; 
    grupoBotao.rotation.z = 0.3; 
    
    botao.add(grupoBotao);
    botao.scale.set(4, 4, 4);
    
    return botao;
}