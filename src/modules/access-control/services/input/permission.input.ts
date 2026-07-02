export interface IAbilityPermission {
  id: string;
  name: string;
  action: string;
  resource: string;
  description: string | null;
}

export interface ICreatePermissionInput {
  name: string;
  action: string;
  resource: string;
  description: string | null;
}

export interface IUpdatePermissionInput {
  id: string;
  name: string;
  action: string;
  resource: string;
  description: string | null;
}
