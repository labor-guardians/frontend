import { useEffect, useState } from 'react';

function useUserData() {
  const [userId, setUserId] = useState();
  const [access, setAccess] = useState();
  const [role, setRole] = useState();

  useEffect(() => {
    const getData = () => {
      const userId = localStorage.getItem('id');
      const access = localStorage.getItem('access');
      const role = localStorage.getItem('role');
      setUserId(userId);
      setAccess(access);
      setRole(role);
    };

    getData();
  }, []);
  return { userId, access, role };
}
export default useUserData;
