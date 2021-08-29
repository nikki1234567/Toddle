const models = require("../models/Models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = "12346";
const saltRounds = 10;

var user = require("../config");
module.exports = {
  async authenticate(req, res) {
    try {
      const username = req.body.username;
      const password = await bcrypt.hash(req.body.password, saltRounds);
      const type = req.body.type;

      if (type == "student") {
        const new_user = new models.Student({
          username: username,
          password: password,
        });
        const student = await new_user.save();
        var token = jwt.sign({ id: student._id }, secret, {
          expiresIn: 86400 * 10, // 24 hours
        });
        user.name = student.username;
        user.type = "student";
        return res.status(200).json({
          id: student._id,
          username: student.name,
          type: "student",
          accessToken: token,
        });
      } else if (type == "teacher") {
        const new_user = new models.Teacher({
          username: username,
          password: password,
        });
        const teacher = await new_user.save();
        var token = jwt.sign({ id: teacher._id }, secret, {
          expiresIn: 86400 * 10, // 24 hours
        });
        user.name = teacher.username;
        user.type = "teacher";
        return res.status(200).json({
          id: teacher._id,
          username: teacher.name,
          type: "teacher",
          accessToken: token,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to create",
      });
    }
  },
  async createAssignment(req, res) {
    try {
      if (Object.keys(user).length === 0) {
        return res.status(500).send("Not Signed In");
      }
      var datetime = new Date();
      const students = req.body.students;
      datetime = datetime.toISOString().slice(0, 10);
      var status = "OTHER";
      const published_date = new Date(req.body.published_date)
        .toISOString()
        .slice(0, 10);
      console.log(published_date);
      const deadline = new Date(req.body.deadline).toISOString().slice(0, 10);
      if (published_date > datetime) {
        console.log("In If");
        status = "SCHEDULED";
      } else if (published_date < datetime && deadline > datetime) {
        console.log("In Else");
        status = "ONGOING";
      }

      console.log(datetime);

      const new_submission = new models.Assignment({
        description: req.body.description,
        teacher: req.body.teacher,
        students: req.body.students,
        published_date: req.body.published_date,
        deadline: req.body.deadline,
        status: status,
      });
      const sub = await new_submission.save();

      for (var i = 0; i < students.length; i++) {
        const new_student = new models.Submission({
          student: students[i],
          teacher: req.body.teacher,
          assignment: sub._id,
          description: "To Submit",
          status: "PENDING",
        });
        const added = await new_student.save();
      }

      return res.status(200).json({
        success: true,
        message: "Successfully created",
        sub,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Failed to create",
      });
    }
  },
  async getAllAssignment(req,res){

    try{
      const all_assign = await models.Assignment.find();
      return res.status(200).json({
        success: true,
        message: "Successfully created",
        all_assign,
      });

    }
    catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Failed to Get",
      });
    }

  },
  async updateAssignment(req, res) {
    try {
      console.log(req.params.id);
      const query = { _id: req.params.id };
      const updated = { $set: req.body };
      const updatedItem = await models.Assignment.updateOne(query, updated);
      return res.status(200).json({
        success: true,
        message: "Successfully updated",
        updatedItem,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message:
          "Failed to Update. Please check if the Assignment exists in the database",
      });
    }
  },
  async deleteAssignment(req, res) {
    try {
      const assignmentDelete = await models.Assignment.findByIdAndRemove(
        req.params.id
      );
      return res.status(200).json({
        success: true,
        message: "Successfully deleted",
        assignmentDelete,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message:
          "Failed to Delete. Please check if Assignment exists in the database",
      });
    }
  },
  async addSubmission(req, res) {
    try {
      const query = {
        student: user.name,
        assignment: req.body.assignment,
        status: "SUBMITTED",
      };
      const findSub = await models.Submission.countDocuments(query);
      if (findSub === 0) {
        const q = {
          student: user.name,
          assignment: req.body.assignment,
          status: "PENDING",
        };
        const body = {
          $set: { description: req.body.description, status: "SUBMITTED" },
        };
        const updateSub = await models.Submission.updateOne(q, body);

        return res.status(200).json({
          success: true,
          message: "Successfully Submitted",
          updateSub,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Assignment already Submitted",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to Submit",
      });
    }
  },

  async detailsAssignment(req, res) {
    try {
      if (user.type == "student") {
        const q = {
          student: user.name,
          assignment: req.body.assignment,
          status: "SUBMITTED",
        };
        const getDetails = await models.Submission.find(q);
        return res.status(200).json({
          success: true,
          message: "Successfully Submitted",
          getDetails,
        });
      } else if (type == "teacher") {
        const q = {
          teacher: user.name,
          assignment: req.body.assignment,
          status: "SUBMITTED",
        };
        const getDetails = await models.Submission.find(q);
        return res.status(200).json({
          success: true,
          message: "Successfully Submitted",
          getDetails,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to get details",
      });
    }
  },
  async assignmentFeed(req, res) {
    try {
      if (user.type === "teacher") {
        const q = { teacher: user.name, status: req.body.filter };
        const filtered = await models.Assignment.find(q);
        return res.status(200).json({
          success: true,
          message: "Successfully Filtered",
          filtered,
        });
      } else if (user.type === "student") {

        var q;

        if(req.body.filter==="ALL")
            q = { student: user.name };
        else if(req.body.filter==="PENDING" || req.body.filter==="SUBMITTED")
            q = { student: user.name, status: req.body.filter };

            
        const filtered = await models.Submission.find(q);
        return res.status(200).json({
          success: true,
          message: "Successfully Filtered",
          filtered,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to get details",
      });
    }
  },
};
