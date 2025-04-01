export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber?: string
}

export interface Income {
    id: string
    amount: number
    description: string
    category: string
    date: string
    userId: string
    createdAt: string
    updatedAt: string
}

export interface IncomeCategory {
    id: string
    name: string
    icon?: string
    color?: string
    userId: string
    createdAt: string
    updatedAt: string
}

export interface Expense {
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

export interface ExpenseCategory {
    id: string
    name: string
    icon?: string
    color?: string
    userId: string
    createdAt: string
    updatedAt: string
}

export interface Loan {
    id: string
    amount: number
    description: string
    lender: string
    interestRate: number
    startDate: string
    dueDate: string
    status: 'ACTIVE' | 'PAID' | 'OVERDUE'
    userId: string
    payments?: LoanPayment[]
    createdAt: string
    updatedAt: string
}

export interface LoanPayment {
    id: string
    loanId: string
    amount: number
    paymentDate: string
    description?: string
    attachments?: string[]
    userId: string
    createdAt: string
    updatedAt: string
}

export interface Budget {
    id: string
    category: string
    amount: number
    spent: number
    month: number
    year: number
    userId: string
    createdAt: string
    updatedAt: string
}

export interface ApiResponse<T> {
    data: T
    message?: string
}

export interface ApiError {
    message: string
    errors?: Record<string, string[]>
} 