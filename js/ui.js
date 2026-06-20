function trocarView(idDestino) {
    // substitui as views
    var views = document.getElementsByClassName('view');
    for (var i = 0; i < views.length; i++) {
        views[i].style.display = 'none';
    }
    
    // Mostra o destino
    var destino = document.getElementById(idDestino);
    if (destino) {
        destino.style.display = 'flex';
    } else {
        console.error("Cuidado! O id " + idDestino + " não existe no seu HTML.");
    }
}