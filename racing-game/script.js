const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

var scene;
var camera;
var car;
var carlooks;
var checkpoint1;
var carphysics;
var started = false;
var keys = [];
var carspeed = 5;
var turnspeed = Math.PI / 20;
var maxcarspeed = 10;
var maxturnspeed = Math.PI * 3;
var sideDamp = 0.97;
var turning;
var currentCheckpoint;
var finishCheckpoint;
var laps = 1;
var cameraTurnSpeed = 0.005;
var count = 0;
var running = true;
var second = 100;
var waitsecond = 950;
var movingcamera = true;
var dif;
var difficultynum;
var highscore;

var lapamount = 1;

var trackName = "assets/track.glb";

var difficulty = {
  1: {
    speed: 2,
    turn: Math.PI / 20,
    maxspeed: 30,
    maxturn: Math.PI * 3,
    drift: 0.97,
  },
  2: {
    speed: 3.5,
    turn: Math.PI / 20,
    maxspeed: 55,
    maxturn: Math.PI * 3,
    drift: 0.97,
  },
  3: {
    speed: 5,
    turn: Math.PI / 20,
    maxspeed: 75,
    maxturn: Math.PI * 3,
    drift: 0.97,
  },
};

async function start(lap) {
  var highscorecont = document.getElementById("high");
  highscore = localStorage.getItem(difficultynum + ":" + lap);
  if (!highscore) highscore = 0;
  highscorecont.innerHTML = highscore;

  document.getElementById("lap1").style.display = "none";
  document.getElementById("lap2").style.display = "none";
  document.getElementById("lap3").style.display = "none";
  lapamount = lap;
  carlooks = await add3d(scene, "assets/car.glb");
  carlooks.scaling = new BABYLON.Vector3(0.23, 0.8, 0.47);
  carlooks.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
  carlooks.parent = car;
  carlooks.position = new BABYLON.Vector3(-0.15, -0.4, 0);
  camera.lowerBetaLimit = 0.1;
  camera.upperBetaLimit = Math.PI / 2;
  camera.beta = Math.PI / 2.5;
  camera.alpha = 0;
  movingcamera = false;
  canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.mozRequestPointerLock;
  canvas.requestPointerLock();

  document.getElementById("1").style.display = "block";
  setTimeout(() => {
    document.getElementById("1").style.display = "none";
    document.getElementById("2").style.display = "block";
    setTimeout(() => {
      document.getElementById("2").style.display = "none";
      document.getElementById("3").style.display = "block";
      setTimeout(() => {
        document.getElementById("3").style.display = "none";
        document.getElementById("go").style.display = "block";
        setTimeout(() => {
          document.getElementById("go").style.display = "none";
          started = true;
          startTimer();
          camera.attachControl(canvas, true);
          document.getElementById("menucont").style.pointerEvents = "none";
        }, waitsecond);
      }, waitsecond);
    }, waitsecond);
  }, waitsecond);
}

function startTimer() {
  document.getElementById("timer").style.display = "block";
  setInterval(() => {
    if (running) {
      document.getElementById("timer").innerHTML = Number(count).toFixed(1);
      count += 0.1;
    }
  }, second);
}

function choosedif() {
  document.getElementById("play").style.display = "none";
  document.getElementById("easy").style.display = "block";
  document.getElementById("medium").style.display = "block";
  document.getElementById("hard").style.display = "block";
}

function setdif(dif) {
  difficultynum = dif;
  dif = difficulty[dif];
  carspeed = dif.speed;
  turnspeed = dif.turn;
  maxcarspeed = dif.maxspeed;
  maxturnspeed = dif.maxturn;
  sideDamp = dif.drift;
}

function chooselaps() {
  document.getElementById("easy").style.display = "none";
  document.getElementById("medium").style.display = "none";
  document.getElementById("hard").style.display = "none";

  document.getElementById("lap1").style.display = "block";
  document.getElementById("lap2").style.display = "block";
  document.getElementById("lap3").style.display = "block";
}

function stopLoading() {
  document.getElementById("play").style.display = "block";
}

canvas.addEventListener("click", () => {
  canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.mozRequestPointerLock;
  canvas.requestPointerLock();
});

