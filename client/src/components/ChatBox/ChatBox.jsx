import "./chatBox.styles.scss";
import { useState } from "react";
import useChatMutation from "../../hooks/useChatMutation";

const ChatBox = () => {
  const [question, setQuestion] = useState("what is react?");
  const { data, mutate } = useChatMutation();
  const handleChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(question, {
      onSuccess: (data) => {
        console.log("successs!!!!!");
      },
    });
  };
  return (
    <div id="chat-box">
      <div className="chat-form-wrapper">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="question"
            placeholder="ask your question... "
            onChange={handleChange}
            value={question}
          />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
