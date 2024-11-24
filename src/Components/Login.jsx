import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Styles/Login.css';

export default function Login( {callback}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const goTo = useNavigate();
//
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await fetch('http://localhost:4000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.status === 'Bienvenido') {
              callback(data);
                if (data.role === 'user') {
                    goTo('/Youtube');
                } else if (data.role === 'admin') {
                    goTo('/adminHome');
                }
            } else if (data.status === 'ErrorCredenciales') {
                alert('Usuario y/o contraseña incorrectos');
            }
        } else {
            alert('Error al conectar a la base de datos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Iniciar sesión
        </button>
        <div className="signup-link">
            <Link to="/Register">¿No tienes una cuenta? Regístrate</Link>
        </div>
      </form>
    </div>
  );
}