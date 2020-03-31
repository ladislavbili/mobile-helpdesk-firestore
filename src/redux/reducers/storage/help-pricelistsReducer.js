import { STORAGE_SET_HELP_PRICELISTS, STORAGE_HELP_PRICELISTS_ACTIVE, DELETE_USER_DATA } from '../../types'

const initialState = {
  pricelistsActive:false,
  pricelistsLoaded:false,
  pricelists:[]
};

export default function storagePricelistsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_PRICELISTS:{
      return {
        ...state,
        pricelists: action.pricelists,
        pricelistsLoaded:true,
      };
    }
    case STORAGE_HELP_PRICELISTS_ACTIVE:{
      return {
        ...state,
        pricelistsActive: true,
      };
    }

    case DELETE_USER_DATA:{
      return initialState;
    }
    default:
      return state;
  }
}
