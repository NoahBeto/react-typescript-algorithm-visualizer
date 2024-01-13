import { CellStyles } from "../ts/cell";
import "./CellNode.css";

export const CellNode = ({
  cellStyles,
  row,
  col,
  onMouseDown,
  _onMouseEnter,
}: {
  cellStyles: CellStyles;
  row: number;
  col: number;
  onMouseDown: (row: number, col: number, style?: CellStyles) => void;
  _onMouseEnter: (row: number, col: number) => void;
}) => {
  const styles = `cell ${cellStyles}`;

  const handleDivClick = () => {
    onMouseDown(row, col);
  };

  const handleMouseEnter = () => {
    _onMouseEnter(row, col);
  };

  return (
    <>
      <div
        className={styles}
        onMouseDown={handleDivClick}
        onMouseEnter={handleMouseEnter}
      ></div>
    </>
  );
};
