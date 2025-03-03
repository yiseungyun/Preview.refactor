import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="app flex w-screen h-screen">
      <main className="overflow-y-scroll w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
