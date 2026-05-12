import { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

function ImageUpload({ onImageSelect }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);

    if (onImageSelect) {
      onImageSelect(file, imageUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
      className="group cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-[#0b5c4b] hover:bg-emerald-50"
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="mx-auto h-32 w-32 rounded-full object-cover shadow-lg"
          />

          <p className="font-semibold text-[#0b5c4b]">
            Image selected successfully
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow">
            <UploadCloud
              size={34}
              className="text-slate-500 group-hover:text-[#0b5c4b]"
            />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-800">
              Drag & Drop Image Here
            </p>

            <p className="mt-1 text-sm text-slate-500">
              or click to upload
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
