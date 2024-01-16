import { ECellType } from "../ts/enums/cell.enums";
import "./CellNode.css";

export const CellNode = ({
  cellType,
  row,
  col,
  onMouseDown,
  _onMouseEnter,
}: {
  cellType: ECellType;
  row: number;
  col: number;
  onMouseDown: (row: number, col: number, style?: ECellType) => void;
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
