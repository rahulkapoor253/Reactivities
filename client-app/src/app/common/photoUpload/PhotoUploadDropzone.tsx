import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon, Header } from "semantic-ui-react";

interface IProps {
  setFiles: (files: object[]) => void;
}

const dropzoneStyles = {
  border: "dashed 4px",
  borderColor: "#eee",
  borderRadius: "4px",
  textAlign: "center" as "center",
  height: "200px",
  paddingTop: "30px",
};

const dropzoneActive = {
  borderColor: "green",
};

const PhotoUploadDropzone: React.FC<IProps> = ({ setFiles }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      console.log(acceptedFiles);
      setFiles(
        acceptedFiles.map((file: object) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={
        isDragActive
          ? { ...dropzoneStyles, ...dropzoneActive }
          : { ...dropzoneStyles }
      }
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="big" />
      <Header content="Drop image here" />
    </div>
  );
};

export default PhotoUploadDropzone;
