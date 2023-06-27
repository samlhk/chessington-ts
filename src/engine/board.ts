import Player from './player';
import GameSettings from './gameSettings';
import Square from './square';
import Piece from './pieces/piece';
import Pawn from './pieces/pawn';
import PieceType from './pieceType';
import King from './pieces/king';
import Rook from './pieces/rook';
import Queen from './pieces/queen';

export default class Board {
    public currentPlayer: Player;
    private readonly board: (Piece | undefined)[][];
    public turnCount: number;

    public constructor(currentPlayer?: Player) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = this.createBoard();
        this.turnCount = 1;
    }

    public setPiece(square: Square, piece: Piece | undefined) {
        this.board[square.row][square.col] = piece;
    }

    public getPiece(square: Square) {
        return this.board[square.row][square.col];
    }

    public findPiece(pieceToFind: Piece) {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === pieceToFind) {
                    return Square.at(row, col);
                }
            }
        }
        throw new Error('The supplied piece is not on the board');
    }

    public movePiece(fromSquare: Square, toSquare: Square) {
        let movingPiece = this.getPiece(fromSquare);
        if (
            !!movingPiece
            && movingPiece.player === this.currentPlayer
        ) {
            if (movingPiece.pieceType === PieceType.PAWN) {
                this.recordIfPawnAdvancingTwoSquares(movingPiece, fromSquare, toSquare);
                this.removePieceIfEnPassantCapture(fromSquare, toSquare);
                if (Pawn.isFinalRow(toSquare)) {
                    movingPiece = new Queen(this.currentPlayer);
                }
            } else if (movingPiece.pieceType === PieceType.KING) {
                (movingPiece as King).hasMoved = true;
                this.moveRookIfCastling(fromSquare, toSquare);
            } else if (movingPiece.pieceType === PieceType.ROOK) {
                (movingPiece as Rook).hasMoved = true;
            }
            this.setPiece(toSquare, movingPiece);
            this.setPiece(fromSquare, undefined);
            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);
            this.turnCount++;
        }
    }

    private createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }

    private recordIfPawnAdvancingTwoSquares(movingPiece: Piece, fromSquare: Square, toSquare: Square) {
        if (Math.abs(toSquare.row - fromSquare.row) === 2) {
            (movingPiece as Pawn).roundAdvancingTwoSquares = this.turnCount;
        }
    }

    private removePieceIfEnPassantCapture(fromSquare: Square, toSquare: Square) {
        if (Math.abs(toSquare.row - fromSquare.row) === 1 && Math.abs(toSquare.col - fromSquare.col) === 1 && !this.getPiece(toSquare)) {
            this.setPiece(Square.at(fromSquare.row, toSquare.col), undefined);
        }
    }

    private moveRookIfCastling(fromSquare: Square, toSquare: Square) {
        const colDelta = toSquare.col - fromSquare.col;
        if (colDelta === -2) {
            const leftRook = this.getPiece(Square.at(fromSquare.row, 0));
            this.setPiece(Square.at(fromSquare.row, 3), leftRook);
            this.setPiece(Square.at(fromSquare.row, 0), undefined);
        } else if (colDelta === 2) {
            const rightRook = this.getPiece(Square.at(fromSquare.row, 7));
            this.setPiece(Square.at(fromSquare.row, 5), rightRook);
            this.setPiece(Square.at(fromSquare.row, 7), undefined);
        }
    }
}
