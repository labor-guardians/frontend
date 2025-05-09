import React, { useEffect, useState, useRef } from 'react';
import send from '../assets/chatSend.png';
import { apiClient } from '../services/apiClient';
import ContextMenu from '../components/ContextMenu';
import { Button } from '../components/Button';
import { BiEdit } from 'react-icons/bi';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

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
  const [loading, setLoading] = useState(true);
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
  }, []);
  //바깥 클릭 시 contextMenu 닫기
  useEffect(() => {
    const closeMenu = () => setContextMenu({ visible: false });
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);
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
      const res = await apiClient.put(
        `/api/conversations/${editingRoomId}/title`,
        null,
        {
          params: {
            userId: userId,
            title: editedTitle,
          },
        },
      );
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
      const res = await apiClient.delete(`/api/conversations/${id}`, {
        params: {
          userId: userId,
        },
      });
      setChatRooms((prev) => prev.filter((room) => room.id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  //지난 채팅 목록 불러오기
  const fetchChatRooms = async (id) => {
    setSendMessage('');
    try {
      const res = await apiClient.get(`/api/conversations/user/${id}`, {
        params: {
          type: 'BOT',
        },
      });
      setChatRooms(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //새 채팅 생성
  const sendChat = async () => {
    setLoading(true);
    if (!sendMessage.trim()) return;
    const targetId = conversationId || curConversationIdRef.current;
    const isNewChat = !targetId;
    if (isNewChat) {
      setFirstChat(false);
      setNewChatFlag(true);
    }
    const data = {
      userId: userId,
      conversationId: targetId || null,
      message: sendMessage,
    };
    const userMsg = {
      fromUser: true,
      content: sendMessage,
    };
    setChatList((prev) => [...prev, userMsg]);
    setSendMessage('');
    try {
      const res = await apiClient.post('/api/chat', data);
      if (res.status === 200) {
        fetchChatRooms(userId);
        const { userMessage, botMessage } = res.data;
        console.log(res.data);
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
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  //채팅 목록 상세 보기
  const loadChatRoom = async (conversationId) => {
    try {
      const res = await apiClient.get(`/api/conversations/${conversationId}`, {
        params: {
          accessorId: userId,
          isConsultant: false,
        },
      });
      const messages = res.data.messages;
      const parsed = messages.map((msg) => ({
        fromUser: msg.fromUser,
        content: msg.content,
        createdAt: msg.createdAt,
        animate: false,
      }));
      setChatList(parsed);
      setConversationId(conversationId);
      curConversationIdRef.current = conversationId;
      setFirstChat(false);
    } catch (err) {
      console.log(err);
    }
  };

  const curReload = () => {
    setFirstChat(true);
    navigate(0);
  };
  return (
    <div className="mt-10 flex flex-row justify-between pr-20">
      <div className=" w-70">
        <ul className="list round-full shadow-md ">
          <div className="flex justify-end mt-5" onClick={() => curReload()}>
            <BiEdit color="#653F21" size={20} />
          </div>
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide text-center">
            지난기록
          </li>
          <div className=" overflow-y-auto h-[calc(100vh-150px)] ">
            {chatRooms.map((room) => {
              return (
                <li
                  key={room.id}
                  className="list-row"
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
                    <div>
                      <div>{room.title}</div>
                    </div>
                  )}
                </li>
              );
            })}
          </div>
        </ul>
      </div>

      {firstChat ? (
        <div className="flex flex-col justify-center gap-[5vw] w-[100vw] mb-[20vh]">
          <div className="text-center font-bold text-[6vw] sm:text-[4vw] md:text-[3vw] leading-relaxed text-[#653F21]">
            노동 관련 법률 자문을 구해보세요!
          </div>
          <div className="flex items-center border-2 border-[#653F21] rounded-lg bg-white w-[40vw] h-[50px] px-3 mx-auto">
            <input
              type="text"
              placeholder="LawBot에게 물어보세요"
              className="flex-grow outline-none bg-white"
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendChat();
                }
              }}
            />
            <button type="button" onClick={sendChat}>
              <img src={send} alt="send" className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-4/5 relative">
          <div className=" overflow-y-auto h-[calc(100vh-150px)] px-5">
            {chatList.map((chat, index) => (
              <div key={index} className="w-full my-2">
                {chat.fromUser ? (
                  <div className="flex justify-end chat chat-end">
                    <div className="chat-bubble bg-[#e7dfcc] text-black rounded-xl px-4 py-2 max-w-[70%]">
                      {chat.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    {loading ? (
                      <div>
                        {/* <ClipLoader
                          color="#653F21"
                          loading={loading}
                          size={150}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        /> */}
                      </div>
                    ) : (
                      <div className="text-black px-6 py-3 w-[80%] rounded-md shadow whitespace-pre-line">
                        {chat.animate ? (
                          <TypeAnimation
                            sequence={[chat.content]}
                            wrapper="span"
                            cursor={true}
                            speed={50}
                            style={{ display: 'inline-block' }}
                          />
                        ) : (
                          chat.content
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="fixed bottom-0 left-[15%] w-[80%]  pb-3 z-20">
            <div className="flex items-center border-2 border-[#653F21] rounded-lg bg-white w-[40vw] h-[50px] px-3 mx-auto">
              <input
                type="text"
                placeholder="LawBot에게 물어보세요"
                className="flex-grow outline-none bg-white"
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChat();
                  }
                }}
              />
              <button type="button" onClick={sendChat}>
                <img src={send} alt="send" className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
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
