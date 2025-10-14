import {
  Actor,
  Engine,
  vec,
  Keys,
  SpriteSheet,
  Animation,
  AnimationStrategy
} from "excalibur";
import { Resources } from "./resources";
import * as WALK from "./constants/animations/herbeceus.walk"


export class Player extends Actor {
  private speed = 200;

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

  override onInitialize() {


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

    // Movimentação
    if (dir.size > 0) {
      const movement = dir.normalize().scale(this.speed * (delta / 1000));
      this.pos = this.pos.add(movement);
    }
  }
}
