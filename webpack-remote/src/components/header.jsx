import React from "react";
import { env } from "process";

import styles from "./header.module.css";
const port = typeof window !== undefined ? env?.PORT : "";
export default ({ children }) => {
  console.log("I am the header rendered on ", port);

  return (
    <header onClick={() => alert("ciao mamma")} className={styles.header}>
      {children}
    </header>
  );
};
