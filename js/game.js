var App = function () {
};
// by Alexey Zapromyotov (c) 2019-2021
var customIUN="";
var isSilent = true; //No music no sounds!
var isMapHidden = false; // to show and hide miniMap
var cWidth = 800; //canvas width
var cHeight = 520; //canvas height
$("#closeMiniMap").unbind("click");
$("#closeMiniMap").bind("click", closeMiniMap);
App.prototype.start = function () {
    var config = {
        type: Phaser.CANVAS,
        width: cWidth,
        height: cHeight,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        canvas: document.querySelector('canvas')
    };
    var isBrowserIE = false;
    isBrowserIE = msieversion();
    var language = '';
    var megaMAP;    var initMap;    var roomsMAP = [];
    var userIUN;
    var player;    var npcGroup; var arrScenes =[]; var arrAllStories=[];
    var theGameIsStarted = false;
    var cursors; var wasd; //both are to capture key pressed
    var score ;
    var gameOver = false;
    var scoreText;    var scoreTextShade;    var scoreTextShade0;  var playPosText;
    var sceneText; //to show the text for a scene
    var isPause = false;
    var keyIndex = 0;
    var mapLocContent;
    var game = new Phaser.Game(config);
    var _this;
    var position = {x: 0, y: 0};
    var initMapPos = {initX: 0, initY: 0};
    var maxRoomCountX;    var maxRoomCountY;
    var hospitalBed; var officeCompDesk;
    var totalQestionsAnswered = 0;    var totalQestionsAsked = 0;    var listofquestions = "";
    var currentScene = { isActive: false, sceneContent: null }; // current Scene storage
    var music;    var doorOpen;    var soundStep;    var pickupKey;    var soundOk;
    var soundFail;    var soundFinal;    var gameState;    var isSurveySent = false;    var langLabel = '';

    var doorsArray = [];
    const questionWindow = document.getElementById("questionWindow");
    const video = document.getElementById("video");
    const finScr = document.getElementById("finScr");
    const divScoreText = document.getElementById("divScoreText");
    const submitAnswerButton = document.getElementById("submitAnswerButton");
    const submitMsgContainer = document.getElementById("submitMsg");
    const isSilentCheckBox = document.getElementById("silentCheckBox");
                document.getElementById("silentCheckBox").checked = true;
    const hideMapCheckBox = document.getElementById("hideMapCheckBox");
    const testBoxDiv = document.getElementById("testBoxDiv");
    const subtitlesPannel = document.getElementById("subtitles"); //// to show and hide miniMap

    var subtitles = [];
    var addSubtitles = function (newText) {
        let found = false;
        for (let i = 0; i < subtitles.length; i++ ) {
             let txt = subtitles[i];
             if (txt === newText && !found) {
                 found = true;
             }
        }
        if (!found) {
            let text = "";
            subtitles[subtitles.length] = newText;
            for (let i = 0; i < subtitles.length; i++ ) {
                text += "<br/>" + subtitles[i];
            }
            subtitlesPannel.innerHTML = text;
        }
    }

    var clearSubtitles = function () {
        subtitles = [];
        addSubtitles("");
    }

    var tryUserIUN = document.getElementById("userIUNBox");
    if (tryUserIUN != null) {
        tryUserIUN = document.getElementById("userIUNBox").innerHTML;
        userIUN = tryUserIUN;
    } else {
            userIUN = 'UNKNOWN';
            console.log('element userIUNBox seems to be empty!');
    }

    console.log('userIUN from userIUNBox: ', userIUN);

    langLabel = document.getElementById("languages");
    if (langLabel != null) {
        langLabel = document.getElementById("languages").innerHTML; //id="languages"
    } else {
        langLabel = 'English';
    }

    // the language label has inversed logic:
    if (langLabel === 'English') {
      language = 'FRA';
    } else {
      language = 'ENG';
    }
    changeLanguage(false);

    //alert('Lang: ', language);
    //a button action to change the language:
    $("#langChange").unbind("click");
    $("#langChange").bind("click", changeLanguage);

    function preload() {
        //==================
        _this = this;
        //==================
        this.load.json('megaMAP', 'rest/getMap.php');

        // this.load.audio('theme', [ 'assets/bgCut1.mp3'  ]);
        this.load.audio('theme', [ 'assets/meitpower_lq.mp3'  ]);
        //baseRoomBack = RoomBG_red.png 1000 px X 650px
        // scale 0.8 we have: 800 x 520
        this.load.image('RoomBG_01', 'png/RoomBG_01_blue.png');
        this.load.image('RoomBG_02', 'png/RoomBG_02_yellow.png');
        this.load.image('RoomBG_03', 'png/RoomBG_03_red.png');
        this.load.image('RoomBG_04', 'png/RoomBG_04_green.png');
        this.load.image('RoomBG_05', 'png/RoomBG_05_orange.png');
        this.load.audio('soundStep', 'assets/walking0.mp3');

        this.load.audio('doorOpen', 'assets/doorOpen.mp3');
        this.load.audio('soundFail', 'assets/wrongAnswer.mp3');
        this.load.audio('pickupKey', 'assets/pickupKey.mp3');
        this.load.audio('soundOk', 'assets/okay.mp3');
        this.load.audio('soundFinal', 'assets/fanfareFinale.mp3');

        //this.load.image('baseRoomBack', 'png/RoomBG_red_withBG.png');
        this.load.image('finalRoom', 'png/RoomBG_01_final.png');
        // rooms assets section completed!
        this.load.image('hospitalBed', 'png/hospitalBed.png');
        //patientEmptyPlaceHolder.png
        this.load.image('patientEmptyPlaceHolder', 'png/patientEmptyPlaceHolder.png');
        //doors:
        this.load.spritesheet('doorU', 'png/doorUsprite.png', {frameWidth: 180, frameHeight: 180});
        this.load.spritesheet('doorD', 'png/doorDsprite.png', {frameWidth: 180, frameHeight: 180});
        this.load.spritesheet('doorL', 'png/doorLsprite.png', {frameWidth: 180, frameHeight: 180});
        this.load.spritesheet('doorR', 'png/doorRsprite.png', {frameWidth: 180, frameHeight: 180});

        this.load.spritesheet('elevDoorFace', 'png/doorD.png', {frameWidth: 180, frameHeight: 180});
        //==============================================
        //blocks:
        this.load.image('blockRed', 'png/block20x20red.png');
        //this.load.image('blockRed', 'png/block20x20.png');
        //==============================================
        this.load.image('gold-key', 'png/goldenKey.png'); //gold-key
        this.load.image('messageBoard', 'png/subTitleBackBrownStiches.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('computerSetOff', 'png/ComputerSetOff.png'); //officeCompDesk
        this.load.spritesheet('gold-key-sprite', 'png/gold-key.png', { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet('green-key-sprite', 'png/keyAnimation.png', { frameWidth: 40, frameHeight: 100 });
        this.load.spritesheet('questionMark', 'png/questionMarkV4.png', { frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('compDeskScrBlank', 'png/ComputerSetOffV2.png', {frameWidth: 125, frameHeight: 125}); //officeCompDesk
        this.load.spritesheet('ComputerScreenSet6', 'png/ComputerScreenSet6x750x85.png', {frameWidth: 125, frameHeight: 85});
        this.load.spritesheet('cafeTableBrown', 'png/cafeteriaTablesSprite.png', {frameWidth: 80, frameHeight: 75});

        this.load.spritesheet('scientistTable', 'png/scientistTable160x225x6frames.png', {frameWidth: 80, frameHeight: 75});
        this.load.spritesheet('docOther', 'png/docOther.png', {frameWidth: 50, frameHeight: 75}); //docOther.png
        this.load.spritesheet('docAlEinst', 'png/docAlEinstV2.png', {frameWidth: 50, frameHeight: 75}); //docAlEinst.png

        this.load.spritesheet('HSoloMan', 'png/HSoloMan1_Sprite.png', {frameWidth: 50, frameHeight: 75}); 
        this.load.spritesheet('HSoloManTypingPhoto', 'png/HSoloMan_TypingPhonePhoto.png', {frameWidth: 50, frameHeight: 75});
        this.load.spritesheet('dude', 'png/docMUHC50x75L4U4D4R4.png', {frameWidth: 50, frameHeight: 75});
        this.load.spritesheet('docWalk4w', 'png/doctorWalkFourWay.png', {frameWidth: 50, frameHeight: 75});

        this.load.spritesheet('compDesk4x4', 'png/compDesk4x4v3Lock.png', {frameWidth: 75, frameHeight: 75});
        this.load.spritesheet('yellowDocOne', 'png/yellowDocOne.png', {frameWidth: 64, frameHeight: 72});
        this.load.spritesheet('docAlEinstStand', 'png/docAlEinstStand.png', {frameWidth: 50, frameHeight: 75});
        this.load.spritesheet('docAlEinstTypingFW', 'png/docAlEinstTypingFWV2.png', {frameWidth: 50, frameHeight: 75});
        //HSoloMan_SingleImg_Sprite
        this.load.spritesheet('HSoloSingleImg', 'png/HSoloMan_SingleImg_Sprite.png', {frameWidth: 64, frameHeight: 72});
        this.load.spritesheet('HSoloStandUp', 'png/HSoloMan_StandUp_Sprite.png', {frameWidth: 50, frameHeight: 75});
        
        // SuperMan
        this.load.spritesheet('SuperHeroStanding', 'png/SuperMan_Frames_60x80x7.png', {frameWidth: 60, frameHeight: 80});
        //SuperManStandFW
        this.load.spritesheet('SuperManStandFW', 'png/SuperManStandFW.png', {frameWidth: 60, frameHeight: 80});
        this.load.spritesheet('SuperHero', 'png/SuperManMoves_60x80x30.png', {frameWidth: 60, frameHeight: 80});

    }

    function buildGameState(userName, sessionId) {
        return {
            correctCount: 0,
            user: userName,
            customIUN: customIUN,
            isFinished: 0,
            elapsedTime: 0,
            timestart: startTime,
            timefinish: "",
            listofquestions: listofquestions,
            comments: "",
            sessionId: sessionId
        }
    }

    function create() {
      if (!isBrowserIE) {
        if (game.sound.context.state === 'suspended') {
          game.sound.context.resume();
        }
      }
        // init other states
        megaMAP = game.cache.json.get('megaMAP');
        this.cameras.main.setBackgroundColor('#333');
        gameState = buildGameState(userIUN, megaMAP.sessionId);
        gameState.user = userIUN;
        gameState.customIUN = customIUN;
        initMap = megaMAP.initMAP;
        maxRoomCountX = initMap[0].length;
        maxRoomCountY = initMap.length;

        showMazeGfx(megaMAP.doorsMAP, "divMiniMap",language);
        mapLocContent = document.getElementById("y0x0").innerHTML;
        cursors = this.input.keyboard.createCursorKeys();
        wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        // walls = this.physics.add.staticGroup();
        // walls.create(160, 450, 'wall400x230').setScale(0.8).refreshBody();

        buildWorld(this);
        scoreTextShade0 = this.add.text(15, 15, 'keys: 0', {fontSize: '32px', fill: '#0031FF'});
        scoreTextShade = this.add.text(17, 17, 'keys: 0', {fontSize: '32px', fill: '#ff00ff'});

        scoreText = this.add.text(16, 16, 'keys: 0',
          {
            fontSize: '32px',
            fill: '#FDFC00',
            /* backgroundColor: '#479B85',*/
            shadow: "offsetX = 5, offsetY = 5, fill= true"
          });

        playPosText = this.add.text(260, 16, 'Pos: 0',
          {
            fontSize: '32px',
            fill: '#FDFC00',
            /* backgroundColor: '#479B85',*/
            shadow: "offsetX = 5, offsetY = 5, fill= true"
          });
          //sceneText - we can see the dialogs next to the personor NPCs:
         sceneText = this.add.text(10, 450, 'Text:',
            {
              fontSize: '20px',
              fill: '#DEF9FA',
              backgroundColor: '#241D4A',
              shadow: "offsetX = 15, offsetY = 15, fill= true"
            });
        sceneText.setDepth(10);

          divScoreText.style = "scoreText-container";
          divScoreText.innerHTML = "You have keys: <br><hr/><br>";

        //scoreImgs = this.physics.add.group();
        this.cameras.main.startFollow(player);
        this.physics.add.collider(player, walls);
        this.physics.add.collider(npcGroup, walls, null, npcHitTheWall, this);
        this.physics.add.collider(npcGroup, npcGroup, null, npcHitOtherNpc, this);
        this.physics.add.collider(player, doors, null, hitTheDoor, this);
        this.physics.add.collider(player, hospitalBed, null, breakingBad, this);
        this.physics.add.overlap(player, doorkeys, collectKey, null, this);
        this.physics.add.collider(npcGroup, player, null, playerHitNpc, this);
        music = this.sound.add('theme');
        soundStep = this.sound.add('soundStep');
        doorOpen = this.sound.add('doorOpen');
        pickupKey = this.sound.add('pickupKey');
        soundOk = this.sound.add('soundOk');
        soundFail = this.sound.add('soundFail');
        soundFinal = this.sound.add('soundFinal');
    }

    function buildWorld(scene) {
        //We get our source from the following rest:
        // megaMAP = game.cache.json.get('megaMAP');
        // roomsMAP = game.cache.json.get('doorsMAP');
        doors = scene.physics.add.group({
            immovable: true
        });
        walls = scene.physics.add.staticGroup();
        doorkeys = scene.physics.add.group();        

        // scientistTable = scene.physics.add.sprite(2200, 1600, 'scientistTable');
        //this.load.image('computerSetOff', 'png/ComputerSetOff.png')
        // officeCompDesk.setDepth(0);
        hospitalBed = scene.physics.add.group({
            immovable: true
        });
        npcGroup = scene.physics.add.group();
        npcGroup.setDepth(10);

        for (var y = 0; y < megaMAP.doorsMAP.length; y++) {
            //megaMAP.doorsMAP[y]
            var mapDoors = megaMAP.doorsMAP[y];
            var mapDoor=[];
            for (var x = 0; x < mapDoors.length; x++) {
                //mapDoors[x]
                mapDoor = mapDoors[x];
                // init room center coordinaters:
                var indX = 800 * x;
                var indY = 520 * y;
                //console.log('generateArrayMap mapDoor: ', mapDoor);
                //var roomName = JSON.stringify(mapDoor);
                var roomName = 'u' + mapDoor.U + 'd' + mapDoor.D + 'l' + mapDoor.L + 'r' + mapDoor.R;
                // scene.add.image(400 +indX, 270 + indY, roomName).setScale(0.8);

                if (x == maxRoomCountX - 1 && y == maxRoomCountY - 1) {
                    //finalRoom - settle the destination coordinates:
                    scene.add.image(400 + indX, 270 + indY, 'finalRoom').setScale(0.8);
                } else {
                    var randomRoom = (Math.round(Math.random() * 4))+1; //RoomBG_0
                    scene.add.image(400 + indX, 270 + indY, 'RoomBG_0' + randomRoom).setScale(0.8);
                    //scene.add.image(400 + indX, 270 + indY, 'baseRoomBack').setScale(0.8);
                }
                // Since I'm using only one backgroun now: baseRoomBack = RoomBG_red.png
                for (var i = 0; i < 9; i++) {
                    // Upper right bar
                    walls.create(indX + 500 + (i * 30), indY + 90 + ((i * 0.70) * 20), 'blockRed').setScale(0.8).refreshBody();
                    // lower left bar
                    walls.create(indX + 110 + (i * 20), indY + 360 + ((i * 0.70) * 20), 'blockRed').setScale(0.8).refreshBody();
                    // upper left bar
                    walls.create(indX + 310 - (i * 30), indY + 90 + ((i * 0.70) * 20), 'blockRed').setScale(0.8).refreshBody();
                    // lower right bar
                    walls.create(indX + 480 + (i * 28), indY + 500 - ((i * 0.70) * 28), 'blockRed').setScale(0.8).refreshBody();
                }
                for (var i = 0; i < 6; i++) {
                    walls.create(indX + 220 + (i * 20), indY + 370 + ((i * 0.70) * 20), 'blockRed').setScale(0.8).refreshBody();
                    // lower right bar
                    walls.create(indX + 480 + (i * 20), indY + 450 - ((i * 0.70) * 20), 'blockRed').setScale(0.8).refreshBody();
                }

            }
        }

        function randomPlsOrMin(min, max) {
            return random(min, max) * (Math.random() < 0.5 ? -1 : 1);
        }

        function random(min, max) {
            return Math.floor(Math.random() * max) + min;
        }

        var doorsIndex = 0;
        roomsMAP = megaMAP.doorsMAP;

        //megaMAP.doorsMAP
        for (var y = 0; y < megaMAP.doorsMAP.length; y++) {
            // read all animated stories into the array:
            arrAllStories = getAllStories();

            //megaMAP.doorsMAP[y]
            var mapDoors = megaMAP.doorsMAP[y];
            var mapDoor=[];
            for (var x = 0; x < mapDoors.length; x++) {
                mapDoor = mapDoors[x];
                //===================================================================
                var indX = 800 * (x);
                var indY = 520 * (y);
                var keysCount = -1;

                if (mapDoor.U === 1) {
                    keysCount++;
                    doorsArray[doorsIndex] = doors.create(indX + 400, indY + 80, 'doorU').setScale(.8);
                    doorsArray[doorsIndex].roomCoord = {roomX: x, roomY: y, doorType: 'U'};
                    roomsMAP[x][y].upperDoor = doorsArray[doorsIndex];
                    doorsIndex++;
                    for (var i = 0; i < 3; i++) {
                        //vertical bars for upper and lower doors:
                        walls.create((indX + 320), indY + (20 + i * 40), 'blockRed').setScale(0.8).refreshBody();
                        walls.create((indX + 480), indY + (20 + i * 40), 'blockRed').setScale(0.8).refreshBody();
                    }
                } else if (mapDoor.U === 0) {
                    roomsMAP[x][y].upperDoor = doors.create(-100, -100, 'star');
                    roomsMAP[x][y].upperDoor.visible = false; // not really a door, just replacement
                    for (var i = 0; i < 9; i++) {
                        walls.create(indX + 320 + (i * 20), indY + 100, 'blockRed').setScale(0.8).refreshBody();
                    }
                }
                if (mapDoor.D === 1) {
                    keysCount++;
                    doorsArray[doorsIndex] = doors.create(indX + 400, indY + 500, 'doorD').setScale(0.8);
                    doorsArray[doorsIndex].roomCoord = {roomX: x, roomY: y, doorType: 'D'};
                    roomsMAP[x][y].downDoor = doorsArray[doorsIndex];
                    doorsIndex++;
                    for (var i = 0; i < 2; i++) {
                        //vertical bars for upper and lower doors:
                        walls.create((indX + 320), indY + (500 + i * 20), 'blockRed').setScale(0.8).refreshBody();
                        walls.create((indX + 480), indY + (500 + i * 20), 'blockRed').setScale(0.8).refreshBody();
                    }
                } else if (mapDoor.D === 0) {
                    roomsMAP[x][y].downDoor = doors.create(-100, -100, 'star');
                    roomsMAP[x][y].downDoor.visible = false; // not really a door, just replacement
                    for (var i = 0; i < 9; i++) {
                        walls.create(indX + 320 + (i * 20), indY + 500, 'blockRed').setScale(0.8).refreshBody();
                    }
                }
                if (mapDoor.L === 1) {
                    keysCount++;
                    doorsArray[doorsIndex] = doors.create(indX + 80, indY + 260, 'doorL').setScale(0.8);
                    doorsArray[doorsIndex].roomCoord = {roomX: x, roomY: y, doorType: 'L'};
                    roomsMAP[x][y].leftDoor = doorsArray[doorsIndex];
                    doorsIndex++;
                    for (var i = 0; i < 4; i++) {
                        //diaganal bars for left door
                        walls.create(indX - 20 + (i * 40), indY + (200 ), 'blockRed').setScale(0.8).refreshBody();
                        walls.create(indX - 20 + (i * 25), indY + (340 ), 'blockRed').setScale(0.8).refreshBody();
                    }

                } else if (mapDoor.L === 0) {
                    roomsMAP[x][y].leftDoor = doors.create(-100, -100, 'star');
                    roomsMAP[x][y].leftDoor.visible = false; // not really a door, just replacement
                    for (var i = 0; i < 3; i++) {
                        walls.create(indX + 40, indY + 270 + (i * 40), 'blockRed').setScale(0.8).refreshBody();
                        walls.create(indX + 20 + (i * 40), indY + 240, 'blockRed').setScale(0.8).refreshBody();
                        walls.create(indX + 20 + (i * 40), indY + 380, 'blockRed').setScale(0.8).refreshBody();
                    }
                }
                if (mapDoor.R === 1) {
                    keysCount++;
                    doorsArray[doorsIndex] = doors.create(indX + 720, indY + 260, 'doorR').setScale(0.8);
                    doorsArray[doorsIndex].roomCoord = {roomX: x, roomY: y, doorType: 'R'};
                    roomsMAP[x][y].rightDoor = doorsArray[doorsIndex];
                    doorsIndex++;
                    for (var i = 0; i < 3; i++) {
                        walls.create(indX - 20 - (i * 40), indY + (200 ), 'blockRed').setScale(0.8).refreshBody();
                        walls.create(indX + 700 + (i * 40), indY + (160 + i * 20), 'blockRed').setScale(0.8).refreshBody();
                        walls.create(indX + 700 + (i * 40), indY + (380 - i * 20), 'blockRed').setScale(0.8).refreshBody();
                        walls.create(indX - 20 - (i * 25), indY + (340 ), 'blockRed').setScale(0.8).refreshBody();
                    }

                } else if (mapDoor.R === 0) {
                    roomsMAP[x][y].rightDoor = doors.create(-100, -100, 'star');
                    roomsMAP[x][y].rightDoor.visible = false; // not really a door, just replacement
                    for (var i = 0; i < 3; i++) {
                        walls.create(indX + 740, indY + 270 + (i * 40), 'blockRed').setScale(0.8).refreshBody();
                        walls.create(indX + 700 + (i * 40), indY + 240, 'blockRed').setScale(0.8).refreshBody();
                        walls.create(indX + 700 + (i * 40), indY + 380, 'blockRed').setScale(0.8).refreshBody();
                    }
                }
                //doorkeys
                var arrKeys = [];
                var getKeyCordinateWithProximity = function (keys, minProximity) {
                    //To generate a random keys location:
                    /* -- We disable start room keys now (no need for this type of the game):
                    // var c1 = {x: 400 + indX + randomPlsOrMin(50, 80), y: 260 + indY + randomPlsOrMin(50, 30)};
                    var c1 = {x: 400 + indX + randomPlsOrMin(20, 60), y: 260 + indY + randomPlsOrMin(20, 50)};
                    var check = 0;
                    for (var i = 0; i < keys.length; i++) {
                        var c0 = keys[i];
                        var isProximityXGood = Math.abs(c0.x - c1.x) > minProximity;
                        var isProximityYGood = Math.abs(c0.y - c1.y) > minProximity;

                        if (!isProximityXGood && !isProximityYGood) {
                            return getKeyCordinateWithProximity(keys, minProximity);
                        }
                    }
                    */
                    var c1 = {x: 400 + indX , y: 260+ indY }; // JUST SET TO CENTER!
                    return c1;
                }
                // We disable start room keys now (no need for this type of the game):
                // if (x == 0 && y == 0) {
                //     keysCount = keysCount + 1;
                // }
                for (var i = 0; i < keysCount; i++) {
                    if (x == maxRoomCountX - 1 && y == maxRoomCountY - 1) {
                        //this is our final room - no keys required...
                        //TODO: place a final room sprite here!!!
                        //draw the patient: hospitalBed
                        hospitalBed.create(440 + 800 * (x), 300 + 520 * (y), 'patientEmptyPlaceHolder').setScale(1);

                    } else {
                        var coord = getKeyCordinateWithProximity(arrKeys, 100);
                        var isUniqueCoord = true;
                        doorkeys.children.iterate(child => {
                            if ( child.roomCoord.x === x && child.roomCoord.y === y) {
                                isUniqueCoord = false;
                                coord.x +=20;
                                coord.y +=20;
                            }
                        })
                        if (isUniqueCoord) { // we skip the room if there already one key placed before:
                            scene.anims.create({
                                key: 'questionMarkRotates',
                                frames: scene.anims.generateFrameNumbers('questionMark', {start: 0, end: 9}),
                                frameRate: 5,
                                repeat: -1
                            });
                            scene.anims.create({
                                key: 'questionMarkStarRotates',
                                frames: scene.anims.generateFrameNumbers('questionMark', {start: 10, end: 19}),
                                frameRate: 5,
                                repeat: -1
                            });

                            var myDude = doorkeys.create(coord.x, coord.y, 'questionMarkRotates').setScale(.8); //doors keys (dude)
                            myDude.question = megaMAP.questionList[keyIndex];
                            myDude.id = keyIndex;
                            myDude.moveVector = 1;
                            myDude.roomCoord = { x: x, y: y};
                            myDude.initCoord = { x: coord.x, y: coord.y};
                            //console.log('NPC [',myDude.id, ']', ' x=', myDude.initCoord .x, 'y=', myDude.initCoord.y);
                            for (var s=0; s < arrAllStories.length; s++ ){
                                if (arrAllStories[s].rmCoord.x === myDude.roomCoord.x && 
                                    arrAllStories[s].rmCoord.y === myDude.roomCoord.y) {
                                        myDude.storyId = arrAllStories[s].storyId; // id for the story
                                        myDude.imgScr = arrAllStories[s].imgScr; // images for the story
                                        console.log('!!! Found a story for this room. StoryID: ', myDude.storyId);
                                        
                                    }
                            }
                            myDude.isResolved = false;
                            myDude.anims.play('questionMarkRotates', true);
                            myDude.disableBody(false, true); // do not remove the object, but hide it: (true,false)


                            console.log("question from key: ",  myDude.question);
                            keyIndex++;
                            arrKeys[arrKeys.length] = coord;
                        }
                    }
                }
                //=================================================================
            }
        }

        // add some elevator doors:
        elevDoor1 = scene.physics.add.sprite(2000, 1650, 'elevDoorFace');       

        buildStory(2, 3, scene); //here we read stories animation and sprites set
        initPlayer(scene);

    }
    function buildStory(coordX, coordY,scene) {
        //a function to build a room animation logic
        //    cWidth = 800; //canvas width
        //    cHeight = 520; //canvas height
        var cW = Math.round(cWidth /2);
        var cH = Math.round(cHeight /2);
        // passed parameters: coordX, coordY - these are for a room center coordinates
        npcGroup = scene.physics.add.group({
            immovable: true
        });
        arrAllStories = getAllStories(); //
        console.log("==> arrAllStories:  ", arrAllStories);
        arrScenes = getSceneSprites(coordX,coordY) ;
        //==================== /==================== /====================
        //==================== /==================== /====================
        for (let k=0; k< arrScenes.length; k++) {
            // going over an array: arrScenes
            var sceneAnimGrp = arrScenes[k].animNPCGroup;
            console.log("===> arrScenes Objects[",k,"]",arrScenes[k]);
            // ************ ========== animNPCGroup start: ============ ************
            for (let i=0; i < sceneAnimGrp.length; i++) {
                //animNPCGroup - we loop over the group of sprites:
                var myObj = sceneAnimGrp[i];
                var npcId = myObj.id;
                var objActive = myObj.isActive;
                var objType = myObj.objType;
                var npcName = myObj.npcName;
                var npcDefaultKey = myObj.npcName + "_" + myObj.defaultKey;
                var sceneCoordX = myObj.npcCoordX;
                var sceneCoordY = myObj.npcCoordY;

                // console.log("===> npcName (sceneAnimGrp[",i,"])",npcName);
                // console.log("===> npcId (sceneAnimGrp[",i,"])",npcId);
                console.log("===> sceneAnimGrp Object (sceneAnimGrp[",i,"])",sceneAnimGrp);

                for (let m=0; m < myObj.animList.length; m++ ) {
                    //reading animation parameters:
                    var animKey = npcName + "_" + myObj.animList[m].key;
                    var animSprite = myObj.animList[m].frames.spriteName;
                    var animStart = myObj.animList[m].frames.start;
                    var animEnd = myObj.animList[m].frames.end;
                    var animFrameRate = myObj.animList[m].frameRate;
                    var animRepeat = myObj.animList[m].repeat;                    
                    //building animation resources:
                    scene.anims.create({
                        key: animKey,
                        frames: scene.anims.generateFrameNumbers(animSprite, {start: animStart, end: animEnd}),
                        frameRate: animFrameRate,
                        repeat: animRepeat
                    });
                    console.log("===> sceneAnimGrp[", i," ]  => animKey (myObj.animList[",m,"])",animKey);

                }
            }
            // ************ ========== : animNPCGroup End ============ ************
        }

        for (let j=0; j < arrAllStories.length; j++) {  // **** reading a list of stories and adding npcGroup.children
            var aStory = arrAllStories[j].sceneList;
            for (let m=0; m < aStory.length; m++) {
                var isUniqueSpriteId = true;
                var aSt = aStory[m];
                npcGroup.children.iterate(child => {
                    if (child.npcId === aSt.spriteId + "_" + arrAllStories[j].storyId) {
                        isUniqueSpriteId = false;
                    }
                });
                if (isUniqueSpriteId) {
                    var objSprite = npcGroup.create(
                        aSt.startXY.x + (arrAllStories[j].rmCoord.x * cWidth) , 
                        aSt.startXY.y + (arrAllStories[j].rmCoord.y * cHeight) , 
                        aSt.animKey + "_" + arrAllStories[j].storyId + "_" + aSt.sceneId);
                    objSprite.npcDefaultKey = aSt.npcName + "_" + aSt.animKey;
                    objSprite.spriteId = aSt.spriteId;
                    objSprite.npcName = aSt.npcName;
                    objSprite.npcId = aSt.spriteId + "_" + arrAllStories[j].storyId;
                    
                    objSprite.objType = aSt.objType;
                    objSprite.spriteScale = aSt.spriteScale;
                    if (aSt.zIndex != undefined) objSprite.setDepth(aSt.zIndex); // set the display depth - z-index
                    if (aSt.spriteScale != undefined && 
                        (aSt.spriteScale > -10 && aSt.spriteScale < 100 )) 
                            objSprite.setScale(aSt.spriteScale); // Setting the scale of the sprite if provided by config
                    if (objSprite.objType === 'DECORATION') {
                        objSprite.anims.play(objSprite.npcDefaultKey , false);
                        objSprite.disableBody(false, true);
                    } else {
                        objSprite.anims.play(objSprite.npcDefaultKey , true);
                        objSprite.disableBody(false, true);
                    }
                    //console.log("------->>> objSprite: ", (aSt.startXY.x + (arrAllStories[j].rmCoord.x * cWidth)) , (aSt.startXY.y  + (arrAllStories[j].rmCoord.y * cHeight)) , aSt.animKey);
                    console.log("-->>> objSpriteProps: ", objSprite.npcId, " / " , objSprite.npcName, " / ", objSprite.npcDefaultKey, " animKey: ",aSt.animKey, " XY: ", aSt.startXY);

                }
            }
        }  // **** Done reading a list of stories and adding npcGroup.children ****

        var jsonAnim = scene.anims.toJSON(); //Export animation to JSON
        console.log("***===>  Game jsonAnim: ", jsonAnim );
        let k=0;
        npcGroup.children.iterate(child => {
            console.log("*** ===>  npcGroup.child[" + k + "]: ", child.npcName, " npcId: ", child.npcId, " npcDefaultKey:", child.npcDefaultKey );
            k++;
        });
        console.log("-=>>> Scene per Room Array arrAllStories: ",arrAllStories );
    }

    function breakingBad() {
        // happens when we reached the destination point:
        isPause = true;
        stopPlayer();
        //SOUND MUSIC STOPPED To Debug IE11 issues
        if (!isBrowserIE) {
          music.pause();
        }

        gameState.customIUN = customIUN;
        gameState.isFinished = 1;
        gameState.elapsedTime = secondsElapsed;
        var d = new Date();
        gameState.timefinish = getFullDateTime(d);
        userTimer.stop();
        saveState('UPDATE', gameState);
        //show finScr
        Phaser.disable;
        _this.input.keyboard.enabled = false; //to stop keyboard capture
        //_this.input.keyboard.stopImmediatePropagation();
        //Phaser.Input.Keyboard.clearCaptures();
        this.scene.pause();
        game.scene.pause("default");
        showFinalScreen();
    }

    function update() {
        if (gameOver || isPause) {
            return;
        }
        drawScores(_this);
        player.prePrevPos = player.prevPos;
        player.prevPos = {x: player.x, y: player.y};
        playerNavigationHandler();
        // dudeUpdate(player);
        dudeUpdate(player); //update the NPC state
        playSound(music);  // play background music
    }

    function drawScores(scene) {
      // ('Keys: ' + player.doorKeys + '   *   Score: ' + totalQestionsAnswered)
      scoreTextShade0.setText('Score: ' + totalQestionsAnswered);
      scoreTextShade0.x = 49 + player.x - 400;
      scoreTextShade0.y = 49 + player.y - 300;
        scoreTextShade.setText('Score: ' + totalQestionsAnswered);
        scoreTextShade.x = 51 + player.x - 400;
        scoreTextShade.y = 51 + player.y - 300;
        scoreText.setText('Score: ' + totalQestionsAnswered);
        scoreText.x = 50 + player.x - 400;
        scoreText.y = 50 + player.y - 300;
        playPosText.setText('Pos: ' + Math.floor(player.x / cWidth) + ' / ' +  Math.floor(player.y / cHeight));
        playPosText.x = 250 + player.x - 400;
        playPosText.y = 50 + player.y - 300;
        if (language === 'FRA') {
          divScoreText.innerHTML = "Vous avez " + player.doorKeys + " cl??(s) <br><hr/><br>";
        } else {
          divScoreText.innerHTML = "You have " + player.doorKeys + " key(s) <br><hr/><br>";
        }
    }

    function dudeUpdate(player) {
        // Here we calculate which NPC to move and how to move
        // player.x and player.y - its a player coordinates
        let thisX = player.x;
        let thisY = player.y;
        let pX = Math.floor(thisX / cWidth);
        let pY = Math.floor(thisY / cHeight);
        //let isQuestionVisible = false;
        // currentScene = { isActive: false, sceneContent: null }; /// ======= <***> ========
        //if there is already an action running do not seek for another scene:
        if (currentScene.isActive)  {
            var curtScene = currentScene.sceneContent.nextScene;
            var lastScene = currentScene.sceneContent.lastScene;
            let myX = currentScene.sceneContent.rmCoord.x;
            let myY = currentScene.sceneContent.rmCoord.y;
            let i = curtScene;
            if ( i <= lastScene) {
                    var myScene = currentScene.sceneContent.sceneList[i];
                    npcGroup.children.iterate(child => {
                        if ( child.npcId === (myScene.spriteId + "_" + currentScene.sceneContent.storyId) ) {

                            if ( i == 0 && currentScene.sceneContent.decorXY != undefined) {
                                let decX = currentScene.sceneContent.decorXY.x;
                                let decY = currentScene.sceneContent.decorXY.y;
                                // officeCompDesk.create(decX + (myX * cWidth), decY + (myY * cHeight), 'computerSetOff').setScale(1);
                                // //child.setDepth(10);
                                // officeCompDesk.setDepth(0);
                            }
                            //child.setDepth(1);
                            // testBoxDiv.innerHTML = "child.npcId:" + child.npcId + " / "
                            //     + (myScene.spriteId + "_" + currentScene.sceneContent.storyId)
                            //     + "; Coord: myX: " + myX + " myY: " + myY;
                            //console.log("==> child obj: ", child);
                            // testBox.innerHTML = "npcId:" + child.npcId + "<br/>"
                            //     + "myScene:" + m riteId + "<br/>"
                            //     + "myScene+:" + (myScene.spriteId + "_" + currentScene.sceneContent.storyId) ;
                            //testBox.innerHTML = " x:" + Math.round(child.x) + "<br/>y: " + Math.round(child.y);
                            sceneText.setText(myScene.txtStr);
                            sceneText.x = child.x - 60; //(myX) * cWidth + 30;
                            sceneText.y = child.y - 120; //(myY) * cHeight + 300;

                            if ( myScene.initRead === false) {
                                myScene.initRead = true;
                                //child.SetXY = { x: myScene.startXY.x, y: myScene.startXY.y } ;
                                child.x = currentScene.sceneContent.sceneList[i].startXY.x + (myX * cWidth);
                                child.y = currentScene.sceneContent.sceneList[i].startXY.y + (myY * cHeight);
                                child.enableBody(true, child.x,child.y, true, true);
                                //subtitlesPannel.innerHTML = subtitlesPannel.innerHTML + "<br/>" + myScene.txtStr;
                                if (typeof currentScene.sceneContent.storyTextLog === 'undefined'
                                    || currentScene.sceneContent.storyTextLog === null) {
                                    currentScene.sceneContent.storyTextLog = myScene.txtStr
                                } else {
                                    currentScene.sceneContent.storyTextLog += ("<br/>" + myScene.txtStr)
                                }
                                if (subtitlesPannel.innerHTML !==  currentScene.sceneContent.storyTextLog) {
                                    subtitlesPannel.innerHTML = currentScene.sceneContent.storyTextLog;
                                    subtitlesPannel.scrollTop = subtitlesPannel.scrollHeight;
                                }
                            }
                            child.anims.play(child.npcName + "_" + myScene.animKey, true);
                            switch (myScene.moveTo) {
                                case "NO":
                                    //we stand up
                                    child.setVelocityX(0);
                                    child.setVelocityY(0);
                                    myScene.moveTo = "";
                                    setTimeout(myFunction => {
                                        // console.log("==> child XY x: ", child.x, " y:", child.y);
                                        // console.log("==> myScene.txtStr: ", myScene.txtStr);
                                        currentScene.sceneContent.nextScene ++;
                                        // console.log("==> curtScene: " , curtScene, " lastScene: ", lastScene);
                                        child.setVelocityX(0);
                                        child.setVelocityY(0);
                                        sceneText.setText("");
                                        sceneText.x = thisX - 380;
                                        sceneText.y = thisY + 200;
                                        // sceneText.setDepth(10);
                                        if (myScene.removeSprite) {
                                            child.disableBody(true, true); // this is to remove the key(object) from the scene
                                        } else {
                                            child.anims.play(child.npcName + "_" + myScene.lastAnimKey, false);// child.anims.play(child.npcDefaultKey, true);
                                        }
                                    }, myScene.timeFrame * 1000);

                                    break;
                                case "LEFT":
                                    // we move left
                                    child.setVelocityX(-100);

                                    if ( child.x < (myScene.endXY.x + (myX * cWidth))) {
                                        currentScene.sceneContent.nextScene ++;
                                        child.setVelocityX(0);
                                        child.setVelocityY(0);
                                        sceneText.setText("");
                                        sceneText.x = thisX - 380;
                                        sceneText.y = thisY + 200;
                                        sceneText.setDepth = 100;
                                        if (myScene.removeSprite) {
                                            child.disableBody(true, true); // this is to remove the key(object) from the scene
                                        } else {
                                            child.anims.play(child.npcName + "_" + myScene.lastAnimKey, false); //set last animation key
                                        }
                                    }
                                    break;
                                case "RIGHT":
                                    // we move right
                                    child.setVelocityX(100);

                                    if ( child.x > (myScene.endXY.x + (myX * cWidth))) {
                                        currentScene.sceneContent.nextScene ++;
                                        child.setVelocityX(0);
                                        child.setVelocityY(0);
                                        sceneText.setText("");
                                        sceneText.x = thisX - 380;
                                        sceneText.y = thisY + 200;
                                        sceneText.setDepth = 100;
                                        if (myScene.removeSprite) {
                                            child.disableBody(true, true); // this is to remove the key(object) from the scene
                                        } else {
                                            child.anims.play(child.npcName + "_" + myScene.lastAnimKey, false); //set last animation key
                                        }
                                    }
                                    break;
                                case "DOWN":
                                    // we move down
                                    child.setVelocityY(100);
                                    if ( child.y > (myScene.endXY.y + (myY * cHeight))) {
                                        currentScene.sceneContent.nextScene ++;
                                        child.setVelocityX(0);
                                        child.setVelocityY(0);
                                        sceneText.setText("");
                                        sceneText.x = thisX - 380;
                                        sceneText.y = thisY + 200;
                                        sceneText.setDepth = 100;
                                        if (myScene.removeSprite) {
                                            child.disableBody(true, true); // this is to remove the key(object) from the scene
                                        } else {
                                            child.anims.play(child.npcName + "_" + myScene.lastAnimKey, false); //set last animation key
                                        }
                                    }
                                    break;
                                case "UP":
                                    // we move up
                                    child.setVelocityY(-100);
                                    if ( child.y < (myScene.endXY.y + (myY * cHeight))) {
                                        currentScene.sceneContent.nextScene ++;
                                        child.setVelocityX(0);
                                        child.setVelocityY(0);
                                        sceneText.setText("");
                                        sceneText.x = thisX - 380;
                                        sceneText.y = thisY + 200;
                                        if (myScene.removeSprite) {
                                            child.disableBody(true, true); // this is to remove the key(object) from the scene
                                        } else {
                                            child.anims.play(child.npcName + "_" + myScene.lastAnimKey, false); //set last animation key
                                        }
                                    }
                                    break;
                                default:
                                // default action is:
                            }
                            //testBox.innerHTML = " S:" +curtScene;
                        }
                    })
                if (curtScene === lastScene ) {
                    currentScene.sceneContent.isQuestionVisible = true ;
                }
            }  else {
                // if all scene activities done we show questions:
                doorkeys.children.iterate(child => {
                    if ( child.roomCoord.x === currentScene.sceneContent.rmCoord.x
                        && child.roomCoord.y === currentScene.sceneContent.rmCoord.y) {
                        if (currentScene.sceneContent.isQuestionVisible)  {
                            let qX = currentScene.sceneContent.questCoord.x + (child.roomCoord.x * cWidth);
                            let qY = currentScene.sceneContent.questCoord.y + (child.roomCoord.y * cHeight);
                            child.enableBody(true, qX, qY, true, true);
                            currentScene.sceneContent.isQuestionVisible = false;
                            child.setInteractive();
                            child.on('pointerdown', function (pointer) {
                                child.anims.play('questionMarkStarRotates', true);
                                setTimeout(myFunction => {
                                    child.anims.play('questionMarkRotates', true);
                                    collectKey(player, child);
                                }, 2000);


                                //myDude.setTint(0xff0000);
                                //console.log('pointer down pressed!');
                            });
                            child.on('pointerup', function () {
                                //myDude.clearTint();
                            });
                            child.on('pointerout', function () {
                                //myDude.clearTint();
                            });
                        }
                    }
                });
                currentScene.isActive = false;
            }
        } else {                    
            subtitlesPannel.innerHTML = "";
            //lets iterate over the array of scripted scenes:
            for (let r = 0; r < arrAllStories.length; r++) {
                var myObj = arrAllStories[r];
                // testBoxDiv.innerHTML = "myObj.rmCoord: " + myObj.rmCoord.x + "/" +  myObj.rmCoord.y +
                //     " Player pX/pY: " + pX + "/" +  pY;
                // we get in only if this is the same room coordinates:
                if ( (myObj.rmCoord.x === pX) && (myObj.rmCoord.y === pY) ) {
                    currentScene.isActive = true;
                    currentScene.sceneContent = arrAllStories[r];
                    //currentScene.sceneContent.storyTextLog;
                    if (subtitlesPannel.innerHTML !==  currentScene.sceneContent.storyTextLog)
                    {
                        subtitlesPannel.innerHTML = currentScene.sceneContent.storyTextLog;
                    }
                }
            }
        }

    }

    function npcHitTheWall(npc, wall) {
      var defaultKey = npc.npcDefaultKey;
      //child.anims.play('marchingDude', true);
      if (npc.moveVector === -1 && (npc.isActive) ) {
        npc.anims.play(defaultKey, true);
        npc.setVelocityX(0);
        npc.moveVector = 1;
        npc.x += 5;
      } else if (npc.moveVector === 1 && (npc.isActive)) {
        npc.anims.play(defaultKey, true);
        npc.setVelocityX(0);
        npc.moveVector = -1;
        npc.x -= 5;
      }
        // npc.setX( initXY.x );
    }

    function playerHitNpc(npc, player) {
        //playerStepBack();
        playerTwoStepBack();
        // var defaultKey = npc.npcDefaultKey;
        // //child.anims.play('marchingDude', true);
        // if (npc.moveVector === -1 && (npc.isActive) ) {
        //     npc.anims.play(defaultKey, true);
        //     npc.setVelocityX(0);
        //     npc.moveVector = 1;
        //     npc.x += 5;
        // } else if (npc.moveVector === 1 && (npc.isActive)) {
        //     npc.anims.play(defaultKey, true);
        //     npc.setVelocityX(0);
        //     npc.moveVector = -1;
        //     npc.x -= 5;
        // }
        // npc.setX( initXY.x );
    }

    function npcHitOtherNpc(npc) {
      // var initXY = npc.initCoord;
      // var npcX = npc.x;
      // var npcY  = npc.y;
      //var defaultKey = npc.npcDefaultKey;
      //child.anims.play('marchingDude', true);
    }

    function hitTheDoor(player, door) {
      player.doorKeys = 1; //set it to a constant to do all tests without scores
      dudeUpdate(player); //update the NPC state
        if (player.doorKeys > 0 && !door.isOpen) {
            playSound(doorOpen);
            stopPlayer();
            door.body.checkCollision.none = true;
            door.isOpen = true;
            //player.doorKeys--; // -we disable keys expendeture temporary
            //console.log("The door has been opened!", door);
            var nextDoor;
            var thisRoomX = door.roomCoord.roomX;
            var thisRoomY = door.roomCoord.roomY;

            switch (door.roomCoord.doorType) {
                case 'U':
                    nextDoor = roomsMAP[thisRoomX][thisRoomY - 1].downDoor;
                    nextDoor.body.checkCollision.none = true;
                    nextDoor.isOpen = true;
                    nextDoor.setTexture('doorD', 1);
                    door.setTexture('doorU', 1);
                    //console.log('Door location is: Up, door: ' + nextDoor.isOpen);
                    break;
                case 'D':
                    nextDoor = roomsMAP[thisRoomX][thisRoomY + 1].upperDoor;
                    nextDoor.body.checkCollision.none = true;
                    nextDoor.isOpen = true;
                    nextDoor.setTexture('doorU', 1);
                    door.setTexture('doorD', 1);
                    //console.log('Door location is: Down, door: ' + nextDoor.isOpen);
                    break;
                case 'L':
                    nextDoor = roomsMAP[thisRoomX - 1][thisRoomY].rightDoor;
                    nextDoor.body.checkCollision.none = true;
                    nextDoor.isOpen = true;
                    nextDoor.setTexture('doorR', 1);
                    door.setTexture('doorL', 1);
                    //console.log('Door location is: Left, door: ' + nextDoor.isOpen);
                    break;
                case 'R':
                    nextDoor = roomsMAP[thisRoomX + 1][thisRoomY].leftDoor;
                    nextDoor.body.checkCollision.none = true;
                    nextDoor.isOpen = true;
                    nextDoor.setTexture('doorL', 1);
                    door.setTexture('doorR', 1);
                    //console.log('Door location is: Right, door: ' + nextDoor.isOpen);
                    break;
                default:
            }

            return true;
        }
        return true;
    }

    function playerStepBack() {
        player.x = player.prevPos.x;
        player.y = player.prevPos.y;
    }

    function playerTwoStepBack() {
        player.x = player.prePrevPos.x;
        player.y = player.prePrevPos.y;
    }

    function collectKey(player, key) {
        // player clicks the key (or hit the key sprite):
        if ( key.isResolved === true ) {
            // its already done - skipping
            // console.log('===>>> Story ID = ', key.id, '; is this question Alreaady solved? ', key.isResolved);
            return;
        }
        if (key.roomCoord != undefined && key.roomCoord != null) {
            //console.log('=>> This room has special story! Coordinates: ',key.roomCoord);
            // console.log('=>> This room has special story! StoryID: ',key.storyId);
        }
        try {
          userTimer.start();
        } catch (e) {
          console.log('Error! Can\'t start a timer!',e.toString());
        }
        if (isPause) return;
        playSound(pickupKey);
        stopPlayer();
        isPause = true;
        totalQestionsAsked++;
        var ifSuccessCallback = function () {
            // this happens when the player respond the question successfully
            
            if ( key.isResolved === false ) { // its already done - skipping                
                // console.log('is this question Alreaady solved? ', key.isResolved);
                player.doorKeys++;   //player.doorKeys+=10;
                totalQestionsAnswered++;
            }

            key.isResolved = true; // mark question as resolved
            playerStepBack();
            playSound(soundOk);

            key.disableBody(true, true); // this is to remove the key(object) from the scene

            isPause = false;
            

            //save the state to the table:
            gameState.customIUN = customIUN;
            gameState.correctCount = totalQestionsAnswered;
            listofquestions = listofquestions + "qT:" +  key.question.qId + "; ";
            gameState.listofquestions = listofquestions; //+ ":" +  " " + totalQestionsAsked;
            if (totalQestionsAnswered === 1 && (!theGameIsStarted)) {
                saveState('INSERT', gameState);
                theGameIsStarted = true;
            } else {
                saveState('UPDATE', gameState);
            }
            //submitAnswerButton.style.display = "";
        };

        var onVideoCloseCallback = function () {
            hideVideo();
            isPause = false;
            playerTwoStepBack();
            //playerStepBack();
        }

        var ifCancelCallback = function (question) {
            //submitAnswerButton.style.display = 'none';
            //playerTwoStepBack();
            var videoLangURL ="";
            playSound(soundFail);
            gameState.customIUN = customIUN;
            gameState.correctCount = totalQestionsAnswered;
            listofquestions = listofquestions + "qF:" +  key.question.qId + "; ";
            gameState.listofquestions = listofquestions; //+ ":" +  " " + totalQestionsAsked;

            if (totalQestionsAnswered === 0 && (!theGameIsStarted)) {
                saveState('INSERT', gameState);
                theGameIsStarted = true;
            } else {
                saveState('UPDATE', gameState);
            }

            videoLangURL = question.questionURL; //questionurlFRA
            if (language === 'FRA') {
              videoLangURL = question.questionurlFRA;
            }
            console.log('videoLangURL: ' + videoLangURL);
            showVideo(videoLangURL, onVideoCloseCallback);
            //submitAnswerButton.style.display = "";
        }
        showQuestion(key, ifSuccessCallback, ifCancelCallback);

    }

    function stopPlayer() {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn',true);
        //if (!isBrowserIE) {
         soundStep.pause(); //SOUND MUSIC STOPED To Debug IE11 issues
       //}
    }

    function playSound(sound) {
      //sounds: //SOUND MUSIC STOPED To Debug IE11 issues
      // if ( !isBrowserIE ) { if (!sound.isPlaying) { sound.play();} }
      if ((!sound.isPlaying) && (!isSilent)) {
          sound.play();
      }
      if (isSilent) {
        sound.stop();
      }
    }

    function calcCoordOnMapPos(thisX,thisY) {
        // player.x and player.y - its a player coordinates
        var deltaX = Math.floor(thisX / 800);
        var deltaY = Math.floor(thisY / 520);
        player.mazeNewCoord = { mazeX: deltaX, mazeY: deltaY };
        //required to id miniMap location
        if ((player.mazePrevCoord.mazeX != player.mazeNewCoord.mazeX)
             || (player.mazePrevCoord.mazeY != player.mazeNewCoord.mazeY)) {
               highlighMapPos(  player.mazePrevCoord.mazeY,player.mazePrevCoord.mazeX,
                                player.mazeNewCoord.mazeY,player.mazeNewCoord.mazeX,
                                "magenta");
               player.mazePrevCoord = { mazeX: deltaX, mazeY: deltaY };
        }
    }

    function playerNavigationHandler() {
        //capturing keys pressed to change the direction of the player movement:
        if (cursors.left.isDown || wasd.left.isDown) {
           calcCoordOnMapPos(player.x,player.y);
            player.setVelocityX(-260);
            player.anims.play('left', true);
            playSound(soundStep);
        } else if (cursors.up.isDown || wasd.up.isDown) {
           calcCoordOnMapPos(player.x,player.y);
            player.setVelocityY(-200);
            player.anims.play('up', true);
            playSound(soundStep);
        } else if (cursors.down.isDown || wasd.down.isDown) {
           calcCoordOnMapPos(player.x,player.y);
            player.setVelocityY(200);
            player.anims.play('down', true);
            playSound(soundStep);
        } else if (cursors.right.isDown || wasd.right.isDown) {
            calcCoordOnMapPos(player.x,player.y);
            player.setVelocityX(260);
            player.anims.play('right', true);
            playSound(soundStep);

        } else {
            stopPlayer();
        }
    }

    function initPlayer(scene) {
        // player = scene.physics.add.sprite(400, 300, 'dude');
        // player = scene.physics.add.sprite(400, 300, 'SuperHero');
        player = scene.physics.add.sprite(2000, 1900, 'SuperHero');
        //console.log('player', player);
        player.doorKeys = 0;
        player.mazePrevCoord = { mazeX: 0,  mazeY: 0};  //required to id miniMap lcoation
        player.mazeNewCoord = { mazeX: 0,  mazeY: 0}; //required to id miniMap lcoation
        calcCoordOnMapPos(player.x,player.y); // we want to update miniMap info with player pos        
        //  Player physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        //player.setCollideWorldBounds(true);
        //  Our player animations, turning, walking left and walking right.
        scene.anims.create({
            key: 'left',
            // frames: scene.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frames: scene.anims.generateFrameNumbers('SuperHero', {start: 12, end: 17}),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'up',
            // frames: scene.anims.generateFrameNumbers('dude', {start: 8, end: 11}),            
            frames: scene.anims.generateFrameNumbers('SuperHero', {start: 24, end: 29}),
            frameRate: 10,
            repeat: -1
        });

        // scene.anims.create({
        //     key: 'turn',
        //     frames: [{key: 'dude', frame: 4}],
        //     frameRate: 20
        // });

        scene.anims.create({
            key: 'turn',
            frames: scene.anims.generateFrameNumbers('SuperHero', {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'right',
            // frames: scene.anims.generateFrameNumbers('dude', {start: 12, end: 15}),
            frames: scene.anims.generateFrameNumbers('SuperHero', {start: 6, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'down',
            // frames: scene.anims.generateFrameNumbers('dude', {start: 4, end: 7}),
            frames: scene.anims.generateFrameNumbers('SuperHero', {start: 18, end: 23}),
            frameRate: 10,
            repeat: -1
        });
        player.setDepth(100);
    }

    function highlighMapPos(oldY,oldX,pY,pX,colorCode) {
        // to indicate the player location at the MiniMap:
        var oldMapLocation = document.getElementById('y' + oldY + 'x' + oldX);        
        var newMapLocation = document.getElementById('y' + pY + 'x' + pX);

        document.getElementById('y' + oldY + 'x' + oldX).style.border = "";
        document.getElementById('y' + pY + 'x' + pX).style.border = "3px solid " + colorCode;
        oldMapLocation.innerHTML = mapLocContent;
        mapLocContent = newMapLocation.innerHTML;
        newMapLocation.innerHTML = '<div class="divMinMapTD"> ' +
                                '<img class="imgMapDude" src="./png/SuperManStandFW.png" alt="}{" height="22" width="20">' +
                                '</div>';
    }

/////////questions functionality
    function showQuestion(key, ifSuccessCallback, ifCancelCallback) {
        
        // pased: showQuestion(megaMAP.questionMAP[0][0], function ()
        document.getElementById("question").style.display = "";
        //alert(question.qId + ') ' + question.qTxt);
        //_this.input.keyboard.enabled = false;
        // key.storyDispOut = buildStoyUI(key);
        key.storyDispOut = selectAndBuildStoyById(key);

        if (key.storyDispOut === null) {
            console.log("No story ID for the location found! Story: ", key.storyDispOut);
            buildQuestion(key, ifSuccessCallback, ifCancelCallback);
        } else {
            // we should build storyUI here and start the minigGame:
            var storyDispOut = key.storyDispOut;
            console.log("--> Got Story ID for the location: ", key.storyDispOut.storyId, " - we start building story UI... ");
            buildMiniGameQestion  (key, ifSuccessCallback, ifCancelCallback);    
        }
        // console.log('Returning storyDispOut value = ', key.storyDispOut);
        // buildQuestion(key, ifSuccessCallback, ifCancelCallback);
    }

    function hideQuestion() {
      //_this.input.keyboard.enabled = true;
        document.getElementById("question").style.display = "none";
    }

    //const questionWindow = document.getElementById("questionWindow");

    function buildQuestion(key, ifSuccessCallback, ifCancelCallback) {
        //console.log(question);
        var question = key.question;
        var myQuestions = [question];
        var storyDispOut = key.storyDispOut;
        // console.log('Returning storyDispOut value = ', storyDispOut.storyId);

        function buildQuiz() {
            // we'll need a place to store the HTML output
            const output = [];
            // for each question...
            for (var questionNumber = 0; questionNumber < myQuestions.length; questionNumber++) {
              currentQuestion = myQuestions[questionNumber];
              // we'll want to store the list of answer choices
              const answers = [];

              // and for each available answer...
              for (var ind in currentQuestion.answers) {
                  // ...add an HTML radio button
                  //var questMsg = Base64Decode(currentQuestion.answers[ind].value);
                  var questMsg = currentQuestion.answers[ind].value;
                  if (language === 'FRA') {
                      // we use FRENCH LANGUAGE
                      //questMsg = Base64Decode(currentQuestion.answersFRA[ind].value);
                      questMsg = currentQuestion.answersFRA[ind].value;
                  }
                  var ansStr = '<label><input type="radio" name="question' + questionNumber 
                                + '" value="' + ind + '"> ' + currentQuestion.answers[ind].key 
                                + ' : ' + questMsg + '</label>';
                  answers.push (ansStr);                  
              }
              // add this question and its answers to the output
              //var answerMsg = Base64Decode(currentQuestion.question);
              var answerMsg = currentQuestion.question;
              if (language === 'FRA') {
                //answerMsg = Base64Decode(currentQuestion.questionFRA);
                answerMsg = currentQuestion.questionFRA;
              }
              var ansOutStr = ''
                            + '<div class="slide"><div class="question">' 
                            // + storyDispOut.activeContentHTML
                            + answerMsg 
                            + '<hr/></div> <div class="answers">' + answers.join("") + '</div></div>';
              output.push(ansOutStr);              
              
            }
            // finally combine our output list into one string of HTML and put it on the page
            quizContainer.innerHTML = output.join("");
            submitAnswerButton.style.display = '';

            // lest call story src selector
            // console.log("function buildQuiz() almost done! key.storyId =" , key.storyId);
            // story_src_selector(key.storyId);
            
        }

        function showResults() {
            submitAnswerButton.style.display = 'none';
            // gather answer containers from our quiz
            const answerContainers = quizContainer.querySelectorAll(".answers");

            // keep track of user's answers
            // for each question...
            for (var questionNumber = 0; questionNumber < myQuestions.length; questionNumber++) {
              currentQuestion = myQuestions[questionNumber];
              const answerContainer = answerContainers[questionNumber];
              // const selector = `input[name=question${questionNumber}]:checked`;
              const selector = "input[name=question" + questionNumber + "]:checked";

              const userAnswer = parseInt((answerContainer.querySelector(selector) || {}).value);
              // if answer is correct
              if (userAnswer === currentQuestion.correctAnswer) {
                  answerContainer.style.color = 'lightgreen';
                  if (language === 'FRA') {
                    submitMsgContainer.innerHTML = "<h1><span style='color:yellow'>Felicitations! Bonne reponse!</span></h1>";
                  } else {
                    submitMsgContainer.innerHTML = "<h1><span style='color:yellow'>Congratulations! Correct answer!</span></h1>";
                  }

                  setTimeout(function () {
                      submitMsgContainer.innerHTML = "";
                      //console.log('Corerct Answer given');
                      hideQuestion();
                      ifSuccessCallback(question);
                  }, 1000);
              } else {
                  answerContainer.style.color = 'red';
                  questionWindow.style.border = 'thin solid red';
                  if (language === 'FRA') {
                    submitMsgContainer.innerHTML = "<h1><span style='color:red'>Desole, mauvaise reponse!</span></h1><br>";
                  } else {
                    submitMsgContainer.innerHTML = "<h1><span style='color:red'>Sorry, wrong answer!</span></h1><br>";
                  }

                  setTimeout(function () {
                      submitMsgContainer.innerHTML = "";
                      if (!isBrowserIE) {
                        questionWindow.style.border = 'initial';
                      } else {
                        questionWindow.style.border = 'thin solid white';
                      }

                      hideQuestion();
                      ifCancelCallback(question);
                  }, 1200);
              }
            }
            //submitAnswerButton.style.display = '';
        }

        function showSlide(n) {
            slides[currentSlide].classList.remove("active-slide");
            slides[n].classList.add("active-slide");
            currentSlide = n;
        }

        const quizContainer = document.getElementById("quiz");
        const submitButton = document.getElementById("submit");
        buildQuiz();
        const slides = document.querySelectorAll(".slide");
        var currentSlide = 0;
        showSlide(0);
        // on submit, show results
        $("#submit").unbind("click");
        $("#submit").bind("click", showResults);
    }




    function buildMiniGameQestion(key, ifSuccessCallback, ifCancelCallback) {
        //console.log(question);
        var question = key.question;
        var myQuestions = [question];
        var storyDispOut = key.storyDispOut;
        // console.log('Returning storyDispOut value = ', storyDispOut.storyId);

        function buildQuiz() {
            // we'll need a place to store the HTML output
            const output = [];
            /*
            // for each question...
            for (var questionNumber = 0; questionNumber < myQuestions.length; questionNumber++) {
              currentQuestion = myQuestions[questionNumber];
              // we'll want to store the list of answer choices
              const answers = [];
              
              // and for each available answer...
              for (var ind in currentQuestion.answers) {
                  // ...add an HTML radio button
                  //var questMsg = Base64Decode(currentQuestion.answers[ind].value);
                  var questMsg = currentQuestion.answers[ind].value;
                  if (language === 'FRA') {
                      // we use FRENCH LANGUAGE
                      //questMsg = Base64Decode(currentQuestion.answersFRA[ind].value);
                      questMsg = currentQuestion.answersFRA[ind].value;
                  }
                  var ansStr = '<label><input type="radio" name="question' + questionNumber 
                                + '" value="' + ind + '"> ' + currentQuestion.answers[ind].key 
                                + ' : ' + questMsg + '</label>';
                  answers.push (ansStr);                  
              }
              

              // add this question and its answers to the output
              //var answerMsg = Base64Decode(currentQuestion.question);
              var answerMsg = currentQuestion.question;
              if (language === 'FRA') {
                //answerMsg = Base64Decode(currentQuestion.questionFRA);
                answerMsg = currentQuestion.questionFRA;
              }
              var ansOutStr = ''
                            + '<div class="slide"><div class="question">' 
                            + storyDispOut.activeContentHTML
                            + answerMsg 
                            + '<hr/></div> <div class="answers">' + answers.join("") + '</div></div>';
              output.push(ansOutStr);              
              
            }
            */
            var ansOutStr = '<div class="slide"><div class="question">'
                            // + storyDispOut.activeContentHTML + '<br>'
                            + '<h1>Quiz Questions</h1><hr/></div> <div class="answers">' 
                            + '</div></div>';

                          
            output.push(ansOutStr); 
            // finally combine our output list into one string of HTML and put it on the page
            quizContainer.innerHTML = output.join("");
            submitAnswerButton.style.display = 'block';
            console.log('~~~~>>>  ansOutStr: ', ansOutStr);
            console.log('~~~~>>>  storyDispOut.activeContentHTML: ', storyDispOut.activeContentHTML);
            
        }

        function showResults() {
            submitAnswerButton.style.display = 'none';
            // gather answer containers from our quiz
            const answerContainers = quizContainer.querySelectorAll(".answers");
            var answerContainer = document.getElementById("submitMsg");
            if (answerContainers.length > 0) {
                answerContainer = answerContainers[0];
            }
            
            // keep track of user's answers
            // for each question...
            var userAnswer = true;
              // if answer is correct
              if (userAnswer) {
                  answerContainer.style.color = 'lightgreen';
                  if (language === 'FRA') {
                    submitMsgContainer.innerHTML = "<h1><span style='color:yellow'>Felicitations! Bonne reponse!</span></h1>";
                  } else {
                    submitMsgContainer.innerHTML = "<h1><span style='color:yellow'>Congratulations! Correct answer!</span></h1>";
                  }

                  setTimeout(function () {
                      submitMsgContainer.innerHTML = "";
                      //console.log('Corerct Answer given');
                      hideQuestion();
                      ifSuccessCallback(question);
                  }, 1000);
              } else {
                  answerContainer.style.color = 'red';
                  questionWindow.style.border = 'thin solid red';
                  if (language === 'FRA') {
                    submitMsgContainer.innerHTML = "<h1><span style='color:red'>Desole, mauvaise reponse!</span></h1><br>";
                  } else {
                    submitMsgContainer.innerHTML = "<h1><span style='color:red'>Sorry, wrong answer!</span></h1><br>";
                  }

                  setTimeout(function () {
                      submitMsgContainer.innerHTML = "";
                      if (!isBrowserIE) {
                        questionWindow.style.border = 'initial';
                      } else {
                        questionWindow.style.border = 'thin solid white';
                      }

                      hideQuestion();
                      ifCancelCallback(question);
                  }, 1200);
              }
          
            //submitAnswerButton.style.display = '';
        }

        function showSlide(n) {
            slides[currentSlide].classList.remove("active-slide");
            slides[n].classList.add("active-slide");
            currentSlide = n;
        }

        const quizContainer = document.getElementById("quiz");
        const submitButton = document.getElementById("submit");
        buildQuiz();
        const slides = document.querySelectorAll(".slide");
        console.log("~~~---==> Sliders Array Before display: ", slides);
        var currentSlide = 0;
        showSlide(0);
        console.log("~~~---==> Sliders Array After display: ", slides);
        // on submit, show results
        $("#submit").unbind("click");
        $("#submit").bind("click", showResults);
    }    

    function saveState(opCode, gameState) {
        // to save the current state in the Database
        $.ajax("rest/saveState.php", {
            data: JSON.stringify({opCode: opCode, data: gameState}),
            contentType: 'application/json',
            type: 'POST'
        })
            .done(function (data) {
                console.log("second success", data);
            })
            .fail(function (data) {
                console.log("error", data);
            });
    }

    function changeLanguage(flag) {
      var message="";
      if (flag) {
        if (language === 'FRA') {
          language = 'ENG';
          langLabel = 'Francais';
          message = "You are here:";
        } else {
          language = 'FRA';
          langLabel = 'English';
          message = "Vous ??tes ici:";
        }
      } else {
        if (language === 'ENG') {
          message = "You are here:";
        } else {
          message = "Vous ??tes ici:";
        }
      }
      document.getElementById("languages").innerHTML = langLabel;
      document.getElementById("divMiniMapText").innerHTML = message;
    }


    function hideVideo() {
        const vidPlayer = document.getElementById("divVidPlayer");
        vidPlayer.innerHTML = "";
        video.style.display = "none";
        //vplayer.pause();
    }

    function showVideo(qVideoURL, onVideoCloseCallback) {
      var messageForVideo;
      if (language === 'FRA') {
          // we use FRENCH LANGUAGE
          messageForVideo = "Desole, mauvaise reponse!!!<br> Vous devrez regarder la vid??o pour trouver la bonne r??ponse:";
        } else {
          messageForVideo = "Sorry, wrong answer!!! <br>  You will have to watch the video to find the right answer:";
        }
        video.style.display = "";
        // vplayer.play();
        const vidScrTxt = document.getElementById("vidScrTxt");
        //const vidScrTxt2 = document.getElementById("vidScrTxt2");
        vidScrTxt.innerHTML = messageForVideo;
        const vidPlayer = document.getElementById("divVidPlayer");
        vidPlayer.innerHTML = '<div class="embed-container"><iframe src="' + qVideoURL
            + '" width="600" height="480" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';

        $("#closeVideo").unbind("click");
        $("#closeVideo").bind("click", onVideoCloseCallback);

    }

    function showFinalScreen() {
        gameState.elapsedTime = secondsElapsed;
        // var element = document.getElementById("customIUN");
        // if (element != null) {
        //     customIUN = document.getElementById("customIUN").value;
        // }  else {
        //     customIUN = userIUN;
        // }
        gameState.customIUN = customIUN;
        playSound(soundFinal);
        var minSpent = Math.floor(gameState.elapsedTime / 60);
        var secSpent = (gameState.elapsedTime % 60);
        var correctAnswers =0;
        correctAnswers = gameState.correctCount;
        finScr.style.display = "";
        _this.scene.pause();
        // game.scene.pause("default");
        _this.input.keyboard.enabled = false;
        _this.input.keyboard.clearCaptures(); //Stop capturing the keyboard
        const finScrTxtLine1 = document.getElementById('finScrTxtLine1');
        const finScrTxtLine2 = document.getElementById('finScrTxtLine2');
        const finScrTxtLine3 = document.getElementById('finScrTxtLine3');
        //const finScrTxtLine4 = document.getElementById('finScrTxtLine4');
        var finScrTxtLine2Msg = "You have responded to : " + correctAnswers + " questions";
        var finScrTxtLine3Msg = "in " + minSpent + " minutes " + secSpent + " seconds";
        if (language === 'FRA') {
          finScrTxtLine2Msg = "Vous avez r??pondu ?? : " + correctAnswers + " questions";
          finScrTxtLine3Msg = "en  : " + minSpent + " minutes  " + secSpent + " secondes";
        }
        finScrTxtLine2.innerHTML = finScrTxtLine2Msg;
        finScrTxtLine3.innerHTML = finScrTxtLine3Msg;//gameState.elapsedTime;
        //finScrTxtLine4.innerHTML = "";
        //  the following to prevent cutting space charactes in the textarea field:
          {
            //   $("#finQ2").keyup(function(e){
            //    if(e.keyCode == 32){
            //        // user has pressed backspace
            //        document.getElementById("finQ2").value += " " ;
            //    }
            //  });
            //  $("#finQ3").keyup(function(e){
            //   if(e.keyCode == 32){
            //       // user has pressed backspace
            //       document.getElementById("finQ3").value += " " ;
            //   }
            // });
          }
    }

    function submitFinalAnswer() {
        gameState.customIUN = customIUN;
        //starsCount is global
        var respQ2 = document.getElementById("finQ2").value;
        var respQ2strWithOutQuotes= respQ2.replace(/['"]+/g, '')
        //console.log('respQ2: ',respQ2strWithOutQuotes);
        var respQ3 = document.getElementById("finQ3").value;
        var respQ3strWithOutQuotes= respQ3.replace(/['"]+/g, '')
        //console.log('respQ3: ',respQ3strWithOutQuotes);
        gameState.comments = "1)Stars: " + starsCount
                          + " 2)Likes: " + respQ2strWithOutQuotes
                          + " 3)Suggest: " + respQ3strWithOutQuotes;
        console.log('comments: ',gameState.comments);
        gameState.listofquestions = listofquestions;
        var d = new Date();
        gameState.timefinish = getFullDateTime(d);
        gameState.isFinished = 1;

        if (!isSurveySent) {
            saveState('UPDATE', gameState);
            isSurveySent = true;
            //alert ('The survey has been submitted! Thanks for your opinion!');
            // "Some words are better left unsaid."
            // /<p><h3><span id="finScrTxtLine1" class="finMessage">F??licitations! Congratulations!</span></h3></p>
            finScr.innerHTML = "";
            var finalLastStrMsg = "";
            finalLastStrMsg = '<br><br><br><hr/><p><h3><span class="finMessage">Merci Beaucoup! Thank you!</span></h3></p><hr/><br>';
            var userStat = finalLastStrMsg;
            var userStat = "";
            // var request = new XMLHttpRequest();
            // var url = "./rest/getIUN.php";
            // var params = "userId=" + userIUN;
            // console.log("params: " + params + " url: "+ url);
            // request.open('POST', url, true);
            // request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // request.onreadystatechange = function() {
            //   console.log("Request is sent");
            //     if (request.readyState === XMLHttpRequest.DONE) {
            //       console.log("Request status: ", request.status );
            //       if (request.status === 200) {
            //         var response = JSON.parse(request.response);
            //         console.log(JSON.stringify(response));
            //         console.log(" request.status: "+ request.status);
            //         if (response == "") {
            //           userStat = "The user IUN not found!";
            //           console.log("Error in request: ",userStat);
            //         }else{
            //           userStat = response.userScoreHistory;
            //           userStat = getTableFromResponce(response);
            //           console.log("Request successfull: ",userStat);
            //         }
            //       } else {
            //             userStat = "The user IUN not found!";
            //             console.log("Error in request: ",userStat + " req-status: " + request.status);
            //     }
            //   } else   {
            //         console.log("Error in request: request ready is not ready! ");
            //     }
            // };

            var url = "./rest/getIUN.php";
            var formData = {
                'userId': userIUN,
                'opCode': 'ALLSTAT'
            };

            $.get(url, formData).done(function (data) {
                //alert("Data Loaded: " + data);
                userStat = getTableFromResponce(data);

                //  request.send(params);
                finScr.innerHTML = finalLastStrMsg + '<br><p><h5><span class="finMessage">' + userStat + ' </span></h5></p><br>';

                setTimeout(function () {
                    // finScr.innerHTML = finalLastStrMsg + '<br><div><p><h5><span id="finScrTxtLine1" class="finMessage">' + userStat + ' </span></h5></p></div><br>';
                    // '<br><br><br><hr/><p><h3><span id="finScrTxtLine1" class="finMessage">Merci Beaucoup! Thank you!</span></h3></p><hr/><br>';
                }, 3200);
            });

        } else {
            alert ('This survey has already been submitted! Going backwards!');
        }
        //goBack() ; //go back to the previous page
    }

    $("#finSubmit").unbind("click");
    $("#finSubmit").bind("click", submitFinalAnswer);
    // //checking if the browser is IE or others
    // if (!isBrowserIE) {
    // }
    // $("#finExit").unbind("click");
    // $("#finExit").bind("click", opneAnotherURL);
    // by Alexey Zapromyotov (c) 2019
};

var starsCount =0;

function getTableFromResponce(objResponce) {
  var myObj = objResponce.userScoreHistory;
  var returnStr = "";
  var myStr = "<table class='headTable'><tr><th class='headTableTD' colspan='5'> Results history: </th><tr>";
  myStr = myStr + "<tr><td class='headTableTD'>System ID * </td><td class='headTableTD'>Provided IUN * </td> "+
           "<td class='headTableTD'>Time Elapsed * </td><td class='headTableTD'>Answered * </td><td class='headTableTD'>Date/Time</td></tr>";
  var myRow = "";
  var timeFull;
  //console.log(JSON.stringify(objResponce));
  //console.dir(myObj);
  //console.log("===================================");
  // sorting:
  myObj.sort(desc);
      function asc(a, b) {
        return (a[8] == b[8] ? 0 : a[8] < b[8] ? -1 : 1);
      }

      function desc(a, b) {
        return asc(b, a);
      }
  // end of sorting ====================================
  for (var i = 0; i < myObj.length; i++) {
    if (myObj[i][7] != "No") {
      myRow = "<tr>";
      timeFull = myObj[i][5];
      if (timeFull > 60) {
        var minSpent = Math.floor(timeFull / 60);
        if (minSpent > 60) {
          //var hrsSpent = Math.floor(minSpent / 60);
          minSpent = Math.floor(minSpent / 60) + " hrs. " + (minSpent % 60);
        }
        var secSpent = (timeFull % 60);
        timeFull = minSpent + " min. " + secSpent;
      }
       timeFull += " sec. ";
      myRow += "<td class='headTableTD'>" + myObj[i][1] + "</td><td class='headTableTD'>" + myObj[i][2] +
              "</td><td class='headTableTD'>" + timeFull + "</td><td class='headTableTD'>" + myObj[i][6] +
              "</td><td class='headTableTD'>" + myObj[i][8] ;
      myStr += myRow + "</tr>";
    }
  }
  //myStr = myRow;
    returnStr = myStr + "</table>";
    //console.log('returnStr: ',returnStr);
  return returnStr;
}

function star(starX) {
  try {
    for (var i = 1; i < 6; i++) {
      $('#star'+i).css('color', '');
    }
    for (var i = 1; i < starX + 1; i++) {
      $('#star'+i).css('color', 'yellow');
    }
  } catch (e) {
    console.log('error counting stars! ');
  }
  starsCount = starX;
}

function getStarsCount() {
  return starsCount;
}

function goBack() {
    //go back in history - previous page!
    window.history.back();
}

function opneAnotherURL() {
  window.open("./start.html","_self");
}

window.onload = function () {
    'use strict';
    var app = new App();
    app.start();
}

var today = new Date();
var startTime = getFullDateTime(today);
var userTimer;
userTimer = new easytimer.Timer();
// var startTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); //Date.now();
var endTime;
var secondsElapsed = 0;
//userTimer.start();  // -------- UNPAUSE when required!!! TIMER

userTimer.addEventListener('secondsUpdated', function (e) {
    $('#userTimer').html(userTimer.getTimeValues().toString());
    secondsElapsed++;
});

function getFullDateTime(today) {
  var fullDay;
  var fullTime;
  var today = new Date();

  if (!String.prototype.padStart) {
      String.prototype.padStart = function padStart(targetLength,padString) {
          targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
          padString = String((typeof padString !== 'undefined' ? padString : ' '));
          if (this.length > targetLength) {
              return String(this);
          }
          else {
              targetLength = targetLength-this.length;
              if (targetLength > padString.length) {
                  padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
              }
              return padString.slice(0,targetLength) + String(this);
          }
      };
  }

  try {
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    fullDay = mm + '/' + dd + '/' + yyyy;
    var hour = ("0" + today.getHours()).slice(-2); //today.getHours() ;
    var min = ("0" + today.getMinutes()).slice(-2); //today.getMinutes();
    var sec = ("0" + today.getSeconds()).slice(-2); //today.getSeconds();
    fullTime =  hour + ":" + min + ":" + sec;
    today = fullDay + ' ' + fullTime;
  } catch (e) {
    console.log('error getting current time and date!');
  }
    return today;
}

function updateCustomIUN(val) {
    //event
    customIUN = val;
    var element = document.getElementById("customIUN");
    if (element != null) {
        customIUN = document.getElementById("customIUN").value;
    }
    console.log('updateCustomIUN is updated! Now: ' + customIUN);
}

function updateSilentCheckBox(val) {
  let silentCheckBox = val;
  let element = document.getElementById("silentCheckBox");
  if (element != null) {
      if (element.checked) {
        isSilent = true;
      } else {
          isSilent = false;
      }
  }
  console.log('isSilent is updated! Now: ', isSilent, " silentCheckBox: ", silentCheckBox);
}

function showMiniMap(val) {
    // function to show/hide miniMap - checkbox is on the top-bar
    var element = document.getElementById("hideMapCheckBox");
    if (element != null) {
        if (element.checked) {
            document.getElementById("mazeWDrsRmsMap").style.display = "none";
        } else {
            document.getElementById("mazeWDrsRmsMap").style.display = "block";
        }
    }
    //console.log('showMiniMap is updated! Now: ' + element.checked);
}

function closeMiniMap() {
    // function to Hide only the mini-Map, used by [x] in the window
    document.getElementById("mazeWDrsRmsMap").style.display = "none";
    document.getElementById("hideMapCheckBox").checked = true;
}

function msieversion()
{  //checking if this is IE or something else?
  var ua = window.navigator.userAgent;
  try {
    function ieVersion(uaString) {
      uaString = uaString || navigator.userAgent;
      var match = /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(uaString);
      if (match) return parseInt(match[2])
    }

    var msie = ieVersion(ua);
    if (msie >= 12) { //EDGE!
       return false; //this is not really IE, but better versions - EDGE!
    } else if (msie > 0 ) // If Internet Explorer, return version number
    {
        //alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
        return true;
    }
    else  // If another browser, return 0
    {
        //alert('otherbrowser');
        //Thanks GOD this is NOT IE!!!
        return false;
    }

  } catch (e) {
    console.log('Error while identifiing the browser agent! Most likely this is really old IE');
    return true;
  }
    return false;
}

// function Base64Encode(str, encoding) {
//     encoding = 'utf-8';
//     var bytes = new (typeof TextEncoder === "undefined" ? TextEncoderLite : TextEncoder)(encoding).encode(str);
//     return base64js.fromByteArray(bytes);
// }

// function Base64Decode(str, encoding) {
//     encoding = 'utf-8';
//     var bytes = base64js.toByteArray(str);
//     return new (typeof TextDecoder === "undefined" ? TextDecoderLite : TextDecoder)(encoding).decode(bytes);
// }
