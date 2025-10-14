import { ImageSource, Loader } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  Herbeceu: {
    walk: new ImageSource("./images/herbeceu/walk.png"),
    hurt: new ImageSource("./images/herbeceu/hurt.png"),
    slash: new ImageSource("./images/herbeceu/slash.png"),
    spell: new ImageSource("./images/herbeceu/spell.png"),
    thrust: new ImageSource("./images/herbeceu/thrust.png"),
  },
  tileset: {
    dungeonA2: new ImageSource("./images/rpg-maker/tileset/Dungeon_A2.png")
  }
} as const;

export const loader = new Loader();
for (const res of Object.values(Resources)) {
  for (const action of Object.values(res)){
    loader.addResource(action);
  }
}
