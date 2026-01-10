import { useEffect, useState } from 'react';
import { User } from '../types';
import { getUsers, deleteUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';

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

  const columns: GridColDef<User>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'Имя', width: 150, sortable: true },
    { field: 'lastName', headerName: 'Фамилия', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'skills',
      headerName: 'Навыки',
      width: 200,
      valueGetter: (params: any) => {
        const row = params.row as User | undefined;
        return row?.skills?.join(', ') || '';
      },
    },
    {
      field: 'registeredAt',
      headerName: 'Дата регистрации',
      width: 150,
      sortable: true,
      valueGetter: (params: any) => {
        const row = params.row as User | undefined;
        return row?.registeredAt ? new Date(row.registeredAt).toLocaleDateString() : '';
      },
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 250,
      sortable: false,
      renderCell: (params: GridRenderCellParams<User>) => {
        const row = params.row as User | undefined;
        if (!row) return null;
        return (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`/edit/${params.row.id}`)}
              sx={{ mr: 1 }}
            >
              Редактировать
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(params.row.id)}
            >
              Удалить
            </Button>
          </>
        );
      }
    }
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ mb: 1 }}>
        <Button variant="contained" onClick={() => navigate('/add')} sx={{ mr: 1 }}>
          Добавить пользователя
        </Button>
      </Box>
      <DataGrid
        columns={columns}
        rows={users}
        getRowId={(row: User) => row.id}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  );
}
