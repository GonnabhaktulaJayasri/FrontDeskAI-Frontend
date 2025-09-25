
export default function Loader({ size = 12, fullScreen = true }) {
    return (
        <div
            className={`flex items-center justify-center ${fullScreen ? "h-screen w-screen" : "w-full h-64"
                }`} style={{ backgroundColor: "transparent" }}
        >
            <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
}
