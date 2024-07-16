import express from "express";
import {
  deleteUserController,
  editUserDetailsController,
  getAllUsersController,
  getUserDetailsController,
  login,
  signout,
} from "../controllers/adminController.js";
import { signup } from "../controllers/authController.js";
import { verifyToken } from "../utils/VerifyUser.js";

const router = express.Router();

router.post("/admin-login", login);
router.get("/get-users", verifyToken,getAllUsersController);
router.get("/signout", signout);
router.post("/add-user", signup);
router.delete("/delete-user/:id", deleteUserController);
router.get("/user-details/:id",verifyToken, getUserDetailsController);
router.put("/edit-user/:id",verifyToken,editUserDetailsController);


export default router;
