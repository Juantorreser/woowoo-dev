const authHelper = require('./auth-helper/auth-helper');

/**
 * User login for both healer and client
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await authHelper.getToken(email, password);
        res.status(200).json({
            token
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Send a link to enter email to reset password
 */
exports.sendResetPasswordLink = async (req, res, next) => {
    try {
        const { email } = req.body;
        await authHelper.sendResetPasswordLink(email);
        res.status(200).send('The request has been sent to your email.');
    } catch (err) {
        next(err);
    }
};

/**
 * Reset user password
 */
exports.resetPassword = async (req, res, next) => {
    try {
        const { resetCode, password } = req.body;
        console.log(resetCode);
        await authHelper.resetPassword(resetCode, password);
        res.status(200).send('The password has been updated.');
    } catch (err) {
        next(err);
    }
};

/**
 * Verify the code in action link system sent to user email
 * @Note includes verify user email, reset password
 */
exports.verifyActionLink = async (req, res, next) => {
    try {
        const { oobCode, mode } = req.query;
        let isVerify;
        // check which mode
        switch (mode) {
        case 'resetPassword':
            // reset password.
            isVerify = await authHelper.handleVerifyResetPasswordLink(oobCode);
            res.status(308).redirect(`/?resetCode=${oobCode}&verify=${isVerify}`);
            break;
        case 'verifyEmail':
            // Display email verification handler and UI.
            isVerify = await authHelper.handleVerifyEmail(oobCode);
            res.status(308).redirect(`/?verify=${isVerify}`);
            break;
        default:
            throw Error('Invalid mode');
        }
    } catch (err) {
        next(err);
    }
};