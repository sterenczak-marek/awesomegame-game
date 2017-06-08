function receiveMessage(msg) {
    var parser = JSON.parse(msg);

    if (parser.type === "INIT") {
        initialData(parser.data);
    } else if (parser.type === "MOVE") {
        moveData(parser.data);
    } else if (parser.type === "FIRE") {
        fireData(parser.data);
    } else if (parser.type === "HIT") {
        hitData(parser.data);
    } else if (parser.type === "BONUS") {
        bonusData(parser.data);
    } else if (parser.type === "PICKED_BONUS") {
        bonusPicketData(parser.data);
    } else if (parser.type === "WIN") {
        playerWin(parser.data);
    } else if (parser.type === "RELOAD") {
        move_to_panel(parser.data)
    }
}

function initialData(data) {
    addOpponent(data);

}

function move_to_panel(data) {

    setTimeout(function () {
        window.location = data.url;
    }, 5000);
}

function moveData(data) {

    var username = String(data.id);

    if (opponents[username] === undefined) {
        addOpponent(data);
    }

    if (opponents[username] !== undefined) {
        var opp = opponents[username];

        opp.component.x = data.x;
        opp.component.y = data.y;
        opp.component.angle = data.angle;
        opp.component.currentSpeed = data.speed;
        opp.component.lastKey = data.lastKey;
    }
}

function fireData(data) {
    var opp = opponents[String(data.id)];
    var bullet = enemyBullets.getFirstExists(false);

    if (opp && opp !== user) {

        console.log("Strzela " + data.id);

        bullet.reset(data.x, data.y);
        bullet.rotation = data.rotation;
        bullet.owner = opp;
        game.physics.arcade.velocityFromRotation(data.rotation, 1000, bullet.body.velocity);
    }
}


function hitData(data) {

    var username = String(data.id);
    var opp = opponents[username];

    damage(opp);
}

function bonusData(data) {
    var type = parseInt(data.type),
        unique_id = String(data.unique_id);

    awesomegame.CONTROLLER.BonusController.activateBonus(type, unique_id, parseInt(data.x, 10), parseInt(data.y, 10));
}

function bonusPicketData(data) {

    var username = String(data.id),
        unique_id = String(data.unique_id),
        opp = opponents[username];

    if (opp && opp !== user) {

        bonus = awesomegame.BONUSES.BonusList.get(unique_id);
        bonus.executeForEnemy(opp);
        bonus.deactivate();
    }
}


function addOpponent(data) {
    var username = String(data.id);

    if (username != playerNick) {
        if (opponents[username]) {
            kill(opponents[username]);
        }

        opp = new awesomegame.MODEL.Opponent(username);
        opp.addComponent(parseInt(data.x, 10), parseInt(data.y, 10));
        backToLive(opp);
        opponents[username] = opp;
    }
}

function playerWin(data) {
    var username = String(data.winner);

    if (username === playerNick) {
        show_stack_modal('success');
        send_player_win();
    } else {
        show_stack_modal('failure')
    }

    function show_stack_modal(type) {

        var opts = {
            title: 'Koniec gry!',
            content: '',
            buttons: {},
        };
        switch (type) {
            case 'failure':
                opts.content = "<h2>Przegrałeś! Wygrał gracz " + username + "</h2>";
                opts.type = "red";
                break;
            case 'success':
                opts.content = "<h1>Wygrałeś!</h1>";
                opts.type = "green";
                break;
        }

        opts.content += "<p>Wkrótce zostaniesz przekierowany do panelu zarządzającego</p>";
        $.dialog(opts);
    }
}

