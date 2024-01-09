import React from "react";
import { CellStyles } from "../ts/cell";
import "./CellNode.css";

export const CellNode = ({
  cellStyles,
  row,
  col,
  onClick,
}: {
  cellStyles: CellStyles;
  row: number;
  col: number;
  onClick: (row: number, col: number, style?: CellStyles) => void;
}) => {
  const styles = `cell ${cellStyles}`;

  const handleDivClick = () => {
    onClick(row, col);
  };

  return (
    <>
      <div className={styles} onClick={handleDivClick}></div>
    </>
  );
};
