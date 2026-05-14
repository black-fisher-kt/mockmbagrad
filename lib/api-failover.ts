// API Failover Manager - Tracks active API and rotates on failure

interface APIConfig {
  name: string
  url: string
  key: string
  model: string
}

export const API_ENDPOINTS: APIConfig[] = [
  {
    name: 'ollama-primary',
    url: 'https://ollama.com/v1/chat/completions',
    key: '6e953b75e00c4a4e8ed89f3f5a68c78a.Eo8knkLKz9nvzEv4sb4K-sU3',
    model: 'qwen3-coder-next'
  },
  {
    name: 'ollama-secondary',
    url: 'https://ollama.com/v1/chat/completions',
    key: '33c02a56794846fb947f16cf665b8ea0.yFBKKEX7RzEi9C6Z4MBz-xxC',
    model: 'qwen3-coder-next'
  },
  {
    name: 'ollama-tertiary',
    url: 'https://ollama.com/v1/chat/completions',
    key: 'c08148482a1b4d42bd4ad29c03430ea4.iSC6uSRei1XuG44uqZ7-Cgmj',
    model: 'qwen3-coder-next'
  }
]

// In-memory active API index (in production, use Redis/DB)
let activeApiIndex = 0
// Track failed requests for each API
const apiFailureCount = new Map<number, number>()

export function getActiveApi(): APIConfig {
  return API_ENDPOINTS[activeApiIndex]
}

export function setActiveApi(index: number): void {
  if (index < 0 || index >= API_ENDPOINTS.length) {
    console.error(`Invalid API index: ${index}. Must be between 0 and ${API_ENDPOINTS.length - 1}`)
    return
  }
  const previousIndex = activeApiIndex
  activeApiIndex = index
  apiFailureCount.set(activeApiIndex, 0)
  console.log(`🔄 API Switched: ${API_ENDPOINTS[previousIndex].name} → ${API_ENDPOINTS[activeApiIndex].name}`)
}

export function getCurrentApiIndex(): number {
  return activeApiIndex
}

export function rotateToNextApi(): void {
  const previousIndex = activeApiIndex

  // Update to next API in rotation
  activeApiIndex = (activeApiIndex + 1) % API_ENDPOINTS.length
  
  console.log(
    `🔄 API Rotated: ${API_ENDPOINTS[previousIndex].name} → ${API_ENDPOINTS[activeApiIndex].name}`
  )

  // Reset failure count for the new active API
  apiFailureCount.set(activeApiIndex, 0)
}

export function recordApiFailure(): void {
  // Increment failure count for current active API
  const currentFailureCount = apiFailureCount.get(activeApiIndex) || 0
  apiFailureCount.set(activeApiIndex, currentFailureCount + 1)

  console.log(`❌ API ${API_ENDPOINTS[activeApiIndex].name} failed (${currentFailureCount + 1} failures)`)

  // If we've had multiple failures in a row, rotate to next API
  if (currentFailureCount >= 2) { // 2 consecutive failures
    rotateToNextApi()
  }
}

export function resetApiFailures(): void {
  // Reset failure count for current active API on successful request
  apiFailureCount.set(activeApiIndex, 0)
}

export function getApiStatus(): string {
  const currentApi = API_ENDPOINTS[activeApiIndex]
  const failures = apiFailureCount.get(activeApiIndex) || 0
  return `${currentApi.name} (Index: ${activeApiIndex}/${API_ENDPOINTS.length - 1}, Failures: ${failures})`
}

// For adding new APIs dynamically
export function addApiEndpoint(api: APIConfig): void {
  API_ENDPOINTS.push(api)
  console.log('✅ Added new API: ' + api.name)
}

// Reset to primary API (useful for manual override)
export function resetToPrimary(): void {
  const prevIndex = activeApiIndex
  activeApiIndex = 0
  apiFailureCount.set(0, 0)
  console.log(`🔄 API Reset: ${API_ENDPOINTS[prevIndex].name} → ${API_ENDPOINTS[0].name}`)
}

// Utility to try all APIs sequentially until one succeeds
export async function tryAllApis<T>(
  attempts: number,
  apiCall: (apiIndex: number) => Promise<T>
): Promise<T | null> {
  let lastError: Error | null = null
  
  for (let i = 0; i < attempts; i++) {
    const currentApiIndex = (activeApiIndex + i) % API_ENDPOINTS.length
    setActiveApi(currentApiIndex)
    
    try {
      const result = await apiCall(currentApiIndex)
      if (result) {
        resetApiFailures()
        return result
      }
    } catch (error) {
      lastError = error as Error
      recordApiFailure()
      console.log(`Attempt ${i + 1} failed, trying next API...`)
    }
  }
  
  console.error('All API attempts failed')
  return null
}
