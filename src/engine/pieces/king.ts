import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class King extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {
        const currentSquare = board.findPiece(this);
        
        const validMoves = [];

        const dirs = [-1, 0, 1];

        for (const rowDir of dirs) {
            for (const colDir of dirs) {
                if (rowDir === 0 && colDir === 0) continue;
                let [newRow, newCol] = [currentSquare.row + rowDir, currentSquare.col + colDir];
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    validMoves.push(Square.at(newRow, newCol));
                }
            }
        }

        return validMoves;
    }
}
