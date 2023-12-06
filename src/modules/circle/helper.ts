import { RouteOption, TagOption } from '../restful/types';

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
