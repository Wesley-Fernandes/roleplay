import {
  Actor,
  Engine,
  vec,
  Keys,
  SpriteSheet,
  Animation,
  AnimationStrategy,
  Vector
} from "excalibur";
import { Resources } from "./resources";
import * as WALK from "./constants/animations/herbeceus.walk"


export class Player extends Actor {
  private speed = 200;
  private target: Vector | null = null;
  private arrivalThreshold = 4;

  private animIdleDown: Animation | undefined;
  private animIdleUp: Animation| undefined;
  private animIdleLeft: Animation| undefined;
  private animIdleRight: Animation| undefined;

  private animWalkDown: Animation| undefined;
  private animWalkUp: Animation| undefined;
  private animWalkLeft: Animation| undefined;
  private animWalkRight: Animation| undefined;

  private currentDirection: "down" | "up" | "left" | "right" = "down";

  constructor() {
    super({
      name: "Player",
      pos: vec(150, 150),
      width: 64,
      height: 64,
      anchor: vec(0.5, 0.5)
    });
  }

  override onInitialize(engine:Engine) {

    engine.input.pointers.primary.on('down', (evt) => {
      this.target = evt.worldPos.clone();
    });

    const sheet = SpriteSheet.fromImageSource({
      image: Resources.Herbeceu.walk,
      grid: {
        rows: 4,
        columns: 9,
        spriteHeight: 64,
        spriteWidth: 64
      }
    });

    // Cria animações
    this.animIdleDown = Animation.fromSpriteSheetCoordinates({
      spriteSheet: sheet,
      frameCoordinates: [{ x: 0, y: 2 }],
      strategy: AnimationStrategy.Freeze
    });
    this.animIdleUp = Animation.fromSpriteSheetCoordinates({
      spriteSheet: sheet,
      frameCoordinates: [{ x: 0, y: 0 }],
      strategy: AnimationStrategy.Freeze
    });
    this.animIdleLeft = Animation.fromSpriteSheetCoordinates({
      spriteSheet: sheet,
      frameCoordinates: [{ x: 0, y: 1}],
      strategy: AnimationStrategy.Freeze
    });
    this.animIdleRight = Animation.fromSpriteSheetCoordinates({
      spriteSheet: sheet,
      frameCoordinates: [{ x: 0, y: 3 }],
      strategy: AnimationStrategy.Freeze
    });

    //------------------ ANIMATIONS
    this.animWalkDown = Animation.fromSpriteSheetCoordinates({
      spriteSheet: sheet,
      frameCoordinates: WALK.WALK_DOWN,
      strategy: AnimationStrategy.Loop
    });
    this.animWalkLeft = Animation.fromSpriteSheetCoordinates({
      spriteSheet: sheet,
      frameCoordinates: WALK.WALK_LEFT,
      strategy: AnimationStrategy.Loop
    });
    this.animWalkRight = Animation.fromSpriteSheetCoordinates({
      spriteSheet: sheet,
      frameCoordinates: WALK.WALK_RIGHT,
      strategy: AnimationStrategy.Loop
    });
    this.animWalkUp = Animation.fromSpriteSheetCoordinates({
      spriteSheet: sheet,
      frameCoordinates: WALK.WALK_UP,
      strategy: AnimationStrategy.Loop
    });

    // Começa parado
    this.graphics.use(this.animIdleDown);
  }

