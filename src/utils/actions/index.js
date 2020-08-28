import * as actionTypes from '../constants/action-types'

export const updateTextOnCanvasPositions = (payload) => async dispatch => {

    dispatch (
      { 
        type: actionTypes.UPDATE_TEXT_POSITION_ON_CANVAS,
        payload: payload
      })
  };
export const addTextToCanvas = () => async dispatch => {

    dispatch (
      { 
        type: actionTypes.ADD_TEXT_TO_CANVAS
      })
  };
export const onTextDragStart = (payload) => async dispatch => {
    dispatch (
      { 
        type: actionTypes.ON_TEXT_DRAG_START,
        payload: payload
      })
  };
export const onEditText = (payload) => async dispatch => {
    dispatch (
      { 
        type: actionTypes.EDIT_TEXT_ON_CANVAS,
        payload: payload
      })
  };
export const startEditText = (payload) => async dispatch => {
    dispatch (
      { 
        type: actionTypes.START_EDIT_TEXT_ON_CANVAS,
        payload: payload
      })
  };
export const endEditText = (payload) => async dispatch => {
    dispatch (
      { 
        type: actionTypes.END_EDIT_TEXT_ON_CANVAS,
        payload: payload
      })
  };
export const customFont = (payload) => async dispatch => {
    dispatch (
      { 
        type: actionTypes.CUSTOM_FONT,
        payload: payload
      })
  };
export const addPhotos = (payload) => async dispatch => {
    dispatch (
      { 
        type: actionTypes.ADD_PHOTOS,
        payload: payload
      })
  };