import './App.css';
import Login from './Components/Login';
import Register from './Components/Register';
import YoutubePage from './Components/Youtube';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  const router = createBrowserRouter([
    { path: "/", element: <Login callback={setUser} /> },
    { path: "/Register", element: <Register role="user"/> },
    { path: "/Login", element: <Login callback={setUser}/> },
    { path: "/Youtube", element: <YoutubePage user={user}/> },
  ], {
    future: {
      v7_relativeSplatPath: true, // Habilita el nuevo comportamiento de resolución en v7
    },
  });

  return <RouterProvider router={router} />;
}

export default App;
