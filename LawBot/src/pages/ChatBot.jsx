import React, { useEffect, useState, useRef, use } from 'react';
import send from '../assets/chatSend.png';
import { apiClient } from '../services/apiClient';
import ContextMenu from '../components/ContextMenu';
import { Button } from '../components/Button';
import { BiEdit, BiMenu, BiX } from 'react-icons/bi';
import { TypeAnimation } from 'react-type-animation';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import LaborAttorney from '../constants/LaborAttorney';
import ReactMarkdown from 'react-markdown';
import { LABOR_ATTORNEY_LIST } from '../constants/path';

export const ChatBot = () => {
  const [userId, setUserId] = useState();
  const [firstChat, setFirstChat] = useState(true);
  const curConversationIdRef = useRef(null);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [category, setCategory] = useState('');
  const [laborAttorneyList, setLaborAttorneyList] = useState([]);
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
  const [recommendedConsultants, setRecommendedConsultants] = useState([]);
  const reverseCategoryMap = {
    DISMISSAL: '해고/징계',
    INJURY: '산업재해',
    WAGE: '임금/퇴직금',
    BULLYING: '직장 내 괴롭힘',
    ETC: '기타 근로분쟁',
  };
  useEffect(() => {
    if (firstChat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      // cleanup
      document.body.style.overflow = 'auto';
    };
  }, [firstChat]);
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
    setLoading(true);

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
        const dummy = LaborAttorney();
        setRecommendedConsultants(dummy);
        setCategory(res.data.category);
        fetchLaborAttorneyList(res.data.category);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLaborAttorneyList = async (data) => {
    if (!data) return;
    try {
      const res = await apiClient.get('/api/user/consultant', {
        params: { category: data },
      });
      if (res.status === 200) {
        console.log(res.data);
        setLaborAttorneyList(res.data);
      }
    } catch (err) {
      console.log(err);
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

  const sidebarClasses = `
  fixed left-0 z-30 bg-[#e7dfcc]
  shadow-lg w-64 md:w-64 rounded-xl
  transition-transform duration-300 ease-in-out
  top-[150px] h-[calc(100vh-150px-30px)]
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
`;

  // 메인 컨텐츠 영역 클래스 계산
  const mainContentClasses = `
  ml-0 md:ml-64 transition-all duration-300 ease-in-out
  flex flex-col w-full relative mt-[100px]
  ${sidebarOpen && window.innerWidth < 768 ? 'opacity-30' : 'opacity-100'}
`;

  return (
    <div
      className={`pt-28 flex relative ${
        firstChat ? 'h-screen overflow-hidden' : 'min-h-screen'
      } bg-[#FEF9EB]`}
    >
      {/* 모바일 토글 버튼 */}
      {!sidebarOpen && (
        <div className="md:hidden fixed left-4 top-[88px] z-40">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-[#653F21] text-white rounded-full shadow-md"
          >
            <BiMenu size={24} />
          </button>
        </div>
      )}

      {/* 사이드바 */}
      <div className={sidebarClasses}>
        <ul className="list h-full shadow-md flex flex-col">
          <div className="flex justify-end mt-5 px-4" onClick={curReload}>
            <div className="md:hidden absolute top-5 left-5 z-50">
              <button
                onClick={toggleSidebar}
                className="p-2 bg-[#653F21] text-white rounded-full shadow-md"
              >
                <BiX size={24} />
              </button>
            </div>
            <BiEdit color="#653F21" size={20} />
          </div>
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide text-center">
            지난기록
          </li>
          <div className="flex-1 overflow-y-auto">
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
      <div className={`${mainContentClasses} px-4 md:pr-20 flex flex-col`}>
        {firstChat ? (
          <div className="flex flex-col justify-center gap-[5vw] w-full ">
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
                className="flex-grow min-w-0 outline-none bg-white text-sm sm:text-base"
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
              />
              <button
                type="submit"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
              >
                <img src={send} alt="send" className="w-5 h-5" />
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 px-2 md:px-5 mb-[3vh]">
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
                      <div className="text-black px-3 md:px-6 py-3 w-[95%] md:w-[80%] rounded-md shadow-lg whitespace-pre-line">
                        {chat.animate && index === chatList.length - 1 ? (
                          <div>
                            <TypeAnimation
                              sequence={[
                                chat.content,
                                () => {
                                  setChatList((prev) => {
                                    const updated = [...prev];
                                    updated[index] = {
                                      ...chat,
                                      animate: false,
                                    };
                                    return updated;
                                  });
                                },
                              ]}
                              wrapper="span"
                              cursor={true}
                              speed={50}
                              style={{ display: 'inline-block' }}
                            />
                          </div>
                        ) : (
                          <ReactMarkdown>{chat.content}</ReactMarkdown>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-center">
                  <div className="text-black px-3 md:px-6 py-3 w-[95%] md:w-[80%] rounded-md shadow-lg whitespace-pre-line">
                    <div className="mb-[10vh]">
                      <Spinner />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {laborAttorneyList.length > 0 && (
              <div className="mt-4 mb-10">
                <div className="flex flex-row">
                  <p className="text-[#653F21] font-bold mb-2">
                    관련 분야 노무사 추천
                  </p>
                  <Link
                    to={LABOR_ATTORNEY_LIST}
                    className="text-gray-500 mb-2 text-sm ml-5"
                  >
                    더 보러가기
                  </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {laborAttorneyList.map((consultant, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl shadow-md bg-white border border-[#ddd]"
                    >
                      <p className="font-bold text-lg">{consultant.userName}</p>
                      {/* <p className="text-sm text-gray-600">{consultant.firm}</p>
                      <p className="text-sm">경력: {consultant.experience}</p> */}
                      <p className="text-sm mt-[10px]">
                        전문분야:{' '}
                        {consultant.categories
                          .map((code) => reverseCategoryMap[code])
                          .filter(Boolean) // 혹시 매핑 안 되는 값 제거
                          .join(', ')}
                      </p>
                      <p className="text-sm mt-[10px]">
                        지역: {consultant.mainArea} {consultant.subArea}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <form
              onSubmit={handleFormSubmit}
              className="fixed bottom-0 left-0 w-full pb-3 z-20 flex justify-center items-center"
            >
              <div className="flex items-center border-2 border-[#653F21] rounded-lg bg-white  w-full max-w-[700px] h-[50px] px-3 mx-auto">
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
