function gerarCenario(scene) {
    var matCerca = new THREE.MeshLambertMaterial({ color: 0xba8759 });
    var matCenoura = new THREE.MeshLambertMaterial({ color: 0xffaa00 }); 
    var matFolha = new THREE.MeshLambertMaterial({ color: 0x55cc55 }); 

    for(var i = 0; i < 4; i++) {
        var item = new THREE.Object3D();
        var tipoSorteio = i % 3; 
        
            if (tipoSorteio === 0) {
            // cerca base
            var cerca = new THREE.Mesh(new THREE.CubeGeometry(5, 20, 25), matCerca);
            cerca.position.y = 10;
            item.add(cerca);
            item.tipo = 'cerca';
            item.acao = 'pular';
            
        } else if (tipoSorteio === 1) {
            // cerca maior
            var pernaEsq = new THREE.Mesh(new THREE.CubeGeometry(5, 50, 5), matCerca);
            pernaEsq.position.set(0, 25, 12); 
            var pernaDir = new THREE.Mesh(new THREE.CubeGeometry(5, 50, 5), matCerca);
            pernaDir.position.set(0, 25, -12); 
            var traveTop = new THREE.Mesh(new THREE.CubeGeometry(5, 40, 30), matCerca);
            traveTop.position.set(0, 40, 0); 
            item.add(pernaEsq); item.add(pernaDir); item.add(traveTop);
            
            item.tipo = 'cercaAlta';
            item.acao = 'abaixar';
            
        } else {
            // cenoura
            var base = new THREE.Mesh(new THREE.CylinderGeometry(4, 0, 12, 8), matCenoura);
            var topo = new THREE.Mesh(new THREE.CubeGeometry(3, 4, 3), matFolha);
            topo.position.y = 7;
            item.add(base); item.add(topo);
            
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
        item.position.x -= 2.5; 
        var dist = item.position.x - character.position.x;

        if (!modoJogo && item.visible) {
            if (item.acao === 'pular' && dist > 0 && dist < 40 && character.position.y === 10) {
                velocidadeY = 7;
            }
            else if (item.acao === 'abaixar' && dist > -20 && dist < 55) {
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

        // limpa o item da tela
        if (item.position.x < -150) {
            item.position.x += 800;
            item.visible = true; 
            item.scale.set(1, 1, 1);
        }
    }
}