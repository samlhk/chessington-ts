import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Piece {
    public player: Player;

    public constructor(player: Player) {
        this.player = player;
    }

    public getAvailableMoves(board: Board): Square[] {
        throw new Error('This method must be implemented, and return a list of available moves');
    }

    public moveTo(board: Board, newSquare: Square) {
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
    }

    public canTakePiece(otherPiece: Piece): boolean {
        return this.player !== otherPiece.player && otherPiece.constructor.name !== "King";
    }

    protected getValidMovesInDirection(board: Board, start: Square, rowDir: number, colDir: number): Square[] {
        const validMoves = [];

        let [newRow, newCol] = [start.row + rowDir, start.col + colDir];
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newSquare = Square.at(newRow, newCol);
            const pieceOnSquare = board.getPiece(newSquare);
            if (pieceOnSquare) {
                if (this.canTakePiece(pieceOnSquare)) {
                    validMoves.push(newSquare);
                }
                break;
            }
            validMoves.push(newSquare);
            newRow += rowDir;
            newCol += colDir;
        }

        return validMoves;
    }
}
