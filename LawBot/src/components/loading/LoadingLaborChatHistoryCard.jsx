export const LoadingLaborChatHistoryCard = () => {
  return (
    <div className="card card-side bg-base-100 shadow-sm w-full max-w-3xl h-[120px]">
      <figure className="shrink-0 w-[84px] h-[120px] skeleton"></figure>
      <div className="card-body">
        <h2 className="card-title skeleton h-[24px] w-2/5"></h2>
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-2 flex-1">
            <div className="skeleton h-[14px] w-2/5"></div>
            <div className="skeleton h-[14px] w-2/5"></div>
          </div>
          <div className="card-actions justify-end shrink-0 skeleton h-[40px] w-[127px]"></div>
        </div>
      </div>
    </div>
  );
};
