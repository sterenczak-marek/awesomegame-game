var counter = 0,
    collision = false;

function createGame(data) {

    $('#score_table .user-lives').each(function (index, item) {
        $(this).html(3);
    });

    game = new Phaser.Game(1000, 500, Phaser.CANVAS, 'game', {
        preload: preload,
        create: create,
        update: update
    }, true);

    function preload() {

        //game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
        game.load.image('user', '/static/img/sam1.png'); //a3.png
        game.load.image('opponentCar', '/static/img/sam2.png'); //a2.png
        game.load.image('teammateCar', '/static/img/sam2.png'); //a2.png
        //    game.load.image('logo', 'img/team.png');
        game.load.image('bullet', '/static/img/pocisk.png');
        game.load.image('earth', '/static/img/light_sand.png');
        game.load.spritesheet('kaboom', '/static/img/explosion.png', 64, 64, 23);

        game.load.image('speedUp', '/static/img/bonus/speedUp.jpg');
        game.load.image('slowDown', '/static/img/bonus/slowDown.jpg');
        game.load.image('regenerateHP', '/static/img/bonus/regenerateHP.jpg');
        game.load.image('healthBar', '/static/img/full.png');
        game.load.image('twoHealthPoints', '/static/img/shoot1.png');
        game.load.image('oneHealthPoint', '/static/img/shoot2.png');

        game.load.image('obstacle', '/static/img/obstacle.png');

        game.load.image('redFlag', '/static/img/redFlag.png');
        game.load.image('blueFlag', '/static/img/blueFlag.png');
        game.load.image('redBase', '/static/img/redBase.png');
        game.load.image('blueBase', '/static/img/blueBase.png');

    }

    var logo;
    var cursors;
    var fireButton;
    var fullScreenButton;
    var fireRate = 400; // strzał co 4/10 sek.
    var nextFire = 0;

    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.disableVisibilityChange = true;

        // Maintain aspect ratio
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        game.world.setBounds(
            -awesomegame.CONSTANTS.mapSize / 2,
            -awesomegame.CONSTANTS.mapSize / 2,
            awesomegame.CONSTANTS.mapSize,
            awesomegame.CONSTANTS.mapSize
        );

        land = game.add.tileSprite(0, 0, 1000, 500, 'earth'); //kamera do canvas
        land.fixedToCamera = true; //kamera do podłogi


        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet', 0, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        //  Explosion pool
        explosions = game.add.group();

        speedUpBonusGroup = game.add.group();
        speedUpBonusGroup.enableBody = true;
        speedUpBonusGroup.physicsBodyType = Phaser.Physics.ARCADE;
        speedUpBonusGroup.createMultiple(30, 'speedUp', 0, false);
        speedUpBonusGroup.setAll('anchor.x', 0.5);
        speedUpBonusGroup.setAll('anchor.y', 0.5);
        speedUpBonusGroup.setAll('outOfBoundsKill', true);
        speedUpBonusGroup.setAll('checkWorldBounds', true);

        slowDownBonusGroup = game.add.group();
        slowDownBonusGroup.enableBody = true;
        slowDownBonusGroup.physicsBodyType = Phaser.Physics.ARCADE;
        slowDownBonusGroup.createMultiple(30, 'slowDown', 0, false);
        slowDownBonusGroup.setAll('anchor.x', 0.5);
        slowDownBonusGroup.setAll('anchor.y', 0.5);
        slowDownBonusGroup.setAll('outOfBoundsKill', true);
        slowDownBonusGroup.setAll('checkWorldBounds', true);

        regenerateHPBonusGroup = game.add.group();
        regenerateHPBonusGroup.enableBody = true;
        regenerateHPBonusGroup.physicsBodyType = Phaser.Physics.ARCADE;
        regenerateHPBonusGroup.createMultiple(30, 'regenerateHP', 0, false);
        regenerateHPBonusGroup.setAll('anchor.x', 0.5);
        regenerateHPBonusGroup.setAll('anchor.y', 0.5);
        regenerateHPBonusGroup.setAll('outOfBoundsKill', true);
        regenerateHPBonusGroup.setAll('checkWorldBounds', true);

        mapObjectGroup = game.add.group();
        mapObjectGroup.enableBody = true;
        mapObjectGroup.physicsBodyType = Phaser.Physics.ARCADE;
        mapObjectGroup.setAll('anchor.x', 0.5);
        mapObjectGroup.setAll('anchor.y', 0.5);

        //  Do oponentow inne pociski
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'bullet', 0, false);
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 0.5);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        for (var i = 0; i < 10; i++) {
            var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('kaboom');
        }

        //addLogo();

        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.TAB);

        user = new awesomegame.MODEL.User(playerNick, room_slug);
        user.addComponent(pos_x, pos_y);
        backToLive(user);
        bullets.setAll('owner', user);

        resetPlayersPositions(data);

        addCamera();

        if (typeof mode !== 'undefined')
            if (mode.constructor == awesomegame.MODES.CTF) {
                mode.createFlags();
                socket.emit("readyToPlay", '{ "id": "' + playerNick + '", "room": "' + playerRoom + '" }');
            }

        var initial_data = {
            "type": "INIT",
            "data": {
                "id": playerNick,
                "x": pos_x,
                "y": pos_y
            }
        };

        ws4redis.send_message(JSON.stringify(initial_data));
    }

    function addLogo() {

        logo = game.add.sprite(0, 200, 'logo');
        logo.fixedToCamera = true;
        game.input.onDown.add(removeLogo, this);

    }

    function removeLogo() {

        game.input.onDown.remove(removeLogo, this);
        logo.kill();

    }

    function update() {
        collision = false;

        game.physics.arcade.overlap(enemyBullets, user.component, bulletHitPlayer, null, this);
        game.physics.arcade.overlap(enemyBullets, bulletHitObstacle, null, this);
        game.physics.arcade.overlap(bullets, bulletHitObstacle, null, this);

        game.physics.arcade.overlap(speedUpBonusGroup, user.component, userPickedBonus, null, this);
        game.physics.arcade.overlap(slowDownBonusGroup, user.component, userPickedBonus, null, this);
        game.physics.arcade.overlap(regenerateHPBonusGroup, user.component, userPickedBonus, null, this);

        $.each(opponents, function (key, opp) {
            if (opp.health !== 0) {
                game.physics.arcade.collide(user.component, opp.component, collisionHandler, null, this);
                game.physics.arcade.collide(opp.component, mapObjectGroup);
                game.physics.arcade.overlap(bullets, opp.component, bulletHitEnemy, null, this);
            }
        });

        game.physics.arcade.collide(user.component, mapObjectGroup);

        // setTimeout(function () {
        controlKeys();
        // }, 1000);

        moveLand();
        updateNick();
        updateHealthBar();

        if (typeof mode !== 'undefined')
            if (mode.constructor == awesomegame.MODES.CTF)
                mode.update();

        // if (user.component.currentSpeed >= 0) {
        //     $('#pointer').rotate(user.component.currentSpeed - 105);
        // }

        var data = {
            nick: user.nick,
            room: user.room,
            x: user.component.x,
            y: user.component.y
        }

        if (counter >= 50) {
            // socket.emit("synchronizationHack", JSON.stringify(data));
            counter = 0;
        } else if (!collision)
            ++counter;
    }

    function updateNick() {

        if (user.health > 0) {
            user.text.reset(user.component.x, user.component.y - 80);
        }
        $.each(opponents, function (key, opp) {
            if (opp.health > 0) {
                opp.text.reset(opp.component.x, opp.component.y - 80);
            }
        });
    }

    function updateHealthBar() {

        if (user.health > 0) {
            user.healthBar.reset(user.component.x - 20, user.component.y - 60);
        }

        $.each(opponents, function (index, opp) {
            if (opp.health > 0) {
                opp.healthBar.reset(opp.component.x - 20, opp.component.y - 60);
            }
        });

    }

    function collisionHandler(player, opp) { // very very important bitches !!

        collision = true;

        opp.body.velocity.x = 0;
        opp.body.velocity.y = 0;

    }

    function moveLand() {

        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;

    }

    function controlKeys() {

        if (user.health > 0) {

            fireButton.onDown.add(fire, this);
            fullScreenButton.onDown.add(fullScreen, this);

            var up = cursors.up.isDown,
                down = cursors.down.isDown,
                left = cursors.left.isDown,
                right = cursors.right.isDown,
                lastKey = user.component.lastKey;

            // !!!!!!!!!!!!!!!! do wydzielenia stałe bo jak zmieniam wartość dla speedUp to powinno być to ograniczenie aktywne  !!!!!

            if (up && left && (lastKey == '' || lastKey == 'up')) {
                if (user.component.currentSpeed <= awesomegame.CONSTANTS.carMaxSpeedStrigth + user.bonus) {
                    user.component.currentSpeed += user.accelerate;
                }
                changeMove(user.component.currentSpeed, 5, '-', 'up');

            } else if (up && right && (lastKey == '' || lastKey == 'up')) {
                if (user.component.currentSpeed <= awesomegame.CONSTANTS.carMaxSpeedStrigth + user.bonus) {
                    user.component.currentSpeed += user.accelerate;
                }
                changeMove(user.component.currentSpeed, 5, '+', 'up');

            } else if (down && left && (lastKey == '' || lastKey == 'down')) {
                if (user.component.currentSpeed <= awesomegame.CONSTANTS.carMaxSpeedCross) {
                    user.component.currentSpeed += user.accelerate;
                }
                changeMove(user.component.currentSpeed, 3, '+', 'down');

            } else if (down && right && (lastKey == '' || lastKey == 'down')) {
                if (user.component.currentSpeed <= awesomegame.CONSTANTS.carMaxSpeedCross) {
                    user.component.currentSpeed += user.accelerate;
                }
                changeMove(user.component.currentSpeed, 3, '-', 'down');

            } else if (up && (lastKey == '' || lastKey == 'up')) {
                if (user.component.currentSpeed <= awesomegame.CONSTANTS.carMaxSpeedStrigth + user.bonus) {
                    user.component.currentSpeed += user.accelerate;
                }
                changeMove(user.component.currentSpeed, 0, '+', 'up');

            } else if (down && (lastKey == '' || lastKey == 'down')) {
                if (user.component.currentSpeed <= awesomegame.CONSTANTS.carMaxSpeedCross) {
                    user.component.currentSpeed += user.accelerate;
                }
                changeMove(user.component.currentSpeed, 0, '+', 'down');

            } else {
                if (user.component.currentSpeed >= 0) {
                    user.component.currentSpeed -= awesomegame.CONSTANTS.slowDown;

                    if (right && lastKey == 'up' && !down) {
                        user.component.angle += 5;
                    } else if (left && lastKey == 'up' && !down) {
                        user.component.angle -= 5;
                    } else if (right && lastKey == 'down' && !up) {
                        user.component.angle -= 5;
                    } else if (left && lastKey == 'down' && !up) {
                        user.component.angle += 5;
                    }
                } else {
                    user.component.currentSpeed = 0;
                }
            }

            //        user.component.anchor.setTo(0.5, 0.5);


            //        if (user.component.currentSpeed == 0) {
            //            user.component.lastKey = '';
            //            // body.speed - ważne !!!
            //            //oraz user.component.body.velocity.x
            //        } else
            if (user.component.currentSpeed >= 0) {
                if (user.component.lastKey == 'down') {
                    game.physics.arcade.velocityFromRotation(user.component.rotation - Math.PI, user.component.currentSpeed, user.component.body.velocity);
                } else {
                    game.physics.arcade.velocityFromRotation(user.component.rotation, user.component.currentSpeed, user.component.body.velocity);
                }
                if (user.component.currentSpeed == 0) {
                    user.component.lastKey = '';
                }
            }
        }

        $.each(opponents, function (key, opponent) {
            if (opponent.component.currentSpeed >= awesomegame.CONSTANTS.slowDown) {
                opponent.component.currentSpeed -= awesomegame.CONSTANTS.slowDown;
                if (opponent.component.lastKey == 'up') {
                    game.physics.arcade.velocityFromRotation(opponent.component.rotation, opponent.component.currentSpeed, opponent.component.body.velocity);
                } else if (opponent.component.lastKey == 'down') {
                    game.physics.arcade.velocityFromRotation(opponent.component.rotation - Math.PI, opponent.component.currentSpeed, opponent.component.body.velocity);
                }
            } else {
                opponent.component.currentSpeed = 0;
            }
        });

    }

    function changeMove(currentSpeed, angle, sign, lastKey) {

        user.component.currentSpeed = currentSpeed;
        if (sign == '+')
            user.component.angle += angle;
        else
            user.component.angle -= angle;

        user.component.lastKey = lastKey;

        var data = {
            "type": "MOVE",
            "data": {
                id: user.nick,
                room: user.room,
                speed: user.component.currentSpeed,
                angle: user.component.angle,
                x: user.component.x,
                y: user.component.y,
                lastKey: user.component.lastKey
            }
        }

        user.component.anchor.setTo(0.5, 0.5);

        ws4redis.send_message(JSON.stringify(data));

    }

    function bulletHitObstacle (bullet, obstacle) {

        bullet.kill();

    }

    function bulletHitPlayer(player, bullet) {

        if (bullet.owner !== user) {

            var killer = bullet.owner;

            var data = {
                "type": "HIT",
                "data": {
                    id: user.nick,
                    killer: killer.nick
                }
            };

            bullet.kill();

            ws4redis.send_message(JSON.stringify(data));

            damage(user, killer);
        }
    }

    function bulletHitEnemy(opponent, bullet) {

        bullet.kill(); // hack, we unnecessary check collision between ghosts :D
    }

    function userPickedBonus(userComponent, bonus) {

        var foundBonus = awesomegame.BONUSES.BonusList.findBonus(bonus);

        if (foundBonus) {

            var data = {
                "type": "PICKED_BONUS",
                "data": {
                    id: user.nick,
                    unique_id: foundBonus.icon.unique_id
                }
            };

            foundBonus.execute();
            foundBonus.deactivate();

            ws4redis.send_message(JSON.stringify(data));
        }
    }


    function fire() {

        if (game.time.now > nextFire && bullets.countDead() > 0 && user.health > 0) {
            nextFire = game.time.now + fireRate;

            var bullet = bullets.getFirstExists(false);
            bullet.reset(user.component.x, user.component.y);
            bullet.rotation = user.component.rotation;
            bullet.owner = user;
            game.physics.arcade.velocityFromRotation(user.component.rotation, 1000, bullet.body.velocity);

            var data = {
                "type": "FIRE",
                "data": {
                    id: user.nick,
                    x: user.component.x,
                    y: user.component.y,
                    rotation: user.component.rotation
                }
            };

            ws4redis.send_message(JSON.stringify(data));
        }
    }

    function fullScreen() {

        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        }
        else {
            game.scale.startFullScreen(false);
        }
    }
}
