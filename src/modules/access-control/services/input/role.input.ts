export interface IRoleCreateInput {
  name: string;
  description: string | null;
}

export interface IRoleUpdateInput {
  id: string;
  name: string;
  description: string;
}
