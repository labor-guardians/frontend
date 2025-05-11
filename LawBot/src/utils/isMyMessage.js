import { CONSULTANT, USER } from '../constants/role';

export const isMyMessage = (fromUser, role) =>
  (fromUser && role === USER) || (!fromUser && role === CONSULTANT);