  override onPreUpdate(engine: Engine, delta: number): void {

    const dir = vec(0, 0);
    const kb = engine.input.keyboard;

    if (kb.isHeld(Keys.W) || kb.isHeld(Keys.Up)) dir.y = -1;
    if (kb.isHeld(Keys.S) || kb.isHeld(Keys.Down)) dir.y = 1;
    if (kb.isHeld(Keys.A) || kb.isHeld(Keys.Left)) dir.x = -1;
    if (kb.isHeld(Keys.D) || kb.isHeld(Keys.Right)) dir.x = 1;

    if (dir.x !== 0 || dir.y !== 0) {
      // Cancelar movimento por toque se o jogador usar teclado
      this.target = null;

      // normaliza para evitar velocidade maior na diagonal
      const moveDir = dir.normalize();
      this.vel = moveDir.scale(this.speed);

      // animações com base na direção
      if (Math.abs(moveDir.x) > Math.abs(moveDir.y)) {
        if (moveDir.x > 0) {
          this.currentDirection = "right";
          this.graphics.use(this.animWalkRight!);
        } else {
          this.currentDirection = "left";
          this.graphics.use(this.animWalkLeft!);
        }
      } else {
        if (moveDir.y > 0) {
          this.currentDirection = "down";
          this.graphics.use(this.animWalkDown!);
        } else {
          this.currentDirection = "up";
          this.graphics.use(this.animWalkUp!);
        }
      }

      return;
    }

    if (kb.isHeld(Keys.W) || kb.isHeld(Keys.Up)) {
      dir.y = -1;
      this.currentDirection = "up";
      this.graphics.use(this.animWalkUp!);
    } else if (kb.isHeld(Keys.S) || kb.isHeld(Keys.Down)) {
      dir.y = 1;
      this.currentDirection = "down";
      this.graphics.use(this.animWalkDown!);
    } else if (kb.isHeld(Keys.A) || kb.isHeld(Keys.Left)) {
      dir.x = -1;
      this.currentDirection = "left";
      this.graphics.use(this.animWalkLeft!);
    } else if (kb.isHeld(Keys.D) || kb.isHeld(Keys.Right)) {
      dir.x = 1;
      this.currentDirection = "right";
      this.graphics.use(this.animWalkRight!);
    } else {
      // Parado = animação idle conforme direção anterior
      switch (this.currentDirection) {
        case "up":
          this.graphics.use(this.animIdleUp!);
          break;
        case "down":
          this.graphics.use(this.animIdleDown!);
          break;
        case "left":
          this.graphics.use(this.animIdleLeft!);
          break;
        case "right":
          this.graphics.use(this.animIdleRight!);
          break;
      }
    }

    // 2) Se não tiver teclado, checar se existe target de toque
    if (this.target) {
      const toTarget = this.target.sub(this.pos);
      const distance = toTarget.size;

      if (distance > this.arrivalThreshold) {
        const moveDir = toTarget.normalize();
        this.vel = moveDir.scale(this.speed);

        // animação baseada no vetor de movimento
        if (Math.abs(moveDir.x) > Math.abs(moveDir.y)) {
          if (moveDir.x > 0) {
            this.currentDirection = "right";
            this.graphics.use(this.animWalkRight!);
          } else {
            this.currentDirection = "left";
            this.graphics.use(this.animWalkLeft!);
          }
        } else {
          if (moveDir.y > 0) {
            this.currentDirection = "down";
            this.graphics.use(this.animWalkDown!);
          } else {
            this.currentDirection = "up";
            this.graphics.use(this.animWalkUp!);
          }
        }
      } else {
        // chegou no destino
        this.pos = this.target; // garante posicionamento exato
        this.target = null;
        this.vel = vec(0, 0);

        // animação idle conforme direção
        switch (this.currentDirection) {
          case "up":
            this.graphics.use(this.animIdleUp!);
            break;
          case "down":
            this.graphics.use(this.animIdleDown!);
            break;
          case "left":
            this.graphics.use(this.animIdleLeft!);
            break;
          case "right":
            this.graphics.use(this.animIdleRight!);
            break;
        }
      }

      return;
    }

    // 3) Nem teclado nem target => parado (idle)
    this.vel = vec(0, 0);
    switch (this.currentDirection) {
      case "up":
        this.graphics.use(this.animIdleUp!);
        break;
      case "down":
        this.graphics.use(this.animIdleDown!);
        break;
      case "left":
        this.graphics.use(this.animIdleLeft!);
        break;
      case "right":
        this.graphics.use(this.animIdleRight!);
        break;
    }
  }
}
