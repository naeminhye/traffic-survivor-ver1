$(document).ready(() => {
    WORLD.initCannon();
    WORLD.init();
    $("#music").play();
    WORLD.renderer.animate = WORLD.animate();
});