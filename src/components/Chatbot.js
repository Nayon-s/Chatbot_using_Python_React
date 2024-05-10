import React, { useEffect, useState } from "react";
import botImage from "./bot.png";
import user from "./user.png";

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState();
  const [qaPairs, setQaPairs] = useState({
    que: "",
    ans: "", 
  });
  const { que, ans } = qaPairs;
  const [qaList, setQaList] = useState([]);
  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
      setQaPairs({
        que: question,
        ans: data.answer,
      });
      //setQaList([...qaList,qaPairs])
      setQuestion("");
      console.log(qaList);
    } catch (error) {
      console.error("Error:", error);
    }
  }; 
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (que && ans) {
      setQaList([...qaList, qaPairs]);
    }
  }, [qaPairs]);

  // console.log(qaList);

  return (
    <>
      <div class=" container d-flex justify-content-center align-items-center mt-5 fs-2 text mb-5 fw-semibold ">
        <div className=" text-center text-light">
          <i class="fas fa-graduation-cap"></i>JU Admission Assistant
          <i class="fas fa-university"></i>{" "}
        </div>
      </div>
      <div className=" d-flex justify-content-center align-items-center ">
        <>
          <div class="card cards" style={{ width: "45rem", height: "30rem" }}>
            <div class="card-body" style={{ overflowY: "auto" }}>
              {qaList &&
                qaList.map((index, id) => {
                  return (
                    <div class="card-body msg_card_body">
                      <div class="d-flex justify-content-end mb-3 ">
                        <div class="msg_cotainer justify-content-end ">{index.que}</div>
                        {/* <img src={user} className="profile " alt="" /> */}
                        <div class=" d-flex align-items-center">
      <img src={user} className="profile" alt="" />
    </div>

                      </div>
                      <div class="d-flex justify-content-start w-75 mb-2">
                        <img src={botImage} className="profile d-block m-auto"  alt="" />
                      
                        <div class="msg_cotainer_send ">{index.ans}</div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="row mb-4  mx-5">
              <div class="mt-3 col-10">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                   onKeyDown={handleKeyPress}
                  placeholder="Ask a question..."
                  class="border-black form-control"
                />
              </div>
              <div className="mt-3 col-2">
                <button
                  type="button"
                  disabled={question === ""}
                  class="btn btn-dark"
                  onClick={handleSubmit}
                >
                  {" "}
                  Send{" "}
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
}

export default Chatbot;
