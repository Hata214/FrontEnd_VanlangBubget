import { configureStore } from '@reduxjs/toolkit'
import incomeReducer from '@/redux/features/incomeSlice'
import expenseReducer from '@/lib/features/expense/expenseSlice'

export const store = configureStore({
    reducer: {
        income: incomeReducer,
        expense: expenseReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 