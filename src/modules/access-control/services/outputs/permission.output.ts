export interface IPermissionOutput {
  id: string;
  name: string;
  action: string;
  resource: string;
  description: string | null;
}
