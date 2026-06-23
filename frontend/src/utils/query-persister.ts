import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { del, get, set } from 'idb-keyval'

const idbStorage = {
	getItem: async (key: string) => (await get<string>(key)) ?? null,
	setItem: async (key: string, value: string) => {
		await set(key, value)
	},
	removeItem: async (key: string) => {
		await del(key)
	},
}

export const queryPersister = createAsyncStoragePersister({
	storage: idbStorage,
	key: 'resto-hub-query-cache',
})
