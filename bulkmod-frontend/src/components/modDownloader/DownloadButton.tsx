import React from "react";
import { Button, ProgressBar } from "../ui";
import { ModList } from "../modLists/types";

interface DownloadButtonProps {
    selectedVersion: string;
    selectedLoader: string;
    selectedModList: ModList | null;
    isDownloading: boolean;
    currentMod: string | null;
    progress: number;
    onDownload: () => void;
}

export default function DownloadButton({
    selectedVersion,
    selectedLoader,
    selectedModList,
    isDownloading,
    currentMod,
    progress,
    onDownload
}: DownloadButtonProps) {
    return (
        <>
            {/* Download button */}
            <Button
                onClick={onDownload}
                disabled={!selectedVersion || !selectedLoader || !selectedModList || isDownloading}
                loading={isDownloading}
                className="w-full p-4 text-lg font-bold"
                size="lg"
            >
                {isDownloading ? "Downloading..." : "Download Mods"}
            </Button>

            {/* Status */}
            {isDownloading && currentMod && (
                <div className="mt-4 text-green-200 font-medium">
                    Currently downloading:{" "}
                    <a href={currentMod} target="_blank" rel="noopener noreferrer" className="underline">
                        {currentMod}
                    </a>
                </div>
            )}

            {isDownloading && (
                <ProgressBar 
                    value={progress} 
                    max={100} 
                    className="mt-3"
                    size="md"
                />
            )}
        </>
    );
} 