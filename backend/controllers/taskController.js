import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const sendMail = (email, subject, title, description) => {
    if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_PASSWORD) {
        console.log("Email skipped: GMAIL credentials not configured")
        return
    }
    try {
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: subject,
            html: `<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log("Email error:", error.message)
    }
}

const addTask = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId);
        const newTask = new taskModel({ title, description, completed: false, userId })
        const saved = await newTask.save()
        if (user && user.email) {
            sendMail(user.email, "Task Added", title, description)
        }
        res.status(200).json({ message: "Task added successfully", task: saved })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const removeTask = async (req, res) => {
    const { id } = req.body;
    try {
        const deleted = await taskModel.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.status(200).json({ message: "Task deleted successfully", task: deleted })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateTask = async (req, res) => {
    const { id, completed } = req.body;
    try {
        const updated = await taskModel.findByIdAndUpdate(
            id,
            { completed },
            { new: true }
        )
        if (!updated) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.status(200).json({ message: "Task updated successfully", task: updated })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getTask = (req, res) => {
    taskModel.find({ userId: req.user.id })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).json({ message: error.message }))
}

export { addTask, getTask, removeTask, updateTask }
