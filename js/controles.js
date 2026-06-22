document.addEventListener('keydown', function(event) {
    if (event.keyCode === 32 || event.keyCode === 38 || event.keyCode === 87) {
        if (typeof character !== 'undefined' && character.position.y === 10 && !abaixada) {
            velocidadeY = 7;
        }
        if(event.keyCode === 32 || event.keyCode === 38) event.preventDefault(); 
    }


    if (event.keyCode === 40 || event.keyCode === 83) {
        if (!abaixada) {
            abaixada = true;
            event.preventDefault();
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (event.keyCode === 40 || event.keyCode === 83) {
        abaixada = false;
    }
});