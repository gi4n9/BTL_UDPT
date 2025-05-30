const app = require("./app");
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Auth service running on port http://localhost:${PORT}`);
});
