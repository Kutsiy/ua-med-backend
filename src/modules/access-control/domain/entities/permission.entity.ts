import { randomUUID } from 'crypto';

type PermissionCreateInput = {
  name: string;
  action: string;
  resource: string;
  description: string | null;
};

export class PermissionEntity {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _action: string,
    private _resource: string,
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

  get action() {
    return this._action;
  }

  get resource() {
    return this._resource;
  }

  set name(name: string) {
    this._name = name;
  }
  set description(description: string | null) {
    this._description = description;
  }

  set action(action: string) {
    this._action = action;
  }

  set resource(resource: string) {
    this._resource = resource;
  }

  updateProfile(profile: {
    name: string;
    description: string | null;
    action: string;
    resource: string;
  }) {
    this._name = profile.name;
    this._description = profile.description;
    this._action = profile.action;
    this._resource = profile.resource;
  }

  static create(permissionCreateInput: PermissionCreateInput) {
    return new PermissionEntity(
      randomUUID(),
      permissionCreateInput.name,
      permissionCreateInput.action,
      permissionCreateInput.resource,
      permissionCreateInput.description,
    );
  }
}
