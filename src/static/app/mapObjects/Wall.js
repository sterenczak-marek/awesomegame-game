(function () {

    function Wall(x, y, scaleX, scaleY) {

       // while (typeof mapObjectGroup === 'undefined') {
            //wait for game to start
        //}

        this.graphics = mapObjectGroup.create(x, y, 'obstacle');
        this.graphics.body.immovable = true;
        this.graphics.scale.setTo(scaleX, scaleY);

    }

    Wall.prototype = new awesomegame.MAPOBJECTS.MapObject(); // inheritance

    awesomegame.MAPOBJECTS.Wall = Wall;

} ());