import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Upload from './components/Upload';
import DownloadTable from './components/DownloadTable';
import LoginState from './context/LoginState';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Router>

        <Routes>
          <Route path="/" element={
            <>
              <LoginState>
                <Navbar />
              </LoginState>
              <Upload />
            </>
          } />
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
          <Route path="/login" element={
            <>
              <LoginState>
                <Navbar />
              </LoginState>
              <Login />
            </>
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
