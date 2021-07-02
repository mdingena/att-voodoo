import { useState } from 'react';
import { useAtom } from 'jotai';
import { Panel, panelAtom, School } from '@/atoms';
import { Experience } from '../Experience';
import { SpellFinder } from '../SpellFinder';
import styles from './UpgradesPanel.module.css';

export const UpgradesPanel = (): JSX.Element => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [panel, setPanel] = useAtom(panelAtom);

  const closePanel = () => {
    setPanel(Panel.None);
  };

  const closeSpellFinder = () => {
    setSelectedSchool(null);
  };

  const selectAbjuration = () => setSelectedSchool('abjuration');
  const selectConjuration = () => setSelectedSchool('conjuration');
  const selectEvocation = () => setSelectedSchool('evocation');
  const selectTransmutation = () => setSelectedSchool('transmutation');

  const isOpen = panel === Panel.Upgrades;

  return (
    <>
      <div className={isOpen ? styles.open : styles.closed}>
        <div>
          <div className={styles.header}>Upgrades</div>
          <div className={styles.upgrades}>
            <div className={styles.description}>
              <p>
                You gain experience every time you cast a spell. The type and amount of XP you gain depends on the
                number of incantations and the spell&apos;s school of magic.
              </p>
              <p>Use the upgrade tracks below to find spells to upgrade.</p>
            </div>
            <Experience onClick={selectAbjuration} school='Abjuration' total={0} spent={0} />
            <Experience onClick={selectConjuration} school='Conjuration' total={13150} spent={13000} />
            <Experience onClick={selectEvocation} school='Evocation' total={24580} spent={23000} />
            <Experience onClick={selectTransmutation} school='Transmutation' total={7750} spent={4000} />
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
