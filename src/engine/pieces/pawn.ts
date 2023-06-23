import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Pawn extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {

        const currentSquare = board.findPiece(this);
        
        const validMoves = [];
        validMoves.push(Square.at(currentSquare.row + (this.player === Player.WHITE ? 1 : -1), currentSquare.col));

        if (
            this.player == Player.WHITE && currentSquare.row === 1
            || this.player === Player.BLACK && currentSquare.row === 6
        ) {
            validMoves.push(Square.at(currentSquare.row + (this.player === Player.WHITE ? 2 : -2), currentSquare.col));
        }

        return validMoves;
    }
}
