import React, { useEffect, useRef, useState } from "react";
import { Client, Stomp } from '@stomp/stompjs';
import send from "../assets/chatSend.png";
import { baseURL, wsBaseURL } from "../constants/baseURL";
import { apiClient } from "../services/apiClient";
import SockJS from "sockjs-client";

export const LaborAttorneyChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const stomptRef = useRef(null);
  const messagesEndRef = useRef(null);
  const conversationId = 28;
  const userId = 1;
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const connect = () => {
   const stompClient = new Client({
      // SockJS를 사용하는 WebSocket 팩토리 함수
      webSocketFactory: () => new SockJS(wsBaseURL),
  
      // 자동 재연결 설정 (밀리초 단위)
      reconnectDelay: 5000,
  
      // 연결 성공 시 실행
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
  
        // 에러 구독
        stompClient.subscribe('/topic/errors', (message) => {
          console.error('WebSocket 에러:', message.body);
          alert('오류 발생: ' + message.body);
        });

        // 채팅 메세지 구독
        stompClient.subscribe(`/topic/conversations/28`, function (messageOutput) {
          const message = JSON.parse(messageOutput.body);

          addMessage(message);
          markMessageAsRead(message.id);

      });
      },
  
      // 연결 실패 또는 끊겼을 때 실행
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        alert('연결에 실패했습니다. 서버가 실행 중인지 확인하세요.');
      },

    });
  
    stompClient.activate();
    stomptRef.current = stompClient;
  }

  const disconnect = () => {
    if(stomptRef.current != null){
      stomptRef.current.deactivate();
    }
  }

 


  // 메세지 발행
  const sendMessage = () => {
    if (input.trim() === "") return; // 빈 문자열 방지
    // 메시지 발행 로직 (예: stompClient.send(...) 등)
    console.log("메시지 전송:", input);

    const chatMessage = {
      conversationId: conversationId,
      senderId: userId,
      content: input,
      fromUser: true  // 노무사가 보내는 메시지
    };

    console.log(stomptRef.current);
    stomptRef.current.publish({
      destination: "/app/chat" ,
      body: JSON.stringify(chatMessage)
    });

    setInput(""); // 입력창 초기화
  }

  const addMessage = (message) => {
    setMessages(prevMessages => {
      // 이미 동일한 id의 메시지가 있는 경우 추가하지 않음(두번 호출 방지)
      if (prevMessages.some(m => m.id === message.id)) {
          return prevMessages;
      }
      return [...prevMessages, message];
    });
  }

   // 메시지 읽음 처리
   function markMessageAsRead(messageId) {
    if (stomptRef.current != null) {
      const readRequest = {
        messageId: messageId,
        conversationId: conversationId,
        readerId: userId
      }
      stomptRef.current.publish({
        destination: "/app/chat.read" ,
        body: JSON.stringify(readRequest)
      });
    }
}

  const getMessages = async () => {
   const oldmessage = await apiClient.get(baseURL + `/api/conversations/${conversationId}?accessorId=${userId}`)
    const message = oldmessage.data.messages;
    setMessages(message);
  }

  useEffect(()=>{
    connect();
    getMessages();
    return () => disconnect();
  },[]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 날짜 포맷팅
  function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

  return (
    <div className="mt-10 flex flex-row justify-between ">
      <div className="flex flex-col w-3xl relative m-auto">
        <div className="overflow-y-auto h-[calc(100vh-150px)] px-5 space-y-4">
          {messages.map((msg, idx) =>
            msg.fromUser ? (
              <div className="chat chat-end self-end w-full" key={idx}>
                <div className="chat-bubble bg-[#E2E2E2] text-black">{msg.content}</div>
               {msg.read && <div className="chat-footer opacity-50">읽음</div>}
              </div>
            ) : (
             

              <div className="chat chat-start" key={idx}>
              <div className="chat-image avatar ">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                  />
                </div>
              </div>
              <div className="chat-header">
                노무사이름
                <time className="text-xs opacity-50">{formatDate(msg.createdAt)}</time>
              </div>
              <div className="chat-bubble bg-[#653F21] text-white">{msg.content}</div>
              
              </div>
            )
          )}
          <div ref={messagesEndRef} className="h-20"></div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 pb-3 bg-white z-20 m-auto">
          <div className="flex items-center border-2 w-3xl border-[#653F21] rounded-lg bg-white h-[50px] px-3 mx-auto">
            <input
              type="text"
              placeholder="LawBot에게 물어보세요"
              className="flex-grow outline-none bg-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button type="button">
              <img src={send} alt="send" className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
