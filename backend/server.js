import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

import userRouter from "./routes/userRoute.js"
import taskRouter from "./routes/taskRoute.js"
import forgotPasswordRouter from "./routes/forgotPassword.js"
import userModel from "./models/userModel.js"
import bcrypt from "bcrypt"

//app config
dotenv.config()
const app = express()
const port = process.env.PORT || 8000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
mongoose.set('strictQuery', true)

//middlewares
app.use(express.json())
app.use(cors())

//db config
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo_app"
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("DB Connected")
    }
})

// initialize default admin account on startup
const initAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@todo.com"
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
        const exists = await userModel.findOne({ email: adminEmail })
        if (!exists) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(adminPassword, salt)
            await userModel.create({ name: "Admin", email: adminEmail, password: hashedPassword })
            console.log(`Admin account created -> ${adminEmail} / ${adminPassword}`)
        }
    } catch (err) {
        console.log("Admin init error:", err.message)
    }
}

//api endpoints
app.use("/api/user", userRouter)
app.use("/api/task", taskRouter)
app.use("/api/forgotPassword", forgotPasswordRouter)

// serve frontend build (production)
const publicDir = path.join(__dirname, "public")
app.use(express.static(publicDir))
// SPA fallback: non-API routes serve index.html
app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ message: "Route not found" })
    }
    res.sendFile(path.join(publicDir, "index.html"), (err) => {
        if (err) {
            res.status(404).json({ message: "Frontend build not found" })
        }
    })
})

//listen
app.listen(port, async () => {
    console.log(`Listening on localhost:${port}`)
    await initAdmin()
})
