import { apiClient } from './client'
import type { DashboardResumo } from '../types/dashboard'

export const dashboardApi = {
  obterResumo: async () => {
    const { data } = await apiClient.get<DashboardResumo>('/dashboard/resumo')
    return data
  },
}
