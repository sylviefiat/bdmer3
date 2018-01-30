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

        case SiteAction.ActionTypes.ADD_SITE_SUCCESS:
        case SiteAction.ActionTypes.IMPORT_SITE_SUCCESS: {
            const addedsite = action.payload;
            const sites = state.entities.filter(site => addedsite._id !== site._id);
            return {
                ...state,
                entities: [...sites,...addedsite],
                ids: [...state.ids.filter(id => addedsite._id !== id), ...addedsite._id],
                error: null,
                msg: action.type===SiteAction.ActionTypes.IMPORT_SITE_SUCCESS?"Sites registered with success":"site registered with success"
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

        case SiteAction.ActionTypes.ADD_ZONE_SUCCESS:
        case SiteAction.ActionTypes.IMPORT_ZONE_SUCCESS: {
            const addedzone = action.payload;
            console.log(addedzone);
            const sites = state.entities.filter(site => addedzone.codeSite !== site._id);
            const modifiedSite = state.entities.filter(site => addedzone.codeSite === site._id)[0];
            modifiedSite.zones = [...modifiedSite.zones.filter(zone => addedzone.code !== zone.code),addedzone];

            return {
                ...state,
                entities: [...sites,modifiedSite],
                ids: [...state.ids.filter(id => addedzone.codeSite !== id), ...addedzone.codeSite],
                error: null,
                msg: action.type===SiteAction.ActionTypes.IMPORT_SITE_SUCCESS?"Zones registered with success":"Zone registered with success"
            }
        }

        case SiteAction.ActionTypes.ADD_TRANSECT_SUCCESS:
        case SiteAction.ActionTypes.IMPORT_TRANSECT_SUCCESS: {
            const addedtransect = action.payload;
            console.log(addedtransect);
            const sites = state.entities.filter(site => addedtransect.codeSite !== site._id);
            const modifiedSite = state.entities.filter(site => addedtransect.codeSite === site._id)[0];
            const modifiedZone = modifiedSite.zones.filter(zone => addedtransect.codeZone === zone.code)[0];
            modifiedZone.transects = [...modifiedZone.transects.filter(transect => addedtransect.code !== transect.code),addedtransect];
            modifiedSite.zones = [...modifiedSite.zones.filter(zone => addedtransect.codeZone !== zone.code),modifiedZone];

            return {
                ...state,
                entities: [...sites,modifiedSite],
                ids: [...state.ids.filter(id => addedtransect.codeSite !== id), ...addedtransect.codeSite],
                error: null,
                msg: action.type===SiteAction.ActionTypes.IMPORT_SITE_SUCCESS?"Transects registered with success":"Transects registered with success"
            }
        }

        case SiteAction.ActionTypes.ADD_ZONE_PREF_SUCCESS:
        case SiteAction.ActionTypes.IMPORT_ZONE_PREF_SUCCESS: {
            const addedzonepref = action.payload;
            console.log(addedzonepref);
            const sites = state.entities.filter(site => addedzonepref.codeSite !== site._id);
            const modifiedSite = state.entities.filter(site => addedzonepref.codeSite === site._id)[0];
            const modifiedZone = modifiedSite.zones.filter(zone => addedzonepref.codeZone === zone.code)[0];
            modifiedZone.zonePreferences = [...modifiedZone.zonePreferences.filter(transect => addedzonepref.code !== transect.code),addedzonepref];
            modifiedSite.zones = [...modifiedSite.zones.filter(zone => addedzonepref.codeZone !== zone.code),modifiedZone];

            return {
                ...state,
                entities: [...sites,modifiedSite],
                ids: [...state.ids.filter(id => addedzonepref.codeSite !== id), ...addedzonepref.codeSite],
                error: null,
                msg: action.type===SiteAction.ActionTypes.IMPORT_SITE_SUCCESS?"Zones preferences registered with success":"Zone preference registered with success"
            }
        }

        case SiteAction.ActionTypes.ADD_COUNT_SUCCESS:
        case SiteAction.ActionTypes.IMPORT_COUNT_SUCCESS: {
            const addedzonepref = action.payload;
            console.log(addedzonepref);
            const sites = state.entities.filter(site => addedzonepref.codeSite !== site._id);
            const modifiedSite = state.entities.filter(site => addedzonepref.codeSite === site._id)[0];
            const modifiedZone = modifiedSite.zones.filter(zone => addedzonepref.codeZone === zone.code)[0];
            modifiedZone.zonePreferences = [...modifiedZone.zonePreferences.filter(transect => addedzonepref.code !== transect.code),addedzonepref];
            modifiedSite.zones = [...modifiedSite.zones.filter(zone => addedzonepref.codeZone !== zone.code),modifiedZone];

            return {
                ...state,
                entities: [...sites,modifiedSite],
                ids: [...state.ids.filter(id => addedzonepref.codeSite !== id), ...addedzonepref.codeSite],
                error: null,
                msg: action.type===SiteAction.ActionTypes.IMPORT_SITE_SUCCESS?"Zones preferences registered with success":"Zone preference registered with success"
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

        case SiteAction.ActionTypes.REMOVE_ZONE_SUCCESS:
            {
                const removedZone = action.payload;
                const modifiedSite = state.entities.filter(site => site.code === removedZone.codeSite)[0];
                modifiedSite.zones = modifiedSite.zones.filter(zone => zone.code !== removedZone.code);
                return {
                    ...state,
                    entities: [...state.entities.filter(site => modifiedSite._id !== site._id),modifiedSite],
                    ids: [...state.ids.filter(id => id !== modifiedSite._id), modifiedSite._id],
                    currentZoneId: null,
                    error: null,
                    msg: "Zone removed with success"
                };
            }

        case SiteAction.ActionTypes.REMOVE_CAMPAIGN_SUCCESS:
            {
                const removedCampaign = action.payload;
                const modifiedSite = state.entities.filter(site => site.code === removedCampaign.codeSite)[0];
                const modifiedZone = modifiedSite.zones.filter(zone => zone.code === removedCampaign.codeZone)[0];
                modifiedZone.campaigns = modifiedZone.campaigns.filter(campaign => campaign.code !== removedCampaign.code);
                modifiedSite.zones = [...modifiedSite.zones.filter(zone => zone.code !== modifiedZone.code),modifiedZone];

                return {
                    ...state,
                    entities: [...state.entities.filter(site => modifiedSite._id !== site._id),modifiedSite],
                    ids: [...state.ids.filter(id => id !== modifiedSite._id), modifiedSite._id],
                    currentCampaignId: null,
                    error: null,
                    msg: "Campaign removed with success"
                };
            }

        case SiteAction.ActionTypes.REMOVE_TRANSECT_SUCCESS:
            {
                const removedTransect = action.payload;
                const modifiedSite = state.entities.filter(site => site.code === removedTransect.codeSite)[0];
                const modifiedZone = modifiedSite.zones.filter(zone => zone.code === removedTransect.codeZone)[0];
                modifiedZone.transects = modifiedZone.transects.filter(transect => transect.code !== removedTransect.code);
                modifiedSite.zones = [...modifiedSite.zones.filter(zone => zone.code !== modifiedZone.code),modifiedZone];

                return {
                    ...state,
                    entities: [...state.entities.filter(site => modifiedSite._id !== site._id),modifiedSite],
                    ids: [...state.ids.filter(id => id !== modifiedSite._id), modifiedSite._id],
                    currentTransectId: null,
                    error: null,
                    msg: "Transect removed with success"
                };
            }

        case SiteAction.ActionTypes.REMOVE_ZONE_PREF_SUCCESS:
            {
                const removedZonePref = action.payload;
                const modifiedSite = state.entities.filter(site => site.code === removedZonePref.codeSite)[0];
                const modifiedZone = modifiedSite.zones.filter(zone => zone.code === removedZonePref.codeZone)[0];
                modifiedZone.zonePreferences = modifiedZone.zonePreferences.filter(zp => zp.code !== removedZonePref.code);
                modifiedSite.zones = [...modifiedSite.zones.filter(zone => zone.code !== modifiedZone.code),modifiedZone];

                return {
                    ...state,
                    entities: [...state.entities.filter(site => modifiedSite._id !== site._id),modifiedSite],
                    ids: [...state.ids.filter(id => id !== modifiedSite._id), modifiedSite._id],
                    currentSpPrefId: null,
                    error: null,
                    msg: "Zone preference removed with success"
                };
            }

        case SiteAction.ActionTypes.REMOVE_COUNT_SUCCESS:
            {
                const removedCount = action.payload;
                const modifiedSite = state.entities.filter(site => site.code === removedCount.codeSite)[0];
                const modifiedZone = modifiedSite.zones.filter(zone => zone.code === removedCount.codeZone)[0];
                const modifiedTransect = modifiedZone.transects.filter(count => count.code === removedCount.codeTransect)[0];
                modifiedTransect.counts = modifiedTransect.counts.filter(count => count.code !== removedCount.code)
                modifiedZone.transects = [...modifiedZone.transects.filter(transect => transect.code !== removedCount.code), modifiedTransect];
                modifiedSite.zones = [...modifiedSite.zones.filter(zone => zone.code !== modifiedZone.code),modifiedZone];

                return {
                    ...state,
                    entities: [...state.entities.filter(site => modifiedSite._id !== site._id),modifiedSite],
                    ids: [...state.ids.filter(id => id !== modifiedSite._id), modifiedSite._id],
                    currentCountId: null,
                    error: null,
                    msg: "Count removed with success"
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

        case SiteAction.ActionTypes.SELECT_ZONE_PREF: {
            console.log("select zone pref: "+action.payload);
            return {
                ...state,
                currentSpPrefId: action.payload,
            };
        }

        case SiteAction.ActionTypes.SELECT_COUNT: {
            console.log("select count: "+action.payload);
            return {
                ...state,
                currentCountId: action.payload,
            };
        }

        case SiteAction.ActionTypes.REMOVE_MSG: {
            console.log("remove msg");            
            return {
                ...state,
                error: null,
                msg: null
            };
        }

        default: {
            return state;
        }
    }
}