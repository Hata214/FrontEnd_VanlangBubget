import api from './api'
import type { Loan, LoanPayment } from '@/types'

export type CreateLoanData = Omit<Loan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type UpdateLoanData = Partial<Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>>
export type CreateLoanPaymentData = Omit<LoanPayment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type UpdateLoanPaymentData = Partial<Omit<LoanPayment, 'id' | 'createdAt' | 'updatedAt'>>

class LoanService {
    async getAll() {
        const response = await api.get<Loan[]>('/loans')
        return response.data
    }

    async getById(id: string) {
        const response = await api.get<Loan>(`/loans/${id}`)
        return response.data
    }

    async create(data: CreateLoanData) {
        const response = await api.post<Loan>('/loans', data)
        return response.data
    }

    async update(id: string, data: UpdateLoanData) {
        const response = await api.put<Loan>(`/loans/${id}`, data)
        return response.data
    }

    async delete(id: string) {
        await api.delete(`/loans/${id}`)
    }

    async getPayments(loanId: string) {
        const response = await api.get<LoanPayment[]>(`/loans/${loanId}/payments`)
        return response.data
    }

    async createPayment(loanId: string, data: CreateLoanPaymentData) {
        const response = await api.post<LoanPayment>(`/loans/${loanId}/payments`, data)
        return response.data
    }

    async updatePayment(loanId: string, paymentId: string, data: UpdateLoanPaymentData) {
        const response = await api.put<LoanPayment>(`/loans/${loanId}/payments/${paymentId}`, data)
        return response.data
    }

    async deletePayment(loanId: string, paymentId: string) {
        await api.delete(`/loans/${loanId}/payments/${paymentId}`)
    }

    async uploadPaymentAttachment(loanId: string, paymentId: string, file: File) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post<{ url: string }>(
            `/loans/${loanId}/payments/${paymentId}/attachments`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    }

    async uploadPaymentAttachments(loanId: string, paymentId: string, files: File[]) {
        const uploadPromises = files.map(file => this.uploadPaymentAttachment(loanId, paymentId, file))
        const results = await Promise.all(uploadPromises)
        return results.map(result => result.url)
    }
}

export const loanService = new LoanService() 