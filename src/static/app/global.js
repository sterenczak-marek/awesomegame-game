var awesomegame = {},
    game = null,
    opponents = {},
    bullets,
    sounds,
    userTeam = "",
    user = {},
    land,
    speedUpBonusGroup = [],
    slowDownBonusGroup = [],
    regenerateHPBonusGroup = [],
    enemyBullets,
    explosions,
    style = {
        font: "12px Arial",
        align: "center"
    },

    // functions

    allOpponentDeath = function (element, index, array) {
        return element.health === 0;
    },

    addCamera = function () {

        game.camera.follow(user.component); //podąża za graczem
        game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 200); //ustawienia kamery   .. , .. , prawo, dół
        game.camera.focusOnXY(user.component.x, user.component.y); //początkowe ustawienie punktu kamery

    };

awesomegame.BONUSES = {};
awesomegame.CONSTANTS = {};
awesomegame.CONTROLLER = {};
awesomegame.MAPOBJECTS = {};
awesomegame.MODEL = {};
awesomegame.MODES = {};
