(function () {

    function BonusList() {

        this.bonuses = {};
    }

    BonusList.prototype.activateBonus = function (type, unique_id, x, y) {

        switch (type) {
            case 0:
                this.bonuses[unique_id] = new awesomegame.BONUSES.SpeedUp(unique_id, x, y);
                break;
            case 1:
                this.bonuses[unique_id] = new awesomegame.BONUSES.SlowDown(unique_id, x, y);
                break;
            case 2:
                this.bonuses[unique_id] = new awesomegame.BONUSES.RegenerateHP(unique_id, x, y);
                break;
        }

    };

    BonusList.prototype.get = function (unique_id) {
        return this.bonuses[unique_id];
    };

    // BonusList.prototype.getActiveBonuses = function() {
    //     this._activeBonuses = this.bonuses.filter(function(bonus) {
    //         return bonus.isActive;
    //     });
    //
    //     return this._activeBonuses;
    // };
    //
    // BonusList.prototype.getIndexOf = function (bonus) {
    //     return this.bonuses.indexOf(bonus);
    // };

    BonusList.prototype.findBonus = function (icon) {

        return this.bonuses[icon.unique_id];
    };

    awesomegame.BONUSES.BonusList = awesomegame.BONUSES.BonusList || new BonusList();

}());
