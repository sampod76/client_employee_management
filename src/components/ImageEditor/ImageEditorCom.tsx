import { ConfigProvider, Slider, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { BiFilterAlt, BiRedo, BiUndo } from 'react-icons/bi';
import { LiaRedoAltSolid, LiaUndoAltSolid } from 'react-icons/lia';
import { LuFlipHorizontal2, LuFlipVertical2 } from 'react-icons/lu';

import { FaAdjust, FaPalette } from 'react-icons/fa';
import { MdBrightnessHigh, MdContrast, MdRotateRight } from 'react-icons/md';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getLinkedListForImage } from './LinkedList';

interface FilterItem {
  name: string;
  maxValue: number;
}

interface ImageState {
  image: string;
  brightness: number;
  grayscale: number;
  sepia: number;
  saturate: number;
  contrast: number;
  hueRotate: number;
  rotate: number;
  vertical: number;
  horizontal: number;
  scale: number;
}

const ImageEditorCom: React.FC = () => {
  const filtersItem: FilterItem[] = [
    { name: 'brightness', maxValue: 200 },
    { name: 'grayscale', maxValue: 100 },
    { name: 'sepia', maxValue: 100 },
    { name: 'saturate', maxValue: 200 },
    { name: 'contrast', maxValue: 200 },
    { name: 'hueRotate', maxValue: 360 },
  ];

  const [property, setProperty] = useState<FilterItem>({
    name: 'brightness',
    maxValue: 200,
  });

  const [imageState, setImageState] = useState<ImageState>({
    image: '',
    brightness: 100,
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    contrast: 100,
    hueRotate: 0,
    rotate: 0,
    vertical: 1,
    horizontal: 1,
    scale: 1,
  });

  const [images, setImages] = useState<string[]>([]); // Store multiple images
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current image index
  const [crop, setCrop] = useState<Crop | null>(null); // Initialize the crop state
  const [details, setDetails] = useState<HTMLImageElement | null>(null); // Initialize the details state

  const imageHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length !== 0) {
      const files = Array.from(e.target.files); // Convert FileList to Array
      const imagePromises = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((imageDataArray) => {
        setImages(imageDataArray);
        const stateData: ImageState = {
          image: imageDataArray[0], // Display the first image initially
          brightness: 100,
          grayscale: 0,
          sepia: 0,
          saturate: 100,
          contrast: 100,
          hueRotate: 0,
          rotate: 0,
          vertical: 1,
          horizontal: 1,
          scale: 1,
        };
        setImageState(stateData);
        const linkedList = getLinkedListForImage(0);
        linkedList.insert(stateData);
        setCurrentIndex(0); // Reset to the first image
      });
    }
  };

  const inputHandle = (value: number) => {
    const newState = {
      ...imageState,
      [property.name]: value,
    };
    setImageState(newState);
    const linkedList = getLinkedListForImage(currentIndex);
    linkedList.insert(newState);
  };

  const leftRotate = () => {
    const newRotate = imageState.rotate + 90;
    const stateData = { ...imageState, rotate: newRotate };
    setImageState(stateData);
    const linkedList = getLinkedListForImage(currentIndex);
    linkedList.insert(stateData);
  };

  const rightRotate = () => {
    const newRotate = imageState.rotate - 90;
    const stateData = { ...imageState, rotate: newRotate };
    setImageState(stateData);
    const linkedList = getLinkedListForImage(currentIndex);
    linkedList.insert(stateData);
  };

  const verticalFlip = () => {
    const newVertical = imageState.vertical === 1 ? -1 : 1;
    const stateData = { ...imageState, vertical: newVertical };
    setImageState(stateData);
    const linkedList = getLinkedListForImage(currentIndex);
    linkedList.insert(stateData);
  };

  const horizontalFlip = () => {
    const newHorizontal = imageState.horizontal === 1 ? -1 : 1;
    const stateData = { ...imageState, horizontal: newHorizontal };
    setImageState(stateData);
    const linkedList = getLinkedListForImage(currentIndex);
    linkedList.insert(stateData);
  };

  const redo = () => {
    const linkedList = getLinkedListForImage(currentIndex);
    const data = linkedList.redoEdit();
    if (data) setImageState(data);
  };

  const undo = () => {
    const linkedList = getLinkedListForImage(currentIndex);
    const data = linkedList.undoEdit();
    if (data) setImageState(data);
  };

  const resetImage = () => {
    const linkedList = getLinkedListForImage(currentIndex);
    linkedList.reset();
    const stateData: ImageState = {
      image: images[currentIndex],
      brightness: 100,
      grayscale: 0,
      sepia: 0,
      saturate: 100,
      contrast: 100,
      hueRotate: 0,
      rotate: 0,
      vertical: 1,
      horizontal: 1,
      scale: 1,
    };
    setImageState(stateData);
    linkedList.insert(stateData);
  };

  const imageCrop = useCallback(() => {
    if (crop && details) {
      const canvas = document.createElement('canvas');
      const scaleX = details.naturalWidth / details.width;
      const scaleY = details.naturalHeight / details.height;
      canvas.width = crop.width!;
      canvas.height = crop.height!;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          details,
          crop.x! * scaleX,
          crop.y! * scaleY,
          crop.width! * scaleX,
          crop.height! * scaleY,
          0,
          0,
          crop.width!,
          crop.height!
        );
        const base64Url = canvas.toDataURL('image/jpg');
        const stateData = { ...imageState, image: base64Url };
        setImageState(stateData);
        const linkedList = getLinkedListForImage(currentIndex);
        linkedList.insert(stateData);
        setCrop(null); // Reset the crop state to hide the crop box
      }
    }
  }, [crop, details, imageState, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && crop) {
        imageCrop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [crop, imageCrop]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.altKey) {
        event.preventDefault();
        const zoomDirection = event.deltaY < 0 ? 0.1 : -0.1;
        setImageState((prevState) => {
          const newScale = Math.min(
            Math.max(prevState.scale + zoomDirection, 0.1),
            5
          );
          return {
            ...prevState,
            scale: newScale,
          };
        });
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [imageState.scale]);

  const saveImage = () => {
    if (details) {
      const canvas = document.createElement('canvas');
      canvas.width = details.naturalWidth;
      canvas.height = details.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.filter = `
          brightness(${imageState.brightness}%) 
          grayscale(${imageState.grayscale}%) 
          sepia(${imageState.sepia}%) 
          saturate(${imageState.saturate}%) 
          contrast(${imageState.contrast}%) 
          hue-rotate(${imageState.hueRotate}deg)
        `;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((imageState.rotate * Math.PI) / 180);
        ctx.scale(imageState.vertical, imageState.horizontal);

        ctx.drawImage(
          details,
          -canvas.width / 2,
          -canvas.height / 2,
          canvas.width,
          canvas.height
        );

        const link = document.createElement('a');
        link.download = Date.now() + '-' + 'image_edit.jpg';
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };
  // const saveAllImages = () => {
  //   images.forEach((image, index) => {
  //     const linkedList = getLinkedListForImage(index);
  //     const imageStateToSave = linkedList.current?.data || {
  //       image: image,
  //       brightness: 100,
  //       grayscale: 0,
  //       sepia: 0,
  //       saturate: 100,
  //       contrast: 100,
  //       hueRotate: 0,
  //       rotate: 0,
  //       vertical: 1,
  //       horizontal: 1,
  //       scale: 1,
  //     };

  //     if (details) {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = details.naturalWidth;
  //       canvas.height = details.naturalHeight;
  //       const ctx = canvas.getContext('2d');

  //       if (ctx) {
  //         ctx.filter = `
  //           brightness(${imageStateToSave.brightness}%)
  //           grayscale(${imageStateToSave.grayscale}%)
  //           sepia(${imageStateToSave.sepia}%)
  //           saturate(${imageStateToSave.saturate}%)
  //           contrast(${imageStateToSave.contrast}%)
  //           hue-rotate(${imageStateToSave.hueRotate}deg)
  //         `;
  //         ctx.translate(canvas.width / 2, canvas.height / 2);
  //         ctx.rotate((imageStateToSave.rotate * Math.PI) / 180);
  //         ctx.scale(imageStateToSave.vertical, imageStateToSave.horizontal);

  //         ctx.drawImage(
  //           details,
  //           -canvas.width / 2,
  //           -canvas.height / 2,
  //           canvas.width,
  //           canvas.height
  //         );

  //         const link = document.createElement('a');
  //         link.download = Date.now() + `-image_edit-${index}.jpg`; // Append index to differentiate images
  //         link.href = canvas.toDataURL();
  //         link.click();
  //       }
  //     }
  //   });
  // };

  const showNextImage = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      const linkedList = getLinkedListForImage(nextIndex);
      const stateData = linkedList.current?.data || {
        image: images[nextIndex],
        brightness: 100,
        grayscale: 0,
        sepia: 0,
        saturate: 100,
        contrast: 100,
        hueRotate: 0,
        rotate: 0,
        vertical: 1,
        horizontal: 1,
        scale: 1,
      };
      setImageState(stateData);
      setCurrentIndex(nextIndex);
    }
  };

  const showPreviousImage = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const linkedList = getLinkedListForImage(prevIndex);
      const stateData = linkedList.current?.data || {
        image: images[prevIndex],
        brightness: 100,
        grayscale: 0,
        sepia: 0,
        saturate: 100,
        contrast: 100,
        hueRotate: 0,
        rotate: 0,
        vertical: 1,
        horizontal: 1,
        scale: 1,
      };
      setImageState(stateData);
      setCurrentIndex(prevIndex);
    }
  };

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'brightness':
        return <MdBrightnessHigh />;
      case 'grayscale':
        return <FaAdjust />;
      case 'sepia':
        return <BiFilterAlt />;
      case 'saturate':
        return <FaPalette />;
      case 'contrast':
        return <MdContrast />;
      case 'huerotate':
        return <MdRotateRight />;
      default:
        return null;
    }
  };
  return (
    <div className="container mx-auto">
      <div className="flex h-[10vh] items-center justify-between">
        <div className="flex items-center gap-1 lg:gap-4">
          <Tooltip title="Undo" placement="leftTop">
            <button
              className="rounded-sm bg-[#1E201E] px-1 py-1 text-white shadow-md lg:px-4 lg:py-2"
              onClick={undo}
            >
              <BiUndo className="h-6 w-6" />
            </button>
          </Tooltip>
          <Tooltip title="Redo" placement="bottomRight">
            <button
              className="rounded-sm bg-[#1E201E] px-1 py-1 text-white shadow-md lg:px-4 lg:py-2"
              onClick={redo}
            >
              <BiRedo className="h-6 w-6" />
            </button>
          </Tooltip>
          {crop && (
            <button
              onClick={imageCrop}
              className="rounded-sm bg-[#3C3D37] px-1 py-1 text-white shadow-md lg:px-4 lg:py-2"
            >
              Crop Image
            </button>
          )}

          <label
            htmlFor="choose"
            className="cursor-pointer rounded-sm bg-[#ECDFCC] px-1 py-1 text-black shadow-md lg:px-4 lg:py-2"
          >
            Choose Image
          </label>
          <input
            onChange={imageHandle}
            id="choose"
            className="hidden"
            type="file"
            multiple // Allow multiple image selection
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={resetImage}
            className="rounded-sm bg-[#1E201E] px-1 py-1 text-white shadow-md lg:px-4 lg:py-2"
          >
            Reset
          </button>
          <button
            onClick={saveImage}
            className="rounded-sm bg-[#ECDFCC] px-1 py-1 text-black shadow-md lg:px-4 lg:py-2"
          >
            Save Image
          </button>
          {/* {images.length > 1 && (
            <button
              onClick={saveAllImages}
              className="text-black bg-[#ECDFCC] py-2 px-4 rounded-sm shadow-md"
            >
              Save All Images
            </button>
          )} */}
        </div>
      </div>

      <div className="flex h-[70vh]">
        <div className="h-full w-fit">
          <div className="flex flex-wrap gap-4">
            <Tooltip title="Horizontal Flip" placement="leftTop">
              <button
                onClick={horizontalFlip}
                className="rounded-sm bg-[#ECDFCC] px-4 py-2 text-black shadow-md"
              >
                <LuFlipHorizontal2 className="h-6 w-6" />
              </button>
            </Tooltip>
            <Tooltip title="Vertical Flip" placement="rightTop">
              <button
                onClick={verticalFlip}
                className="rounded-sm bg-[#ECDFCC] px-4 py-2 text-black shadow-md"
              >
                <LuFlipVertical2 className="h-6 w-6" />
              </button>
            </Tooltip>
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            <Tooltip title="Left Rotate" placement="leftTop">
              <button
                onClick={leftRotate}
                className="rounded-sm bg-[#ECDFCC] px-4 py-2 text-black shadow-md"
              >
                <LiaUndoAltSolid className="h-6 w-6" />
              </button>
            </Tooltip>
            <Tooltip title="Right Rotate" placement="rightTop">
              <button
                onClick={rightRotate}
                className="rounded-sm bg-[#ECDFCC] px-4 py-2 text-black shadow-md"
              >
                <LiaRedoAltSolid className="h-6 w-6" />
              </button>
            </Tooltip>
          </div>

          <div className="mt-3 flex flex-col gap-4">
            {filtersItem.map((item, index) => (
              <button
                key={index}
                onClick={() => setProperty(item)}
                className={`w-fit lg:w-[128px] ${
                  property.name === item.name
                    ? `bg-[#697565] text-white`
                    : `bg-[#ECDFCC] text-black`
                } flex items-center justify-start rounded-sm px-4 py-2 capitalize shadow-md`}
              >
                <span className="text-2xl">{getIcon(item.name)}</span>
                {/* Hidden text for small/medium screens */}
                <span className="ml-2 hidden md:inline">{item?.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="flex h-[80vh] w-full justify-center overflow-auto bg-slate-100" // Enabled scrolling
          style={{ cursor: 'grab' }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              transform: `scale(${imageState.scale})`, // Applied scaling
              transformOrigin: 'center', // Scale from the center
            }}
          >
            {imageState.image && (
              <ReactCrop crop={crop || undefined} onChange={(c) => setCrop(c)}>
                <img
                  onLoad={(e) => setDetails(e.currentTarget)}
                  style={{
                    filter: `
                                    brightness(${imageState.brightness}%) 
                                    grayscale(${imageState.grayscale}%) 
                                    sepia(${imageState.sepia}%) 
                                    saturate(${imageState.saturate}%) 
                                    contrast(${imageState.contrast}%) 
                                    hue-rotate(${imageState.hueRotate}deg)
                                `,
                    transform: `
                                    rotate(${imageState.rotate}deg) 
                                    scale(${imageState.horizontal}, ${imageState.vertical})
                                `,
                  }}
                  className="w-auto"
                  src={imageState.image}
                  width={0}
                  height={0}
                  alt="img"
                />
              </ReactCrop>
            )}
          </div>
        </div>
      </div>
      <div className="flex h-[10vh] w-full items-center justify-center">
        <div className="w-[220px] lg:w-[600px]">
          <ConfigProvider
            theme={{
              components: {
                Slider: {
                  controlSize: 50,
                  dotSize: 10,
                  dotActiveBorderColor: '#697565',
                  handleActiveColor: '#697565',
                  handleColor: '#697565',
                  trackBg: '#3C3D37',
                  trackHoverBg: '#1E201E',
                  railSize: 8,
                  handleActiveOutlineColor: '#3C3D37',
                  colorPrimaryBorderHover: '#3C3D37',
                },
              },
            }}
          >
            <Slider
              //@ts-ignore
              value={imageState[property.name]}
              onChange={inputHandle}
              max={property.maxValue}
            />
          </ConfigProvider>
        </div>
      </div>

      <div className="flex h-[10vh] w-full items-center justify-center gap-4">
        {currentIndex > 0 && (
          <button
            onClick={showPreviousImage}
            className="rounded-sm bg-[#1E201E] px-4 py-2 text-white shadow-md"
          >
            Previous
          </button>
        )}
        {currentIndex < images.length - 1 && (
          <button
            onClick={showNextImage}
            className="rounded-sm bg-[#1E201E] px-4 py-2 text-white shadow-md"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageEditorCom;
