const jwt = require("jsonwebtoken");

//'this_is_secret'
const secret = "12346";
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    console.log("In If");
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
