import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { expenseService } from '@/services/expenseService'
import type { Expense } from '@/types'

interface Location {
    lat: number
    lng: number
    address: string
}

interface ExpenseState {
    expenses: Expense[]
    totalExpense: number
    categories: string[]
    isLoading: boolean
    error: string | null
}

const initialState: ExpenseState = {
    expenses: [],
    totalExpense: 0,
    categories: [],
    isLoading: false,
    error: null,
}

export const fetchExpenses = createAsyncThunk(
    'expense/fetchExpenses',
    async () => {
        const response = await expenseService.getAll()
        return response
    }
)

export const fetchCategories = createAsyncThunk(
    'expense/fetchCategories',
    async () => {
        const response = await expenseService.getCategories()
        return response
    }
)

export const addExpense = createAsyncThunk(
    'expense/addExpense',
    async (data: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        const response = await expenseService.create(data)
        return response
    }
)

export const updateExpense = createAsyncThunk(
    'expense/updateExpense',
    async ({ id, ...data }: { id: string } & Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        const response = await expenseService.update(id, data)
        return response
    }
)

export const deleteExpense = createAsyncThunk(
    'expense/deleteExpense',
    async (id: string) => {
        await expenseService.delete(id)
        return id
    }
)

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        setExpenses: (state, action: PayloadAction<Expense[]>) => {
            state.expenses = action.payload;
        },
        setTotalExpense: (state, action: PayloadAction<number>) => {
            state.totalExpense = action.payload;
        },
        addCategory: (state, action: PayloadAction<string>) => {
            if (!state.categories.includes(action.payload)) {
                state.categories.push(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch expenses
            .addCase(fetchExpenses.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<Expense[]>) => {
                state.isLoading = false
                state.expenses = action.payload
                state.totalExpense = action.payload.reduce(
                    (total: number, expense: Expense) => total + expense.amount,
                    0
                )

                // Cập nhật danh sách danh mục từ dữ liệu chi tiêu
                const categories = action.payload.map(expense => expense.category);
                const uniqueCategories = Array.from(new Set([...state.categories, ...categories]));
                state.categories = uniqueCategories;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra khi tải dữ liệu'
            })

            // Fetch categories
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.categories = action.payload
            })

            // Add expense
            .addCase(addExpense.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(addExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
                state.isLoading = false
                state.expenses.push(action.payload)
                state.totalExpense += action.payload.amount

                if (!state.categories.includes(action.payload.category)) {
                    state.categories.push(action.payload.category);
                }
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra khi thêm chi tiêu'
            })

            // Update expense
            .addCase(updateExpense.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
                state.isLoading = false
                const index = state.expenses.findIndex((expense) => expense.id === action.payload.id)
                if (index !== -1) {
                    state.totalExpense =
                        state.totalExpense -
                        state.expenses[index].amount +
                        action.payload.amount
                    state.expenses[index] = action.payload

                    if (!state.categories.includes(action.payload.category)) {
                        state.categories.push(action.payload.category);
                    }
                }
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra khi cập nhật chi tiêu'
            })

            // Delete expense
            .addCase(deleteExpense.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteExpense.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false
                const expenseToDelete = state.expenses.find((e) => e.id === action.payload);
                if (expenseToDelete) {
                    state.totalExpense -= expenseToDelete.amount;
                }
                state.expenses = state.expenses.filter((expense) => expense.id !== action.payload)
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra khi xóa chi tiêu'
            })
    },
})

export const { setExpenses, setTotalExpense, addCategory } = expenseSlice.actions
export default expenseSlice.reducer 