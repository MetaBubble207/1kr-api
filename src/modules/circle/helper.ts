import { RouteOption, TagOption } from '../restful/types';

import { CircleFeeType } from './circle.constant';

import * as controllers from './controllers';

export const createCircleApi = () => {
    const routes: Record<'app', RouteOption[]> = {
        app: [
            {
                name: 'app.circle',
                path: '',
                controllers: Object.values(controllers),
            },
        ],
    };
    const tags: Record<'app', (string | TagOption)[]> = {
        app: [{ name: '圈子', description: '圈子相关接口' }],
    };
    return { routes, tags };
};

export const getVipTime = (type: CircleFeeType) => {
    switch (type) {
        case CircleFeeType.Month:
            return 86400 * 30;
        case CircleFeeType.Quarter:
            return 86400 * 30 * 3;
        case CircleFeeType.Year:
            return 86400 * 365;
        case CircleFeeType.Forever:
        default:
            return Number.MAX_SAFE_INTEGER;
    }
};
