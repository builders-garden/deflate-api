import express from "express";
import routes from "./routes";
import { config } from "dotenv";
import { environment } from "./config/environment";

// Load environment variables
config();

const app = express();
const PORT = environment.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
