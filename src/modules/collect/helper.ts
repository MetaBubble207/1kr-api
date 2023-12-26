import { RouteOption, TagOption } from '../restful/types';

import { CollectController } from './collect.controller';

export const createCollectApi = () => {
    const routes: Record<'app', RouteOption[]> = {
        app: [
            {
                name: 'app.collect',
                path: '',
                controllers: [CollectController],
            },
        ],
    };
    const tags: Record<'app', (string | TagOption)[]> = {
        app: [{ name: '收藏夹', description: '收藏夹相关接口' }],
    };
    return { routes, tags };
};
