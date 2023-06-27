import Pawn from '../../../src/engine/pieces/pawn';
import Board from '../../../src/engine/board';
import Bishop from '../../../src/engine/pieces/bishop'
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Rook from '../../../src/engine/pieces/rook';
import King from '../../../src/engine/pieces/king';
import Knight from '../../../src/engine/pieces/knight';
import Queen from '../../../src/engine/pieces/queen';
import Piece from '../../../src/engine/pieces/piece';
import { assert } from 'chai';

describe('Pawn', () => {

    let board: Board;
    beforeEach(() => board = new Board());

    describe('white pawns', () => {

        it('can only move one square up if they have already moved', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(1, 0), pawn);
            pawn.moveTo(board, Square.at(2, 0));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(1);
            moves.should.deep.include(Square.at(3, 0));
        });

        it('can move one or two squares up on their first move', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(1, 7), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(2);
            moves.should.deep.include.members([Square.at(2, 7), Square.at(3, 7)]);
        });

        it('cannot move at the top of the board', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(7, 3), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.be.empty;
        });

        it('can move diagonally if there is a piece to take', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPiece = new Rook(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), opposingPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.deep.include(Square.at(5, 3));
        });

        it('cannot move diagonally if there is no piece to take', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('cannot take a friendly piece', () => {
            const pawn = new Pawn(Player.WHITE);
            const friendlyPiece = new Rook(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), friendlyPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('cannot take the opposing king', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingKing = new King(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), opposingKing);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        describe("en passant", () => {
            it("can move behind a pawn that has moved 2 squares on last turn to adjacent position", () => {
                const whitePawn = new Pawn(Player.WHITE);
                board.setPiece(Square.at(3, 4), whitePawn);

                const blackPawn = new Pawn(Player.BLACK);
                board.setPiece(Square.at(6, 5), blackPawn);

                board.movePiece(Square.at(3, 4), Square.at(4, 4));
                board.movePiece(Square.at(6, 5), Square.at(4, 5));

                const moves = whitePawn.getAvailableMoves(board);

                moves.should.deep.include(Square.at(5, 5));
            });

            it("takes a pawn when moving behind it diagonally", () => {
                const whitePawn = new Pawn(Player.WHITE);
                board.setPiece(Square.at(3, 4), whitePawn);

                const blackPawn = new Pawn(Player.BLACK);
                board.setPiece(Square.at(6, 5), blackPawn);

                board.movePiece(Square.at(3, 4), Square.at(4, 4));
                board.movePiece(Square.at(6, 5), Square.at(4, 5));
                board.movePiece(Square.at(4, 4), Square.at(5, 5));

                assert(!board.getPiece(Square.at(4, 5)), "moved behind pawn diagonally but did not take it");
            });

            it("cannot take a pawn moved 2 squares to adjacent position more than 1 turn prior", () => {
                const whitePawn = new Pawn(Player.WHITE);
                board.setPiece(Square.at(4, 4), whitePawn);

                const blackPawn = new Pawn(Player.BLACK);
                board.setPiece(Square.at(6, 5), blackPawn);

                const whiteDummy = new King(Player.WHITE);
                board.setPiece(Square.at(0, 0), whiteDummy);
                const blackDummy = new King(Player.BLACK);
                board.setPiece(Square.at(7, 7), blackDummy);

                board.movePiece(Square.at(0, 0), Square.at(1, 0));
                board.movePiece(Square.at(6, 5), Square.at(4, 5));
                board.movePiece(Square.at(1, 0), Square.at(2, 0));
                board.movePiece(Square.at(7, 7), Square.at(6, 7));

                const moves = whitePawn.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(5, 5));
            });

            it("cannot take a pawn that moved 1 square to adjacent position", () => {
                const whitePawn = new Pawn(Player.WHITE);
                board.setPiece(Square.at(3, 4), whitePawn);

                const blackPawn = new Pawn(Player.BLACK);
                board.setPiece(Square.at(5, 5), blackPawn);

                board.movePiece(Square.at(3, 4), Square.at(4, 4));
                board.movePiece(Square.at(5, 5), Square.at(4, 5));

                const moves = whitePawn.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(5, 5));
            });

            describe("cannot take any other piece that is adjacent", () => {
                const piecesToTest: [Piece, string, Square][] = [
                    [new Bishop(Player.BLACK), "Bishop", Square.at(6, 7)],
                    [new King(Player.BLACK), "King", Square.at(5, 5)],
                    [new Knight(Player.BLACK), "Knight", Square.at(6, 6)],
                    [new Queen(Player.BLACK), "Queen", Square.at(6, 5)],
                    [new Rook(Player.BLACK), "Rook", Square.at(6, 5)],
                ];

                piecesToTest.forEach(([piece, pieceName, pieceSquare]) => {
                    it(`cannot take a ${pieceName} that is adjacent`, () => {
                        const whitePawn = new Pawn(Player.WHITE);
                        board.setPiece(Square.at(3, 4), whitePawn);

                        board.setPiece(pieceSquare, piece);

                        board.movePiece(Square.at(3, 4), Square.at(4, 4));
                        board.movePiece(pieceSquare, Square.at(4, 5));

                        const moves = whitePawn.getAvailableMoves(board);

                        moves.should.not.deep.include(Square.at(5, 5));
                    })
                });
            });
        });

        it("is promoted to queen upon reaching final row", () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(6, 0), pawn);

            board.movePiece(Square.at(6, 0), Square.at(7, 0));

            assert(board.getPiece(Square.at(7, 0)) instanceof Queen);
        })
    });

    describe('black pawns', () => {

        let board: Board;
        beforeEach(() => board = new Board(Player.BLACK));

        it('can only move one square down if they have already moved', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(6, 0), pawn);
            pawn.moveTo(board, Square.at(5, 0));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(1);
            moves.should.deep.include(Square.at(4, 0));
        });

        it('can move one or two squares down on their first move', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(6, 7), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(2);
            moves.should.deep.include.members([Square.at(4, 7), Square.at(5, 7)]);
        });

        it('cannot move at the bottom of the board', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(0, 3), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.be.empty;
        });

        it('can move diagonally if there is a piece to take', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingPiece = new Rook(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), opposingPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.deep.include(Square.at(3, 3));
        });

        it('cannot move diagonally if there is no piece to take', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        it('cannot take a friendly piece', () => {
            const pawn = new Pawn(Player.BLACK);
            const friendlyPiece = new Rook(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), friendlyPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        it('cannot take the opposing king', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingKing = new King(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), opposingKing);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        describe("en passant", () => {

            beforeEach(() => board = new Board(Player.WHITE));

            it("can move behind a pawn that has moved 2 squares on last turn to adjacent position", () => {
                const blackPawn = new Pawn(Player.BLACK);
                board.setPiece(Square.at(3, 3), blackPawn);

                const whitePawn = new Pawn(Player.WHITE);
                board.setPiece(Square.at(1, 2), whitePawn);

                board.movePiece(Square.at(1, 2), Square.at(3, 2));

                const moves = blackPawn.getAvailableMoves(board);

                moves.should.deep.include(Square.at(2, 2));
            });

            it("takes a pawn when moving behind it diagonally", () => {
                const blackPawn = new Pawn(Player.BLACK);
                board.setPiece(Square.at(3, 3), blackPawn);

                const whitePawn = new Pawn(Player.WHITE);
                board.setPiece(Square.at(1, 2), whitePawn);

                board.movePiece(Square.at(1, 2), Square.at(3, 2));
                board.movePiece(Square.at(3, 3), Square.at(2, 2));

                assert(!board.getPiece(Square.at(3, 2)), "moved behind pawn diagonally but did not take it");
            });

            it("cannot take a pawn moved 2 squares to adjacent position more than 1 turn prior", () => {
                const blackPawn = new Pawn(Player.BLACK);
                board.setPiece(Square.at(3, 3), blackPawn);

                const whitePawn = new Pawn(Player.WHITE);
                board.setPiece(Square.at(1, 2), whitePawn);

                const blackDummy = new King(Player.BLACK);
                board.setPiece(Square.at(7, 7), blackDummy);
                const whiteDummy = new King(Player.WHITE);
                board.setPiece(Square.at(0, 0), whiteDummy);

                board.movePiece(Square.at(1, 2), Square.at(3, 2));
                board.movePiece(Square.at(7, 7), Square.at(6, 7));
                board.movePiece(Square.at(0, 0), Square.at(1, 0));

                const moves = blackPawn.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(2, 2));
            });

            it("cannot take a pawn that moved 1 square to adjacent position", () => {
                const blackPawn = new Pawn(Player.BLACK);
                board.setPiece(Square.at(3, 3), blackPawn);

                const whitePawn = new Pawn(Player.WHITE);
                board.setPiece(Square.at(2, 2), whitePawn);

                board.movePiece(Square.at(2, 2), Square.at(3, 2));

                const moves = blackPawn.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(2, 2));
            });

            describe("cannot take any other piece that is adjacent", () => {
                const piecesToTest: [Piece, string, Square][] = [
                    [new Bishop(Player.WHITE), "Bishop", Square.at(1, 0)],
                    [new King(Player.WHITE), "King", Square.at(2, 2)],
                    [new Knight(Player.WHITE), "Knight", Square.at(1, 1)],
                    [new Queen(Player.WHITE), "Queen", Square.at(1, 2)],
                    [new Rook(Player.WHITE), "Rook", Square.at(1, 2)],
                ];

                piecesToTest.forEach(([piece, pieceName, pieceSquare]) => {
                    it(`cannot take a ${pieceName} that is adjacent`, () => {
                        const blackPawn = new Pawn(Player.BLACK);
                        board.setPiece(Square.at(3, 3), blackPawn);

                        board.setPiece(pieceSquare, piece);

                        board.movePiece(pieceSquare, Square.at(3, 2));

                        const moves = blackPawn.getAvailableMoves(board);

                        moves.should.not.deep.include(Square.at(2, 2));
                    });
                });
            });
        })

        it("is promoted to queen upon reaching final row", () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(1, 0), pawn);

            board.movePiece(Square.at(1, 0), Square.at(0, 0));

            assert(board.getPiece(Square.at(0, 0)) instanceof Queen);
        })
    });

    it('cannot move if there is a piece in front', () => {
        const pawn = new Pawn(Player.BLACK);
        const blockingPiece = new Rook(Player.WHITE);
        board.setPiece(Square.at(6, 3), pawn);
        board.setPiece(Square.at(5, 3), blockingPiece);

        const moves = pawn.getAvailableMoves(board);

        moves.should.be.empty;
    });

    it('cannot move two squares if there is a piece two sqaures in front', () => {
        const pawn = new Pawn(Player.BLACK);
        const blockingPiece = new Rook(Player.WHITE);
        board.setPiece(Square.at(6, 3), pawn);
        board.setPiece(Square.at(4, 3), blockingPiece);

        const moves = pawn.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(4, 3));
    });
});
