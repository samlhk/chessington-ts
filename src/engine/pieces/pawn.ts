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

        const oneStep = Square.at(currentSquare.row + (this.player === Player.WHITE ? 1 : -1), currentSquare.col);

        return [oneStep];
    }
}
