import React, { useEffect, useState, useRef } from 'react';
import send from '../assets/chatSend.png';
import { apiClient } from '../services/apiClient';
import ContextMenu from '../components/ContextMenu';
import { Button } from '../components/Button';
import { BiEdit, BiMenu, BiX } from 'react-icons/bi';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';

export const ChatBot = () => {
  const [userId, setUserId] = useState();
  const [firstChat, setFirstChat] = useState(true);
  const curConversationIdRef = useRef(null);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [sendMessage, setSendMessage] = useState('');
  const [conversationId, setConversationId] = useState();
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [newChatFlag, setNewChatFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetRoomId: null,
  });

  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatList]);

  useEffect(() => {
    const userId = localStorage.getItem('id');
    setUserId(userId);
    fetchChatRooms(userId);
  }, [curConversationIdRef]);

  useEffect(() => {
    setNewChatFlag(false);

    // 화면 크기에 따라 사이드바 초기 상태 설정
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // 초기 로드 시 실행
    handleResize();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const closeMenu = () => setContextMenu({ visible: false });
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleContextMenu = (e, roomId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      targetRoomId: roomId,
    });
  };

  const handleEdit = (id) => {
    const room = chatRooms.find((room) => room.id === id);
    setEditingRoomId(id);
    setEditedTitle(room.title);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const saveEditedTitle = async () => {
    try {
      await apiClient.put(`/api/conversations/${editingRoomId}/title`, null, {
        params: {
          userId,
          title: editedTitle,
        },
      });
      setChatRooms((prev) =>
        prev.map((room) =>
          room.id === editingRoomId ? { ...room, title: editedTitle } : room,
        ),
      );
      setEditingRoomId(null);
      setEditedTitle('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/api/conversations/${id}`, {
        params: { userId },
      });
      setChatRooms((prev) => prev.filter((room) => room.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChatRooms = async (id) => {
    setSendMessage('');
    try {
      const res = await apiClient.get(`/api/conversations/user/${id}`, {
        params: { type: 'BOT' },
      });
      setChatRooms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendChat = async () => {
    if (!sendMessage.trim()) return;
    const message = sendMessage;
    setSendMessage('');
    const targetId = conversationId || curConversationIdRef.current;
    const isNewChat = !targetId;

    if (isNewChat) {
      setFirstChat(false);
      setNewChatFlag(true);
    }

    const data = {
      userId,
      conversationId: targetId || null,
      message,
    };

    const userMsg = { fromUser: true, content: message };
    setChatList((prev) => [...prev, userMsg]);

    try {
      const res = await apiClient.post('/api/chat', data);
      if (res.status === 200) {
        fetchChatRooms(userId);
        const { botMessage } = res.data;
        const botMsg = {
          fromUser: false,
          content: botMessage.content,
          createdAt: botMessage.createdAt,
          animate: true,
        };
        setChatList((prev) => [...prev, botMsg]);
        if (isNewChat && res.data.conversationId) {
          setConversationId(res.data.conversationId);
          curConversationIdRef.current = res.data.conversationId;
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendChat();
  };

  const loadChatRoom = async (conversationId) => {
    try {
      const res = await apiClient.get(`/api/conversations/${conversationId}`, {
        params: {
          accessorId: userId,
          isConsultant: false,
        },
      });
      const messages = res.data.messages.map((msg) => ({
        fromUser: msg.fromUser,
        content: msg.content,
        createdAt: msg.createdAt,
        animate: false,
      }));
      setChatList(messages);
      setConversationId(conversationId);
      curConversationIdRef.current = conversationId;
      setFirstChat(false);

      // 모바일 환경에서는 채팅방 선택 후 사이드바 닫기
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const curReload = () => {
    setFirstChat(true);
    navigate(0);
  };

  // 사이드바 클래스 계산
  const sidebarClasses = `
    transition-all duration-300 ease-in-out 
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
    fixed md:relative left-0 top-0 z-30 bg-white 
    h-screen md:h-auto shadow-lg md:shadow-md
    w-64 md:w-70 md:block 
  `;

  // 메인 컨텐츠 영역 클래스 계산
  const mainContentClasses = `
    transition-all duration-300 ease-in-out
    flex flex-col w-full md:w-4/5 relative
    ${sidebarOpen && window.innerWidth < 768 ? 'opacity-30' : 'opacity-100'}
  `;

  return (
    <div className="mt-28 pt-4 flex flex-col md:flex-row justify-between px-4 md:pr-20 relative">
      {/* 모바일 토글 버튼 */}
      {!sidebarOpen && (
        <div className={`md:hidden fixed left-5 z-40 top-[88]`}>
          <button
            onClick={toggleSidebar}
            className={`p-2 bg-[#653F21] text-white rounded-full shadow-md`}
          >
            <BiMenu size={24} />
          </button>
        </div>
      )}

      {/* 사이드바 */}
      <div className={sidebarClasses}>
        <ul className="list round-full shadow-md h-full">
          <div className="flex justify-end mt-5 px-4" onClick={curReload}>
            <div className={`md:hidden fixed left-5 z-40 top-[88]`}>
              <button
                onClick={toggleSidebar}
                className={`p-2 bg-[#653F21] text-white rounded-full shadow-md`}
              >
                <BiX size={24} />
              </button>
            </div>
            <BiEdit color="#653F21" size={20} />
          </div>
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide text-center">
            지난기록
          </li>
          <div className="overflow-y-auto h-[calc(100vh-330px)] mb-[10vh]">
            {chatRooms.map((room) => (
              <li
                key={room.id}
                className="list-row hover:bg-[#f8f5ee] p-3 cursor-pointer"
                onClick={() => loadChatRoom(room.id)}
                onContextMenu={(e) => handleContextMenu(e, room.id)}
              >
                {editingRoomId === room.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="border px-2 py-1 rounded w-[70%]"
                    />
                    <Button
                      text="저장"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEditedTitle();
                      }}
                    />
                  </div>
                ) : (
                  <div className="truncate">{room.title}</div>
                )}
              </li>
            ))}
          </div>
        </ul>
      </div>

      {/* 채팅 영역 */}
      <div className={`${firstChat ? 'flex-1' : mainContentClasses}`}>
        {firstChat ? (
          <div className="flex flex-col justify-center gap-[5vw] w-full h-[70vh] items-center">
            <div className="text-center font-bold text-[8vw] sm:text-[6vw] md:text-[4vw] lg:text-[3vw] leading-relaxed text-[#653F21] px-4">
              노동 관련 법률 자문을 구해보세요!
            </div>
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center border-2 border-[#653F21] rounded-lg bg-white w-[90%] sm:w-[80%] md:w-[70%] lg:w-[40vw] h-[50px] px-3 mx-auto"
            >
              <input
                type="text"
                placeholder="LawBot에게 물어보세요"
                className="flex-grow outline-none bg-white"
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
              />
              <button type="submit">
                <img src={send} alt="send" className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto h-[calc(100vh-160px)] px-2 md:px-5 mb-[3vh]">
              {chatList.map((chat, index) => (
                <div
                  key={index}
                  className="w-full my-2"
                  ref={index === chatList.length - 1 ? scrollRef : null}
                >
                  {chat.fromUser ? (
                    <div className="flex justify-end chat chat-end">
                      <div className="chat-bubble bg-[#e7dfcc] text-black rounded-xl px-4 py-2 max-w-[90%] md:max-w-[70%]">
                        {chat.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="text-black px-3 md:px-6 py-3 w-[95%] md:w-[80%] rounded-md shadow whitespace-pre-line">
                        {chat.animate && index === chatList.length - 1 ? (
                          <div className="mb-[10vh]">
                            <TypeAnimation
                              sequence={[chat.content]}
                              wrapper="span"
                              cursor={true}
                              speed={50}
                              style={{ display: 'inline-block' }}
                            />
                          </div>
                        ) : (
                          chat.content
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form
              onSubmit={handleFormSubmit}
              className="fixed bottom-0 left-0 md:left-[15%] w-full md:w-[80%] pb-3 z-20 px-4"
            >
              <div className="flex items-center border-2 border-[#653F21] rounded-lg bg-white w-[90%] sm:w-[80%] md:w-[70%] lg:w-[40vw] h-[50px] px-3 mx-auto">
                <input
                  type="text"
                  placeholder="LawBot에게 물어보세요"
                  className="flex-grow outline-none bg-white"
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                />
                <button type="submit">
                  <img src={send} alt="send" className="w-5 h-5 ml-2" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* 컨텍스트 메뉴 */}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={() => handleEdit(contextMenu.targetRoomId)}
          onDelete={() => handleDelete(contextMenu.targetRoomId)}
        />
      )}
    </div>
  );
};
