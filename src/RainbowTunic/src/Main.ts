import { EventsClient, EventHandler } from 'modloader64_api/EventHandler';
import { IModLoaderAPI, IPlugin } from 'modloader64_api/IModLoaderAPI';
import { InjectCore } from 'modloader64_api/CoreInjection';
import { IZ64Main } from 'Z64Lib/API/Common/IZ64Main';
import { Color3 } from './Color3';

const TUNICADDR = 0x000f7ad8;

let colorTargets : Color3[] = [
  new Color3(255, 0, 0),
  new Color3(255, 255, 0),
  new Color3(0, 255, 0),
  new Color3(0, 255, 255),
  new Color3(0, 0, 255),
  new Color3(255, 0, 255)
];
let currentTarget = 0;
let currentColor = new Color3();
let velocity = 15;

export class RainbowTunic implements IPlugin {
  ModLoader = {} as IModLoaderAPI;
  name = 'RainbowTunic';

  @InjectCore() core!: IZ64Main;
  constructor() {}
  preinit(): void {}
  init(): void {}
  postinit(): void {}

  onTick(): void
  {
    let tunicOffset = TUNICADDR + this.core.OOT!.link.tunic * 3;

    var rScalar = colorTargets[currentTarget].r == 255 ? 1 : -1;
    var gScalar = colorTargets[currentTarget].g == 255 ? 1 : -1;
    var bScalar = colorTargets[currentTarget].b == 255 ? 1 : -1;

    currentColor.r = currentColor.r + (velocity * rScalar);
    currentColor.g = currentColor.g + (velocity * gScalar);
    currentColor.b = currentColor.b + (velocity * bScalar);

    currentColor = currentColor.clamped();

    if (currentColor.r == colorTargets[currentTarget].r
      && currentColor.g == colorTargets[currentTarget].g
      && currentColor.b == colorTargets[currentTarget].b) currentTarget = (currentTarget + 1) % (colorTargets.length - 1);

    this.ModLoader.emulator.rdramWriteBuffer(tunicOffset, Buffer.from([currentColor.r, currentColor.g, currentColor.b]));
  }

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onClient_InjectFinished(evt: any) {}
}