function prepareClientServerConnection() {

    socket.on('sendNewPlayerToAllPlayersInRoom', function (data) {

        var helper = JSON.parse(data);

        if (helper.team == userTeam) {

            teammate = new awesomegame.MODEL.Teammate(helper.id, helper.team);
            teammates.push(teammate);

        } else {
            opp = new awesomegame.MODEL.Opponent(helper.id, helper.team);
            opponents.push(opp);

        }

        var p = document.createElement("p");
        p.id = "nick" + helper.id;
        p.innerHTML = helper.id;
        p.style.color = helper.team;
        document.getElementById("list").appendChild(p);


    });

    socket.on('sendCurrentPlayersInRoomToNewPlayer', function (data) {

        var helper = JSON.parse(data);

        if (helper.team == userTeam) {

            teammate = new awesomegame.MODEL.Teammate(helper.id, helper.team);
            teammates.push(teammate);

        } else {
            opp = new awesomegame.MODEL.Opponent(helper.id, helper.team);
            opponents.push(opp);

        }

        var p = document.createElement("p");
        p.id = "nick" + helper.id;
        p.innerHTML = helper.id;
        p.style.color = helper.team;
        document.getElementById("list").appendChild(p);

    });

    socket.on('playerChangedTeam', function (data) {

        var parser = JSON.parse(data);

        allComputerPlayers = teammates.concat(opponents);

        for (it in allComputerPlayers) {
            var cp = allComputerPlayers[it];

            console.log(cp);
            if (cp.nick == parser.id) {
                cp.team = parser.team;

                $("#list > p")
                    .filter(function (index) {
                        $(this).attr("id") === "nick" + cp.nick;
                    })
                    .css('color', cp.team);
            }
        }

    });

    socket.on('startGameFromServer', function (data) {

        if (!game) {
            createGame(data);
        } else {

            game.state.restart(true, false);

            resetPlayersPositions(data);
        }

        $("#opacityAwesomeGameDiv").hide();
        $("#AwesomeGameDiv").fadeIn(1000);
        $("#countdown").show();


        click = true;

    });

    socket.on('sendNewPositionsToAllPlayersInRoom', function (data) {

        var parser = JSON.parse(data),
            moveOpponent = function (opponent) {

                if (opponent.nick === parser.id) {

                    opponent.component.angle = parser.angle;
                    opponent.component.currentSpeed = parser.speed;
                    opponent.component.lastKey = parser.lastKey;
                }
            };

        allComputerPlayers.forEach(moveOpponent);

    });


    socket.on("helloFromServer", function (data) {
        console.log("pips");
        socket.emit("joinNewPlayer", "siema");
    });

    socket.on('sendNewBulletToAllPlayersInRoom', function (data) {
        var parser = JSON.parse(data);

        var bullet = enemyBullets.getFirstExists(false);
        bullet.reset(parser.x, parser.y);
        bullet.rotation = parser.rotation;
        game.physics.arcade.velocityFromRotation(parser.rotation, 1000, bullet.body.velocity);

    });

    socket.on("sendNewHitToAllPlayersInRoom", function (data) {
        var parser = JSON.parse(data);

        allComputerPlayers.forEach(function (opponent) {
            if (opponent.nick === parser.id) {
                damage(opponent);
            }
        });

        if (opponents.every(allOpponentDeath)) {
            if (typeof mode !== 'undefined') { // if CTF
                // do nothing
            } else {
                var data = {
                    'id': user.nick,
                    'room': user.room
                }
                socket.emit("playerWin", JSON.stringify(data));
            }

        }

    });

    socket.on('sendNewScoreCTF', function (data) {
        var parser = JSON.parse(data);

        if (parser.color == "red") {
            mode._redFlag.reset(true);
        } else {
            mode._blueFlag.reset(true);
        }

        //document.getElementById("nick" + parser.id).innerHTML = parser.id + " - " + parser.score;
    });


    socket.on('sendFlagOwner', function (data) {
        var parser = JSON.parse(data);

        allComputerPlayers.forEach(function (computerPlayer) {
            if (computerPlayer.nick === parser.owner) {
                var carBody = computerPlayer.component.body;
                if (parser.color == "red") {
                    mode._redFlag._component.body.x = carBody.x + awesomegame.CONSTANTS.flagOwnerOffsetX;
                    mode._redFlag._component.body.y = carBody.y + awesomegame.CONSTANTS.flagOwnerOffsetY;
                    mode._redFlag._owner = computerPlayer;
                } else {
                    mode._blueFlag._component.body.x = carBody.x + awesomegame.CONSTANTS.flagOwnerOffsetX;
                    mode._blueFlag._component.body.y = carBody.y + awesomegame.CONSTANTS.flagOwnerOffsetY;
                    mode._blueFlag._owner = computerPlayer;
                }
            }
        });
    });

    socket.on('sendFlagReset', function (data) {
        var parser = JSON.parse(data);

        //allComputerPlayers.forEach(function (computerPlayer) {
        if (parser.color == "red")
            mode._redFlag.reset(parser.fullReset);
        else
            mode._blueFlag.reset(parser.fullReset);
        //});
    });

    socket.on('synchronizationHackFromServer', function (data) {

        var parser = JSON.parse(data);

        for (var iterator in allComputerPlayers) {

            if (allComputerPlayers[iterator].nick == parser.nick) {
                allComputerPlayers[iterator].component.x = parser.x;
                allComputerPlayers[iterator].component.y = parser.y;
            }
        }

    });

    socket.on("playerWinFromServer", function (html, round) {

        document.getElementById("list").innerHTML = html;
        //        $('#round').remove();
        $('#round').html("Aktualna runda: " + round);
        $('teamForUser').hide();
        //        document.getElementById("round").innerHTML = "Liczba rund: <b> " + round + "/10 </b>";


        $("#countdown").html("");
        $("#opacityAwesomeGameDiv").fadeIn(500);

        $(function () {

            var note = $('#note'),
                ts = new Date(),
                newYear = true;

            ts = (new Date()).getTime() + 6 * 1000;
            newYear = false;


            $('#countdown').countdown({
                timestamp: ts,
                callback: function (days, hours, minutes, seconds) {

                    var message = "";

                    message += days + " day" + (days == 1 ? '' : 's') + ", ";
                    message += hours + " hour" + (hours == 1 ? '' : 's') + ", ";
                    message += minutes + " minute" + (minutes == 1 ? '' : 's') + " and ";
                    message += seconds + " second" + (seconds == 1 ? '' : 's') + " <br />";

                    if (newYear) {
                        message += "left until the new year!";
                    } else {
                        message += "left to 10 days from now!";
                    }

                    note.html(message);
                }
            });

        });

        setTimeout(function () {

            $("#opacityAwesomeGameDiv").fadeOut(500);
            socket.emit('startGame', user.room);
        }, 4500);

    });

    socket.on("receiveBonus", function (index, x, y) {

        awesomegame.CONTROLLER.BonusController.activateBonus(index, x, y);

    });

    socket.on("receiveMapObject", function (walls, map) {

        console.log(map);
        for (var i = 0; i < walls.length; ++i) {
            if (i % 2 === 0)
                var wall = new awesomegame.MAPOBJECTS.Wall(
                    walls[i].x * 40 - 1000,
                    walls[i].y * 40 - 1000,
                    walls[i].hScale / 2,
                    walls[i].vScale
                );
            else
                var wall = new awesomegame.MAPOBJECTS.Wall(
                    walls[i].x * 40 - 1000,
                    walls[i].y * 40 - 1000,
                    walls[i].hScale,
                    walls[i].vScale / 2
                );
        }

    });

    socket.on('playerPickedBonusFromServer', function (data) {

        var parser = JSON.parse(data),
            bonus = awesomegame.BONUSES.BonusList.get(parseInt(parser.bonusIndex));

        if (user.nick === parser.id) {

            bonus.execute();
        } else {

            bonus.executeForEnemy();
        }

        bonus.deactivate();


    });
}
