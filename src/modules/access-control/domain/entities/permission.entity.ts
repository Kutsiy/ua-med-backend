type PermissionCreateInput = {
  id: string;
  name: string;
  description: string | null;
};

export class PermissionEntity {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
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

  create(permissionCreateInput: PermissionCreateInput) {
    return new PermissionEntity(
      permissionCreateInput.id,
      permissionCreateInput.name,
      permissionCreateInput.description,
    );
  }
}
