import React, {useState, useRef} from 'react';
import { Stage, Layer, Text } from 'react-konva';
import '../../App.css';

function HomeComponent() {
  const [state, setState] = useState([])

  const [postCardSize, setPostCardSize] = useState({
    width: 1000,
    height: 500
  })

  const [canvasText, setCanvasText] = useState([])

  const [contentText, setContentText] = useState("Double click to edit")

  const setPostCardDimension = (dimension, value) => {
    dimension === "width"? setPostCardSize({...postCardSize, width: ~~value}): setPostCardSize({...postCardSize, height: ~~value});
  }
  
  const updateTextToCanvasPositions = (index, e) => {

    let newState = [...state];

    newState[index] = {
      isDragging: false,
      x: e.target.x(),
      y: e.target.y()
    };

    setState(newState);
  
  }

  const onTextDragStart = (index) => {

    let newState = [...state];

    newState[index] = {
      ...newState[index],
      isDragging: true,
    };

    setState(newState);
  }

  const textRef = useRef("");

  const addTextToCanvas = () => {
    
    const canvasTextLenght = state.length;

    setState(prevValue => prevValue.concat({
      isDragging: false,
      x: 50,
      y: 50,
      index: canvasTextLenght,
      text: "Double click to edit"
    }))

    setCanvasText(prevValue => prevValue.concat(<Text
      key={canvasTextLenght}
      text={state[canvasTextLenght].text}
      x={state[canvasTextLenght].x}
      y={state[canvasTextLenght].y}
      draggable
      // ref={textRef}
      inputRef={textRef}
      onDblClick={(event) => editText(event)}
      fontSize={20}
      fontStyle="bold"
      fontFamily="impact"
      fill={state.isDragging ? 'green' : 'black'}
      onDragStart={() => onTextDragStart(canvasTextLenght)}
      onDragEnd={e => updateTextToCanvasPositions(canvasTextLenght, e)}
    />));

  }

  const editText = (event) => {
    console.log(event.target._partialText);
    setContentText("This text was changed");
  }

  return (
    <div className="container">
      <div className="side-menu">

      </div>
    
      <div className="side-menu-content">
        <h2 className="cursor" onClick={addTextToCanvas}>Add a header text</h2>
        <h4 className="cursor" onClick={addTextToCanvas}>Add sub-header text</h4>
        <span className="cursor" onClick={addTextToCanvas}>Add a body text</span>
      </div>
      <div className="canvas-container">
        <div className="control-pane">
          <div className="page-size">
              <span> Select page size</span>
              <input type="number" 
                     name="width" 
                     placeholder="Page Width" 
                     onChange={(event) => setPostCardDimension("width", event.target.value)}/>

              <input type="number" 
                     name="height" 
                     placeholder="Page Height"
                     onChange={(event) => setPostCardDimension("height", event.target.value)}
                     />
          </div>
        </div>
        <div className="canvas">
          <Stage width={postCardSize.width} height={postCardSize.height}>
            <Layer>
            {canvasText.map(textObject => textObject)}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
