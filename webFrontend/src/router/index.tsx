import IssueDetailPage from "@pages/issueDetail";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DeleteAccountPage from "@pages/deletetAccount";
import IssuesManagementPage from "@pages/IssuesManagement";
import IssueEditPage from "@pages/IssuesManagement/IssueEditPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "issue/:id",
        element: <IssueDetailPage />,
      },
      {
        path: "quit/delete",
        element: <DeleteAccountPage />,
      },
      {
        path: "admin",
        element: <IssuesManagementPage />,
      },
      {
        path: "admin/editIssue/:id",
        element: <IssueEditPage />,
      },
    ],
  },
]);

export default router;
