export const ROLE_ADMIN = 'admin';
export const ROLE_MEMBER = 'member';
export const ROLE_MODERATOR = 'moderator';

export const ROLE_GUEST = 'guest';

export const ROLE_CAN_EDIT = [ROLE_ADMIN, ROLE_MODERATOR];
export const ROLE_CAN_SEE = [ROLE_ADMIN, ROLE_MODERATOR, ROLE_MEMBER];
