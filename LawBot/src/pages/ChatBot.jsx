import React from "react";
import send from "../assets/chatSend.png";
export const ChatBot = () => {
  const items = Array(10).fill("산재 처리 관련 법률");
  return (
    <div className="mt-10 flex flex-row justify-between pr-20">
      <div className="bg-white w-1/5">
        <ul className="list rounded-box shadow-md bg-white">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide text-center">
            지난기록
          </li>

          <div className=" overflow-y-auto h-[calc(100vh-150px)] ">
            {items.map((text, index) => {
              return (
                <li key={index} className="list-row">
                  <div>{text}</div>
                </li>
              );
            })}
          </div>
        </ul>
      </div>
      <div className="flex flex-col w-4/5 relative">
        <div className=" overflow-y-auto h-[calc(100vh-150px)] px-5">
          <div className="chat chat-end self-end w-full">
            <div className="chat-bubble bg-[#E2E2E2] text-black">
              회사에서 산재처리를 못받고 있는데 어떻게 해결해야할까
            </div>
          </div>
          <div className="bg-[#D3D3D3] rounded-2xl p-5 w-[80%] mx-auto mt-15">
            <p>
              산재 처리를 받지 못하고 있는 상황이라면, 몇 가지 중요한 단계를
              밟아야 합니다. 아래는 산재 처리를 위한 기본적인 절차입니다: 산재
              신청: 산재 신청은 본인이 직접 근로복지공단에 신청하거나, 회사가
              대신 신청할 수 있습니다. 우선 회사에 산재 신청을 요청하고, 회사가
              이를 진행하지 않는다면 본인이 직접 근로복지공단에 신청할 수
              있습니다. 증빙 자료 준비: 산재 인정에는 사고 또는 질병이 업무와
              관련 있다는 증거가 필요합니다. 사고 발생 당시의 상황이나 병원
              진단서를 준비하세요. 또한, 사고의 경위나 질병 발생의 근로 과정과의
              관련성을 증명할 수 있는 자료도 필요합니다. 산재 인정 여부 확인:
              산재가 인정되면 근로복지공단에서 치료비와 휴업급여, 재활 지원 등의
              혜택을 받을 수 있습니다. 만약 산재 인정이 거부되면, 이를
              부당하다고 생각되면 이의신청을 할 수 있습니다. 이의신청: 산재
              인정이 거부된 경우, 근로복지공단의 결정에 불복하여 '이의신청'을 할
              수 있습니다. 이의신청은 60일 이내에 해야 하며, 법률적 근거를
              바탕으로 산재 인정이 되어야 한다는 주장을 담아 제출해야 합니다.
              법적 조언: 산재 관련 법률 자문을 받는 것도 좋습니다. 노무사나 법률
              전문가에게 상담을 받으면 보다 정확하고 효과적으로 문제를 해결할 수
              있습니다. 산재가 인정되지 않거나 처리가 지연되고 있다면, 전문가와
              상담하고 적절한 법적 절차를 통해 해결할 수 있는 방법을 모색하는
              것이 중요합니다.
            </p>
          </div>
        </div>
        <div className="fixed bottom-0 ] left-[15%] w-[80%]  pb-3  bg-white z-20">
          <div className="flex items-center border-2 border-[#653F21] rounded-lg bg-white w-[40vw] h-[50px] px-3 mx-auto">
            <input
              type="text"
              placeholder="LawBot에게 물어보세요"
              className="flex-grow outline-none bg-white"
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
