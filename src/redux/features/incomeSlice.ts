import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from '@/lib/axios'
import type { Income } from '@/types'
import { incomeService } from '@/services/incomeService'

interface IncomeState {
    incomes: Income[]
    isLoading: boolean
    error: string | null
    totalIncome: number
    categories: string[]
}

const initialState: IncomeState = {
    incomes: [],
    isLoading: false,
    error: null,
    totalIncome: 0,
    categories: []
}

export const fetchIncomes = createAsyncThunk(
    'income/fetchIncomes',
    async () => {
        const response = await axios.get<Income[]>('/api/incomes')
        return response.data
    }
)

export const fetchCategories = createAsyncThunk(
    'income/fetchCategories',
    async () => {
        const response = await incomeService.getCategories()
        return response
    }
)

export const addIncome = createAsyncThunk(
    'income/addIncome',
    async (income: Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        const response = await axios.post<Income>('/api/incomes', income)
        return response.data
    }
)

export const updateIncome = createAsyncThunk(
    'income/updateIncome',
    async ({ id, ...income }: { id: string } & Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        const response = await axios.put<Income>(`/api/incomes/${id}`, income)
        return response.data
    }
)

export const deleteIncome = createAsyncThunk(
    'income/deleteIncome',
    async (id: string) => {
        await axios.delete(`/api/incomes/${id}`)
        return id
    }
)

const incomeSlice = createSlice({
    name: 'income',
    initialState,
    reducers: {
        setIncomes: (state, action: PayloadAction<Income[]>) => {
            state.incomes = action.payload;
        },
        setTotalIncome: (state, action: PayloadAction<number>) => {
            state.totalIncome = action.payload;
        },
        addCategory: (state, action: PayloadAction<string>) => {
            if (!state.categories.includes(action.payload)) {
                state.categories.push(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch incomes
            .addCase(fetchIncomes.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchIncomes.fulfilled, (state, action: PayloadAction<Income[]>) => {
                state.isLoading = false
                state.incomes = action.payload
                state.totalIncome = action.payload.reduce(
                    (total: number, income: Income) => total + income.amount,
                    0
                )

                // Cập nhật danh sách danh mục từ dữ liệu thu nhập
                const categories = action.payload.map(income => income.category);
                const uniqueCategories = Array.from(new Set([...state.categories, ...categories]));
                state.categories = uniqueCategories;
            })
            .addCase(fetchIncomes.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })

            // Fetch categories
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.categories = action.payload
            })

            // Add income
            .addCase(addIncome.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(addIncome.fulfilled, (state, action: PayloadAction<Income>) => {
                state.isLoading = false
                state.incomes.push(action.payload)
                state.totalIncome += action.payload.amount

                // Thêm danh mục mới vào danh sách nếu chưa tồn tại
                if (!state.categories.includes(action.payload.category)) {
                    state.categories.push(action.payload.category);
                }
            })
            .addCase(addIncome.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })
            // Update income
            .addCase(updateIncome.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateIncome.fulfilled, (state, action: PayloadAction<Income>) => {
                state.isLoading = false
                const index = state.incomes.findIndex((income) => income.id === action.payload.id)
                if (index !== -1) {
                    // Cập nhật tổng thu nhập
                    state.totalIncome = state.totalIncome - state.incomes[index].amount + action.payload.amount;
                    state.incomes[index] = action.payload

                    // Thêm danh mục mới vào danh sách nếu chưa tồn tại
                    if (!state.categories.includes(action.payload.category)) {
                        state.categories.push(action.payload.category);
                    }
                }
            })
            .addCase(updateIncome.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })
            // Delete income
            .addCase(deleteIncome.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteIncome.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false
                const incomeToDelete = state.incomes.find((income) => income.id === action.payload);
                if (incomeToDelete) {
                    state.totalIncome -= incomeToDelete.amount;
                }
                state.incomes = state.incomes.filter((income) => income.id !== action.payload)
            })
            .addCase(deleteIncome.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })
    },
})

export const { setIncomes, setTotalIncome, addCategory } = incomeSlice.actions
export default incomeSlice.reducer 