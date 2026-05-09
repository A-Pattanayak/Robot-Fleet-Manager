import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import RobotDetail from "./robotDetail";
import { RouterProvider } from "react-router-dom";

export const appRouter=createBrowserRouter(
  [
    {
      element:<Dashboard />,
      path:'/'
    },
    {
      element:<RobotDetail />,
      path: '/robot/:id'

    }
  ]
)

const Body=()=>{
  return(
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  )
}

export default Body