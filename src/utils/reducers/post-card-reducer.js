import * as actionTypes from '../constants/action-types';
import produce from "immer"


const initialState = {
  canvasText: [],
  absolutePosition: {
    absX: 0,
    absY: 0
  }
};
  
  const postCardReducer = ( state = initialState, action) => {
    const {payload} = action;

    switch (action.type) { 

      case actionTypes.ADD_TEXT_TO_CANVAS:
      const textSize = state.canvasText.length;

      const nextState_ = produce(state.canvasText, draftState => {
        draftState.push(
          {
            isDragging: false,
            x: 50,
            y: 50,
            index: textSize,
            text: "Double click to edit",
            textEditVisible: false,
            fontFamily: "Trebuchet MS, Helvetica, Sans-Serif",
            color: "black",
            fontStyle: {
              bold: false,
              italic: false
            },
            fontSize: 14
          }
        )
     })
          return { 
            ...state,
            canvasText: nextState_
          }
      case actionTypes.ON_TEXT_DRAG_START:
  
        const nextState__ = produce(state.canvasText, draftState => {
          draftState[payload.index].isDragging = true;
       })
          return { 
            ...state,
            canvasText: nextState__
          }

      case actionTypes.UPDATE_TEXT_POSITION_ON_CANVAS:
  
        const nextState___ = produce(state.canvasText, draftState => {
        draftState[payload.index].isDragging = false
        draftState[payload.index].x = payload.event.target.x()
        draftState[payload.index].y = payload.event.target.y()
       })

          return { 
            ...state,
            canvasText: nextState___
          }
      case actionTypes.START_EDIT_TEXT_ON_CANVAS:

        const nextState__1 = produce(state.canvasText, draftState => {
          draftState[payload.index].textEditVisible = true
         })

        const absPos = payload.event.target.getAbsolutePosition();

        const nextState__1_ = produce(state.absolutePosition, draftState => {
          draftState.absX = absPos.x
          draftState.absY = absPos.y
         })
          return { 
            ...state,
            canvasText: nextState__1,
            absolutePosition: nextState__1_
          }
  
      case actionTypes.EDIT_TEXT_ON_CANVAS:

        const nextState__2 = produce(state.canvasText, draftState => {
          draftState[payload.index].text = payload.event.target.value
         })
          return { 
            ...state,
            canvasText: nextState__2
          }
      case actionTypes.END_EDIT_TEXT_ON_CANVAS:

        let nextState__3;
        if (payload.event.keyCode === 13 && !payload.event.shiftKey) {
           nextState__3 = produce(state.canvasText, draftState => {
            draftState[payload.index].textEditVisible = false
           })
           return { 
            ...state,
            canvasText: nextState__3
          }
        }
        if (payload.event.keyCode === 27) {
          return { 
            ...state
          }
        }
        return { 
          ...state
        }
        case actionTypes.CUSTOM_FONT:

          let nextState___2;
          nextState___2 = payload.what === "font"? produce(state.canvasText, draftState => {
            draftState[payload.index].fontFamily = payload.font
           }): payload.what === "bold" ? produce(state.canvasText, draftState => {
            draftState[payload.index].fontStyle.bold = !state.canvasText[payload.index].fontStyle.bold
           }): payload.what === "italic" ? produce(state.canvasText, draftState => {
            draftState[payload.index].fontStyle.italic = !state.canvasText[payload.index].fontStyle.italic
           }): payload.what === "color" ? produce(state.canvasText, draftState => {
            draftState[payload.index].color = payload.value.target.value
           }): produce(state.canvasText, draftState => {
            draftState[payload.index].fontSize = payload.value.target.value
           })
            return { 
              ...state,
              canvasText: nextState___2
            }
          
      default:
        return state;
    }
  };
  
  export default postCardReducer;