import React, {useState} from "react";
 
import ImageUploading from "react-images-uploading";
// { ImageUploadingPropsType, ImageListType, ImageType } is type for typescript
 
const maxNumber = 10;
const maxMbFileSize = 5 * 1024 * 1024; // 5Mb
 
const ImageUploadComponent = (props) => {
  const [images, setImages] = useState([]);
 
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImages(imageList);
    // console.log('index of new chosen images: ', addUpdateIndex)
  };
  const onError = (errors, files) => {
    console.log(errors, files);
  };
 
  
    return (
      <ImageUploading
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        multiple
        maxFileSize={maxMbFileSize}
        acceptType={["jpg", "gif", "png"]}
        onError={onError}
        dataURLKey="data_url"
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove }) => (
          // write your building UI
          <div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <button className="upload-button" onClick={onImageUpload}>Upload images</button>
                <button className="delete-button" onClick={onImageRemoveAll}>Remove all images</button>
            </div> 
            <p>Upload your image here and then drag and drop on your postcard.</p>
            <p>Click on your image to resize.</p>
            {imageList.map((image, index) => (
              <div key={index} className="image-child">
                <img src={image.data_url}  
                     draggable="true"
                     alt="uploaded"
                     onDragStart={e => {
                        props.onDragMethod(e);
                      }}
                      />
                <div style={{marginTop: 15}}>
                    <button className="delete-button" onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    );
}

export default ImageUploadComponent;