import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Bishop extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {

        const currentSquare = board.findPiece(this);
        
        const validMoves = [];

        const dirs = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
        for (const [rowDir, colDir] of dirs) {
            let [newRow, newCol] = [currentSquare.row + rowDir, currentSquare.col + colDir];
            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                validMoves.push(Square.at(newRow, newCol));
                newRow += rowDir;
                newCol += colDir;
            }
        }

        return validMoves;
    }
}
