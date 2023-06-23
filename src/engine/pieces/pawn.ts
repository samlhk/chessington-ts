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
        
        const validMoves: Square[] = [];

        let nextSquare = Square.at(currentSquare.row + (this.player === Player.WHITE ? 1 : -1), currentSquare.col);
        if (board.getPiece(nextSquare)) return validMoves;

        validMoves.push(nextSquare);

        if (
            this.player == Player.WHITE && currentSquare.row === 1
            || this.player === Player.BLACK && currentSquare.row === 6
        ) {
            nextSquare = Square.at(currentSquare.row + (this.player === Player.WHITE ? 2 : -2), currentSquare.col);
            if (board.getPiece(nextSquare)) return validMoves;
            
            validMoves.push(nextSquare);
        }

        return validMoves;
    }
}
