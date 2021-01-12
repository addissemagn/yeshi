import React, { useState } from "react";

const ImageUpload = ({ onUpload }) => {
  const [image, setImage] = useState(null)

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setImage(URL.createObjectURL(img))
      onUpload();
    }
  };

  return (
    <div className="ImageUpload">
        <div className="RecipeForm__section-header">
          <h3><span role="img" aria-label="camera">📷</span> Import image (OCR)</h3>
          <input type="file" name="myImage" onChange={onImageChange} />
        </div>
        <img src={image} />
    </div>
  );
}
export default ImageUpload;