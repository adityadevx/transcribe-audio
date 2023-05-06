import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Upload from './components/Upload';
import DownloadTable from './components/DownloadTable';
import LoginState from './context/LoginState';


function App() {
  return (
    <>
      <Router>
        <Routes>
          {/*  root route */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={
            <LoginState>
              <Upload />
            </LoginState>
          } />
          {/* <Route path="/download" element={<Download />} /> */}
          <Route path='/download' element={
            <LoginState>
              <DownloadTable />
            </LoginState>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
