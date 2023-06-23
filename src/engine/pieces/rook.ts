import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Rook extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {

        const currentSquare = board.findPiece(this);

        const validMoves = [];

        const dirs = [-1, 1];
        for (const dir of dirs) {
            let newRow = currentSquare.row + dir;
            while (newRow >= 0 && newRow < 8) {
                const newSquare = Square.at(newRow, currentSquare.col)
                if (board.getPiece(newSquare)) break;
                validMoves.push(newSquare);
                newRow += dir;
            }
            let newCol = currentSquare.col + dir;
            while (newCol >= 0 && newCol < 8) {
                const newSquare = Square.at(currentSquare.row, newCol)
                if (board.getPiece(newSquare)) break;
                validMoves.push(newSquare);
                newCol += dir;
            }
        }

        return validMoves;
    }
}
