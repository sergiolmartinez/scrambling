import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartGame from "./screens/StartGame/StartGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartGame />} />
        {/* Future screens go here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
