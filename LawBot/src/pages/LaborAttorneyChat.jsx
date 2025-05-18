import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import send from '../assets/chatSend.png';
import { wsBaseURL } from '../constants/baseURL';
import { apiClient } from '../services/apiClient';
import { useLocation } from 'react-router-dom';
import useUserData from '../constants/hooks/useUserData';
import { CONSULTANT, USER } from '../constants/role';
import { MyChatBubble } from '../components/MyChatBubble';
import { OtherChatBubble } from '../components/OtherChatBubble';
import { isMyMessage } from '../utils/isMyMessage';
import SockJS from 'sockjs-client';

export const LaborAttorneyChat = () => {
  // ======================== 🔧 파라미터 & 유저 데이터 ========================
  const { userId, role } = useUserData();
  const location = useLocation();
  const stateInfo = location.state;

  // ======================== 🧠 상태 ========================
  const [conversationId, setConversationId] = useState();
  const [otherUserId, setOtherUserId] = useState();
  const [conversationInfo, setConversationInfo] = useState();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const stomptRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 상태 관리: 탭이 활성화되어 있는지 여부
  const isTabFocused = useRef(true);
  const [isTabFoucsedState, setIsTabFoucsedState] = useState(true);

  useEffect(() => {
    // focus 이벤트: 탭이 활성화되었을 때
    const handleFocus = () => {
      isTabFocused.current = true;
      setIsTabFoucsedState(true); // 상태 업데이트
    };

    // blur 이벤트: 탭이 비활성화되었을 때
    const handleBlur = () => {
      isTabFocused.current = false;
      setIsTabFoucsedState(false); // 상태 업데이트
    };

    // visibilitychange 이벤트: 탭의 가시성 상태 변경 시
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      } else {
        handleBlur();
      }
    };

    // 이벤트 리스너 추가
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    initRead();
  }, [isTabFoucsedState]);

  // ✅ 1. [최초 진입 시] state에서 conversationId가 넘어온 경우 → 기존 채팅방
  useEffect(() => {
    if (stateInfo) {
      if (stateInfo.conversationId) {
        setConversationId(stateInfo.conversationId);
      }
      if (stateInfo.otherUserId) {
        setOtherUserId(stateInfo.otherUserId);
      }
    }
  }, []);

  // ✅ 2. [유저 ID와 상담사 ID가 있고 기존 conversationId가 없는 경우] → 새 채팅방 생성
  useEffect(() => {
    if (conversationId == null && userId && otherUserId) {
      makeNewConversation();
    }
  }, [userId, otherUserId]);

  // ✅ 3. conversationId가 세팅되면: 이전 메시지 가져오고, 웹소켓 연결
  useEffect(() => {
    const init = async () => {
      if (conversationId) {
        await getMessages(); // 과거 메시지 불러오기
        connect(); // 웹소켓 연결
      }
    };

    init();
    // 컴포넌트 unmount 시 disconnect
    return () => disconnect();
  }, [conversationId]);

  // ======================== 📜 스크롤 아래로 자동 이동 ========================
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ======================== 📲 메세지 발송 ========================
  const sendMessage = () => {
    if (!stomptRef.current || !stomptRef.current.connected) {
      console.warn('STOMP 연결 안 됨, 메시지 전송 취소');
      return;
    }

    if (input.trim() === '') return;

    const chatMessage = {
      conversationId: conversationId,
      senderId: userId,
      content: input,
      fromUser: role == USER,
    };

    stomptRef.current?.publish({
      destination: '/app/chat',
      body: JSON.stringify(chatMessage),
    });

    setInput('');
  };

  // 상대방 채팅 읽음처리
  const initRead = () => {
    if (!stomptRef.current || !stomptRef.current.connected) {
      console.warn('STOMP 연결 안 됨, 메시지 전송 취소');
      return;
    }

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages]; // 상태를 직접 수정하지 않기 위해 복사본 사용

      // 뒤에서부터 순회
      for (let i = updatedMessages.length - 1; i >= 0; i--) {
        const message = updatedMessages[i];

        // 상대방이 보낸 메시지이고, 아직 읽지 않은 메시지만 처리
        if (!isMyMessage(message.fromUser, role) && !message.isRead) {
          markMessageAsRead(message.id); // 읽음 처리 함수 호출
          updatedMessages[i] = { ...message, isRead: true }; // 읽음 상태 변경
        }

        // 만약 읽음 처리된 메시지를 만나면 루프 종료
        if (message.isRead) {
          break; // 읽음 처리된 메시지 이후는 더 이상 진행하지 않음
        }
      }

      return updatedMessages; // 읽음 처리가 완료된 메시지 배열 반환
    });
  };

  // ======================== 🧠 새로운 채팅방 생성 ========================
  const makeNewConversation = async () => {
    // 본인이 노무사이면 반대로
    const requestUserId = role == USER ? userId : otherUserId;
    const consultantId = role == USER ? otherUserId : userId;

    try {
      const res = await apiClient.post(
        `/api/conversations?userId=${requestUserId}&title=제목&type=CONSULTANT&consultantId=${consultantId}`,
      );
      setConversationId(res.data.id);
      setConversationInfo(res.data);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  // ======================== 📥 기존 메세지 가져오기 ========================
  const getMessages = async () => {
    try {
      const res = await apiClient.get(
        `/api/conversations/${conversationId}?accessorId=${userId}&isConsultant=${role == CONSULTANT}`,
      );
      const resMesaage = res.data.messages;
      setMessages(resMesaage);
      setConversationInfo(res.data);
    } catch (error) {
      console.error('메세지 불러오기 실패:', error);
    }
  };

  // ======================== 🔌 웹소켓 연결 ========================
  const connect = () => {
    console.log('웹소켓 연결 시도');
    const accessToken = localStorage.getItem('access');

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(wsBaseURL),
      reconnectDelay: 5000,

      onConnect: (frame) => {
        console.log('Connected:', frame);

        stompClient.subscribe('/topic/errors', (message) => {
          console.error('WebSocket 에러:', message.body);
          alert('오류 발생: ' + message.body);
        });

        // 메세지 구독
        stompClient.subscribe(
          `/topic/conversations/${conversationId}`,
          (messageOutput) => {
            const message = JSON.parse(messageOutput.body);
            addMessage(message);

            // 상대방이 보낸 메세지만 읽음

            if (isTabFocused.current && !isMyMessage(message.fromUser, role)) {
              markMessageAsRead(message.id);
            }
          },
        );

        // 읽음 구독
        stompClient.subscribe(
          `/topic/conversations/${conversationId}/read`,
          (readStatusOutput) => {
            const message = JSON.parse(readStatusOutput.body);
            updateReadStatus(message);
          },
        );

        initRead();
      },

      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        alert('연결 실패: 서버 상태를 확인하세요.');
      },
    });

    stomptRef.current = stompClient;
  };

  const updateReadStatus = (message) => {
    setMessages((prevMessages) =>
      prevMessages.map((mes) =>
        mes.id === message.id ? { ...mes, read: true } : mes,
      ),
    );
  };

  // ======================== 🔌 소켓 연결 해제 ========================
  const disconnect = () => {
    if (stomptRef.current && stomptRef.current.connected) {
      console.log('STOMP 연결해제');
      stomptRef.current.deactivate();
    }
  };

  // ======================== ✅ 메세지 읽음 처리 ========================
  const markMessageAsRead = (messageId) => {
    if (!stomptRef.current || !stomptRef.current.connected) {
      console.warn('STOMP 연결 안 됨, 메시지 전송 취소');
      return;
    }

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

  // 메세지 그룹핑
  const groupMessagesByTime = (messages) => {
    if (!Array.isArray(messages) || messages.length <= 0) return []; // 빈 배열 반환

    const groupedMessages = [];
    let currentGroup = [];
    let lastTime = null;
    let lastFromUser = null;
    let lastReadStatus = null; // read 상태를 추적

    messages.forEach((msg) => {
      const messageDate = new Date(msg.createdAt);

      // 연도, 월, 일, 시간, 분만 추출
      const messageTime = `${messageDate.getFullYear()}-${String(messageDate.getMonth() + 1).padStart(2, '0')}-${String(messageDate.getDate()).padStart(2, '0')} ${String(messageDate.getHours()).padStart(2, '0')}:${String(messageDate.getMinutes()).padStart(2, '0')}`;

      // time, fromUser, read 상태가 다르면 그룹을 새로 시작
      if (
        messageTime !== lastTime ||
        msg.fromUser !== lastFromUser ||
        msg.read !== lastReadStatus
      ) {
        if (currentGroup.length) groupedMessages.push(currentGroup);
        currentGroup = [msg]; // 새로운 그룹 시작
        lastTime = messageTime;
        lastFromUser = msg.fromUser;
        lastReadStatus = msg.read;
      } else {
        currentGroup.push(msg); // 같은 그룹에 메시지 추가
      }
    });

    // 마지막 그룹 추가
    if (currentGroup.length) groupedMessages.push(currentGroup);

    return groupedMessages;
  };

  // ======================== 🖼️ UI ========================
  return (
    <div className="mt-10 flex flex-row justify-between">
      <div className="flex flex-col w-3xl relative m-auto">
        <div className="overflow-y-auto h-[calc(100vh-150px)] px-5 space-y-4">
          {groupMessagesByTime(messages).map((group, idx) => (
            <div key={idx}>
              {/* 그룹 내 메시지 표시 */}
              {group.map((msg, index) =>
                isMyMessage(msg.fromUser, role) ? (
                  <MyChatBubble
                    key={index}
                    index={index}
                    msg={msg}
                    length={group.length}
                  />
                ) : (
                  <OtherChatBubble
                    key={index}
                    index={index}
                    conversationInfo={conversationInfo}
                    msg={msg}
                  />
                ),
              )}
            </div>
          ))}
          <div ref={messagesEndRef} className="h-20" />
        </div>

        {/* 입력창 */}
        <div className="fixed bottom-0 left-0 right-0 pb-3  z-20 m-auto">
          <div className="flex items-center border-2 w-3xl border-[#653F21] bg-white rounded-lg  h-[50px] px-4 mx-auto">
            <input
              type="text"
              placeholder="전문 노무사에게 물어보세요.."
              className="flex-grow outline-none"
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
