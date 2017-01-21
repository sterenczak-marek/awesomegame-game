(function () {

    function BonusController() {

    }

    awesomegame.CONTROLLER.BonusController = awesomegame.CONTROLLER.BonusController || new BonusController();

    BonusController.prototype.activateBonus = function (type, unique_id, x, y) {

        awesomegame.BONUSES.BonusList.activateBonus(type, unique_id, x, y);

        setTimeout(function() {

            var unusedBonus = awesomegame.BONUSES.BonusList.get(unique_id);

            if (unusedBonus) {
                unusedBonus.deactivate();
            }

        }, awesomegame.CONSTANTS.bonusDisplayTime);

    };

}());

(function () {
    function MapObjectController() {

    }

    awesomegame.CONTROLLER.MapObjectController =
        awesomegame.CONTROLLER.MapObjectController || new MapObjectController();

    MapObjectController.prototype.drawMapObject = function(x1, x2, y1, y2) {
        new awesomegame.MAPOBJECTS.MapObject(x1, x2, y1, y2);
    };

}());
