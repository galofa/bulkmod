import React, { useRef } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

interface FileUploadProps {
    file: File | null;
    setFile: (file: File | null) => void;
}

export default function FileUpload({ file, setFile }: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="mb-6 relative z-0">
            <div className="flex items-center gap-2">
                <label htmlFor="modsFile" className="block mb-2 font-medium text-green-300">
                    Upload .txt file with mod URLs
                </label>

                <div className="group relative translate-y-[-2px] z-50">
                    <svg 
                        className="w-4 h-4 text-green-400 cursor-pointer" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" />
                        <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" strokeLinecap="round" />
                        <line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" strokeLinecap="round" />
                    </svg>

                    <div className="
                        absolute left-full top-1/2 -translate-y-1/2 ml-2
                        z-50 w-64 p-3 text-xs text-gray-300 
                        bg-gray-800 border border-gray-700 rounded shadow-lg 
                        hidden group-hover:block
                        pointer-events-none
                    ">
                        <p className="font-semibold text-white mb-2">Only Modrinth URLs are currently supported.</p>
                        <p className="text-white mb-1">Example input:</p>
                        <p className="text-green-400">https://modrinth.com/mod/carpet</p>
                        <p className="text-green-400">https://modrinth.com/mod/sodium</p>
                        <p className="text-gray-400 mt-1">(one URL per line)</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center w-full rounded-md border border-green-600 bg-slate-700 px-3 py-2 relative z-10">
                <div className="flex items-center flex-grow relative cursor-pointer">
                    <FaPlus className="text-green-300 mr-3" />
                    <span className="text-white truncate">
                        {file ? file.name : "No file selected"}
                    </span>
                    <input
                        id="modsFile"
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>

                {file && (
                    <button
                        onClick={handleRemoveFile}
                        className="text-red-400 hover:text-red-300 ml-3 relative z-20"
                        title="Remove file"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>
        </div>
    );
} 