import React, { useState } from "react";

interface IImpageUploaderProps {
  handleMouseDown: React.MouseEventHandler<HTMLElement>;
}

const ImageUploader: React.FC<IImpageUploaderProps> = (
  props: IImpageUploaderProps
): JSX.Element => {
  const [imageFile, setFileChanged] = useState("");

  const handleFileChanged = (event: any) => {
    const files: Object[] = event.target.files[0];
    if (!files || files.length === 0) return;
    // 設定預覽圖片
    setFileChanged(URL.createObjectURL(files));
  };

  return (
    <>
      {!imageFile ? (
        <div className="image-upload-section">
          <div className="container">
            <div className="img" />
            <span>Upload image</span>
          </div>
          <input
            className="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChanged(e)}
          />
        </div>
      ) : (
        <div
          className="image-preview-section"
          onMouseDown={(e) => props.handleMouseDown(e)}
        >
          <img id="uploadImage" src={imageFile} draggable="false" />
        </div>
      )}
    </>
  );
};

export default ImageUploader;
