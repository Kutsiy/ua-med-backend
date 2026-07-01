type PermissionCreateInput = {
  id: string;
  name: string;
  action: string;
  resourse: string;
  description: string | null;
};

export class PermissionEntity {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _action: string,
    private readonly _resource: string,
    private readonly _description: string | null,
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get action() {
    return this._action;
  }

  get resource() {
    return this._resource;
  }

  create(permissionCreateInput: PermissionCreateInput) {
    return new PermissionEntity(
      permissionCreateInput.id,
      permissionCreateInput.name,
      permissionCreateInput.action,
      permissionCreateInput.resourse,
      permissionCreateInput.description,
    );
  }
}
