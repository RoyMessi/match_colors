const { RULE_MINIMUE_MATCHED_BOXES } = APP_SETTINGS;
import { BoardMatrix } from "./board_matrix";

function _sequenceFilter(arr, search) {
  let lastIndex = -1;
  return arr.reduce((total, itemValue, index) => {
    if (total >= RULE_MINIMUE_MATCHED_BOXES) {
      return total;
    }

    if (lastIndex + 1 === index && itemValue === search) {
      ++total;
    } else {
      total = 0;
    }
    lastIndex = index;
    return total;
  }, 0);
}

export function isBoxMovementAllowed(active, target) {
  let row;
  let column;
  let oppositeColumn;
  let oppositeRow;
  let boxValue;
  let boxValueOpposite;

  function _moveOnYAxisMatchXAxis() {
    // Direction: Bottom to Top
    if (target.row < active.row) {
      row = target.row;
      column = target.column;
      oppositeRow = active.row;
      oppositeColumn = active.column;
      boxValue = BoardMatrix.getValue(active.row, active.column);
      boxValueOpposite = BoardMatrix.getValue(target.row, target.column);
    }

    // Direction: Top to Bottom
    else {
      row = active.row;
      column = active.column;
      oppositeRow = target.row;
      oppositeColumn = target.column;
      boxValue = BoardMatrix.getValue(target.row, target.column);
      boxValueOpposite = BoardMatrix.getValue(active.row, active.column);
    }

    if (boxValue === boxValueOpposite) {
      return false;
    }

    const activeRow = [...[], ...BoardMatrix.getRow(oppositeRow)];
    const targetRow = [...[], ...BoardMatrix.getRow(row)];

    activeRow[column] = BoardMatrix.getValue(row, column);
    targetRow[column] = BoardMatrix.getValue(oppositeRow, oppositeColumn);

    const option1 = _sequenceFilter(activeRow, boxValueOpposite);
    const option2 = _sequenceFilter(targetRow, boxValue);
    const boxInTop = _sequenceFilter(
      [BoardMatrix.getValue(oppositeRow + 1, column), BoardMatrix.getValue(oppositeRow + 2, column), boxValueOpposite],
      boxValueOpposite
    );
    const boxInBottom = _sequenceFilter(
      [BoardMatrix.getValue(row - 1, column), BoardMatrix.getValue(row - 2, column), boxValue],
      boxValue
    );

    return (
      option1 >= RULE_MINIMUE_MATCHED_BOXES ||
      option2 >= RULE_MINIMUE_MATCHED_BOXES ||
      boxInTop >= RULE_MINIMUE_MATCHED_BOXES ||
      boxInBottom >= RULE_MINIMUE_MATCHED_BOXES
    );
  }

  function _moveOnXAxisMatchYAxis() {
    // Direction: Right to Left
    if (target.column < active.column) {
      row = target.row;
      column = target.column;
      oppositeRow = active.row;
      oppositeColumn = active.column;
      boxValue = BoardMatrix.getValue(active.row, active.column);
      boxValueOpposite = BoardMatrix.getValue(target.row, target.column);
    }
    // Direction: Left to Right
    else {
      row = active.row;
      column = active.column;
      oppositeRow = target.row;
      oppositeColumn = target.column;
      boxValue = BoardMatrix.getValue(target.row, target.column);
      boxValueOpposite = BoardMatrix.getValue(active.row, active.column);
    }

    if (boxValue === boxValueOpposite) {
      return false;
    }

    const activeRow = [...[], ...BoardMatrix.getRow(row)];
    const prevRow = [...[], ...BoardMatrix.getRow(row - 1)];
    const nextRow = [...[], ...BoardMatrix.getRow(row + 1)];

    activeRow[column] = boxValue;
    activeRow[oppositeColumn] = boxValueOpposite;

    const boxInMiddle = _sequenceFilter([prevRow[column], nextRow[column], boxValue], boxValue);
    const boxInMiddleOpposite = _sequenceFilter(
      [prevRow[oppositeColumn], nextRow[oppositeColumn], boxValueOpposite],
      boxValueOpposite
    );
    const boxInTop = _sequenceFilter(
      [BoardMatrix.getValue(row + 1, column), BoardMatrix.getValue(row + 2, column), boxValue],
      boxValue
    );
    const boxInTopOpposite = _sequenceFilter(
      [BoardMatrix.getValue(row + 1, oppositeColumn), BoardMatrix.getValue(row + 2, oppositeColumn), boxValueOpposite],
      boxValueOpposite
    );
    const boxSameRowLTR = _sequenceFilter(
      [BoardMatrix.getValue(row, oppositeColumn + 1), BoardMatrix.getValue(row, oppositeColumn + 2), boxValueOpposite],
      boxValueOpposite
    );
    const boxInBottomRTL = _sequenceFilter(
      [BoardMatrix.getValue(row, column - 1), BoardMatrix.getValue(row, column - 2), boxValue],
      boxValue
    );
    const boxInBottom = _sequenceFilter(
      [BoardMatrix.getValue(row - 1, column), BoardMatrix.getValue(row - 2, column), boxValue],
      boxValue
    );
    const boxInBottomOpposite = _sequenceFilter(
      [
        BoardMatrix.getValue(oppositeRow - 1, oppositeColumn),
        BoardMatrix.getValue(oppositeRow - 2, oppositeColumn),
        boxValueOpposite,
      ],
      boxValueOpposite
    );

    return (
      boxInMiddle >= RULE_MINIMUE_MATCHED_BOXES ||
      boxInMiddleOpposite >= RULE_MINIMUE_MATCHED_BOXES ||
      boxInTop >= RULE_MINIMUE_MATCHED_BOXES ||
      boxInTopOpposite >= RULE_MINIMUE_MATCHED_BOXES ||
      boxSameRowLTR >= RULE_MINIMUE_MATCHED_BOXES ||
      boxInBottomRTL >= RULE_MINIMUE_MATCHED_BOXES ||
      boxInBottom >= RULE_MINIMUE_MATCHED_BOXES ||
      boxInBottomOpposite >= RULE_MINIMUE_MATCHED_BOXES
    );
  }

  if (!BoardMatrix.isSwitchBoxesEnabled()) {
    return false;
  }

  return active.row !== target.row ? _moveOnYAxisMatchXAxis() : _moveOnXAxisMatchYAxis();
}
