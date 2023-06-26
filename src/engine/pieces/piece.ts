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

    protected getValidMovesInDirectionUntilBoundary(board: Board, start: Square, rowDir: number, colDir: number): Square[] {
        return this.getValidMovesInDirection(board, start, rowDir, colDir, false);
    }

    protected getValidMovesInDirectionForOneStep(board: Board, start: Square, rowDir: number, colDir: number): Square[] {
        return this.getValidMovesInDirection(board, start, rowDir, colDir, true);
    }

    private getValidMovesInDirection(board: Board, start: Square, rowDir: number, colDir: number, moveMaxOneStep: boolean = false): Square[] {
        const validMoves = [];

        const isWithinBoundaries = this.getBoundaryChecker(rowDir, colDir);

        let [newRow, newCol] = [start.row + rowDir, start.col + colDir];
        while (isWithinBoundaries(newRow, newCol)) {
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
            
            if (moveMaxOneStep) break;
        }

        return validMoves;
    }

    private getBoundaryChecker(rowDir: number, colDir: number): (r: number, c: number) => boolean {
        if (rowDir === 0) {
            return (r: number, c: number) => c >= 0 && c < 8;
        } else if (colDir === 0) {
            return (r: number, c: number) => r >= 0 && r < 8;
        } else {
            return (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
        }
    }
}
