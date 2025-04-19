import React, { useState } from "react";
import { LaborChatHistoryCard } from "../components/LaborChatHistoryCard";

export const LaborAttorneyChatHistory = () => {
    const [histories, setHistories] = useState([
        {
            id: 1,
            name: "노무사 이름",
            lastChat: "마지막 채팅내용",
            profile: "",
        },
        {
            id: 2,
            name: "노무사 이름",
            lastChat:
                "많이 당황스러우셨겠네요. 우선 회사 측에서 근로자에게 사직서를 강요하는 것은 명백한 불법 행위이며, 근로자는 이를 거부할 권리가 있습니다. 사직서는 본인의 자발적인 의사로 작성해야만 효력이 있기 때문에, 억지로 쓰라고 하는 상황이라면 절대 작성하지 마시고, 해당 대화나 통화 내용은 꼭 증거로 남겨두시는 게 좋아요. 혹시 지금까지 회사로부터 받은 메시지나 녹취 같은 증거 자료가 있으신가요?",
            profile: "",
        },
        {
            id: 3,
            name: "노무사 이름",
            lastChat: "마지막 채팅내용",
            profile: "",
        },
        {
            id: 4,
            name: "노무사 이름",
            lastChat: "마지막 채팅내용",
            profile: "",
        },
        {
            id: 5,
            name: "노무사 이름",
            lastChat: "마지막 채팅내용",
            profile: "",
        },
        {
            id: 6,
            name: "노무사 이름",
            lastChat: "마지막 채팅내용",
            profile: "",
        },
        {
            id: 7,
            name: "노무사 이름",
            lastChat: "마지막 채팅내용",
            profile: "",
        },
    ]);

    return (
        <div>
            <h2 className="text-2xl font-bold mt-10 mb-5 text-center">노무사와 대화기록</h2>
            <div className="h-[1px] w-20 bg-gray-200  mb-10"></div>
            <div className="flex flex-col items-center gap-4">
                {histories.map((history) => (
                    <LaborChatHistoryCard
                        id={history.id}
                        name={history.name}
                        lastChat={history.lastChat}
                        profile={history.profile}
                        key={history.id}
                    />
                ))}
            </div>
        </div>
    );
};
