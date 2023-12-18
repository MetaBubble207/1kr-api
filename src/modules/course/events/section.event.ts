import { BaseEvent } from "../../core/common/base.event";

export class CreateSectionEvent extends BaseEvent {
    sectionId: string;
}

export class PublishSectionEvent extends CreateSectionEvent {}

export class DeleteSectionEvent extends CreateSectionEvent {}