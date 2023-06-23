import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Knight extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {
        const currentSquare = board.findPiece(this);
        
        const validMoves = [];

        const dirs = [-2, -1, 1, 2];

        for (const rowDir of dirs) {
            for (const colDir of dirs) {
                if (Math.abs(rowDir) !== Math.abs(colDir)) {
                    let [newRow, newCol] = [currentSquare.row + rowDir, currentSquare.col + colDir];
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        const newSquare = Square.at(newRow, newCol);
                        const pieceOnSquare = board.getPiece(newSquare);
                        if (!pieceOnSquare || this.canTakePiece(pieceOnSquare)) {
                            validMoves.push(newSquare);
                        }
                    }
                }
            }
        }

        return validMoves;
    }
}
