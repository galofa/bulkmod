import React from "react";
import VersionSelector from "./VersionSelector";
import ModListSelector from "./ModListSelector";
import DownloadButton from "./DownloadButton";
import ResultsDisplay from "./ResultsDisplay";
import Footer from "../common/Footer";
import { useModDownloader } from "../../hooks/useModDownloader";
import { Card, CardContent } from "../ui";

export default function MinecraftModDownloader() {
    const {
        selectedVersion,
        setSelectedVersion,
        selectedLoader,
        setSelectedLoader,
        isDownloading,
        selectedModList,
        setSelectedModList,
        downloadResults,
        currentMod,
        progress,
        handleDownload,
    } = useModDownloader();

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-4xl w-full">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl mb-6 flex items-center gap-2 font-semibold">⚡ Quick Download</h2>

                            <VersionSelector selectedVersion={selectedVersion} setSelectedVersion={setSelectedVersion} selectedLoader={selectedLoader} setSelectedLoader={setSelectedLoader} />

                            <ModListSelector selectedModList={selectedModList} onModListSelect={setSelectedModList} />

                            <DownloadButton selectedVersion={selectedVersion} selectedLoader={selectedLoader} selectedModList={selectedModList} isDownloading={isDownloading} currentMod={currentMod} progress={progress} onDownload={handleDownload} />

                            <ResultsDisplay isDownloading={isDownloading} downloadResults={downloadResults} />

                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
