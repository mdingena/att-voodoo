import { useState } from 'react';
import { useAtom } from 'jotai';
import { Panel, panelAtom } from '@/atoms';
import { Experience } from '../Experience';
import styles from './UpgradesPanel.module.css';

enum School {
  None,
  Abjuration,
  Conjuration,
  Evocation,
  Transmutation
}

export const UpgradesPanel = (): JSX.Element => {
  const [selectedSchool, setSelectedSchool] = useState<School>(School.None);
  const [panel, setPanel] = useAtom(panelAtom);

  const closePanel = () => {
    setPanel(Panel.None);
  };

  const selectAbjuration = () => setSelectedSchool(School.Abjuration);
  const selectConjuration = () => setSelectedSchool(School.Conjuration);
  const selectEvocation = () => setSelectedSchool(School.Evocation);
  const selectTransmutation = () => setSelectedSchool(School.Transmutation);

  const isOpen = panel === Panel.Upgrades;

  return (
    <>
      <div className={isOpen ? styles.open : styles.closed}>
        <div>
          <div className={styles.header}>Upgrades</div>
          <div className={styles.upgrades}>
            <div className={styles.description}>
              You gain experience every time you cast a spell. The type and amount of XP you gain depends on the number
              of incantations and the spell&apos;s school of magic.
            </div>
            <Experience onClick={selectAbjuration} school='Abjuration' total={0} spent={0} />
            <Experience onClick={selectConjuration} school='Conjuration' total={13150} spent={13000} />
            <Experience onClick={selectEvocation} school='Evocation' total={24580} spent={23000} />
            <Experience onClick={selectTransmutation} school='Transmutation' total={7750} spent={4000} />
          </div>
        </div>
        <div>
          <button className={styles.close} onClick={closePanel}>
            Close &gt;
          </button>
        </div>
      </div>
    </>
  );
};
