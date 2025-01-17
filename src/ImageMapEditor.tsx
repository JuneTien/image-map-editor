import React, { useState } from "react";
import "./App.css";
import ImageUploadContainer from "./ImageUploadContainer";
import ImageDetailPreview from "./ImageDetailPreview";

const ImageMapEditor = () => {
  const [previewDetail, setPreviewDetail] = useState([{}]);
  const [rangeSeletorIndex, setRangeSeletorIndex] = useState(0);

  // 取得圖片相關尺寸與位置資訊
  const getImageInfo = (imageEl: any) => {
    const realImg = new Image();
    realImg.src = imageEl.src;
    return {
      width: imageEl.offsetWidth,
      height: imageEl.offsetHeight,
      realWidth: realImg.width,
      realHeight: realImg.height,
      imgPositionX: imageEl.parentNode.offsetLeft,
      imgPositionY: imageEl.parentNode.offsetTop,
    };
  };

  // 處理範圍圈選功能 (點擊開始 & 點擊結束圈選)
  let start_x = 0;
  let start_y = 0;
  let end_x = 0;
  let end_y = 0;

  // 產生範圍圈選區塊
  const createRangeSelector = () => {
    const rangeSelector: HTMLElement = document.createElement("div");
    const deleteBtn: HTMLElement = document.createElement("div");
    const deleteIcon: HTMLElement = document.createElement("div");
    rangeSelector.appendChild(deleteBtn);
    deleteBtn.appendChild(deleteIcon);
    rangeSelector.setAttribute("id", `rangeSelector_${rangeSeletorIndex}`);
    rangeSelector.className = "range-selector";
    deleteBtn.className = "delete-btn";
    deleteIcon.className = "delete-icon";
    deleteIcon.setAttribute("id", `trash_${rangeSeletorIndex}`);

    // 刪除事件處理
    deleteIcon.onclick = (): void => {
      rangeSelector.style.backgroundColor = "#f5f9fa";
      rangeSelector.style.border = "initial";
      (global as any).document.getElementById(
        `rangeSelector_${rangeSeletorIndex}`
      ).children[0].style.display = "none";
    };
    document.body.appendChild(rangeSelector);
    return rangeSelector;
  };

  // 滑鼠圈選範圍，是否在圖片範圍內
  const isInImageRange = (
    mouseX: number,
    mouseY: number,
    uploadImgEl: HTMLElement
  ) => {
    if (
      Math.abs(getImageInfo(uploadImgEl).imgPositionX - mouseX) >
      getImageInfo(uploadImgEl).width
    ) {
      return false;
    }
    if (mouseX < getImageInfo(uploadImgEl).imgPositionX) {
      return false;
    }
    if (
      Math.abs(getImageInfo(uploadImgEl).imgPositionY - mouseY) >
      getImageInfo(uploadImgEl).height
    ) {
      return false;
    }
    if (mouseY < getImageInfo(uploadImgEl).imgPositionY) {
      return false;
    }
    return true;
  };

  const handleMouseUp = (event: MouseEvent) => {
    const rangeSelector = (global as any).document.getElementById(
      `rangeSelector_${rangeSeletorIndex}`
    );

    const uploadImgEl = (global as any).document.getElementById("uploadImage");

    // 圖片尺寸
    const imgWidth = getImageInfo(uploadImgEl).width;
    const imgHeight = getImageInfo(uploadImgEl).height;

    // 原始圖片尺寸
    const imgRealWidth = getImageInfo(uploadImgEl).realWidth;
    const imgRealHeight = getImageInfo(uploadImgEl).realHeight;

    // 原始圖片：載入後圖片的比值
    const widthRatio = imgRealWidth / imgWidth;
    const heightRatio = imgRealHeight / imgHeight;

    // 圖片位置
    const imgPositionX = getImageInfo(uploadImgEl).imgPositionX;
    const imgPositionY = getImageInfo(uploadImgEl).imgPositionY;

    end_x = event.clientX;
    end_y = event.clientY;

    // 若超出範圍，則移除圈選範圍
    if (!isInImageRange(end_x, end_y, uploadImgEl)) {
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseup", handleMouseUp);
      rangeSelector.remove();
      return;
    } else {
      rangeSelector.style.left = Math.min(end_x, start_x) + "px";
      rangeSelector.style.top = Math.min(end_y, start_y) + "px";
      rangeSelector.style.width = Math.abs(start_x - end_x) + "px";
      rangeSelector.style.height = Math.abs(start_y - end_y) + "px";
    }

    // 顯示垃圾桶按鈕
    (global as any).document.getElementById(
      `rangeSelector_${rangeSeletorIndex}`
    ).children[0].style.display = "block";

    setRangeSeletorIndex(rangeSeletorIndex + 1);

    // 於 preview 區塊顯示圈選範圍的資訊
    Object.keys(previewDetail[0]).length > 0
      ? setPreviewDetail([
          ...previewDetail,
          {
            x: rangeSelector.offsetLeft - imgPositionX,
            y: rangeSelector.offsetTop - imgPositionY,
            width: Math.round(rangeSelector.clientWidth * widthRatio),
            height: Math.round(rangeSelector.clientHeight * heightRatio),
          },
        ])
      : setPreviewDetail([
          {
            x: rangeSelector.offsetLeft - imgPositionX,
            y: rangeSelector.offsetTop - imgPositionY,
            width: Math.round(rangeSelector.clientWidth * widthRatio),
            height: Math.round(rangeSelector.clientHeight * heightRatio),
          },
        ]);

    document.body.removeEventListener("mousemove", handleMouseMove);
    document.body.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const rangeSelector = (global as any).document.getElementById(
      `rangeSelector_${rangeSeletorIndex}`
    );

    rangeSelector.style.left = Math.min(event.clientX, start_x) + "px";
    rangeSelector.style.top = Math.min(event.clientY, start_y) + "px";
    rangeSelector.style.width = Math.abs(start_x - event.clientX) + "px";
    rangeSelector.style.height = Math.abs(start_y - event.clientY) + "px";
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    // 產生範圍圈選區塊
    const rangeSelector = createRangeSelector();

    start_x = event.clientX;
    start_y = event.clientY;
    rangeSelector.style.left = event.clientX + "px";
    rangeSelector.style.top = event.clientY + "px";

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="container">
      <ImageUploadContainer handleMouseDown={handleMouseDown} />
      <ImageDetailPreview previewDetail={previewDetail} />
    </div>
  );
};

export default ImageMapEditor;
