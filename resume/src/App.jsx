import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "rounded-xl border border-slate-100/50 bg-white font-sans text-sm text-slate-800 shadow-xl",
          duration: 3000,
        }}
      />
    </>
  );
}

export default App;
