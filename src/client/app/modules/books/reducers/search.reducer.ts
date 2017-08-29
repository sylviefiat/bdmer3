import { ISearchState, searchInitialState } from '../states/index';
import { BookAction } from '../actions/index';
import { Book } from '../models/book';

export function searchReducer(state: ISearchState = searchInitialState, action: BookAction.Actions): ISearchState {
  //console.log(action.type);
  switch (action.type) {
    case BookAction.ActionTypes.SEARCH: {
      const query = action.payload;
      //console.log(query);
      if (query === '') {
        return {
          ids: [],
          loading: false,
          query,
        };
      }

      return Object.assign({}, state, {
        query,
        loading: true,
      });
    }

    case BookAction.ActionTypes.SEARCH_COMPLETE: {
      const books = action.payload as Book[];
      console.log(books);

      return {
        ids: books.map(book => book.id),
        loading: false,
        query: state.query,
      };
    }

    default: {
      return state;
    }
  }
}

