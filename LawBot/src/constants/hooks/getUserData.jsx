import React, { useEffect, useState } from 'react'

function getUserData() {
    const [userId, setUserId] = useState();
    const [access, setAccess] = useState();

    useEffect(() => {
        const getData = () => {
            const userId = localStorage.getItem("id");
            const access = localStorage.getItem("access");
            setUserId(userId);
            setAccess(access);
        }

        getData();
    }, []);
    return { userId, access };
}
export default getUserData;