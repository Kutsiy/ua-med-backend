export class RoleEnity {
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
}
