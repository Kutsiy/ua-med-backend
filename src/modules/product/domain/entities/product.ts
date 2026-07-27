import { randomUUID } from 'crypto';

export interface IProductCreateProps {
  name: string;
  tradeName: string;
  internationalName: string;
  description: string | null;
  prescriptionRequired: boolean;
  atcCode: string | null;
  registrationNumber: string | null;
  registrationDate: Date | null;
  manufacturerId: string | null;
  categoryId: string | null;
}

export class ProductEntity {
  private constructor(
    private readonly _id: string,

    private _name: string,
    private _tradeName: string,
    private _internationalName: string,

    private _description: string | null,

    private _prescriptionRequired: boolean,

    private _atcCode: string | null,
    private _registrationNumber: string | null,
    private _registrationDate: Date | null,

    private readonly _manufacturerId: string | null,

    private readonly _categoryId: string | null,

    private readonly _createdAt: Date,
    private _updatedAt: Date | null,
  ) {}

  public get updatedAt(): Date | null {
    return this._updatedAt;
  }
  public set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  public get registrationDate(): Date | null {
    return this._registrationDate;
  }
  public set registrationDate(value: Date | null) {
    this._registrationDate = value;
  }

  public get registrationNumber(): string | null {
    return this._registrationNumber;
  }
  public set registrationNumber(value: string | null) {
    this._registrationNumber = value;
  }

  public get atcCode(): string | null {
    return this._atcCode;
  }
  public set atcCode(value: string | null) {
    this._atcCode = value;
  }

  public get description(): string | null {
    return this._description;
  }
  public set description(value: string | null) {
    this._description = value;
  }

  public get prescriptionRequired(): boolean {
    return this._prescriptionRequired;
  }
  public set prescriptionRequired(value: boolean) {
    this._prescriptionRequired = value;
  }

  public get internationalName(): string {
    return this._internationalName;
  }
  public set internationalName(value: string) {
    this._internationalName = value;
  }

  public get tradeName(): string {
    return this._tradeName;
  }
  public set tradeName(value: string) {
    this._tradeName = value;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  static create({
    name,
    tradeName,
    internationalName,
    description,
    prescriptionRequired,
    atcCode,
    registrationNumber,
    registrationDate,
    manufacturerId,
    categoryId,
  }: IProductCreateProps) {
    return new ProductEntity(
      randomUUID(),
      name,
      tradeName,
      internationalName,
      description,
      prescriptionRequired,
      atcCode,
      registrationNumber,
      registrationDate,
      manufacturerId,
      categoryId,
      new Date(),
      null,
    );
  }
}
