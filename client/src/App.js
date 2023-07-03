import "./App.css";
import "./Normalize.css";
import Header from "./components/Header";
import chatgpt from "./assets/logo/veda3.png";
import { useState, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";

function App() {
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: `How can I help you today?`,
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setChatLog(chatLogNew);

    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("http://localhost:8082/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
        currentModel
      }),
    });
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
    setInput("");
  };

  const getEngines = () => {
    fetch("http://localhost:8082/models")
      .then((res) => res.json())
      .then((data) => setModels(data.models));
  };

  useEffect(() => {
    getEngines();
  }, []);

  const clearChatLog = () => {
    setChatLog([]);
  };

  return (
    <>
      <Header />
      <div className="App">
        <aside className="sidemenu">
          <div className="side-menu-button" onClick={clearChatLog}>
            <span>+</span>
            New Chat
          </div>
          <div className="models my-3">
            <select
              onChange={(e) => setCurrentModel(e.target.value)}
              className="form-select bg-dark text-light"
              aria-label="Default select example"
            >
              <option value={currentModel}>{currentModel}</option>
              {models.map((model) => {
                return (
                  <option key={model.id} value={model.id}>
                    {model.id}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="logo">
            <img className="chatgpt-logo" src={chatgpt} alt="logo" />
          </div>
        </aside>
        <section className="chatbox">
          <div className="chat-log">
            {chatLog.map((message, index) => {
              return <ChatMessage key={index} message={message} />;
            })}
          </div>
          <div className="chat-input-holder">
            <form onSubmit={handleSubmit}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                className="chat-input-textarea"
                placeholder="Type your question here!!"
              ></input>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
