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

        let endOfBoardRow, oneStep, twoStep, initialRow;
        if (this.player === Player.WHITE) {
            endOfBoardRow = 7;
            oneStep = 1;
            twoStep = 2;
            initialRow = 1;
        } else {
            endOfBoardRow = 0;
            oneStep = -1;
            twoStep = -2;
            initialRow = 6;
        }
        
        const validMoves: Square[] = [];

        if (currentSquare.row === endOfBoardRow) return validMoves;

        let nextSquare = Square.at(currentSquare.row + oneStep, currentSquare.col);
        if (board.getPiece(nextSquare)) return validMoves;

        validMoves.push(nextSquare);

        if (currentSquare.row === initialRow) {
            nextSquare = Square.at(currentSquare.row + twoStep, currentSquare.col);
            if (board.getPiece(nextSquare)) return validMoves;
            
            validMoves.push(nextSquare);
        }

        return validMoves;
    }
}
