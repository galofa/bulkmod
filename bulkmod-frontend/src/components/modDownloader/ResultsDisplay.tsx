import React from "react";

interface ResultsDisplayProps {
    isDownloading: boolean;
    downloadResults: any[];
}

export default function ResultsDisplay({ isDownloading, downloadResults }: ResultsDisplayProps) {
    if (isDownloading || downloadResults.length === 0 || !downloadResults.some(r => !r.success)) {
        return null;
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-red-300 mb-2">❌ Mods that could not be downloaded:</h3>
            <ul className="list-disc pl-6 space-y-1">
                {downloadResults
                    .filter(r => !r.success)
                    .map((fail, index) => {
                        const link = fail.url.endsWith("/versions") ? fail.url : `${fail.url}/versions`;
                        return (
                            <li key={index}>
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-400 hover:underline"
                                >
                                    {link}
                                </a>{" "}
                                – {fail.message}
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
} 