import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [status] = useState("연결 대기중");

  useEffect(() => {
    navigate("/sessions");
  }, []);

  return (
    <section className={"flex flex-col gap-3"}>
      <p>이걸 보다니 실력자시군요?</p>
      <div id="connectionStatus">{status}</div>
    </section>
  );
}

export default App;
