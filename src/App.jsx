import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Navbar from './components/Header/Navbar';
import './components/Header/nav.css'
import Dashboard from './components/dashboard/dashboard';
import Stats from './components/stats/stats';

function App() {
  return (
   <>
   <BrowserRouter>
   <Navbar/>
   <Routes>
    <Route path='/' element={<Dashboard/>}/>
     <Route path="/stats/:id" element={<Stats />} />
   </Routes>
   </BrowserRouter>
   </>

  );
}

export default App;
