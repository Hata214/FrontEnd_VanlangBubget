import api from './api'

interface Expense {
    id: string
    amount: number
    description: string
    category: string
    date: string
    userId: string
    location?: {
        lat: number
        lng: number
        address: string
    }
    createdAt: string
    updatedAt: string
}

interface CreateExpenseData {
    amount: number
    description: string
    category: string
    date: string
    location?: {
        lat: number
        lng: number
        address: string
    }
    customCategory?: string
}

interface Budget {
    category: string
    amount: number
}

export const expenseService = {
    async getAll(): Promise<Expense[]> {
        const response = await api.get<Expense[]>('/expenses')
        return response.data
    },

    async getById(id: string): Promise<Expense> {
        const response = await api.get<Expense>(`/expenses/${id}`)
        return response.data
    },

    async create(data: CreateExpenseData): Promise<Expense> {
        const expenseData = { ...data };
        delete expenseData.customCategory;

        const response = await api.post<Expense>('/expenses', expenseData)
        return response.data
    },

    async update(id: string, data: Partial<CreateExpenseData>): Promise<Expense> {
        const response = await api.put<Expense>(`/expenses/${id}`, data)
        return response.data
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/expenses/${id}`)
    },

    async getByCategory(category: string): Promise<Expense[]> {
        const response = await api.get<Expense[]>(`/expenses/category/${category}`)
        return response.data
    },

    async getByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
        const response = await api.get<Expense[]>('/expenses/range', {
            params: { startDate, endDate },
        })
        return response.data
    },

    async getBudgets(): Promise<Budget[]> {
        const response = await api.get<Budget[]>('/expenses/budgets')
        return response.data
    },

    async setBudget(data: Budget): Promise<Budget> {
        const response = await api.post<Budget>('/expenses/budgets', data)
        return response.data
    },

    async updateBudget(category: string, data: Budget): Promise<Budget> {
        const response = await api.put<Budget>(`/expenses/budgets/${category}`, data)
        return response.data
    },

    async deleteBudget(category: string): Promise<void> {
        await api.delete(`/expenses/budgets/${category}`)
    },

    async getCategories(): Promise<string[]> {
        const response = await api.get<string[]>('/expenses/categories')
        return response.data
    },
} 