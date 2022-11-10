import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Select from 'react-select';
import { Html5QrcodeResult } from 'html5-qrcode/esm/core';

import styles from './QRScanner.module.scss';

const ViewFinder2 = (): JSX.Element => <div>22</div>;

type FaceMode = 'user' | 'environment';
type SelectOption = {
  value: string;
  label: string;
};

const qrReaderId = 'reader';
const qrReaderId2 = 'reader2';
const modeOption = [
  { value: 'camera', label: 'Camera' },
  { value: 'file', label: 'File' },
];
const config = {
  fps: 10, // Optional, frame per seconds for qr code scanning
  qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
};

const QRScanner: FC = (props) => {
  const [data, setData] = useState<string | null>('No result');
  const [error, setError] = useState<string | null>('No result');

  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [camers, setCamers] = useState<SelectOption[]>([]);
  const [cameraId, setCameraId] = useState<string>('');

  const qrCodeSuccessCallback = (
    decodedText: string,
    decodedResult: Html5QrcodeResult
  ): void => {
    setError(null);
    setData(decodedText);
    console.log(decodedResult);
  };
  const qrCodeErrorCallback = (errorMessage: string): void => {
    setError(`qrCodeErrorCallback ${errorMessage}`);
  };

  useEffect(() => {
    const html5QrCode2 = new Html5Qrcode(qrReaderId);
    setHtml5QrCode(html5QrCode2);

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setError(null);
          setCameraId(devices[0].id);
          setCamers(() =>
            devices.map(({ id, label }) => ({ value: id, label }))
          );
        }
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  useEffect(() => {
    if (html5QrCode !== null) {
      html5QrCode
        .start(cameraId, config, qrCodeSuccessCallback, qrCodeErrorCallback)
        .catch((err) => {
          setError(`useEffect ${err}`);
        });
    }
    return () => {
      if (html5QrCode !== null) {
        html5QrCode.stop();
      }
    };
  }, [cameraId]);

  return (
    <div className={styles.qrScanner}>
      <h1 className={(styles.headline, styles.headlineMain)}>Qr scanner 1</h1>
      {data && <span className={styles.result}>{data}</span>}

      {error && (
        <div className={styles.error}>
          <h3 className={styles.headline}>Error</h3>
          {error}
        </div>
      )}
      <div id={qrReaderId} className={styles.reader} />
      <div className={styles.control}>
        <h2 className={styles.headline}>Select camera</h2>
        <Select
          options={camers}
          className={styles.select}
          onChange={(value) => {
            if (value?.value) {
              setError(null);
              setData(null);
              setCameraId(value?.value);
            }
          }}
        />
      </div>
      <div id={qrReaderId2} className={styles.reader} />
      <input
        type="file"
        id="qr-input-file"
        accept="image/*"
        capture
        onChange={(e) => {
          if (e.target?.files?.length === 0) {
            // No file selected, ignore
            return;
          }
          const html5QrCode2 = new Html5Qrcode(qrReaderId2);
          const imageFile = e.target.files?.[0];
          // Scan QR Code
          if (html5QrCode2 !== null && imageFile) {
            html5QrCode2
              .scanFile(imageFile, true)
              .then((decodedText) => {
                // success, use decodedText
                setError(null);
                setData(decodedText);
              })
              .catch((err) => {
                // failure, handle it.
                setError(`Error scanning file. Reason: ${err}`);
              });
          }
        }}
      />
    </div>
  );
};

export default QRScanner;
