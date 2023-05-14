import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import DownloadTable from './components/DownloadTable';
import LoginState from './context/LoginState';
import Navbar from './components/Navbar';
import ChangePassword from './components/ChangePassword';
import ChangeKey from './components/ChangeKey';
import UploadComponent from './components/UploadComponent';
import Process from './components/Process';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/download' element={
            <>
              <LoginState>
                <Navbar />
              </LoginState>
              <LoginState>
                <DownloadTable />
              </LoginState>
            </>
          } />
          <Route path="/" element={
            <>
              <Login />
            </>
          } />
          <Route path="/login" element={
            <>
              <Login />
            </>
          } />
          <Route path="/changepassword" element={
            <>
              <LoginState>
                <Navbar />
                <ChangePassword />
              </LoginState>
            </>
          } />
          <Route path="/key" element={
            <LoginState>
              <Navbar />
              <ChangeKey />
            </LoginState>
          } />
          <Route path='/upload' element={
            <>
              <LoginState>
                <Navbar />
              </LoginState>
              <UploadComponent />
            </>
          } />
          <Route path='/process' element={
            <>
              <LoginState>
                <Navbar />
              </LoginState>
              <Process />
            </>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
