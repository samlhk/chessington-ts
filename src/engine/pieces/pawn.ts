import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';
import PieceType from '../pieceType';

export default class Pawn extends Piece {
    public roundAdvancingTwoSquares: number = -1;

    public constructor(player: Player) {
        super(player);
        this.pieceType = PieceType.PAWN;
    }

    public static isFinalRow(square: Square) {
        return square.row === 0 || square.row === 7;
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

        validMoves.push(...this.getDiagonalCaptureMoves(board, currentSquare, oneStep));
        validMoves.push(...this.getEnPassantCaptureMoves(board, currentSquare, oneStep));

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

    private getDiagonalCaptureMoves(board: Board, currentSquare: Square, oneForwardStep: number): Square[] {
        return this.getAvailableCaptureMoves(board, currentSquare, oneForwardStep, false);
    }

    private getEnPassantCaptureMoves(board: Board, currentSquare: Square, oneForwardStep: number): Square[] {
        return this.getAvailableCaptureMoves(board, currentSquare, oneForwardStep, true);
    }

    private getAvailableCaptureMoves(board: Board, currentSquare: Square, oneForwardStep: number, enPassantMoves: boolean): Square[] {
        const validMoves: Square[] = [];

        const capturablePositions = [
            Square.at(currentSquare.row + (enPassantMoves ? 0 : oneForwardStep), currentSquare.col - 1),
            Square.at(currentSquare.row + (enPassantMoves ? 0 : oneForwardStep), currentSquare.col + 1),
        ];
        for (const pos of capturablePositions) {
            if (pos.col >= 0 && pos.col < 8) {
                const pieceOnSquare = board.getPiece(pos);
                if (pieceOnSquare) {
                    if (enPassantMoves && this.enPassantIsValid(board.turnCount, pieceOnSquare)) {
                        validMoves.push(Square.at(pos.row + oneForwardStep, pos.col));
                    } else if (this.canTakePiece(pieceOnSquare)) {
                        validMoves.push(pos);
                    }
                }
            }
        }

        return validMoves;
    }

    private enPassantIsValid(turnCount: number, pieceOnSquare: Piece) {
        return pieceOnSquare.pieceType === PieceType.PAWN
            && (turnCount - (pieceOnSquare as Pawn).roundAdvancingTwoSquares) === 1;
    }

}
