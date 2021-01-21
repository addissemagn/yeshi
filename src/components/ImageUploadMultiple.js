import React, { useState } from "react";

const ImageUploadMultiple = ({ onUpload }) => {
  const [files, setFiles] = useState(null);

  return (
    <div className="ImageUpload">
      <div className="RecipeForm__section-header">
        <h3>
          <span role="img" aria-label="camera">
            📷
          </span>{" "}
          Add images
        </h3>
        <input
          type="file"
          id="image"
          onChange={(e) => setFiles(e.target.files)}
          multiple
        />
      </div>
      {files && (
        <button
          className="Recipe__button Navigation__button-active mt-22"
          onClick={() => onUpload(files)}
        >
          Upload
        </button>
      )}
    </div>
  );
};

export default ImageUploadMultiple;
