import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";

let socket;
const Chat = ( props ) => {
	const { name, room } = props;
	const { search } = useLocation();
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		socket = io("http://localhost:4000", { transports: ['websocket', 'polling', 'flashsocket'] });

		socket.emit("join", { name, room }, (error) => {
			if (error) {
				alert(error);
			}
		});

		socket.on("message", (message) => {
			setMessages((exitstingMsgs) => [...exitstingMsgs, message]);
		});

		socket.on("userList", ({ roomUsers }) => {
			setUsers(roomUsers);
		});

		return () => {
			// socket.emit("disconnect");
            socket.disconnect()
			socket.close();
		};
	}, [name, room]);

	const sendMessage = (e) => {
		if (e.key === "Enter" && e.target.value) {
			socket.emit("message", e.target.value);
			e.target.value = "";
		}
	};

	return (
		<div style={{marginTop:'-40px'}} className="chat">
			<div className="user-list">
				<div className='border border-primary bg-danger pb-2 mb-2'>User Name</div>
				{users.map((user) => (
					<div key={user.id} className='border border-primary rounded bg-success text-white m-1'>{user.name}</div>
				))}
			</div>
			<div className="chat-section">
				<div className="chat-head">
					<div className="room">{room}</div>
					<Link to="/">X</Link>
				</div>
				<div className="chat-box">
					<
// @ts-ignore
					ScrollToBottom className="messages">
						{messages.map((message, index) => (
							<div
								key={index}
								className={`message ${name.toLowerCase() === message.user ? "self" : ""}`}
							>
								<span className="user">{message.user}</span>
								<span className="message-text">{message.text}</span>
							</div>
						))}
					</ScrollToBottom>
					<input placeholder="message" onKeyDown={sendMessage} />
				</div>
			</div>
		</div>
	);
};

export default Chat;