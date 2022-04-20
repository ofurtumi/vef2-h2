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

export type Line = {
	id: number;
	product_id: number;
	title: string;
	description: string;
	image: string;
	category: number;
	quantity: number;
	price: number;
	total: number;
};

export type Order = {
	id: string;
	created: string;
	current_state: string;
	current_state_created: string;
	lines: Array<Line>;
};

export type Orders = {
	limit: number;
	offset: number;
	items: Array<Order>;
};

export type MenuItem = {
	id: number;
	category: number;
	title: string;
	description: string;
	price: number;
	image: string;
	created: string;
	updated: string;
};

export type Menu = {
	limit: number;
	offset: number;
	items: Array<MenuItem>;
};

export type Category = {
	id: number;
	title: string;
}

export type Categories = {
	limit: number;
	offset: number;
	items: Array<Category>;
}
