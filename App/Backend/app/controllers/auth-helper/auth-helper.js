const admin = require('firebase-admin');

/**
 * Verify user email. May not need since firebase will handle it
 */
exports.handleVerifyEmail = async (oobCode) => {
    try {
        await admin.auth().applyActionCode(oobCode);
        return true;
    } catch (err) {
        return false;
    }
};
/**
 * May not needed since admin will handle it
 */
exports.handleVerifyResetPasswordLink = async (oobCode) => {
    try {
        await admin.auth().signInWithEmailAndPassword(email, password);
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * Get session token for login user
 */
exports.getToken = async (email, password) => {
    try {
        let token = await admin.auth().createCustomToken({uid: "1"});
        return token;
    } catch (err) {
        console.log(err);
        //throw new BadRequest('Invalid email or password');
    }
};

/**
 * Send a link to user email to reset password
 */
exports.sendResetPasswordLink = async (email) => {
  // having a bugs -> set a time out r need to check email formation
    admin.auth().sendPasswordResetEmail(email);
};

/**
 * May not need since admin will handle it
 */
exports.resetPassword = async (resetCode, password) => {
    admin.auth().confirmPasswordReset(resetCode, password);
};