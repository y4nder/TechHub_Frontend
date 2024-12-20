import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./hooks/tan-stack.js";
import { router } from "./routes/router.js";
import {Toaster} from "react-hot-toast";

function App() {
    return (
      <QueryClientProvider client={queryClient}>
         <Toaster position="bottom-right" />
         <RouterProvider router={router} />
      </QueryClientProvider>
    );
}

export default App;
