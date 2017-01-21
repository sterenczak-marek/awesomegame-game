(function () {

    function Bonus() {
        this.durationTime = 0;
        this.icon = {};
        this.isActive = false;
    }


    awesomegame.BONUSES.Bonus = Bonus;

    Bonus.prototype.adjustComponent = function () {
        this.component.anchor.setTo(0.5, 0.5);

        game.physics.enable(this.component, Phaser.Physics.ARCADE);
        this.component.body.collideWorldBounds = true;
        this.component.body.outOfBoundsKill = true;
    };

    Bonus.prototype.deactivate = function() {
        delete awesomegame.BONUSES.BonusList.bonuses[this.icon.unique_id];

        this.icon.kill();
        this.isActive = false;
    };

    Bonus.prototype.execute = function() {
        // do nothing
    };

    Bonus.prototype.executeForEnemy = function() {
        // do nothing
    };


    Bonus.prototype.getComponent = function() {
        return this._icon;
    };

}());
