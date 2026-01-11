import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { User, UserFormValues } from '../types';
import { addUser, updateUser, getUsers } from '../api';
import { useEffect, useState } from 'react';
import { TextField, Button, Box, Stack, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<UserFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      skills: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray<UserFormValues>({
    control,
    name: 'skills',
  });

  useEffect(() => {
    if (id) {
      getUsers().then(users => {
        const user = users.find(u => u.id === Number(id));
        if (user) {
          reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            skills: user.skills.map(s => ({ value: s })),
          });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, reset]);

  const onSubmit = async (data: UserFormValues) => {
    const payload: Omit<User, 'id'> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      skills: data.skills.map(s => s.value),
      registeredAt: new Date().toISOString(),
    };

    if (id) await updateUser(Number(id), payload);
    else await addUser(payload);

    navigate('/');
  };

  if (loading) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" mb={2}>
        {id ? 'Редактировать' : 'Добавить'} пользователя
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Имя"
            {...register('firstName', { required: 'Имя обязательно' })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
          />
          <TextField
            label="Фамилия"
            {...register('lastName', { required: 'Фамилия обязательна' })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
          />
          <TextField
            label="Email"
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Неверный формат Email',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <Box>
            <Typography mb={1}>Навыки</Typography>
            <Stack spacing={1}>
              {fields.map((f, idx) => (
                <Stack key={f.id} direction="row" spacing={1} alignItems="center">
                  <TextField
                    {...register(`skills.${idx}.value`)}
                    fullWidth
                    size="small"
                  />
                  <IconButton color="error" onClick={() => remove(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button variant="outlined" onClick={() => append({ value: '' })}>
                Добавить навык
              </Button>
            </Stack>
          </Box>

          <Button type="submit" variant="contained" size="large">
            {id ? 'Сохранить' : 'Добавить'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
