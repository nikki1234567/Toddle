const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const tutorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const assignmentSchema = new mongoose.Schema({
  description: { type: String, required: true },
  teacher: {
    type: String,
    required: true,
  },
  // students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  students: { type: Array, required: true },
  published_date: { type: Date, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ["SCHEDULED", "ONGOING", "OTHER"] },
});

const submissionSchema = new mongoose.Schema({
  student: { type: String, required: true },
  teacher: { type: String, required: true },
  description: { type: String, required: true },
  assignment: { type: String, required: true },
  status: { type: String, required: true }
});

const Student = mongoose.model("Student", studentSchema);
const Teacher = mongoose.model("Teacher", tutorSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema);
const Submission = mongoose.model("Submission", submissionSchema);

module.exports = {
  Student,
  Teacher,
  Assignment,
  Submission,
};
