//Disable arrow key scrolling in users browser
window.addEventListener("keydown", function (e) {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// socket.on('errorRegisterNewPlayer', function (data) {
//     errorsRegister.className = "someErrors";
//     errorsRegister.innerHTML = data;
// });
// socket.on('correctRegisterNewPlayer', function (data) {
//     errorsRegister.className = "noErrors";
//     errorsRegister.innerHTML = data;
// });
// socket.on('errorLog', function (data) {
//     errorsLog.className = "someErrors";
//     errorsLog.innerHTML = data;
// });
// socket.on('correctLog', function (data) {
//     errorsLog.className = "noErrors";
//     roomsFromServer.innerHTML = data;
//     $('#closeOpacityDiv').hide();
//     $('#buttonGuest').prop('disabled', true);
//     $('#buttonLog').prop('disabled', true);
//     $('#buttonRegister').prop('disabled', true);
//     $("#popup").fadeOut(1000, function () {
//         $('#buttonGuest').prop('disabled', false);
//         $('#buttonLog').prop('disabled', false);
//         $('#buttonRegister').prop('disabled', false);
//         $("#popupRoom").fadeIn(1000);
//     });
//     // socket.emit("setPopupRoom",true);
//     socket.emit("updateListRooms");

//     $("#roomsFromServer .btn ").click(function () {
//         socket.emit("joinRoomfromPlayer", $(this).attr("id"));
//     })



//     $('#openOpacityDiv').hide();
//     $('#logOut').show();
//     $("#choosingRooms").show();

// });

// socket.on('correctLogGuest', function (data) {
//     errorsLog.className = "noErrors";
//     roomsFromServer.innerHTML = data;
//     $('#closeOpacityDiv').hide();
//     $('#buttonGuest').prop('disabled', true);
//     $('#buttonLog').prop('disabled', true);
//     $('#buttonRegister').prop('disabled', true);
//     $("#popup").fadeOut(1000, function () {
//         $('#buttonGuest').prop('disabled', false);
//         $('#buttonLog').prop('disabled', false);
//         $('#buttonRegister').prop('disabled', false);
//         $("#popupRoom").fadeIn(1000);
//     });

//     $("#roomsFromServer .btn ").click(function () {
//         socket.emit("joinRoomfromPlayer", $(this).attr("id"));
//     })

//     $('#openOpacityDiv').hide();
//     $('#logOut').show();
//     $("#choosingRooms").show();

//     //socket.emit("setPopupRoom",true);
//     socket.emit("updateListRooms");

// });


// socket.on('badNewRoomFromServer', function (data) {
//     errorsCreateRoom.className = "someErrors";
//     errorsCreateRoom.innerHTML = data;
// });


// socket.on('updateListRoomsFromServer', function (data) {

//     $("#roomsFromServer").html(data);
//     $("#roomsFromServer .btn ").click(function () {
//         socket.emit("joinRoomfromPlayer", $(this).attr("id"));
//     })


// });

// socket.on('correctJoinRoomfromServer', function (data) {

//     var helper = JSON.parse(data);

//     console.log(helper);

//     $("#popupRoom").fadeOut(1000);
//     $("#opacityDiv").fadeOut(1000);


//     if (helper.mode != "DM") {
//         $('#teamForUser').show();

//         userTeam = $('#teamForUser').val();

//         $('#teamForUser').change(function () {

//             userTeam = $('#teamForUser').val();
//             socket.emit("playerChooseTeam", userTeam, helper.room);

//         });

//     }

//     $("#list").html("");
//     $("#list").html("<h1>Gracze w pokoju:</h1>");
//     var p = document.createElement("p");
//     p.id = "nick" + helper.nick;
//     p.innerHTML = helper.nick;
//     p.style.color = $('#teamForUser').val();
//     p.style.fontWeight = "bold";
//     document.getElementById("list").appendChild(p);

//     $("#gamePanel").show();
//     $("#userPanel").hide();
//     $("#gameOver").hide();

//     $("#opacityAwesomeGameDiv").show();

//     $("#nick").html(helper.nick);
//     $("#room").html(helper.room);

//     playerNick = helper.nick;
//     playerRoom = helper.room;

// });

// socket.on('correctNewRoomFromServer', function (data) {
//     var helper = JSON.parse(data);

//     console.log(data);
//     errorsCreateRoom.className = "noErrors";
//     errorsCreateRoom.innerHTML = helper.info;
//     $("#popupCreateRoom").fadeOut(1000);
//     $("#opacityDiv").fadeOut(1000);

//     if (helper.mode != "DM") {
//         $('#teamForUser').show();

//         userTeam = $('#teamForUser').val();

//         $('#teamForUser').change(function () {

//             userTeam = $('#teamForUser').val();
//             socket.emit("playerChooseTeam", userTeam, helper.room);

//         });

//     }

//     $("#list").html("");
//     $("#list").html("<h1>Gracze w pokoju:</h1>");
//     var p = document.createElement("p");
//     p.id = "nick" + helper.nick;
//     p.innerHTML = helper.nick;
//     p.style.color = $('#teamForUser').val();
//     p.style.fontWeight = "bold";
//     document.getElementById("list").appendChild(p);

//     var startGameButon = document.createElement("input");
//     startGameButon.type = "button";
//     startGameButon.value = "start";
//     startGameButon.id = "startGameButton";
//     startGameButon.className = "btn btn-lg btn-danger";


//     document.getElementById('startGameButon').appendChild(startGameButon);

//     startGameButon.onclick = function () {
//         socket.emit('startGame', helper.room);
//         $(startGameButon).remove();
//     };

//     $("#gamePanel").show();
//     $("#userPanel").hide();
//     $("#gameOver").hide();

//     $("#opacityAwesomeGameDiv").show();


//     $("#nick").html(helper.nick);
//     $("#room").html(helper.room);

//     playerNick = helper.nick;
//     playerRoom = helper.room;

// });



// socket.on("chatSendMessageToPlayers", function(message, nick) {
//     var chat = document.getElementById("chatMessages");
//     chat.scrollTop = chat.scrollHeight;
//     chat.innerHTML += "<b>" + nick + ":</b> " + htmlspecialchars(message) + "<br/>";
// });

// socket.on("theEnd", function(data) {

//     console.log(data);
//     document.getElementById('gameOverList').innerHTML = data;
//     document.getElementById('sendChatMessage').disabled = "true"
//     document.getElementById('gameOver').style.display = "block";
//     document.getElementById('round').innerHTML = "Koniec gry :)";

//     $("#gamePanel").hide();
//     $("#AwesomeGameDiv > canvas").hide();
//     $("#userPanel").show();

// });

