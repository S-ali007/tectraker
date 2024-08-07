const { Router } = require("express");
const {
  registerUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  verifyEmail,
} = require("../controllers/user.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const router = Router();

router.post("/register", registerUser);
router.post("/verifyemail", verifyEmail);
router.route("/login").post(loginUser);
// secure Route
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

module.exports = router;
