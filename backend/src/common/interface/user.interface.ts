export interface ISubUserDto {
	name: string
	email: string
	password: string
	role: 'WAITER' | 'COOK'
}

export interface IBaseUser {
	id: number
	name: string
}

export interface IExtendedUser extends IBaseUser {
	email: string
	role: string
}
