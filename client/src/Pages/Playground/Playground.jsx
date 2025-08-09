import Upload from "../../components/Upload/Upload";
import TypeWriter from "../../components/TypeWriter/TypeWrite";
import Login from "../Login/Login";
import IntegrateAI from "../../components/IntegrateAi/IntegrateAi";
const Playground = () => {
  const text =
    "Harness the power of the ChatGPT API and Grok API to add intelligence to your apps. From natural language understanding to real-time insights, build smarter, faster, and more adaptive experiences—tailored to your vision.";

  const title = "Mern Stack Mentorship";

  return (
    <div>
      <TypeWriter text={text} speed={30} title={title} />
    </div>
  );
};

export default Playground;
