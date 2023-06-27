import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Pawn extends Piece {
    public roundAdvancingTwoSquares: number = -1;

    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board): Square[] {

        const currentSquare = board.findPiece(this);

        let endOfBoardRow, oneStep, twoStep, initialRow;
        if (this.player === Player.WHITE) {
            endOfBoardRow = 7, oneStep = 1, twoStep = 2, initialRow = 1;
        } else {
            endOfBoardRow = 0, oneStep = -1, twoStep = -2, initialRow = 6;
        }

        const validMoves: Square[] = [];

        if (currentSquare.row === endOfBoardRow) return validMoves;

        const adjacentSquares = [
            Square.at(currentSquare.row, currentSquare.col - 1),
            Square.at(currentSquare.row, currentSquare.col + 1),
        ];
        for (const adjacent of adjacentSquares) {
            if (adjacent.col >= 0 && adjacent.col < 8) {
                const pieceOnSquare = board.getPiece(adjacent);
                if (pieceOnSquare && pieceOnSquare instanceof Pawn && (board.turnCount - (pieceOnSquare as Pawn).roundAdvancingTwoSquares) === 1) {
                    validMoves.push(Square.at(adjacent.row + oneStep, adjacent.col));
                }
            }
        }

        const diagonalSquares = [
            Square.at(currentSquare.row + oneStep, currentSquare.col - 1),
            Square.at(currentSquare.row + oneStep, currentSquare.col + 1),
        ];
        for (const diagonal of diagonalSquares) {
            if (diagonal.col >= 0 && diagonal.col < 8) {
                const pieceOnSquare = board.getPiece(diagonal);
                if (pieceOnSquare && this.canTakePiece(pieceOnSquare)) {
                    validMoves.push(diagonal);
                }
            }
        }

        const forwardOneSquare = Square.at(currentSquare.row + oneStep, currentSquare.col);
        if (board.getPiece(forwardOneSquare)) return validMoves;

        validMoves.push(forwardOneSquare);

        if (currentSquare.row === initialRow) {
            const forwardTwoSquares = Square.at(currentSquare.row + twoStep, currentSquare.col);
            if (board.getPiece(forwardTwoSquares)) return validMoves;

            validMoves.push(forwardTwoSquares);
        }

        return validMoves;
    }
}
