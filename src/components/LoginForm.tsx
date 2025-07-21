import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import type { RootState } from '../app/store';
import { loginUser } from '../features/user/userSlice';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error } = useAppSelector((state: RootState) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm" style={{ minWidth: '320px', maxWidth: '400px', width: '100%' }}>
        <h3 className="mb-4 text-center">Вхід</h3>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@mail.com"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">Пароль:</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Авторизація...' : 'Увійти'}
        </button>

        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
