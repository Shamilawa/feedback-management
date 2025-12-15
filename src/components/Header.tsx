import { LayoutDashboard } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <LayoutDashboard className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            Feedback Management
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Placeholder for user profile or settings */}
                        <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                            JD
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
