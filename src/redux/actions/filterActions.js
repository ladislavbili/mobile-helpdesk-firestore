import {SET_FILTER_PROJECT, SET_FILTER_FILTER } from '../types';

export const setProject = (projectID) => {
  return dispatch => {
    dispatch({ type: SET_FILTER_PROJECT, projectID });
  };
};

export const setFilter = (filterID) => {
  return dispatch => {
    dispatch({ type: SET_FILTER_FILTER, filterID });
  };
};
