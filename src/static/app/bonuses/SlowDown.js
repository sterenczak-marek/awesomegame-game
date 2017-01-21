/**
 * @author Łukasz Kapuściński
 */

(function () {

    function SlowDown(unique_id, x, y) {

        this.durationTime = awesomegame.CONSTANTS.bonusDuration.speedUp;
        this.icon = slowDownBonusGroup.getFirstExists(false);

        this.icon.unique_id = unique_id;
        this.icon.reset(x, y);
        this.isActive = true;

    }

    SlowDown.prototype = new awesomegame.BONUSES.Bonus(); // inheritance

    awesomegame.BONUSES.SlowDown = SlowDown;

    SlowDown.prototype.execute = function () {

        user.bonus = -40;
        user.component.currentSpeed -= 40;

        setTimeout(function () {
            user.bonus = 0;
        }, this.durationTime);

    };

}());
