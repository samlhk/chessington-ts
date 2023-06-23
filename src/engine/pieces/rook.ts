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

        for (let i = 0; i < 8; i++) {
            if (currentSquare.col !== i) {
                validMoves.push(Square.at(currentSquare.row, i));
            }
        }

        for (let i = 0; i < 8; i++) {
            if (currentSquare.row !== i) {
                validMoves.push(Square.at(i, currentSquare.col));
            }
        }

        return validMoves;
    }
}
