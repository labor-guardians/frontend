export const LoadingLaborAttoneyCard = ({ index }) => {
  return (
    <div
      className={`card card-side bg-base-100 shadow-sm shrink-0 w-full h-[200px]
           ${index == 0 && 'xl:col-start-1 xl:col-end-3'}
           ${index == 9 && 'xl:col-start-2 xl:col-end-4'}
         }`}
    >
      <figure className="skeleton shrink-0 w-[120px] sm:w-[200px]"></figure>
      <div className="card-body flex flex-col justify-between">
        <h2 className="card-title skeleton h-[24px] w-[100px]"></h2>
        <div className="flex flex-col justify-start gap-2 flex-1">
          <p className="skeleton h-[14px] w-3/5 grow-0 shrink-0"></p>
          <p className="skeleton h-[14px] w-3/5 grow-0 shrink-0"></p>
          <p className="skeleton h-[14px] w-3/5 grow-0 shrink-0"></p>
        </div>
        <div className="card-actions justify-end">
          <div className="skeleton h-[40px] w-[85px]"></div>
        </div>
      </div>
    </div>
  );
};
