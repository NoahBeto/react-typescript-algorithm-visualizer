import { CellStyles } from "../ts/cell";
import "./CellNode.css";

export const CellNode = ({
  cellStyles,
  row,
  col,
  onClick,
  _onMouseEnter,
}: {
  cellStyles: CellStyles;
  row: number;
  col: number;
  onClick: (row: number, col: number, style?: CellStyles) => void;
  _onMouseEnter: (row: number, col: number) => void;
}) => {
  const styles = `cell ${cellStyles}`;

  const handleDivClick = () => {
    onClick(row, col);
  };

  const handleMouseEnter = () => {
    _onMouseEnter(row, col);
  };

  return (
    <>
      <div
        className={styles}
        onClick={handleDivClick}
        onMouseEnter={handleMouseEnter}
      ></div>
    </>
  );
};
