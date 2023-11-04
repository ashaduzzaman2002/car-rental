import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Import routers
import authRouter from "./routes/auth.js";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// Import db
import connectDB from "./config/db.js";

/**middlewares */
app.use(
  cors({
    origin: ["http://localhost:3000", ""],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static('images'));


// use routers
app.use("/auth", authRouter);

/** Http get request */
app.get("/", (req, res) => {
  res.send("working fine ");
});

// DB connect
connectDB();

/** start Server  */
app.listen(port, () =>
  console.log(`Server is started sucessfully http://localhost:${port}`)
);
