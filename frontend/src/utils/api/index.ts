import { api, refreshApi } from './axiosInstances'
import './interceptors'

export { setGlobalAlertFunction } from './globalAlert'
export {
	getCompanyUrl,
	getRootAppUrl,
	getSubdomainFromHost,
	getSubdomainFromHostname,
	initApiSubdomain,
	initApiFromCookies,
	setApiSubdomain,
} from './subdomain'
export { api, refreshApi }

export default api
