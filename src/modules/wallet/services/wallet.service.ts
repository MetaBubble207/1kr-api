import { Injectable } from '@nestjs/common';

import { SocialCircleEntity } from '../../circle/entities';
import { UserEntity } from '../../user/entities';

@Injectable()
export class WalletService {
    async rechargeAndJoinCircle(user: UserEntity, circle: SocialCircleEntity, amount: number) {
        console.log(1);
    }
}
