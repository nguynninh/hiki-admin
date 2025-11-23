import { Gauge } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-2xl font-bold gap-3">
      <Gauge size={40} />
      <h1>Hello from Hiki! 👋</h1>
    </div>
  );
};

export default DashboardPage;
