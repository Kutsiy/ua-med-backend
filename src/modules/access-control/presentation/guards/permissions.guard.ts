import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppAbility, CaslAbilityFactory } from '../../services';
import { Reflector } from '@nestjs/core';
import { CHECK_PERMISSIONS_KEY, PermissionHandler } from '../decorators';
import { FastifyRequest } from 'fastify';
import { RolePermissionService } from '@modules/access-control/services';
import { GqlExecutionContext } from '@nestjs/graphql';

type RequestWithUser = FastifyRequest & {
  user?: {
    id: string;
  };
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PermissionHandler[]>(CHECK_PERMISSIONS_KEY, context.getHandler()) || [];

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{ req: RequestWithUser }>().req;

    const user = req.user;

    if (!user || !user.id) {
      return false;
    }

    const userPermissions = await this.rolePermissionService.getPermissionsByUserId(user.id);

    const ability = this.caslAbilityFactory.defineAbility(userPermissions);

    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
  }

  private execPolicyHandler(handler: PermissionHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
