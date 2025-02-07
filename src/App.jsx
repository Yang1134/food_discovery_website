import { RouterProvider } from "react-router-dom";
import './App.css'
import router from './routes'
import {APIProvider} from "@vis.gl/react-google-maps";
import {AuthProvider} from "./contexts/authContext/index.jsx";

function App() {
  return (
      <>
          {/*GOOGLE MAP API KEY*/}
          <AuthProvider>
              <APIProvider apiKey={'AIzaSyDZPgJRnb1b33TXBq3trW_FPx8SRo9uF8Y'}>
                  <RouterProvider router={router}/>
              </APIProvider>
          </AuthProvider>

      </>
  );
}

export default App
