
// eslint-disable-next-line react/prop-types
export default function ThemeProvider({ children }) {
    return (
        <div >
            <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
                {children}
            </div>
        </div>
    );
}