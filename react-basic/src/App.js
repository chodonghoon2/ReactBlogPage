import {
  BrowserRouter as Router,
  Switch,
  Route,
} from"react-router-dom";

import NavBar from "./component/NavBar";
import routes from "./routes";
import Toast from "./component/Toast";
import useToast from "./hooks/toast";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import { useEffect, useState } from "react";
import {login} from "./store/authSlice";
import LoadingSpinner from "./component/LoadingSpinner";



function App() {
  const toasts = useSelector(state => state.toast.toasts)
  const { deleteToast } = useToast();
  const [loading , setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if(localStorage.getItem('isLoggedIn')) {
      dispatch(login());
    }
    setLoading(false);
  },[]);

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <NavBar />
      <Toast 
        toasts={toasts}
        deleteToast={deleteToast}
      />
      <div className="container mt-3">
        <Switch>
          {routes.map((route) => {
            if(route.auth) {
              return <ProtectedRoute
                path={route.path} 
                component={route.component}
                key={route.path} 
                exact 
              />
            }
            return <Route 
              key={route.path} 
              exact 
              path={route.path} 
              component={route.component}
            />
          })}
        </Switch>
      </div>
    </Router>
  )
};

export default App;