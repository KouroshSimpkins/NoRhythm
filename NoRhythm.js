/*jshint esversion: 6 */

let type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
      type = "canvas";
    }

    const Application = PIXI.Application,
          loader = PIXI.Loader.shared,
          resources = PIXI.Loader.shared.resources,
          Sprite = PIXI.Sprite;

    function keyboard(value) {
      const key = {};
      key.value = value;
      key.isDown = false;
      key.isUp = true;
      key.press = undefined;
      key.release = undefined;

      key.downHandler = event => {
        if (event.key === key.value) {
          if (key.isUp && key.press) key.press();
          key.isDown = true;
          key.isUp = false;
          event.preventDefault();
        }
      };

      key.upHandler = event => {
        if (event.key === key.value) {
          if (key.isDown && key.release) key.release();
          key.isDown = false;
          key.isUp = true;
          event.preventDefault();
        }
      };

      window.addEventListener(
        "keydown", key.downHandler.bind(key), false
      );

      window.addEventListener(
        "keyup", key.upHandler.bind(key), false
      );

      return key;
    }

    const app = new PIXI.Application({
      width: 600,
      height: 400,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      autoResize: true,
      antialias: true
    });

    document.body.appendChild(app.view);

    PIXI.Loader.shared
      .add("assets/gun.png")
      .add("assets/projectile.png")
      .load(setup);

    let PlayerCharacter, state;

    var bullets = [];
    var bulletSpeed = 5;

    function fireBullet(e) {
      console.log("fire");

      let bullet = createBullet();
      bullets.push(bullet);
    }

    function createBullet() {
      console.log("fire");
      let bullet = new PIXI.Sprite(resources["assets/projectile.png"].texture);
      bullet.anchor.set(0.5);
      bullet.x = PlayerCharacter.x;
      bullet.y = PlayerCharacter.y;
      bullet.speed = bulletSpeed;
      app.stage.addChild(bullet);

      return bullet;
    }

    function setup() {
        PlayerCharacter = new Sprite(
        resources["assets/gun.png"].texture
      );

      PlayerCharacter.x = app.renderer.width / 2;
      PlayerCharacter.y = app.renderer.height / 2;
      PlayerCharacter.vx = 0;
      PlayerCharacter.vy = 0;
      app.stage.addChild(PlayerCharacter);

      const left = keyboard("ArrowLeft"),
            right = keyboard("ArrowRight"),
            spacebar = keyboard(" ");

      left.press = () => {
        PlayerCharacter.vx = -5;
        PlayerCharacter.vy = 0;
      };

      left.release = () => {
        if (!right.isDown) {
          PlayerCharacter.vx = 0;
        }
      };

      right.press = () => {
        PlayerCharacter.vx = 5;
        PlayerCharacter.vy = 0;
      };

      right.release = () => {
        if (!left.isDown) {
          PlayerCharacter.vx = 0;
        }
      };

      spacebar.press = () => {
        fireBullet();
      };

      state = play;

      app.ticker.add((delta) => gameloop(delta));
    }

    function gameloop(delta) {
      // do stuff
      state(delta);
    }

    function play(delta) {
      PlayerCharacter.x += PlayerCharacter.vx;
      PlayerCharacter.y += PlayerCharacter.vy;
    }