import './App.css';
import Dashboard from './frontend/content/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './frontend/authentication/Login';
import UnknownPage from './frontend/custom components/404Page/UnkownPath';
import { Bounce, ToastContainer } from 'react-toastify';
import ProtectedRoute from './frontend/custom components/protected';
import { UserProvider } from './frontend/contexts/Context';
import UserCreation from './frontend/userCreation/UserCreation';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './frontend/userprofiles/userProfiles';
import SearchResults from './frontend/searchresults/searchResults';
import ReversedProtectedRoute from './frontend/custom components/reverseProtected';


function App() {
  return (
    <UserProvider>
      <Router>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
          />
          <div className="App">
            <Routes>
              <Route path='/' element={<ReversedProtectedRoute><Login /></ReversedProtectedRoute>} />
              <Route path="/newUser" element={<ReversedProtectedRoute><UserCreation/></ReversedProtectedRoute>}/>
              <Route path='/dashboard' element={ <ProtectedRoute>
                <Dashboard/>
                </ProtectedRoute> }/>
              <Route path='/userprofile/:username' element={<ProtectedRoute>
                <UserProfile/>
                </ProtectedRoute>}/>
              <Route path='/searchresults/:searchvalue' element = {<SearchResults/>}/>
              <Route path="*" element={<UnknownPage/>}/>
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
