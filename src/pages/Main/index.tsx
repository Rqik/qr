import { FC } from 'react';

import QRScanner from '@/components/QRScanner';

import styles from './Main.module.scss';

interface MainProps {}

const Main: FC<MainProps> = (props) => (
  <div className={styles.main}>
    <QRScanner />
  </div>
);

export default Main;
