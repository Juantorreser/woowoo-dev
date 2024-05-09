import jwtDecode from 'jwt-decode';
import { Unauthorized } from '../../general/middlewares/error-handle-middleware/error-code';
// this should be auth midddle ware
// reference: https://dev.to/emeka/securing-your-express-node-js-api-with-firebase-auth-4b5f

/**
 * @returns decoded info from jwt token
 */
const getJWTInfo = (token) => {
  try {
    return jwtDecode(token);
  } catch (err) {
    throw new Unauthorized();
  }
};
/**
 * Check if uid the the same uid from jwt token
 * @note need to catch potential when jwt is invalid
 */
const isSameUser = ({ token, uid }) => {
  const { user_id } = getJWTInfo(token);
  return user_id && user_id === uid;
};

const checkAuthorization = (condition) => {
  if (!condition) {
    throw new Unauthorized();
  }
};

export default {
  getJWTInfo,
  isSameUser,
  checkAuthorization,
};
