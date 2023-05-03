import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Upload from './components/Upload';
import DownloadTable from './components/DownloadTable';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          {/* <Route path="/download" element={<Download />} /> */}
          <Route path='/download' element={<DownloadTable />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
