import { useEffect, useState } from 'react';
import { User } from '../types';
import { getUsers, deleteUser } from '../api';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div>
      <h1>Список пользователей</h1>
      <button onClick={() => navigate('/add')}>Добавить пользователя</button>
      <table border={1} style={{ marginTop: 10, width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Имя</th><th>Фамилия</th><th>Email</th><th>Навыки</th><th>Дата регистрации</th><th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.skills.join(', ')}</td>
              <td>{new Date(u.registeredAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => navigate(`/edit/${u.id}`)}>Редактировать</button>
                <button onClick={() => handleDelete(u.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
