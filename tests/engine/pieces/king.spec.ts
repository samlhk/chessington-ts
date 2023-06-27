import King from '../../../src/engine/pieces/king';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Pawn from '../../../src/engine/pieces/pawn';
import Rook from '../../../src/engine/pieces/rook';
import { assert } from 'chai';
import Knight from '../../../src/engine/pieces/knight';
import Queen from '../../../src/engine/pieces/queen';

describe('King', () => {
    let board: Board;
    beforeEach(() => board = new Board());

    it('can move to adjacent squares', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [
            Square.at(2, 3), Square.at(2, 4), Square.at(2, 5), Square.at(3, 5),
            Square.at(4, 5), Square.at(4, 4), Square.at(4, 3), Square.at(3, 3)
        ];

        moves.should.deep.include.members(expectedMoves);
    });

    it('cannot make any other moves', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(8);
    });

    it('cannot leave the board', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(0, 0), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [Square.at(0, 1), Square.at(1, 1), Square.at(1, 0)];

        moves.should.have.deep.members(expectedMoves);
    });

    it('can take opposing pieces', () => {
        const king = new King(Player.WHITE);
        const opposingPiece = new Pawn(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.deep.include(Square.at(5, 5));
    });

    it('cannot take the opposing king', () => {
        const king = new King(Player.WHITE);
        const opposingKing = new King(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingKing);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it('cannot take friendly pieces', () => {
        const king = new King(Player.WHITE);
        const friendlyPiece = new Pawn(Player.WHITE);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), friendlyPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    describe('castling', () => {
        describe('white king', () => {
            let king: King;
            let leftRook: Rook;
            let rightRook: Rook;
            beforeEach(() => {
                board = new Board(Player.WHITE);
                king = new King(Player.WHITE);
                board.setPiece(Square.at(0, 4), king);
                leftRook = new Rook(Player.WHITE);
                board.setPiece(Square.at(0, 0), leftRook);
                rightRook = new Rook(Player.WHITE);
                board.setPiece(Square.at(0, 7), rightRook);
            });

            it('king can castle king side', () => {        
                const moves = king.getAvailableMoves(board);
                moves.should.deep.include(Square.at(0, 6));
            });

            it('rook moves when castling king side', () => {     
                board.movePiece(Square.at(0, 4), Square.at(0, 6));
                assert(board.getPiece(Square.at(0, 5)) === rightRook);
            });

            it('king can castle queen side', () => {        
                const moves = king.getAvailableMoves(board);
                moves.should.deep.include(Square.at(0, 2));
            });

            it('rook moves when castling queen side', () => {     
                board.movePiece(Square.at(0, 4), Square.at(0, 2));
                assert(board.getPiece(Square.at(0, 3)) === leftRook);
            });

            it('king cannot castle if king has moved before', () => {   
                const blackDummy = new King(Player.BLACK);
                board.setPiece(Square.at(7, 7), blackDummy);

                board.movePiece(Square.at(0, 4), Square.at(1, 4));
                board.movePiece(Square.at(7, 7), Square.at(7, 6));
                board.movePiece(Square.at(1, 4), Square.at(0, 4));
                board.movePiece(Square.at(7, 6), Square.at(7, 5));
                
                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 6));
                moves.should.not.deep.include(Square.at(0, 2));
            });

            it('king cannot castle king side if right rook has moved before', () => {   
                const blackDummy = new King(Player.BLACK);
                board.setPiece(Square.at(7, 7), blackDummy);

                board.movePiece(Square.at(0, 7), Square.at(0, 6));
                board.movePiece(Square.at(7, 7), Square.at(7, 6));
                board.movePiece(Square.at(0, 6), Square.at(0, 7));
                board.movePiece(Square.at(7, 6), Square.at(7, 5));
                
                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 6));
            });

            it('king cannot castle queen side if left rook has moved before', () => {   
                const blackDummy = new King(Player.BLACK);
                board.setPiece(Square.at(7, 7), blackDummy);

                board.movePiece(Square.at(0, 0), Square.at(0, 1));
                board.movePiece(Square.at(7, 7), Square.at(7, 6));
                board.movePiece(Square.at(0, 1), Square.at(0, 0));
                board.movePiece(Square.at(7, 6), Square.at(7, 5));
                
                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 2));
            });

            it('king cannot castle king side if there is a piece in between', () => {
                const knight = new Knight(Player.WHITE);
                board.setPiece(Square.at(0, 6), knight);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 6));
            });

            it('king cannot castle queen side if there is a piece in between', () => {
                const knight = new Knight(Player.WHITE);
                board.setPiece(Square.at(0, 1), knight);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 2));
            });

            it('king cannot castle if in check', () => {
                const blackQueen = new Queen(Player.BLACK);
                board.setPiece(Square.at(7, 4), blackQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 2));
                moves.should.not.deep.include(Square.at(0, 6));
            });

            it('king cannot castle king side if intermediate position in check', () => {
                const blackQueen = new Queen(Player.BLACK);
                board.setPiece(Square.at(7, 5), blackQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 6));
            });

            it('king cannot castle king side if end position in check', () => {
                const blackQueen = new Queen(Player.BLACK);
                board.setPiece(Square.at(7, 6), blackQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 6));
            });

            it('king cannot castle queen side if intermediate position in check', () => {
                const blackQueen = new Queen(Player.BLACK);
                board.setPiece(Square.at(7, 3), blackQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 2));
            });

            it('king cannot castle queen side if end position in check', () => {
                const blackQueen = new Queen(Player.BLACK);
                board.setPiece(Square.at(7, 2), blackQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(0, 2));
            });
        });

        describe('black king', () => {
            let king: King;
            let leftRook: Rook;
            let rightRook: Rook;
            beforeEach(() => {
                board = new Board(Player.BLACK);
                king = new King(Player.BLACK);
                board.setPiece(Square.at(7, 4), king);
                leftRook = new Rook(Player.BLACK);
                board.setPiece(Square.at(7, 0), leftRook);
                rightRook = new Rook(Player.BLACK);
                board.setPiece(Square.at(7, 7), rightRook);
            });

            it('king can castle king side', () => {        
                const moves = king.getAvailableMoves(board);
                moves.should.deep.include(Square.at(7, 6));
            });

            it('rook moves when castling king side', () => {     
                board.movePiece(Square.at(7, 4), Square.at(7, 6));
                assert(board.getPiece(Square.at(7, 5)) === rightRook);
            });

            it('king can castle queen side', () => {        
                const moves = king.getAvailableMoves(board);
                moves.should.deep.include(Square.at(7, 2));
            });

            it('rook moves when castling queen side', () => {     
                board.movePiece(Square.at(7, 4), Square.at(7, 2));
                assert(board.getPiece(Square.at(7, 3)) === leftRook);
            });

            it('king cannot castle if king has moved before', () => {   
                const whiteDummy = new King(Player.WHITE);
                board.setPiece(Square.at(0, 0), whiteDummy);

                board.movePiece(Square.at(7, 4), Square.at(7, 3));
                board.movePiece(Square.at(0, 0), Square.at(0, 1));
                board.movePiece(Square.at(7, 3), Square.at(7, 4));
                board.movePiece(Square.at(0, 1), Square.at(0, 2));
                
                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 6));
                moves.should.not.deep.include(Square.at(7, 2));
            });

            it('king cannot castle king side if right rook has moved before', () => {   
                const whiteDummy = new King(Player.WHITE);
                board.setPiece(Square.at(0, 0), whiteDummy);

                board.movePiece(Square.at(7, 7), Square.at(7, 6));
                board.movePiece(Square.at(0, 0), Square.at(0, 6));
                board.movePiece(Square.at(7, 6), Square.at(7, 7));
                board.movePiece(Square.at(0, 6), Square.at(0, 5));
                
                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 6));
            });

            it('king cannot castle queen side if left rook has moved before', () => {   
                const whiteDummy = new King(Player.WHITE);
                board.setPiece(Square.at(0, 0), whiteDummy);

                board.movePiece(Square.at(7, 0), Square.at(7, 1));
                board.movePiece(Square.at(0, 0), Square.at(0, 6));
                board.movePiece(Square.at(7, 1), Square.at(7, 0));
                board.movePiece(Square.at(0, 6), Square.at(0, 5));
                
                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 2));
            });

            it('king cannot castle king side if there is a piece in between', () => {
                const knight = new Knight(Player.WHITE);
                board.setPiece(Square.at(7, 6), knight);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 6));
            });

            it('king cannot castle queen side if there is a piece in between', () => {
                const knight = new Knight(Player.WHITE);
                board.setPiece(Square.at(7, 1), knight);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 2));
            });

            it('king cannot castle if in check', () => {
                const whiteQueen = new Queen(Player.WHITE);
                board.setPiece(Square.at(0, 4), whiteQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 2));
                moves.should.not.deep.include(Square.at(7, 6));
            });

            it('king cannot castle king side if intermediate position in check', () => {
                const whiteQueen = new Queen(Player.WHITE);
                board.setPiece(Square.at(0, 5), whiteQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 6));
            });

            it('king cannot castle queen side if intermediate position in check', () => {
                const whiteQueen = new Queen(Player.WHITE);
                board.setPiece(Square.at(0, 3), whiteQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 2));
            });

            it('king cannot castle king side if end position in check', () => {
                const blackQueen = new Queen(Player.WHITE);
                board.setPiece(Square.at(0, 6), blackQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 6));
            });

            it('king cannot castle queen side if end position in check', () => {
                const blackQueen = new Queen(Player.WHITE);
                board.setPiece(Square.at(0, 2), blackQueen);

                const moves = king.getAvailableMoves(board);
                moves.should.not.deep.include(Square.at(7, 2));
            });
        });
    });

});
