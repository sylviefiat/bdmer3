import { CollectionAction } from '../actions/index';
import { ICollectionState, collectionInitialState } from '../states/index';


export function collectionReducer(
  state: ICollectionState = collectionInitialState,
  action: CollectionAction.Actions
): ICollectionState {

  switch (action.type) {
    case CollectionAction.ActionTypes.LOAD: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case CollectionAction.ActionTypes.LOAD_SUCCESS: {      
      const books = action.payload;

      return {
        loaded: true,
        loading: false,
        ids: books.map(book => book.id),
      };
    }

    case CollectionAction.ActionTypes.ADD_BOOK_SUCCESS:
    case CollectionAction.ActionTypes.REMOVE_BOOK_FAIL: {
      const book = action.payload;

      if (state.ids.indexOf(book.id) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [...state.ids, book.id],
      });
    }

    case CollectionAction.ActionTypes.REMOVE_BOOK_SUCCESS:
    case CollectionAction.ActionTypes.ADD_BOOK_FAIL: {
      const book = action.payload;

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== book.id),
      });
    }

    default: {
      return state;
    }
  }
}

