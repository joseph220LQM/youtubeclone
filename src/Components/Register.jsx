import React, { useState, navigate } from 'react';
import { Link } from 'react-router-dom';
import './Styles/Register.css';

export default function Register({ role }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/user/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, role }),
      });

      if (response.ok) {
          alert('Usuario creado exitosamente');
          navigate('/Login');  // Redirige al panel de administración
        } else {
          const data = await response.json();
          alert(data.message);
        }
  } catch (error) {
      alert('Error al conectar con el servidor');
  }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Crear una cuenta</h2>
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        
        <button type="submit" className="register-button">
          Registrarse
        </button>
        <div className="signup-link">
            <Link to="/Login">¿Ya tienes una cuenta? Ingresa</Link>
        </div>
      </form>
    </div>
  );
}