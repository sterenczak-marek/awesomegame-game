/**
 * @author Łukasz Kapuściński
 */

(function () {

    function RegenerateHP(unique_id, x, y) {

        this.durationTime = 0;
        this.icon = regenerateHPBonusGroup.getFirstExists(false);

        this.icon.unique_id = unique_id;
        this.icon.reset(x, y);
        this.isActive = true;
    }

    RegenerateHP.prototype = new awesomegame.BONUSES.Bonus(); // inheritance

    RegenerateHP.prototype.execute = function () {
        regenerate(user);
    };

    RegenerateHP.prototype.executeForEnemy = function (affectedUser) {
        regenerate(affectedUser);
    };


    awesomegame.BONUSES.RegenerateHP = RegenerateHP;

}());
