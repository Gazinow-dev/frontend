import IssueDetailPage from "@pages/issueDetail";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DeleteAccountPage from "@pages/deletetAccount";
import AdminIssueListPage from "@pages/admin/issueList";
import AdminIssueDetailPage from "@pages/admin/issue";
import AdminIssueEditPage from "@pages/admin/IssueEdit";
import AdminLoginPage from "@pages/admin/login";

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
        path: "admin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "admin/issueList",
        element: <AdminIssueListPage />,
      },
      {
        path: "admin/issue/:id",
        element: <AdminIssueDetailPage />,
      },
      {
        path: "admin/issueEdit/:id",
        element: <AdminIssueEditPage />,
      },
    ],
  },
]);

export default router;
