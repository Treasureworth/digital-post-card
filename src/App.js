import React, {useState, useRef, useEffect} from 'react';
import { Stage, Layer, Text, Image, Transformer, Rect } from 'react-konva';
import './App.css';
import {useDispatch, useSelector} from 'react-redux';
import * as actionMethods from '../src/utils/actions/index'
import useImage from 'use-image';
import ImageUploadComponent from './components/image-upload';
import {generateKey} from '../src/utils/generate-key'
import 'react-notifications-component/dist/theme.css'
import ReactNotification, {store} from 'react-notifications-component'




function App() {

  const dispatch = useDispatch();
  const {canvasText, absolutePosition} = useSelector(state => state.postCardReducer)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentFontFamily, setCurrentFontFamily] = useState("Arial, Helvetica, Sans-Serif")
  const [currentFontSize, setCurrentFontSize] = useState(14)
  const [currentColor, setCurrentColor] = useState('black')
  const [backgroundColor, setBackgroundColor] = useState('white')
  const [images, setImages] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('text');

  const [postCardSize, setPostCardSize] = useState({
    width: 1000,
    height: 500
  })

  const setPostCardDimension = (dimension, value) => {
    dimension === "width"? setPostCardSize({...postCardSize, width: ~~value}): setPostCardSize({...postCardSize, height: ~~value});
  }
  
  const fontFamily = useRef(null)
  const stageRef = useRef();
  const dragUrl = useRef();
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  const ImageDragFunction = (value) => {
    dragUrl.current = value.target.src;
  }

  const URLImage = ({ image, onChange, shapeProps, onSelect, isSelected }) => {
    const [img] = useImage(image.src);

    useEffect(() => {
      if (isSelected) {
        // we need to attach transformer manually
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    return (
      <>
        <Image
          image={img}
          x={image.x}
          y={image.y}
          offsetX={img ? img.width / 2 : 0}
          offsetY={img ? img.height / 2 : 0}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          width={image.width}
          height={image.height}
        //   onDragStart={
        //   e => console.log(e.target.x(), e.target.y())
        // }
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            console.log(Math.max(5, node.width() * scaleX))
            console.log(Math.max(node.height() * scaleY))
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            });
          }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
    );
  };
  const [selectedId, selectShape] = React.useState(null);
  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    // const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnEmpty = e === "Background";
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };
  const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCanvas = event => {
    event.preventDefault();
    const dataURL = stageRef.current.toDataURL({
      mimeType: "image/jpeg",
      quality: 0,
      pixelRatio: 2
    });
    downloadURI(dataURL, "Preview your postcard");
  };

  const handleSaveCanvas = event => {
    store.addNotification({
      title: "Postcard Design!",
      message: "Your postcard design has been successfully saved",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true
      }
    });
  };

  const handleSubmitCanvas = () => {
    const jsonformat = stageRef.current.toJSON();
    store.addNotification({
      title: "Postcard Design Submitted!",
      message: jsonformat,
      type: "info",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 15000,
        onScreen: true
      }
    });
  }
  
  return (<>
    <ReactNotification />
    <div className="container">
      <div className="side-menu">
          <div className="cursor add-text" onClick={() => {
                                                          setSelectedMenu("text");
                                                          dispatch(actionMethods.addTextToCanvas())
                                                          }}>
            <span style={{fontSize: 36}}>T</span>
            <span style={{fontSize: 12}}>Add Text</span>         
          </div>
      <div className="add-text cursor" style={{marginTop: 50}} onClick={() => setSelectedMenu("image")}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 5H4v14l9.292-9.294a1 1 0 0 1 1.414 0L20 15.01V5zM2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="rgba(255,255,255,1)"/></svg>
        <span style={{fontSize: 12, marginTop: 5}}> Add Image</span>
      </div>
      <div className="add-text cursor" style={{marginTop: 50}} onClick={() => setSelectedMenu("background")}>
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667 0 .422.167.811.422 1.1.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22 6.478 22 2 17.522 2 12S6.478 2 12 2zm-1.189 16.111a3.664 3.664 0 0 1 3.667-3.667h1.966A3.558 3.558 0 0 0 20 10.89C20 7.139 16.468 4 12 4a8 8 0 0 0-.676 15.972 3.648 3.648 0 0 1-.513-1.86zM7.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="rgba(255,255,255,1)"/></svg>
        <span style={{fontSize: 12, textAlign: "center", marginTop: 5}}> Change Background Color</span>
      </div>
      </div>

      <div className="side-menu-content">
          {
            selectedMenu === "text"? <><p>Click on "Add Text Menu to place text on your postcard</p><p>Double click a text to edit it's content.</p> <p>Press the return key to end editting mode.</p> <p>Click on a text to style it.</p></>:
            selectedMenu === "background"?<> <p>Click to pick Postcard Background Color </p> <input className="background-image" type="color" onChange={(value) => setBackgroundColor(value.target.value)}/></>:selectedMenu === "image"?
            <ImageUploadComponent onDragMethod={ImageDragFunction}/>
          }
          <div style={{display: 'flex',
                        flexDirection: 'column',
                        marginTop: 150}}>
                <button className="preview-button" onClick={handleDownloadCanvas}>Download postcard preview</button>
                <button className="preview-button" onClick={handleSaveCanvas}>Save postcard</button>
                <button className="preview-button" onClick={handleSubmitCanvas}>Submit</button>
          </div>
      </div>

      <div className="canvas-container">
        <div className="control-pane">
          <div className="page-size">
            <span className="margin-right"> Select page size</span>
              <input type="number" 
                     name="width" 
                     placeholder="Page Width" 
                     onChange={(event) => setPostCardDimension("width", event.target.value)}/>

              <input type="number" 
                     name="height" 
                     placeholder="Page Height"
                     onChange={(event) => setPostCardDimension("height", event.target.value)}
                     />
              <span className="margin-right"> Select font</span>
              <select name="fontSize" ref={fontFamily} onChange={() => {  setCurrentFontFamily(fontFamily.current.value);
                                                                          dispatch(actionMethods.customFont({index: currentIndex, 
                                                                                                          font: fontFamily.current.value,
                                                                                                          what: 'font'}))}}>
                  <option value="Arial, Helvetica, Sans-Serif">Arial, Helvetica, Sans-Serif</option>
                  <option value="Arial Black, Gadget, Sans-Serif">Arial Black, Gadget, Sans-Serif</option>
                  <option value="Comic Sans MS, Textile, Cursive">Comic Sans MS, Textile, Cursive</option>
                  <option value="Courier New, Courier, Monospace">Courier New, Courier, Monospace</option>
                  <option value="Georgia, Times New Roman, Times, Seri">Georgia, Times New Roman, Times, Serif</option>
                  <option value="Impact, Charcoal, Sans-Serif">Impact, Charcoal, Sans-Serif</option>
                  <option value="Lucida Console, Monaco, Monospace">Lucida Console, Monaco, Monospace</option>
                  <option value="Lucida Sans Unicode, Lucida Grande, Sans-Serif">Lucida Sans Unicode, Lucida Grande, Sans-Serif</option>
                  <option value="Palatino Linotype, Book Antiqua, Palatino, Serif">Palatino Linotype, Book Antiqua, Palatino, Serif</option>
                  <option value="Tahoma, Geneva, Sans-Serif">Tahoma, Geneva, Sans-Serif</option>
                  <option value="Times New Roman, Times, Serif">Times New Roman, Times, Serif</option>
                  <option value="Trebuchet MS, Helvetica, Sans-Serif">Trebuchet MS, Helvetica, Sans-Serif</option>
                  <option value="Verdana, Geneva, Sans-Serif">Verdana, Geneva, Sans-Serif</option>
                  <option value="MS Sans Serif, Geneva, Sans-Serif">MS Sans Serif, Geneva, Sans-Serif</option>
                  <option value="MS Serif, New York, Serif">MS Serif, New York, Serif</option>
              </select>
              <span className="margin-right"> Style font:</span>
              <button className="fontStyling bold" onClick={() => dispatch(actionMethods.customFont({index: currentIndex, 
                                                                                                          what: 'bold'}))}> 
                      Bold
              </button>
              <button className="fontStyling italic" onClick={() => dispatch(actionMethods.customFont({index: currentIndex, 
                                                                                                          what: 'italic'}))}> 
                      Italic
              </button>
              <span className="margin-right"> Font color:</span>
              <input type="color" onChange={(value) => {  setCurrentColor(value.target.value);
                                                          dispatch(actionMethods.customFont({index: currentIndex, 
                                                                                          what: 'color',
                                                                                          value: value}))}}/>
              <span className="margin-right"> Select font size</span>
              <input type="number" defaultValue="14" onChange={(value) => { setCurrentFontSize(value.target.value);
                                                                            dispatch(actionMethods.customFont({index: currentIndex, 
                                                                                          what: 'fontSize',
                                                                                          value: value}))}}/>
          </div>
        </div>
        <div className="canvas"
            onDrop={e => {
              // register event position
              stageRef.current.setPointersPositions(e);
              // add image
              const id = generateKey(5)
              setImages(
                images.concat([
                  {
                    // shapeProps: e,
                    ...stageRef.current.getPointerPosition(),
                    src: dragUrl.current,
                    id: id
                  }
                ])
              );
            }}
            onDragOver={e => e.preventDefault()}
            >
          <Stage width={postCardSize.width} 
                 height={postCardSize.height}
                 ref={stageRef}
                 onMouseDown={(e) => checkDeselect(e)}
                 onTouchStart={(e) => checkDeselect(e)}>
            <Layer>
              {/* This serves as the background. Canvas is trasparent by default */}
              <Rect
                width={postCardSize.width} 
                height={postCardSize.height}
                fill={backgroundColor}
                onClick={() => checkDeselect("Background")}
              >
              </Rect>
            {canvasText.map(textObject =>
                  <Text
                    key={textObject.index}
                    text={textObject.text}
                    x={textObject.x}
                    y={textObject.y}
                    draggable
                    onClick={() => setCurrentIndex(textObject.index)}
                    onDblClick={(event) => {
                      setCurrentIndex(textObject.index)
                      dispatch(actionMethods.startEditText({event: event, index: currentIndex}))
                    }}
                    fontSize={~~textObject.fontSize}
                    fontStyle={textObject.fontStyle.bold && textObject.fontStyle.italic? 
                              "bold italic": textObject.fontStyle.bold && !textObject.fontStyle.italic?
                              "bold": !textObject.fontStyle.bold && !textObject.fontStyle.italic?
                              "": "italic"}
                    fontFamily={textObject.fontFamily}
                    fill={canvasText[textObject.index].isDragging ? '#D5DFE5' : textObject.color}
                    onDragStart={() => dispatch(actionMethods.onTextDragStart({index: textObject.index}))}
                    onDragEnd={event => dispatch(actionMethods.updateTextOnCanvasPositions({index: textObject.index, event: event}))}
                  />
              )}

            {images.map((image, i) => {
              return <URLImage 
                          key={generateKey(4)} 
                          image={image}
                          isSelected = {image.id === selectedId ? true : false}
                          shapeProps={image}
                          onSelect={() => {
                            selectShape(image.id);
                          }}
                          onChange={(newAttrs) => {
                            // console.log(i);
                            // console.log(newAttrs)
                            const imgs = images.slice();
                            console.log(imgs);
                            imgs[i] = newAttrs;
                            setImages(imgs);
                          }}
                          />;
            })}

            </Layer>
          </Stage>
  
            {canvasText.length > 0? <textarea
              value={canvasText[currentIndex].text}
              style={{
                display: canvasText[currentIndex].textEditVisible ? 'block' : 'none',
                position: 'absolute',
                top: ~~absolutePosition.absY +168 + 'px',
                left: ~~absolutePosition.absX+565+'px',
                margin: 'auto',
                fontFamily: currentFontFamily,
                fontSize: currentFontSize,
                color: currentColor,
                backgroundColor: backgroundColor
              }}
              onChange={(event) => dispatch(actionMethods.onEditText({event: event, index: currentIndex}))}
              onKeyDown={(event) => dispatch(actionMethods.endEditText({event: event, index: currentIndex}))}
            />: ''}
        </div>
      </div>
    </div>
    <div className="logo-watermark">
              <img src="https://descasio.com/wp-content/uploads/2018/06/descasio-logo-new-no-bg-copy.png" alt="..." />
          </div>
    </>
  );
}

export default App;
