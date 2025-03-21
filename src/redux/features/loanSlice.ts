import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loanService } from '@/services/loanService'
import type { Loan } from '@/types'

interface LoanState {
    loans: Loan[]
    selectedLoan: Loan | null
    totalLoan: number
    isLoading: boolean
    error: string | null
}

const initialState: LoanState = {
    loans: [],
    selectedLoan: null,
    totalLoan: 0,
    isLoading: false,
    error: null,
}

export const fetchLoans = createAsyncThunk('loan/fetchLoans', async () => {
    const response = await loanService.getAll()
    return response
})

export const fetchLoanById = createAsyncThunk(
    'loan/fetchLoanById',
    async (id: string) => {
        const response = await loanService.getById(id)
        return response
    }
)

export const addLoan = createAsyncThunk(
    'loan/addLoan',
    async (data: Omit<Loan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        const response = await loanService.create(data)
        return response
    }
)

export const updateLoan = createAsyncThunk(
    'loan/updateLoan',
    async ({ id, data }: { id: string; data: Partial<Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>> }) => {
        const response = await loanService.update(id, data)
        return response
    }
)

export const deleteLoan = createAsyncThunk(
    'loan/deleteLoan',
    async (id: string) => {
        await loanService.delete(id)
        return id
    }
)

const loanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        setLoans: (state, action) => {
            state.loans = action.payload;
        },
        setTotalLoan: (state, action) => {
            state.totalLoan = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch loans
            .addCase(fetchLoans.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchLoans.fulfilled, (state, action) => {
                state.isLoading = false
                state.loans = action.payload
                state.totalLoan = action.payload.reduce(
                    (total: number, loan: Loan) =>
                        loan.status === 'ACTIVE' ? total + loan.amount : total,
                    0
                )
            })
            .addCase(fetchLoans.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })

            // Fetch loan by id
            .addCase(fetchLoanById.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchLoanById.fulfilled, (state, action) => {
                state.isLoading = false
                state.selectedLoan = action.payload
            })
            .addCase(fetchLoanById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })

            // Add loan
            .addCase(addLoan.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(addLoan.fulfilled, (state, action) => {
                state.isLoading = false
                state.loans.push(action.payload)
                if (action.payload.status === 'ACTIVE') {
                    state.totalLoan += action.payload.amount
                }
            })
            .addCase(addLoan.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })

            // Update loan
            .addCase(updateLoan.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateLoan.fulfilled, (state, action) => {
                state.isLoading = false
                const index = state.loans.findIndex((loan) => loan.id === action.payload.id)
                if (index !== -1) {
                    const oldLoan = state.loans[index]
                    if (oldLoan.status === 'ACTIVE') {
                        state.totalLoan -= oldLoan.amount
                    }
                    if (action.payload.status === 'ACTIVE') {
                        state.totalLoan += action.payload.amount
                    }
                    state.loans[index] = action.payload
                }
                if (state.selectedLoan?.id === action.payload.id) {
                    state.selectedLoan = action.payload
                }
            })
            .addCase(updateLoan.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })

            // Delete loan
            .addCase(deleteLoan.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteLoan.fulfilled, (state, action) => {
                state.isLoading = false
                const index = state.loans.findIndex((loan) => loan.id === action.payload)
                if (index !== -1) {
                    const loan = state.loans[index]
                    if (loan.status === 'ACTIVE') {
                        state.totalLoan -= loan.amount
                    }
                    state.loans.splice(index, 1)
                }
                if (state.selectedLoan?.id === action.payload) {
                    state.selectedLoan = null
                }
            })
            .addCase(deleteLoan.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })
    },
})

export const { setLoans, setTotalLoan } = loanSlice.actions
export default loanSlice.reducer 