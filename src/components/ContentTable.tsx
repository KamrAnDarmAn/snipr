import { useState, memo, useEffect } from 'react';
import { Copy, ExternalLink, QrCode, Trash as Delete, Pencil as Edit, ActivityIcon, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useUrls } from '@/context/urls-context';
import { UserContext } from '@/context/user-context';
import { useContext } from 'react';
import QRCode from 'qrcode';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
    originalUrl: z.string().url('Please enter a valid URL'),
});

const ShortLinkTable = () => {
    const { userInfo } = useContext(UserContext);
    const { urls, fetchUrls, loading, error } = useUrls();
    const [isEdit, setIsEdit] = useState({ shortUrl: null, isEdit: false });
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        fetchUrls()
    }, [])
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(FormSchema),
    });

    const handleQRCode = async (shortUrl) => {
        setActionLoading((prev) => ({ ...prev, [shortUrl]: 'qr' }));
        try {
            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/get/${shortUrl}`;
            const urlData = await QRCode.toDataURL(url);
            const link = document.createElement('a');
            link.href = urlData;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('QR code downloaded successfully');
        } catch (err) {
            toast.error('Failed to generate QR code');
            console.error("QR code error:", err);
        } finally {
            setActionLoading((prev) => ({ ...prev, [shortUrl]: null }));
        }
    };

    const updateHandler = (shortUrl) => {
        setIsEdit({ shortUrl, isEdit: true });
        reset();
    };

    const handleUpdateSubmit = (shortUrl) => async (data) => {
        setActionLoading((prev) => ({ ...prev, [shortUrl]: 'update' }));
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/update/${shortUrl}`,
                { originalUrl: data.originalUrl },
                { headers: { Authorization: `Bearer ${userInfo?.token}` } }
            );
            toast.success('URL updated successfully');
            setIsEdit({ shortUrl: null, isEdit: false });
            fetchUrls();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update URL');
            console.error("Update error:", error);
        } finally {
            setActionLoading((prev) => ({ ...prev, [shortUrl]: null }));
        }
    };

    const deleteHandler = async (shortUrl) => {
        setActionLoading((prev) => ({ ...prev, [shortUrl]: 'delete' }));
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/delete/${shortUrl}`,
                { headers: { Authorization: `Bearer ${userInfo?.token}` } }
            );
            toast.success('URL deleted successfully');
            fetchUrls();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete URL');
            console.error("Delete error:", error);
        } finally {
            setActionLoading((prev) => ({ ...prev, [shortUrl]: null }));
        }
    };

    const copyHandler = (shortUrl) => {
        navigator.clipboard
            .writeText(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/get/${shortUrl}`)
            .then(() => toast.success('Copied to clipboard!'))
            .catch(() => toast.error('Failed to copy'));
    };


    return (
        <div className="bg-slate-50 dark:bg-[#0B101B] dark:text-white p-4 sm:p-6 md:p-8 rounded-xl w-full   mx-auto">
            {loading && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    <p>Loading URLs...</p>
                </div>
            )}
            {!loading && error && (
                <p className="text-red-500 text-sm text-center py-4">{error}</p>
            )}
            {!loading && !error && (
                <>
                    <div className="hidden sm:block">
                        <table className="w-full text-xs sm:text-sm md:text-base text-left">
                            <thead className="text-gray-400 border-b border-gray-700">
                                <tr>
                                    <th className="py-3 px-3 sm:px-4 md:px-6 font-medium">Short Link</th>
                                    <th className="py-3 px-3 sm:px-4 md:px-6 font-medium">Original Link</th>
                                    <th className="py-3 px-3 sm:px-4 md:px-6 font-medium">QR Code</th>
                                    <th className="py-3 px-3 sm:px-4 md:px-6 font-medium">Clicks</th>
                                    <th className="py-3 px-3 sm:px-4 md:px-6 font-medium">Status</th>
                                    <th className="py-3 px-3 sm:px-4 md:px-6 font-medium">Date</th>
                                    {userInfo && <th className="py-3 px-3 sm:px-4 md:px-6 font-medium">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {urls.length > 0 ? (
                                    urls.map((row) => (
                                        <tr
                                            key={row.shortUrl}
                                            className="border-b border-gray-800 hover:dark:bg-gray-900 hover:bg-gray-200 transition-none"
                                        >
                                            <td className="py-3 px-3 sm:px-4 md:px-6">
                                                <div className="flex items-center gap-2 max-w-[150px] md:max-w-[200px] truncate">
                                                    <span className="truncate">
                                                        {import.meta.env.VITE_API_URL || 'https://snipr'}/{row.shortUrl}
                                                    </span>
                                                    <Copy
                                                        onClick={() => copyHandler(row.shortUrl)}
                                                        className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 sm:px-4 md:px-6">
                                                <div className="flex items-center gap-2 max-w-[150px] sm:max-w-[200px] md:max-w-[300px] truncate">
                                                    {isEdit.isEdit && isEdit.shortUrl === row.shortUrl ? (
                                                        <form onSubmit={handleSubmit(handleUpdateSubmit(row.shortUrl))}>
                                                            <input
                                                                {...register('originalUrl')}
                                                                autoComplete="off"
                                                                autoFocus
                                                                className="truncate border border-blue-400 rounded-sm px-2 py-1 bg-white dark:bg-gray-800 focus:border-blue-600"
                                                                defaultValue={row.longUrl}
                                                            />
                                                            {errors.originalUrl && (
                                                                <p className="text-red-500 text-sm">{errors.originalUrl.message}</p>
                                                            )}
                                                        </form>
                                                    ) : (
                                                        <span className="truncate">{row.longUrl}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 sm:px-4 md:px-6">
                                                <div className="flex gap-2">
                                                    <QrCode
                                                        onClick={() => handleQRCode(row.shortUrl)}
                                                        className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 ${actionLoading[row.shortUrl] === 'qr' ? 'opacity-50' : ''}`}
                                                    />
                                                    <a href={row.longUrl} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200" />
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 sm:px-4 md:px-6">{row.click}</td>
                                            <td className="py-3 px-3 sm:px-4 md:px-6">
                                                <span className={`flex items-center gap-1 ${row.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                    <CheckCircle size={20} /> {row.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 sm:px-4 md:px-6">{new Date(row.createdAt).toLocaleDateString()}</td>
                                            {userInfo && (
                                                <td className="py-3 px-3 sm:px-4 md:px-6">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => deleteHandler(row.shortUrl)}
                                                            className={`border-2 rounded-full p-2 bg-[rgba(255,0,0,0.09)] hover:bg-[rgba(255,0,0,0.2)] transition-none ${actionLoading[row.shortUrl] === 'delete' ? 'opacity-50' : ''}`}
                                                            disabled={actionLoading[row.shortUrl] === 'delete'}
                                                        >
                                                            <Delete size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateHandler(row.shortUrl)}
                                                            className={`border-2 rounded-full p-2 bg-[rgba(0,255,0,0.07)] hover:bg-[rgba(0,255,0,0.15)] transition-none ${actionLoading[row.shortUrl] === 'update' ? 'opacity-50' : ''}`}
                                                            disabled={actionLoading[row.shortUrl] === 'update'}
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={userInfo ? 7 : 6} className="text-center py-4">
                                            <h1 className="font-semibold">No URLs Found!</h1>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile view */}
                    <div className="sm:hidden space-y-4">
                        {urls.length > 0 ? (
                            urls.map((row) => (
                                <div
                                    key={row.shortUrl}
                                    className="border border-gray-700 rounded-lg p-4 bg-white dark:bg-[#1a202c] hover:bg-gray-100 dark:hover:bg-gray-900 transition-none"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 max-w-[70%]">
                                                <span className="font-medium truncate">
                                                    {import.meta.env.VITE_API_URL || 'https://snipr'}/get/{row.shortUrl}
                                                </span>
                                                <Copy
                                                    onClick={() => copyHandler(row.shortUrl)}
                                                    className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <QrCode
                                                    onClick={() => handleQRCode(row.shortUrl)}
                                                    className={`w-4 h-4 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 ${actionLoading[row.shortUrl] === 'qr' ? 'opacity-50' : ''}`}
                                                />
                                                <a href={row.longUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 max-w-[80%]">
                                            {isEdit.isEdit && isEdit.shortUrl === row.shortUrl ? (
                                                <form onSubmit={handleSubmit(handleUpdateSubmit(row.shortUrl))}>
                                                    <input
                                                        {...register('originalUrl')}
                                                        autoComplete="off"
                                                        autoFocus
                                                        className="truncate border border-blue-400 rounded-sm px-2 py-1 bg-white dark:bg-gray-800 focus:border-blue-600"
                                                        defaultValue={row.longUrl}
                                                    />
                                                    {errors.originalUrl && (
                                                        <p className="text-red-500 text-sm">{errors.originalUrl.message}</p>
                                                    )}
                                                </form>
                                            ) : (
                                                <span className="truncate">{row.longUrl}</span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-400">Clicks: </span>
                                                <span>{row.click}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Date: </span>
                                                <span>{new Date(row.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-gray-400">Status: </span>
                                                <span className={`flex  gap-2 items-center ${row.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                    {row.status}  <CheckCircle size={15} />
                                                </span>
                                            </div>
                                        </div>
                                        {userInfo && (
                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={() => deleteHandler(row.shortUrl)}
                                                    className={`flex-1 border-2 rounded-full p-2 bg-[rgba(255,0,0,0.09)] hover:bg-[rgba(255,0,0,0.2)] transition-none ${actionLoading[row.shortUrl] === 'delete' ? 'opacity-50' : ''}`}
                                                    disabled={actionLoading[row.shortUrl] === 'delete'}
                                                >
                                                    <Delete size={20} className="mx-auto" />
                                                </button>
                                                <button
                                                    onClick={() => updateHandler(row.shortUrl)}
                                                    className={`flex-1 border-2 rounded-full p-2 bg-[rgba(0,255,0,0.07)] hover:bg-[rgba(0,255,0,0.15)] transition-none ${actionLoading[row.shortUrl] === 'update' ? 'opacity-50' : ''}`}
                                                    disabled={actionLoading[row.shortUrl] === 'update'}
                                                >
                                                    <Edit size={20} className="mx-auto" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h1 className="font-semibold text-center py-4">No URLs Found!</h1>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default memo(ShortLinkTable);