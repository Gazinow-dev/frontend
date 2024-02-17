import IssueDetailPage from "@pages/issueDetail";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <IssueDetailPage />,
      },
    ],
  },
]);

export default router;
