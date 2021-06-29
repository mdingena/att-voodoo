import { useAtom } from 'jotai';
import { Panel, panelAtom } from '@/atoms';
import styles from './UpgradesPanel.module.css';

export const UpgradesPanel = (): JSX.Element => {
  const [panel, setPanel] = useAtom(panelAtom);

  const closePanel = () => {
    setPanel(Panel.None);
  };

  const isOpen = panel === Panel.Upgrades;

  return (
    <div className={isOpen ? styles.open : styles.closed}>
      <div>Upgrades</div>
      <div>
        <button className={styles.close} onClick={closePanel}>
          Close -&gt;
        </button>
      </div>
    </div>
  );
};
