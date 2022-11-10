import { FC, useState } from 'react';
import { QrReader } from 'react-qr-reader';

import styles from './App.module.scss';

const App: FC = (props) => {
  const [data, setData] = useState('No result');

  return (
    <div className={styles.app}>
      <input type="file" accept="image/*" />
      <QrReader
        onResult={(result, error) => {
          if (result) {
            console.log(result);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (result?.text) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              setData(result.text);
            }
          }

          if (error) {
            console.info(error);
          }
        }}
        scanDelay={500}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        style={{ width: '200px', heigth: '100px' }}
        className={styles.qr}
        constraints={{ facingMode: 'user' }}
      />
    </div>
  );
};

export default App;
