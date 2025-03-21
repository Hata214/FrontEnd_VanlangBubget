import api from './api'

interface Income {
    id: string
    amount: number
    description: string
    category: string
    date: string
    userId: string
    createdAt: string
    updatedAt: string
}

interface CreateIncomeData {
    amount: number
    description: string
    category: string
    date: string
    customCategory?: string
}

export const incomeService = {
    async getAll(): Promise<Income[]> {
        const response = await api.get<Income[]>('/incomes')
        return response.data
    },

    async getById(id: string): Promise<Income> {
        const response = await api.get<Income>(`/incomes/${id}`)
        return response.data
    },

    async create(data: CreateIncomeData): Promise<Income> {
        const incomeData = { ...data };
        delete incomeData.customCategory;

        const response = await api.post<Income>('/incomes', incomeData)
        return response.data
    },

    async update(id: string, data: Partial<CreateIncomeData>): Promise<Income> {
        const incomeData = { ...data };
        if (incomeData.customCategory) {
            delete incomeData.customCategory;
        }

        const response = await api.put<Income>(`/incomes/${id}`, incomeData)
        return response.data
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/incomes/${id}`)
    },

    async getByCategory(category: string): Promise<Income[]> {
        const response = await api.get<Income[]>(`/incomes/category/${category}`)
        return response.data
    },

    async getByDateRange(startDate: string, endDate: string): Promise<Income[]> {
        const response = await api.get<Income[]>('/incomes/range', {
            params: { startDate, endDate },
        })
        return response.data
    },

    async getCategories(): Promise<string[]> {
        const response = await api.get<string[]>('/incomes/categories')
        return response.data
    },
} 