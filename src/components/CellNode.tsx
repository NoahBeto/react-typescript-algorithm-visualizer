import { CellType } from "../ts/enums/cell.enums";
import "./CellNode.css";

export const CellNode = ({
  cellType,
  row,
  col,
  onMouseDown,
  _onMouseEnter,
}: {
  cellType: CellType;
  row: number;
  col: number;
  onMouseDown: (row: number, col: number, style?: CellType) => void;
  _onMouseEnter: (row: number, col: number) => void;
}) => {
  const styles = `cell ${cellType}`;

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
