(function () {

    function User(nick, room, team) {
        this.nick = nick;
        this.room = room;
        this.team = team;

        this.health = 3;
        this.accelerate = awesomegame.CONSTANTS.accelerate;
        this.bonus = 0;

        this.flag = undefined;
    }

    User.prototype.addComponent = function (x, y) {
        this.component = game.add.sprite(x, y, "user");
        this.adjustComponent();
    }

    User.prototype.adjustComponent = function () {
        this.component.anchor.setTo(0.5, 0.5);

        game.physics.enable(this.component, Phaser.Physics.ARCADE);
        //this.component.body.drag.set(0.2);
        this.component.body.maxVelocity.setTo(400, 400);
        this.component.body.collideWorldBounds = true;
        this.component.currentSpeed = 0;
        this.component.lastKey = '';
        this.component.bringToTop();
    }

    awesomegame.MODEL.User = User;

}());

(function () {

    function Opponent(id) {
        this.nick = id;
        this.health = 3;
    }

    Opponent.prototype.addComponent = function (x, y) {

        this.component = game.add.sprite(x, y, "opponentCar");
        this.adjustComponent();
    }

    Opponent.prototype.adjustComponent = function () {
        this.component.anchor.setTo(0.5, 0.5);

        game.physics.enable(this.component, Phaser.Physics.ARCADE);
        //this.component.body.drag.set(0.2);
        this.component.body.maxVelocity.setTo(400, 400);
        this.component.body.collideWorldBounds = true;
        this.component.currentSpeed = 0;
        this.component.lastKey = '';
        //    this.component.body.drag.set(20, 20);
        this.component.body.bounce.set(5);
        //    this.component.body.allowRotation = true;

    }

    awesomegame.MODEL.Opponent = Opponent;
}());

(function () {

    function Teammate(id, team) {
        this.nick = id;
        this.health = 3;
        this.team = team;
    }

    Teammate.prototype.addComponent = function (x, y) {

        this.component = game.add.sprite(x, y, "teammateCar");
        this.adjustComponent();
    }

    Teammate.prototype.adjustComponent = function () {
        this.component.anchor.setTo(0.5, 0.5);

        game.physics.enable(this.component, Phaser.Physics.ARCADE);
        this.component.body.maxVelocity.setTo(0, 0);
        this.component.body.collideWorldBounds = true;
        this.component.currentSpeed = 0;
        this.component.body.bounce.set(5);

    }

    awesomegame.MODEL.Teammate = Teammate;

}());

( function() {
    function Flag(room, color, mode) {
        this._color = color;
        this._room = room;

        this._owner = undefined;
        this._ownerOffsetX = awesomegame.CONSTANTS.flagOwnerOffsetX;
        this._ownerOffsetY = awesomegame.CONSTANTS.flagOwnerOffsetY;

        this._baseOffset = awesomegame.CONSTANTS.baseSize/4;

        if (color == "red") {
            this._initX = this._x = mode._redBase.x + 3 * this._baseOffset;
            this._initY = this._y = mode._redBase.y + this._baseOffset;
        }
        else {
            this._initX = this._x = mode._blueBase.x + this._baseOffset;
            this._initY = this._y = mode._blueBase.y + 3 * this._baseOffset;
        }

        this.addComponent(this._x, this._y);

    }

    Flag.prototype.addComponent = function (x, y) {

        if (this._color == "red")
            this._component = game.add.sprite(x, y, "redFlag");
        else
            this._component = game.add.sprite(x, y, "blueFlag");

        game.physics.enable(this._component);

    }

    Flag.prototype.hasOwner = function() {

        if (typeof this._owner !== 'undefined')
            return true;

        return false;

    }

    Flag.prototype.emitReset = function(fullReset) {

        socket.emit("flagReset", '{ "color": "' + this._color + '", "room": "' + this._room + '", "fullReset": "' + fullReset + '" }');

    }

    Flag.prototype.reset = function(fullReset) {


        if (this.hasOwner()) {
            this._owner.flag = undefined;
            this._owner = undefined;
        }
        if (fullReset == true || fullReset == "true") {
            console.log("fullReset");
            this._component.x = this._initX;
            this._component.y = this._initY;
        }



    }

    Flag.prototype.update = function() {
        if (this.hasOwner()) {
            if (this._owner == user)
                socket.emit("flagInfo", '{ "color": "' + this._color + '", "room": "' + this._room + '", "owner": "' + user.nick + '" }');

            var ownerBody = this._owner.component.body;
            this._component.x = ownerBody.x + this._ownerOffsetX;
            this._component.y = ownerBody.y + this._ownerOffsetY;
        }
    }

    awesomegame.MODEL.Flag = Flag;
}());

