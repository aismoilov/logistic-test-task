interface RequestConfig extends RequestInit {
  baseURL?: string
}

class HttpClient {
  private baseURL: string

  constructor(baseURL = '') {
    this.baseURL = baseURL
  }

  async request<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const { baseURL, headers = {}, body, ...rest } = config

    const fullUrl = `${baseURL || this.baseURL}${url}`

    const requestConfig: RequestInit = {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    if (body) {
      requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    try {
      const response = await fetch(fullUrl, requestConfig)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  }

  get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  post<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'POST', body: body as BodyInit })
  }

  put<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'PUT', body: body as BodyInit })
  }

  patch<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'PATCH', body: body as BodyInit })
  }

  delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }
}

export const http = new HttpClient()
