import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import authService from '../../services/authService';

interface EditProfileInputs {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

const EditProfileForm: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<EditProfileInputs>({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || ''
        }
    });
    const newPassword = watch("newPassword");

    const onSubmit = async (data: EditProfileInputs) => {
        try {
            // TODO: Implement update profile logic
            console.log(data);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Họ và tên
                </label>
                <input
                    {...register("name", {
                        required: "Họ và tên là bắt buộc",
                        minLength: {
                            value: 2,
                            message: "Họ và tên phải có ít nhất 2 ký tự"
                        }
                    })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    {...register("email", {
                        required: "Email là bắt buộc",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email không hợp lệ"
                        }
                    })}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Mật khẩu hiện tại
                </label>
                <input
                    {...register("currentPassword")}
                    type="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Mật khẩu mới
                </label>
                <input
                    {...register("newPassword", {
                        minLength: {
                            value: 6,
                            message: "Mật khẩu phải có ít nhất 6 ký tự"
                        }
                    })}
                    type="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-1">
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu mới
                </label>
                <input
                    {...register("confirmNewPassword", {
                        validate: value =>
                            !newPassword || value === newPassword || "Mật khẩu xác nhận không khớp"
                    })}
                    type="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                {errors.confirmNewPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword.message}</p>}
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Cập nhật thông tin
                </button>
            </div>
        </form>
    );
};

export default EditProfileForm; 