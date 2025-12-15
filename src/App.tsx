import FeedbackList from "./components/FeedbackList";
import Header from "./components/Header";

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Page Title Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Dashboard
                    </h2>
                </div>
                <FeedbackList />
            </div>
        </div>
    );
}

export default App;
