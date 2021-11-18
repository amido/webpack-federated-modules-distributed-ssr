import React from "react";
import { env } from "process";

import styles from "./paragraph.module.css";
const port = typeof window !== undefined ? env?.PORT : "";
export default ({ children }) => {
  console.log("I am the paragraph rendered on ", port);
  return (
    <p onClick={() => alert("hola mama")} className={styles.paragraph}>
      {children}
    </p>
  );
};
