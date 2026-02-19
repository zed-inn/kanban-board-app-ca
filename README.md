# Kanban Board Business Rules

- Users exists.
- A user can create a board.
- A user can own a board.
- A user who is a member of board can add more users as members of the board.
- A user who is an owner of board can only delete the board, never leave the board.
- A user who is an owner of board can update the board.
- A user who is a member of board can leave the board.
- A user who is an owner of board is also a member of the board.
- A user can see all the boards in which he is a member.

* User is a member of board
- A user can add columns in a board.
- A user can order columns in a board.
- A user can delete a column in a board.
- A user can update a column in a board.
- If one user is working on a column, other users cannot work on that column till the first one is finished.(doesn't apply for adding cards)
- A user can add cards in a column.
- A user can order cards in a column.
- A user can remove card from a column.
- A user can update a card in a column.
- A user can transfer one card from one column to another column and order at the same time.
- If one user is working on a card, other users cannot work on that card till the first one is finished.
- A user can see all the columns and cards of a board.

- A user can name a board.
- A user can name a column.
- A user can add title and content in a card.