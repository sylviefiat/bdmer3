import { IBookState, bookInitialState } from '../states/index';
import { Book } from '../models/book';
import { BookAction, CollectionAction } from '../actions/index';


export function bookReducer(
  state : IBookState = bookInitialState,
  action: BookAction.Actions | CollectionAction.Actions
): IBookState {
  switch (action.type) {
    case BookAction.ActionTypes.SEARCH_COMPLETE:
    case CollectionAction.ActionTypes.LOAD_SUCCESS: {
      const books = action.payload;
      const newBooks = books.filter(book => !state.entities[book.id]);

      const newBookIds = newBooks.map(book => book.id);
      const newBookEntities = newBooks.reduce(
        (entities: { [id: string]: Book }, book: Book) => {
          return Object.assign(entities, {
            [book.id]: book,
          });
        },
        {}
      );
      console.log(Object.assign({}, state.entities, newBookEntities));
      return {
        ids: [...state.ids, ...newBookIds],
        entities: Object.assign({}, state.entities, newBookEntities),
        selectedBookId: state.selectedBookId,
      };
    }

    case BookAction.ActionTypes.LOAD: {
      const book = action.payload;

      if (state.ids.indexOf(book.id) > -1) {
        return state;
      }

      return {
        ids: [...state.ids, book.id],
        entities: Object.assign({}, state.entities, {
          [book.id]: book,
        }),
        selectedBookId: state.selectedBookId,
      };
    }

    case BookAction.ActionTypes.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedBookId: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

