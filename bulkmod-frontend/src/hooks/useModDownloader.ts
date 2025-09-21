import { useState } from "react";
import { useNotification } from '../contexts/NotificationContext';
import { ModList } from '../components/modLists/types';

export function useModDownloader() {
    const { showNotification } = useNotification();
    const [selectedVersion, setSelectedVersion] = useState("");
    const [selectedLoader, setSelectedLoader] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [selectedModList, setSelectedModList] = useState<ModList | null>(null);
    const [downloadResults, setDownloadResults] = useState<any[]>([]);
    const [currentMod, setCurrentMod] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const handleDownload = async () => {
        if (!selectedVersion || !selectedLoader || !selectedModList) {
            showNotification("Please select Minecraft version, mod loader and a mod list.", 'warning');
            return;
        }

        setIsDownloading(true);
        setCurrentMod(null);
        setDownloadResults([]);
        setProgress(0);

        try {
            // Create JSON data
            const requestData = {
                mcVersion: selectedVersion,
                modLoader: selectedLoader,
                modListId: selectedModList.id.toString()
            };

            console.log("Starting download with:", requestData);

            // Upload mods
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
            console.log("API URL:", `${API_BASE_URL}/upload-mods-from-list`);
            
            const uploadRes = await fetch(`${API_BASE_URL}/upload-mods-from-list`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
            });

            console.log("Upload response status:", uploadRes.status);
            
            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                console.error("Upload error response:", errorText);
                throw new Error(`HTTP error! status: ${uploadRes.status} - ${errorText}`);
            }

            // Get job ID and total mods
            const responseData = await uploadRes.json();
            console.log("Upload response data:", responseData);
            const { jobId, totalMods } = responseData;
            const results: any[] = [];
            let completed = 0;
            const progressPerMod = 100 / totalMods;

            // Create event source
            const eventSource = new EventSource(`${API_BASE_URL}/progress/${jobId}`);

            // Handle message
            eventSource.onmessage = (e) => {
                const result = JSON.parse(e.data);
                results.push(result);
                setCurrentMod(result.url);
                completed++;
                setProgress(Math.min(Math.round(completed * progressPerMod), 100));
            };

            // Handle done
            eventSource.addEventListener("done", (e) => {
                const { zipUrl } = JSON.parse(e.data || "{}");

                if (zipUrl) {
                    // Create anchor element
                    const a = document.createElement("a");
                    a.href = zipUrl + "?t=" + Date.now();
                    a.download = "mods.zip";
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }

                eventSource.close();
                setDownloadResults(results);
                setCurrentMod(null);
                setProgress(100);
                setIsDownloading(false);
            });

            // Handle error
            eventSource.onerror = () => {
                eventSource.close();
                setIsDownloading(false);
                showNotification("Connection lost during download.", 'error');
            };
        } catch (err: any) {
            // Error
            console.error("Download error:", err);
            showNotification("Error: " + (err?.message || "Unknown"), 'error');
            setIsDownloading(false);
        }
    };

    return {
        // State
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
        // Actions
        handleDownload,
    };
} 