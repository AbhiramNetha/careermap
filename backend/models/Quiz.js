const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    id: String,
    label: String,
    value: String,
}, { _id: false });

const QuizQuestionSchema = new mongoose.Schema({
    step: { type: Number, required: true },
    field: { type: String, required: true },     // e.g. "branch", "interest"
    question: { type: String, required: true },
    subtitle: String,
    icon: String,
    options: [OptionSchema],
}, { timestamps: true });

module.exports = mongoose.model('QuizQuestion', QuizQuestionSchema);
