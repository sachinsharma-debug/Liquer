// import { toast } from 'react-hot-toast';

// export const showToast = (message: string, type: 'success' | 'error' | 'loading' = 'success') => {
//   if (type === 'success') {
//     toast.success(message);
//   } else if (type === 'error') {
//     toast.error(message);
//   } else {
//     toast.loading(message);
//   }
// }




import { toast } from 'react-hot-toast';

const showToast = (
    message: string,
    type: 'success' | 'error' | 'loading' = 'success'
) => {
    const baseStyle = {
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '8px',
    };
    const duration = 5000;
    if (type === 'success') {
        toast.success(message, {
            duration,
            style: {
                ...baseStyle,
                background: '#d1fae5', // Light green background
                color: '#065f46',      // Dark green text
            },
        });
    } else if (type === 'error') {
        toast.error(message, {
            duration,
            style: {
                ...baseStyle,
                background: '#fee2e2', // Light red background
                color: '#991b1b',      // Dark red text
            },
        });
    } else {
        toast.loading(message, {
            duration,
            style: {
                ...baseStyle,
                background: '#e0f2fe', // Light blue for loading
                color: '#0369a1',      // Blue text
            },
        });
    }
};


export default showToast;