const createScene = async () => {
  scene = new BABYLON.Scene(engine);

  const gravityVector = new BABYLON.Vector3(0, -100, 0);
  const havokInstance = await HavokPhysics();
  const physicsPlugin = new BABYLON.HavokPlugin(true, havokInstance);
  scene.enablePhysics(gravityVector, physicsPlugin);

  camera = new BABYLON.ArcRotateCamera(
    "camera1",
    -Math.PI / 2,
    Math.PI / 4,
    10,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.upperRadiusLimit = 10;
  camera.lowerRadiusLimit = 10;
  /*
  camera.lowerAlphaLimit = -Math.PI / 2;
  camera.upperAlphaLimit = Math.PI / 2;
  */
  camera.lowerBetaLimit = Math.PI / 2.6;
  camera.upperBetaLimit = Math.PI / 2.6;
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 50, height: 50 },
    scene
  );
  ground.position.y = -10;
  ground.scaling = new BABYLON.Vector3(10, 1, 10);

  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0.6, 1, 0.2);
  ground.material = groundMaterial;

  new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0, friction: 0.5, restitution: 0.1 },
    scene
  );

  var track = await add3d(scene, trackName, true, 0, 25);

  setTimeout(() => {
    stopLoading();
  }, 500);

  checkpoint1 = BABYLON.MeshBuilder.CreateBox("checkpoint1");
  checkpoint1.position = new BABYLON.Vector3(
    -171.9043731689453,
    0.9906203150749207,
    -166.01271057128906
  );
  checkpoint1.scaling = new BABYLON.Vector3(40, 5, 1);
  checkpoint1.isVisible = false;

  currentCheckpoint = checkpoint1;

  finishCheckpoint = BABYLON.MeshBuilder.CreateBox("finishCheckpoint");
  finishCheckpoint.position = new BABYLON.Vector3(
    -8.420748710632324,
    1.0107020139694214,
    -30.903810501098633
  );
  finishCheckpoint.scaling = new BABYLON.Vector3(60, 5, 1);
  finishCheckpoint.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
  finishCheckpoint.isVisible = false;

  car = BABYLON.MeshBuilder.CreateBox("car");
  car.scaling = new BABYLON.Vector3(3, 2, 5);
  car.position = new BABYLON.Vector3(
    0.5024060010910034,
    1.0034440755844116,
    -31.849363327026367
  );
  car.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
  car.isVisible = false;

  carphysics = new BABYLON.PhysicsAggregate(
    car,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 2, friction: 10, restitution: 0.1 },
    scene
  );

  camera.setTarget(car);

  scene.onBeforeRenderObservable.add(() => {
    if (started && running) {
      var turn = new BABYLON.Vector3();
      carphysics.body.getAngularVelocityToRef(turn);
      var forward = new BABYLON.Vector3();

      if (keys["a"]) {
        turn.y -= turnspeed;
      }
      if (keys["d"]) {
        turn.y += turnspeed;
      }

      if (keys["a"] || keys["d"]) {
        turning = true;
      } else {
        turning = false;
        turn.y = 0;
      }

      if (turn.y > maxturnspeed) {
        turn.y = maxturnspeed;
      } else if (turn.y < -maxturnspeed) {
        turn.y = -maxturnspeed;
      }

      var currentVelocity = carphysics.body.getLinearVelocity();

      var forwarddirection = new BABYLON.Vector3(0, 0, 1);
      forwarddirection.rotateByQuaternionToRef(
        car.rotationQuaternion,
        forwarddirection
      );

      var forwardvelocity = BABYLON.Vector3.Dot(
        currentVelocity,
        forwarddirection
      );

      if (keys["w"] && forwardvelocity < maxcarspeed) {
        forward.z += carspeed;
      }
      if (keys["s"] && forwardvelocity > -maxcarspeed) {
        forward.z -= carspeed;
      }

      var sidevelocity = currentVelocity.subtract(
        forwarddirection.scale(forwardvelocity)
      );

      sidevelocity.scaleInPlace(sideDamp);

      var dampenedVelocity = forwarddirection
        .scale(forwardvelocity)
        .add(sidevelocity);

      carphysics.body.setLinearVelocity(
        new BABYLON.Vector3(
          dampenedVelocity.x,
          currentVelocity.y,
          dampenedVelocity.z
        )
      );

      forward
        .rotateByQuaternionToRef(car.rotationQuaternion, forward)
        .normalize();

      carphysics.body.applyImpulse(forward, car.position);
      carphysics.body.setAngularVelocity(turn);

      if (checkpoint1.intersectsMesh(car, false)) {
        if (currentCheckpoint == checkpoint1) {
          currentCheckpoint = finishCheckpoint;
        }
      }

      if (finishCheckpoint.intersectsMesh(car, false)) {
        if (currentCheckpoint == finishCheckpoint) {
          laps++;
          document.getElementById("laps").innerHTML = laps;
          currentCheckpoint = checkpoint1;
        }
      }

      if (laps > lapamount) {
        running = false;

        var highscorecont = document.getElementById("high");
        if (count < highscore || highscore == 0) {
          highscore = Number(count - 0.1).toFixed(1);
          highscorecont.innerHTML = highscore;
          localStorage.setItem(difficultynum + ":" + (laps - 1), highscore);
        }

        var gameover = document.createElement("div");
        gameover.style =
          "width: 100vw;left: 0px;top: 20vh;position: absolute;text-align: center;color: black;";
        gameover.innerHTML = "<h1>Game Over</h1>";
        document.getElementById("menucont").appendChild(gameover);
        document.getElementById("menucont").style.background = "white";
        document.getElementById("timer").style.color = "black";
        document.getElementById("timer").style.position = "static";
        document.getElementById("timer").style.margin = "0px";

        document.getElementById("high").style.color = "black";
        document.getElementById("high").style.position = "static";
        document.getElementById("high").style.margin = "0px";

        var restart = document.createElement("div");
        restart.style =
          "width: 100vw;left: 0px;bottom: 15vh;position: absolute;text-align: center;color: black;";
        restart.innerHTML =
          "<button class='button' onclick='window.location.reload();'>Replay</button>";
        document.getElementById("menucont").appendChild(restart);

        document.getElementById("menucont").style.pointerEvents = "all";

        document.exitPointerLock();
      }
    } else {
      if (movingcamera) {
        camera.alpha += cameraTurnSpeed;
      }
    }
  });

  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
    }
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
};

createScene();

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

async function add3d(
  scene,
  path,
  addPhysics = false,
  mass = 0,
  friction = 0.1,
  restitution = 0.1
) {
  return new Promise((resolve) => {
    var name = path.split("/")[path.split("/").length - 1];
    path = path.replace(name, "");
    BABYLON.SceneLoader.ImportMesh("", path, name, scene, function (meshes) {
      if (addPhysics) {
        const root = meshes[0];
        root.getChildMeshes().forEach((mesh) => {
          var mesha = new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.MESH,
            { mass: 0, friction: 0.1, restitution: 0.1 },
            scene
          );
        });
      }
      resolve(meshes[0]);
    });
  });
}
