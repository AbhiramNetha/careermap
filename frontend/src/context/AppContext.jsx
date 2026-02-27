import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [selectedCareers, setSelectedCareers] = useState([]); // for comparison (max 3)
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResults, setQuizResults] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [filtersState, setFiltersState] = useState({
        category: '',
        branch: '',
        riskLevel: '',
        studyRequired: '',
    });

    const addToCompare = useCallback((career) => {
        setSelectedCareers(prev => {
            if (prev.find(c => c.id === career.id)) return prev; // already added
            if (prev.length >= 3) return prev; // max 3
            return [...prev, career];
        });
    }, []);

    const removeFromCompare = useCallback((careerId) => {
        setSelectedCareers(prev => prev.filter(c => c.id !== careerId));
    }, []);

    const clearCompare = useCallback(() => setSelectedCareers([]), []);

    const updateQuizAnswer = useCallback((field, value) => {
        setQuizAnswers(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateFilters = useCallback((filters) => {
        setFiltersState(prev => ({ ...prev, ...filters }));
    }, []);

    return (
        <AppContext.Provider
            value={{
                selectedCareers,
                addToCompare,
                removeFromCompare,
                clearCompare,
                quizAnswers,
                setQuizAnswers,
                updateQuizAnswer,
                quizResults,
                setQuizResults,
                selectedBranch,
                setSelectedBranch,
                filtersState,
                updateFilters,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
