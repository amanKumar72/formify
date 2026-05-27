
console.log("Starting import...");
try {
  const app = require("./src/server");
  console.log("Import successful!");
  console.log(app);
} catch (err) {
  console.error("Error importing server:", err);
}
