import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: { username: '', password: '' },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/auth/register', data);
            if (response.status === 201) {
                toast.success('Registration Successful');
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Username already exists');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center min-h-screen w-full lg:max-w-[80%] z-10"
        >
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <div className="mb-4 w-full max-w-md">
                <Input
                    {...register('username')}
                    type="text"
                    placeholder="Username"
                    className="w-full"
                    disabled={loading}
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            <div className="mb-4 w-full max-w-md">
                <Input
                    {...register('password')}
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    disabled={loading}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full max-w-md" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </Button>
        </form>
    );
}