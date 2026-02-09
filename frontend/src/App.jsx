import { useEffect } from "react";
import { api } from "./api/axios";

function App() {
  useEffect(() => {
    api.get("/profile/me")
      .then((res) => {
        console.log("Backend connected ✅", res.data);
      })
      .catch((err) => {
        console.error("Backend error ❌", err.response?.data);
      });
  }, []);

  return <h1>AI Expense Tracker</h1>;
}

export default App;
