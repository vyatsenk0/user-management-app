import { useEffect, useState } from 'react';
import { User } from '../types';
import { getUsers, deleteUser } from '../api';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  // pagination
  const [page, setPage] = useState(1);
  const usersPerPage = 5;
  const totalPages = Math.ceil(users.length / usersPerPage);

  // sorting
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;

    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    return 0;
  });

  // pagination after sorting
  const paginatedUsers = sortedUsers.slice((page - 1) * usersPerPage, page * usersPerPage);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <>
      <div>
        <h1>Список пользователей</h1>
        <button onClick={() => navigate('/add')}>Добавить пользователя</button>
        <button 
          onClick={() => {
            setSortField(null);
            setSortAsc(true);
          }}
          style={{ marginLeft: 8 }}
        >
          Сбросить сортировку
        </button>
        <table border={1} style={{ marginTop: 10, width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>

              <th
                onClick={() => {
                  setSortField('firstName');
                  setSortAsc(sortField === 'firstName' ? !sortAsc : true);
                }}
                style={{ cursor: 'pointer' }}
              >
                Имя {sortField === 'firstName' ? (sortAsc ? '▲' : '▼') : ''}
              </th>

              <th>Фамилия</th>
              <th>Email</th>
              <th>Навыки</th>

              <th
                onClick={() => {
                  setSortField('registeredAt');
                  setSortAsc(sortField === 'registeredAt' ? !sortAsc : true);
                }}
                style={{ cursor: 'pointer' }}
              >
                Дата регистрации {sortField === 'registeredAt' ? (sortAsc ? '▲' : '▼') : ''}
              </th>

              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(u => (
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
      <div style={{ marginTop: 10 }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            key={i} 
            onClick={() => setPage(i + 1)} 
            disabled={page === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
}
