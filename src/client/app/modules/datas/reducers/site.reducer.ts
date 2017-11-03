import { SiteAction } from '../actions/index';
import { ISiteState, siteInitialState } from '../states/index';
import { Site } from '../models/site';

export function siteReducer(
    state: ISiteState = siteInitialState,
    action: SiteAction.Actions
): ISiteState {
    //console.log(action.type);

    switch (action.type) {
        case SiteAction.ActionTypes.LOAD: {
            return {
                ...state,
                loading: true,
            };
        }

        case SiteAction.ActionTypes.LOAD_SUCCESS: {
            const site = action.payload;

            const newSite = site.filter(site => state.ids.includes(site._id) ? false : site);

            const newSiteIds = newSite.map(site => site._id);

            return {
                ...state,
                loading: false,
                loaded: true,
                entities: [...state.entities, ...newSite],
                ids: [...state.ids, ...newSiteIds],
                error: null
            };

        }

        case SiteAction.ActionTypes.ADD_SITE:{
            console.log(action.payload);
            return state;
        }

           // ON VOIT PAS LA ZONE APRES L AVOIR ENREGISTREE !!!
        case SiteAction.ActionTypes.ADD_SITE_SUCCESS:
        case SiteAction.ActionTypes.IMPORT_SITE_SUCCESS: {
            console.log(action.payload);           
            const addedsite = action.payload;
            console.log(addedsite);
            const sites = state.entities.filter(site => addedsite._id !== site._id);
            console.log(sites);
            console.log([...sites,...addedsite])
            return {
                ...state,
                entities: [...sites,...addedsite],
                ids: [...state.ids.filter(id => addedsite._id !== id), ...addedsite._id],
                error: null,
                msg: action.type===SiteAction.ActionTypes.IMPORT_SITE_SUCCESS?"Sites registered with success":null
            }
        }

        case SiteAction.ActionTypes.REMOVE_SITE_SUCCESS:
            {
                const removedSite = action.payload;
                return {
                    ...state,
                    entities: state.entities.filter(site => removedSite._id !== site._id),
                    ids: state.ids.filter(id => id !== removedSite._id),
                    currentSiteId: null,
                    error: null,
                    msg: "Site removed with success"
                };
            }

        case SiteAction.ActionTypes.REMOVE_SITE_FAIL:
        case SiteAction.ActionTypes.ADD_SITE_FAIL:
            {
                return {
                    ...state,
                    error: action.payload,
                    msg: null
                }
            }

        case SiteAction.ActionTypes.SELECT: {
            console.log(action.payload);
            return {
                ...state,
                currentSiteId: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}