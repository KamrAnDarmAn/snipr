import React, { useContext, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShortLinkTable from './ContentTable';
import { Link, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useUrls } from '@/context/urls-context';
import { UserContext } from '@/context/user-context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
    originalUrl: z.string().url('Please enter a valid URL'),
});

const Hero = () => {
    const { userInfo } = useContext(UserContext);
    const { fetchUrls, error } = useUrls();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, formState: { isSubmitting } } = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: { originalUrl: '' },
    });

    useEffect(() => {
        if (!userInfo?.token && !isSubmitting) {
            toast.error('Please log in to shorten URLs');
            navigate('/login', { replace: true });
        }
    }, [userInfo?.token, isSubmitting, navigate]);

    const onSubmit = async (data) => {
        if (!userInfo?.token) {
            toast.error('Please log in to shorten URLs');
            navigate('/login', { replace: true });
            return;
        }

        try {
            await axios.post(
                import.meta.env.VITE_API_URL
                    ? `${import.meta.env.VITE_API_URL}/create`
                    : 'http://localhost:3001/create',
                { originalUrl: data.originalUrl },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            toast.success('URL shortened successfully');
            fetchUrls();
            reset();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to shorten URL');
            console.error("Shorten error:", error);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center space-y-4 p-4 min-h-screen pt-20 w-full max-w-[1200px] mx-auto">
            <h1 className="lg:text-5xl text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#144EE3] via-[#EB568E] via-64% to-[#144EE3] text-center">
                Shorten Your Loooong Links :)
            </h1>
            <p className="max-w-xl text-center text-sm md:text-base">
                Snipr is an efficient and easy-to-use URL shortening service that streamlines your online experience.
            </p>
            {error && !userInfo?.token && (
                <p className="text-red-500 text-sm text-center py-4">{error}</p>
            )}
            {userInfo?.token && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center w-full max-w-md bg-gray-200 dark:bg-gray-900 rounded-full p-1 shadow-lg"
                >
                    <div className="flex items-center flex-grow rounded-full overflow-hidden">
                        <Link className="w-5 h-5 text-gray-400 mx-3 flex-shrink-0" />
                        <input
                            {...register('originalUrl')}
                            type="text"
                            placeholder="Enter the link here"
                            className="flex-grow bg-transparent text-pink-400 placeholder-pink-400 text-sm focus:outline-none p-3"
                            disabled={isSubmitting}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#144EE3] text-white px-4 md:px-6 py-3 rounded-full ml-2 hover:bg-[#144EE3]/90 transition-none text-sm font-medium flex items-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            'Shortening...'
                        ) : (
                            <>
                                <span className="hidden md:inline">Shorten Now</span>
                                <ArrowRight className="w-5 h-5 md:hidden" />
                            </>
                        )}
                    </button>
                </form>
            )}
            {errors.originalUrl && (
                <p className="text-red-500 text-sm text-center py-4">{errors.originalUrl.message}</p>
            )}
            <ShortLinkTable />
        </main>
    );
};

export default memo(Hero);