import { EGenericCellType } from "../ts/types/GenericCell.types";
import "./CellNode.css";

export const CellNode = ({
  cellType,
  row,
  col,
  onMouseDown,
  _onMouseEnter,
}: {
  cellType: EGenericCellType;
  row: number;
  col: number;
  onMouseDown: (row: number, col: number, style?: EGenericCellType) => void;
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
