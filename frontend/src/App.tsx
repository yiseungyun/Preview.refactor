import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="app min-w-[60rem] no-scrollbar">
      <Outlet />
    </div>
  );
}

export default App;
