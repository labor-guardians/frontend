import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import send from '../assets/chatSend.png';
import { baseURL, wsBaseURL } from '../constants/baseURL';
import { apiClient } from '../services/apiClient';
import SockJS from 'sockjs-client';
import { useLocation, useParams } from 'react-router-dom';
import useUserData from '../constants/hooks/useUserData';

export const LaborAttorneyChat = () => {
  // ======================== 🔧 파라미터 & 유저 데이터 ========================
  const params = useParams();
  const consaltantId = params.consaltantId;
  const { userId } = useUserData();
  const location = useLocation();
  const stateInfo = location.state;

  // ======================== 🧠 상태 ========================
  const [conversationId, setConversationId] = useState();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const stomptRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ 1. [최초 진입 시] state에서 conversationId가 넘어온 경우 → 기존 채팅방
  useEffect(() => {
    if (stateInfo && stateInfo.conversationId) {
      setConversationId(stateInfo.conversationId);
    }
  }, []);

  // ✅ 2. [유저 ID와 상담사 ID가 있고 기존 conversationId가 없는 경우] → 새 채팅방 생성
  useEffect(() => {
    if (conversationId == null && userId && consaltantId) {
      makeNewConversation();
    }

    // 컴포넌트 unmount 시 disconnect
    return () => disconnect();
  }, [userId, consaltantId]);

  // ✅ 3. conversationId가 세팅되면: 이전 메시지 가져오고, 웹소켓 연결
  useEffect(() => {
    if (conversationId) {
      getMessages(); // 과거 메시지 불러오기
      connect(); // 웹소켓 연결
    }
  }, [conversationId]);

  // ======================== 📜 스크롤 아래로 자동 이동 ========================
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ======================== 📲 메세지 발송 ========================
  const sendMessage = () => {
    if (input.trim() === '') return;

    const chatMessage = {
      conversationId: conversationId,
      senderId: userId,
      content: input,
      fromUser: true,
    };

    stomptRef.current?.publish({
      destination: '/app/chat',
      body: JSON.stringify(chatMessage),
    });

    console.log('메시지 전송:', input);
    setInput('');
  };

  // ======================== 🧠 새로운 채팅방 생성 ========================
  const makeNewConversation = async () => {
    console.log('makeNewConversation');

    try {
      const res = await apiClient.post(
        `/api/conversations?userId=${userId}&title=제목&type=CONSULTANT&consultantId=${consaltantId}`,
      );
      setConversationId(res.data.id);
      console.log(res);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  // ======================== 📥 기존 메세지 가져오기 ========================
  const getMessages = async () => {
    try {
      const res = await apiClient.get(
        `${baseURL}/api/conversations/${conversationId}?accessorId=${userId}&isConsultant=false`,
      );
      const message = res.data.messages;
      setMessages(message);
    } catch (error) {
      console.error('메세지 불러오기 실패:', error);
    }
  };

  // ======================== 🔌 웹소켓 연결 ========================
  const connect = () => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(wsBaseURL),
      reconnectDelay: 5000,

      onConnect: (frame) => {
        console.log('Connected:', frame);

        stompClient.subscribe('/topic/errors', (message) => {
          console.error('WebSocket 에러:', message.body);
          alert('오류 발생: ' + message.body);
        });

        stompClient.subscribe(
          `/topic/conversations/${conversationId}`,
          (messageOutput) => {
            const message = JSON.parse(messageOutput.body);
            addMessage(message);
            markMessageAsRead(message.id);
          },
        );
      },

      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        alert('연결 실패: 서버 상태를 확인하세요.');
      },
    });

    stompClient.activate();
    stomptRef.current = stompClient;
  };

  // ======================== 🔌 소켓 연결 해제 ========================
  const disconnect = () => {
    if (stomptRef.current) {
      stomptRef.current.deactivate();
    }
  };

  // ======================== ✅ 메세지 읽음 처리 ========================
  const markMessageAsRead = (messageId) => {
    if (stomptRef.current) {
      const readRequest = {
        messageId,
        conversationId,
        readerId: userId,
      };
      stomptRef.current.publish({
        destination: '/app/chat.read',
        body: JSON.stringify(readRequest),
      });
    }
  };

  // ======================== 📌 메세지 추가 ========================
  const addMessage = (message) => {
    setMessages((prevMessages) => {
      if (prevMessages.some((m) => m.id === message.id)) return prevMessages;
      return [...prevMessages, message];
    });
  };

  // ======================== 🧼 유틸 - 스크롤 ========================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ======================== 📅 날짜 포맷 ========================
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ======================== 🖼️ UI ========================
  return (
    <div className="mt-10 flex flex-row justify-between">
      <div className="flex flex-col w-3xl relative m-auto">
        <div className="overflow-y-auto h-[calc(100vh-150px)] px-5 space-y-4">
          {messages.map((msg, idx) =>
            msg.fromUser ? (
              <div className="chat chat-end self-end w-full" key={idx}>
                <div className="chat-bubble bg-[#E2E2E2] text-black">
                  {msg.content}
                </div>
                {msg.read && <div className="chat-footer opacity-50">읽음</div>}
              </div>
            ) : (
              <div className="chat chat-start" key={idx}>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="프로필 이미지"
                      src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">
                  노무사이름
                  <time className="text-xs opacity-50">
                    {formatDate(msg.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble bg-[#653F21] text-white">
                  {msg.content}
                </div>
              </div>
            ),
          )}
          <div ref={messagesEndRef} className="h-20" />
        </div>

        {/* 입력창 */}
        <div className="fixed bottom-0 left-0 right-0 pb-3 bg-white z-20 m-auto">
          <div className="flex items-center border-2 w-3xl border-[#653F21] rounded-lg bg-white h-[50px] px-3 mx-auto">
            <input
              type="text"
              placeholder="LawBot에게 물어보세요"
              className="flex-grow outline-none bg-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button type="button" onClick={sendMessage}>
              <img src={send} alt="send" className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
