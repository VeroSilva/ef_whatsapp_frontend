import { useState, useRef, useEffect } from "react";
import { IconMicrophone } from "../Icons/IconMicrophone";
import "./styles.css"

export const AudioRecorder = ({ audio, setAudio }: { audio: Blob | null, setAudio: Function }): JSX.Element => {
    const [permission, setPermission] = useState<boolean>(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const [recordingStatus, setRecordingStatus] = useState<string>("inactive");
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const mimeType: string = "audio/webm";

    const getMicrophonePermission = async (): Promise<void> => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                //@ts-ignore
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = (): void => {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream as MediaStream);
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localAudioChunks: Blob[] = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = (): void => {
        setRecordingStatus("inactive");
        mediaRecorder.current?.stop();
        mediaRecorder.current?.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
            // const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioBlob);
            setAudioChunks([]);
        })
    };

    const handleToggleRecording = () => {
        if (recordingStatus === "recording") {
            stopRecording()
        } else if (recordingStatus === "inactive" && permission) {
            startRecording()
        } else {
            getMicrophonePermission()
        }
    }

    const resetAudio = (): void => {
        setRecordingStatus("inactive");
        setAudioChunks([]);
        setAudio(null);
    };

    useEffect(() => {
        if (permission && recordingStatus === "inactive" && !audio) {
            startRecording()
        }
    }, [permission])

    useEffect(() => {
        if (!audio) {
            resetAudio(); //validar poder volver a grabar después de eliminar una nota
        }
    }, [audio])

    return (
        <div className="relative">
            <button
                className={"w-12 h-12 bg-slate-100 hover:bg-teal-600 rounded-full flex items-center justify-center group ease-in duration-100 " + (recordingStatus === "recording" ? "animate-gradient" : "")}
                onClick={handleToggleRecording}
            >
                <IconMicrophone classes={"w-8 h-8 ease-in duration-100 " + (recordingStatus === "recording" ? "text-slate-100" : "text-teal-600 group-hover:text-slate-100")} />
            </button>
        </div>
    );
};