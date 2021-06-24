export const getMaterialComponents = (speech: string): string[] => {
  const source = speech.split(' ').reverse()[0];

  switch (source) {
    case 'babu':
      return [
        'babu leg bone',
        'burnt babu leg',
        'burnt babu chop',
        'cooked babu leg',
        'cooked babu chop',
        'uncooked babu leg',
        'uncooked babu chop'
      ];

    case 'dais':
      return [
        'burnt dais leg',
        'burnt dais chop',
        'cooked dais leg',
        'cooked dais chop',
        'uncooked dais leg',
        'uncooked dais chop',
        'tan leather strips',
        'tan leather roll',
        'large tan leather roll',
        'brown leather strips',
        'brown leather roll',
        'large brown leather roll'
      ];

    case 'earth':
      return [
        'copper ingot',
        'gold ingot',
        'iron ingot',
        'silver ingot',
        'mythril ingot',
        'red iron ingot',
        'electrum ingot',
        'palladium ingot',
        'viridium ingot',
        'valyan ingot',
        'rock'
      ];

    case 'embers':
      return ['coal', 'fuel core'];

    case 'fungi':
      return [
        'burnt brown mushroom',
        'cooked brown mushroom',
        'ripe brown mushroom',
        'burnt cave mushroom',
        'cooked cave mushroom',
        'ripe cave mushroom',
        'burnt glowing mushroom',
        'cooked glowing mushroom',
        'ripe glowing mushroom',
        'burnt red mushroom',
        'cooked red mushroom',
        'ripe red mushroom'
      ];

    case 'gems':
      return ['blue crystal gem', 'blue crystal shard'];

    case 'gotera':
      return ['gotera seedling', 'redwood gotera core'];

    case 'produce':
      return [
        'burnt apple core',
        'cooked apple core',
        'ripe apple core',
        'unripe apple core',
        'burnt apple',
        'cooked apple',
        'ripe apple',
        'unripe apple',
        'burnt blueberry',
        'cooked blueberry',
        'ripe blueberry',
        'unripe blueberry',
        'burnt carrot',
        'cooked carrot',
        'ripe carrot',
        'unripe carrot',
        'carrot leaves',
        'burnt eggplant',
        'cooked eggplant',
        'ripe eggplant',
        'unripe eggplant',
        'burnt garlic',
        'cooked garlic',
        'ripe garlic',
        'unripe garlic',
        'garlic leaves',
        'garlic roots',
        'burnt onion',
        'cooked onion',
        'ripe onion',
        'unripe onion',
        'onion leaves',
        'onion roots',
        'burnt potato',
        'cooked potato',
        'ripe potato',
        'unripe potato',
        'potato sapling',
        'burnt pumpkin',
        'cooked pumpkin',
        'ripe pumpkin',
        'unripe pumpkin',
        'burnt pumpkin piece',
        'cooked pumpkin piece',
        'ripe pumpkin piece',
        'unripe pumpkin piece',
        'burnt tomato',
        'cooked tomato',
        'ripe tomato',
        'unripe tomato'
      ];

    case 'pyre':
      return ['dynamite', 'firework', 'flint', 'fuel core'];

    case 'revenant':
      return ['cursed hand guard'];

    case 'salt':
      return ['salt'];

    case 'silica':
      return ['sandstone', 'empty flask', 'flask containing water', 'flask containing teleportation potion'];

    case 'spriggull':
      return [
        'spriggull bone shard',
        'spriggull leg bone',
        'burnt spriggull leg',
        'burnt spriggull chop',
        'cooked spriggull leg',
        'cooked spriggull chop',
        'uncooked spriggull leg',
        'uncooked spriggull chop',
        'blue spriggull feather',
        'blue spriggull fletching',
        'green spriggull feather',
        'purple spriggull feather',
        'red spriggull feather',
        'red spriggull fletching'
      ];

    case 'turabada':
      return ['turabada eye'];

    case 'weapon':
      return [
        'hilted apparatus',
        'curled wooden handle',
        'bow handle',
        'fist handle',
        'medium straight wooden handle',
        'short wooden handle',
        'kunai handle',
        'shield handle',
        'handle',
        'rusty axe',
        'rusty pickaxe',
        'rusty shortsword',
        'rusty pitchfork'
      ];

    case 'wyrm':
      return ['green leather strips', 'green leather roll', 'large green leather roll'];

    default:
      return [];
  }
};
