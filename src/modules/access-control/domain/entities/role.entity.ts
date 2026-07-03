import { randomUUID } from 'crypto';

export class RoleEntity {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _description: string | null,
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

  set name(name: string) {
    this._name = name;
  }

  set description(description: string | null) {
    this._description = description;
  }

  updateProfile(profile: { name: string; description: string | null }) {
    this._name = profile.name;
    this._description = profile.description;
  }

  static create(name: string, description: string | null): RoleEntity {
    return new RoleEntity(randomUUID(), name, description);
  }
}
