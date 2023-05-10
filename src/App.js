import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Upload from './components/Upload';
import DownloadTable from './components/DownloadTable';
import LoginState from './context/LoginState';
import Navbar from './components/Navbar';
import ChangePassword from './components/ChangePassword';
import Modal from './components/Modal';
import ChangeKey from './components/ChangeKey';

function App() {
  return (
    <>
      <Router>

        <Routes>
          {/* <Route path="" element={
            <>
              <LoginState>
                <Navbar />
              </LoginState>
              <Upload />
            </>
          } /> */}
          <Route path="/upload" element={
            <>
              <LoginState>
                <Navbar />
              </LoginState>
              <LoginState>
                <Upload />
              </LoginState>
            </>

          } />
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
        </Routes>
      </Router>

      {
        // userLoggedIn ?
        //   <Router>
        //     <Navbar />
        //     <Routes>
        //       {/*  root route */}
        //       {/* <Route path="/" element={<Login />} />
        //       <Route path="/login" element={<Login />} /> */}
        //       <Route path="/upload" element={
        //         <LoginState>
        //           <Upload />
        //         </LoginState>
        //       } />
        //       {/* <Route path="/download" element={<Download />} /> */}
        //       <Route path='/download' element={
        //         <LoginState>
        //           <DownloadTable />
        //         </LoginState>
        //       } />
        //     </Routes>
        //   </Router>
        //   :
        //   <Router>
        //     <Routes>
        //       <Route path="/" element={<Login />} />
        //       <Route path="/login" element={<Login />} />
        //     </Routes>
        //   </Router>
      }


    </>
  );
}

export default App;
