import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext'
import { Home } from './pages/Home';
import { New } from './pages/New';
import { AdminRoom } from './pages/AdminRoom';
import { Room } from './pages/Room';
// import './App.css';

function App() {
  return (
    <BrowserRouter>
    <AuthContextProvider>
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/rooms/new" component={New}/>
      <Route path="/admin/rooms/:id" component={AdminRoom}/>
      <Route path="/rooms/:id" component={Room}/>
    </Switch>
    </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
