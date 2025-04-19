import React, { useState } from "react";
import { LaborAttoneyCard } from "../components/LaborAttoneyCard";

export const LaborAttorneyList = () => {
    const [list, setLust] = useState([
        {
            id: 1,
            name: "노무사 이름",
            introduce: "노무사 소개",
            profile: "profil.png",
        },
        {
            id: 2,
            name: "노무사 이름",
            introduce: "노무사 소개 노무사 소개 노무사 소개 노무사 소개",
            profile: "profil.png",
        },
        {
            id: 3,
            name: "노무사 이름",
            introduce:
                "재 사건만 200건 이상 직접 처리한 공인노무사입니다. 업무 중 발생한 디스크, 공황장애, 출퇴근 사고까지—산재 신청과 요양급여 승인 노하우를 갖추고 있습니다. 산재는 ‘복잡하다’는 이유로 제대로 승인을 받지 못하고 있습니다. 저의 도움을 받아 정확한 산재 처리를 받아보세요",
            profile: "profil.png",
        },
        {
            id: 4,
            name: "노무사 이름",
            introduce: "노무사 소개 노무사 소개",
            profile: "profil.png",
        },
        {
            id: 5,
            name: "노무사 이름",
            introduce:
                "재 사건만 200건 이상 직접 처리한 공인노무사입니다. 업무 중 발생한 디스크, 공황장",
            profile: "profil.png",
        },
        {
            id: 6,
            name: "노무사 이름",
            introduce: "노무사 소개",
            profile: "profil.png",
        },
        {
            id: 7,
            name: "노무사 이름",
            introduce: "노무사 소개",
            profile: "profil.png",
        },
        {
            id: 8,
            name: "노무사 이름",
            introduce: "노무사 소개",
            profile: "profil.png",
        },
        {
            id: 9,
            name: "노무사 이름",
            introduce: "노무사 소개",
            profile: "profil.png",
        },
        {
            id: 10,
            name: "노무사 이름",
            introduce: "노무사 소개",
            profile: "profil.png",
        },
        {
            id: 11,
            name: "노무사 이름",
            introduce: "노무사 소개",
            profile: "profil.png",
        },
        {
            id: 12,
            name: "노무사 이름",
            introduce: "노무사 소개",
            profile: "profil.png",
        },
    ]);

    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mt-10 mb-5 text-center">상담 가능한 노무사</h2>
            <div className="h-[1px] w-20 bg-gray-200  mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((attoney, idx) => (
                    <LaborAttoneyCard
                        id={attoney.id}
                        name={attoney.name}
                        introduce={attoney.introduce}
                        profile={attoney.profile}
                        key={attoney.id}
                        idx={idx}
                    />
                ))}
            </div>
        </div>
    );
};
