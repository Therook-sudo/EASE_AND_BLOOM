import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class QuizVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    if (!user.quizVerified) {
      throw new ForbiddenException({
        error: 'QUIZ_VERIFICATION_REQUIRED',
        message: 'Please complete the brief "This-or-That" verification quiz to participate in community discussions.',
      });
    }

    return true;
  }
}
