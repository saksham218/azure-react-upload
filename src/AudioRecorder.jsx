import React from 'react'
import { useState, useRef } from "react";
import { Button } from '@mui/material'

const mimeType = "audio/wav";

const AudioRecorder = ({
    // setAudioBlob, setIsAudio
    blob, setBlob
}) => {
    const [audioBlob, setAudioBlob] = useState(null);
    const [isAudio, setIsAudio] = useState(false);
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [ready, setReady] = useState(false);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setReady(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const retake = () => {
        setAudioBlob(null);
        setAudioChunks([]);
        setIsAudio(false);
        setAudio(null);
        setReady(true);

        // let data = [...languageBlobs];
        // data[index] = null;
        // setLanguageBlobs(data);
        setBlob(null);
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };


    const stopRecording = () => {
        setRecordingStatus("inactive");

        console.log("recording stopped");
        console.log("ready: ", ready);
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            //creates a playable URL from the blob file.
            console.log("audioBlob", audioBlob);
            setAudioBlob(audioBlob);
            // let data = [...languageBlobs];
            // data[index] = audioBlob;
            // setLanguageBlobs(data);
            // console.log(languageBlobs);
            setBlob(audioBlob);
            setIsAudio(true);
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log("Audio: ", audioChunks)
            setAudio(audioUrl);
            setAudioChunks([]);

        };
    };


    return (
        <div>
            <h2>Audio Recorder</h2>
            <main>
                <div className="audio-controls">
                    {!permission ? (
                        <Button onClick={getMicrophonePermission} type="button">
                            Get Microphone
                        </Button>
                    ) : null}
                    {permission && recordingStatus === "inactive" && ready ?

                        (<Button onClick={startRecording} type="button">
                            Start Recording
                        </Button>) : null}
                    {permission && recordingStatus === "inactive" && !ready ?
                        (<Button onClick={retake} type="button">Retake</Button>)
                        : null}
                    {recordingStatus === "recording" ? (
                        <Button onClick={() => {
                            setReady(false);
                            stopRecording();
                        }} type="button">
                            Stop Recording
                        </Button>
                    ) : null}
                    {audio ? (
                        <div className="audio-container">
                            <audio src={audio} controls></audio>
                            {/* <a download href={audio}>
                                Download Recording
                            </a> */}
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
};

export default AudioRecorder