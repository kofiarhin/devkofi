import { downloadFile } from "../../services/services";
const Playground = () => {
  const handleDownload = async () => {
    downloadFile();
  };
  return (
    <div>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default Playground;
