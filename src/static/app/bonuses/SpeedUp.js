(function () {

    function SpeedUp(unique_id, x, y) {

        this.durationTime = awesomegame.CONSTANTS.bonusDuration.speedUp;
        this.icon = speedUpBonusGroup.getFirstExists(false);

        this.icon.unique_id = unique_id;
        this.icon.reset(x, y);
        this.isActive = true;
    }

    SpeedUp.prototype = new awesomegame.BONUSES.Bonus(); // inheritance

    awesomegame.BONUSES.SpeedUp = SpeedUp;

    SpeedUp.prototype.execute = function () {

        user.bonus = 200;

        setTimeout(function () {
            user.bonus = 0;
        }, this.durationTime);

    };

}());
