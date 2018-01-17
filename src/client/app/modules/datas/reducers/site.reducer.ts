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
            const sites = action.payload;
            const newSites = sites.filter(site => state.ids.includes(site._id) ? false : site);
            const newSiteIds = newSites.map(site => site._id);

            return {
                ...state,
                loading: false,
                loaded: true,
                entities: [...state.entities, ...newSites],
                ids: [...state.ids, ...newSiteIds],
                error: null
            };

        }

        case SiteAction.ActionTypes.ADD_SITE:{
            return state;
        }

        case SiteAction.ActionTypes.ADD_SITE_SUCCESS:
        case SiteAction.ActionTypes.IMPORT_SITE_SUCCESS: {
            const addedsite = action.payload;
            const sites = state.entities.filter(site => addedsite._id !== site._id);
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

        case SiteAction.ActionTypes.SELECT_SITE: {
            console.log("select site: "+action.payload);
            return {
                ...state,
                currentSiteId: action.payload,
            };
        }

        case SiteAction.ActionTypes.SELECT_ZONE: {
            console.log("select zone: "+action.payload);
            return {
                ...state,
                currentZoneId: action.payload,
            };
        }

        case SiteAction.ActionTypes.SELECT_TRANSECT: {
            console.log("select transect: "+action.payload);
            return {
                ...state,
                currentTransectId: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}