import { PlatformAction } from "../actions/index";
import { IPlatformState, platformInitialState } from "../states/index";
import { Platform } from "../models/index";

export function platformReducer(state: IPlatformState = platformInitialState, action: PlatformAction.Actions): IPlatformState {
  switch (action.type) {
    case PlatformAction.ActionTypes.LOAD: {
      return {
        ...state,
        loading: true
      };
    }

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

    case PlatformAction.ActionTypes.ADD_PLATFORM_SUCCESS:
    case PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS: {
      const addedplatform = action.payload;
      const platforms = state.entities.filter(platform => addedplatform._id !== platform._id);
      return {
        ...state,
        entities: [...platforms, ...addedplatform],
        ids: [...state.ids.filter(id => addedplatform._id !== id), ...addedplatform._id],
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

    case PlatformAction.ActionTypes.ADD_ZONE_SUCCESS:
    case PlatformAction.ActionTypes.IMPORT_ZONE_SUCCESS: {
      const addedzone = action.payload;
      const platforms = state.entities.filter(platform => addedzone.codePlatform !== platform._id);
      const modifiedPlatform = state.entities.filter(platform => addedzone.codePlatform === platform._id)[0];
      modifiedPlatform.zones = [...modifiedPlatform.zones.filter(zone => addedzone.properties.code !== zone.properties.code), addedzone];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedzone.codePlatform !== id), ...addedzone.codePlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "ZONES_REGISTERED_SUCCESS" : "ZONES_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.ADD_SURVEY_SUCCESS:
    case PlatformAction.ActionTypes.IMPORT_SURVEY_SUCCESS: {
      const addedsurvey = action.payload;
      const platforms = state.entities.filter(platform => addedsurvey.codePlatform !== platform._id);
      const modifiedPlatform = state.entities.filter(platform => addedsurvey.codePlatform === platform._id)[0];
      modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(survey => addedsurvey.code !== survey.code), addedsurvey];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedsurvey.codePlatform !== id), ...addedsurvey.codePlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "SURVEYS_REGISTERED_SUCCESS" : "SURVEYS_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.ADD_PENDING_SURVEY_SUCCESS: {
      const addedsurvey = action.payload;
      const platforms = state.entities.filter(platform => addedsurvey.codePlatform !== platform._id);
      const modifiedPlatform = state.entities.filter(platform => addedsurvey.codePlatform === platform._id)[0];
      modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(survey => addedsurvey.code !== survey.code), addedsurvey];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedsurvey.codePlatform !== id), ...addedsurvey.codePlatform],
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
          importErrors: action.payload !== "" && action.payload.length > 0 ? [...state.importErrors, action.payload] : [...state.importErrors]
        };
      }
    }

    case PlatformAction.ActionTypes.ADD_STATION_SUCCESS:
    case PlatformAction.ActionTypes.IMPORT_STATION_SUCCESS: {
      const addedstation = action.payload;
      const platforms = state.entities.filter(platform => addedstation.codePlatform !== platform._id);
      const modifiedPlatform = state.entities.filter(platform => addedstation.codePlatform === platform.code)[0];
      modifiedPlatform.stations = [
        ...modifiedPlatform.stations.filter(station => addedstation.properties.code !== station.properties.code),
        addedstation
      ];
      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedstation.codePlatform !== id), ...addedstation.codePlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "STATIONS_REGISTERED_SUCCESS" : "STATIONS_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.ADD_PENDING_STATION_SUCCESS: {
      const addedstation = action.payload;
      const platforms = state.entities.filter(platform => addedstation.codePlatform !== platform._id);
      const modifiedPlatform = state.entities.filter(platform => addedstation.codePlatform === platform._id)[0];
      modifiedPlatform.stations = [
        ...modifiedPlatform.stations.filter(station => addedstation.properties.code !== station.properties.code),
        addedstation
      ];
      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedstation.codePlatform !== id), ...addedstation.codePlatform],
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
          importErrors: action.payload !== "" && action.payload.length > 0 ? [...state.importErrors, action.payload] : [...state.importErrors]
        };
      }
    }

    case PlatformAction.ActionTypes.ADD_ZONE_PREF_SUCCESS:
    case PlatformAction.ActionTypes.IMPORT_ZONE_PREF_SUCCESS: {
      const addedzonepref = action.payload;
      const platforms = state.entities.filter(platform => addedzonepref.codePlatform !== platform._id);
      const modifiedPlatform = state.entities.filter(platform => addedzonepref.codePlatform === platform._id)[0];
      const modifiedZone = modifiedPlatform.zones.filter(zone => addedzonepref.codeZone === zone.properties.code)[0];
      modifiedZone.zonePreferences = [...modifiedZone.zonePreferences.filter(station => addedzonepref.code !== station.code), addedzonepref];
      modifiedPlatform.zones = [...modifiedPlatform.zones.filter(zone => addedzonepref.codeZone !== zone.properties.code), modifiedZone];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedzonepref.codePlatform !== id), ...addedzonepref.codePlatform],
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

    case PlatformAction.ActionTypes.ADD_COUNT_SUCCESS:
    case PlatformAction.ActionTypes.IMPORT_COUNT_SUCCESS: {
      const addedcount = action.payload;
      const platforms = state.entities.filter(platform => addedcount.codePlatform !== platform._id);
      const modifiedPlatform = state.entities.filter(platform => addedcount.codePlatform === platform._id)[0];
      const modifiedSurvey = modifiedPlatform.surveys.filter(survey => addedcount.codeSurvey === survey.code)[0];
      modifiedSurvey.counts = [...modifiedSurvey.counts.filter(count => count.code !== addedcount.code), addedcount];
      modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(survey => addedcount.codeSurvey !== survey.code), modifiedSurvey];

      return {
        ...state,
        entities: [...platforms, modifiedPlatform],
        ids: [...state.ids.filter(id => addedcount.codePlatform !== id), ...addedcount.codePlatform],
        error: null,
        msg: action.type === PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS ? "COUNTS_REGISTERED_SUCCESS" : "COUNTS_REGISTERED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_PLATFORM_COUNTRY_SUCCESS: {
      const removedPlatform = action.payload;
      return {
        ...state,
        entities: state.entities.filter(platform => removedPlatform._id !== platform._id),
        ids: state.ids.filter(id => id !== removedPlatform._id),
        currentPlatformId: null,
        error: null
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
          importErrors: action.payload !== "" && action.payload.length > 0 ? [...state.importErrors, action.payload] : [...state.importErrors]
        };
      }
    }

    case PlatformAction.ActionTypes.REMOVE_PLATFORM_SUCCESS: {
      const removedPlatform = action.payload;
      return {
        ...state,
        entities: state.entities.filter(platform => removedPlatform._id !== platform._id),
        ids: state.ids.filter(id => id !== removedPlatform._id),
        currentPlatformId: null,
        error: null,
        msg: "PLATFORM_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_ALL_ZONE_SUCCESS: {
      const modifiedPlatform = state.entities.filter(platform => platform.code === action.payload.code)[0];
      modifiedPlatform.zones = [];

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        ids: [...state.ids.filter(id => id !== modifiedPlatform._id), modifiedPlatform._id],
        currentZoneId: null,
        error: null,
        msg: null
      };
    }

    case PlatformAction.ActionTypes.REMOVE_ZONE_SUCCESS: {
      const removedZone = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code === removedZone.codePlatform)[0];
      modifiedPlatform.zones = modifiedPlatform.zones.filter(zone => zone.properties.code !== removedZone.properties.code);
      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        ids: [...state.ids.filter(id => id !== modifiedPlatform._id), modifiedPlatform._id],
        currentZoneId: null,
        error: null,
        msg: "ZONE_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_SURVEY_SUCCESS: {
      const removedSurvey = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code === removedSurvey.codePlatform)[0];
      modifiedPlatform.surveys = modifiedPlatform.surveys.filter(survey => survey.code !== removedSurvey.code);

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        ids: [...state.ids.filter(id => id !== modifiedPlatform._id), modifiedPlatform._id],
        currentSurveyId: null,
        error: null,
        msg: "SURVEY_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_PENDING_SURVEY_SUCCESS: {
      const removedSurvey = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code === removedSurvey.codePlatform)[0];
      modifiedPlatform.surveys = modifiedPlatform.surveys.filter(survey => survey.code !== removedSurvey.code);

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        ids: [...state.ids.filter(id => id !== modifiedPlatform._id), modifiedPlatform._id],
        error: null
      };
    }

    case PlatformAction.ActionTypes.REMOVE_STATION_SUCCESS: {
      const removedStation = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code === removedStation.codePlatform)[0];
      modifiedPlatform.stations = modifiedPlatform.stations.filter(station => station.properties.code !== removedStation.properties.code);

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        ids: [...state.ids.filter(id => id !== modifiedPlatform._id), modifiedPlatform._id],
        currentStationId: null,
        error: null,
        msg: "STATION_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_PENDING_STATION_SUCCESS: {
      const removedStation = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code === removedStation.codePlatform)[0];
      modifiedPlatform.stations = modifiedPlatform.stations.filter(station => station.properties.code !== removedStation.properties.code);

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        ids: [...state.ids.filter(id => id !== modifiedPlatform._id), modifiedPlatform._id],
        currentStationId: null,
        error: null
      };
    }

    case PlatformAction.ActionTypes.REMOVE_ZONE_PREF_SUCCESS: {
      const removedZonePref = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code === removedZonePref.codePlatform)[0];
      const modifiedZone = modifiedPlatform.zones.filter(zone => zone.properties.code === removedZonePref.codeZone)[0];
      modifiedZone.zonePreferences = modifiedZone.zonePreferences.filter(zp => zp.code !== removedZonePref.code);
      modifiedPlatform.zones = [...modifiedPlatform.zones.filter(zone => zone.properties.code !== modifiedZone.properties.code), modifiedZone];

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        ids: [...state.ids.filter(id => id !== modifiedPlatform._id), modifiedPlatform._id],
        currentSpPrefId: null,
        error: null,
        msg: "ZONE_PREF_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_COUNT_SUCCESS: {
      const removedCount = action.payload;
      const modifiedPlatform = state.entities.filter(platform => platform.code === removedCount.codePlatform)[0];
      const modifiedSurvey = modifiedPlatform.surveys.filter(count => count.code === removedCount.codeSurvey)[0];
      modifiedSurvey.counts = modifiedSurvey.counts.filter(count => count.code !== removedCount.code);
      modifiedPlatform.surveys = [...modifiedPlatform.surveys.filter(survey => survey.code !== removedCount.code), modifiedSurvey];

      return {
        ...state,
        entities: [...state.entities.filter(platform => modifiedPlatform._id !== platform._id), modifiedPlatform],
        ids: [...state.ids.filter(id => id !== modifiedPlatform._id), modifiedPlatform._id],
        currentCountId: null,
        error: null,
        msg: "COUNT_REMOVED_SUCCESS"
      };
    }

    case PlatformAction.ActionTypes.REMOVE_PLATFORM_FAIL:
    case PlatformAction.ActionTypes.ADD_PLATFORM_FAIL: {
      return {
        ...state,
        error: action.payload,
        msg: null
      };
    }

    case PlatformAction.ActionTypes.SELECT_PLATFORM: {
      console.log("select platform: " + action.payload);
      return {
        ...state,
        currentPlatformId: action.payload
      };
    }

    case PlatformAction.ActionTypes.SELECT_ZONE: {
      console.log("select zone: " + action.payload);
      return {
        ...state,
        currentZoneId: action.payload
      };
    }

    case PlatformAction.ActionTypes.SELECT_SURVEY: {
      console.log("select survey: " + action.payload);
      return {
        ...state,
        currentSurveyId: action.payload
      };
    }

    case PlatformAction.ActionTypes.SELECT_STATION: {
      console.log("select station: " + action.payload);
      return {
        ...state,
        currentStationId: action.payload
      };
    }

    case PlatformAction.ActionTypes.SELECT_ZONE_PREF: {
      console.log("select zone pref: " + action.payload);
      return {
        ...state,
        currentSpPrefId: action.payload
      };
    }

    case PlatformAction.ActionTypes.SELECT_COUNT: {
      console.log("select count: " + action.payload);
      return {
        ...state,
        currentCountId: action.payload
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
