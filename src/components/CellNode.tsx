import React from "react";
import { CellStyles } from "../ts/cell";
import "./CellNode.css";

export const CellNode = ({ cellStyles }: { cellStyles: CellStyles }) => {
  const styles = `cell ${cellStyles}`;

  return (
    <>
      <div className={styles}></div>
    </>
  );
};
