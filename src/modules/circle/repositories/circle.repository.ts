import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { SocialCircleEntity } from '../entities';

@CustomRepository(SocialCircleEntity)
export class CircleRepository extends BaseRepository<SocialCircleEntity> {
    protected _qbName = 'circle';

    buildBaseQB() {
        return this.createQueryBuilder('circle').leftJoinAndSelect('circle.user', 'user');
    }
}
