export type User = {
	user: {
		id: number;
		username: string;
		email: string;
		admin: boolean;
		created: string;
		updated?: string;
	};
	token: string;
	expiresIn: number;
};

export type Order = {
	id: string;
	created: string;
	current_state: string;
	current_state_created: string;
};

export type Orders = {
	limit: number;
	offset: number;
	items: Array<Order>;
};
