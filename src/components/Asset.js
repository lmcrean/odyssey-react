import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && <Spinner animation="border" className={styles.AssetSpinner} />}
      {src && <img src={src} alt={message} />}
      {message && <p className={`mt-4 ${styles.AssetUpload}`}>{message}</p>}
    </div>
  );
};

export default Asset;
