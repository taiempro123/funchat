import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import AuthProvider from "./Context/AuthProvider";
import AppProvider from "./Context/AppProvider";
import AddRoomModal from "./components/Modals/AddRoomModal";
import InviteModal from "./components/Modals/InviteMember"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={ChatRoom} />
          </Switch>
          <AddRoomModal/>
          <InviteModal/>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
