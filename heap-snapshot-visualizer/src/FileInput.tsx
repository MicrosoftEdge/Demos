import { useState } from 'react';

interface FileInputProps {
    load: (file: File | null) => void;
}

function FileInput(props: FileInputProps) {

    let [selectedFile, setFile] = useState<File|null>(null);

    let onFileChange = (event: any) => {
        const file:File = event.target.files[0];
        setFile(file);
    };

    let onLoadClicked = (event: any) =>{
        props.load(selectedFile)
    }

    return (
        <div>
            <div>
                <input type="file" onChange={onFileChange} />
                <button onClick={onLoadClicked}> Load  </button>
            </div>
        </div>
    );

}

export default FileInput;