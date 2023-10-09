import React, { useState } from 'react';
import axios from 'axios';


import AudioRecorder from './AudioRecorder';



const AzureBlobUpload = () => {
    // const [selectedFile, setSelectedFile] = useState(null);

    // const handleFileChange = (e) => {
    //     setSelectedFile(e.target.files[0]);
    // };

    const [blob, setBlob] = useState(null);

    const handleUpload = async () => {
        if (!blob) {
            alert('Please select a file to upload.');
            return;
        }

        try {
            const storageAccountName = process.env.REACT_APP_STORAGE_ACCOUNT_NAME
            const containerName = process.env.REACT_APP_CONTAINER_NAME;
            const sasToken = process.env.REACT_APP_SAS_TOKEN;

            console.log('storageAccountName:', storageAccountName);
            console.log(process.env);

            //appending random number to the file name to avoid overwriting
            const random = Math.floor(Math.random() * 100000);
            const blobName = `test${random}.wav`;
            const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}${sasToken}`;

            const response = await axios.put(uploadUrl, blob, {
                headers: {
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Type': blob.type,
                },
            });
            console.log('response:', response);
            if (response.status === 201) {
                alert('File uploaded successfully.');
                setBlob(null);
            } else {
                alert('Error uploading file.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file.');
        }
    };

    return (
        <div>
            <h2>Upload a Blob to Azure Blob Storage</h2>
            {/* <input type="file" onChange={handleFileChange} /> */}
            <AudioRecorder blob={blob} setBlob={setBlob} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default AzureBlobUpload;
