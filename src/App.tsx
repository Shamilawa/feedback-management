import FeedbackList from "./components/FeedbackList";
import Header from "./components/Header";
import { Toaster } from "sonner";

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-center" richColors />
            <Header />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <FeedbackList />
            </div>
        </div>
    );
}

export default App;