// global functions

function resetPlayersPositions(data) {

    for (i in data) {
        var parser = JSON.parse(data[i]);

        if (parser.id == user.nick) {

            console.log(parser)

            user.addComponent(parseInt(parser.x, 10), parseInt(parser.y, 10));
            backToLive(user);
        } else {
            allComputerPlayers.forEach(function (opponent) {
                if (opponent.nick === parser.id) {
                    opponent.addComponent(parseInt(parser.x, 10), parseInt(parser.y, 10));
                    opponent.team = parser.team;
                    backToLive(opponent);
                }
            });
        }
    }

    addCamera();

};

function backToLive(affectedUser) {

    affectedUser.health = 3;
    affectedUser.healthBar = game.add.sprite(affectedUser.component.x - 20, affectedUser.component.y - 60, 'healthBar');

    affectedUser.text = game.add.text(affectedUser.component.x, affectedUser.component.y - 80, affectedUser.nick, style);
    affectedUser.text.anchor.set(0.5);

};

function emitRespawn(affectedUser) {

    socket.emit("playerRespawn", '{ "color": "' + affectedUser.team + '", "room": "' + affectedUser.room + '", "id": "' + affectedUser.nick + '" }');
    affectedUser.addComponent(affectedUser.x, affectedUser.y); // ;D
    backToLive(affectedUser);
    addCamera();

};

function kill(affectedUser) {
    affectedUser.text.kill();
    affectedUser.component.kill();
    affectedUser.healthBar.kill();
}

function explode(affectedUser) {

    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(affectedUser.component.x, affectedUser.component.y);
    explosionAnimation.play('kaboom', 30, false, true);
    affectedUser.text.kill();
    affectedUser.component.kill();

    // if (this.flag !== undefined) {
    //     this.flag.emitReset(false);
    //     this.flag.reset(false);
    // }

    if (typeof mode !== 'undefined')
        if (mode.constructor == awesomegame.MODES.CTF)
            setTimeout(function(){emitRespawn(affectedUser)}, awesomegame.CONSTANTS.respawnDuration);

};

function damage(affectedUser, killer) {
    affectedUser.health--;
    affectedUser.healthBar.kill();

    $('#score_table #user-' + affectedUser.nick + '-lives').html(affectedUser.health);

    switch (affectedUser.health) {
        case 2:
            affectedUser.healthBar = game.add.sprite(affectedUser.component.x - 20, affectedUser.component.y - 60, "twoHealthPoints");
            break;
        case 1:
            affectedUser.healthBar = game.add.sprite(affectedUser.component.x - 20, affectedUser.component.y - 60, "oneHealthPoint");
            break;
        case 0:
            if (affectedUser === user) {
                game.camera.follow(killer.component);
            }
            explode(affectedUser);

            var all_players_dead = true;
            $.each(opponents, function (index, item) {
                if (item.health != 0) {
                    all_players_dead = false;
                }
            });

            if (all_players_dead) {
                var data = {
                    'type': "WIN",
                    'data': {
                        'winner': user.nick
                    }
                };

                ws4redis.send_message(JSON.stringify(data));

                send_player_win();
            }
            break;
    }
};

function send_player_win() {
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        type: 'PUT',
        url: '/api/user/win/',
        headers: {
            "X-CSRFToken": csrftoken
        }
    })
}

function regenerate(affectedUser) {
    affectedUser.healthBar.kill();
    if (affectedUser.health != 3) {
        affectedUser.health ++;
    }

    switch (affectedUser.health) {
        case 3:
            affectedUser.healthBar = game.add.sprite(affectedUser.component.x - 20, affectedUser.component.y - 60, "healthBar");
            break;
        case 2:
            affectedUser.healthBar = game.add.sprite(affectedUser.component.x - 20, affectedUser.component.y - 60, "twoHealthPoints");
            break;
    }
};


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
