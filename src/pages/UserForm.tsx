import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { User, UserFormValues } from '../types';
import { addUser, updateUser, getUsers } from '../api';
import { useEffect, useState } from 'react';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { register, control, handleSubmit, reset } = useForm<UserFormValues>({
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

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>{id ? 'Редактировать' : 'Добавить'} пользователя</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Имя</label>
          <input {...register('firstName')} />
        </div>
        <div>
          <label>Фамилия</label>
          <input {...register('lastName')} />
        </div>
        <div>
          <label>Email</label>
          <input {...register('email')} />
        </div>
        <div>
          <label>Навыки</label>
          {fields.map((f, idx) => (
            <div key={f.id}>
              <input {...register(`skills.${idx}.value`)} />
              <button type="button" onClick={() => remove(idx)}>Удалить</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ value: '' })}>
            Добавить навык
          </button>
        </div>
        <button type="submit">{id ? 'Сохранить' : 'Добавить'}</button>
      </form>
    </div>
  );
}
