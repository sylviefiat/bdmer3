import { PlatformAction } from "../actions/index";
import { IPlatformState, platformInitialState } from "../states/index";
import { Platform } from "../models/index";

export function platformReducer(state: IPlatformState = platformInitialState, action: PlatformAction.Actions): IPlatformState {
  switch (action.type) {
    
    //*********************************************************************************************************************************************************//
    //************************************************************************ PLATFORM ***********************************************************************//
    //*********************************************************************************************************************************************************//

    case PlatformAction.ActionTypes.ADD_PLATFORM_SUCCESS: {
      const addedplatform = action.payload;
      const platforms = state.entities.filter(platform => addedplatform._id.toLowerCase() !== platform._id.toLowerCase());
      return {
        ...state,
        entities: [...platforms, ...addedplatform],
        ids: [...state.ids.filter(id => addedplatform._id.toLowerCase() !== id.toLowerCase()), ...addedplatform._id],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "PLATFORM_REGISTERED_SUCCESS" : "PLATFORM_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS: {
      const addedplatforms = action.payload;
      const platforms = state.entities.filter(platform => addedplatforms[0].code.toLowerCase() !== platform.code.toLowerCase());
      return {
        ...state,
        entities: [...platforms, ...addedplatforms],
        ids: [...state.ids.filter(id => addedplatforms[0].code.toLowerCase() !== id.toLowerCase()), ...addedplatforms[0]._id.toLowerCase()],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "PLATFORM_REGISTERED_SUCCESS" : "PLATFORM_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.CHECK_PLATFORM_ADD_ERROR: {
      if (action.payload.error) {
        return {
          ...state,
          error: action.payload.error,
          msg: null
        };
      } else {
        return {
          ...state,
          importErrors: action.payload !== "" && action.payload.length > 0 ? [...state.importErrors, action.payload] : [...state.importErrors]
        };
      }
    }

    case PlatformAction.ActionTypes.CHECK_PLATFORM_SUCCESS: {
      return {
        ...state,
        msg: "CSV_RDY_IMPORT"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_PLATFORM_SUCCESS: {
      const removedPlatform = action.payload;
      return {
        ...state,
        entities: state.entities.filter(platform => removedPlatform._id.toLowerCase() !== platform._id.toLowerCase()),
        ids: state.ids.filter(id => id.toLowerCase() !== removedPlatform._id.toLowerCase()),
        currentPlatformId: null,
        error: null,
        msg: "PLATFORM_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_PLATFORM_COUNTRY_SUCCESS: {
      const removedPlatform = action.payload;
      return {
        ...state,
        entities: state.entities.filter(platform => removedPlatform._id.toLowerCase() !== platform._id.toLowerCase()),
        ids: state.ids.filter(id => id.toLowerCase() !== removedPlatform._id.toLowerCase()),
        currentPlatformId: null,
        error: null
      };
    }

    case PlatformAction.ActionTypes.SELECT_PLATFORM: {
      console.log("select platform: " + action.payload);
      return {
        ...state,
        currentPlatformId: action.payload ? action.payload.toLowerCase():null
      };
    }

    //*********************************************************************************************************************************************************//
    //************************************************************************ ZONE ***************************************************************************//
    //*********************************************************************************************************************************************************//

    case PlatformAction.ActionTypes.ADD_ZONE_SUCCESS:{
      const addedzone = action.payload;
      const platforms = state.entities.filter(platform => addedzone.codePlatform.toLowerCase() !== platform._id.toLowerCase());
      const modifiedPlatform = state.entities.filter(platform => addedzone.codePlatform.toLowerCase() === platform._id.toLowerCase())[0];
      modifiedPlatform.zones = [...modifiedPlatform.zones.filter(zone => addedzone.properties.code.toLowerCase() !== zone.properties.code.toLowerCase()), addedzone];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_ZONE_SUCCESS ? "ZONES_REGISTERED_SUCCESS" : "ZONES_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.IMPORT_ZONE_SUCCESS: {
      const addedzones = action.payload;
      const platforms = state.entities.filter(platform => addedzones[0].codePlatform.toLowerCase() !== platform.code.toLowerCase());
      const modifiedPlatform = state.entities.filter(platform => addedzones[0].codePlatform.toLowerCase() === platform._id.toLowerCase())[0];
      modifiedPlatform.zones = [...modifiedPlatform.zones.filter(zone => addedzones.filter(az => az.properties.code.toLowerCase() !== zone.properties.code.toLowerCase()).length>=0), ...addedzones];
      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_ZONE_SUCCESS ? "ZONES_REGISTERED_SUCCESS" : "ZONES_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_ALL_ZONE_SUCCESS: {
      const modifiedPlatform = state.entities.filter(platform => platform.code.toLowerCase() === action.payload.code.toLowerCase())[0];
      modifiedPlatform.zones = [];

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id.toLowerCase() !== platform._id.toLowerCase()), modifiedPlatform],
        currentZoneId: null,
        error: null,
        msg: null
      };
    }

    case PlatformAction.ActionTypes.REMOVE_ZONE_SUCCESS: {
      const removedZone = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code.toLowerCase() === removedZone.codePlatform.toLowerCase())[0];
      modifiedPlatform.zones = modifiedPlatform.zones.filter(zone => zone.properties.code.toLowerCase() !== removedZone.properties.code.toLowerCase());
      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id.toLowerCase() !== platform._id.toLowerCase()), modifiedPlatform],
        currentZoneId: null,
        error: null,
        msg: "ZONE_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.SELECT_ZONE: {
      console.log("select zone: " + action.payload);
      return {
        ...state,
        currentZoneId: action.payload
      };
    }

    //*********************************************************************************************************************************************************//
    //************************************************************************ SURVEY *************************************************************************//
    //*********************************************************************************************************************************************************//

    case PlatformAction.ActionTypes.ADD_SURVEY_SUCCESS: {
      const addedsurvey = action.payload;
      const platforms = state.entities.filter(platform => addedsurvey.codePlatform.toLowerCase() !== platform.code.toLowerCase());
      const modifiedPlatform = state.entities.filter(platform => addedsurvey.codePlatform.toLowerCase() === platform.code.toLowerCase())[0];
      modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(survey => addedsurvey.code.toLowerCase() !== survey.code.toLowerCase()), addedsurvey];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "SURVEYS_REGISTERED_SUCCESS" : "SURVEYS_REGISTERED_SUCCESS"
      };
    }
    case PlatformAction.ActionTypes.IMPORT_SURVEY_SUCCESS: {
      const addedsurveys = action.payload;
      const platforms = state.entities.filter(platform => addedsurveys[0].codePlatform.toLowerCase() !== platform.code.toLowerCase());
      const modifiedPlatform = state.entities.filter(platform => addedsurveys[0].codePlatform.toLowerCase() === platform.code.toLowerCase())[0];
      modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(survey => addedsurveys.filter(as => as.code.toLowerCase() !== survey.code.toLowerCase()).length>=0), ...addedsurveys];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => modifiedPlatform.code.toLowerCase() !== id.toLowerCase()), modifiedPlatform.code.toLowerCase()],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "SURVEYS_REGISTERED_SUCCESS" : "SURVEYS_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.ADD_PENDING_SURVEY_SUCCESS: {
      const addedsurveys = action.payload;
      if(addedsurveys.length===0){
        return state;
      }
      const platforms = state.entities.filter(platform => {
        return addedsurveys[0].codePlatform.toLowerCase() !== platform.code.toLowerCase()});
      const modifiedPlatform = state.entities.filter(platform => addedsurveys[0].codePlatform.toLowerCase() === platform.code.toLowerCase())[0];
      for(let s of addedsurveys){
        modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(survey => s.code.toLowerCase() !== survey.code.toLowerCase()), s];
      }

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedsurveys[0].codePlatform.toLowerCase() !== id.toLowerCase()), ...addedsurveys[0].codePlatform.toLowerCase()],
        error: null
      };
    }

    case PlatformAction.ActionTypes.CHECK_SURVEY_ADD_ERROR: {
      if (action.payload.error) {
        return {
          ...state,
          error: action.payload.error,
          msg: null
        };
      } else {
        return {
          ...state,
          importErrors: action.payload !== "" && action.payload.length > 0 ? [...state.importErrors, ...action.payload] : [...state.importErrors]
        };
      }
    }

    case PlatformAction.ActionTypes.REMOVE_SURVEY_SUCCESS: {
      const removedSurvey = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code.toLowerCase() === removedSurvey.codePlatform.toLowerCase())[0];
      modifiedPlatform.surveys = modifiedPlatform.surveys.filter(survey => survey.code.toLowerCase() !== removedSurvey.code.toLowerCase());

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id.toLowerCase() !== platform._id.toLowerCase()), modifiedPlatform],
        currentSurveyId: null,
        error: null,
        msg: "SURVEY_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_PENDING_SURVEY_SUCCESS: {
      const removedSurvey = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code.toLowerCase() === removedSurvey.codePlatform.toLowerCase())[0];
      modifiedPlatform.surveys = modifiedPlatform.surveys.filter(survey => survey.code.toLowerCase() !== removedSurvey.code.toLowerCase());

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id.toLowerCase() !== platform._id.toLowerCase()), modifiedPlatform],
        error: null
      };
    }

    case PlatformAction.ActionTypes.SELECT_SURVEY: {
      console.log("select survey: " + action.payload);
      return {
        ...state,
        currentSurveyId: action.payload
      };
    }

    //*********************************************************************************************************************************************************//
    //************************************************************************ STATION ************************************************************************//
    //*********************************************************************************************************************************************************//

    case PlatformAction.ActionTypes.ADD_STATION_SUCCESS: {
      const addedstation = action.payload;
      const platforms = state.entities.filter(platform => addedstation.codePlatform.toLowerCase() !== platform._id.toLowerCase());
      const modifiedPlatform = state.entities.filter(platform => addedstation.codePlatform.toLowerCase() === platform.code.toLowerCase())[0];
      modifiedPlatform.stations = [
        ...modifiedPlatform.stations.filter(station => addedstation.properties.code.toLowerCase() !== station.properties.code.toLowerCase()),
        addedstation
      ];
      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedstation.codePlatform.toLowerCase() !== id.toLowerCase()), ...addedstation.codePlatform.toLowerCase()],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "STATIONS_REGISTERED_SUCCESS" : "STATIONS_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.IMPORT_STATION_SUCCESS: {
      const addedstations = action.payload;
      const platforms = state.entities.filter(platform => addedstations[0].codePlatform.toLowerCase() !== platform.code.toLowerCase());
      const modifiedPlatform = state.entities.filter(platform => addedstations[0].codePlatform.toLowerCase() === platform.code.toLowerCase())[0];
      modifiedPlatform.stations = [...modifiedPlatform.stations.filter(station => addedstations.filter(as => as.code.toLowerCase() !== station.properties.code.toLowerCase()).length>=0), ...addedstations];
      
      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "STATIONS_REGISTERED_SUCCESS" : "STATIONS_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.ADD_PENDING_STATION_SUCCESS: {
      const addedstations = action.payload;
      const platforms = state.entities.filter(platform => addedstations[0].codePlatform.toLowerCase() !== platform._id.toLowerCase());
      const modifiedPlatform = state.entities.filter(platform => addedstations[0].codePlatform.toLowerCase() === platform._id.toLowerCase())[0];
      modifiedPlatform.stations = [
        ...modifiedPlatform.stations.filter(station => addedstations.map(as => as.properties.code.toLowerCase()).indexOf(station.properties.code.toLowerCase())>=0),
        ...addedstations
      ];
      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        error: null
      };
    }

    case PlatformAction.ActionTypes.CHECK_STATION_ADD_ERROR: {
      if (action.payload.error) {
        return {
          ...state,
          error: action.payload.error,
          msg: null
        };
      } else {
        return {
          ...state,
          importErrors: action.payload && action.payload.length > 0 ? [...state.importErrors, ...action.payload] : [...state.importErrors]
        };
      }
    }

    case PlatformAction.ActionTypes.REMOVE_STATION_SUCCESS: {
      const removedStation = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code.toLowerCase() === removedStation.codePlatform.toLowerCase())[0];
      modifiedPlatform.stations = modifiedPlatform.stations.filter(station => station.properties.code.toLowerCase() !== removedStation.properties.code.toLowerCase());

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        currentStationId: null,
        error: null,
        msg: "STATION_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_PENDING_STATION_SUCCESS: {
      const removedStation = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code.toLowerCase() === removedStation.codePlatform.toLowerCase())[0];
      modifiedPlatform.stations = modifiedPlatform.stations.filter(station => station.properties.code.toLowerCase() !== removedStation.properties.code.toLowerCase());

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        currentStationId: null,
        error: null
      };
    }

    case PlatformAction.ActionTypes.SELECT_STATION: {
      console.log("select station: " + action.payload);
      return {
        ...state,
        currentStationId: action.payload
      };
    }

    //*********************************************************************************************************************************************************//
    //************************************************************************ ZONE PREFERENCE ****************************************************************//
    //*********************************************************************************************************************************************************//

    case PlatformAction.ActionTypes.ADD_ZONE_PREF_SUCCESS: {
      const addedzonepref = action.payload;
      const platforms = state.entities.filter(platform => addedzonepref.codePlatform.toLowerCase() !== platform._id);
      const modifiedPlatform = state.entities.filter(platform => addedzonepref.codePlatform.toLowerCase() === platform._id)[0];
      const modifiedZone = modifiedPlatform.zones.filter(zone => addedzonepref.codeZone.toLowerCase() === zone.properties.code.toLowerCase())[0];
      modifiedZone.zonePreferences = [...modifiedZone.zonePreferences.filter(station => addedzonepref.code.toLowerCase() !== station.code), addedzonepref];
      modifiedPlatform.zones = [...modifiedPlatform.zones.filter(zone => addedzonepref.codeZone.toLowerCase() !== zone.properties.code.toLowerCase()), modifiedZone];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedzonepref.codePlatform.toLowerCase() !== id), ...addedzonepref.codePlatform.toLowerCase()],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "ZONE_PREF_REGISTERED_SUCCESS" : "ZONE_PREF_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.IMPORT_ZONE_PREF_SUCCESS: {
      const addedzoneprefs = action.payload;
      const platforms = state.entities.filter(platform => addedzoneprefs[0].codePlatform.toLowerCase() !== platform._id.toLowerCase());
      const modifiedPlatform = state.entities.filter(platform => addedzoneprefs[0].codePlatform === platform._id)[0];
      for(let zone of modifiedPlatform.zones){
        if(zone.zonePreferences.filter(zp => zp.codeZone.toLowerCase() === zone.properties.code.toLowerCase()).length > 0){
          zone.zonePreferences = [...zone.zonePreferences.filter(zp => addedzoneprefs.filter(azp => (azp.codeZone.toLowerCase()===zone.properties.code.toLowerCase())).filter(azp => azp.code.toLowerCase() !== zp.code.toLowerCase()).length>=0),...addedzoneprefs.filter(azp => (azp.codeZone.toLowerCase()===zone.properties.code.toLowerCase()))]
          modifiedPlatform.zones = [...modifiedPlatform.zones.filter(z => z.properties.code.toLowerCase() !== zone.properties.code.toLowerCase()),zone];
        }
      }
      
      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "ZONE_PREF_REGISTERED_SUCCESS" : "ZONE_PREF_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.CHECK_ZONE_PREF_ADD_ERROR: {
      if (action.payload.error) {
        return {
          ...state,
          error: action.payload.error,
          msg: null
        };
      } else {
        return {
          ...state,
          importErrors: action.payload !== "" && action.payload.length > 0 ? [...state.importErrors, action.payload] : [...state.importErrors]
        };
      }
    }

    case PlatformAction.ActionTypes.REMOVE_ZONE_PREF_SUCCESS: {
      const removedZonePref = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code.toLowerCase() === removedZonePref.codePlatform.toLowerCase())[0];
      const modifiedZone = modifiedPlatform.zones.filter(zone => zone.properties.code.toLowerCase() === removedZonePref.codeZone.toLowerCase())[0];
      modifiedZone.zonePreferences = modifiedZone.zonePreferences.filter(zp => zp.code.toLowerCase() !== removedZonePref.code.toLowerCase());
      modifiedPlatform.zones = [...modifiedPlatform.zones.filter(zone => zone.properties.code.toLowerCase() !== modifiedZone.properties.code.toLowerCase()), modifiedZone];

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id.toLowerCase() !== platform._id.toLowerCase()), modifiedPlatform],
        currentSpPrefId: null,
        error: null,
        msg: "ZONE_PREF_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.SELECT_ZONE_PREF: {
      console.log("select zone pref: " + action.payload);
      return {
        ...state,
        currentSpPrefId: action.payload
      };
    }

    //*********************************************************************************************************************************************************//
    //************************************************************************ COUNT ***********************************************************************//
    //*********************************************************************************************************************************************************//

    case PlatformAction.ActionTypes.ADD_COUNT_SUCCESS: {
      const addedcount = action.payload;
      const platforms = state.entities.filter(platform => addedcount.codePlatform.toLowerCase() !== platform._id.toLowerCase());
      const modifiedPlatform = state.entities.filter(platform => addedcount.codePlatform.toLowerCase() === platform._id.toLowerCase())[0];
      const modifiedSurvey = modifiedPlatform.surveys.filter(survey => addedcount.codeSurvey.toLowerCase() === survey.code.toLowerCase())[0];
      modifiedSurvey.counts = [...modifiedSurvey.counts.filter(count => count.code.toLowerCase() !== addedcount.code.toLowerCase()), addedcount];
      modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(survey => addedcount.codeSurvey.toLowerCase() !== survey.code.toLowerCase()), modifiedSurvey];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "COUNTS_REGISTERED_SUCCESS" : "COUNTS_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.IMPORT_COUNT_SUCCESS: {
      const addedcounts = action.payload;
      const platforms = state.entities.filter(platform => addedcounts[0].codePlatform.toLowerCase() !== platform._id);
      const modifiedPlatform = state.entities.filter(platform => addedcounts[0].codePlatform.toLowerCase() === platform._id.toLowerCase())[0];
      for(let survey of modifiedPlatform.surveys){
        let currCounts = addedcounts.filter(ac => ac.codeSurvey.toLowerCase()===survey.code.toLowerCase());
        if(currCounts.length > 0) {
          survey.counts = [...survey.counts.filter(c => currCounts.map(d => d.code.toLowerCase()).indexOf(c.code.toLowerCase())<0),...currCounts];
          modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(s => s.code.toLowerCase() !== survey.code.toLowerCase()),survey];
        }
      }

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "COUNTS_REGISTERED_SUCCESS" : "COUNTS_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.CHECK_COUNT_ADD_ERROR: {
      if (action.payload.error) {
        return {
          ...state,
          error: action.payload.error,
          msg: null
        };
      } else {
        return {
          ...state,
          importErrors: action.payload !== "" && action.payload.length > 0 ? [...state.importErrors, ...action.payload] : [...state.importErrors]
        };
      }
    }

    case PlatformAction.ActionTypes.REMOVE_COUNT_SUCCESS: {
      const removedCount = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code.toLowerCase() === removedCount.codePlatform.toLowerCase())[0];
      const modifiedSurvey = modifiedPlatform.surveys.filter(count => count.code.toLowerCase() === removedCount.codeSurvey.toLowerCase())[0];
      modifiedSurvey.counts = modifiedSurvey.counts.filter(count => count.code.toLowerCase() !== removedCount.code.toLowerCase());
      modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(survey => survey.code.toLowerCase()!== removedCount.code.toLowerCase()), modifiedSurvey];

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id.toLowerCase() !== platform._id.toLowerCase()), modifiedPlatform],
        currentCountId: null,
        error: null,
        msg: "COUNT_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.SELECT_COUNT: {
      console.log("select count: " + action.payload);
      return {
        ...state,
        currentCountId: action.payload
      };
    }case PlatformAction.ActionTypes.LOAD: {
      return {
        ...state,
        loading: true
      };
    }

    //*********************************************************************************************************************************************************//
    //************************************************************************ DIVERS && GENERAL ***********************************************************************//
    //*********************************************************************************************************************************************************//

    case PlatformAction.ActionTypes.LOAD_SUCCESS: {
      const platforms = action.payload;
      const newPlatforms = platforms.filter(platform => (state.ids.includes(platform._id) ? false : platform));
      const newPlatformIds = newPlatforms.map(platform => platform._id);
      //console.log(platforms);
      return {
        ...state,
        loading: false,
        loaded: true,
        entities: [...state.entities, ...newPlatforms],
        ids: [...state.ids, ...newPlatformIds],
        error: null,
        msg: null,
        importErrors: []
      };
    }    

    case PlatformAction.ActionTypes.REMOVE_PLATFORM_FAIL:
    case PlatformAction.ActionTypes.ADD_PLATFORM_FAIL:
    case PlatformAction.ActionTypes.ADD_ZONE_FAIL:
    case PlatformAction.ActionTypes.ADD_SURVEY_FAIL:
    case PlatformAction.ActionTypes.ADD_STATION_FAIL:
    case PlatformAction.ActionTypes.ADD_ZONE_PREF_FAIL:
    case PlatformAction.ActionTypes.ADD_COUNT_FAIL: {
      return {
        ...state,
        error: action.payload,
        msg: null
      };
    }

    case PlatformAction.ActionTypes.REMOVE_MSG: {
      return {
        ...state,
        error: null,
        importErrors: [],
        msg: null
      };
    }

    case PlatformAction.ActionTypes.RESET_ALL_PENDING: {
      return platformInitialState;
    }

    default: {
      return state;
    }
  }
}
