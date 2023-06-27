import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';
import PieceType from '../pieceType';
import Rook from './rook';

export default class King extends Piece {
    public hasMoved = false;

    public constructor(player: Player) {
        super(player);
        this.pieceType = PieceType.KING;
    }

    public getAvailableMoves(board: Board): Square[] {
        const currentSquare = board.findPiece(this);

        const validMoves: Square[] = [];

        const directions = [-1, 0, 1];

        for (const rowDir of directions) {
            for (const colDir of directions) {
                if (rowDir === 0 && colDir === 0) continue;
                validMoves.push(...this.getValidMovesInDirectionForOneStep(board, currentSquare, rowDir, colDir));
            }
        }

        validMoves.push(...this.getAvailableCastlingMoves(board, currentSquare));
        
        return validMoves;
    }

    private getAvailableCastlingMoves(board: Board, currentSquare: Square) {
        const validMoves: Square[] = [];
        
        if (!this.hasMoved) {
            if (this.validateCastlingLeft(board, currentSquare)) {
                validMoves.push(Square.at(currentSquare.row, 2));
            }

            if (this.validateCastlingRight(board, currentSquare)) {
                validMoves.push(Square.at(currentSquare.row, 6));
            }
        }

        return validMoves;
    }

    private validateCastlingLeft(board: Board, currentSquare: Square): boolean {
        return this.validateCastlingMove(board, currentSquare, true);
    }

    private validateCastlingRight(board: Board, currentSquare: Square): boolean {
        return this.validateCastlingMove(board, currentSquare, false);
    }

    private validateCastlingMove(board: Board, currentSquare: Square, leftSide: boolean): boolean {
        const possibleRook = board.getPiece(Square.at(currentSquare.row, leftSide ? 0 : 7));
        const intermediatePositions = leftSide ? [3, 2, 1] : [5, 6];

        return possibleRook?.pieceType === PieceType.ROOK
            && !(possibleRook as Rook).hasMoved
            && intermediatePositions.every((col) => !board.getPiece(Square.at(currentSquare.row, col)));
    }
}
