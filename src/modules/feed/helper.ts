import { RouteOption, TagOption } from '../restful/types';

import { FeedController } from './feed.controller';

export const createFeedApi = () => {
    const routes: Record<'app', RouteOption[]> = {
        app: [
            {
                name: 'app.feed',
                path: '',
                controllers: [FeedController],
            },
        ],
    };
    const tags: Record<'app', (string | TagOption)[]> = {
        app: [{ name: '关注动态', description: '关注动态相关接口' }],
    };
    return { routes, tags };
};
