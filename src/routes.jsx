import { createBrowserRouter } from "react-router-dom";
import Home from "../src/components/Home";
import LocationQuery from "./components/LocationQuery";
import Login from './components/auth/Login.jsx';
import Signout from "./components/auth/Signout.jsx";
import Register from "./components/auth/Register.jsx";
import Categories from "./components/Categories.jsx";
import Profile from "./components/Profile.jsx";
import SelectCategories from "./components/auth/SelectCategories.jsx";
import Restaurant from "./components/restaurant/Restaurant.jsx"
import RestaurantDetails from "./components/restaurant/RestaurantDetails.jsx";
import Error from "./components/Error.jsx";
import ApplyPartner from "./components/ApplyPartner.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '*',
        element: <Error />,
      },
      {
        path: "find-food",
        element: <LocationQuery />
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        element: <Signout />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "changepreference",    // New route for changing preferences
        element: <SelectCategories />,  // Reusing the SelectCategories component
      },
      {
        path: "select-categories",   // Add route for selecting categories
        element: <SelectCategories />,  // This is the new component you created
      },
      {
        path: "restaurants",
        element: <Restaurant />,
      },
      // {
      //   path: "tags",
      //   element: <Tags />,
      // },
      {
        path: "restaurant/:id",
        element: <RestaurantDetails />,
      },
      {
        path: 'apply-partner',
        element: <ApplyPartner />,
      }
    ],
  },
]);
 
export default router;