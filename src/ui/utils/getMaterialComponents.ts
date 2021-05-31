import { Prefab } from '@/prefabs';

export const getMaterialComponents = (speech: string): number[] => {
  const source = speech.split(' ').reverse()[0];

  switch (source) {
    case 'babu':
      return [
        Prefab.BabuLegBone,
        Prefab.BabuLegFullBurnt,
        Prefab.BabuLegHalfBurnt,
        Prefab.SoftFabricMediumRoll,
        Prefab.SoftFabricMediumStrips
      ];

    case 'dais':
      return [
        Prefab.DaisMeatFullBurnt,
        Prefab.DaisMeatHalfBurnt,
        Prefab.SoftFabricMediumRoll,
        Prefab.SoftFabricMediumStrips
      ];

    case 'earth':
      return [
        Prefab.CarsiIngot,
        Prefab.CopperIngot,
        Prefab.EvinonSteelIngot,
        Prefab.GoldIngot,
        Prefab.IronIngot,
        Prefab.OrchiIngot,
        Prefab.RedIronIngot,
        Prefab.SilverIngot
      ];

    case 'embers':
      return [Prefab.Coal];

    case 'fungi':
      return [
        Prefab.MushroomBrownFullBurnt,
        Prefab.MushroomBrownHalfBurnt,
        Prefab.MushroomCaveLargeHalfBurnt,
        Prefab.MushroomCaveSmallFullBurnt,
        Prefab.MushroomCaveSmallHalfBurnt,
        Prefab.MushroomGlowingFullBurnt,
        Prefab.MushroomGlowingHalfBurnt,
        Prefab.MushroomRedFullBurnt,
        Prefab.MushroomRedHalfBurnt
      ];

    case 'gems':
      return [Prefab.CrystalGemBlue, Prefab.CrystalShardBlue];

    case 'glass':
      return [Prefab.PotionMedium, Prefab.SandstoneStone];

    case 'gotera':
      return [Prefab.GoteraSeedlingOrb, Prefab.RedwoodGoteraCore];

    case 'produce':
      return [
        Prefab.AppleCoreBurnt,
        Prefab.AppleFullBurnt,
        Prefab.AppleHalfBurnt,
        Prefab.BlueberryFullBurnt,
        Prefab.CarrotFullBurnt,
        Prefab.CarrotHalfBurnt,
        Prefab.CarrotLeaves,
        Prefab.EggplantFullBurnt,
        Prefab.EggplantHalfBurnt,
        Prefab.GarlicFullBurnt,
        Prefab.GarlicHalfBurnt,
        Prefab.GarlicLeaves,
        Prefab.GarlicRoots,
        Prefab.OnionFullBurnt,
        Prefab.OnionHalfBurnt,
        Prefab.OnionLeaves,
        Prefab.OnionRoots,
        Prefab.PotatoFullBurnt,
        Prefab.PotatoHalfBurnt,
        Prefab.PotatoSapling,
        Prefab.PumpkinFullBurnt,
        Prefab.PumpkinHalfBurnt,
        Prefab.PumpkinPieceBurnt,
        Prefab.TomatoFullBurnt,
        Prefab.TomatoHalfBurnt
      ];

    case 'pyre':
      return [Prefab.Dynamite, Prefab.Firework];

    case 'revenant':
      return [Prefab.PhantomGuard];

    case 'salt':
      return [Prefab.Salt];

    case 'spriggull':
      return [
        Prefab.SpriggullDrumstickBone,
        Prefab.SpriggullDrumstickFullBurnt,
        Prefab.SpriggullDrumstickHalfBurnt,
        Prefab.SpriggullFeatherBlue,
        Prefab.SpriggullFeatherGreen,
        Prefab.SpriggullFeatherPurple,
        Prefab.SpriggullFeatherRed,
        Prefab.SpriggullFletchingBlue,
        Prefab.SpriggullFletchingRed
      ];

    case 'turabada':
      return [Prefab.ExplosiveSpike];

    case 'wyrm':
      return [Prefab.SoftFabricMediumRoll, Prefab.SoftFabricMediumStrips];

    default:
      return [];
  }
};
