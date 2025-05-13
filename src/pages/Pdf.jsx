import React, { useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { FiUpload, FiX } from 'react-icons/fi';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

const Pdf = () => {
  const [pdfCanvas, setPdfCanvas] = useState(null);
  const [imageData, setImageData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const loadingTask = getDocument({ data: event.target.result });
        loadingTask.promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            page.render({ canvasContext: context, viewport }).promise.then(() => {
              setPdfCanvas(canvas);
              setImageData(canvas.toDataURL());
            });
          });
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleDelete = () => {
    setPdfCanvas(null);
    setImageData(null);
    fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-xl mx-auto py-10 text-center">
      <h2 className="text-2xl font-semibold mb-6">Convert PDF to Image</h2>

      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />

     
        <button
          onClick={triggerFileSelect}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 mx-auto"
        >
          <FiUpload size={20} />
          Upload PDF
        </button>


      {imageData && (
        <div className="relative mt-6 inline-block border rounded-md shadow">
       
          <button
            onClick={handleDelete}
            className="absolute top-[-15px] cursor-pointer right-[-10px] bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 z-10"
            title="Delete"
          >
            <FiX size={16} />
          </button>

          {/* Render image */}
          <img
            src={imageData}
            alt="Converted PDF"
            className="w-full rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default Pdf;
