# components

- board
- piece
- square

how to calculate check

When we click on a piece, we are getting the piece's valid moves.

- When the king is checked, the check needs to resolve with one of the following ways:
- - move the king
- - move a piece between the king and the piece that's threatening the king

for every one of the available moves,
we need to run a simulated board with the move done, and see if the king is in check.
If yes, the move should get filtered out.
