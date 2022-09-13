import logo from './logo.svg';
import { Routes, Route, Navigate } from 'react-router-dom'

import {Releases} from './Releases/Releases'
import { Services } from './Services/Services';
import { Layout } from './Components/Layout'



const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Navigate to="/releases" replace />} />
          <Route path="releases" element={<Releases />} />
          <Route path="services" element={<Services />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
