import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Icon from "../assets/Icon.png"

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();

  const createRoomId = async () => {
    if (isLoading) return;
    setIsLoading(true)
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/room/create`
    );
    setRoomId(res.data.roomId);
    toast.success("Created new room");
    setIsLoading(false)
  };

  const joinRoom = async () => {
    if (!roomId || !username) {
      toast.error("Room Id and username are required");
      return;
    }
    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/room/verify/${roomId}`
      );
      navigate(`editor/${roomId}`, {
        state: {
          username,
        },
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleRoomId = (e) => {
    setRoomId(e.target.value);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  return (
    <div className="homePage">
      <div className="formWrapper">
        <img src={Icon} alt="" />
        <div className="inputGrp">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={handleRoomId}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsername}
          />
          <div className="btnGrp">
            <button className="btn joinBtn" onClick={joinRoom}>
              Join
            </button>
            <button
              className={`${isLoading ? "btnInactive" : "btn"} createRoom`}
              onClick={createRoomId}
            >
              {isLoading === true ? (
                <Loader size={12} />
              ) : (
                <span>Create Room</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
