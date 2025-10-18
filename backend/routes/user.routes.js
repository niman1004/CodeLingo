import {Router} from 'express';
import { loginUser, logoutUser, registerUser, refreshAcessToken, getCurrentUser, getQuestionsSolved, getHeatmapData, getRandomTags } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { submitQuestion } from '../controllers/question.controller.js';

const router= Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-token").post(refreshAcessToken)
router.route("/submit-question").post(verifyJWT , submitQuestion)
router.route("/current").get(verifyJWT , getCurrentUser)
router.route("/questions-solved").get(verifyJWT , getQuestionsSolved)
router.route("/heatmap-data").get(verifyJWT , getHeatmapData)
router.route("/revision-tags").get(verifyJWT , getRandomTags)


export default router
