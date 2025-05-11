import { useEffect, useState } from 'react';

function useUserData() {
  const [userId, setUserId] = useState();
  const [access, setAccess] = useState();
  const [role, setRole] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = () => {
      const userId = localStorage.getItem('id');
      const access = localStorage.getItem('access');
      const role = localStorage.getItem('role');
      setUserId(userId);
      setAccess(access);
      setRole(role);
      setIsLoading(false);
    };

    getData();
  }, []);
  return { userId, access, role, isLoading };
}
export default useUserData;
