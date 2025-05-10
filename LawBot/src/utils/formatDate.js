export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0~11이므로 +1)
  const day = String(date.getDate()).padStart(2, '0'); // 일
  const hours = String(date.getHours()).padStart(2, '0'); // 시
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 분

  return `${month}/${day} ${hours}:${minutes}`;
};
