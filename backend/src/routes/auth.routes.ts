import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerValidator,
  loginValidator,
  updateDetailsValidator,
  updatePasswordValidator,
  forgotPasswordValidator
} from '../validators/auth.validator';

const router = express.Router();

router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, validate(updateDetailsValidator), updateDetails);
router.put('/updatepassword', protect, validate(updatePasswordValidator), updatePassword);
router.post('/forgotpassword', validate(forgotPasswordValidator), forgotPassword);

export default router;
