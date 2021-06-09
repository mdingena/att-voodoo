import styles from './Logo.module.css';
import logo from '@/images/Voodoo.png';
import smallGem1 from '@/images/small-gem-1.png';
import smallGem2 from '@/images/small-gem-2.png';
import glow from '@/images/glow.png';
import particles from '@/images/particles.png';
import { Event } from 'electron/renderer';

type ImageOnLoadEvent = { currentTarget: HTMLImageElement };

const reveal = ({ currentTarget }: ImageOnLoadEvent) => (currentTarget.style.opacity = '1');

export const Logo = () => (
  <div className={styles.root}>
    <div className={styles.illumination}>
      <div className={styles.shadow}></div>
    </div>

    <div className={styles.pivot}>
      <div className={styles.gems}>
        <img className={styles.smallGem1} src={smallGem1} alt='' onLoad={reveal} />
        <img className={styles.smallGem2} src={smallGem2} alt='' onLoad={reveal} />
      </div>
      <img className={styles.logo} src={logo} alt='Voodoo logo' onLoad={reveal} />
      <img className={styles.glow} src={glow} alt='' onLoad={reveal} />
      <div className={styles.particles}>
        <img src={particles} alt='' onLoad={reveal} />
        <img src={particles} alt='' onLoad={reveal} />
        <img src={particles} alt='' onLoad={reveal} />
        <img src={particles} alt='' onLoad={reveal} />
      </div>
    </div>
  </div>
);
