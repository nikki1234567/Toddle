const user = require("../config");
const authRoleTeacher = (req, res, next) => {
  if (Object.keys(user).length === 0) {
    return res.status(500).send("Not Signed In");
  }
  if (user.type !== "teacher") {
    return res.status(403).send({
      message: "Only tutors can access",
    });
  } else {
    next();
  }
};
const authRoleStudent = (req, res, next) => {
    if (Object.keys(user).length === 0) {
      return res.status(500).send("Not Signed In");
    }
    if (user.type !== "student") {
      return res.status(403).send({
        message: "Only Students can access",
      });
    } else {
      next();
    }
  };

module.exports = {
    authRoleTeacher,
    authRoleStudent
};
