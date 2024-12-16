import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaPalette, FaFont, FaWater, FaDownload, FaAdjust, FaExpand } from 'react-icons/fa';
import './App.css';

const fonts = ['Roboto', 'Montserrat', 'Impact'];

function App() {
  const [mainImage, setMainImage] = useState(null);
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [mainImageOpacity, setMainImageOpacity] = useState(1);
  const [shadeColor, setShadeColor] = useState('#000000');
  const [shadeOpacity, setShadeOpacity] = useState(0);
  const [watermarkOpacity, setWatermarkOpacity] = useState(1);
  const [text, setText] = useState('');
  const [font, setFont] = useState(fonts[0]);
  const [fontSize, setFontSize] = useState(10);
  const [fontShadow, setFontShadow] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const canvasRef = useRef(null);
  const [watermarkScale, setWatermarkScale] = useState(0.2);

  const handleMainImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setMainImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleWatermarkImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setWatermarkImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleFontChange = (event) => {
    setFont(event.target.value);
  };

  const handleFontSizeChange = (event) => {
    setFontSize(parseInt(event.target.value, 10));
  };

  const handleFontShadowChange = (event) => {
    setFontShadow(event.target.checked);
  };

  const handleShadeColorChange = (event) => {
    setShadeColor(event.target.value);
  };

  const handleShadeOpacityChange = (event) => {
    setShadeOpacity(parseFloat(event.target.value));
  };

  const handleWatermarkOpacityChange = (event) => {
    setWatermarkOpacity(parseFloat(event.target.value));
  };

  const handleWatermarkScaleChange = (event) => {
    setWatermarkScale(parseFloat(event.target.value));
  };


  const updatePreview = () => {
    if (!mainImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = mainImageOpacity;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply shade
      ctx.fillStyle = shadeColor;
      ctx.globalAlpha = shadeOpacity;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Text overlay
      const maxFontSize = 0.7 * canvas.height;
      const dynamicFontSize = (fontSize / 100) * maxFontSize;
      ctx.font = `${dynamicFontSize}px ${font}`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white'; // You can change text color here
      ctx.globalAlpha = 1;
      if (fontShadow) {
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      } else {
        ctx.shadowColor = 'transparent'; // Or remove this line if you always want shadow
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      const lines = text.split('\n');
      const lineHeight = dynamicFontSize;
      const x = canvas.width / 2;
      let y = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;
      lines.forEach(line => {
        ctx.fillText(line, x, y);
        y += lineHeight;
      });

      // Watermark
      if (watermarkImage) {
        const watermarkImg = new Image();
        watermarkImg.onload = () => {
          const watermarkWidth = watermarkImg.width * watermarkScale;
          const watermarkHeight = watermarkImg.height * watermarkScale;
          const xPos = canvas.width - watermarkWidth - 10;
          const yPos = canvas.height - watermarkHeight - 10;
          ctx.globalAlpha = watermarkOpacity;
          ctx.drawImage(watermarkImg, xPos, yPos, watermarkWidth, watermarkHeight);
          setPreviewImage(canvas.toDataURL('image/jpeg', 0.7));
        };
        watermarkImg.src = watermarkImage;
      } else {
        setPreviewImage(canvas.toDataURL('image/jpeg', 0.7));
      }
    };
    img.src = mainImage;
  };

  const handleDownload = () => {
    if (previewImage) {
      const link = document.createElement('a');
      link.download = 'edited-image.jpg';
      link.href = previewImage;
      link.click();
    }
  };

  useEffect(() => {
    updatePreview();
  }, [mainImage, watermarkImage, mainImageOpacity, shadeColor, shadeOpacity, watermarkOpacity, text, font, fontSize, fontShadow, watermarkScale]);

  return (
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-4 p-4 rounded-lg shadow-md bg-white">
              <div className="flex items-center">
                <FaImage size={20} className="mr-2 text-blue-500" />
                <input type="file" onChange={handleMainImageChange} className="file-input w-full" />
              </div>
              <div>
                <label className="flex items-center">
                  <FaAdjust size={20} className="mr-2 text-gray-500" />
                  Main Image Opacity:
                </label>
                <input type="range" min="0" max="1" step="0.01" value={mainImageOpacity} onChange={(e) => setMainImageOpacity(parseFloat(e.target.value))} className="w-full range" />
              </div>
              <div className="flex flex-wrap items-center space-x-2">
                <FaPalette size={20} className="mr-2 text-purple-500" />
                <label className="mr-2">Shade Color:</label>
                <input type="color" value={shadeColor} onChange={handleShadeColorChange} className="mb-2" />
                <input type="range" min="0" max="1" step="0.01" value={shadeOpacity} onChange={handleShadeOpacityChange} className="w-full range mb-2" />
              </div>
              <div className="flex items-center">
                <FaFont size={20} className="mr-2 text-red-500" />
                <textarea value={text} onChange={handleTextChange} placeholder="Enter text here" className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div className="flex flex-wrap items-center space-x-2">
                <label className="mr-2">Font:</label>
                <select value={font} onChange={handleFontChange} className="p-2 border border-gray-300 rounded mb-2">
                  {fonts.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <label className="mr-2">Size:</label>
                <input type="range" min="10" max="100" value={fontSize} onChange={handleFontSizeChange} className="w-full range mb-2" />
                <input type="checkbox" id="fontShadow" checked={fontShadow} onChange={handleFontShadowChange} className="mb-2" />
                <label htmlFor="fontShadow">Shadow</label>
              </div>
              <div className="flex items-center">
                <FaWater size={20} className="mr-2 text-blue-500" />
                <input type="file" onChange={handleWatermarkImageChange} className="file-input w-full" />
              </div>
              <div>
                <label className="flex items-center">
                  <FaAdjust size={20} className="mr-2 text-gray-500" />
                  Watermark Opacity:
                </label>
                <input type="range" min="0" max="1" step="0.01" value={watermarkOpacity} onChange={handleWatermarkOpacityChange} className="w-full range" />
              </div>
							              <div>

                <label className="flex items-center">

                  <FaExpand size={20} className="mr-2 text-yellow-500" />

                  Watermark Scale:

                </label>

                <input type="range" min="0.1" max="1" step="0.01" value={watermarkScale} onChange={handleWatermarkScaleChange} className="w-full range" />

              </div>
            </div>
            <div className="relative">
              {previewImage && (
                <div className="mt-4">
                  <img src={previewImage} alt="Preview" onContextMenu={(e) => e.preventDefault()} className="w-full md:w-auto max-w-full h-auto border border-gray-300" />
                  <button onClick={handleDownload} className="absolute top-2 right-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center">
                    <FaDownload className="mr-1" />
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      );
    }

    export default App;
