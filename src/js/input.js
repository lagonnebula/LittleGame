/**
 * Created by Meuhmeuh on 01/03/2015.
 */
(function(){
    var CONST = {
        width: 800,
        height: 600
    };

    var socket = io();
    var PlayerObj = {};
    var ennemiesData = {};
    var ennemiesObj = {};
    var myId;
    socket.on('connect', function(){
        myId = socket.io.engine.id;
        PlayerObj = {
            id      :   myId,
            position: {
                x: 0,
                y:0
            },
            rotation: 0,
            life    : 1
        };
    });

    socket.on("player update", function(data){
        console.log("Player %s update", data.id);
        if(data.id !== myId){
            ennemiesData[data.id] = data;
        }
    });

    socket.on("player delete", function(data){
        console.log("Player %s delete", data);
        delete ennemiesData[data];
        delete ennemiesObj[data];
    });

    var game = new Phaser.Game(CONST.width,CONST.height, Phaser.WEBGL, 'game', { preload: preload, create: create, update: update });

    var sol;
    var player;
    var viseur;

    var cursors;

    function preload() {
        game.load.image("player","./assets/img/player.png");
        game.load.image("cursor","./assets/img/cursor.png");
        game.load.image("sol","./assets/img/sol.png");
    }

    function create() {
        game.world.setBounds(-1000,-1000,2000,2000);

        sol = game.add.tileSprite(0,0, CONST.width, CONST.height, "sol");
        sol.fixedToCamera = true;

        player = game.add.sprite(0,0,'player');
        player.anchor.setTo(0.5,0.5);

        game.physics.enable(player, Phaser.Physics.ARCADE);

        player.bringToTop();

        game.camera.follow(player);
        game.camera.deadzone = new Phaser.Rectangle(150,150,500,300);
        game.camera.focusOnXY(0,0);

        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if(cursors.left.isDown){
            player.body.velocity.x = -150;
        }else if(cursors.right.isDown){
            player.body.velocity.x = 150;
        }

        if(cursors.up.isDown){
            player.body.velocity.y = -150;
        }else if(cursors.down.isDown){
            player.body.velocity.y = 150;
        }

        sol.tilePosition.x = -game.camera.x;
        sol.tilePosition.y = -game.camera.y;

        player.rotation = game.physics.arcade.angleToPointer(player);
        player.rotation += (Math.PI/90)*45;

        PlayerObj.position = player.body.position;
        PlayerObj.rotation = player.rotation;
        socket.emit("player infos", PlayerObj);

        for(id in ennemiesData){
            if(typeof ennemiesObj[id] === "undefined"){
                console.log("Sprite added for %s", id);
                console.log(ennemiesData[id]);
                ennemiesObj[id] = game.add.sprite(ennemiesData[id].position.x,ennemiesData[id].position.y,'player');
                ennemiesObj[id].anchor.setTo(0.5,0.5);
                game.physics.enable(ennemiesObj[id], Phaser.Physics.ARCADE);
                ennemiesObj[id].bringToTop();
            }
            ennemiesObj[id].position = ennemiesData[id].position;
            ennemiesObj[id].rotation = ennemiesData[id].rotation;
        }
    }

    function render(){

    }
})();