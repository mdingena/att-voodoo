import { useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { experienceAtom, Panel, panelAtom, School, spellbookAtom } from '@/atoms';
import { Experience } from '../Experience';
import { SpellFinder } from '../SpellFinder';
import styles from './SpellbookPanel.module.css';

export const SpellbookPanel = (): JSX.Element => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [experience] = useAtom(experienceAtom);
  const [spellbook] = useAtom(spellbookAtom);
  const [panel, setPanel] = useAtom(panelAtom);

  const closePanel = () => {
    setPanel(Panel.None);
  };

  const closeSpellFinder = () => setSelectedSchool(null);

  const selectAbjuration = () => setSelectedSchool('abjuration');
  const selectConjuration = () => setSelectedSchool('conjuration');
  const selectEvocation = () => setSelectedSchool('evocation');
  const selectTransmutation = () => setSelectedSchool('transmutation');

  const { abjurationXpTotal, conjurationXpTotal, evocationXpTotal, transmutationXpTotal, upgrades } = experience;

  const schoolUpgrades = useMemo(
    () => (school: School) =>
      Object.entries(upgrades)
        .filter(([spellKey]) => spellbook[spellKey]?.school === school)
        .reduce(
          (sum, [, spellUpgrades]) =>
            sum + Object.values(spellUpgrades).reduce((upgrades, upgrade) => upgrades + upgrade, 0),
          0
        ),
    [upgrades, spellbook]
  );

  const abjurationUpgrades = schoolUpgrades('abjuration');
  const conjurationUpgrades = schoolUpgrades('conjuration');
  const evocationUpgrades = schoolUpgrades('evocation');
  const transmutationUpgrades = schoolUpgrades('transmutation');

  const isOpen = panel === Panel.Spellbook;

  return (
    <>
      <div className={isOpen ? styles.open : styles.closed}>
        <div>
          <div className={styles.header}>Spellbook</div>
          <div className={styles.schools}>
            <div className={styles.description}>
              <p>
                The spellbook contains a list of spells grouped by their school of magic. Discovered spells have their
                incantations documented on their spell page. Undiscovered spells can be studied to reveal their hidden
                incantations.
              </p>
              <p>
                You gain experience every time you cast a spell. The type and amount of XP you gain depends on the
                number of incantations and the spell&apos;s school of magic.
              </p>
            </div>
            <Experience
              onClick={selectAbjuration}
              school='Abjuration'
              total={abjurationXpTotal}
              upgrades={abjurationUpgrades}
            />
            <Experience
              onClick={selectConjuration}
              school='Conjuration'
              total={conjurationXpTotal}
              upgrades={conjurationUpgrades}
            />
            <Experience
              onClick={selectEvocation}
              school='Evocation'
              total={evocationXpTotal}
              upgrades={evocationUpgrades}
            />
            <Experience
              onClick={selectTransmutation}
              school='Transmutation'
              total={transmutationXpTotal}
              upgrades={transmutationUpgrades}
            />
          </div>
        </div>
        <div className={styles.close}>
          <button onClick={closePanel}>Close &gt;</button>
        </div>
      </div>
      {selectedSchool && <SpellFinder school={selectedSchool} onClose={closeSpellFinder} />}
    </>
  );
};
