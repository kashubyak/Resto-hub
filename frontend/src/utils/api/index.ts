import { api, refreshApi } from './axiosInstances'
import './interceptors'

export { setGlobalAlertFunction } from './globalAlert'
export {
	initApiSubdomain,
	initApiFromCookies,
	setApiSubdomain,
	getSubdomainFromHostname,
	getCompanyUrl,
} from './subdomain'
export { api, refreshApi }

export default api
