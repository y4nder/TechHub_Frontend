import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./hooks/tan-stack.js";
import { router } from "./routes/router.js";

function App() {
    return (
      <QueryClientProvider client={queryClient}>
         <RouterProvider router={router} />
      </QueryClientProvider>
    );
}

export default App;
