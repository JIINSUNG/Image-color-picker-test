import React, {  useRef, useState } from 'react';
import './App.css';
import { ImageColorPicker } from 'react-image-color-picker';


const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 320;

const ImageColorPickerCanvas = ({imageSrc, setImageSrc} : {imageSrc: string, setImageSrc: React.Dispatch<React.SetStateAction<string>>}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);



  const convertColorToHex = (color: string | null) => {
    if (color && color.startsWith('#') && color.length === 7) { 
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return "rgb(0, 0, 0)"; 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = e.target as HTMLImageElement;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgRatio = img.width / img.height;
    const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = img.width;
    let sourceHeight = img.height;

    if (imgRatio > canvasRatio) {
      sourceWidth = img.height * canvasRatio;
      sourceX = (img.width - sourceWidth) / 2;
    } else {
      sourceHeight = img.width / canvasRatio;
      sourceY = (img.height - sourceHeight) / 2;
    }

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
  };

const handleCanvasEvent = (e: React.MouseEvent | React.TouchEvent) => {
  e.preventDefault();

  const canvas = canvasRef.current;
  if (!canvas) return;

  let clientX: number;
  let clientY: number;

  if (e.nativeEvent instanceof TouchEvent) {
    const touchEvent = e.nativeEvent as TouchEvent;
    clientX = touchEvent.touches[0].clientX;
    clientY = touchEvent.touches[0].clientY;
  } else {
    const mouseEvent = e.nativeEvent as MouseEvent;
    clientX = mouseEvent.clientX;
    clientY = mouseEvent.clientY;
  }

  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    setSelectedColor(hex);
  }

};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', gap: '16px', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ color: '#333', fontSize: '24px', paddingBottom: '16px' }}>🎨 Image Color Picker</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      />
      {!imageSrc && (
        <div
          style={{
            width: '100%',
            aspectRatio: '1',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#aaa',
            fontSize: '14px',
          }}
        >
          Upload an image to start
        </div>
      )}
      {imageSrc  && (
        <div
          style={{            width: '100%',
            aspectRatio: '1',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Uploaded"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: "none" }}
            onLoad={handleImageLoad}
          />
          <canvas
            ref={canvasRef}
            onClick={handleCanvasEvent}
            style={{
              cursor: 'crosshair',
              border: '1px solid #ccc',
              width: '100%',
              aspectRatio: "1/1",
              borderRadius: '8px',
            }}
          />
        </div>
      )}
      {selectedColor && (
        <div
          style={{
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '16px', color: '#555' }}>Selected Color: <strong>{selectedColor}</strong></span>
          <span style={{ fontSize: '16px', color: '#555' }}>RGB: <strong>{convertColorToHex(selectedColor)}</strong></span>
          <div
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: selectedColor,
              border: '1px solid #000',
              borderRadius: '4px',
            }}
          />
        </div>
      )}
    </div>
  );
};

const ImageColorPickerLibrary = ({imageSrc} : {imageSrc: string}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const handleColorPick = (color: string) => {
    setSelectedColor(color);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "auto"}}>
      <h3>Image Color Picker Library Demo</h3>
      {imageSrc && <ImageColorPicker
        onColorPick={handleColorPick}
        imgSrc={imageSrc}
        zoom={1}
      />}
      <span>selected Color : {selectedColor}</span>
    </div>
  );
}

export default function App() {
  const [imageSrc, setImageSrc] = useState<string>("");
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <ImageColorPickerCanvas imageSrc={imageSrc} setImageSrc={setImageSrc} />
      <ImageColorPickerLibrary imageSrc={imageSrc} />
    </div>
  );
}