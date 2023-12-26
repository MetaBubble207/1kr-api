import { BaseEvent } from '../../core/common/base.event';

export class CreateCourseEvent extends BaseEvent {
    courseId: string;
}

export class PublishCourseEvent extends CreateCourseEvent {}

export class DeleteCourseEvent extends CreateCourseEvent {}
