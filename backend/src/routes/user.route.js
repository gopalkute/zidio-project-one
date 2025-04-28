import express from "express";
import { testInsertUser, testDeleteUser, registerUser, loginUser, handleTokenRefresh } from "../controllers/index.js";
import { validateUser } from "../middleware/index.js";

const userRouter = express.Router();

userRouter.post('/auth/signup', registerUser);
userRouter.post('/auth/signin', loginUser);

// test/development only routes
userRouter.get('/validate', validateUser, (req, res) => {
    console.log(req.user);
    res.json(req.user);
})
userRouter.post('/refresh', handleTokenRefresh);
userRouter.post('/test-insert-user', testInsertUser);
userRouter.delete('/test-delete-user', testDeleteUser);

export default userRouter;