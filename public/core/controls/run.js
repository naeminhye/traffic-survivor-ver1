$(document).ready(() => {
    WORLD.initCannon();
    WORLD.init();
    WORLD.renderer.animate = WORLD.animate();
});