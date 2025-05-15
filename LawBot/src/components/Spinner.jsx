// components/Spinner.jsx (또는 내부 컴포넌트로 작성해도 됨)
import { BeatLoader } from 'react-spinners';

export const Spinner = () => (
  <div className="flex justify-center py-4">
    <BeatLoader color="#653F21" size={8} />
  </div>
);
